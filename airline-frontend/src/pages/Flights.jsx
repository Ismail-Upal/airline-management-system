import React, { useState, useEffect } from 'react';
import { fetchFlights, bookFlight } from '../api';
import FlightCard from '../components/FlightCard';

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState({ origin: '', destination: '' });

  const loadFlights = async () => {
    try {
      const { data } = await fetchFlights(search);
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights", error);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleBook = async (flightId) => {
    try {
      await bookFlight({ flight_id: flightId });
      alert("Booking Successful!");
      loadFlights(); // Refresh seat count
    } catch (error) {
      alert("Booking Failed. Please log in.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex gap-4">
        <input 
          placeholder="Origin (e.g. JFK)" 
          className="border p-2 rounded"
          onChange={(e) => setSearch({...search, origin: e.target.value.toUpperCase()})}
        />
        <input 
          placeholder="Destination (e.g. LHR)" 
          className="border p-2 rounded"
          onChange={(e) => setSearch({...search, destination: e.target.value.toUpperCase()})}
        />
        <button onClick={loadFlights} className="bg-green-600 text-white p-2 rounded">Search</button>
      </div>
      
      <div>
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
        ))}
      </div>
    </div>
  );
};

export default Flights;
