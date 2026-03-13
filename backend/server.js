const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

// 1. ON INITIALISE D'ABORD (IMPORTANT)
const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// 2. ENSUITE ON DÉFINIT LA ROUTE
app.post("/generate", async (req, res) => {
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
          content: `Crée un itinéraire de rêve pour : "${tripPrompt}".
          STRUCTURE JSON STRICTE :
          {
            "trip": "Titre prestigieux",
            "days": [
              { 
                "day": 1, 
                "title": "Nom de l'étape", 
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
      max_tokens: 4000, 
    });

    let itinerary = JSON.parse(completion.choices[0].message.content);

    // RÉCUPÉRATION DES PHOTOS
    for (let day of itinerary.days) {
      try {
        const imgRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(day.image_search_term)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const imgData = await imgRes.json();
        day.image_url = imgData.results[0]?.urls?.regular || "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      } catch (imgErr) {
        day.image_url = "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      }
    }

    res.json(itinerary);

  } catch (error) {
    console.error("Erreur détaillée :", error);
    res.status(500).json({ error: "L'IA a rencontré un problème." });
  }
});

// 3. ON LANCE LE SERVEUR À LA FIN
app.listen(3001, () => {
  console.log("✅ Serveur TRIPia lancé sur http://localhost:3001");
});