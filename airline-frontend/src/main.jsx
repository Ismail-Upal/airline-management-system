import React, { useContext } from 'react'; // Added useContext
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthContext
import './index.css';

import Home from './pages/Home';
import Flights from './pages/Flights';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// 1. Updated Navbar to use Context
const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-800 tracking-tight">
        SkyLink Airlines
      </Link>
      <div className="space-x-6 flex items-center">
        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
        <Link to="/flights" className="text-gray-600 hover:text-blue-600 font-medium">Flights</Link>
        
        {user ? (
          <>
            <span className="text-blue-800 font-medium">Hi, {user.full_name || 'User'}</span>
            <button
              onClick={logoutUser}
              className="text-red-500 hover:text-red-700 font-semibold transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition">
              Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar /> {/* Now Navbar is inside the App and can access context */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<div className="text-center py-20 text-2xl">Page Not Found</div>} />
      </Routes>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);
