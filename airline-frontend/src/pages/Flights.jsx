import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { Link } from 'react-router-dom'; // Added Link
import { fetchFlights, bookFlight } from '../api';
import FlightCard from '../components/FlightCard';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import { Plane, Info, CheckCircle } from 'lucide-react';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false); // For demo feedback
  const { user } = useContext(AuthContext); // Access global user state

  // --- DEMO MOCK DATA ---
  const mockFlights = [
    {
      id: 'demo-1',
      flight_number: 'SK-102',
      origin: 'Dhaka (DAC)',
      destination: 'Chittagong (CGP)',
      departure_time: new Date().toISOString(),
      price: 4500,
      available_seats: 12
    },
    {
      id: 'demo-2',
      flight_number: 'SK-505',
      origin: 'Dhaka (DAC)',
      destination: 'Cox\'s Bazar (CXB)',
      departure_time: new Date(Date.now() + 86400000).toISOString(),
      price: 6500,
      available_seats: 5
    }
  ];

  useEffect(() => {
    const getFlights = async () => {
      try {
        const { data } = await fetchFlights();
        if (data && data.length > 0) {
          setFlights(data);
        } else {
          setFlights(mockFlights);
        }
      } catch (err) {
        setFlights(mockFlights);
      } finally {
        // Keep animation visible for 2 seconds for the demo
        setTimeout(() => setLoading(false), 2000);
      }
    };
    getFlights();
  }, []);

  const handleBooking = async (id) => {
    try {
      if (!id.toString().includes('demo')) {
        await bookFlight({ flight_id: id });
      }
      // Show success animation/message
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute top-0 h-full bg-blue-600 animate-progress"></div>
        </div>
        <div className="mt-4 flex items-center space-x-2 text-blue-800 font-bold text-xl animate-pulse">
          <Plane className="animate-bounce" />
          <span>Scanning Cloud Routes...</span>
        </div>
      </div>
    );
  }

  // 2. SECURITY CHECK (Gated Content)
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center animate-fadeIn">
        <div className="bg-white p-10 rounded-xl shadow-xl border border-gray-100 max-w-md">
          <div className="text-blue-600 mb-4 flex justify-center">
            <Plane size={48} className="rotate-45" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-8">
            Please sign in to your account to view available luxury routes and reserve your seat.
          </p>
          <Link
            to="/login"
            className="block w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // 3. MAIN CONTENT (Only for logged in users)
  return (
    <div className="container mx-auto py-10 px-6 animate-fadeIn relative">
      {/* Booking Success Toast */}
      {bookingSuccess && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-2 z-50 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-bold">Booking Confirmed!</span>
        </div>
      )}

      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-blue-900">Available Flights</h2>
        {flights[0]?.id.toString().includes('demo') && (
          <span className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
            <Info size={14} className="mr-1"/> Demo Mode Active
          </span>
        )}
      </div>
    
      <div className="grid gap-6">
        {flights.map(f => (
          <div key={f.id} className="hover:scale-[1.01] transition-transform duration-300">
             <FlightCard flight={f} onBook={handleBooking} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flights;
