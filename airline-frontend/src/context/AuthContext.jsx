import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // This effect runs once when the app starts to persist the session
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                
                // Check if token is expired
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
    // Redirecting to the base URL is safer for hosted apps
    window.location.href = window.location.origin; 
};
    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
