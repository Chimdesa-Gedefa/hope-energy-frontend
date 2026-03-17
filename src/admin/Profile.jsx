import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Lock, User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Profile() {
  const token = localStorage.getItem("admin_token");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/admin/profile/update`,
        { username, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setUsername("");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header navSolid={true} />
      <div className="max-w-md mx-auto mt-24 bg-white shadow-lg rounded-2xl p-8 border border-emerald-100">
        <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">
          Update Admin Credentials
        </h2>
        {message && <p className="text-center text-emerald-600 mb-4">{message}</p>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-emerald-700 font-medium mb-1">New Username</label>
            <div className="flex items-center border rounded-lg px-3">
              <User className="text-emerald-500 w-5 h-5 mr-2" />
              <input
                type="text"
                className="w-full py-2 focus:outline-none"
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-emerald-700 font-medium mb-1">Current Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock className="text-emerald-500 w-5 h-5 mr-2" />
              <input
                type="password"
                className="w-full py-2 focus:outline-none"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-emerald-700 font-medium mb-1">New Password</label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock className="text-emerald-500 w-5 h-5 mr-2" />
              <input
                type="password"
                className="w-full py-2 focus:outline-none"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
