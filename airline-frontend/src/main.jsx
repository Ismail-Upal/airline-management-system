import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom'
import './index.css'

// --- Navbar Component (Reusable) ---
const Navbar = () => (
  <nav className="navbar flex justify-between items-center p-6 bg-white/50 backdrop-blur-md sticky top-0 z-50">
    <Link to="/" className="text-2xl font-display font-bold text-airline-primary">
      SkyLink Airlines
    </Link>
    <div className="flex space-x-6">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/flights" className="nav-link">Flights</Link>
      <Link to="/bookings" className="nav-link">Bookings</Link>
      <Link to="/auth" className="nav-link font-bold text-airline-secondary">Login/Register</Link>
    </div>
  </nav>
)

// --- Home Page Component ---
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn">
      <header className="text-center py-20 px-4">
        <h2 className="text-5xl font-display font-bold text-airline-primary mb-6 leading-tight">
          Manage Your Airline <br />
          <span className="text-airline-secondary">Seamlessly</span>
        </h2>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          Experience the future of travel management with real-time tracking, 
          automated passenger handling, and advanced performance analytics.
        </p>
        <button 
          onClick={() => navigate('/flights')} 
          className="btn-primary animate-pulseGlow text-lg py-4 px-10"
        >
          Book a Flight
        </button>
      </header>

      <main className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="card animate-float">
          <div className="text-airline-secondary mb-4 text-3xl">✈️</div>
          <h3 className="text-xl font-bold mb-2">Flight Status</h3>
          <p className="text-slate-500">Upcoming departures and arrivals updated live via our global satellite network.</p>
        </div>

        <div className="card animate-float [animation-delay:0.2s]">
          <div className="text-airline-secondary mb-4 text-3xl">👥</div>
          <h3 className="text-xl font-bold mb-2">Passenger Info</h3>
          <p className="text-slate-500">Manage customer preferences, loyalty points, and digital boarding passes.</p>
        </div>

        <div className="card animate-float [animation-delay:0.4s]">
          <div className="text-airline-secondary mb-4 text-3xl">📊</div>
          <h3 className="text-xl font-bold mb-2">Reports</h3>
          <p className="text-slate-500">Comprehensive analytics on fuel efficiency, route popularity, and revenue.</p>
        </div>
      </main>
    </div>
  )
}

// --- Main App Entry ---
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans text-airline-primary">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* These routes should link to your other components */}
        <Route path="/flights" element={<div className="p-20 text-center text-2xl">Flight Search Page (Coming Soon)</div>} />
        <Route path="/bookings" element={<div className="p-20 text-center text-2xl">Your Bookings (Coming Soon)</div>} />
        <Route path="/auth" element={<div className="p-20 text-center text-2xl">Login/Register Page (Coming Soon)</div>} />
      </Routes>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
