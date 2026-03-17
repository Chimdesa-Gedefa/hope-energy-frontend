import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  School,
  Building,
  HeartPulse,
  Building2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./global.css";
// ✅ Scroll Section Setup
const sections = ["home", "about", "services", "projects", "news", "contact"];
let currentIndex = 0;

const scrollToSection = (direction) => {
  if (direction === "down" && currentIndex < sections.length - 1) {
    currentIndex++;
  } else if (direction === "up" && currentIndex > 0) {
    currentIndex--;
  }

  const target = document.getElementById(sections[currentIndex]);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const defaultServices = [
  {
    id: 1,
    title: "Solar Panel Installation",
    desc: "Professional solar panel installation for homes, businesses and institutions using high-quality components.",
    image: "/assets/services-1.jpg",
  },
  {
    id: 2,
    title: "Electromechanical Work",
    desc: "Complete electromechanical services including inverters, wiring, and maintenance.",
    image: "/assets/electromech.jpg",
  },
  {
    id: 3,
    title: "Training & Consultation",
    desc: "Training programs and technical consultation to build local capacity in renewable energy.",
    image: "/assets/tarining.png",
  },
  {
    id: 4,
    title: "Solar Inverters & Batteries",
    desc: "High-efficiency inverter and battery system integration for reliable backup power.",
    image: "/assets/services-4.jpg",
  },
];

export default function Home() {
  const [services, setServices] = useState(defaultServices);
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [navSolid, setNavSolid] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScroll, setShowScroll] = useState(false);

  const [stats, setStats] = useState([
    { label: "Schools Electrified", value: 300 },
    { label: "Health Posts", value: 200 },
    { label: "Health Centers", value: 4 },
    { label: "Bank Branches", value: 30 },
  ]);
  const statsRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const contactRef = useRef(null); // 🔹 reference for smooth scroll

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  function useCounter(end, trigger) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!trigger) return;
      let start = 0;
      const duration = 1400;
      const step = Math.max(1, Math.ceil(end / (duration / 16)));
      const t = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(t);
        } else setCount(start);
      }, 16);
      return () => clearInterval(t);
    }, [trigger]);
    return count;
  }

  const animatedValues = stats.map((s) => useCounter(s.value, visible));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const getData = async () => {
      try {
        const [pRes, nRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/projects`),
          axios.get(`${API_BASE}/news`),
        ]);
        if (!mounted) return;
        if (pRes.status === "fulfilled" && Array.isArray(pRes.value.data))
          setProjects(pRes.value.data);
        if (nRes.status === "fulfilled" && Array.isArray(nRes.value.data))
          setNews(nRes.value.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 240);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/contact`, contact);
      setSubmitted(true);
      setContact({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      alert("Failed to send contact. Please try again later.");
    }
  };

  const parseImage = (img, fallback = "/assets/project-1.jpg") => {
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

  const iconMap = { School, Building, HeartPulse, Building2 };
  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const stagger = { show: { transition: { staggerChildren: 0.12 } } };

  // 🔹 Smooth scroll to contact section
  const scrollToContact = (e) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans text-gray-900 antialiased bg-gradient-to-b from-white to-emerald-50">
      <Header navSolid={navSolid} />

      {/* HERO SECTION */}
<section
  id="home"
  className="relative min-h-screen flex items-center overflow-hidden bg-slate-900"
>
  {/* Background Image Carousel */}
  <div className="absolute inset-0 z-0">
    {[
      "/assets/hero1.jpg",
      "/assets/hero2.jpg",
      "/assets/hero3.jpg",
      "/assets/hero4.jpg",
      "/assets/hero5.jpg",
    ].map((img, i) => (
      <motion.div
        key={i}
        initial={false}
        animate={{
          opacity: i === currentImage ? 1 : 0,
          scale: i === currentImage ? 1.05 : 1.1, // Subtle zoom-out effect
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
    ))}
    {/* Refined Overlay: Darker gradient for better text legibility */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
  </div>

  <div className="relative container mx-auto px-6 lg:px-12 z-10">
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={stagger}
      className="max-w-3xl"
    >
      {/* Accent Tagline */}
      <motion.span 
        variants={fadeUp}
        className="inline-block py-1 px-3 mb-6 border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium tracking-widest text-sm uppercase"
      >
        Sustainable Energy Solutions
      </motion.span>

      <motion.h1
        variants={fadeUp}
        className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6"
      >
        Powering Ethiopia’s <br />
        <span className="text-emerald-500">Renewable Future</span>
      </motion.h1>

      <motion.p 
        variants={fadeUp} 
        className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed"
      >
        Hope Energy pioneers world-class renewable solutions to provide 
        reliable, sustainable, and innovative power to communities across the nation.
      </motion.p>

      <motion.div
        variants={fadeUp}
        className="flex flex-wrap gap-5"
      >
        <Link
          to="/projects"
          className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-sm transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10">EXPLORE PROJECTS</span>
          <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 bg-emerald-400 transition-transform duration-300" />
        </Link>
        
        <a
          href="#contact"
          onClick={scrollToContact}
          className="px-8 py-4 border border-white/30 hover:border-white text-white font-bold rounded-sm transition-colors duration-300 backdrop-blur-sm"
        >
          GET INVOLVED
        </a>
      </motion.div>
    </motion.div>
  </div>

  {/* Scroll Indicator */}
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 2 }}
    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
  >
    <span className="text-white/40 text-xs uppercase tracking-[0.2em]">Scroll</span>
    <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
  </motion.div>
</section>

{/* ABOUT SECTION */}
<section id="about" className="relative py-24 bg-[#fcfcfc] overflow-hidden" ref={statsRef}>
  {/* Subtle Background Decorative Element */}
  <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2 z-0" />

  <div className="container mx-auto px-6 relative z-10">
    <div className="grid lg:grid-cols-12 gap-16 items-center">
      
      {/* LEFT SIDE — Full Image View (Corrected) */}
<div className="lg:col-span-5 relative">
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    viewport={{ once: true }}
    className="relative"
  >
    {/* 1. Removed overflow-hidden to allow the frame to breathe.
      2. Set bg-white to act as a professional matte background.
      3. Removed h-[550px] so the height adjusts to the image's natural shape.
    */}
    <div className="relative z-10 shadow-2xl border-[12px] border-white bg-white">
      <img
        src="/assets/1AboutHome.jpg"
        alt="Hope Energy Project"
        /* w-full: fills the width of the column.
           h-auto: ensures the height scales perfectly with the width.
           object-contain: guarantees NO part of the image is cut.
        */
        className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
      />
    </div>
    
    {/* Floating Experience Card — Sticks to the actual corner of the image */}
    <div className="absolute -bottom-6 -right-6 bg-emerald-600 p-8 text-white z-20 shadow-xl hidden md:block">
      <p className="text-4xl font-bold font-heading">05+</p>
      <p className="text-xs uppercase tracking-widest opacity-80">Years of Impact</p>
    </div>
  </motion.div>
</div>

      {/* RIGHT SIDE — Structured Content */}
      <div className="lg:col-span-7">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[2px] bg-emerald-600"></div>
            <span className="text-emerald-700 font-bold tracking-[0.2em] text-sm uppercase">ABOUT US</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] mb-8">
            Changing lives one village at a time, <br />
            <span className="text-emerald-600 italic font-serif">that’s our mission.</span>
          </h2>

          <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl">
            <p>
              Founded in 2021, <span className="text-slate-900 font-semibold">Hope Energy</span> is redefining Ethiopia's energy landscape. 
              We don't just install solar panels; we engineer sustainable ecosystems that empower 
              local commerce and improve quality of life.
            </p>
            <p>
              By combining cutting-edge technology with deep-rooted community collaboration, 
              we are building the infrastructure for a renewable tomorrow—training the next 
              generation of technicians along the way.
            </p>
          </div>

          {/* Stats - Refined into a Sleeker Grid */}
          <div className="grid sm:grid-cols-2 gap-8 mb-12">
            {stats.map((item, i) => {
              const Icon = iconMap[Object.keys(iconMap)[i]];
              return (
                <div key={i} className="group flex items-start gap-4">
                  <div className="mt-1 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-slate-900">
                      {animatedValues[i]}+
                    </div>
                    <div className="text-slate-500 font-medium">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-3 group text-slate-900 font-bold uppercase tracking-wider text-sm"
          >
            <span className="border-b-2 border-emerald-600 pb-1 group-hover:text-emerald-600 transition-colors">
              Discover our full impact
            </span>
            <span className="bg-emerald-600 text-white p-2 rounded-full group-hover:translate-x-2 transition-transform">
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
</section>

{/* ✅ OUR SERVICES SECTION – PROFESSIONAL + HIGH VISIBILITY TEXT */}
<motion.section
  id="services"
  className="py-20 bg-gradient-to-r from-cyan-50 to-emerald-50"
  initial={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.01, transition: { duration: 0.5 } }}
>
  <div className="container mx-auto px-6">

    {/* ✅ SECTION TITLE */}
    <motion.h3
      className="text-4xl font-extrabold text-emerald-700 mb-16 flex justify-center tracking-wide"
      initial={{ y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      <motion.span
        className="bg-white px-8 py-3 rounded-full shadow-md border border-emerald-200 text-emerald-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Our Services
      </motion.span>
    </motion.h3>

    {/* ✅ SERVICES GRID */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

      {/* ✅ SOLAR SERVICE CARD */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition duration-500"
          style={{ backgroundImage: "url('/assets/1solar_bg.jpg')" }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>

        {/* Content */}
        <div className="relative z-10 p-6 text-white">
          <h4 className="text-xl font-bold mb-4 tracking-wide drop-shadow-lg flex items-center gap-2">
            <span className="text-3xl">🔆</span> Solar & Energy System Services
          </h4>

          <ul className="space-y-3 text-base font-medium leading-relaxed">
            {[
              "Solar water pump installation",
              "Solar panel installation",
              "Design of pump & backup systems",
              "Backup system installation & maintenance",
              "Troubleshooting (batteries, inverters, controllers)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-yellow-300 text-xl leading-none drop-shadow">▹</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ✅ ELECTRICAL SERVICES CARD */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition duration-500"
          style={{ backgroundImage: "url('/assets/electrical_bg.jpg')" }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>

        {/* Content */}
        <div className="relative z-10 p-6 text-white">
          <h4 className="text-xl font-bold mb-4 tracking-wide drop-shadow-lg flex items-center gap-2">
            <span className="text-3xl">⚡</span> Electrical Installation
          </h4>

          <ul className="space-y-3 text-base font-medium leading-relaxed">
            {[
              "Electrical building wiring",
              "ATS (Automatic Transfer Switch) installation",
              "Electric vehicle (EV) charger installation",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-yellow-300 text-xl leading-none drop-shadow">▹</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ✅ TRAINING CARD */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition duration-500"
          style={{ backgroundImage: "url('/assets/training_bg.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>

        <div className="relative z-10 p-6 text-white">
          <h4 className="text-xl font-bold mb-4 tracking-wide drop-shadow-lg flex items-center gap-2">
            <span className="text-3xl">📘</span> Training & Capacity Building
          </h4>

          <ul className="space-y-3 text-base font-medium leading-relaxed">
            {[
              "Training for technicians & operators",
              "Capacity-building for solar system O&M",
              "Hands-on training (solar, inverter, battery)",
              "Safety training for electrical work",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-yellow-300 text-xl leading-none drop-shadow">▹</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ✅ ADDITIONAL SERVICES CARD */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition duration-500"
          style={{ backgroundImage: "url('/assets/parking_bg.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>

        <div className="relative z-10 p-6 text-white">
          <h4 className="text-xl font-bold mb-4 tracking-wide drop-shadow-lg flex items-center gap-2">
            <span className="text-3xl">🏗️</span> Additional Technical Services
          </h4>

          <ul className="space-y-3 text-base font-medium leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-yellow-300 text-xl leading-none drop-shadow">▹</span>
              Car parking installation/setup
            </li>
          </ul>
        </div>
      </motion.div>

    </div>

    {/* ✅ BUTTON */}
    <div className="text-center mt-14">
      <Link
        to="/services"
        className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-110 tracking-wide"
      >
        View All Services →
      </Link>
    </div>

  </div>
</motion.section>


 {/* === Projects Section === */}
<section className="py-16 bg-white" id="projects">
  <div className="max-w-7xl mx-auto px-6">

    {/* Section Title Animation */}
   <motion.h3
      className="text-4xl font-extrabold text-emerald-700 mb-16 flex justify-center tracking-wide"
      initial={{ y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
    >
      <motion.span
        className="bg-white px-8 py-3 rounded-full shadow-md border border-emerald-200 text-emerald-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Our Latest Projects
      </motion.span>
    </motion.h3>

    {/* Conditional Rendering */}
    {projects.length === 0 ? (
      <p className="text-center text-gray-500">No projects available.</p>
    ) : (
      <div className="grid md:grid-cols-3 gap-10">
        {projects.map((p) => (
          <div
            key={p.id}
            className="border border-emerald-100 rounded-2xl shadow-sm 
                       hover:shadow-xl hover:-translate-y-1 
                       transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Image */}
            <img
              src={
                Array.isArray(p.images)
                  ? `${import.meta.env.VITE_API_BASE.replace("/api", "")}${p.images[0]}`
                  : typeof p.images === "string" && p.images.startsWith("/uploads")
                  ? `${import.meta.env.VITE_API_BASE.replace("/api", "")}${p.images}`
                  : p.images || "/assets/project-1.jpg"
              }
              alt={p.title}
              className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="p-6 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-emerald-700 mb-4 leading-snug">
                {p.title}
              </h3>

              {/* View Details Button */}
              <div className="mt-auto pt-2">
                <Link
                  to={`/projects/${p.id}`}
                  className="inline-block text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

{/* === NEWS SECTION === */}
<section id="news" className="py-16 bg-gradient-to-r from-cyan-50 to-emerald-50">
  <div className="container mx-auto px-6">

    {/* Section Title */}
    <motion.h3
      className="text-3xl font-bold text-emerald-700 mb-12 flex justify-center cursor-pointer"
      initial={{ y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <motion.span
        className="bg-white px-6 py-2 rounded-full shadow-sm border border-emerald-100 inline-block"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Latest News
      </motion.span>
    </motion.h3>

    {loading ? (
      <div className="text-center text-gray-500">Loading news…</div>
    ) : news.length ? (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
        className="grid md:grid-cols-3 gap-10"
      >
        {news.map((n) => (
          <motion.div
            key={n.id}
            variants={fadeUp}
            className="bg-white rounded-2xl shadow-sm 
                       hover:shadow-xl hover:-translate-y-1
                       transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* ✅ FULL IMAGE — NO CROPPING */}
            <div className="relative w-full bg-gray-50 overflow-hidden">
              <img
                src={parseImage(n.image_url || n.image, "/assets/news-1.jpg")}
                alt={n.title}
                className="w-full object-contain max-h-[320px] transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-emerald-600/0 hover:bg-emerald-600/20 transition-all duration-500" />

              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-3 right-3 bg-white/90 text-emerald-600 p-2 rounded-full shadow-md opacity-0 hover:opacity-100 transition-all"
              >
                <ArrowUp size={20} />
              </motion.div>
            </div>

            {/* ✅ CONTENT */}
            <div className="p-6 flex flex-col h-full">
              <h4 className="font-semibold text-xl text-emerald-700 mb-3 leading-snug">
                {n.title}
              </h4>

              {/* Only small excerpt */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {n.excerpt ??
                  n.summary ??
                  (n.content ? n.content.slice(0, 110) + "..." : "Read more")}
              </p>

              {/* Button at bottom always */}
              <div className="mt-auto">
                <Link
                  to={`/news/${n.id}`}
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white 
                             font-semibold px-5 py-2 rounded-full text-sm shadow-md 
                             transition-all duration-300 hover:scale-105"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    ) : (
      <div className="text-center text-gray-600">No news to show.</div>
    )}
  </div>
</section>



{/* CONTACT */}
<section
  id="contact"
  className="relative py-12 md:py-14 text-gray-100 overflow-hidden"
>
    {/* 🌿 Gradient background matching your provided image */}
  <div
  className="absolute inset-0"
  style={{
    backgroundColor: "#EEF1F7", // 🎨 soft gray-blue tone
    backgroundImage: "url('/assets/solar-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.97,
  }}
/>
<div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

  <div className="relative max-w-7xl mx-auto px-6">
  <motion.h3
  className="text-3xl font-bold text-emerald-700 mb-8 flex justify-center cursor-pointer"
  initial={{ y: 0 }}
  whileHover={{ y: -10 }}
  transition={{ type: "spring", stiffness: 200, damping: 10 }}
>
  <motion.span
    className="bg-white px-6 py-2 rounded-full shadow-sm border border-emerald-100 inline-block"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    Let’s Work Together!
  </motion.span>
</motion.h3>

<p className="text-center text-black max-w-2xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
  Power your business or community with sustainable solar innovation.  
  Reach out, our team will get back to you shortly.
</p>


    <div className="grid md:grid-cols-2 gap-8">
      {/* LEFT FORM */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/90 backdrop-blur-xl border border-emerald-200 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.25)] p-6 md:p-8 text-gray-800"
      >
        <h3 className="text-2xl font-semibold text-emerald-800 mb-4">
          Send us a message
        </h3>

        {submitted ? (
          <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg text-center font-semibold">
            ✅ Thank you! We’ve received your message.
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await axios.post(`${API_BASE}/contact`, contact);
                setContact({
                  name: "",
                  email: "",
                  phone: "",
                  service: "",
                  message: "",
                });
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 4000);
              } catch {
                alert("Failed to send contact. Please try again later.");
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                value={contact.name}
                onChange={(e) =>
                  setContact({ ...contact, name: e.target.value })
                }
                placeholder="Your Name"
                className="px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 w-full outline-none transition"
              />
              <input
                required
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                placeholder="Your Email"
                className="px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 w-full outline-none transition"
              />
            </div>

            <input
              value={contact.phone}
              onChange={(e) =>
                setContact({ ...contact, phone: e.target.value })
              }
              placeholder="Phone Number"
              className="px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 w-full outline-none transition"
            />

            <select
              value={contact.service}
              onChange={(e) =>
                setContact({ ...contact, service: e.target.value })
              }
              className="px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 w-full outline-none transition bg-white"
            >
              <option value="">Select Service Type</option>
              <option value="Solar Panel Installation">
                Solar Panel Installation
              </option>
              <option value="Electromechanical Work">
                Electromechanical Work
              </option>
              <option value="Training & Capacity Building">
                Training & Capacity Building
              </option>
              <option value="Solar Inverters & Batteries">
                Solar Inverters & Batteries
              </option>
            </select>

            <textarea
              required
              value={contact.message}
              onChange={(e) =>
                setContact({ ...contact, message: e.target.value })
              }
              placeholder="Project Requirements"
              rows="4"
              className="px-4 py-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-400 w-full outline-none transition"
            />

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300"
            >
              Send Message →
            </button>
          </form>
        )}
      </motion.div>

      {/* RIGHT SIDE */}
      <div className="space-y-5">
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-200 rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.25)] p-6 text-gray-800">
          <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
            Contact Information
          </h3>
          <p className="flex items-center gap-2 text-gray-700">📞 +251 91923 8224</p>
          <p className="flex items-center gap-2 text-gray-700">✉️ hopeenergy1923@gmail.com</p>
          <p className="flex items-center gap-2 text-gray-700">📍 Meskel Flower, Addis Ababa, Ethiopia</p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.305857458048!2d38.76293917492286!3d8.988188291021257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b844591cefe1f%3A0x4096ef6200a52cca!2sMeskel%20Flower%20Hotel!5e0!3m2!1sen!2set!4v1730415600000!5m2!1sen!2set"
            width="100%"
            height="220"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hope Energy Location"
          ></iframe>
        </div>

        <div className="bg-white/90 backdrop-blur-xl border border-emerald-200 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.25)] p-5 text-gray-800">
          <h4 className="text-xl font-semibold text-emerald-800 mb-2">Office Hours</h4>
          <div className="flex justify-between text-gray-700 mb-1">
            <span>Mon - Fri</span>
            <span>9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Saturday</span>
            <span>10:00 AM - 4:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* ✅ Toast Notification */}
  {submitted && (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 right-6 bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.6)] text-sm font-semibold z-[9999]"
    >
      ✅ Message sent successfully!
    </motion.div>
  )}
</section>
{/* ✅ Floating Scroll Buttons (Up & Down) */}
<div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
  <button
    onClick={() => scrollToSection("up")}
    className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
  >
    <ArrowUp size={22} />
  </button>

  <button
    onClick={() => scrollToSection("down")}
    className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
  >
    <ArrowDown size={22} />
  </button>
</div>


      {/* FOOTER */}
      <Footer />
    </div>
  );
}
