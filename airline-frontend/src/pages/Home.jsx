import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Globe,
  Clock,
  Plane,
  Calendar,
} from "lucide-react";
import Lottie from "lottie-react";
import airplaneAnimation from "../assets/airplane.json";
import DestinationCard from "../components/DestinationCard";

/* ================= COMPOSITE FLIGHT STAGE ================= */
const FlightStage = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M -100 600 C 150 400 350 100 600 300 S 900 600 1300 400"
          stroke="rgba(96, 165, 250, 0.3)"
          strokeWidth="2"
          strokeDasharray="12 12"
        />

        <path
          d="M -100 600 C 150 400 350 100 600 300 S 900 600 1300 400"
          stroke="rgba(251, 191, 36, 0.5)"
          strokeWidth="2"
          strokeDasharray="12 12"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="200"
            to="0"
            dur="10s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <div
        className="absolute w-[300px] md:w-[450px]"
        style={{
          offsetPath:
            "path('M -100 600 C 150 400 350 100 600 300 S 900 600 1300 400')",
          animation: "movePlane 25s infinite linear",
        }}
      >
        <Lottie animationData={airplaneAnimation} loop />
      </div>

      <style>{`
        @keyframes movePlane {
          0% { offset-distance: 0%; transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          50% { offset-distance: 50%; transform: rotate(-5deg); }
          100% { offset-distance: 100%; transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

/* ================= MAIN HOME ================= */
const Home = () => {
  const navigate = useNavigate();

  const airportMap = {
    Bangladesh: ["Dhaka (DAC)", "Chattogram (CGP)", "Cox's Bazar (CXB)"],
    "United Arab Emirates": ["Dubai (DXB)", "Abu Dhabi (AUH)", "Sharjah (SHJ)"],
    "United Kingdom": ["London (LHR)", "Manchester (MAN)", "Birmingham (BHX)"],
    Switzerland: ["Zurich (ZRH)", "Geneva (GVA)", "Basel (BSL)"],
    "United States": ["New York (JFK)", "Los Angeles (LAX)", "Chicago (ORD)"],
  };

  const countries = Object.keys(airportMap);

  const [searchForm, setSearchForm] = useState({
    fromCountry: "",
    fromCity: "",
    destinationCountry: "",
    destinationCity: "",
    date: "",
  });

  const searchHref = useMemo(() => {
    const params = new URLSearchParams();

    if (searchForm.fromCity) params.set("from", searchForm.fromCity);
    if (searchForm.destinationCity) {
      params.set("destination", searchForm.destinationCity);
    }
    if (searchForm.date) params.set("date", searchForm.date);

    const query = params.toString();
    return query ? `/flights?${query}` : "/flights";
  }, [searchForm]);

  const handleChange = (field, value) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    navigate(searchHref);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col items-center lg:items-end pt-20 pb-32 px-6 lg:px-24">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-[#030712] to-[#030712] z-10" />
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Stars
              radius={100}
              depth={50}
              count={4000}
              factor={4}
              fade
              speed={1}
            />
          </Canvas>
        </div>

        <FlightStage />

        {/* Hero Content */}
        <div className="relative z-20 text-center lg:text-right max-w-4xl mt-10">
          <p className="text-amber-400 tracking-[0.3em] text-sm font-bold mb-4 uppercase">
            Global Luxury Airlines
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic leading-tight mb-4">
            Experience the World in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 font-bold not-italic">
              Ultimate Luxury
            </span>
          </h1>

          <p className="max-w-xl ml-auto text-gray-400 text-lg mb-8">
            Pinnacle of aviation excellence. Bespoke travel experiences curated
            for the world's most discerning travelers.
          </p>
        </div>

        {/* ===== FLIGHT SEARCH PANEL ===== */}
        <div className="relative z-30 w-full max-w-6xl mt-12">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Plane className="text-amber-400" size={20} />
              <span className="font-bold tracking-widest text-sm uppercase">
                Quick Flight Search
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              <SearchInput
                label="Departure Country"
                value={searchForm.fromCountry}
                onChange={(value) => {
                  handleChange("fromCountry", value);
                  handleChange("fromCity", "");
                }}
                options={countries.map((country) => ({ value: country, label: country }))}
              />

              <SearchInput
                label="Departure City"
                value={searchForm.fromCity}
                onChange={(value) => handleChange("fromCity", value)}
                options={(airportMap[searchForm.fromCountry] || []).map((city) => ({
                  value: city,
                  label: city,
                }))}
                disabled={!searchForm.fromCountry}
              />

              <SearchInput
                label="Destination Country"
                value={searchForm.destinationCountry}
                onChange={(value) => {
                  handleChange("destinationCountry", value);
                  handleChange("destinationCity", "");
                }}
                options={countries.map((country) => ({ value: country, label: country }))}
              />

              <SearchInput
                label="Destination City"
                value={searchForm.destinationCity}
                onChange={(value) => handleChange("destinationCity", value)}
                options={(airportMap[searchForm.destinationCountry] || []).map((city) => ({
                  value: city,
                  label: city,
                }))}
                disabled={!searchForm.destinationCountry}
              />

              <SearchDateInput
                label="Depart"
                value={searchForm.date}
                onChange={(value) => handleChange("date", value)}
                onKeyDown={handleKeyDown}
                icon={<Calendar size={18} />}
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Action
                </label>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:scale-[1.02] text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Search <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="text-white/70">Popular:</span>
              <Link
                to="/flights?destination=Dubai"
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Dubai
              </Link>
              <Link
                to="/flights?destination=London"
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                London
              </Link>
              <Link
                to="/flights?destination=Switzerland"
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                Switzerland
              </Link>
              <Link
                to="/flights?destination=New York"
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                New York
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESTINATIONS ===== */}
      <section className="py-20 relative z-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-bold tracking-[0.4em] text-amber-500 uppercase">
            Elite Destinations
          </h2>
          <div className="h-px flex-grow bg-white/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DestinationCard
            city="Dubai"
            code="DXB"
            img="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600"
            href="/flights?destination=Dubai"
          />
          <DestinationCard
            city="London"
            code="LON"
            img="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600"
            href="/flights?destination=London"
          />
          <DestinationCard
            city="Switzerland"
            code="ZRH"
            img="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop"
            href="/flights?destination=Switzerland"
          />
          <DestinationCard
            city="New York"
            code="NYC"
            img="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600"
            href="/flights?destination=New%20York"
          />
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon={<ShieldCheck />}
            title="Elite Safety"
            desc="Beyond Gold Standards"
          />
          <FeatureCard
            icon={<Globe />}
            title="Direct Routes"
            iconColor="text-blue-400"
            desc="150+ Hubs"
          />
          <FeatureCard
            icon={<Clock />}
            title="Punctuality"
            iconColor="text-green-400"
            desc="99.9% On-Time"
          />
        </div>
      </section>
    </div>
  );
};

/* ================= HELPERS ================= */

const SearchInput = ({ label, value, onChange, options, disabled = false }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:border-amber-500/50 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="" className="bg-[#0b1220] text-gray-400">
        Select option
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-[#0b1220] text-white">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SearchDateInput = ({ label, value, onChange, onKeyDown, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/60">
        {icon}
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-amber-500/50 transition-all outline-none [color-scheme:dark]"
      />
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc, iconColor = "text-amber-500" }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex items-center gap-6 group hover:bg-white/10 transition-all">
    <div
      className={`p-4 bg-white/5 rounded-xl ${iconColor} group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg">{title}</h4>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  </div>
);

export default Home;
