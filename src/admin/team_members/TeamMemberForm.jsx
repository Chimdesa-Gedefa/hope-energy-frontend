import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function TeamMemberForm() {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    qualifications: "",
    imageFile: null,
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    axios
      .get(`${API_URL}/admin/team_members`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("❌ Load members failed:", err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({ ...formData, imageFile: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("position", formData.position);
      data.append("qualifications", formData.qualifications);
      if (formData.imageFile) data.append("image", formData.imageFile);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingId) {
        await axios.put(`${API_URL}/admin/team_members/${editingId}`, data, config);
        alert("✅ Team member updated successfully");
      } else {
        await axios.post(`${API_URL}/admin/team_members`, data, config);
        alert("✅ Team member added successfully");
      }

      setEditingId(null);
      window.location.reload();
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("Failed to save team member. Check your backend or image format.");
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      position: member.position,
      qualifications: member.qualifications || "",
      imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this team member?")) {
      await axios.delete(`${API_URL}/admin/team_members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Member deleted");
      window.location.reload();
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <h2 className="text-3xl font-semibold text-emerald-700 mb-8 text-center">
          {editingId ? "Update Team Member" : "Add Team Member"}
        </h2>

        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 mb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="Qualifications"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-3 rounded-lg"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg w-full font-medium transition"
            >
              {editingId ? "Update Member" : "Add Member"}
            </button>
          </form>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              {m.image && (
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-28 h-28 object-cover rounded-full mx-auto mb-3"
                />
              )}
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {m.name}
              </h3>
              <p className="text-center text-emerald-700 font-medium">
                {m.position}
              </p>
              <p className="text-center text-gray-500 text-sm">
                {m.qualifications}
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  onClick={() => handleEdit(m)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ NEW FOOTER (same style as your sample) */}
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
    </>
  );
}
