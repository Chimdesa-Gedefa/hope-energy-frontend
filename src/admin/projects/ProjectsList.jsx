import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "" });
  const token = localStorage.getItem("admin_token");

  // ✅ Show toast message
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // ✅ Resolve correct image path
  const getImageSrc = (url) => {
    if (!url) return "/assets/project-1.jpg";
    if (typeof url !== "string") return "/assets/project-1.jpg";

    // Local uploaded file from backend
    if (url.startsWith("/uploads"))
      return `${API_URL.replace("/api", "")}${url}`;

    // Asset image path
    if (url.startsWith("/assets")) return url;

    return url;
  };

  // ✅ Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
        showToast("Failed to load projects.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ✅ Delete project
  const handleDelete = async (id) => {
    if (!confirm("🗑️ Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`${API_URL}/admin/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p.id !== id));
      showToast("✅ Project deleted successfully!");
    } catch (err) {
      console.error("❌ Error deleting project:", err);
      showToast("Failed to delete project.", "error");
    }
  };

  // ✅ Loading screen
  if (loading)
    return (
      <p className="text-center py-20 text-gray-500 animate-pulse">
        Loading projects…
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white relative">
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

      {/* Header */}
      <div className="sticky top-0 z-40 py-4 bg-[#EFFFF8] shadow-md border-b border-emerald-200">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-emerald-800">
            Manage Projects
          </h2>
          <Link
            to="/admin/projects/new"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
          >
            + Add New Project
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      <main className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 py-20">
            No projects found.
          </p>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="relative bg-gray-50 flex justify-center items-center">
                <img
                  src={getImageSrc(p.images || p.image)}
                  alt={p.title}
                  className="max-h-56 w-auto object-contain p-4 transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/admin/projects/edit/${p.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
