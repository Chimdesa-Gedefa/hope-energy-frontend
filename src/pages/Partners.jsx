import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function Partners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/about/partner`).then((res) => setPartners(res.data));
  }, []);

  return (
    <section className="py-20 bg-white text-gray-800">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-700">Our Partners</h2>
        <p className="text-lg text-gray-700 mt-3">
          Empowering Growth Through Strong & Sustainable Partnerships
        </p>
        <div className="w-24 h-1 mx-auto mt-5 mb-12 rounded-full bg-emerald-500"></div>
      </div>

      <div className="flex gap-8 justify-center items-center overflow-hidden max-w-6xl mx-auto px-6">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-40%"] }}
          transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        >
          {[...partners, ...partners].map((p, i) => (
            <div
              key={i}
              className="bg-white border border-emerald-100 rounded-2xl shadow-md p-6 w-48 flex flex-col items-center justify-center"
            >
              <img src={p.image} alt={p.name} className="w-28 h-28 object-contain mb-3" />
              <p className="text-sm text-gray-700 font-medium text-center">{p.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
