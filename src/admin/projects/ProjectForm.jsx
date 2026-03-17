import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export default function ProjectForm() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("admin_token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
      showToast("❌ Failed to load projects.", "error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, imageFile: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (formData.imageFile) data.append("image", formData.imageFile);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (editingId) {
        await axios.put(`${API_URL}/admin/projects/${editingId}`, data, {
          headers,
        });
        showToast("✅ Project updated successfully!");
      } else {
        await axios.post(`${API_URL}/admin/projects`, data, { headers });
        showToast("✅ New project added successfully!");
      }

      await fetchProjects();
      setFormData({ title: "", description: "", imageFile: null });
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error saving project:", err.response || err);
      showToast("❌ Failed to save project.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      title: p.title,
      description: p.description,
      imageFile: null,
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("🗑️ Delete this project?")) return;
    try {
      await axios.delete(`${API_URL}/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p.id !== id));
      showToast("✅ Project deleted!");
    } catch (err) {
      console.error("❌ Error deleting project:", err);
      showToast("❌ Failed to delete project.", "error");
    }
  };

  const getImageSrc = (img) => {
    if (!img) return "/assets/project-1.jpg";

    try {
      if (typeof img === "string" && img.startsWith("[")) {
        const arr = JSON.parse(img);
        img = arr[0];
      }
    } catch (err) {
      console.warn("⚠️ Could not parse image JSON:", img);
    }

    if (Array.isArray(img)) img = img[0];
    if (!img) return "/assets/project-1.jpg";

    if (img.startsWith("/uploads"))
      return `${API_URL.replace("/api", "")}${img}`;

    return img;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      <Header navSolid={true} />

      {toast.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="sticky top-[100px] z-40 py-4 bg-[#EFFFF8] shadow-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-emerald-800">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            Manage Projects
          </h1>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-emerald-100"
        >
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project Title"
            className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-emerald-400"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            rows="4"
            className="w-full border p-3 rounded-lg mb-3 focus:ring-2 focus:ring-emerald-400"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Save Changes"
              : "Add New Project"}
          </button>
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="border border-emerald-100 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-emerald-700">
                {p.title}
              </h3>

              <img
                src={getImageSrc(p.images)}
                alt={p.title}
                className="w-full h-48 object-cover my-3 rounded-md"
              />

              <p className="text-gray-700 mb-4 line-clamp-3">
                {p.description}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ✅ FOOTER (exact same style as the image sample) */}
      <footer className="w-full mt-20">
        <div className="w-full py-4 text-center text-sm md:text-base bg-gradient-to-r from-[#004d40] to-[#005b66]">
          <p className="text-white">
            © 2025{" "}
            <span className="font-semibold text-yellow-300">
              Hope Energy PLC.
            </span>{" "}
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
