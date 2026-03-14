import "./App.css";
import { useState } from "react";
// Assure-toi que ton logo est bien dans src/assets/logo-fox.png
import logoFox from "./assets/logo-fox.png"; 

function App() {
  const [trip, setTrip] = useState(""); 
  const [itinerary, setItinerary] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const generateTrip = async () => {
    if (!trip) return;
    setLoading(true);
    setItinerary(null);

    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trip: trip }),
      });

      if (!response.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await response.json();
      setItinerary(data); 
    } catch (error) {
      console.error("Erreur lors de la génération :", error);
      alert("Erreur : Assure-toi que ton serveur backend est lancé sur le port 3001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {/* ── 1. LA PETITE BANDE VERTE TOUT EN HAUT ── */}
      <div className="topbar">tripia26@outlook.fr</div>

      {/* ── 2. LE HEADER (FOND BLANC, ÉCRITURES VERTES) ── */}
      <header className="header">
        <div className="logo">
          <img src={logoFox} alt="Logo Tripia" className="logo-icon" />
          <div className="logo-text-wrap">
            {/* Le span permet de mettre "IA" en noir via le CSS */}
            <div className="logo-name">TRIP<span>IA</span></div>
            <div className="logo-tagline">Votre voyage, pensé selon vos envies.</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#">ALBUM</a>
          <a href="#">PLANNING</a>
          <a href="#">RÉSERVATION</a>
          <a href="#">SUGGESTION</a>
        </nav>
      </header>

      {/* ── 3. HERO (GRILLE + RECHERCHE) ── */}
      <section className="hero">
        <div className="hero-grid">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`p${i + 1}`}></div>
          ))}
        </div>

        <div className="search-wrap">
          <input
            type="text"
            placeholder="Écrivez votre voyage..."
            value={trip}
            onChange={(e) => setTrip(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateTrip()}
          />

          <button className="search-button" onClick={generateTrip} disabled={loading}>
            {loading ? "..." : "🔍"}
          </button>
        </div>
      </section>


      {/* ── 4. RÉSULTATS DE L'IA ── */}
      <section className="result">

        {loading && (
          <div className="loading-state">
            L'intelligence artificielle prépare votre itinéraire...
          </div>
        )}

        {itinerary && (
          <>
            <div className="prompt">
              <span className="prompt-q">🔍</span>
              <p>{itinerary.trip}</p>
              <span className="prompt-mic">🎤</span>
            </div>

            <div className="itinerary">

              {itinerary.days.map((item, index) => (
                <div className="day-block" key={index}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="day-image"
                    />
                  )}

                  {/* TITRE */}
                  <h3>
                    Jour {item.day} — {item.title}
                  </h3>

                  {/* BUDGET */}
                  {item.estimated_budget && (
                    <div className="budget-badge">
                      💰 Budget estimé : {item.estimated_budget}
                    </div>
                  )}

                  {/* ACTIVITES */}
                  <ul>
                    {item.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>

                  {/* HOTELS */}
                  {item.hotels && (
                    <div className="hotels">

                      {item.hotels.map((hotel, i) => (

                        <div key={i} className="hotel-card">

                          <a href={hotel.link} target="_blank" rel="noreferrer">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="hotel-img"
                            />
                          </a>

                          <p>{hotel.name}</p>
                          <p>{hotel.price} € / nuit</p>

                        </div>

                      ))}

                    </div>
                  )}

                </div>
              ))}

            </div>
          </>
        )}

      </section>

    </div>
  );
}

export default App;