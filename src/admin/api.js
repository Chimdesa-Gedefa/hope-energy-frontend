import axios from "axios";

// ✅ Base API URL — pulled from .env for production, defaults to localhost in development
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Automatically include the admin JWT token (if logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
