import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://airline-backend-cdzk.onrender.com',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// LOGIN: Matches /auth/login in your docs
export const login = (formData) => {
    const data = new FormData();
    data.append('username', formData.email); 
    data.append('password', formData.password);
    return API.post('/auth/login', data);
};

// REGISTER: Only works if you add @router.post("/register") to auth.py!
export const register = (formData) => API.post('/auth/register', formData);

// FLIGHTS: Matches /flights/flights/ in your docs
export const fetchFlights = (searchParams) => API.get('/flights/flights/', { params: searchParams });

// BOOKINGS: Matches /bookings/ in your docs
export const bookFlight = (bookingData) => API.post('/bookings/', bookingData);
