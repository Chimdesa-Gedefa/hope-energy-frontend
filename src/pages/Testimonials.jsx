import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/about/testimonial`).then((res) => setTestimonials(res.data));
  }, []);

  return (
    <section className="relative py-16 bg-white">
      <div className="container mx-auto px-6 text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 flex items-center justify-center gap-2">
          <Sparkles className="text-emerald-500 w-6 h-6" /> Testimonials — Our Partners in Success
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
          Hear from our satisfied partners and customers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">{t.title}</h3>
            <p className="text-gray-700 italic mb-3">{t.content}</p>
            <p className="text-sm text-gray-600 font-medium">{t.name}</p>
            <p className="text-xs text-gray-500">{t.position}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
