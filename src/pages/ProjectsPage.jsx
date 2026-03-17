import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const SERVER_URL = API_BASE.replace("/api", "");

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageSrc = (images) => {
    try {
      if (!images) return "/assets/project-1.jpg";
      if (typeof images === "string" && images.startsWith("[")) {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0)
          return SERVER_URL + parsed[0];
      }
      if (Array.isArray(images) && images.length > 0)
        return SERVER_URL + images[0];
      if (typeof images === "string") return SERVER_URL + images;
      return "/assets/project-1.jpg";
    } catch {
      return "/assets/project-1.jpg";
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE}/projects`);
        setProjects(res.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("❌ Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <>
        <Header navSolid={true} />
        <main className="min-h-screen flex justify-center items-center text-gray-500">
          Loading projects…
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header navSolid={true} />
      <Hero
        title="Our Success Projects"
        subtitle="See how Hope Energy is making a difference through innovative solar and renewable energy projects across communities."
        primaryBtnText="Start Your Project"
        primaryBtnLink="/contact"
        secondaryBtnText="Learn About Us"
        secondaryBtnLink="/about"
      />
      <main className="bg-gradient-to-b from-white to-emerald-50 min-h-screen text-gray-800">
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-emerald-700 mb-10 text-center">
            Our Success Projects
          </h2>

          {projects.length === 0 ? (
            <p className="text-center text-gray-500">
              No projects available right now.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-emerald-100 group"
                >
                  <div className="relative bg-black flex justify-center items-center overflow-hidden">
                    <img
                      src={getImageSrc(p.images)}
                      alt={p.title}
                      className="max-h-56 w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-emerald-700 mb-2 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {p.description}
                    </p>
                    <Link
                      to={`/projects/${p.id}`}
                      className="inline-block bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-md hover:scale-105 transition"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
