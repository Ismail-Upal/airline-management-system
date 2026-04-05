import { useContext, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CreditCard,
  Eye,
  Headphones,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  PencilLine,
  Plane,
  Search,
  ShieldCheck,
  Ticket,
  User,
  Users,
  XCircle,
  Download,
} from "lucide-react";

const PassengerProfile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [toast, setToast] = useState(null);

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || user?.name || "",
    email: user?.email || user?.sub || "",
    phone: "+880 1XXXXXXXXX",
    nationality: "Bangladeshi",
  });

  const [bookings, setBookings] = useState([
    {
      id: 1,
      flightNumber: "SK-101",
      from: "Dhaka (DAC)",
      to: "Dubai (DXB)",
      date: "2026-04-15",
      time: "09:30",
      status: "Confirmed",
      seat: "12A",
      cabinClass: "Business",
      gate: "A12",
      terminal: "T1",
      price: "৳48,900",
    },
    {
      id: 2,
      flightNumber: "SK-205",
      from: "Dubai (DXB)",
      to: "London (LHR)",
      date: "2026-04-20",
      time: "14:45",
      status: "Pending",
      seat: "8C",
      cabinClass: "Economy",
      gate: "B07",
      terminal: "T2",
      price: "৳86,500",
    },
    {
      id: 3,
      flightNumber: "SK-090",
      from: "Dhaka (DAC)",
      to: "Cox's Bazar (CXB)",
      date: "2026-05-03",
      time: "08:10",
      status: "Confirmed",
      seat: "4F",
      cabinClass: "Premium Economy",
      gate: "C03",
      terminal: "Domestic",
      price: "৳6,500",
    },
  ]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BadgeCheck },
    { id: "bookings", label: "My Flights", icon: Plane },
    { id: "profile", label: "Profile", icon: User },
  ];

  const activeBookings = bookings.filter((b) => b.status !== "Cancelled");
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");

  const nextBooking = useMemo(() => {
    const now = new Date();
    return [...activeBookings]
      .filter((b) => new Date(`${b.date}T${b.time}`) >= now)
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
      )[0];
  }, [activeBookings]);

  const loyaltyMiles = activeBookings.length * 4150;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(null), 2800);
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    setEditing(false);
    showToast("Profile details updated successfully.");
  };

  const handleCancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: "Cancelled" } : booking
      )
    );

    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => ({ ...prev, status: "Cancelled" }));
    }

    showToast("Booking cancelled successfully.", "warning");
  };

  const handleCheckIn = (booking) => {
    if (booking.status !== "Confirmed") {
      showToast("Only confirmed bookings are eligible for check-in.", "warning");
      return;
    }

    showToast(`Mobile check-in opened for ${booking.flightNumber}.`);
  };

  const handleDownloadTicket = () => {
    if (!selectedBooking) {
      showToast("No booking selected.", "warning");
      return;
    }

    window.print();
  };

  const handleChangePassword = () => {
    navigate("/forgot-password");
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

      <div className="fixed top-24 right-[-60px] w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-16 left-[-50px] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {toast && (
        <div
          className={`fixed top-24 right-5 z-50 rounded-2xl border px-5 py-3 shadow-2xl backdrop-blur-2xl flex items-center gap-3 ${
            toast.type === "warning"
              ? "bg-amber-500/15 border-amber-400/20 text-amber-200"
              : "bg-emerald-500/15 border-emerald-400/20 text-emerald-200"
          }`}
        >
          {toast.type === "warning" ? (
            <AlertCircle size={18} />
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
                    Passenger Portal
                  </p>

                  <h1 className="text-4xl md:text-5xl font-serif italic leading-tight mb-3">
                    Welcome back,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 font-bold not-italic">
                      {profileForm.full_name?.split(" ")[0] || "Traveler"}
                    </span>
                  </h1>

                  <p className="text-gray-400 max-w-2xl leading-relaxed">
                    Manage your journeys, review upcoming itineraries, and keep
                    your account travel-ready from a premium passenger dashboard.
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
                    <Award size={16} />
                    Gold Member · Priority Support Enabled
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                  <HeroStat label="Active Trips" value={String(activeBookings.length)} />
                  <HeroStat label="Miles" value={loyaltyMiles.toLocaleString()} />
                  <HeroStat
                    label="Next Flight"
                    value={nextBooking ? nextBooking.flightNumber : "—"}
                  />
                  <HeroStat
                    label="Status"
                    value={confirmedBookings.length ? "Ready" : "Pending"}
                  />
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

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <OverviewStatCard
                  label="Total Bookings"
                  value={String(bookings.length)}
                  icon={<Ticket size={22} />}
                />
                <OverviewStatCard
                  label="Loyalty Miles"
                  value={loyaltyMiles.toLocaleString()}
                  icon={<Award size={22} />}
                />
                <OverviewStatCard
                  label="Next Departure"
                  value={nextBooking ? formatDate(nextBooking.date) : "No trip"}
                  icon={<Calendar size={22} />}
                />
              </div>

              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
                <GlassCard
                  eyebrow="Upcoming Journey"
                  title={
                    nextBooking
                      ? `${nextBooking.from} → ${nextBooking.to}`
                      : "No upcoming itinerary"
                  }
                  description={
                    nextBooking
                      ? `Flight ${nextBooking.flightNumber} · ${nextBooking.cabinClass} · Seat ${nextBooking.seat}`
                      : "Book a new route to see your next departure details here."
                  }
                >
                  {nextBooking ? (
                    <>
                      <div className="grid sm:grid-cols-3 gap-4 mt-6">
                        <InfoPill label="Departure Date" value={formatDate(nextBooking.date)} />
                        <InfoPill label="Departure Time" value={nextBooking.time} />
                        <InfoPill label="Terminal / Gate" value={`${nextBooking.terminal} · ${nextBooking.gate}`} />
                      </div>

                      <div className="flex flex-wrap gap-3 mt-6">
                        <ActionButton
                          onClick={() => setSelectedBooking(nextBooking)}
                          primary
                          icon={<Eye size={16} />}
                        >
                          View Ticket
                        </ActionButton>

                        <ActionButton
                          onClick={() => handleCheckIn(nextBooking)}
                          icon={<BadgeCheck size={16} />}
                        >
                          Mobile Check-in
                        </ActionButton>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6">
                      <ActionButton
                        onClick={() => navigate("/flights")}
                        primary
                        icon={<Search size={16} />}
                      >
                        Search Flights
                      </ActionButton>
                    </div>
                  )}
                </GlassCard>

                <GlassCard
                  eyebrow="Membership Benefits"
                  title="Luxury traveler privileges"
                  description="Your account is optimized for premium service, priority assistance, and streamlined bookings."
                >
                  <div className="mt-6 space-y-3">
                    <BenefitRow icon={<ShieldCheck size={16} />} text="Priority customer support" />
                    <BenefitRow icon={<BadgeCheck size={16} />} text="Faster airport service access" />
                    <BenefitRow icon={<Award size={16} />} text="Miles accrual on every eligible trip" />
                    <BenefitRow icon={<Clock3 size={16} />} text="Quick itinerary management" />
                  </div>
                </GlassCard>
              </div>

              <GlassCard
                eyebrow="Quick Actions"
                title="Everything you need before departure"
                description="Common passenger actions, redesigned to fit your home page theme and behave consistently."
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <QuickActionCard
                    icon={<Search size={22} />}
                    label="Search Flights"
                    onClick={() => navigate("/flights")}
                  />
                  <QuickActionCard
                    icon={<BadgeCheck size={22} />}
                    label="Mobile Check-in"
                    onClick={() => {
                      if (nextBooking) handleCheckIn(nextBooking);
                      else showToast("No eligible confirmed flight found.", "warning");
                    }}
                  />
                  <QuickActionCard
                    icon={<CreditCard size={22} />}
                    label="Payment Methods"
                    onClick={() => showToast("Payment methods section coming next.")}
                  />
                  <QuickActionCard
                    icon={<Headphones size={22} />}
                    label="Support"
                    onClick={() => showToast("Premium support connected.")}
                  />
                </div>
              </GlassCard>

              <GlassCard
                eyebrow="Recent Bookings"
                title="Latest flight activity"
                description="Your most recent reservations with professional status indicators and quick access."
              >
                <div className="mt-6 space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <BookingRow
                      key={booking.id}
                      booking={booking}
                      onView={() => setSelectedBooking(booking)}
                      onCancel={() => handleCancelBooking(booking.id)}
                    />
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="space-y-5">
              {bookings.length === 0 ? (
                <GlassCard
                  eyebrow="No Reservations"
                  title="You do not have any bookings yet"
                  description="Search routes and reserve your first premium journey."
                >
                  <div className="mt-6">
                    <ActionButton
                      onClick={() => navigate("/flights")}
                      primary
                      icon={<Search size={16} />}
                    >
                      Search Flights
                    </ActionButton>
                  </div>
                </GlassCard>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[24px] p-6 shadow-2xl hover:bg-white/[0.07] transition-all"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-200 px-3 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
                            <Plane size={13} />
                            {booking.flightNumber}
                          </span>

                          <StatusBadge status={booking.status} />

                          <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
                            {booking.cabinClass}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-[0.22em] mb-1">
                              From
                            </p>
                            <h3 className="text-2xl font-bold">{booking.from}</h3>
                            <p className="text-sm text-gray-400 mt-1">{formatDate(booking.date)}</p>
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
                            <h3 className="text-2xl font-bold">{booking.to}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {booking.time} · Gate {booking.gate}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid sm:grid-cols-4 gap-4">
                          <InfoPill label="Seat" value={booking.seat} />
                          <InfoPill label="Terminal" value={booking.terminal} />
                          <InfoPill label="Fare" value={booking.price} />
                          <InfoPill label="Class" value={booking.cabinClass} />
                        </div>
                      </div>

                      <div className="xl:w-[240px] grid gap-3">
                        <ActionButton
                          onClick={() => setSelectedBooking(booking)}
                          primary
                          icon={<Eye size={16} />}
                        >
                          View Ticket
                        </ActionButton>

                        <ActionButton
                          onClick={() => handleCheckIn(booking)}
                          icon={<BadgeCheck size={16} />}
                        >
                          Mobile Check-in
                        </ActionButton>

                        <ActionButton
                          onClick={() => handleCancelBooking(booking.id)}
                          danger={booking.status !== "Cancelled"}
                          disabled={booking.status === "Cancelled"}
                          icon={<XCircle size={16} />}
                        >
                          {booking.status === "Cancelled" ? "Cancelled" : "Cancel Booking"}
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="grid lg:grid-cols-[1fr_0.75fr] gap-6">
              <GlassCard
                eyebrow="Account Information"
                title="Manage your passenger details"
                description="Update your personal details in a cleaner, production-ready form."
              >
                <div className="mt-6 grid md:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name"
                    value={profileForm.full_name}
                    onChange={(value) => handleProfileChange("full_name", value)}
                    readOnly={!editing}
                    icon={<User size={16} />}
                  />

                  <InputField
                    label="Email Address"
                    value={profileForm.email}
                    onChange={(value) => handleProfileChange("email", value)}
                    readOnly
                    icon={<Mail size={16} />}
                  />

                  <InputField
                    label="Phone Number"
                    value={profileForm.phone}
                    onChange={(value) => handleProfileChange("phone", value)}
                    readOnly={!editing}
                    icon={<Users size={16} />}
                  />

                  <InputField
                    label="Nationality"
                    value={profileForm.nationality}
                    onChange={(value) => handleProfileChange("nationality", value)}
                    readOnly={!editing}
                    icon={<MapPin size={16} />}
                  />
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  {editing ? (
                    <>
                      <ActionButton
                        onClick={handleSaveProfile}
                        primary
                        icon={<CheckCircle2 size={16} />}
                      >
                        Save Changes
                      </ActionButton>
                      <ActionButton
                        onClick={() => setEditing(false)}
                        icon={<XCircle size={16} />}
                      >
                        Cancel
                      </ActionButton>
                    </>
                  ) : (
                    <ActionButton
                      onClick={() => setEditing(true)}
                      primary
                      icon={<PencilLine size={16} />}
                    >
                      Edit Profile
                    </ActionButton>
                  )}
                </div>
              </GlassCard>

              <div className="space-y-6">
                <GlassCard
                  eyebrow="Security"
                  title="Account protection"
                  description="Professional account actions styled consistently with your luxury UI."
                >
                  <div className="mt-6 grid gap-3">
                    <ActionButton
                      onClick={handleChangePassword}
                      icon={<LockKeyhole size={16} />}
                    >
                      Change Password
                    </ActionButton>
                    <ActionButton
                      onClick={handleLogout}
                      danger
                      icon={<LogOut size={16} />}
                    >
                      Logout
                    </ActionButton>
                  </div>
                </GlassCard>

                <GlassCard
                  eyebrow="Membership"
                  title="Traveler tier details"
                  description="Suggested premium account section added for a more airline-grade profile experience."
                >
                  <div className="mt-6 space-y-4">
                    <InfoPill label="Tier" value="Gold Member" />
                    <InfoPill label="Benefits" value="Priority support, faster service" />
                    <InfoPill label="Miles Balance" value={loyaltyMiles.toLocaleString()} />
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <TicketModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onDownload={handleDownloadTicket}
        />
      )}
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

const BenefitRow = ({ icon, text }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
    <div className="text-amber-400">{icon}</div>
    <span className="text-sm text-white/90">{text}</span>
  </div>
);

const BookingRow = ({ booking, onView, onCancel }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <span className="text-sm font-bold">{booking.flightNumber}</span>
        <StatusBadge status={booking.status} />
      </div>
      <p className="text-sm text-gray-400">
        {booking.from} → {booking.to}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {formatDate(booking.date)} · {booking.time} · Seat {booking.seat}
      </p>
    </div>

    <div className="flex flex-wrap gap-3">
      <ActionButton onClick={onView} icon={<Eye size={16} />}>
        View
      </ActionButton>
      <ActionButton
        onClick={onCancel}
        danger={booking.status !== "Cancelled"}
        disabled={booking.status === "Cancelled"}
        icon={<XCircle size={16} />}
      >
        {booking.status === "Cancelled" ? "Cancelled" : "Cancel"}
      </ActionButton>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusMap = {
    Confirmed:
      "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20",
    Pending: "bg-amber-500/10 text-amber-200 border border-amber-400/20",
    Cancelled: "bg-red-500/10 text-red-300 border border-red-400/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusMap[status] || "bg-white/10 text-white border border-white/10"}`}
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

const InputField = ({ label, value, onChange, readOnly, icon }) => (
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
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border py-3.5 pl-12 pr-4 text-sm outline-none transition-all ${
          readOnly
            ? "bg-white/5 border-white/10 text-gray-300"
            : "bg-white/10 border-amber-400/30 text-white focus:border-amber-500/60"
        }`}
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
    classes +=
      " bg-red-500/10 text-red-200 border border-red-400/20 hover:bg-red-500/20";
  } else if (primary) {
    classes +=
      " bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:scale-[1.02]";
  } else {
    classes +=
      " bg-white/5 text-white border border-white/10 hover:bg-white/10";
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
    </button>
  );
};

const TicketModal = ({ booking, onClose, onDownload }) => (
  <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-center justify-center px-4">
    <div className="w-full max-w-2xl bg-[#07101f] border border-white/10 rounded-[28px] shadow-2xl overflow-hidden">
      <div className="p-6 md:p-7 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-2">
            E-Ticket Preview
          </p>
          <h3 className="text-2xl font-bold">{booking.flightNumber}</h3>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
        >
          <XCircle size={18} />
        </button>
      </div>

      <div className="p-6 md:p-7 space-y-5">
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
              From
            </p>
            <h4 className="text-2xl font-bold">{booking.from}</h4>
          </div>

          <div className="flex items-center justify-center">
            <Plane className="text-amber-400" size={20} />
          </div>

          <div className="md:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">
              To
            </p>
            <h4 className="text-2xl font-bold">{booking.to}</h4>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          <InfoPill label="Date" value={formatDate(booking.date)} />
          <InfoPill label="Time" value={booking.time} />
          <InfoPill label="Seat" value={booking.seat} />
          <InfoPill label="Class" value={booking.cabinClass} />
          <InfoPill label="Gate" value={booking.gate} />
          <InfoPill label="Terminal" value={booking.terminal} />
          <InfoPill label="Fare" value={booking.price} />
          <InfoPill label="Status" value={booking.status} />
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionButton primary icon={<Download size={16} />} onClick={onDownload}>
            Download Ticket
          </ActionButton>
          <ActionButton onClick={onClose}>Close</ActionButton>
        </div>
      </div>
    </div>
  </div>
);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default PassengerProfile;
