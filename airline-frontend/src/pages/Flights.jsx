import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchFlights, bookFlight } from "../api";
import { AuthContext } from "../context/AuthContext";
import {
  Plane,
  Info,
  CheckCircle,
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  RefreshCcw,
  ShieldCheck,
  Clock3,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const Flights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingFlightId, setBookingFlightId] = useState(null);

  const [filters, setFilters] = useState({
    from: "",
    destination: "",
    departDate: "",
    passengers: "1",
    sortBy: "departureSoonest",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      from: params.get("from") || "",
      destination: params.get("destination") || "",
      departDate: params.get("date") || "",
      passengers: params.get("passengers") || "1",
      sortBy: params.get("sortBy") || "departureSoonest",
    });
  }, [location.search]);

  useEffect(() => {
    const getFlights = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams(location.search);

        const origin = params.get("from") || "";
        const destination = params.get("destination") || "";
        const date = params.get("date") || "";
        const sortBy = params.get("sortBy") || "departureSoonest";

        const { data } = await fetchFlights({
          origin: origin || undefined,
          destination: destination || undefined,
          date: date || undefined,
          sort_by: sortBy || undefined,
        });

        setFlights(Array.isArray(data) ? data : []);
      } catch (err) {
        setFlights([]);
        setError(err.response?.data?.detail || "Unable to load flights right now.");
      } finally {
        setLoading(false);
      }
    };

    getFlights();
  }, [location.search]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applySearch = () => {
    const params = new URLSearchParams();

    if (filters.from.trim()) params.set("from", filters.from.trim());
    if (filters.destination.trim()) params.set("destination", filters.destination.trim());
    if (filters.departDate) params.set("date", filters.departDate);
    params.set("passengers", filters.passengers || "1");
    params.set("sortBy", filters.sortBy || "departureSoonest");

    navigate(`/flights?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      from: "",
      destination: "",
      departDate: "",
      passengers: "1",
      sortBy: "departureSoonest",
    });
    navigate("/flights");
  };

  const handleBooking = async (flight, seatNumber = null) => {
    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
      return;
    }

    try {
      const passengerCount = Number(filters.passengers || 1);

      if (passengerCount > 1) {
        setBookingError(
          "Multi-passenger booking is not connected in backend yet. Please book 1 passenger at a time for now."
        );
        return;
      }

      if ((flight.available_seats ?? 0) < passengerCount) {
        setBookingError("Not enough seats available for this booking.");
        return;
      }

      setBookingFlightId(flight.id);

      const { data } = await bookFlight({
        flight_id: flight.id,
        seat_number: seatNumber || null,
      });

      const updatedSeats =
        data?.flight?.available_seats ??
        Number(flight.available_seats || 0) - 1;

      setFlights((prev) =>
        prev.map((f) =>
          f.id === flight.id
            ? {
                ...f,
                available_seats: updatedSeats,
              }
            : f
        )
      );

      setBookingSuccess(`${flight.flight_number} reserved successfully.`);

      setTimeout(() => setBookingSuccess(""), 3000);
    } catch (err) {
      setBookingError(err.response?.data?.detail || "Booking failed. Please try again.");
    } finally {
      setBookingFlightId(null);
    }
  };

  const filteredFlights = flights.filter(
    (flight) => Number(flight.available_seats || 0) >= Number(filters.passengers || 1)
  );

  const totalAvailableSeats = filteredFlights.reduce(
    (sum, f) => sum + Number(f.available_seats || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_28%)]" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                <Plane className="text-amber-400 animate-pulse" size={30} />
              </div>
            </div>

            <p className="text-center text-sm tracking-[0.35em] uppercase text-amber-400 font-bold mb-3">
              Preparing Inventory
            </p>

            <h2 className="text-center text-2xl font-bold mb-4">
              Scanning Premium Flight Routes
            </h2>

            <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-amber-400 to-blue-500 animate-[pulse_1.2s_ease-in-out_infinite]" />
            </div>

            <p className="text-center text-gray-400 mt-4 text-sm">
              Fetching seats, schedules, and best available options.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:80px_80px]" />

      {bookingSuccess && (
        <div className="fixed top-24 right-5 z-50 bg-emerald-500/95 text-white border border-emerald-300/20 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3">
          <CheckCircle size={20} />
          <span className="font-semibold">{bookingSuccess}</span>
        </div>
      )}

      {bookingError && (
        <div className="fixed top-24 right-5 z-50 bg-red-500/95 text-white border border-red-300/20 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-semibold">{bookingError}</span>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
        <section className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <p className="text-amber-400 text-xs font-bold tracking-[0.35em] uppercase mb-3">
                Premium Flight Finder
              </p>

              <h1 className="text-4xl md:text-5xl font-serif italic leading-tight mb-4">
                Discover Flights to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 font-bold not-italic">
                  {filters.destination || "Luxury Routes"}
                </span>
              </h1>

              <p className="text-gray-400 max-w-2xl leading-relaxed">
                Search, compare, and reserve routes in a streamlined booking
                workspace designed to match your luxury homepage experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              <MiniStat icon={<Plane size={18} />} label="Routes Found" value={String(filteredFlights.length)} />
              <MiniStat icon={<Users size={18} />} label="Seats Available" value={String(totalAvailableSeats)} />
              <MiniStat icon={<ShieldCheck size={18} />} label="Booking Status" value="Live" />
            </div>
          </div>
        </section>

        {!user && (
          <section className="mb-8">
            <div className="rounded-[24px] border border-amber-400/20 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="text-amber-300 mt-0.5" size={18} />
                <div>
                  <h3 className="font-semibold text-amber-100">Guest browsing mode</h3>
                  <p className="text-sm text-amber-200/80">
                    You can search and compare flights now. Sign in when you are ready to book.
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                state={{ from: location }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-5 py-3 hover:scale-[1.02] transition-all"
              >
                Login to Book <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-6 md:p-8 shadow-2xl">
            {/* Header - EXACTLY like Home */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Search className="text-amber-400" size={20} />
              <span className="font-bold tracking-widest text-sm uppercase">
                Refine your journey
              </span>
              
              {/* Clear button - Right aligned */}
              <button
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10 transition-all"
              >
                <RefreshCcw size={16} />
                Clear filters
              </button>
            </div>
        
            {/* Filter Grid - 6 columns like Home */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
              {/* FROM INPUT */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  From
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
                    <MapPin size={17} />
                  </div>
                  <input
                    type="text"
                    value={filters.from}
                    onChange={(e) => handleFilterChange("from", e.target.value)}
                    placeholder="Departure city"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>
        
              {/* TO INPUT */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  To
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
                    <MapPin size={17} />
                  </div>
                  <input
                    type="text"
                    value={filters.destination}
                    onChange={(e) => handleFilterChange("destination", e.target.value)}
                    placeholder="Destination city"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500/50 transition-all"
                  />
                </div>
              </div>
        
              {/* DATE INPUT - FIXED */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Depart
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70 pointer-events-none z-10">
                    <Calendar size={17} />
                  </div>
                  <input
                    type="date"
                    value={filters.departDate}
                    onChange={(e) => handleFilterChange("departDate", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-amber-500/50 transition-all outline-none [color-scheme:dark]"
                  />
                </div>
              </div>
        
              {/* PASSENGERS SELECT */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Passengers
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70 pointer-events-none">
                    <Users size={17} />
                  </div>
                  <select
                    value={filters.passengers}
                    onChange={(e) => handleFilterChange("passengers", e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                  >
                    <option value="1" className="bg-[#0b1220]">1 Passenger</option>
                    <option value="2" className="bg-[#0b1220]">2 Passengers</option>
                    <option value="3" className="bg-[#0b1220]">3 Passengers</option>
                    <option value="4" className="bg-[#0b1220]">4 Passengers</option>
                  </select>
                </div>
              </div>
        
              {/* SORT BY SELECT */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Sort By
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70 pointer-events-none">
                    <Sparkles size={17} />
                  </div>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                  >
                    <option value="departureSoonest" className="bg-[#0b1220]">Departure Soonest</option>
                    <option value="priceLowHigh" className="bg-[#0b1220]">Price: Low to High</option>
                    <option value="priceHighLow" className="bg-[#0b1220]">Price: High to Low</option>
                    <option value="seatsHighLow" className="bg-[#0b1220]">Most Seats Available</option>
                  </select>
                </div>
              </div>
        
              {/* ACTION/SEARCH BUTTON */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Action
                </label>
                <button
                  type="button"
                  onClick={applySearch}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:scale-[1.02] text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Search <ArrowRight size={18} />
                </button>
              </div>
            </div>
        
            {/* Error Message */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </section>
        <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Available Flights</h3>
            <p className="text-gray-400 text-sm mt-1">
              {filteredFlights.length} result{filteredFlights.length !== 1 ? "s" : ""} matching
              your current search.
            </p>
          </div>
        </section>

        <section className="space-y-5">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <FlightResultCard
                key={flight.id}
                flight={flight}
                passengers={Number(filters.passengers || 1)}
                onBook={handleBooking}
                bookingBusy={bookingFlightId === flight.id}
                user={user}
              />
            ))
          ) : (
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-10 text-center shadow-2xl">
              <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Search className="text-amber-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3">No flights match this search</h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Adjust your destination, departure date, or passenger count to see
                more available options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-6 py-3.5 hover:scale-[1.02] transition-all"
                >
                  Reset Filters
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 hover:bg-white/10 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-14 grid md:grid-cols-3 gap-5">
          <BottomFeature
            icon={<ShieldCheck size={18} />}
            title="Secure Booking"
            desc="Protected reservation flow with clear seat availability checks."
          />
          <BottomFeature
            icon={<Clock3 size={18} />}
            title="Live Sorting"
            desc="Instantly organize flights by price, timing, or available capacity."
          />
          <BottomFeature
            icon={<Plane size={18} />}
            title="Route-Aware Search"
            desc="Reads destination query parameters directly from your homepage links."
          />
        </section>
      </div>
    </div>
  );
};

const SearchField = ({ label, value, onChange, placeholder, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500/50 transition-all"
      />
    </div>
  </div>
);

const DateField = ({ label, value, onChange, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
        {icon}
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all [color-scheme:dark]"
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, icon, options }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70 pointer-events-none">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0b1220]">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const ActionField = ({ onSearch }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.25em]">
      Action
    </label>
    <button
      type="button"
      onClick={onSearch}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3.5 hover:scale-[1.02] transition-all"
    >
      Search <ArrowRight size={16} />
    </button>
  </div>
);

const MiniStat = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-xl">
    <div className="flex items-center gap-2 text-amber-400 mb-2">
      {icon}
      <span className="text-xs uppercase tracking-[0.22em] font-bold">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const BottomFeature = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-2xl hover:bg-white/10 transition-all">
    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h4 className="font-bold text-lg mb-2">{title}</h4>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const buildSeatChoices = (availableSeats) => {
  const seats = Number(availableSeats || 0);
  const letters = ["A", "B", "C", "D", "E", "F"];
  const choices = [];

  for (let i = 0; i < seats; i += 1) {
    const row = Math.floor(i / letters.length) + 1;
    const letter = letters[i % letters.length];
    choices.push(`${row}${letter}`);
  }

  return choices;
};

const FlightResultCard = ({ flight, passengers, onBook, bookingBusy, user }) => {
  const [seatPreference, setSeatPreference] = useState("");
  const seats = Number(flight.available_seats || 0);
  const soldOut = seats < passengers;
  const price = Number(flight.price || 0);
  const departure = new Date(flight.departure_time);
  const seatChoices = buildSeatChoices(seats);

  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-6 md:p-7 shadow-2xl hover:bg-white/[0.07] transition-all">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
              <Plane size={13} />
              {flight.flight_number}
            </span>

            <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-gray-300">
              {flight.status || "Scheduled"}
            </span>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">From</p>
              <h3 className="text-2xl font-bold">{flight.origin}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {departure.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full md:w-32 flex items-center gap-3 text-gray-500">
                <div className="h-px flex-1 bg-white/10" />
                <ArrowRight size={18} className="text-amber-400" />
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-sm text-gray-500 mb-1">To</p>
              <h3 className="text-2xl font-bold">{flight.destination}</h3>
              <p className="text-sm text-gray-400 mt-1">
                Departure at{" "}
                {departure.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <InfoPill label="Available Seats" value={`${seats}`} />
            <InfoPill label="Passengers" value={`${passengers}`} />
            <InfoPill label="Fare Type" value="Flexible" />
          </div>
        </div>

        <div className="xl:w-[260px] bg-black/20 border border-white/10 rounded-2xl p-5">
          <p className="text-sm text-gray-400 mb-1">Starting from</p>
          <div className="text-3xl font-bold mb-1">৳{price.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mb-5">Taxes and fees may apply</p>

          <div className="mb-4">
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
              Seat Selection
            </label>
            <select
              value={seatPreference}
              onChange={(e) => setSeatPreference(e.target.value)}
              disabled={soldOut || bookingBusy}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all disabled:text-gray-400"
            >
              <option value="" className="bg-[#0b1220]">
                Auto-assign seat
              </option>
              {seatChoices.map((seat) => (
                <option key={seat} value={seat} className="bg-[#0b1220]">
                  {seat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onBook(flight, seatPreference)}
            disabled={soldOut || bookingBusy}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold transition-all ${
              soldOut || bookingBusy
                ? "bg-white/10 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:scale-[1.02]"
            }`}
          >
            {bookingBusy
              ? "Booking..."
              : soldOut
              ? "Not Enough Seats"
              : user
              ? "Book Now"
              : "Login to Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoPill = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
      {label}
    </p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default Flights;
