import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [allNews, setAllNews] = useState([]);
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
    const fetchData = async () => {
      try {
        const [detailRes, listRes] = await Promise.all([
          axios.get(`${API_BASE}/news/${id}`),
          axios.get(`${API_BASE}/news`),
        ]);
        setNews(detailRes.data);
        setAllNews(listRes.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("❌ Error fetching news detail:", err);
        setNews(null);
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
          Loading news…
        </main>
        <Footer />
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Header navSolid={true} />
        <main className="min-h-screen flex flex-col justify-center items-center text-gray-600">
          <p className="text-xl">News not found.</p>
          <Link to="/news" className="mt-4 text-emerald-600 hover:underline">
            ← Back to News
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
        title={news.title || "News Details"}
        subtitle="Stay informed with the latest updates and milestones from Hope Energy."
        primaryBtnText="View All News"
        primaryBtnLink="/news"
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
          {/* 🌿 Sidebar */}
          <aside className="bg-gradient-to-br from-amber-100 via-yellow-50 to-emerald-50 border border-amber-200 rounded-2xl shadow-lg p-6 h-fit relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-yellow-200/40 via-transparent to-transparent pointer-events-none"></div>

            <h2 className="text-xl font-semibold text-white bg-emerald-600 rounded-md px-3 py-2 inline-block mb-5 shadow-md">
              Recent News
            </h2>

            <ul className="space-y-5">
              {allNews
                .filter((n) => String(n.id) !== String(id))
                .slice(0, 6)
                .map((item) => (
                  <li
                    key={item.id}
                    onClick={() => navigate(`/news/${item.id}`)}
                    className={`flex items-center gap-4 p-3 border border-transparent hover:border-emerald-400 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 ${
                      item.id == id
                        ? "bg-gradient-to-r from-emerald-100 via-green-50 to-emerald-50 border-l-4 border-emerald-600 shadow-md"
                        : "bg-white"
                    }`}
                  >
                    <div className="relative group w-20 h-16 rounded-lg overflow-hidden">
                      <img
                        src={parseImage(item.image_url)}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-emerald-600/20 group-hover:bg-emerald-600/40 transition-all duration-500"></div>
                      <div className="absolute top-2 right-2 bg-white/90 text-emerald-600 p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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

                    <div className="text-sm font-medium text-gray-800 hover:text-emerald-700 leading-snug">
                      {item.title?.length > 65
                        ? item.title.substring(0, 65) + "..."
                        : item.title}
                    </div>
                  </li>
                ))}
            </ul>
          </aside>

          {/* ☀️ Main News Details */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-emerald-100 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 via-transparent to-emerald-100 opacity-80 pointer-events-none"></div>

            {/* ✅ Full visible image (no crop) + hover overlay */}
            <div className="relative flex justify-center items-center overflow-hidden rounded-b-none group bg-gray-50">
              <img
                src={parseImage(news.image_url)}
                alt={news.title}
                className="max-h-[500px] w-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/35 transition-all duration-700 mix-blend-multiply"></div>
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

            {/* 🧾 News Content */}
            <div className="p-8 relative z-10">
              <h1 className="text-3xl font-bold text-emerald-700 mb-4">
                {news.title}
              </h1>
              <div
                className="text-lg leading-relaxed whitespace-pre-line text-gray-700 mb-10"
                dangerouslySetInnerHTML={{
                  __html: news.description || news.content || "",
                }}
              />
              <p className="text-sm text-gray-600 mb-10">
                Published on{" "}
                {new Date(
                  news.publish_date || news.createdAt || news.created_at
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="text-center">
                <Link
                  to="/news"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-full text-sm font-semibold shadow-md transition-all"
                >
                  ← Back to News
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
