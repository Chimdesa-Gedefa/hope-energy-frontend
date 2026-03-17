import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header"; // ✅ your shared header

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function ContactSubmissionsList() {
  const [contacts, setContacts] = useState([]);
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/contact_submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("❌ Failed to load contacts:", err);
      alert("Failed to load contact submissions.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this contact submission?")) {
      try {
        await axios.delete(`${API_URL}/admin/contact_submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🗑️ Contact submission deleted successfully!");
        fetchContacts();
      } catch (err) {
        console.error("❌ Delete failed:", err);
        alert("Failed to delete contact submission.");
      }
    }
  };

  const handleReply = (email, name, serviceType) => {
    const subject = encodeURIComponent(`Reply regarding ${serviceType}`);
    const body = encodeURIComponent(
      `Dear ${name},\n\nThank you for reaching out to Hope Energy regarding our ${serviceType} service.\n\n[Your message here]\n\nBest regards,\nHope Energy Team`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* ✅ Header */}
      <Header navSolid={true} />

      {/* ✅ Page title bar */}
      <div className="sticky top-[100px] z-40 py-4 bg-[#EFFFF8] shadow-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-emerald-800">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide">
            Contact Submissions
          </h1>
        </div>
      </div>

      {/* ✅ Main content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        {contacts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No contact submissions found.
          </p>
        ) : (
          <div className="space-y-6">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-semibold text-emerald-700 text-lg">
                      {c.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{c.email}</p>
                  </div>
                </div>

                <div className="space-y-1 text-gray-700">
                  <p>
                    <strong>Service Type:</strong> {c.service_type || "N/A"}
                  </p>
                  {c.phone_number && (
                    <p>
                      <strong>Phone:</strong> {c.phone_number}
                    </p>
                  )}
                  <p className="mt-2 text-gray-800">{c.details}</p>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Submitted on:{" "}
                  {new Date(c.submission_date).toLocaleString()}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() =>
                      handleReply(c.email, c.name, c.service_type)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ✅ Dashboard-style footer */}
      <footer className="py-6 text-center text-sm text-white bg-gradient-to-r from-emerald-900 via-teal-800 to-cyan-800">
        © 2025{" "}
        <span className="text-yellow-400 font-semibold">
          Hope Energy PLC.
        </span>{" "}
        All rights reserved.
      </footer>
    </div>
  );
}
