import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { jwtDecode } from "jwt-decode";
import { Mail, LockKeyhole, Briefcase, Plane, UserCircle2 } from "lucide-react";
import { login } from "../api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("passenger");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    staff_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const roles = [
    {
      id: "passenger",
      label: "Passenger",
      icon: <UserCircle2 size={16} />,
      desc: "Book and manage flights",
    },
    {
      id: "staff",
      label: "Staff",
      icon: <Briefcase size={16} />,
      desc: "Check-in and operations",
    },
  ];

  const accentColor =
    selectedRole === "staff"
      ? {
          text: "text-amber-400",
          active: "from-amber-500 to-orange-500",
          glowA: "bg-amber-500/8",
          glowB: "bg-orange-600/8",
        }
      : {
          text: "text-blue-300",
          active: "from-blue-500 to-indigo-500",
          glowA: "bg-blue-500/10",
          glowB: "bg-indigo-500/10",
        };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setError("");
    setFormData((prev) => ({
      ...prev,
      staff_id: roleId === "staff" ? prev.staff_id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await login({
        ...formData,
        role: selectedRole,
      });

      const decoded = jwtDecode(data.access_token);
      const apiRole = (
        data?.role ||
        data?.user?.role ||
        decoded?.role ||
        selectedRole
      )?.toLowerCase();

      const chosenRole = selectedRole.toLowerCase();

      if (chosenRole === "staff") {
        const userEmployeeId = String(
          data?.user?.employee_id || decoded?.employee_id || ""
        ).toUpperCase();

        const inputStaffId = String(formData.staff_id || "").toUpperCase();

        if (!inputStaffId || userEmployeeId !== inputStaffId) {
          throw new Error("Invalid Staff ID for this account");
        }
      }

      if (apiRole !== chosenRole) {
        throw new Error(
          `This account belongs to ${apiRole}. Please use the ${apiRole} login tab.`
        );
      }

      const mergedUser = {
        ...(data?.user || {}),
        ...decoded,
        role: chosenRole,
        email: data?.user?.email || decoded?.email || decoded?.sub || formData.email,
        full_name: data?.user?.full_name || decoded?.full_name || "",
        employee_id: data?.user?.employee_id || decoded?.employee_id || "",
      };

      loginUser(data.access_token, mergedUser);

      const redirectPath =
        location.state?.from?.pathname ||
        (chosenRole === "staff" ? "/profile/staff" : "/profile/passenger");

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden text-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-[#030712] to-amber-900/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>

      <div
        className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ${accentColor.glowA}`}
      />
      <div
        className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ${accentColor.glowB}`}
      />

      <div className="relative z-20 w-full max-w-md px-6">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-amber-400">
              {selectedRole === "staff" ? <Briefcase size={28} /> : <Plane size={28} />}
            </div>

            <h1 className="text-3xl font-bold text-white mb-1">Welcome Back</h1>

            <p className={`text-sm tracking-[0.2em] uppercase font-semibold ${accentColor.text}`}>
              SkyLink Airlines
            </p>

            <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent mt-4 opacity-40 ${accentColor.text}`} />
          </div>

          <div className="flex gap-2 mb-7 bg-white/5 border border-white/10 rounded-2xl p-1.5">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedRole === role.id
                    ? `bg-gradient-to-r ${accentColor.active} text-white shadow-lg`
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {role.icon}
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <p className={`text-xs text-center mb-5 ${accentColor.text} opacity-80`}>
            {selectedRole === "staff"
              ? "Staff portal — employee credentials required"
              : "Passenger portal — book and manage your flights"}
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FieldLabel label="Email Address" />
            <InputField
              type="email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              placeholder={
                selectedRole === "staff" ? "staff@skylink.com" : "you@skylink.com"
              }
              icon={<Mail size={16} />}
              disabled={loading}
            />

            <FieldLabel label="Password" />
            <InputField
              type="password"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              placeholder="••••••••••"
              icon={<LockKeyhole size={16} />}
              disabled={loading}
            />

            {selectedRole === "staff" && (
              <>
                <FieldLabel label="Staff ID" />
                <InputField
                  type="text"
                  value={formData.staff_id}
                  onChange={(value) => handleChange("staff_id", value.toUpperCase())}
                  placeholder="e.g. STAFF-001"
                  icon={<Briefcase size={16} />}
                  disabled={loading}
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-gradient-to-r ${accentColor.active} py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.01]`}
            >
              {loading ? "Signing In..." : `Login as ${selectedRole === "staff" ? "Staff" : "Passenger"}`}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-500">
              <Link
                to="/forgot-password"
                className={`font-semibold transition-colors ${accentColor.text} hover:opacity-80`}
              >
                Forgot password?
              </Link>
            </p>

            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className={`font-semibold transition-colors ${accentColor.text} hover:opacity-80`}
              >
                Register here
              </Link>
            </p>

            <p className="text-xs text-gray-600">
              Admin?{" "}
              <a
                href="https://admin.skylink.com"
                className="text-blue-300/70 hover:text-blue-300 transition-colors"
              >
                Go to Admin Portal →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FieldLabel = ({ label }) => (
  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
    {label}
  </label>
);

const InputField = ({ type, value, onChange, placeholder, icon, disabled }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/70">
      {icon}
    </div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      disabled={disabled}
      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500/50 transition-all"
    />
  </div>
);

export default Login;
