import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const SERVER_URL = API_BASE.replace("/api", "");

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
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
    const fetchData = async () => {
      try {
        const [projRes, listRes] = await Promise.all([
          axios.get(`${API_BASE}/projects/${id}`),
          axios.get(`${API_BASE}/projects`),
        ]);
        setProject(projRes.data);
        setProjects(listRes.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("❌ Error fetching project detail:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header navSolid={true} />
        <main className="min-h-screen flex justify-center items-center text-gray-500">
          Loading project…
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Header navSolid={true} />
        <main className="min-h-screen flex flex-col justify-center items-center text-gray-600">
          <p className="text-xl">Project not found.</p>
          <Link
            to="/projects"
            className="mt-4 text-emerald-600 hover:underline"
          >
            ← Back to Projects
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header navSolid={true} />
      <Hero
        title={project.title || "Project Details"}
        subtitle="Discover our solar and renewable energy projects transforming communities across Ethiopia."
        primaryBtnText="View All Projects"
        primaryBtnLink="/projects"
        secondaryBtnText="Contact Us"
        secondaryBtnLink="/contact"
        bgImage="/assets/solar-bg.jpg"
      />

      <main
        className="text-gray-800"
        style={{
          background:
            "linear-gradient(135deg, #fffde7 0%, #e0f7fa 40%, #e8f5e9 80%)",
        }}
      >
        <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <aside className="bg-gradient-to-br from-amber-100 via-yellow-50 to-emerald-50 border border-amber-200 rounded-2xl shadow-lg p-6 h-fit relative overflow-hidden">
            <h2 className="text-xl font-semibold text-white bg-emerald-600 rounded-md px-3 py-2 inline-block mb-5 shadow-md">
              Categories List
            </h2>

            <ul className="space-y-5">
              {projects.map((item) => (
                <li
                  key={item.id}
                  onClick={() => navigate(`/projects/${item.id}`)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all ${
                    item.id == id
                      ? "bg-emerald-100 border-l-4 border-emerald-600"
                      : "bg-white hover:bg-emerald-50"
                  }`}
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden">
                    <img
                      src={getImageSrc(item.images)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {item.title}
                  </div>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main details */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-emerald-700 mb-4">
              {project.title}
            </h1>
            <div className="relative mb-6 flex justify-center">
              <img
                src={getImageSrc(project.images)}
                alt={project.title}
                className="max-h-[480px] w-auto object-contain rounded-xl"
              />
            </div>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-10">
              {project.description}
            </p>
            <div className="text-center">
              <Link
                to="/projects"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all"
              >
                ← Back to Projects
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
