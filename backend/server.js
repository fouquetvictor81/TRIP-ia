const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/generate", async (req, res) => {
  const tripPrompt = req.body.trip;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Génère un itinéraire de voyage pour : "${tripPrompt}". 
          Réponds UNIQUEMENT avec un objet JSON pur (sans texte autour, pas de balises markdown) suivant cette structure :
          {
            "trip": "Titre du voyage",
            "days": [
              { "day": 1, "title": "Titre du jour", "activities": ["Activité 1", "Activité 2"] }
            ]
          }`
        }
      ],
      max_tokens: 1024,
    });

    let text = completion.choices[0].message.content;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const itinerary = JSON.parse(text);
    res.json(itinerary);

  } catch (error) {
    console.error("Erreur détaillée de l'IA :", error);
    res.status(500).json({ error: "L'IA n'a pas pu générer le voyage." });
  }
});

app.listen(3001, () => {
  console.log("✅ Serveur TRIPia lancé sur http://localhost:3001");
});
