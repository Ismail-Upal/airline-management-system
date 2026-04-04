import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import PassengerProfile from './pages/PassengerProfile';
import StaffProfile from './pages/StaffProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flights" element={<Flights />} />
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
            <Route 
              path="*" 
              element={
                <div className="text-center pt-40">
                  <h1 className="text-4xl text-red-400">404 - Page Not Found</h1>
                  <p className="text-white mt-4">Current URL: {window.location.hash || window.location.pathname}</p>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
