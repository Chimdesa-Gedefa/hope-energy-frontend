import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function AboutInfoForm() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" }); // ✅ Toast state
  const token = localStorage.getItem("admin_token");

  // ✅ Load all records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/about_info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      showToast("Failed to load About Info data.", "error");
      console.error(err);
    }
  };

  // ✅ Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`${API_URL}/admin/about_info/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("✅ Record updated successfully!");
      } else {
        await axios.post(`${API_URL}/admin/about_info`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("✅ New About Info added!");
      }

      await fetchRecords();
      setFormData({ title: "", description: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving record:", err);
      showToast("❌ Failed to save. Check backend logs.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load data for editing
  const handleEdit = (record) => {
    setFormData({ title: record.title, description: record.description });
    setEditingId(record.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`${API_URL}/admin/about_info/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("🗑️ Deleted successfully.");
        setRecords(records.filter((r) => r.id !== id));
      } catch (err) {
        console.error("Error deleting record:", err);
        showToast("❌ Failed to delete record.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white relative">
      {/* ✅ Header */}
      <Header navSolid={true} />

      {/* === Toast Notification === */}
      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-500 ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Toolbar */}
      <div className="sticky top-[100px] z-40 py-4 bg-[#EFFFF8] shadow-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-emerald-800">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            Manage About Info
          </h1>
        </div>
      </div>

      {/* === Main Content === */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        {/* === Add / Edit Form === */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-emerald-100"
        >
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            {editingId ? "Edit About Info" : "Add New About Info"}
          </h2>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-all"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Save Changes"
              : "Add New"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: "", description: "" });
              }}
              className="ml-3 text-emerald-700 underline"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* === Existing Records === */}
        <div className="space-y-4">
          {records.map((item) => (
            <div
              key={item.id}
              className="border border-emerald-100 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-emerald-700">{item.title}</h3>
              <p className="text-gray-700 mt-2 mb-4">{item.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="py-6 text-center text-sm text-white bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-800">
        © 2025{" "}
        <span className="text-yellow-400 font-semibold">Hope Energy PLC.</span>{" "}
        All rights reserved.
      </footer>
    </div>
  );
}
