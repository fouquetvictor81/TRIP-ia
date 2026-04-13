import "./App.css";
import { useState, useRef, useEffect } from "react";
import logoFox from "./assets/logo-fox.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

/* ── SVG Icons ─────────────────────────────────────────── */

function IconSearch({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconUser({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconPlane({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
}

function IconGlobe({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconWallet({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  );
}

function IconLuggage({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="7" width="12" height="14" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 12h12" />
    </svg>
  );
}

function IconEdit({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconSave({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

/* ── Transport SVG icon ──────────────────────────────────── */

function TransportIcon({ type, size = 20 }) {
  const t = (type || "voiture").toLowerCase().trim();
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: "1.8",
    strokeLinecap: "round", strokeLinejoin: "round"
  };

  if (t === "vol" || t === "avion") return (
    <svg {...p}>
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  );
  if (t === "train") return (
    <svg {...p}>
      <rect x="4" y="3" width="16" height="14" rx="3" />
      <path d="M4 11h16M12 3v8M8 21l4-4 4 4" />
      <circle cx="9" cy="17.5" r="1" /><circle cx="15" cy="17.5" r="1" />
    </svg>
  );
  if (t === "bus") return (
    <svg {...p}>
      <path d="M3 6h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z" />
      <path d="M3 11h18M8 6V4M16 6V4M10 18v2M14 18v2" />
      <circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" />
    </svg>
  );
  if (t === "ferry" || t === "bateau") return (
    <svg {...p}>
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 3v2" />
    </svg>
  );
  if (t === "metro" || t === "métro") return (
    <svg {...p}>
      <rect x="5" y="2" width="14" height="16" rx="4" />
      <path d="M8 2v16M16 2v16M5 9h14" />
      <circle cx="9" cy="14" r="1.5" /><circle cx="15" cy="14" r="1.5" />
    </svg>
  );
  if (t === "velo" || t === "vélo") return (
    <svg {...p}>
      <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 0 0-1-1h-2M15 6l3 11.5M15 6l-5 5-4.5 6.5M10 5l2 7H6" />
    </svg>
  );
  /* default: voiture */
  return (
    <svg {...p}>
      <path d="M5 17H3v-4l2-5h14l2 5v4h-2" />
      <path d="M5 12h14" />
      <circle cx="7.5" cy="17" r="2.5" /><circle cx="16.5" cy="17" r="2.5" />
    </svg>
  );
}


/* ── Questionnaire constants ──────────────────────────── */

const STYLE_OPTIONS = [
  { value: "culture",   label: "Culture & Histoire" },
  { value: "nature",    label: "Nature & Randonnée" },
  { value: "plage",     label: "Plage & Soleil" },
  { value: "gastro",    label: "Gastronomie" },
  { value: "nightlife", label: "Vie nocturne" },
  { value: "shopping",  label: "Shopping" },
  { value: "aventure",  label: "Sport & Aventure" },
  { value: "bienetre",  label: "Bien-être & Spa" },
];

const FOOD_OPTIONS = [
  { value: "vegetarien", label: "Végétarien" },
  { value: "vegan",      label: "Végétalien" },
  { value: "halal",      label: "Halal" },
  { value: "casher",     label: "Casher" },
  { value: "sansgluten", label: "Sans gluten" },
];

const STYLE_LABELS = Object.fromEntries(STYLE_OPTIONS.map(o => [o.value, o.label]));

const DEFAULT_ANSWERS = {
  query: "", destination: "", duration: "", budget: "", dates: "",
  travelers: "1", travelerType: "seul", hasChildren: false,
  style: [], accommodation: "flexible", pace: "equilibre",
  food: [], notes: ""
};

function extractFromQuery(q) {
  const lower = q.toLowerCase();
  let duration = "";
  const dm = lower.match(/(\d+)\s*jours?/);
  const wm = lower.match(/(\d+)\s*semaines?/);
  if (dm) duration = dm[1] + " jours";
  else if (wm) duration = (parseInt(wm[1]) * 7) + " jours";
  else if (/week[\s-]?end/.test(lower)) duration = "2 jours";

  let budget = "";
  const bm = lower.match(/(\d[\d ]*)\s*[€$]/) || lower.match(/(\d[\d ]*)\s*euro/);
  if (bm) budget = bm[1].replace(/\s/g, "") + "€";

  let travelers = "1", travelerType = "seul";
  const nm = lower.match(/(\d+)\s*(personnes?|voyageurs?)/);
  if (nm) travelers = nm[1];
  if (/\ben couple\b/.test(lower)) { travelerType = "couple"; if (!nm) travelers = "2"; }
  else if (/\ben famille\b/.test(lower)) travelerType = "famille";
  else if (/\bamis\b|\bgroupe\b/.test(lower)) travelerType = "amis";

  return { duration, budget, travelers, travelerType };
}

function buildRichPrompt(a) {
  const accoLabels = {
    budget: "hébergement budget (hostel/auberge)",
    standard: "hôtel standard 2-3 étoiles",
    confort: "hôtel confort 3-4 étoiles",
    luxe: "hôtel luxe 4-5 étoiles",
    flexible: "hébergement flexible"
  };
  const paceLabels = {
    tranquille: "rythme tranquille (2-3 activités/jour, beaucoup de temps libre)",
    equilibre: "rythme équilibré (3-4 activités/jour)",
    intense: "rythme intense (5+ activités/jour, maximum d'expériences)"
  };
  const typeLabels = { seul: "voyage solo", couple: "voyage en couple", famille: "voyage en famille", amis: "voyage entre amis" };

  const parts = [];
  if (a.query)       parts.push(`Demande initiale : "${a.query}"`);
  if (a.destination) parts.push(`Destination : ${a.destination}`);
  if (a.duration)    parts.push(`Durée : ${a.duration}`);
  if (a.budget)      parts.push(`Budget total : ${a.budget}`);
  if (a.dates)       parts.push(`Période : ${a.dates}`);
  const nb = parseInt(a.travelers) || 1;
  parts.push(`Voyageurs : ${nb} ${nb > 1 ? "personnes" : "personne"}, ${typeLabels[a.travelerType] || ""}${a.hasChildren ? ", avec enfants" : ""}`);
  if (a.style?.length)        parts.push(`Style souhaité : ${a.style.map(s => STYLE_LABELS[s]).join(", ")}`);
  if (a.accommodation && a.accommodation !== "flexible") parts.push(`Hébergement : ${accoLabels[a.accommodation]}`);
  if (a.pace && a.pace !== "equilibre") parts.push(`Rythme : ${paceLabels[a.pace]}`);
  if (a.food?.length)         parts.push(`Alimentation : ${a.food.join(", ")}`);
  if (a.notes)                parts.push(`Demandes spéciales : ${a.notes}`);
  return parts.join("\n");
}


function App() {

  const [trip,            setTrip]            = useState("");
  const [step,            setStep]            = useState("search"); // "search"|"questionnaire"|"results"
  const [answers,         setAnswers]         = useState(DEFAULT_ANSWERS);
  const [itinerary,       setItinerary]       = useState(null);
  const [loading,         setLoading]         = useState(false);
  const [refineInput,     setRefineInput]     = useState("");
  const [refining,        setRefining]        = useState(false);
  const [refineSuccess,   setRefineSuccess]   = useState(false);
  const [dayEditInputs,   setDayEditInputs]   = useState({}); // { index: string }
  const [updatingDayIdx,  setUpdatingDayIdx]  = useState(null);
  const [checkedItems,    setCheckedItems]    = useState(new Set());
  const [expandedHotels,  setExpandedHotels]  = useState(new Set());
  const [lightbox,        setLightbox]        = useState(null);

  useEffect(() => {
    const close = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const toggleHotelExpand = (dayIndex) => {
    setExpandedHotels(prev => {
      const next = new Set(prev);
      if (next.has(dayIndex)) next.delete(dayIndex);
      else next.add(dayIndex);
      return next;
    });
  };
  const [showAccount,  setShowAccount]  = useState(false);
  const [authMode,     setAuthMode]     = useState("register");
  const [authForm,     setAuthForm]     = useState({ name: "", email: "", password: "" });
  const [authError,    setAuthError]    = useState("");
  const [user,         setUser]         = useState(() => {
    const saved = localStorage.getItem("tripia_user");
    return saved ? JSON.parse(saved) : null;
  });

  const resultRef = useRef(null);

  const toggleItem = (item) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleAuth = async () => {
    setAuthError("");
    const route = authMode === "register" ? "/auth/register" : "/auth/login";
    const body  = authMode === "register"
      ? { name: authForm.name, email: authForm.email, password: authForm.password }
      : { email: authForm.email, password: authForm.password };

    try {
      const res  = await fetch(`${API}${route}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) { setAuthError(data.error); return; }

      localStorage.setItem("tripia_token", data.token);
      localStorage.setItem("tripia_user", JSON.stringify({ name: data.name }));
      setUser({ name: data.name });
      setShowAccount(false);
    } catch {
      setAuthError("Erreur de connexion au serveur");
    }
  };

  const handleSaveTrip = async () => {
    const token = localStorage.getItem("tripia_token");
    if (!token) { setShowAccount(true); return; }
    await fetch(`${API}/trips/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ trip: itinerary })
    });
    alert("Voyage sauvegardé");
  };

  const handleLogout = () => {
    localStorage.removeItem("tripia_token");
    localStorage.removeItem("tripia_user");
    setUser(null);
  };


  /* ── PASSER AU QUESTIONNAIRE ── */

  const handleSearchSubmit = () => {
    if (!trip.trim()) return;
    const extracted = extractFromQuery(trip);
    setAnswers({ ...DEFAULT_ANSWERS, ...extracted, query: trip });
    setStep("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── TOGGLE PILL (multi-select) ── */
  const togglePill = (field, value) => {
    setAnswers(a => ({
      ...a,
      [field]: a[field].includes(value)
        ? a[field].filter(v => v !== value)
        : [...a[field], value]
    }));
  };

  /* ── GÉNÉRATION DEPUIS QUESTIONNAIRE ── */

  const generateTrip = async () => {
    const richPrompt = buildRichPrompt(answers);
    if (!richPrompt.trim()) return;
    setLoading(true);
    setItinerary(null);
    setStep("results");

    try {
      const response = await fetch(`${API}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trip: richPrompt })
      });
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error("Erreur serveur:", error);
      alert("Le backend ne répond pas.");
    } finally {
      setLoading(false);
    }
  };

  /* ── AFFINER LE VOYAGE EXISTANT ── */

  const handleRefine = async () => {
    if (!refineInput.trim() || !itinerary) return;
    setRefining(true);
    try {
      const res = await fetch(`${API}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary, instruction: refineInput })
      });
      const data = await res.json();
      if (data.days) {
        setItinerary(data);
        setRefineInput("");
        setRefineSuccess(true);
        setTimeout(() => setRefineSuccess(false), 3000);
      }
    } catch { alert("Erreur lors de l'affinement."); }
    finally { setRefining(false); }
  };

  /* ── METTRE À JOUR UN JOUR ── */

  const handleUpdateDay = async (dayIndex, instruction) => {
    if (!instruction.trim()) return;
    setUpdatingDayIdx(dayIndex);
    const tripContext = { destination: answers.destination, duration: answers.duration, budget: answers.budget, style: answers.style };
    try {
      const res = await fetch(`${API}/update-day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day: itinerary.days[dayIndex], instruction, tripContext })
      });
      const data = await res.json();
      if (data.day) {
        setItinerary(prev => ({
          ...prev,
          days: prev.days.map((d, i) => i === dayIndex ? data.day : d)
        }));
        setDayEditInputs(prev => ({ ...prev, [dayIndex]: "" }));
      }
    } catch { alert("Erreur lors de la mise à jour."); }
    finally { setUpdatingDayIdx(null); }
  };


  /* ── SCROLL + ANIMATION ── */

  useEffect(() => {
    if (!itinerary) return;

    const timer = setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
          });
        },
        { threshold: 0.08 }
      );

      document.querySelectorAll(".animate-in").forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 200);

    return () => clearTimeout(timer);
  }, [itinerary]);


  const handleModify = () => {
    setItinerary(null);
    setStep("search");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  /* ── RENDER ── */

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

        {user ? (
          <div className="user-pill">
            <IconUser size={16} />
            <span>{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
          </div>
        ) : (
          <button className="account-btn" onClick={() => { setShowAccount(true); setAuthMode("register"); }}>
            <IconUser size={16} /> Créer un compte
          </button>
        )}

      </header>


      {/* HERO */}
      {step === "search" && (
      <section className="hero">

        <div className="hero-grid">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`p${i + 1}`}></div>
          ))}
        </div>

        <div className="search-wrap">
          <input
            type="text"
            placeholder="Décrivez votre voyage idéal..."
            value={trip}
            onChange={(e) => setTrip(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
          <button className="search-button" onClick={handleSearchSubmit} disabled={loading}>
            {loading ? <span className="search-loading" /> : <IconSearch size={20} />}
          </button>
        </div>

        <div className="hero-hints">
          <span>"5 jours au Maroc avec 800€"</span>
          <span>"Road trip Italie 10 jours nature et gastronomie"</span>
          <span>"Weekend à Lisbonne pas cher"</span>
        </div>

      </section>
      )}


      {/* ── QUESTIONNAIRE ── */}
      {step === "questionnaire" && (
        <section className="questionnaire-page">

          <div className="result-bg">
            <div className="result-bg-grid">{[...Array(15)].map((_, i) => <div key={i} className={`p${i+1}`}></div>)}</div>
            <div className="result-bg-overlay"></div>
          </div>

          <div className="questionnaire-wrap">

            <div className="questionnaire-top">
              <h1 className="questionnaire-title">Créez votre voyage parfait</h1>
              <p className="questionnaire-subtitle">Plus vous êtes précis, plus votre voyage sera personnalisé</p>
            </div>

            {/* Demande initiale — toujours visible et modifiable */}
            <div className="questionnaire-query-box">
              <label className="qquery-label">Votre demande</label>
              <textarea
                className="qquery-input"
                value={answers.query}
                onChange={e => setAnswers(a => ({...a, query: e.target.value}))}
                rows={2}
                placeholder="Décrivez votre voyage..."
              />
            </div>

            <div className="questionnaire-card">

              {/* SECTION 1 — L'essentiel */}
              <div className="q-section">
                <h3 className="q-section-title">L'essentiel</h3>
                <div className="q-grid-2">
                  <div className="q-field">
                    <label className="q-label">Destination(s)</label>
                    <input className="q-input" type="text" value={answers.destination}
                      onChange={e => setAnswers(a => ({...a, destination: e.target.value}))}
                      placeholder="Maroc, Thaïlande, Italie..." />
                  </div>
                  <div className="q-field">
                    <label className="q-label">Durée</label>
                    <input className="q-input" type="text" value={answers.duration}
                      onChange={e => setAnswers(a => ({...a, duration: e.target.value}))}
                      placeholder="5 jours, 2 semaines..." />
                  </div>
                  <div className="q-field">
                    <label className="q-label">Budget total</label>
                    <input className="q-input" type="text" value={answers.budget}
                      onChange={e => setAnswers(a => ({...a, budget: e.target.value}))}
                      placeholder="800€, 2 000€..." />
                  </div>
                  <div className="q-field">
                    <label className="q-label">Période / Dates</label>
                    <input className="q-input" type="text" value={answers.dates}
                      onChange={e => setAnswers(a => ({...a, dates: e.target.value}))}
                      placeholder="Début juillet, flexible..." />
                  </div>
                </div>
              </div>

              <div className="q-divider" />

              {/* SECTION 2 — Voyageurs */}
              <div className="q-section">
                <h3 className="q-section-title">Les voyageurs</h3>
                <div className="q-travelers-row">
                  <div className="q-field">
                    <label className="q-label">Nombre</label>
                    <div className="q-stepper">
                      <button className="q-stepper-btn" onClick={() => setAnswers(a => ({...a, travelers: String(Math.max(1, parseInt(a.travelers)-1))}))}>−</button>
                      <span className="q-stepper-val">{answers.travelers}</span>
                      <button className="q-stepper-btn" onClick={() => setAnswers(a => ({...a, travelers: String(Math.min(20, parseInt(a.travelers)+1))}))}>+</button>
                    </div>
                  </div>
                  <div className="q-field q-field-grow">
                    <label className="q-label">Type de voyage</label>
                    <div className="q-pills">
                      {[["seul","Seul(e)"],["couple","En couple"],["famille","En famille"],["amis","Entre amis"]].map(([v,l]) => (
                        <button key={v} className={`qpill ${answers.travelerType === v ? "active" : ""}`}
                          onClick={() => setAnswers(a => ({...a, travelerType: v}))}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {answers.travelerType === "famille" && (
                  <div className="q-toggle-row">
                    <label className="q-label">Voyage avec des enfants ?</label>
                    <button
                      className={`q-toggle ${answers.hasChildren ? "active" : ""}`}
                      onClick={() => setAnswers(a => ({...a, hasChildren: !a.hasChildren}))}>
                      {answers.hasChildren ? "Oui" : "Non"}
                    </button>
                  </div>
                )}
              </div>

              <div className="q-divider" />

              {/* SECTION 3 — Style */}
              <div className="q-section">
                <h3 className="q-section-title">Style de voyage <span className="q-hint">Plusieurs choix possibles</span></h3>
                <div className="q-pills q-pills-wrap">
                  {STYLE_OPTIONS.map(({value, label}) => (
                    <button key={value}
                      className={`qpill ${answers.style.includes(value) ? "active" : ""}`}
                      onClick={() => togglePill("style", value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="q-divider" />

              {/* SECTION 4 — Hébergement */}
              <div className="q-section">
                <h3 className="q-section-title">Hébergement</h3>
                <div className="q-pills">
                  {[["budget","Budget"],["standard","Standard ★★"],["confort","Confort ★★★"],["luxe","Luxe ★★★★★"],["flexible","Peu importe"]].map(([v,l]) => (
                    <button key={v} className={`qpill ${answers.accommodation === v ? "active" : ""}`}
                      onClick={() => setAnswers(a => ({...a, accommodation: v}))}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="q-divider" />

              {/* SECTION 5 — Rythme */}
              <div className="q-section">
                <h3 className="q-section-title">Rythme du voyage</h3>
                <div className="q-pills">
                  {[["tranquille","Tranquille — beaucoup de temps libre"],["equilibre","Équilibré — 3-4 activités/jour"],["intense","Intense — maximum d'expériences"]].map(([v,l]) => (
                    <button key={v} className={`qpill qpill-lg ${answers.pace === v ? "active" : ""}`}
                      onClick={() => setAnswers(a => ({...a, pace: v}))}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="q-divider" />

              {/* SECTION 6 — Alimentation */}
              <div className="q-section">
                <h3 className="q-section-title">Restrictions alimentaires <span className="q-hint">Optionnel</span></h3>
                <div className="q-pills q-pills-wrap">
                  {FOOD_OPTIONS.map(({value, label}) => (
                    <button key={value}
                      className={`qpill ${answers.food.includes(value) ? "active" : ""}`}
                      onClick={() => togglePill("food", value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="q-divider" />

              {/* SECTION 7 — Notes */}
              <div className="q-section">
                <h3 className="q-section-title">Infos complémentaires <span className="q-hint">Optionnel</span></h3>
                <textarea
                  className="q-textarea"
                  value={answers.notes}
                  onChange={e => setAnswers(a => ({...a, notes: e.target.value}))}
                  rows={3}
                  placeholder="Activités incontournables, besoins spécifiques, anniversaire à fêter, mobilité réduite..."
                />
              </div>

            </div>

            {/* CTA */}
            <button className="q-generate-btn" onClick={generateTrip} disabled={loading || !answers.query.trim()}>
              {loading ? <span className="search-loading" /> : "Générer mon voyage →"}
            </button>

            <button className="q-back-btn" onClick={() => setStep("search")}>
              ← Modifier ma recherche
            </button>

          </div>
        </section>
      )}


      {/* RESULTS */}
      {(itinerary || (loading && step === "results")) && (

        <section className="result-page-final" ref={resultRef}>

          {/* BACKGROUND PHOTOS */}
          <div className="result-bg">
            <div className="result-bg-grid">
              {[...Array(15)].map((_, i) => (
                <div key={i} className={`p${i + 1}`}></div>
              ))}
            </div>
            <div className="result-bg-overlay"></div>
          </div>


          {/* PROMPT BUBBLE */}
          <div className="prompt-bubble-final">
            <div className="bubble-search-icon"><IconSearch size={18} /></div>
            <div className="bubble-content">
              {loading ? "GÉNÉRATION EN COURS..." : trip.toUpperCase()}
            </div>
            <button className="modify-bubble-btn" onClick={handleModify}>
              <IconEdit size={13} /> Modifier
            </button>
          </div>


          {/* LOADING */}
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner">✈️</div>
              <p>L'IA prépare votre itinéraire intelligent...</p>
              <p className="loading-sub">Vols · Hébergements · Activités · Trajets</p>
            </div>
          )}


          {itinerary && (

            <div className="itinerary-column">

              {/* ── RÉSUMÉ + AFFINEMENT ── */}
              <div className="animate-in refine-bar">

                <div className="refine-summary">
                  {answers.destination && <span className="refine-tag">{answers.destination}</span>}
                  {answers.duration    && <span className="refine-tag">{answers.duration}</span>}
                  {answers.budget      && <span className="refine-tag">{answers.budget}</span>}
                  {parseInt(answers.travelers) > 1 && <span className="refine-tag">{answers.travelers} pers.</span>}
                  {answers.style.slice(0,2).map(s => <span key={s} className="refine-tag">{STYLE_LABELS[s]}</span>)}
                  <button className="refine-edit-btn" onClick={() => setStep("questionnaire")}>
                    <IconEdit size={13} /> Modifier les critères
                  </button>
                </div>

                <div className="refine-input-row">
                  <input
                    type="text"
                    className="refine-input"
                    placeholder="Ajoutez un souhait : activités sportives le soir, restaurant romantique jour 3..."
                    value={refineInput}
                    onChange={e => setRefineInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleRefine()}
                  />
                  <button className="refine-btn" onClick={handleRefine} disabled={!refineInput.trim() || refining}>
                    {refining ? <span className="search-loading" /> : "Affiner"}
                  </button>
                </div>

                {refineSuccess && (
                  <div className="refine-success">Voyage mis à jour avec succès</div>
                )}

              </div>


              {/* ── VOLS ── */}
              {itinerary.flight_info?.needed !== false && itinerary.flight_info?.from && (

                <div className="animate-in info-card flight-card">

                  <div className="info-card-header">
                    <span className="info-card-icon"><IconPlane size={22} /></span>
                    <h2>Informations de vol</h2>
                  </div>

                  {/* VOL ALLER */}
                  <div className="flight-direction-label">Vol aller</div>
                  <div className="flight-route-display">
                    <div className="flight-city-box">
                      <span className="flight-city-name">{itinerary.flight_info.from}</span>
                      <span className="flight-city-label">Départ</span>
                    </div>
                    <div className="flight-arrow-line">
                      <span className="flight-plane">✈</span>
                    </div>
                    <div className="flight-city-box">
                      <span className="flight-city-name">{itinerary.flight_info.to}</span>
                      <span className="flight-city-label">Arrivée</span>
                    </div>
                  </div>

                  <div className="flight-meta-row">
                    {(itinerary.flight_info.outbound?.duration || itinerary.flight_info.duration) && (
                      <span className="flight-meta-pill">
                        <span className="pill-label">Durée</span>
                        {itinerary.flight_info.outbound?.duration || itinerary.flight_info.duration}
                      </span>
                    )}
                    {(itinerary.flight_info.outbound?.estimated_price || itinerary.flight_info.estimated_price) && (
                      <span className="flight-meta-pill">
                        <span className="pill-label">Prix estimé</span>
                        {itinerary.flight_info.outbound?.estimated_price || itinerary.flight_info.estimated_price}
                      </span>
                    )}
                    {(itinerary.flight_info.outbound?.airlines || itinerary.flight_info.airlines) && (
                      <span className="flight-meta-pill">
                        <span className="pill-label">Compagnies</span>
                        {itinerary.flight_info.outbound?.airlines || itinerary.flight_info.airlines}
                      </span>
                    )}
                  </div>

                  {itinerary.flight_links && (
                    <div className="flight-links-row">
                      {itinerary.flight_links.map((link, i) => (
                        <a key={i} href={link.link} target="_blank" rel="noreferrer" className="flight-link-btn">
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}


                  {/* SÉPARATEUR */}
                  <div className="flight-divider"></div>


                  {/* VOL RETOUR */}
                  <div className="flight-direction-label">Vol retour</div>
                  <div className="flight-route-display">
                    <div className="flight-city-box">
                      <span className="flight-city-name">{itinerary.flight_info.to}</span>
                      <span className="flight-city-label">Départ</span>
                    </div>
                    <div className="flight-arrow-line">
                      <span className="flight-plane" style={{transform:"scaleX(-1)"}}>✈</span>
                    </div>
                    <div className="flight-city-box">
                      <span className="flight-city-name">{itinerary.flight_info.from}</span>
                      <span className="flight-city-label">Arrivée</span>
                    </div>
                  </div>

                  <div className="flight-meta-row">
                    {(itinerary.flight_info.return?.duration || itinerary.flight_info.duration) && (
                      <span className="flight-meta-pill">
                        <span className="pill-label">Durée</span>
                        {itinerary.flight_info.return?.duration || itinerary.flight_info.duration}
                      </span>
                    )}
                    {(itinerary.flight_info.return?.estimated_price || itinerary.flight_info.estimated_price) && (
                      <span className="flight-meta-pill">
                        <span className="pill-label">Prix estimé</span>
                        {itinerary.flight_info.return?.estimated_price || itinerary.flight_info.estimated_price}
                      </span>
                    )}
                    {(itinerary.flight_info.return?.airlines || itinerary.flight_info.airlines) && (
                      <span className="flight-meta-pill">
                        <span className="pill-label">Compagnies</span>
                        {itinerary.flight_info.return?.airlines || itinerary.flight_info.airlines}
                      </span>
                    )}
                  </div>

                  {itinerary.return_flight_links && (
                    <div className="flight-links-row">
                      {itinerary.return_flight_links.map((link, i) => (
                        <a key={i} href={link.link} target="_blank" rel="noreferrer" className="flight-link-btn flight-link-btn--return">
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}

                  {itinerary.flight_info.tip && (
                    <div className="flight-tip-box">
                      {itinerary.flight_info.tip}
                    </div>
                  )}

                </div>

              )}


              {/* ── PRATIQUE + BUDGET ── */}
              {(itinerary.practical_info || itinerary.budget_breakdown) && (

                <div className="two-col-grid">

                  {/* INFOS PRATIQUES */}
                  {itinerary.practical_info && (

                    <div className="animate-in info-card practical-card">

                      <div className="info-card-header">
                        <span className="info-card-icon"><IconGlobe size={22} /></span>
                        <h2>Infos pratiques</h2>
                      </div>

                      <div className="practical-items">

                        {itinerary.practical_info.visa && (
                          <div className="practical-item">
                            <span className="practical-label">Visa</span>
                            <span className="practical-value">{itinerary.practical_info.visa}</span>
                          </div>
                        )}
                        {itinerary.practical_info.currency && (
                          <div className="practical-item">
                            <span className="practical-label">Monnaie</span>
                            <span className="practical-value">{itinerary.practical_info.currency}</span>
                          </div>
                        )}
                        {itinerary.practical_info.language && (
                          <div className="practical-item">
                            <span className="practical-label">Langue</span>
                            <span className="practical-value">{itinerary.practical_info.language}</span>
                          </div>
                        )}
                        {itinerary.practical_info.safety && (
                          <div className="practical-item">
                            <span className="practical-label">Sécurité</span>
                            <span className="practical-value">{itinerary.practical_info.safety}</span>
                          </div>
                        )}
                        {itinerary.practical_info.best_time && (
                          <div className="practical-item">
                            <span className="practical-label">Meilleure période</span>
                            <span className="practical-value">{itinerary.practical_info.best_time}</span>
                          </div>
                        )}
                        {itinerary.practical_info.tips && (
                          <div className="practical-item practical-tips">
                            <span className="practical-label">À savoir</span>
                            <span className="practical-value">{itinerary.practical_info.tips}</span>
                          </div>
                        )}

                      </div>

                    </div>

                  )}


                  {/* BUDGET */}
                  {itinerary.budget_breakdown && (

                    <div className="animate-in info-card budget-card">

                      <div className="info-card-header">
                        <span className="info-card-icon"><IconWallet size={22} /></span>
                        <h2>Répartition du budget</h2>
                      </div>

                      <div className="budget-items">

                        {itinerary.budget_breakdown.flights && (
                          <div className="budget-item">
                            <span>Vols</span>
                            <span className="budget-amount">{itinerary.budget_breakdown.flights}</span>
                          </div>
                        )}
                        {itinerary.budget_breakdown.accommodation && (
                          <div className="budget-item">
                            <span>Hébergement</span>
                            <span className="budget-amount">{itinerary.budget_breakdown.accommodation}</span>
                          </div>
                        )}
                        {itinerary.budget_breakdown.food && (
                          <div className="budget-item">
                            <span>Repas</span>
                            <span className="budget-amount">{itinerary.budget_breakdown.food}</span>
                          </div>
                        )}
                        {itinerary.budget_breakdown.activities && (
                          <div className="budget-item">
                            <span>Activités</span>
                            <span className="budget-amount">{itinerary.budget_breakdown.activities}</span>
                          </div>
                        )}
                        {itinerary.budget_breakdown.local_transport && (
                          <div className="budget-item">
                            <span>Transport local</span>
                            <span className="budget-amount">{itinerary.budget_breakdown.local_transport}</span>
                          </div>
                        )}
                        {itinerary.budget_breakdown.total && (
                          <div className="budget-item budget-total">
                            <span>TOTAL</span>
                            <span className="budget-amount">{itinerary.budget_breakdown.total}</span>
                          </div>
                        )}

                      </div>

                    </div>

                  )}

                </div>

              )}


              {/* ── JOURS ── */}
              {itinerary.days.map((item, index) => (

                <div key={index} className="day-wrapper">

                  {/* DAY CARD */}
                  <div className="day-card-white animate-in">

                    {/* Image */}
                    {item.image_url && (
                      <div className="day-image-wrapper">
                        <img src={item.image_url} alt={item.title} className="day-image-main" />
                        <div className="day-image-overlay">
                          <span className="day-number-badge">JOUR {item.day}</span>
                        </div>
                      </div>
                    )}


                    <div className="day-body-content">

                      {/* Header */}
                      <div className="day-header-flex">
                        <h2>{item.title}</h2>
                        <div className="header-right">
                          {item.estimated_budget && (
                            <span className="budget-tag">{item.estimated_budget}</span>
                          )}
                          <button className="mod-btn-gray" onClick={handleModify}>
                            Modifier
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="day-desc-long">{item.description}</p>
                      )}

                      {/* PROGRAMME */}
                      {item.schedule && (
                        <div className="activities-part">
                          <h3 className="section-heading">Programme de la journée</h3>
                          <div className="schedule-timeline">
                            {item.schedule.map((slot, i) => (
                              <div className="schedule-row" key={i}>

                                <div className="schedule-left">
                                  <span className="schedule-time">{slot.time}</span>
                                  {slot.duration && (
                                    <span className="schedule-duration">{slot.duration}</span>
                                  )}
                                </div>

                                <div className="schedule-dot-col">
                                  <div className="schedule-dot"></div>
                                  {i < item.schedule.length - 1 && (
                                    <div className="schedule-line"></div>
                                  )}
                                </div>

                                <div className="schedule-right">
                                  <div className="schedule-name-row">
                                    <p className="schedule-name">{slot.activity}</p>
                                    {slot.cost && (
                                      <span className="schedule-cost">{slot.cost}</span>
                                    )}
                                  </div>
                                  {slot.description && (
                                    <p className="schedule-desc">{slot.description}</p>
                                  )}
                                </div>

                                {slot.image_url && (
                                  <div className="schedule-img-wrap">
                                    <img
                                      src={slot.image_url}
                                      alt={slot.activity}
                                      className="schedule-img"
                                      onClick={() => setLightbox({ src: slot.image_url, alt: slot.activity })}
                                    />
                                  </div>
                                )}

                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PRO TIP — 🧠 kept intentionally */}
                      {item.pro_tip && (
                        <div className="pro-tip-box">
                          <span className="pro-tip-icon">🧠</span>
                          <div>
                            <span className="pro-tip-label">Conseil local</span>
                            <p className="pro-tip-text">{item.pro_tip}</p>
                          </div>
                        </div>
                      )}

                      {/* HOTELS */}
                      {item.hotels && item.hotels.length > 0 && (
                        <div className="suggestion-section">
                          <h3 className="section-heading">Où dormir</h3>

                          {/* Hôtel principal */}
                          <div className="hotel-featured">
                            <img
                              src={item.hotels[0].image}
                              alt={item.hotels[0].name}
                              className="hotel-featured-img"
                              onClick={() => setLightbox({ src: item.hotels[0].image, alt: item.hotels[0].name })}
                            />
                            <div className="hotel-featured-body">
                              <div className="hotel-featured-label">Hébergement recommandé</div>
                              <div className="hotel-featured-name">{item.hotels[0].name}</div>
                              {item.hotels[0].rating && (
                                <div className="hotel-featured-rating">
                                  {"★".repeat(Math.round(parseFloat(item.hotels[0].rating)))}
                                  <span className="hotel-rating-num">{item.hotels[0].rating}</span>
                                </div>
                              )}
                              <div className="hotel-featured-price">{item.hotels[0].price}</div>
                              <a
                                href={item.hotels[0].link}
                                target="_blank"
                                rel="noreferrer"
                                className="hotel-featured-cta"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Voir sur Google Maps →
                              </a>
                            </div>
                          </div>

                          {/* Toggle alternatives */}
                          <button
                            className="hotel-alt-toggle"
                            onClick={() => toggleHotelExpand(index)}
                          >
                            {expandedHotels.has(index)
                              ? "Masquer les autres options"
                              : "Voir d'autres options"}
                          </button>

                          {/* Alternatives */}
                          {expandedHotels.has(index) && (
                            <div className="hotel-alternatives">
                              {item.hotels.slice(1).map((hotel, i) => (
                                <div key={i} className="hotel-alt-card">
                                  <img
                                    src={hotel.image}
                                    alt={hotel.name}
                                    className="hotel-alt-img"
                                    onClick={() => setLightbox({ src: hotel.image, alt: hotel.name })}
                                  />
                                  <div className="hotel-alt-info">
                                    <div className="hotel-alt-name">{hotel.name}</div>
                                    {hotel.rating && <div className="hotel-alt-rating">{"★".repeat(Math.round(parseFloat(hotel.rating)))} {hotel.rating}</div>}
                                    <div className="hotel-alt-price">{hotel.price}</div>
                                  </div>
                                  <a
                                    href={hotel.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hotel-alt-link"
                                    onClick={(e) => e.stopPropagation()}
                                  >→</a>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      )}

                      {/* PERSONNALISER CE JOUR */}
                      <div className="day-personalize">
                        {dayEditInputs[index] !== undefined ? (
                          <div className="day-edit-row">
                            <input
                              type="text"
                              className="day-edit-input"
                              placeholder="Ex: ajouter une sortie en soirée, remplacer le dîner par..."
                              value={dayEditInputs[index]}
                              onChange={e => setDayEditInputs(p => ({...p, [index]: e.target.value}))}
                              onKeyDown={e => e.key === "Enter" && handleUpdateDay(index, dayEditInputs[index])}
                              autoFocus
                            />
                            <button className="day-edit-btn"
                              onClick={() => handleUpdateDay(index, dayEditInputs[index])}
                              disabled={updatingDayIdx === index || !dayEditInputs[index]?.trim()}>
                              {updatingDayIdx === index ? <span className="search-loading" /> : "Mettre à jour"}
                            </button>
                            <button className="day-edit-cancel"
                              onClick={() => setDayEditInputs(p => { const n={...p}; delete n[index]; return n; })}>
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button className="day-personalize-btn"
                            onClick={() => setDayEditInputs(p => ({...p, [index]: ""}))}>
                            + Personnaliser ce jour
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Overlay quand ce jour est en cours de mise à jour */}
                    {updatingDayIdx === index && (
                      <div className="day-updating-overlay">
                        <div className="day-updating-spinner" />
                        <p>Mise à jour en cours...</p>
                      </div>
                    )}

                  </div>


                  {/* TRAJET VERS PROCHAINE VILLE */}
                  {item.travel && (

                    <div className="travel-arrow animate-in">

                      <div className="travel-line"></div>

                      <div className="travel-info">

                        <div className="travel-top-row">
                          <span className="travel-icon-wrap">
                            <TransportIcon type={item.travel.type} size={18} />
                          </span>
                          <div className="travel-route">
                            <span className="travel-city">{item.travel.from}</span>
                            <span className="travel-arrow-sep">→</span>
                            <span className="travel-city">{item.travel.to}</span>
                          </div>
                          {item.travel.type && (
                            <span className="travel-type-badge">
                              {item.travel.type.charAt(0).toUpperCase() + item.travel.type.slice(1)}
                            </span>
                          )}
                        </div>

                        <div className="travel-meta">
                          {item.travel.duration && (
                            <div className="travel-meta-item">
                              <span className="travel-meta-label">Durée</span>
                              <span className="travel-meta-val">{item.travel.duration}</span>
                            </div>
                          )}
                          {item.travel.distance_km && (
                            <div className="travel-meta-item">
                              <span className="travel-meta-label">Distance</span>
                              <span className="travel-meta-val">{item.travel.distance_km} km</span>
                            </div>
                          )}
                          {item.travel.estimated_cost && (
                            <div className="travel-meta-item">
                              <span className="travel-meta-label">Coût estimé</span>
                              <span className="travel-meta-val">{item.travel.estimated_cost}</span>
                            </div>
                          )}
                        </div>

                        {item.travel.details && (
                          <div className="travel-details">{item.travel.details}</div>
                        )}

                      </div>

                      <div className="travel-line"></div>

                    </div>

                  )}

                </div>

              ))}


              {/* ── PACKING LIST ── */}
              {itinerary.packing_list && (

                <div className="animate-in packing-section">

                  <div className="packing-header">
                    <span className="packing-header-icon"><IconLuggage size={26} /></span>
                    <h2>Votre valise pour ce voyage</h2>
                  </div>

                  <div className="packing-grid">

                    {[
                      { key: "documents", label: "Documents",  color: "#e3f0ff" },
                      { key: "clothes",   label: "Vêtements",  color: "#fff0e3" },
                      { key: "health",    label: "Santé",       color: "#e3ffe8" },
                      { key: "tech",      label: "Tech",        color: "#f3e3ff" },
                      { key: "misc",      label: "Divers",      color: "#fff8e3" }
                    ].map(({ key, label, color }) =>
                      itinerary.packing_list[key]?.length > 0 && (

                        <div className="packing-category" key={key} style={{ background: color }}>

                          <div className="packing-category-title">{label}</div>

                          <ul className="packing-items">
                            {itinerary.packing_list[key].map((item, i) => {
                              const id = `${key}-${i}`;
                              return (
                                <li
                                  key={id}
                                  className={`packing-item ${checkedItems.has(id) ? "checked" : ""}`}
                                  onClick={() => toggleItem(id)}
                                >
                                  <span className="packing-checkbox">
                                    {checkedItems.has(id) ? "✅" : "⬜"}
                                  </span>
                                  <span className="packing-text">{item}</span>
                                </li>
                              );
                            })}
                          </ul>

                        </div>

                      )
                    )}

                  </div>

                  <div className="packing-footer">
                    <span>{checkedItems.size} objet{checkedItems.size > 1 ? "s" : ""} préparé{checkedItems.size > 1 ? "s" : ""}</span>
                    {checkedItems.size > 0 && (
                      <button className="packing-reset" onClick={() => setCheckedItems(new Set())}>
                        Tout décocher
                      </button>
                    )}
                  </div>

                </div>

              )}


              {/* ── CTA COMPTE ── */}
              <div className="animate-in account-cta">
                <div className="account-cta-text">
                  <h3>Sauvegardez vos voyages</h3>
                  <p>
                    {user
                      ? `Connecté en tant que ${user.name} — sauvegardez cet itinéraire en un clic.`
                      : "Créez un compte pour retrouver tous vos itinéraires et les partager."}
                  </p>
                </div>
                {user ? (
                  <button className="account-cta-btn" onClick={handleSaveTrip}>
                    <IconSave size={16} /> Sauvegarder ce voyage
                  </button>
                ) : (
                  <button className="account-cta-btn" onClick={() => { setShowAccount(true); setAuthMode("register"); }}>
                    <IconUser size={16} /> Créer un compte gratuit
                  </button>
                )}
              </div>


            </div>

          )}

        </section>

      )}


      {/* ── LIGHTBOX PHOTO ── */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="lightbox-caption">{lightbox.alt}</p>
        </div>
      )}

      {/* ── MODALE COMPTE ── */}
      {showAccount && (
        <div className="modal-overlay" onClick={() => setShowAccount(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <button className="modal-close" onClick={() => setShowAccount(false)}>✕</button>

            <div className="modal-icon-svg"><IconUser size={36} /></div>
            <h2 className="modal-title">
              {authMode === "register" ? "Créer un compte" : "Se connecter"}
            </h2>
            <p className="modal-sub">Sauvegardez et retrouvez tous vos voyages</p>

            {authError && <p className="modal-error">{authError}</p>}

            <div className="modal-form">
              {authMode === "register" && (
                <input
                  type="text"
                  placeholder="Prénom & Nom"
                  className="modal-input"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="modal-input"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                className="modal-input"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              />
            </div>

            <button className="modal-submit" onClick={handleAuth}>
              {authMode === "register" ? "Créer mon compte" : "Se connecter"}
            </button>

            <p className="modal-login">
              {authMode === "register" ? "Déjà un compte ? " : "Pas encore de compte ? "}
              <span
                className="modal-login-link"
                onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }}
              >
                {authMode === "register" ? "Se connecter" : "Créer un compte"}
              </span>
            </p>

          </div>
        </div>
      )}

    </div>

  );

}

export default App;
