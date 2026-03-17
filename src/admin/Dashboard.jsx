import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./global.css";
import { LogOut, User, Lock, Save } from "lucide-react";


const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// ✅ Elegant footer (matches your provided design)
function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-700 text-center py-4 mt-10">
      <p className="text-sm text-gray-200">
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-400 font-semibold">Hope Energy PLC</span>.{" "}
        All rights reserved.
      </p>
    </footer>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [form, setForm] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const endpoints = [
          "about_info",
          "services",
          "projects",
          "news",
          "partners",
          "team_members",
          "testimonials",
          "contact_submissions",
        ];

        const responses = await Promise.all(
          endpoints.map((ep) =>
            axios.get(`${API_URL}/admin/${ep}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        const newStats = endpoints.reduce((acc, key, i) => {
          acc[key] = responses[i].data.length;
          return acc;
        }, {});

        setStats(newStats);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    loadStats();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.put(`${API_URL}/admin/update_profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || "✅ Profile updated successfully!");
      setForm({ username: "", currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { name: "About Info", key: "about_info" },
    { name: "Services", key: "services" },
    { name: "Projects", key: "projects" },
    { name: "News", key: "news" },
    { name: "Partners", key: "partners" },
    { name: "Team Members", key: "team_members" },
    { name: "Testimonials", key: "testimonials" },
    { name: "Contact Submissions", key: "contact_submissions" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-100 via-white to-emerald-50">
      {/* Shared Header */}
      <Header navSolid={true} />

      {/* Sticky Admin Header */}
      <div className="sticky top-[100px] z-40 py-4 bg-emerald-50/90 backdrop-blur-md shadow-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-emerald-800">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            Hope Energy Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* === Dashboard Content === */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 mt-10">
        {/* === Stats Section === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.key}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-emerald-100 p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-emerald-300"
            >
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                {item.name}
              </h3>
              <p className="text-4xl font-extrabold text-emerald-900 drop-shadow-sm">
                {stats[item.key] ?? "—"}
              </p>
            </div>
          ))}
        </div>

        {/* === Profile Update Section === */}
        <section className="relative mt-24">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 via-teal-100 to-white rounded-3xl blur-3xl opacity-50"></div>

          <div className="relative max-w-xl mx-auto bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-emerald-100 p-10">
            <h2 className="text-2xl font-semibold text-center text-emerald-800 mb-8 flex items-center justify-center gap-3">
              <User className="w-7 h-7 text-emerald-600" />
              Update Profile
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1">
                  New Username
                </label>
                <div className="flex items-center bg-white/60 border border-emerald-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                  <User className="w-5 h-5 text-emerald-600 mr-2" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter new username"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-emerald-400"
                  />
                </div>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1">
                  Current Password
                </label>
                <div className="flex items-center bg-white/60 border border-emerald-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                  <Lock className="w-5 h-5 text-emerald-600 mr-2" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-emerald-400"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-emerald-800 mb-1">
                  New Password
                </label>
                <div className="flex items-center bg-white/60 border border-emerald-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-400 transition-all">
                  <Lock className="w-5 h-5 text-emerald-600 mr-2" />
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder:text-emerald-400"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <p
                  className={`text-center text-sm font-medium mt-2 ${
                    message.startsWith("✅")
                      ? "text-emerald-700"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Save className="w-5 h-5" />
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* ✅ Elegant Dashboard Footer */}
      <Footer />
    </div>
  );
}
