import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function VisionMissionGoals() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/about/core`).then((res) => setData(res.data));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 space-y-8">
      {data.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-emerald-700 mb-2">{item.title}</h2>
          <p className="text-gray-600 leading-relaxed">{item.content}</p>
        </motion.div>
      ))}
    </section>
  );
}
