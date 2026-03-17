import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export default function Team() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/about/team`)
      .then((res) => setTeam(res.data))
      .catch((err) => console.error("❌ Failed to fetch team:", err));
  }, []);

  return (
    <>
      <Header />
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10 text-emerald-700">
            Our Dedicated Team
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                <img
                  src={
                    member.image?.startsWith("http")
                      ? member.image
                      : `${API_URL}${member.image}`
                  }
                  alt={member.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border border-emerald-500"
                  onError={(e) => (e.target.src = "/default-profile.png")}
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-emerald-600 font-medium">
                  {member.position}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {member.qualifications}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
