const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const path = require("path");
require("dotenv").config();



const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Clés API
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const apiKey = process.env.ORS_API_KEY;


/* -----------------------------
   FONCTION RECHERCHE HOTELS
----------------------------- */

async function getHotels(city, checkIn, checkOut) {

  const formattedCity = encodeURIComponent(city);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const cin = checkIn || today.toISOString().split("T")[0];
  const cout = checkOut || tomorrow.toISOString().split("T")[0];

  return [
    {
      name: `Booking.com — ${city}`,
      price: "Voir les prix",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      link: `https://www.booking.com/search.html?ss=${formattedCity}&checkin=${cin}&checkout=${cout}`
    },
    {
      name: `Airbnb — ${city}`,
      price: "Voir les prix",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      link: `https://www.airbnb.fr/s/${formattedCity}/homes?checkin=${cin}&checkout=${cout}`
    },
    {
      name: `Hotels.com — ${city}`,
      price: "Voir les prix",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
      link: `https://www.hotels.com/search.do?q-destination=${formattedCity}&q-check-in-date=${cin}&q-check-out-date=${cout}`
    }
  ];
}


/* -----------------------------
   GEOCODAGE VILLE
----------------------------- */

async function geocodeCity(city) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
    { headers: { "User-Agent": "TRIPia-app" } }
  );
  const data = await response.json();
  if (!data || data.length === 0) throw new Error("Ville introuvable : " + city);
  return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
}


/* -----------------------------
   CALCUL TRAJET
----------------------------- */

async function getRoute(start, end) {
  // Calcul distance à vol d'oiseau (formule Haversine)
  const R = 6371; // rayon terre en km
  const dLat = (end[1] - start[1]) * Math.PI / 180;
  const dLon = (end[0] - start[0]) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(start[1] * Math.PI / 180) *
    Math.cos(end[1] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // en mètres

  // Estimation durée : 80km/h de moyenne
  const duration = (distance / 1000 / 80) * 3600;

  return { distance, duration };
}


/* -----------------------------
   ROUTE GENERATION VOYAGE
----------------------------- */

app.post("/generate", async (req, res) => {

console.log("🔥 ROUTE /generate appelée");
  

  const tripPrompt = req.body.trip;

  try {

    const completion = await client.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: "Tu es un Travel Planner de luxe. Tu réponds UNIQUEMENT en JSON."
        },
        {
          role: "user",
          content: `Crée un itinéraire pour : "${tripPrompt}".

RÈGLES IMPORTANTES :
- Les villes doivent être PROCHES géographiquement, dans un ordre logique de déplacement
- Ne pas faire des allers-retours inutiles
- Grouper les jours par zones géographiques proches
- Maximum 200km entre deux villes consécutives
- Privilégier les trajets en voiture ou train raisonnables (moins de 3h)

{
 "trip": "Titre",
 "days": [
  {
   "day": 1,
   "title": "Ville",
   "image_search_term": "keyword",
   "activities": ["activité1","activité2"],
   "estimated_budget": "prix"
  }
 ]
}`}
      ],

      response_format: { type: "json_object" },
      temperature: 0.7
    });

    let itinerary = JSON.parse(completion.choices[0].message.content);

    console.log("Itinerary généré :", itinerary.trip);


    /* -----------------------------
       IMAGES + HOTELS
    ----------------------------- */

    for (let day of itinerary.days) {

      try {

        const imgRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(day.image_search_term)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        const imgData = await imgRes.json();

        day.image_url =
          imgData.results[0]?.urls?.regular ||
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828";

      } catch {

        day.image_url = "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      }

      day.hotels = await getHotels(day.title);

    }


    /* -----------------------------
       CALCUL DES TRAJETS
    ----------------------------- */

   console.log("Calcul des trajets...");

  for (let i = 0; i < itinerary.days.length - 1; i++) {

    const currentCity = itinerary.days[i].title;
    const nextCity = itinerary.days[i + 1].title;

    console.log(currentCity, "→", nextCity);

  const startCoords = await geocodeCity(currentCity);
  const endCoords = await geocodeCity(nextCity);

  const route = await getRoute(startCoords, endCoords);

  const totalMinutes = Math.round(route.duration / 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let formattedDuration;

  if (hours > 0) {
    formattedDuration = `${hours}h ${minutes}min`;
  } else {
    formattedDuration = `${minutes} min`;
  }

  itinerary.days[i].travel = {
    from: currentCity,
    to: nextCity,
    distance_km: (route.distance / 1000).toFixed(0),
    duration: formattedDuration
  };

  }
    console.log("Résultat final :", JSON.stringify(itinerary, null, 2));

    res.json(itinerary);

  } catch (error) {

    console.error("Erreur :", error);

    res.status(500).json({
      error: "Erreur génération voyage"
    });

  }

});


/* -----------------------------
   LANCEMENT SERVEUR
----------------------------- */

app.listen(3001, () => {
  console.log("✅ Serveur TRIPia lancé sur http://localhost:3001");
});