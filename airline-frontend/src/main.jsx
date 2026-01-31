import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // Tailwind + your custom styles

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center p-4">
        <h1 className="text-2xl font-display font-bold">SkyLink Airlines</h1>
        <div className="flex space-x-6">
          <a href="#" className="nav-link">Dashboard</a>
          <a href="#" className="nav-link">Flights</a>
          <a href="#" className="nav-link">Bookings</a>
          <a href="#" className="nav-link">Reports</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-16 animate-fadeIn">
        <h2 className="text-4xl font-display font-bold text-airline-primary mb-4">
          Manage Your Airline Seamlessly
        </h2>
        <p className="text-airline-secondary mb-6">
          Real-time flight tracking, passenger management, and performance analytics.
        </p>
        <button className="btn-primary animate-pulseGlow">
          Book a Flight
        </button>
      </header>

      {/* Dashboard Cards */}
      <main className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card animate-float">
          <h3 className="text-lg font-bold mb-2">Flight Status</h3>
          <p>Upcoming departures and arrivals updated live.</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-2">Passenger Info</h3>
          <p>Manage customer details and preferences.</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-2">Reports</h3>
          <p>View analytics and performance metrics.</p>
        </div>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
