import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  CircleOff,
  Clock3,
  CreditCard,
  Eye,
  Headphones,
  LockKeyhole,
  LogOut,
  Mail,
  Plane,
  Printer,
  Search,
  ShieldCheck,
  Ticket,
  User,
  Luggage,
} from "lucide-react";
import {
  searchCheckinPassenger,
  completeCheckin,
  printBoardingPass,
  changePassengerSeat,
  addPassengerBaggage,
  getFlightManifest,
} from "../api";

const StaffProfile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [toast, setToast] = useState(null);

  const assignedFlights = [
    {
      id: 1,
      flightNumber: "SK-101",
      route: "DAC → DXB",
      from: "Dhaka (DAC)",
      to: "Dubai (DXB)",
      status: "Boarding",
      passengers: 156,
      capacity: 180,
      departure: "14:30",
      gate: "B12",
      terminal: "T1",
    },
    {
      id: 2,
      flightNumber: "SK-205",
      route: "DXB → LHR",
      from: "Dubai (DXB)",
      to: "London (LHR)",
      status: "Scheduled",
      passengers: 189,
      capacity: 220,
      departure: "22:15",
      gate: "C08",
      terminal: "T2",
    },
  ];

  const recentCheckins = [
    {
      id: 1,
      passenger: "John Doe",
      seat: "12A",
      time: "10:30 AM",
      status: "Completed",
      flight: "SK-101",
    },
    {
      id: 2,
      passenger: "Jane Smith",
      seat: "8C",
      time: "10:45 AM",
      status: "Completed",
      flight: "SK-101",
    },
    {
      id: 3,
      passenger: "Mike Johnson",
      seat: "15B",
      time: "11:00 AM",
      status: "Pending",
      flight: "SK-101",
    },
  ];

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Briefcase },
    { id: "checkin", label: "Check-In", icon: BadgeCheck },
    { id: "flights", label: "My Flights", icon: Plane },
    { id: "profile", label: "Profile", icon: User },
  ];

  const pendingCheckins = recentCheckins.filter((c) => c.status === "Pending").length;
  const boardingFlights = assignedFlights.filter((f) => f.status === "Boarding").length;

  const totalLoad = useMemo(() => {
    const totalPassengers = assignedFlights.reduce((sum, f) => sum + f.passengers, 0);
    const totalCapacity = assignedFlights.reduce((sum, f) => sum + f.capacity, 0);
    return totalCapacity ? Math.round((totalPassengers / totalCapacity) * 100) : 0;
  }, [assignedFlights]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(null), 2600);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showToast("Enter a booking reference or passport number.", "warning");
      return;
    }

    try {
      const { data } = await searchCheckinPassenger(searchQuery);
      setSearchResult(data);
      showToast("Passenger record found.");
    } catch (err) {
      setSearchResult(null);
      showToast(err.response?.data?.detail || "Passenger not found.", "warning");
    }
  };

  const handleCompleteCheckin = async () => {
    if (!searchResult?.booking_id) {
      showToast("Search for a passenger first.", "warning");
      return;
    }

    try {
      await completeCheckin(searchResult.booking_id);
      setSearchResult((prev) => ({
        ...prev,
        status: "Checked In",
      }));
      showToast("Check-in completed successfully.");
    } catch (err) {
      showToast(err.response?.data?.detail || "Check-in failed.", "warning");
    }
  };

  const handlePrintPass = async () => {
    if (!searchResult?.booking_id) {
      showToast("No passenger selected.", "warning");
      return;
    }

    try {
      const { data } = await printBoardingPass(searchResult.booking_id);
      console.log("Boarding pass:", data);
      showToast("Boarding pass generated successfully.");
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Could not generate boarding pass.",
        "warning"
      );
    }
  };

  const handleChangeSeat = async () => {
    if (!searchResult?.booking_id) {
      showToast("No passenger selected.", "warning");
      return;
    }

    try {
      const newSeat = "14C";
      await changePassengerSeat(searchResult.booking_id, newSeat);
      setSearchResult((prev) => ({
        ...prev,
        seat: newSeat,
      }));
      showToast("Seat updated successfully.");
    } catch (err) {
      showToast(err.response?.data?.detail || "Seat change failed.", "warning");
    }
  };

  const handleAddBaggage = async () => {
    if (!searchResult?.booking_id) {
      showToast("No passenger selected.", "warning");
      return;
    }

    try {
      const { data } = await addPassengerBaggage(searchResult.booking_id, 1);
      setSearchResult((prev) => ({
        ...prev,
        baggage: data?.baggage ?? prev?.baggage,
      }));
      showToast("Extra baggage added successfully.");
    } catch (err) {
      showToast(err.response?.data?.detail || "Could not add baggage.", "warning");
    }
  };

  const handleViewManifest = async (flightNumber) => {
    try {
      const { data } = await getFlightManifest(flightNumber);
      console.log("Manifest:", data);
      showToast(`Manifest loaded for ${flightNumber}.`);
    } catch (err) {
      showToast(err.response?.data?.detail || "Could not load manifest.", "warning");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser?.();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-[#030712] to-amber-900/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.4} />
        </Canvas>
      </div>

      <div className="fixed top-20 right-[-60px] w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-10 left-[-40px] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {toast && (
        <div
          className={`fixed top-24 right-5 z-50 rounded-2xl border px-5 py-3 shadow-2xl backdrop-blur-2xl flex items-center gap-3 ${
            toast.type === "warning"
              ? "bg-amber-500/15 border-amber-400/20 text-amber-200"
              : "bg-emerald-500/15 border-emerald-400/20 text-emerald-200"
          }`}
        >
          {toast.type === "warning" ? (
            <CircleOff size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <section className="mb-8">
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div>
                  <p className="text-amber-400 tracking-[0.35em] text-xs font-bold uppercase mb-3">
                    Staff Operations Portal
                  </p>

                  <h1 className="text-4xl md:text-5xl font-serif italic leading-tight mb-3">
                    Good day,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 font-bold not-italic">
                      {user?.full_name?.split(" ")[0] || "Staff"}
                    </span>
                  </h1>

                  <p className="text-gray-400 max-w-2xl leading-relaxed">
                    Monitor departures, process passenger check-ins, and manage
                    gate-side operations from a premium control workspace.
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
                    <ShieldCheck size={16} />
                    Employee ID: {user?.employee_id || "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                  <HeroStat label="Check-ins" value="87" />
                  <HeroStat label="Flights" value={String(assignedFlights.length)} />
                  <HeroStat label="Boarding" value={String(boardingFlights)} />
                  <HeroStat label="Load" value={`${totalLoad}%`} />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex gap-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </section>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <OverviewStatCard
                  label="Today's Check-ins"
                  value="87"
                  icon={<BadgeCheck size={22} />}
                />
                <OverviewStatCard
                  label="Assigned Flights"
                  value={String(assignedFlights.length)}
                  icon={<Plane size={22} />}
                />
                <OverviewStatCard
                  label="Pending"
                  value={String(pendingCheckins)}
                  icon={<Clock3 size={22} />}
                />
                <OverviewStatCard
                  label="Shift"
                  value="ON"
                  icon={<ShieldCheck size={22} />}
                />
              </div>

              <GlassCard
                eyebrow="Today's Flights"
                title="Operational route assignments"
                description="Your active departures with live passenger load visibility and quick action access."
              >
                <div className="mt-6 space-y-4">
                  {assignedFlights.map((flight) => (
                    <FlightRow
                      key={flight.id}
                      flight={flight}
                      onCheckin={() => setActiveTab("checkin")}
                    />
                  ))}
                </div>
              </GlassCard>

              <GlassCard
                eyebrow="Recent Check-ins"
                title="Passenger processing activity"
                description="A live-style summary of recent check-in events for your assigned flights."
              >
                <div className="mt-6 space-y-4">
                  {recentCheckins.map((checkin) => (
                    <CheckinRow key={checkin.id} checkin={checkin} />
                  ))}
                </div>
              </GlassCard>

              <GlassCard
                eyebrow="Operations Shortcuts"
                title="Staff quick actions"
                description="Suggested additions for a more airline-grade staff workspace."
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <QuickActionCard
                    icon={<BadgeCheck size={22} />}
                    label="Open Check-in"
                    onClick={() => setActiveTab("checkin")}
                  />
                  <QuickActionCard
                    icon={<Printer size={22} />}
                    label="Print Queue"
                    onClick={() => showToast("Print queue opened.")}
                  />
                  <QuickActionCard
                    icon={<Headphones size={22} />}
                    label="Support Desk"
                    onClick={() => showToast("Support desk connected.")}
                  />
                  <QuickActionCard
                    icon={<Calendar size={22} />}
                    label="Shift Schedule"
                    onClick={() => showToast("Shift schedule panel coming next.")}
                  />
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "checkin" && (
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <GlassCard
                eyebrow="Passenger Check-In"
                title="Search and process passenger records"
                description="Look up a booking reference or passport number to complete gate-side actions quickly."
              >
                <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
                      <Search size={17} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter booking ref or passport number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold px-6 py-3.5 hover:scale-[1.02] transition-all"
                  >
                    Search
                  </button>
                </form>

                {searchResult && (
                  <div className="mt-6 rounded-[24px] border border-emerald-400/20 bg-emerald-500/10 p-5">
                    <p className="text-xs font-bold text-emerald-300 uppercase tracking-[0.28em] mb-4">
                      Passenger Found
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <InfoPill label="Passenger" value={searchResult.passenger} />
                      <InfoPill label="Booking" value={searchResult.booking} />
                      <InfoPill label="Flight" value={searchResult.flight} />
                      <InfoPill label="Seat" value={searchResult.seat} />
                      <InfoPill label="Status" value={searchResult.status} />
                      <InfoPill label="Gate" value={searchResult.gate} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 mt-5">
                      <ActionButton
                        primary
                        onClick={handleCompleteCheckin}
                        icon={<BadgeCheck size={16} />}
                      >
                        Complete Check-in
                      </ActionButton>

                      <ActionButton
                        onClick={handlePrintPass}
                        icon={<Printer size={16} />}
                      >
                        Print Pass
                      </ActionButton>

                      <ActionButton
                        onClick={handleChangeSeat}
                        icon={<Ticket size={16} />}
                      >
                        Change Seat
                      </ActionButton>

                      <ActionButton
                        onClick={handleAddBaggage}
                        icon={<Luggage size={16} />}
                      >
                        Add Baggage
                      </ActionButton>
                    </div>
                  </div>
                )}
              </GlassCard>

              <div className="space-y-6">
                <GlassCard
                  eyebrow="Procedure"
                  title="Standard staff check-in flow"
                  description="A cleaner, professional operational checklist for frontline staff."
                >
                  <div className="mt-6 space-y-3">
                    <BenefitRow text="Verify passenger identity and travel documents." />
                    <BenefitRow text="Search booking by reference or passport details." />
                    <BenefitRow text="Confirm seat and baggage allowance." />
                    <BenefitRow text="Issue boarding pass and gate briefing." />
                  </div>
                </GlassCard>

                <GlassCard
                  eyebrow="Quick Tools"
                  title="Station support actions"
                  description="Useful side actions for airport staff workflows."
                >
                  <div className="mt-6 grid gap-3">
                    <ActionButton
                      onClick={() => showToast("Seat map opened.")}
                      icon={<Eye size={16} />}
                    >
                      Open Seat Map
                    </ActionButton>
                    <ActionButton
                      onClick={() => showToast("Payment terminal connected.")}
                      icon={<CreditCard size={16} />}
                    >
                      Ancillary Payment
                    </ActionButton>
                    <ActionButton
                      onClick={() => showToast("Passenger assistance requested.")}
                      icon={<Headphones size={16} />}
                    >
                      Passenger Assistance
                    </ActionButton>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {activeTab === "flights" && (
            <div className="space-y-5">
              {assignedFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[24px] p-6 shadow-2xl hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
                          <Plane size={13} />
                          {flight.flightNumber}
                        </span>
                        <StatusBadge status={flight.status} />
                      </div>

                      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-[0.22em] mb-1">
                            From
                          </p>
                          <h3 className="text-2xl font-bold">{flight.from}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Terminal {flight.terminal}
                          </p>
                        </div>

                        <div className="flex items-center justify-center">
                          <div className="w-full md:w-28 flex items-center gap-3 text-gray-500">
                            <div className="h-px flex-1 bg-white/10" />
                            <ArrowRight size={18} className="text-amber-400" />
                            <div className="h-px flex-1 bg-white/10" />
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-[0.22em] mb-1">
                            To
                          </p>
                          <h3 className="text-2xl font-bold">{flight.to}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Gate {flight.gate} · Departure {flight.departure}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid sm:grid-cols-4 gap-4">
                        <InfoPill label="Passengers" value={`${flight.passengers}`} />
                        <InfoPill label="Capacity" value={`${flight.capacity}`} />
                        <InfoPill
                          label="Load Factor"
                          value={`${Math.round((flight.passengers / flight.capacity) * 100)}%`}
                        />
                        <InfoPill label="Status" value={flight.status} />
                      </div>
                    </div>

                    <div className="xl:w-[220px] grid gap-3">
                      <ActionButton
                        primary
                        onClick={() => setActiveTab("checkin")}
                        icon={<BadgeCheck size={16} />}
                      >
                        Start Check-in
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleViewManifest(flight.flightNumber)}
                        icon={<Eye size={16} />}
                      >
                        View Manifest
                      </ActionButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="grid lg:grid-cols-[1fr_0.75fr] gap-6">
              <GlassCard
                eyebrow="Staff Account"
                title="Employee profile details"
                description="Professional account presentation aligned to your luxury airline theme."
              >
                <div className="mt-6 grid md:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name"
                    value={user?.full_name || ""}
                    icon={<User size={16} />}
                  />
                  <InputField
                    label="Email Address"
                    value={user?.sub || user?.email || ""}
                    icon={<Mail size={16} />}
                  />
                  <InputField
                    label="Employee ID"
                    value={user?.employee_id || ""}
                    icon={<Briefcase size={16} />}
                  />
                  <InputField
                    label="Account Role"
                    value="Staff"
                    icon={<ShieldCheck size={16} />}
                  />
                </div>
              </GlassCard>

              <div className="space-y-6">
                <GlassCard
                  eyebrow="Security"
                  title="Account actions"
                  description="Operational account controls for staff access."
                >
                  <div className="mt-6 grid gap-3">
                    <ActionButton icon={<LockKeyhole size={16} />}>
                      Change Password
                    </ActionButton>
                    <ActionButton
                      danger
                      onClick={handleLogout}
                      icon={<LogOut size={16} />}
                    >
                      Logout
                    </ActionButton>
                  </div>
                </GlassCard>

                <GlassCard
                  eyebrow="Permissions"
                  title="Current access scope"
                  description="Suggested airline-style information card for employee accounts."
                >
                  <div className="mt-6 space-y-4">
                    <InfoPill label="Portal Access" value="Check-in & Operations" />
                    <InfoPill label="Shift Status" value="Active" />
                    <InfoPill label="Assigned Flights" value={String(assignedFlights.length)} />
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeroStat = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-xl">
    <p className="text-xs uppercase tracking-[0.22em] text-gray-500 font-bold mb-2">
      {label}
    </p>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const GlassCard = ({ eyebrow, title, description, children }) => (
  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[28px] p-6 md:p-7 shadow-2xl">
    <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.32em] mb-3">
      {eyebrow}
    </p>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
    {children}
  </div>
);

const OverviewStatCard = ({ label, value, icon }) => (
  <div className="bg-white/5 border border-white/10 rounded-[24px] p-6 backdrop-blur-2xl shadow-2xl">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-[0.24em] font-bold mb-2">
          {label}
        </p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
        {icon}
      </div>
    </div>
  </div>
);

const QuickActionCard = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left hover:bg-white/10 transition-all"
  >
    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
      {icon}
    </div>
    <p className="font-semibold">{label}</p>
  </button>
);

const BenefitRow = ({ text }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
    <div className="w-2 h-2 rounded-full bg-amber-400" />
    <span className="text-sm text-white/90">{text}</span>
  </div>
);

const FlightRow = ({ flight, onCheckin }) => {
  const loadPct = Math.round((flight.passengers / flight.capacity) * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3 py-1 rounded-full text-sm font-bold">
            {flight.flightNumber}
          </span>

          <div>
            <p className="text-white text-sm font-medium">{flight.route}</p>
            <p className="text-xs text-gray-500">
              Departure: {flight.departure} · Gate {flight.gate} · {flight.passengers}/{flight.capacity} pax
            </p>

            <div className="mt-2 h-1.5 w-48 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  loadPct > 90 ? "bg-red-500" : "bg-gradient-to-r from-amber-500 to-amber-600"
                }`}
                style={{ width: `${loadPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={flight.status} />
          <ActionButton primary onClick={onCheckin} icon={<BadgeCheck size={16} />}>
            Open Check-in
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

const CheckinRow = ({ checkin }) => (
  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
    <div>
      <p className="font-semibold text-white text-sm">{checkin.passenger}</p>
      <p className="text-xs text-gray-500">
        Seat {checkin.seat} · {checkin.flight} · {checkin.time}
      </p>
    </div>
    <StatusBadge status={checkin.status} />
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    Boarding: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20",
    Scheduled: "bg-blue-500/10 text-blue-300 border border-blue-400/20",
    Completed: "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20",
    Pending: "bg-amber-500/10 text-amber-200 border border-amber-400/20",
    "Ready for Check-in":
      "bg-blue-500/10 text-blue-300 border border-blue-400/20",
    "Checked In":
      "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        map[status] || "bg-white/10 text-white border border-white/10"
      }`}
    >
      {status}
    </span>
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

const InputField = ({ label, value, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.22em]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
        {icon}
      </div>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-sm text-gray-300 outline-none"
      />
    </div>
  </div>
);

const ActionButton = ({
  children,
  onClick,
  primary = false,
  danger = false,
  disabled = false,
  icon,
}) => {
  let classes =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all";

  if (disabled) {
    classes += " bg-white/10 text-gray-500 cursor-not-allowed";
  } else if (danger) {
    classes += " bg-red-500/10 text-red-200 border border-red-400/20 hover:bg-red-500/20";
  } else if (primary) {
    classes += " bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:scale-[1.02]";
  } else {
    classes += " bg-white/5 text-white border border-white/10 hover:bg-white/10";
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
    </button>
  );
};

export default StaffProfile;
