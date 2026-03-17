import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Hero({
  title = "Powering Ethiopia’s Renewable Future",
  subtitle = "Hope Energy pioneers renewable energy solutions to power communities across Ethiopia with sustainable innovation.",
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/assets/hero1.jpg",
    "/assets/hero2.jpg",
    "/assets/hero3.jpg",
    "/assets/hero4.jpg",
    "/assets/hero5.jpg",
  ];

  const location = useLocation();

  // ✅ Automatically set the correct "View" link based on current page
  let viewLink = "/";
  if (location.pathname.includes("/about")) viewLink = "/#about";
  else if (location.pathname.includes("/services")) viewLink = "/#services";
  else if (location.pathname.includes("/projects")) viewLink = "/#projects";
  else if (location.pathname.includes("/news")) viewLink = "/#news";

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-28 min-h-[85vh] flex items-center justify-center overflow-hidden text-white"
    >
      {/* 🔄 Background image rotation */}
      <div className="absolute inset-0">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2500ms] ease-in-out ${
              i === currentImage
                ? "opacity-100 scale-105"
                : "opacity-0 scale-100"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-cyan-800/70 to-yellow-600/60"></div>
      </div>

      {/* 🌿 Hero Content (left aligned like Home) */}
      <div className="relative container mx-auto px-6 text-left z-10">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight drop-shadow-lg">
            {title}
          </h2>
          <p className="text-lg text-emerald-100">{subtitle}</p>

          {/* 🔘 View Button Only */}
          <div>
            <Link
              to={viewLink}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-full shadow-md transition inline-block"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
