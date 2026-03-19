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

// ✅ 1. CORRECTED API SETUP
// Ensure VITE_API_BASE in Vercel is: https://hope-energy-backend.onrender.com/api
const API_BASE = import.meta.env.VITE_API_BASE;
// This creates the base URL for images by removing /api (e.g., https://hope-energy-backend.onrender.com)
const ASSET_URL = API_BASE?.replace("/api", "") || "";

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
  const contactRef = useRef(null);

  // ✅ 2. CORRECTED IMAGE PARSER (Handles arrays, strings, and Render paths)
  const parseImage = (img, fallback = "/assets/project-1.jpg") => {
    if (!img) return fallback;
    
    let path = img;
    try {
      // Handle if the DB returned a JSON string array like '["/uploads/1.jpg"]'
      if (typeof img === "string" && img.startsWith("[")) {
        const parsed = JSON.parse(img);
        path = Array.isArray(parsed) ? parsed[0] : parsed;
      } else if (Array.isArray(img)) {
        path = img[0];
      }
    } catch (e) {
      path = img;
    }

    // If it's already a full URL, use it
    if (typeof path === "string" && path.startsWith("http")) return path;
    
    // Otherwise, attach the backend host (ASSET_URL) to the relative path
    return `${ASSET_URL}${path}`;
  };

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
    }, [trigger, end]);
    return count;
  }

  const animatedValues = stats.map((s) => useCounter(s.value, visible));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % 5);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // ✅ 3. CORRECTED DATA FETCHING (Ensuring API_BASE is used correctly)
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
        console.error("Connection Error:", err);
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

  const iconMap = { School, Building, HeartPulse, Building2 };
  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const stagger = { show: { transition: { staggerChildren: 0.12 } } };

  const scrollToContact = (e) => {
    e.preventDefault();
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans text-gray-900 antialiased bg-gradient-to-b from-white to-emerald-50">
      <Header navSolid={navSolid} />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {["/assets/hero1.jpg", "/assets/hero2.jpg", "/assets/hero3.jpg", "/assets/hero4.jpg", "/assets/hero5.jpg"].map((img, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: i === currentImage ? 1 : 0, scale: i === currentImage ? 1.05 : 1.1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-6 lg:px-12 z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="max-w-3xl">
            <motion.span variants={fadeUp} className="inline-block py-1 px-3 mb-6 border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium tracking-widest text-sm uppercase">
              Sustainable Energy Solutions
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              Powering Ethiopia’s <br /> <span className="text-emerald-500">Renewable Future</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 leading-relaxed">
              Hope Energy pioneers world-class renewable solutions to provide reliable, sustainable, and innovative power to communities across the nation.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-5">
              <Link to="/projects" className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-sm transition-all duration-300 overflow-hidden">
                <span className="relative z-10">EXPLORE PROJECTS</span>
                <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 bg-emerald-400 transition-transform duration-300" />
              </Link>
              <a href="#contact" onClick={scrollToContact} className="px-8 py-4 border border-white/30 hover:border-white text-white font-bold rounded-sm transition-colors duration-300 backdrop-blur-sm">
                GET INVOLVED
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="relative py-24 bg-[#fcfcfc] overflow-hidden" ref={statsRef}>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 translate-x-1/2 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
                <div className="relative z-10 shadow-2xl border-[12px] border-white bg-white">
                  <img src="/assets/1AboutHome.jpg" alt="Hope Energy" className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-emerald-600 p-8 text-white z-20 shadow-xl hidden md:block">
                  <p className="text-4xl font-bold font-heading">05+</p>
                  <p className="text-xs uppercase tracking-widest opacity-80">Years of Impact</p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-[2px] bg-emerald-600"></div>
                  <span className="text-emerald-700 font-bold tracking-[0.2em] text-sm uppercase">ABOUT US</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                  Changing lives one village at a time, <br /> <span className="text-emerald-600 italic font-serif">that’s our mission.</span>
                </h2>
                <div className="grid sm:grid-cols-2 gap-8 mb-12">
                  {stats.map((item, i) => {
                    const Icon = iconMap[Object.keys(iconMap)[i]] || School;
                    return (
                      <div key={i} className="group flex items-start gap-4">
                        <div className="mt-1 text-emerald-600"><Icon size={32} /></div>
                        <div>
                          <div className="text-3xl font-bold text-slate-900">{animatedValues[i]}+</div>
                          <div className="text-slate-500 font-medium">{item.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link to="/about" className="inline-flex items-center gap-3 group text-slate-900 font-bold uppercase tracking-wider text-sm">
                  <span className="border-b-2 border-emerald-600 pb-1">Discover our full impact</span>
                  <span className="bg-emerald-600 text-white p-2 rounded-full group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <motion.section id="services" className="py-20 bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="container mx-auto px-6 text-center">
          <motion.h3 className="text-4xl font-extrabold text-emerald-700 mb-16 flex justify-center">
            <span className="bg-white px-8 py-3 rounded-full shadow-md border border-emerald-200">Our Services</span>
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {defaultServices.map((service) => (
              <motion.div key={service.id} whileHover={{ scale: 1.04 }} className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 p-6 min-h-[300px]">
                <h4 className="text-xl font-bold mb-4 text-emerald-800">{service.title}</h4>
                <p className="text-gray-600 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ✅ PROJECTS SECTION - FIXED IMAGE TAGS */}
      <section className="py-16 bg-white" id="projects">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-emerald-700 mb-16 flex justify-center">
             <span className="bg-white px-8 py-3 rounded-full shadow-md border border-emerald-200">Our Latest Projects</span>
          </h3>
          {projects.length === 0 ? (
            <p className="text-center text-gray-500">No projects available.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {projects.map((p) => (
                <div key={p.id} className="border border-emerald-100 rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
                  {/* Corrected src using parseImage */}
                  <img src={parseImage(p.images)} alt={p.title} className="w-full h-56 object-cover" />
                  <div className="p-6 flex flex-col h-full">
                    <h3 className="text-xl font-semibold text-emerald-700 mb-4">{p.title}</h3>
                    <div className="mt-auto"><Link to={`/projects/${p.id}`} className="text-emerald-600 hover:text-emerald-700 font-medium">View Details →</Link></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ✅ NEWS SECTION - FIXED IMAGE TAGS */}
      <section id="news" className="py-16 bg-gradient-to-r from-cyan-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-emerald-700 mb-12 flex justify-center">
            <span className="bg-white px-6 py-2 rounded-full shadow-sm border border-emerald-100">Latest News</span>
          </h3>
          {loading ? (
            <div className="text-center text-gray-500">Loading news…</div>
          ) : news.length ? (
            <div className="grid md:grid-cols-3 gap-10">
              {news.map((n) => (
                <motion.div key={n.id} variants={fadeUp} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col">
                   <img src={parseImage(n.image_url || n.image)} alt={n.title} className="w-full object-contain max-h-[320px]" />
                   <div className="p-6 flex flex-col h-full">
                     <h4 className="font-semibold text-xl text-emerald-700 mb-3">{n.title}</h4>
                     <p className="text-gray-600 text-sm mb-4 line-clamp-3">{n.excerpt || n.content?.slice(0, 100)}</p>
                     <div className="mt-auto"><Link to={`/news/${n.id}`} className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm inline-block">Read More →</Link></div>
                   </div>
                </motion.div>
              ))}
            </div>
          ) : <div className="text-center text-gray-600">No news to show.</div>}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" ref={contactRef} className="relative py-12 md:py-14 text-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 opacity-95" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
             <div>
                <h3 className="text-3xl font-bold text-white mb-6">Let’s Work Together!</h3>
                <p className="text-gray-300 mb-8">Power your business or community with sustainable solar innovation.</p>
             </div>
             <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-3xl text-gray-900 space-y-4">
                <input required placeholder="Your Name" className="w-full p-3 border rounded-xl" value={contact.name} onChange={(e) => setContact({...contact, name: e.target.value})} />
                <input required type="email" placeholder="Your Email" className="w-full p-3 border rounded-xl" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} />
                <textarea required placeholder="Message" className="w-full p-3 border rounded-xl" rows="4" value={contact.message} onChange={(e) => setContact({...contact, message: e.target.value})} />
                <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-colors">SEND MESSAGE</button>
             </form>
          </div>
        </div>
      </section>

      <Footer />

      {/* SCROLL TO TOP */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 p-4 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-500 transition-all active:scale-90"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
