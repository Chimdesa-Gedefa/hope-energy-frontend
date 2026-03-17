"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// ✅ Universal image handler
const getImageSrc = (url) => {
  if (!url) return "/assets/service-1.jpg";

  if (url.startsWith("/uploads/")) {
    // Backend uploads folder
    return `${API_BASE.replace("/api", "")}${url}`;
  }

  if (url.startsWith("/assets/")) {
    // Local frontend assets
    return url;
  }

  // External URLs
  return url;
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/services`);
        setServices(res.data);
      } catch (err) {
        console.error("❌ Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <Header navSolid={true} />

      {/* ✅ HERO */}
      <Hero
        title="Our Services"
        subtitle="Empowering Ethiopia through renewable energy innovation and sustainable technology."
        primaryBtnText="Explore Projects"
        primaryBtnLink="/projects"
        secondaryBtnText="Contact Us"
        secondaryBtnLink="/contact"
        bgImage="/assets/service-header.jpg"
      />

      {/* ✅ MAIN CONTENT */}
      <main className="bg-gradient-to-b from-white to-emerald-50 min-h-screen text-gray-800">
        <section className="max-w-6xl mx-auto px-6 py-16">
          {/* Section Title */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <Wrench className="w-8 h-8 text-emerald-600" />
              <h1 className="text-4xl font-bold text-emerald-700">
                Our Services
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We deliver sustainable, high-quality renewable energy solutions
              and technical expertise for homes, businesses, and institutions.
            </p>
          </motion.div>

          {/* ✅ Loading & Services */}
          {loading ? (
            <p className="text-center text-gray-500 py-20">Loading services…</p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-600 py-20">
              No services available at the moment.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-emerald-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="relative bg-gray-50 flex justify-center items-center">
                    <img
                      src={getImageSrc(service.image_url)}
                      alt={service.title}
                      className="max-h-56 w-auto object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-emerald-700 mb-3">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <Link
                      to={`/services/${service.id}`}
                      className="mt-5 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition text-center"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
