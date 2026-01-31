import React, { useState, useEffect } from 'react';
import { fetchFlights, bookFlight } from '../api';
import FlightCard from '../components/FlightCard';
import { Plane, Info } from 'lucide-react';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // If the backend returns an empty list, use mock data for the demo
        if (data && data.length > 0) {
          setFlights(data);
        } else {
          setFlights(mockFlights);
        }
      } catch (err) {
        console.warn("Using demo data due to connection error");
        setFlights(mockFlights);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };
    getFlights();
  }, []);

  const handleBooking = async (id) => {
    // If it's a demo flight, just show success immediately
    if (id.toString().includes('demo')) {
      alert("DEMO MODE: Booking successful for " + id);
      return;
    }

    try {
      await bookFlight({ flight_id: id });
      alert("Success! Your seat is reserved.");
    } catch (err) {
      alert("Please login to book a flight.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute top-0 h-full bg-blue-600 animate-progress"></div>
        </div>
        <div className="mt-4 flex items-center space-x-2 text-blue-800 font-display font-bold text-xl animate-pulse">
          <Plane className="animate-bounce" />
          <span>Scanning Cloud Routes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6 animate-fadeIn">
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
