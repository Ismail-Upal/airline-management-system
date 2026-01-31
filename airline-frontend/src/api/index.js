import axios from "axios";

const API = axios.create({
  baseURL: "https://airline-backend-cdzk.onrender.com", // Hardcoded for now
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// LOGIN (OAuth2PasswordRequestForm → FormData)
export const login = (formData) => {
  const data = new FormData();
  data.append("username", formData.email);
  data.append("password", formData.password);
  return API.post("/auth/login", data);
};

// REGISTER (JSON → Pydantic schema)
export const register = (formData) =>
  API.post("/auth/register", {
    email: formData.email,
    password: formData.password,
    full_name: formData.full_name, // Ensure the key on the LEFT is 'full_name'
  });

// FLIGHTS
export const fetchFlights = (params) =>
  API.get("/flights/flights", { params });

// BOOKINGS
export const bookFlight = (data) =>
  API.post("/bookings", data);

export default API;
