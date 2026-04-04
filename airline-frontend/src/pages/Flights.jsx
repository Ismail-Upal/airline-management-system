import React, { useState, useEffect, useMemo, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";

const Flights = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    from: "",
    destination: "",
    departDate: "",
    passengers: "1",
    sortBy: "departureSoonest",
  });

  const mockFlights = [
    {
      id: "demo-1",
      flight_number: "SK-201",
      origin: "Dhaka (DAC)",
      destination: "Dubai (DXB)",
      departure_time: new Date(Date.now() + 86400000).toISOString(),
      price: 48900,
      available_seats: 12,
    },
    {
      id: "demo-2",
      flight_number: "SK-305",
      origin: "Dhaka (DAC)",
      destination: "London (LHR)",
      departure_time: new Date(Date.now() + 2 * 86400000).toISOString(),
      price: 86500,
      available_seats: 8,
    },
    {
      id: "demo-3",
      flight_number: "SK-440",
      origin: "Dhaka (DAC)",
      destination: "Zurich (ZRH)",
      departure_time: new Date(Date.now() + 3 * 86400000).toISOString(),
      price: 91300,
      available_seats: 5,
    },
    {
      id: "demo-4",
      flight_number: "SK-511",
      origin: "Dhaka (DAC)",
      destination: "New York (JFK)",
      departure_time: new Date(Date.now() + 4 * 86400000).toISOString(),
      price: 118000,
      available_seats: 4,
    },
    {
      id: "demo-5",
      flight_number: "SK-118",
      origin: "Chittagong (CGP)",
      destination: "Dubai (DXB)",
      departure_time: new Date(Date.now() + 5 * 86400000).toISOString(),
      price: 50600,
      available_seats: 7,
    },
    {
      id: "demo-6",
      flight_number: "SK-090",
      origin: "Dhaka (DAC)",
      destination: "Cox's Bazar (CXB)",
      departure_time: new Date(Date.now() + 10 * 3600000).toISOString(),
      price: 6500,
      available_seats: 16,
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters((prev) => ({
      ...prev,
      from: params.get("from") || "",
      destination: params.get("destination") || "",
      departDate: params.get("date") || "",
      passengers: params.get("passengers") || "1",
    }));
  }, [location.search]);

  useEffect(() => {
    const getFlights = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await fetchFlights();

        if (Array.isArray(data) && data.length > 0) {
          setFlights(data);
        } else {
          setFlights(mockFlights);
        }
      } catch (err) {
        setFlights(mockFlights);
        setError("Live flight feed unavailable. Showing curated demo inventory.");
      } finally {
        setTimeout(() => setLoading(false), 1200);
      }
    };

    getFlights();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      from: "",
      destination: "",
      departDate: "",
      passengers: "1",
      sortBy: "departureSoonest",
    });
  };

  const handleBooking = async (flight) => {
    try {
      if ((flight.available_seats ?? 0) < Number(filters.passengers || 1)) {
        alert("Not enough seats available for this booking.");
        return;
      }

      if (!String(flight.id).includes("demo")) {
        await bookFlight({ flight_id: flight.id });
      }

      setFlights((prev) =>
        prev.map((f) =>
          f.id === flight.id
            ? {
                ...f,
                available_seats:
                  Number(f.available_seats || 0) - Number(filters.passengers || 1),
              }
            : f
        )
      );

      setBookingSuccess(
        `${flight.flight_number} reserved successfully for ${filters.passengers} passenger${
          Number(filters.passengers) > 1 ? "s" : ""
        }.`
      );

      setTimeout(() => setBookingSuccess(""), 3000);
    } catch (err) {
      alert("Booking failed. Please try again.");
    }
  };

  const filteredFlights = useMemo(() => {
    const normalized = (value) => String(value || "").toLowerCase().trim();

    let result = flights.filter((flight) => {
      const origin = normalized(flight.origin);
      const destination = normalized(flight.destination);
      const fromFilter = normalized(filters.from);
      const destinationFilter = normalized(filters.destination);
      const passengerCount = Number(filters.passengers || 1);

      if (fromFilter && !origin.includes(fromFilter)) return false;
      if (destinationFilter && !destination.includes(destinationFilter)) return false;

      if (filters.departDate) {
        const flightDate = new Date(flight.departure_time).toISOString().slice(0, 10);
        if (flightDate !== filters.departDate) return false;
      }

      if (Number(flight.available_seats || 0) < passengerCount) return false;

      return true;
    });

    switch (filters.sortBy) {
      case "priceLowHigh":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "priceHighLow":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "seatsHighLow":
        result.sort(
          (a, b) => Number(b.available_seats || 0) - Number(a.available_seats || 0)
        );
        break;
      case "departureSoonest":
      default:
        result.sort(
          (a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime()
        );
        break;
    }

    return result;
  }, [flights, filters]);

  const isDemoMode = flights.some((f) => String(f.id).includes("demo"));
  const featuredDestination = filters.destination || "Luxury Routes";
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-16">
          <div className="max-w-lg w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-10 shadow-2xl text-center">
            <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
              <Plane className="text-amber-400 rotate-45" size={34} />
            </div>

            <p className="text-amber-400 text-xs font-bold tracking-[0.35em] uppercase mb-3">
              Secure Access
            </p>

            <h2 className="text-3xl font-bold mb-3">Sign in to view available flights</h2>

            <p className="text-gray-400 mb-8 leading-relaxed">
              Access live schedules, compare premium routes, and reserve your seat
              from a curated luxury travel dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-6 py-3.5 hover:scale-[1.02] transition-all"
              >
                Continue to Login <ArrowRight size={18} />
              </Link>

              <Link
                to="/"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 hover:bg-white/10 transition-all"
              >
                Back to Home
              </Link>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Need help?{" "}
              <Link to="/forgot-password" className="text-amber-400 hover:underline">
                Recover your account
              </Link>
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
        <div className="fixed top-24 right-5 z-50 bg-emerald-500/95 text-white border border-emerald-300/20 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce">
          <CheckCircle size={20} />
          <span className="font-semibold">{bookingSuccess}</span>
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
                  {featuredDestination}
                </span>
              </h1>

              <p className="text-gray-400 max-w-2xl leading-relaxed">
                Search, compare, and reserve routes in a streamlined booking
                workspace designed to match your luxury homepage experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
              <MiniStat
                icon={<Plane size={18} />}
                label="Routes Found"
                value={String(filteredFlights.length)}
              />
              <MiniStat
                icon={<Users size={18} />}
                label="Seats Available"
                value={String(totalAvailableSeats)}
              />
              <MiniStat
                icon={<ShieldCheck size={18} />}
                label="Booking Status"
                value={isDemoMode ? "Demo" : "Live"}
              />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                  <Search className="text-amber-400" size={18} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Refine your journey</h2>
                  <p className="text-sm text-gray-400">
                    Filter by route, departure date, passenger count, and fare preference.
                  </p>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10 transition-all"
              >
                <RefreshCcw size={16} />
                Clear filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
              <SearchField
                label="From"
                value={filters.from}
                onChange={(value) => handleFilterChange("from", value)}
                placeholder="Departure city"
                icon={<MapPin size={17} />}
              />

              <SearchField
                label="To"
                value={filters.destination}
                onChange={(value) => handleFilterChange("destination", value)}
                placeholder="Destination city"
                icon={<MapPin size={17} />}
              />

              <DateField
                label="Depart"
                value={filters.departDate}
                onChange={(value) => handleFilterChange("departDate", value)}
                icon={<Calendar size={17} />}
              />

              <SelectField
                label="Passengers"
                value={filters.passengers}
                onChange={(value) => handleFilterChange("passengers", value)}
                icon={<Users size={17} />}
                options={[
                  { value: "1", label: "1 Passenger" },
                  { value: "2", label: "2 Passengers" },
                  { value: "3", label: "3 Passengers" },
                  { value: "4", label: "4 Passengers" },
                ]}
              />

              <SelectField
                label="Sort By"
                value={filters.sortBy}
                onChange={(value) => handleFilterChange("sortBy", value)}
                icon={<Sparkles size={17} />}
                options={[
                  { value: "departureSoonest", label: "Departure Soonest" },
                  { value: "priceLowHigh", label: "Price: Low to High" },
                  { value: "priceHighLow", label: "Price: High to Low" },
                  { value: "seatsHighLow", label: "Most Seats Available" },
                ]}
              />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 flex items-center gap-2">
                <Info size={16} />
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

          {isDemoMode && (
            <span className="inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-2 rounded-full border border-amber-400/20">
              <Info size={14} />
              Demo inventory visible
            </span>
          )}
        </section>

        <section className="space-y-5">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <FlightResultCard
                key={flight.id}
                flight={flight}
                passengers={Number(filters.passengers || 1)}
                onBook={handleBooking}
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

const FlightResultCard = ({ flight, passengers, onBook }) => {
  const seats = Number(flight.available_seats || 0);
  const soldOut = seats < passengers;
  const price = Number(flight.price || 0);
  const departure = new Date(flight.departure_time);

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
              Premium Economy / Business Ready
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

          <button
            onClick={() => onBook(flight)}
            disabled={soldOut}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold transition-all ${
              soldOut
                ? "bg-white/10 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:scale-[1.02]"
            }`}
          >
            {soldOut ? "Not Enough Seats" : "Book Now"}
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
