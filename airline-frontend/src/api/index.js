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

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// LOGIN
export const login = (formData) => {
  const data = new FormData();
  data.append("username", formData.email);
  data.append("password", formData.password);
  return API.post("/auth/login", data);
};

// REGISTER
export const register = (formData) =>
  API.post("/auth/register", {
    email: formData.email,
    password: formData.password,
    full_name: formData.full_name,
    role: formData.role,
    employee_id: formData.employee_id || null,
  });

// FLIGHTS
export const fetchFlights = (params) => API.get("/flights", { params });

// BOOKINGS
export const bookFlight = ({ flight_id, seat_number = null, user_id = null }) => {
  const storedUser = getStoredUser();

  return API.post("/bookings", {
    flight_id,
    seat_number,
    user_id: user_id || storedUser?.user_id || storedUser?.id,
  });
};

export const getMyBookings = (userId = null) => {
  const storedUser = getStoredUser();
  const resolvedUserId = userId || storedUser?.user_id || storedUser?.id;

  return API.get("/bookings/my-bookings", {
    params: { user_id: resolvedUserId },
  });
};

export const cancelBooking = (bookingId, userId = null) => {
  const storedUser = getStoredUser();
  const resolvedUserId = userId || storedUser?.user_id || storedUser?.id;

  return API.put(`/bookings/${bookingId}/cancel`, null, {
    params: { user_id: resolvedUserId },
  });
};

// FORGOT PASSWORD
export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

// RESET PASSWORD
export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);

// STAFF CHECK-IN / OPERATIONS
export const searchCheckinPassenger = (query) =>
  API.get("/checkin/search", {
    params: { query },
  });

export const completeCheckin = (bookingId) =>
  API.post("/checkin/complete", {
    booking_id: bookingId,
  });

export const printBoardingPass = (bookingId) =>
  API.get(`/checkin/boarding-pass/${bookingId}`);

export const changePassengerSeat = (bookingId, seat) =>
  API.put("/checkin/change-seat", {
    booking_id: bookingId,
    seat,
  });

export const addPassengerBaggage = (bookingId, bags) =>
  API.put("/checkin/add-baggage", {
    booking_id: bookingId,
    bags,
  });

export const getFlightManifest = (flightNumber) =>
  API.get(`/checkin/manifest/${flightNumber}`);

export default API;
