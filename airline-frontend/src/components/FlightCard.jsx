import React from 'react';

const FlightCard = ({ flight, onBook }) => {
  return (
    <div className="border p-4 rounded shadow-md bg-white mb-4 flex justify-between items-center">
      <div>
        <h3 className="text-xl font-bold text-blue-600">{flight.flight_number}</h3>
        <div className="text-gray-600">
          {flight.origin} ➝ {flight.destination}
        </div>
        <div className="text-sm text-gray-500">
          {new Date(flight.departure_time).toLocaleString()}
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">${flight.price}</div>
        <div className="text-sm text-gray-500 mb-2">
          {flight.available_seats} seats left
        </div>
        <button 
          onClick={() => onBook(flight.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightCard;
