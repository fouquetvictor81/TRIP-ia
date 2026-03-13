const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const path = require("path");

// 1. CONFIGURATION DES CLÉS (dotenv)
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("--- VÉRIFICATION ---");
console.log("Clé Groq détectée :", process.env.GROQ_API_KEY ? "OUI ✅" : "NON ❌");
console.log("--------------------");

// 2. INITIALISATION DE L'APP
const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// 3. LA ROUTE POUR GÉNÉRER LE VOYAGE
app.post("/generate", async (req, res) => {
  const tripPrompt = req.body.trip;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Tu es un Travel Planner de luxe. Réponds UNIQUEMENT en JSON."
        },
        {
          role: "user",
          content: `Crée un itinéraire pour : "${tripPrompt}".
          STRUCTURE JSON :
          {
            "trip": "Titre",
            "days": [
              { 
                "day": 1, 
                "title": "Titre du jour", 
                "image_search_term": "mot-clé anglais",
                "activities": ["Activité 1", "Activité 2"],
                "estimated_budget": "Prix en €"
              }
            ]
          }`
        }
      ],
      response_format: { type: "json_object" }
    });

    let itinerary = JSON.parse(completion.choices[0].message.content);

    for (let day of itinerary.days) {
      try {
        const imgRes = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(day.image_search_term)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        const imgData = await imgRes.json();
        day.image_url = imgData.results[0]?.urls?.regular || "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      } catch (err) {
        day.image_url = "https://images.unsplash.com/photo-1488646953014-85cb44e25828";
      }
    }

    res.json(itinerary);
  } catch (error) {
    console.error("Erreur serveur:", error);
    res.status(500).json({ error: "Erreur lors de la génération." });
  }
});

// 4. LANCEMENT DU SERVEUR
app.listen(3001, () => {
  console.log("✅ Serveur TRIPia lancé sur http://localhost:3001");
});