import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function ServiceForm() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("admin_token");

  // ✅ Load Services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      showToast("❌ Failed to load services.", "error");
      console.error("Error fetching services:", err);
    }
  };

  // ✅ Show Toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ✅ Handle Form Input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Add / Update Service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      if (formData.imageFile) form.append("image", formData.imageFile);

      if (editingId) {
        await axios.put(`${API_URL}/admin/services/${editingId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("✅ Service updated successfully!");
      } else {
        await axios.post(`${API_URL}/admin/services`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("✅ New service added!");
      }

      setFormData({ title: "", description: "", imageFile: null });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      showToast("❌ Failed to save service.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Service
  const handleEdit = (s) => {
    setFormData({ title: s.title, description: s.description, imageFile: null });
    setEditingId(s.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete Service
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${API_URL}/admin/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("🗑️ Service deleted successfully.");
        fetchServices();
      } catch (err) {
        console.error("Error deleting service:", err);
        showToast("❌ Failed to delete service.", "error");
      }
    }
  };

  // ✅ Resolve image path (works for uploads + old /assets/)
  const getImageSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("/uploads/")) {
      return `${API_URL.replace("/api", "")}${url}`;
    } else if (url.startsWith("/assets/")) {
      return `/assets/${url.split("/").pop()}`;
    } else {
      return url;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white relative">
      {/* ✅ Header */}
      <Header navSolid={true} />

      {/* ✅ Toast Notification */}
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
            Manage Services
          </h1>
        </div>
      </div>

      {/* ✅ Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        {/* === Add / Edit Form === */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-emerald-100"
        >
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            {editingId ? "Edit Service" : "Add New Service"}
          </h2>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Service Title"
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Service Description"
            className="w-full border p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />

          {/* ✅ Upload Image */}
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mb-4 bg-emerald-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
              : "Add New Service"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({ title: "", description: "", imageFile: null });
              }}
              className="ml-3 text-emerald-700 underline"
            >
              Cancel Edit
            </button>
          )}
        </form>

        {/* === Existing Services === */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.id}
              className="border border-emerald-100 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-emerald-700">{s.title}</h3>

              {s.image_url && (
                <img
                  src={getImageSrc(s.image_url)}
                  alt={s.title}
                  className="w-full h-48 object-cover my-3 rounded-md"
                />
              )}

              <p className="text-gray-700 mb-4">{s.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
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
