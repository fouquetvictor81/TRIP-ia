import "./App.css";
import { useState, useRef, useEffect } from "react";
import logoFox from "./assets/logo-fox.png"; 

function App() {
  const [trip, setTrip] = useState(""); 
  const [itinerary, setItinerary] = useState(null); 
  const [loading, setLoading] = useState(false);
  const resultRef = useRef(null);

  const generateTrip = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: trip }),
      });
      const data = await response.json();
      setItinerary(data); 
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itinerary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [itinerary]);

  return (
    <div className="App">
      {/* ── TOPBAR AVEC MAIL EN BLANC ── */}
      <div className="topbar">
        <span className="mail-text">tripia26@outlook.fr</span>
      </div>

      {/* ── HEADER STYLE PHOTO 3 ── */}
      <header className="header">
        <div className="logo-section">
          <img src={logoFox} alt="Logo" className="logo-icon" />
          <div className="logo-text-group">
            <div className="logo-brand">
              <span className="brand-green">TRIP</span>
              <span className="brand-dark">IA</span>
            </div>
            <div className="logo-tagline">Votre voyage, pensé selon vos envies.</div>
          </div>
        </div>
        <nav className="nav">
          <a href="#">ALBUM</a>
          <a href="#">PLANNING</a>
          <a href="#">RÉSERVATION</a>
        </nav>
      </header>

      {/* ── SECTION ACCUEIL ── */}
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
          <button className="search-button" onClick={generateTrip}>
            {loading ? "..." : "🔍"}
          </button>
        </div>
      </section>

      {/* ── SECTION RÉSULTATS ── */}
      {(itinerary || loading) && (
        <section className="result-page" ref={resultRef}>
          <div className="prompt-bubble">
            <span className="bubble-icon">🔍</span>
            <div className="bubble-content">
              {loading ? "GÉNÉRATION EN COURS..." : trip.toUpperCase()}
            </div>
            <span className="bubble-icon">🎤</span>
          </div>

          {itinerary && (
            <div className="itinerary-grid">
              {itinerary.days.map((item, index) => (
                <div className="day-card" key={index}>
                  <div className="day-header">
                    <h2>Jour {item.day} — {item.title}</h2>
                    <button className="mod-btn" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                      MODIFIER
                    </button>
                  </div>
                  <ul className="activities">
                    {item.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                  <div className="day-photos">
                    <div className="photo-item">
                      <img src={`https://loremflickr.com/400/300/hotel,resort?lock=${index}`} alt="H" />
                      <span>HÔTEL</span>
                    </div>
                    <div className="photo-item">
                      <img src={`https://loremflickr.com/400/300/landmark,architecture?lock=${index + 10}`} alt="A" />
                      <span>ACTIVITÉ</span>
                    </div>
                    <div className="photo-item">
                      <img src={`https://loremflickr.com/400/300/food,dish?lock=${index + 20}`} alt="R" />
                      <span>RESTAURATION</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;