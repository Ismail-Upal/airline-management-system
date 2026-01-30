import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // FIXED: Added curly braces for named import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // This effect runs once when the app starts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Check if token is valid and decode user data
                const decoded = jwtDecode(token);
                
                // Optional: Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    console.warn("Token expired");
                    logoutUser();
                } else {
                    setUser(decoded);
                }
            } catch (e) {
                console.error("Token decoding failed:", e);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const loginUser = (token) => {
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (e) {
            console.error("Error decoding token during login:", e);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optional: Redirect to login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
