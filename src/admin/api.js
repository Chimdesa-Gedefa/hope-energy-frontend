import axios from 'axios';

const API = axios.create({
  // Looks for Vercel variable first, falls back to localhost for your computer
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api"
});

export default API;
