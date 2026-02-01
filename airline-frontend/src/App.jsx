// airline-frontend/src/App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // Add this line
import Flights from './pages/Flights';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Add this line */}
            <Route path="/flights" element={<Flights />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
