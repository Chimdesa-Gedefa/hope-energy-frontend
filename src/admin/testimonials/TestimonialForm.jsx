import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

// ✅ MERGED FOOTER — matches your screenshot
function Footer() {
  return (
    <footer className="w-full mt-10">
      <div
        className="w-full py-4 text-center text-sm md:text-base 
        bg-gradient-to-r from-[#004d40] to-[#005b66]"
      >
        <p className="text-white">
          © 2025{" "}
          <span className="font-semibold text-yellow-300">
            Hope Energy PLC.
          </span>{" "}
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function TestimonialForm() {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    author: "",
    icon: "",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("admin_token");

  // ✅ Load all testimonials
  useEffect(() => {
    axios
      .get(`${API_URL}/admin/testimonials`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error("❌ Load testimonials failed:", err));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title || !formData.text || !formData.author) {
        alert("⚠️ Title, text, and author are required.");
        return;
      }

      if (editingId) {
        await axios.put(
          `${API_URL}/admin/testimonials/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Testimonial updated successfully!");
      } else {
        await axios.post(`${API_URL}/admin/testimonials`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Testimonial added successfully!");
      }

      setEditingId(null);
      setFormData({ title: "", text: "", author: "", icon: "" });
      window.location.reload();
    } catch (err) {
      console.error("❌ Save failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving testimonial.");
    }
  };

  // ✅ Handle edit button
  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      title: t.title,
      text: t.text,
      author: t.author,
      icon: t.icon || "",
    });
  };

  // ✅ Handle delete button
  const handleDelete = async (id) => {
    if (confirm("Delete this testimonial?")) {
      await axios.delete(`${API_URL}/admin/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Testimonial deleted!");
      window.location.reload();
    }
  };

  return (
    <>
      <Header />

      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-6">
          {editingId ? "Update Testimonial" : "Add New Testimonial"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-md">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Testimonial Title"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Testimonial Text"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="Icon name (optional)"
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>
        </form>

        {/* ✅ Display existing testimonials */}
        <div className="grid md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="border p-4 rounded bg-white shadow-sm">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-gray-700">{t.text}</p>
              <p className="text-sm text-gray-500 mt-1">— {t.author}</p>
              {t.icon && (
                <p className="text-xs text-gray-400 mt-1">
                  Icon: <span className="font-mono">{t.icon}</span>
                </p>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Merged Footer */}
      <Footer />
    </>
  );
}
