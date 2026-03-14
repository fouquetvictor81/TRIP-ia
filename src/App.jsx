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
    setItinerary(null); // On réinitialise pour relancer les animations
    try {
      const response = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: trip }),
      });
      const data = await response.json();
      setItinerary(data); 
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Erreur : vérifie que le backend tourne sur le port 3001.");
    } finally {
      setLoading(false);
    }
  };

  // Gestion des animations au scroll (Intersection Observer)
  useEffect(() => {
    if (itinerary) {
      const timer = setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("visible");
              } else {
                entry.target.classList.remove("visible");
              }
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        // On cible les cartes pour l'animation
        const cards = document.querySelectorAll(".day-card-white");
        cards.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [itinerary]);

  const handleModify = () => {
    setItinerary(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="App">
      {/* TOPBAR */}
      <div className="topbar">
        <span className="mail-text">tripia26@outlook.fr</span>
      </div>

      {/* HEADER */}
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

      {/* HERO SECTION */}
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
            {loading ? "⏳" : "🔍"}
          </button>
        </div>
      </section>

      {/* RÉSULTATS */}
      {(itinerary || loading) && (
        <section className="result-page-final" ref={resultRef}>
          
          {/* BULLE DE RAPPEL DE LA RECHERCHE */}
          <div className="prompt-bubble-final">
            <span className="bubble-icon">🔍</span>
            <div className="bubble-content">
              {loading ? "GÉNÉRATION EN COURS..." : trip.toUpperCase()}
            </div>
            <span className="bubble-icon">🎤</span>
          </div>

          {loading && (
            <div className="loading-state">
              ✈️ L'intelligence artificielle prépare votre itinéraire...
            </div>
          )}

          {itinerary && (
            <div className="itinerary-column" key={JSON.stringify(itinerary)}>
              {itinerary.days.map((item, index) => (
                <div key={index} className="day-wrapper">
                  
                  {/* CARTE BLANCHE DU JOUR */}
                  <div className="day-card-white">
                    
                    {/* IMAGE PRINCIPALE DU JOUR */}
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title} className="day-image-main" />
                    )}

                    <div className="day-body-content">
                      
                      <div className="day-header-flex">
                        <h2>Jour {item.day} — {item.title}</h2>
                        <div className="header-right">
                            {item.estimated_budget && (
                              <span className="budget-tag">💰 {item.estimated_budget}</span>
                            )}
                            <button className="mod-btn-gray" onClick={handleModify}>MODIFIER</button>
                        </div>
                      </div>

                      {item.description && <p className="day-desc-long">{item.description}</p>}
                      
                      <div className="content-split">
                          <div className="activities-part">
                              <h3>Activités recommandées :</h3>
                              <ul className="activity-list-final">
                                {item.activities.map((act, i) => (
                                  <li key={i}>{act}</li>
                                ))}
                              </ul>
                          </div>

                          {item.pro_tip && (
                              <div className="expert-tip">
                                  <strong>💡 CONSEIL D'EXPERT</strong>
                                  <p>{item.pro_tip}</p>
                              </div>
                          )}
                      </div>

                      {/* SECTION SUGGESTIONS HÔTELS / RESTOS */}
                      {item.hotels && item.hotels.length > 0 && (
                        <div className="suggestion-section">
                          <h3 className="suggestion-title">🏨 Suggestions de séjour</h3>
                          <div className="suggestion-row">
                            {item.hotels.map((hotel, i) => (
                              <a key={i} href={hotel.link} target="_blank" rel="noreferrer" className="hotel-card">
                                <img src={hotel.image} alt={hotel.name} className="hotel-img" />
                                <div className="hotel-info">
                                  <div className="hotel-label">Hébergement</div>
                                  <div className="hotel-name">{hotel.name}</div>
                                  <div className="hotel-price">{hotel.price}</div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TRAJET INTERACTIF ENTRE LES JOURS */}
                  {item.travel && (
                    <div className="travel-arrow">
                      <div className="travel-line"></div>
                      <div className="travel-info">
          🚗                {item.travel.from || "Départ"} → {item.travel.to || "Arrivée"} 
                                &nbsp;|&nbsp;
                        ⏱ {item.travel.duration_h || item.travel.duration || item.travel.temps || "?"} de trajet
                      </div>
                      <div className="travel-line"></div>
                  </div>
                )}

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