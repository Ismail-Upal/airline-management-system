import React, { useState, useEffect } from 'react';
import { fetchFlights, bookFlight } from '../api';
import FlightCard from '../components/FlightCard';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFlights = async () => {
      try {
        const { data } = await fetchFlights();
        setFlights(data);
      } catch (err) {
        console.error("Failed to load flights");
      } finally {
        setLoading(false);
      }
    };
    getFlights();
  }, []);

  const handleBooking = async (id) => {
    try {
      await bookFlight({ flight_id: id });
      alert("Success! Your seat is reserved.");
    } catch (err) {
      alert("Please login to book a flight.");
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-8 border-b pb-4">Available Flights</h2>
      
      {loading ? (
        <div className="text-center py-20 text-blue-600 font-bold">Loading Flights...</div>
      ) : flights.length > 0 ? (
        <div className="grid gap-6">
          {flights.map(f => (
            <FlightCard key={f.id} flight={f} onBook={handleBooking} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded shadow">
          <p className="text-gray-500 italic">No flights available currently. Check back later.</p>
        </div>
      )}
    </div>
  );
};

export default Flights;
