// Login.jsx - Role-based: Passenger & Staff only
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { login } from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('passenger');
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const { loginUser }                   = useContext(AuthContext);
  const navigate                        = useNavigate();

  const roles = [
    { id: 'passenger', label: 'Passenger', icon: '🧳', desc: 'Book & manage flights' },
    { id: 'staff',     label: 'Staff',     icon: '🎫', desc: 'Check-in & operations'  },
  ];

  const accentColor = selectedRole === 'staff'
    ? { ring: 'rgba(245,158,11,0.7)', glow: 'rgba(245,158,11,0.2)', border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', active: 'from-amber-500 to-orange-500' }
    : { ring: 'rgba(102,126,234,0.7)', glow: 'rgba(102,126,234,0.2)', border: 'border-[#667eea]/30', bg: 'bg-[#667eea]/10', text: 'text-[#667eea]', active: 'from-[#667eea] to-[#764ba2]' };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const { data } = await login({ ...formData, role: selectedRole });

    const apiRole = data?.role || data?.user?.role || selectedRole;

    // Stop wrong portal access
    if (apiRole !== selectedRole) {
      setError(
        `This account belongs to ${apiRole}. Please use the ${apiRole} login tab.`
      );
      setLoading(false);
      return;
    }

    loginUser(data.access_token);

    if (selectedRole === "staff") {
      navigate("/profile/staff", { replace: true });
    } else {
      navigate("/profile/passenger", { replace: true });
    }
  } catch (err) {
    setError(err.response?.data?.detail || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="dark-page relative min-h-screen bg-[#030712] flex items-center justify-center overflow-hidden">

      {/* Stars Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#667eea]/10 via-[#030712] to-[#764ba2]/10 z-10" />
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Ambient glow — shifts color with role */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ${
        selectedRole === 'staff' ? 'bg-amber-500/8' : 'bg-[#667eea]/10'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700 ${
        selectedRole === 'staff' ? 'bg-orange-600/8' : 'bg-[#764ba2]/10'
      }`} />

      {/* Card */}
      <div className="relative z-20 w-full max-w-md px-6 animate-fadeIn">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-float inline-block">
              {selectedRole === 'staff' ? '🎫' : '✈️'}
            </div>
            <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Welcome Back
            </h1>
            <p className={`text-sm tracking-[0.2em] uppercase font-semibold ${accentColor.text}`}>
              SkyLink Airlines
            </p>
            <div className={`h-px bg-gradient-to-r from-transparent via-current to-transparent mt-4 opacity-40 ${accentColor.text}`} />
          </div>

          {/* Role Selector */}
          <div className="flex gap-2 mb-7 bg-white/5 border border-white/10 rounded-2xl p-1.5">
            {roles.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => { setSelectedRole(r.id); setError(''); }}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedRole === r.id
                    ? `bg-gradient-to-r ${accentColor.active} text-white shadow-lg`
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Role hint */}
          <p className={`text-xs text-center mb-5 ${accentColor.text} opacity-70`}>
            {selectedRole === 'staff'
              ? '🔐 Staff portal — employee credentials required'
              : '🧳 Passenger portal — book and manage your flights'}
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder={selectedRole === 'staff' ? 'staff@skylink.com' : 'you@skylink.com'}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-white bg-gradient-to-r ${accentColor.active} border-0`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner w-5 h-5 border-2" /> Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {selectedRole === 'staff' ? '🎫' : '✈️'} Login as {selectedRole === 'staff' ? 'Staff' : 'Passenger'}
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 space-y-3 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold transition-colors ${accentColor.text} hover:opacity-80`}>
                Register here
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Admin?{' '}
              <a href="https://admin.skylink.com" className="text-[#667eea]/60 hover:text-[#667eea] transition-colors">
                Go to Admin Portal →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
