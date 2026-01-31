import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          SKYLINK <span className="font-light text-blue-200">AIRLINES</span>
        </Link>
        
        <div className="space-x-6 flex items-center">
          <Link to="/flights" className="hover:text-blue-200">Search Flights</Link>
          
          {user ? (
            <>
              {/* Added optional chaining ?. and fallback to email if name is missing */}
              <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                Hi, {user.full_name || user.email || 'User'}
              </span>
              <button 
                onClick={logoutUser} 
                className="text-red-300 hover:text-red-100 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-white text-blue-800 px-4 py-2 rounded font-bold hover:bg-blue-50 transition-colors">
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
