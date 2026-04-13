const express = require("express");
const cors    = require("cors");
const Groq    = require("groq-sdk");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;


/* -----------------------------
CONNEXION MONGODB
----------------------------- */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB :", err));


/* -----------------------------
SCHEMAS
----------------------------- */

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  trips:     { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);


/* -----------------------------
MIDDLEWARE AUTH
----------------------------- */

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Non autorisé" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
}


/* -----------------------------
ROUTE — INSCRIPTION
----------------------------- */

app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Tous les champs sont requis" });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email déjà utilisé" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, name: user.name });

  } catch (err) {
    res.status(500).json({ error: "Erreur inscription" });
  }
});


/* -----------------------------
ROUTE — CONNEXION
----------------------------- */

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email ou mot de passe incorrect" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Email ou mot de passe incorrect" });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, name: user.name });

  } catch (err) {
    res.status(500).json({ error: "Erreur connexion" });
  }
});


/* -----------------------------
ROUTE — SAUVEGARDER UN VOYAGE
----------------------------- */

app.post("/trips/save", authMiddleware, async (req, res) => {
  const { trip } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { trips: { ...trip, savedAt: new Date() } }
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Erreur sauvegarde" });
  }
});


/* -----------------------------
ROUTE — MES VOYAGES
----------------------------- */

app.get("/trips/mine", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("trips name");
    res.json(user);
  } catch {
    res.status(500).json({ error: "Erreur récupération" });
  }
});


/* -----------------------------
HOTELS — GOOGLE PLACES API
----------------------------- */

const PRICE_LABELS = ["Gratuit", "Budget", "Milieu de gamme", "Confort", "Luxe"];

/* Suit le redirect Places Photo → renvoie l'URL CDN sans clé API */
async function resolvePlacePhotoUrl(photoRef, key) {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${photoRef}&key=${key}`;
  try {
    const res = await fetch(url);
    return res.url; // URL finale après redirect (lh3.googleusercontent.com)
  } catch {
    return null;
  }
}

async function getHotelsFromPlaces(city) {

  const key = process.env.GOOGLE_PLACES_API_KEY;

  /* ─ Fallback si pas de clé ─ */
  if (!key) return getHotelsFallback(city);

  try {
    const searchRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotels+in+${encodeURIComponent(city)}&type=lodging&language=fr&key=${key}`
    );
    const searchData = await searchRes.json();

    if (!searchData.results?.length) return getHotelsFallback(city);

    /* Prend les 3 meilleurs hôtels (triés par pertinence par Google) */
    const top3 = searchData.results.slice(0, 3);

    const hotels = await Promise.all(top3.map(async (place) => {

      /* Photo réelle */
      let image = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";
      if (place.photos?.[0]?.photo_reference) {
        const resolved = await resolvePlacePhotoUrl(place.photos[0].photo_reference, key);
        if (resolved) image = resolved;
      }

      /* Prix */
      const price = place.price_level != null
        ? PRICE_LABELS[place.price_level]
        : "Prix non renseigné";

      /* Lien Google Maps (affiche infos, avis, site officiel) */
      const link = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;

      return {
        name:   place.name,
        rating: place.rating ? `${place.rating} / 5` : null,
        price,
        image,
        link
      };

    }));

    return hotels;

  } catch (err) {
    console.error("Google Places error:", err.message);
    return getHotelsFallback(city);
  }

}

/* Fallback si Google Places indisponible */
function getHotelsFallback(city) {
  const f = encodeURIComponent(city);
  return [
    {
      name: "Booking.com",
      price: "Voir les prix",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
      link: `https://www.booking.com/search.html?ss=${f}`
    },
    {
      name: "Airbnb",
      price: "Voir les prix",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600",
      link: `https://www.airbnb.fr/s/${f}/homes`
    },
    {
      name: "Hostelworld",
      price: "Budget",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600",
      link: `https://www.hostelworld.com/st/hostels/${f}`
    }
  ];
}


/* -----------------------------
LIENS VOLS
----------------------------- */

function getFlightLinks(from, to) {

  const fromEnc = encodeURIComponent(from);
  const toEnc   = encodeURIComponent(to);

  return [
    {
      name: "Google Flights",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400",
      link: `https://www.google.com/travel/flights?hl=fr&q=vols+${fromEnc}+vers+${toEnc}`
    },
    {
      name: "Skyscanner",
      image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400",
      link: `https://www.skyscanner.fr/transport/vols/${fromEnc}/${toEnc}/`
    },
    {
      name: "Kayak",
      image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400",
      link: `https://www.kayak.fr/flights/${fromEnc}-${toEnc}`
    }
  ];

}


/* -----------------------------
GEOCODAGE
----------------------------- */

async function geocodeCity(city) {

  try {

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { "User-Agent": "TRIPia-app" } }
    );

    const data = await response.json();

    if (!data.length) return null;

    return [
      parseFloat(data[0].lon),
      parseFloat(data[0].lat)
    ];

  } catch {
    return null;
  }

}


/* -----------------------------
CALCUL DISTANCE
----------------------------- */

function getRoute(start, end) {

  const R = 6371;

  const dLat = (end[1] - start[1]) * Math.PI / 180;
  const dLon = (end[0] - start[0]) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start[1] * Math.PI / 180) *
    Math.cos(end[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c * 1000;
  const duration = (distance / 1000 / 80) * 3600;

  return { distance, duration };

}


/* -----------------------------
PROMPT IA
----------------------------- */

const SYSTEM_PROMPT = `Tu es un expert travel planner et agent de voyage professionnel avec 20 ans d'expérience.
Tu crées des itinéraires INTELLIGENTS, LOGISTIQUEMENT COHÉRENTS et adaptés au budget du voyageur.

RÈGLES IMPÉRATIVES :
• ORDRE GÉOGRAPHIQUE : Ordonne toujours les villes logiquement pour éviter les allers-retours inutiles (ex: Paris→Lyon→Marseille, JAMAIS Paris→Marseille→Lyon)
• VOLS : Si le voyage nécessite un déplacement long (>500km ou frontière), inclus le vol dans flight_info avec aéroports, durée, prix estimé et compagnies recommandées
• BUDGET RÉALISTE : Décompose TOUT le budget (vol aller-retour, hébergement/nuit × nombre de nuits, repas/jour × jours, activités, transports locaux). Assure-toi que le total correspond au budget demandé
• ADAPTATION AU BUDGET : Budget <50€/jour = auberges/hostels, street food, transports en commun. Budget 50-100€/jour = hôtels 2-3★, restaurants midi. Budget >100€/jour = hôtels 3-4★, restaurants, taxis
• TIMING RÉALISTE : Si vol le matin → arrivée vers 14h → le jour 1 commence l'après-midi. Tiens compte des horaires
• NOMS PRÉCIS : Cite TOUJOURS les vrais noms des lieux (ex: "Mosquée Koutoubia" et non "grande mosquée")
• TRANSPORT INTER-VILLES : Pour chaque changement de ville, indique le transport optimal (vol/train/bus/voiture) avec détails et coût estimé
• CONSEILS LOCAUX : Monnaie avec taux, pourboires locaux, applications utiles, mots utiles dans la langue locale

Réponds UNIQUEMENT en JSON valide, sans markdown, sans texte avant ou après.`;


/* -----------------------------
GENERATION VOYAGE
----------------------------- */

app.post("/generate", async (req, res) => {

  const tripPrompt = req.body.trip;

  try {

    const completion = await client.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `Crée un itinéraire de voyage complet et intelligent pour : "${tripPrompt}"

Utilise EXACTEMENT cette structure JSON :

{
  "trip": "Titre accrocheur du voyage",
  "origin": "Ville de départ (déduis si non précisé → Paris par défaut)",
  "flight_info": {
    "needed": true,
    "from": "Ville départ",
    "to": "Ville/région d'arrivée",
    "outbound": {
      "duration": "3h30",
      "estimated_price": "60-100€",
      "airlines": "Ryanair, easyJet"
    },
    "return": {
      "duration": "3h30",
      "estimated_price": "60-100€",
      "airlines": "Ryanair, easyJet"
    },
    "total_price": "120-200€ aller-retour",
    "tip": "Conseil concret pour trouver les meilleurs prix (période, sites, etc.)"
  },
  "practical_info": {
    "visa": "Requis ou non + démarches si requis",
    "currency": "Nom de la monnaie (1€ ≈ XX unités)",
    "language": "Langues principales + 3 mots utiles",
    "safety": "Niveau de sécurité général pour les touristes",
    "best_time": "Meilleure période pour visiter + pourquoi",
    "tips": "2-3 conseils pratiques essentiels séparés par des virgules"
  },
  "budget_breakdown": {
    "flights": "XXX€",
    "accommodation": "XXX€",
    "food": "XXX€",
    "activities": "XXX€",
    "local_transport": "XXX€",
    "total": "XXX€"
  },
  "days": [
    {
      "day": 1,
      "title": "Ville principale",
      "image_search_term": "terme anglais précis pour une belle photo (ex: marrakech medina souks)",
      "description": "Description engageante en 2-3 phrases qui donne envie",
      "transport_arrival": {
        "type": "vol",
        "details": "Vol Paris CDG → Marrakech RAK, 3h30, Ryanair ou easyJet",
        "estimated_cost": "100-180€"
      },
      "schedule": [
        {
          "time": "14:00",
          "activity": "Nom précis et complet de l'activité",
          "image_search_term": "mot-clé anglais précis pour trouver une belle photo (ex: koutoubia mosque marrakech)",
          "description": "Description courte et utile (pourquoi aller là, quoi voir)",
          "duration": "2h",
          "cost": "Gratuit / 15€ / 150 MAD"
        }
      ],
      "estimated_budget": "120€",
      "pro_tip": "Conseil local très spécifique et utile que seul un expert local connaît"
    }
  ],
  "packing_list": {
    "documents": ["Passeport valide 6 mois minimum", "Billet d'avion imprimé ou téléchargé", "Assurance voyage"],
    "clothes": ["Vêtements adaptés au climat et à la culture locale", "Chaussures de marche confortables"],
    "health": ["Crème solaire adaptée", "Médicaments personnels", "Trousse de premiers secours"],
    "tech": ["Adaptateur prise électrique (précise le type)", "Batterie externe", "Appareil photo ou téléphone chargé"],
    "misc": ["Monnaie locale en liquide", "Sac à dos léger pour les journées", "Cadenas"]
  }
}

IMPORTANT :
- Si le voyage ne nécessite PAS de vol (ex: voyage en France, pays frontalier proche), mets "needed": false dans flight_info
- Adapte TOUT au budget mentionné dans la demande
- Le jour 1 doit tenir compte du temps de trajet depuis l'origine
- Minimum 3 activités par jour avec des horaires réalistes
- Pro tips doivent être VRAIMENT utiles et locaux (pas des généralités)
- La packing_list doit être SPÉCIFIQUE à la destination (vêtements adaptés au climat, adaptateur selon le pays, monnaie locale précisée, etc.)`
        }
      ],

      response_format: { type: "json_object" }

    });


    /* -----------------------------
    PARSE JSON IA
    ----------------------------- */

    let itinerary;

    try {
      itinerary = JSON.parse(completion.choices[0].message.content);
    } catch {
      itinerary = { trip: "Voyage généré", days: [] };
    }

    if (!itinerary.days) itinerary.days = [];


    /* -----------------------------
    SECURISATION DU JSON
    ----------------------------- */

    for (let day of itinerary.days) {

      if (!day.schedule || !Array.isArray(day.schedule)) {
        day.schedule = [
          {
            time: "09:00",
            activity: "Exploration du centre-ville",
            description: "Découverte libre de la ville",
            duration: "3h",
            cost: "Gratuit"
          }
        ];
      }

      if (!day.image_search_term) {
        day.image_search_term = day.title + " travel";
      }

    }


    /* -----------------------------
    IMAGES (jour + activités)
    ----------------------------- */

    for (let day of itinerary.days) {

      /* --- Image hero du jour --- */
      try {
        const imgRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(day.image_search_term)}&per_page=3&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const imgData = await imgRes.json();
        const results = imgData.results || [];
        const pick = results[Math.floor(Math.random() * Math.min(results.length, 3))];
        day.image_url = pick?.urls?.regular || "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      } catch {
        day.image_url = "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      }

      /* --- Images des activités (en parallèle) --- */
      day.schedule = await Promise.all(
        day.schedule.map(async (slot) => {
          const query = slot.image_search_term || `${slot.activity} ${day.title}`;
          try {
            const imgRes = await fetch(
              `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=3&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`
            );
            const imgData = await imgRes.json();
            const results = imgData.results || [];
            const pick = results[Math.floor(Math.random() * Math.min(results.length, 3))];
            slot.image_url = pick?.urls?.small || null;
          } catch {
            slot.image_url = null;
          }
          return slot;
        })
      );

      day.hotels = await getHotelsFromPlaces(day.title);

    }


    /* -----------------------------
    LIENS VOLS
    ----------------------------- */

    if (itinerary.flight_info?.needed !== false && itinerary.flight_info?.from && itinerary.flight_info?.to) {
      itinerary.flight_links = getFlightLinks(
        itinerary.flight_info.from,
        itinerary.flight_info.to
      );
      itinerary.return_flight_links = getFlightLinks(
        itinerary.flight_info.to,
        itinerary.flight_info.from
      );
    }


    /* -----------------------------
    TRAJETS ENTRE VILLES
    ----------------------------- */

    for (let i = 0; i < itinerary.days.length - 1; i++) {

      const currentCity = itinerary.days[i].title;
      const nextCity    = itinerary.days[i + 1].title;

      if (currentCity === nextCity) continue;

      const start = await geocodeCity(currentCity);
      const end   = await geocodeCity(nextCity);

      const transportInfo = itinerary.days[i + 1].transport_arrival;

      if (start && end) {

        const route       = getRoute(start, end);
        const totalMin    = Math.round(route.duration / 60);
        const hours       = Math.floor(totalMin / 60);
        const minutes     = totalMin % 60;
        const calcDuration = hours > 0 ? `${hours}h ${minutes}min` : `${minutes} min`;

        itinerary.days[i].travel = {
          from: currentCity,
          to: nextCity,
          distance_km: (route.distance / 1000).toFixed(0),
          duration: calcDuration,
          type: transportInfo?.type || "voiture",
          details: transportInfo?.details || null,
          estimated_cost: transportInfo?.estimated_cost || null
        };

      } else if (transportInfo) {

        itinerary.days[i].travel = {
          from: currentCity,
          to: nextCity,
          distance_km: null,
          duration: null,
          type: transportInfo.type || "voiture",
          details: transportInfo.details || null,
          estimated_cost: transportInfo.estimated_cost || null
        };

      }

    }


    res.json(itinerary);

  } catch (error) {

    console.error("Erreur backend :", error);

    res.status(500).json({
      error: "Erreur génération voyage"
    });

  }

});


/* -----------------------------
SERVEUR
----------------------------- */

app.listen(3001, () => {
  console.log("Serveur lancé sur http://localhost:3001");
});
