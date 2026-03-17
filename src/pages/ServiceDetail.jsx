import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// ✅ Universal image resolver
const getImageSrc = (url) => {
  if (!url) return "/assets/service-1.jpg";

  if (url.startsWith("/uploads/")) {
    return `${API_BASE.replace("/api", "")}${url}`;
  }

  if (url.startsWith("/assets/")) {
    return url;
  }

  return url;
};

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, allRes] = await Promise.all([
          axios.get(`${API_BASE}/services/${id}`),
          axios.get(`${API_BASE}/services`),
        ]);
        setService(serviceRes.data.service);
        setServices(allRes.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("❌ Error fetching service detail:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <>
        <Header navSolid={true} />
        <main className="min-h-screen flex justify-center items-center text-gray-500">
          Loading service…
        </main>
        <Footer />
      </>
    );

  if (!service)
    return (
      <>
        <Header navSolid={true} />
        <main className="min-h-screen flex flex-col justify-center items-center text-gray-600">
          <p className="text-xl">Service not found.</p>
          <Link
            to="/services"
            className="mt-4 text-emerald-600 hover:underline"
          >
            ← Back to Services
          </Link>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Header navSolid={true} />

      <Hero
        title={service.title || "Service Details"}
        subtitle="Discover more about our renewable energy and electromechanical projects."
        primaryBtnText="View All Services"
        primaryBtnLink="/services"
        secondaryBtnText="Contact Us"
        secondaryBtnLink="/contact"
      />

      <main className="bg-gradient-to-br from-emerald-50 via-yellow-50 to-white text-gray-800">
        <section className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* ✅ Sidebar - Category List */}
          <aside className="bg-white/90 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold text-white bg-emerald-600 px-4 py-2 rounded-xl shadow-md inline-block mb-6">
              Categories List
            </h2>
            <ul className="space-y-5">
              {services.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-4 border-b border-gray-100 pb-4 hover:bg-emerald-50 rounded-xl transition-all ${
                    item.id == id
                      ? "bg-gradient-to-r from-emerald-100 to-green-50 border-l-4 border-emerald-600"
                      : ""
                  }`}
                >
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden shadow-sm group">
                    <img
                      src={getImageSrc(item.image_url)}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <Link
                    to={`/services/${item.id}`}
                    className="text-sm font-medium text-gray-700 hover:text-emerald-700 leading-snug"
                  >
                    {item.title?.length > 65
                      ? item.title.substring(0, 65) + "..."
                      : item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* ✅ Right — Service Details */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-emerald-700 mb-4">
                {service.title}
              </h1>

              <div className="relative overflow-hidden rounded-xl mb-8 group bg-gray-50 flex justify-center items-center">
                <img
                  src={getImageSrc(service.image_url)}
                  alt={service.title}
                  className="max-h-[480px] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <p className="text-lg leading-relaxed whitespace-pre-line text-gray-700 mb-10">
                {service.description}
              </p>

              <p className="text-sm text-gray-500 mb-10">
                Published on{" "}
                {new Date(service.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="text-center">
                <Link
                  to="/services"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  ← Back to Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
