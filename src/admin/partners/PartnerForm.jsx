import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

// ✅ Elegant footer (same look as your screenshot)
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

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function PartnerForm() {
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({ name: "", logo: null });
  const token = localStorage.getItem("admin_token");

  // ✅ Fetch partners
  useEffect(() => {
    axios
      .get(`${API_URL}/admin/partners`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPartners(res.data))
      .catch((err) => console.error("Error loading partners:", err));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Add new partner
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    if (formData.logo) data.append("logo", formData.logo);

    try {
      await axios.post(`${API_URL}/admin/partners`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error adding partner:", err);
      alert("❌ Failed to add partner.");
    }
  };

  // ✅ Update existing partner
  const handleUpdate = async (id) => {
    const data = new FormData();
    data.append("name", formData.name);
    if (formData.logo) data.append("logo", formData.logo);

    try {
      await axios.put(`${API_URL}/admin/partners/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (err) {
      console.error("Error updating partner:", err);
      alert("❌ Failed to update partner.");
    }
  };

  // ✅ Delete partner
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this partner?")) {
      try {
        await axios.delete(`${API_URL}/admin/partners/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        window.location.reload();
      } catch (err) {
        console.error("Error deleting partner:", err);
        alert("❌ Failed to delete partner.");
      }
    }
  };

  // ✅ Resolve image paths
  const getLogoSrc = (logo) => {
    if (!logo) return "/assets/placeholder.png";
    if (logo.startsWith("http")) return logo;
    return `${import.meta.env.VITE_API_BASE.replace("/api", "")}${
      logo.startsWith("/") ? logo : `/${logo}`
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      {/* ✅ Header */}
      <Header navSolid={true} />

      {/* === Main Content === */}
      <main className="flex-1 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-semibold mb-6 text-emerald-800 text-center">
            🤝 Manage Partners
          </h2>

          {/* ✅ Partner Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-8 bg-emerald-50 p-6 rounded-xl border border-emerald-200"
          >
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Partner Name"
              className="w-full border p-3 rounded-lg"
              required
            />
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="w-full border p-2 rounded-lg bg-white"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              ➕ Add Partner
            </button>
          </form>

          {/* ✅ Partner Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="border border-emerald-200 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col items-center"
              >
                <h3 className="font-semibold text-emerald-700">{p.name}</h3>

                {p.logo && (
                  <img
                    src={getLogoSrc(p.logo)}
                    alt={p.name}
                    className="w-32 h-32 object-contain my-2 rounded border"
                  />
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(p.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
}
