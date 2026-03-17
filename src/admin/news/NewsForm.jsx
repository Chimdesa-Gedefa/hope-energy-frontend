import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const SERVER_URL =
  import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:4000";

export default function NewsForm() {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    image: null,
    is_published: 1,
  });

  const token = localStorage.getItem("admin_token");

  // ✅ Load existing news
  useEffect(() => {
    axios
      .get(`${API_URL}/admin/news`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fixedNews = res.data.map((n) => {
          let imageUrl = n.image_url;
          try {
            if (typeof imageUrl === "string" && imageUrl.startsWith("[")) {
              const arr = JSON.parse(imageUrl);
              imageUrl = arr[0];
            }
          } catch {
            // ignore
          }
          if (imageUrl && imageUrl.startsWith("/uploads")) {
            imageUrl = `${SERVER_URL}${imageUrl}`;
          }
          return { ...n, image_url: imageUrl };
        });
        setNews(fixedNews);
      })
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  // ✅ Handle inputs
  const handleChange = (e) => {
    const value =
      e.target.name === "is_published"
        ? Number(e.target.checked)
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // ✅ Add new news
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      await axios.post(`${API_URL}/admin/news`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ News added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding news:", error);
      alert("❌ Failed to add news");
    }
  };

  // ✅ Update
  const handleUpdate = async (id) => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      await axios.put(`${API_URL}/admin/news/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ News updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating news:", error);
      alert("❌ Failed to update news");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (confirm("Delete this news article?")) {
      try {
        await axios.delete(`${API_URL}/admin/news/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🗑️ News deleted!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("❌ Failed to delete news");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      <Header navSolid={true} />

      {/* === Main Content === */}
      <div className="flex-1 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-emerald-800 text-center">
            📰 Manage News
          </h2>

          {/* === Add New News === */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-10 bg-emerald-50 p-6 rounded-xl border border-emerald-200"
          >
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-3 rounded-lg"
              required
            />
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Content"
              className="w-full border p-3 rounded-lg"
              required
              rows={4}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg bg-white"
            />
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author"
              className="w-full border p-3 rounded-lg"
            />
            <label className="flex items-center gap-2 text-emerald-700">
              <input
                type="checkbox"
                name="is_published"
                checked={!!formData.is_published}
                onChange={handleChange}
              />
              Published
            </label>

            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              ➕ Add News
            </button>
          </form>

          {/* === Existing News === */}
          {news.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {news.map((n) => (
                <div
                  key={n.id}
                  className="border border-emerald-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  {n.image_url && (
                    <img
                      src={n.image_url}
                      alt={n.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg text-emerald-800 mb-1">
                    {n.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    {n.content.slice(0, 120)}...
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Author: <span className="font-medium">{n.author}</span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(n.id)}
                      className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">No news articles found.</p>
          )}
        </div>
      </div>

      {/* ✅ Custom gradient footer */}
      <footer className="py-6 text-center text-sm text-white bg-gradient-to-r from-[#004c3f] to-[#0b5f63]">
        © 2025{" "}
        <span className="text-yellow-400 font-semibold">
          Hope Energy PLC.
        </span>{" "}
        All rights reserved.
      </footer>
    </div>
  );
}
