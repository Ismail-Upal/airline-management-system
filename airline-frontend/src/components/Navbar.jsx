import { Link } from "react-router-dom";
import { useContext, useRef, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import Lottie from "lottie-react";
import logoAnimation from "../assets/logo.json";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const lottieRef = useRef(null);
  const introPlayed = useRef(false);

  // After the first full play (intro bounce), loop only the float section (frame 20→150)
  const handleComplete = useCallback(() => {
    introPlayed.current = true;
    lottieRef.current?.goToAndPlay(20, true); // frame 20 = start of float loop
  }, []);

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
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">

        <Link to="/" className="inline-flex items-center min-w-0">
          {/* Cyan glow drop-shadow makes the logo pop instantly */}
          <div
            className="h-16 w-[210px] flex-shrink-0"
            style={{ filter: "drop-shadow(0 0 10px rgba(0,230,255,0.55)) drop-shadow(0 0 22px rgba(0,200,255,0.25))" }}
          >
            <Lottie
              lottieRef={lottieRef}
              animationData={logoAnimation}
              loop={false}          // don't auto-loop the whole thing
              autoplay={true}       // play intro on mount (page load / reload)
              onComplete={handleComplete}  // after intro → float-only loop
              className="h-full w-full"
            />
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            className="hidden md:inline-block text-sm font-medium text-gray-300 hover:text-amber-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/flights"
            className="hidden md:inline-block text-sm font-medium text-gray-300 hover:text-amber-300 transition-colors"
          >
            Flights
          </Link>

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
