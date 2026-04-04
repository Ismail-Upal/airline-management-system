import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './index.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PassengerProfile from './pages/PassengerProfile';
import StaffProfile from './pages/StaffProfile';
import ProtectedRoute from './components/ProtectedRoute';

// Navbar uses AuthContext to show user info

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes - Passenger */}
        <Route
          path="/profile/passenger"
          element={
            <ProtectedRoute allowedRoles={['passenger']}>
              <PassengerProfile />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Staff */}
        <Route
          path="/profile/staff"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffProfile />
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found */}
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
