const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const RAPID_API_KEY = process.env.RAPID_API_KEY;


/* -----------------------------
   FONCTION RECHERCHE HOTELS
----------------------------- */
async function getHotels(city, checkIn, checkOut) {
  const formattedCity = encodeURIComponent(city);
  
  // Dates par défaut : aujourd'hui + 1 jour si pas de dates
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
   ROUTE GENERATION VOYAGE
----------------------------- */
app.post("/generate", async (req, res) => {

  const tripPrompt = req.body.trip;

  try {

    const completion = await client.chat.completions.create({

      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "Tu es un Travel Planner de luxe. Tu réponds UNIQUEMENT en JSON."
        },
        {
          role: "user",
          content: `Crée un itinéraire de rêve pour : "${tripPrompt}".

STRUCTURE JSON STRICTE :

{
 "trip": "Titre prestigieux",
 "days": [
  {
   "day": 1,
   "title": "Nom de la ville",
   "image_search_term": "mot-clé précis en anglais",
   "activities": ["Description riche 1", "Description riche 2"],
   "estimated_budget": "Prix en €"
  }
 ]
}`
        }
      ],

      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000
    });


    let itinerary = JSON.parse(
      completion.choices[0].message.content
    );


    /* -----------------------------
       RECUPERATION IMAGES + HOTELS
    ----------------------------- */

    for (let day of itinerary.days) {

      // IMAGE UNSPLASH
      try {

        const imgRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            day.image_search_term
          )}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );

        const imgData = await imgRes.json();

        day.image_url =
          imgData.results[0]?.urls?.regular ||
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828";

      } catch (imgErr) {

        day.image_url =
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828";

      }


      // HOTELS
     day.hotels = await getHotels(day.title, day.check_in, day.check_out);

    }


    res.json(itinerary);

  } catch (error) {

    console.error("Erreur détaillée :", error);

    res.status(500).json({
      error: "L'IA a rencontré un problème."
    });

  }

});


/* -----------------------------
   LANCEMENT SERVEUR
----------------------------- */

app.listen(3001, () => {
  console.log("✅ Serveur TRIPia lancé sur http://localhost:3001");
});