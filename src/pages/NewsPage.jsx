import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const parseImage = (img, fallback = "/assets/default.jpg") => {
    try {
      if (!img) return fallback;
      if (Array.isArray(img)) return img[0];
      if (typeof img === "string" && img.startsWith("[")) {
        const parsed = JSON.parse(img);
        return Array.isArray(parsed) ? parsed[0] : parsed;
      }
      return img;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE}/news`);
        setNewsList(res.data || []);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("❌ Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <Header navSolid={true} />
      <Hero
        title="Our Latest News"
        subtitle="Stay informed with the latest updates and innovations from Hope Energy."
        primaryBtnText="Back to Home"
        primaryBtnLink="/"
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
        <section className="max-w-7xl mx-auto px-6 py-16">
          {loading ? (
            <p className="text-center text-gray-500 text-lg">Loading news…</p>
          ) : newsList.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No news articles available yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {newsList.map((n) => (
                <Link
                  key={n.id}
                  to={`/news/${n.id}`}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-emerald-100 transition-all duration-300 overflow-hidden group"
                >
                  {/* ✅ Full visible image (no cut) with hover overlay & icon */}
                  <div className="relative flex justify-center items-center overflow-hidden bg-gray-50 group">
                    <img
                      src={parseImage(n.image_url)}
                      alt={n.title}
                      className="max-h-[300px] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/40 transition-all duration-700 mix-blend-multiply"></div>
                    <div className="absolute top-3 right-3 bg-white/90 text-emerald-600 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 7l-10 10M7 7h10v10"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* 📰 Text Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-emerald-700 mb-3 group-hover:text-emerald-800 transition">
                      {n.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {n.description?.length > 130
                        ? `${n.description.slice(0, 130)}...`
                        : n.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(
                        n.publish_date || n.createdAt || n.created_at
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
