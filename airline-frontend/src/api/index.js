import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
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
    full_name: formData.full_name,
    role: formData.role,
    employee_id: formData.employee_id || null,
  });

// FLIGHTS
export const fetchFlights = (params) =>
  API.get("/flights", { params });

// BOOKINGS
export const bookFlight = (data) =>
  API.post("/bookings", data);

// FORGOT PASSWORD
export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

// RESET PASSWORD
export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);

// =============================
// STAFF CHECK-IN / OPERATIONS
// =============================

// Search passenger by booking ref or passport
export const searchCheckinPassenger = (query) =>
  API.get("/checkin/search", {
    params: { query },
  });

// Complete check-in
export const completeCheckin = (bookingId) =>
  API.post("/checkin/complete", {
    booking_id: bookingId,
  });

// Get boarding pass data
export const printBoardingPass = (bookingId) =>
  API.get(`/checkin/boarding-pass/${bookingId}`);

// Change passenger seat
export const changePassengerSeat = (bookingId, seat) =>
  API.put("/checkin/change-seat", {
    booking_id: bookingId,
    seat,
  });

// Add baggage
export const addPassengerBaggage = (bookingId, bags) =>
  API.put("/checkin/add-baggage", {
    booking_id: bookingId,
    bags,
  });

// Get flight manifest
export const getFlightManifest = (flightNumber) =>
  API.get(`/checkin/manifest/${flightNumber}`);

export default API;
