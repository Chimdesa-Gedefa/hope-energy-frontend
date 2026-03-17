import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Lock } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/admin/auth/login", { username, password });
      localStorage.setItem("admin_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-blue-600 to-yellow-400 relative overflow-hidden">

      {/* ✅ Responsive glowing background circles */}
      <div className="
        absolute 
        w-[200px] h-[200px]
        sm:w-[300px] sm:h-[300px]
        md:w-[500px] md:h-[500px]
        bg-white/10 rounded-full blur-3xl
        top-[-120px] left-[-80px]
      " />

      <div className="
        absolute 
        w-[150px] h-[150px]
        sm:w-[250px] sm:h-[250px]
        md:w-[400px] md:h-[400px]
        bg-green-300/10 rounded-full blur-2xl
        bottom-[-120px] right-[-70px]
      " />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/40"
      >
        {/* Admin Icon + Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-blue-600 to-green-500 p-3 rounded-full shadow-md mb-3">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-green-700 tracking-wide">
            Admin Login
          </h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Secure access to Hope Energy Admin Dashboard ⚡
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-semibold">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full p-3 rounded-lg outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full p-3 pl-10 rounded-lg outline-none transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-gradient-to-r from-green-600 via-blue-500 to-yellow-400 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Login
          </motion.button>
        </form>

        <div className="mt-5 text-center">
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-green-600 transition-colors"
          >
            ← Back to Website
          </a>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          © {new Date().getFullYear()} Hope Energy | Powering Renewable Future🌞
        </p>
      </motion.div>
    </div>
  );
}
