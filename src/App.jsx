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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ trip: trip })
      });

      if (!response.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await response.json();
      setItinerary(data);

    } catch (error) {
      console.error("Erreur lors de la génération :", error);
      alert("Erreur : vérifie que ton backend tourne sur le port 3001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* TOPBAR */}
      <div className="topbar">TRIPia76@outlook.fr</div>

      {/* ── 2. LE HEADER (FOND BLANC, ÉCRITURES VERTES) ── */}
      <header className="header">
        <div className="logo">

          <svg
            className="logo-icon"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="30" cy="38" rx="22" ry="13" fill="#e8e830" opacity="0.3"/>
            <circle cx="30" cy="26" r="18" fill="#f5f5dc" stroke="#b4b100" strokeWidth="2"/>
            <ellipse cx="30" cy="26" rx="10" ry="18" stroke="#b4b100" strokeWidth="1.5" fill="none"/>
            <line x1="12" y1="26" x2="48" y2="26" stroke="#b4b100" strokeWidth="1.5"/>
            <line x1="30" y1="8" x2="30" y2="44" stroke="#b4b100" strokeWidth="1.5"/>
            <circle cx="30" cy="26" r="3" fill="#b4b100"/>
            <ellipse cx="14" cy="40" rx="5" ry="3" fill="#b4b100" transform="rotate(-20 14 40)"/>
            <ellipse cx="46" cy="40" rx="5" ry="3" fill="#b4b100" transform="rotate(20 46 40)"/>
            <ellipse cx="10" cy="32" rx="5" ry="3" fill="#b4b100" transform="rotate(-30 10 32)"/>
            <ellipse cx="50" cy="32" rx="5" ry="3" fill="#b4b100" transform="rotate(30 50 32)"/>
            <ellipse cx="30" cy="50" rx="5" ry="2.5" fill="#b4b100"/>
          </svg>

          <div className="logo-text-wrap">
            <div className="logo-name">
              TRIP<span>ia</span>
            </div>
            <div className="logo-tagline">
              Votre voyage, pensé selon vos envies.
            </div>
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

          <button
            className="search-button"
            onClick={generateTrip}
            disabled={loading}
          >
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