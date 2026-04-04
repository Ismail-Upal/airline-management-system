import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User, Plane } from "lucide-react";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  const firstName =
    user?.full_name?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";

  const role = user?.role?.toLowerCase?.() || "passenger";
  const profilePath =
    role === "staff" ? "/profile/staff" : "/profile/passenger";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#030712]/85 backdrop-blur-2xl text-white shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="inline-flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10 text-amber-400 shadow-lg">
            <Plane size={18} />
          </div>

          <div className="leading-tight min-w-0">
            <p className="text-lg font-bold tracking-[0.18em] text-white">
              SKYLINK
            </p>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300/80">
              Airlines
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-300 hover:text-amber-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/flights"
            className="text-gray-300 hover:text-amber-300 transition-colors"
          >
            Flights
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
                <User size={16} className="text-amber-400" />
                Hi, {firstName}
              </span>

              <Link
                to={profilePath}
                className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-500/20 transition-all"
              >
                <User size={16} />
                Profile
              </Link>

              <button
                type="button"
                onClick={logoutUser}
                className="inline-flex items-center gap-2 rounded-full border border-red-400/15 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:text-amber-300 transition-all"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-sm font-bold text-black hover:scale-[1.02] transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
