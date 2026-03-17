import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

/* === Accordion-style ExpandableCard === */
const ExpandableCard = ({ title, text }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setOpen(!open)}
      className="border-b border-emerald-200 cursor-pointer select-none py-4"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-emerald-800">{title}</h4>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-emerald-700 text-2xl leading-none"
        >
          +
        </motion.span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 text-gray-700 text-base leading-relaxed"
          >
            {text ||
              "Empowering communities through sustainable and accessible clean energy."}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* === MAIN PAGE === */
export default function AboutPage() {
  const [about, setAbout] = useState({});
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, t, p, ts] = await Promise.all([
          axios.get(`${API_BASE}/about`),
          axios.get(`${API_BASE}/about/team`),
          axios.get(`${API_BASE}/about/partners`),
          axios.get(`${API_BASE}/about/testimonials`),
        ]);
        setAbout(a.data || {});
        setTeam(Array.isArray(t.data) ? t.data : []);
        setPartners(Array.isArray(p.data) ? p.data : []);
        setTestimonials(Array.isArray(ts.data) ? ts.data : []);
      } catch (err) {
        console.error("❌ Error loading About data:", err);
      }
    };
    fetchData();
  }, []);

  const trackRef = useRef(null);
  const controls = useAnimation();
  useEffect(() => {
    if (!partners.length) return;
    const totalWidth = (partners.length + 1) * 220;
    const duration = totalWidth / 15;
    controls.start({
      x: [0, -totalWidth],
      transition: { repeat: Infinity, duration, ease: "linear" },
    });
  }, [partners]);

  const partnersDup = [...partners, ...partners];

  const TestimonialCarousel = ({ testimonials }) => {
    const [index, setIndex] = useState(0);
    useEffect(() => {
      if (!testimonials.length) return;
      const timer = setInterval(
        () => setIndex((prev) => (prev + 1) % testimonials.length),
        6000
      );
      return () => clearInterval(timer);
    }, [testimonials]);
    if (!testimonials.length) return null;
    const t = testimonials[index];

    return (
      <motion.div
        key={t.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="bg-white/90 backdrop-blur-lg border border-emerald-100 shadow-2xl rounded-3xl p-10 max-w-3xl mx-auto relative overflow-hidden"
      >
        <Quote className="absolute top-6 left-6 text-emerald-100 w-12 h-12" />
        <h4 className="text-2xl font-semibold text-emerald-700 mb-4">
          “{t.title}”
        </h4>
        <p className="text-gray-700 italic mb-4 leading-relaxed">{t.text}</p>
        <p className="text-sm font-medium text-emerald-600">— {t.author}</p>
      </motion.div>
    );
  };

  return (
    <>
      <Header navSolid={true} />
      <Hero
        title="Hope Energy & Electromechanical Work Plc"
        subtitle="Empowering Ethiopia’s clean energy transformation through innovation, sustainability, and excellence."
        primaryBtnText="Explore Our Services"
        primaryBtnLink="/services"
        secondaryBtnText="Contact Us"
        secondaryBtnLink="/contact"
        bgImage="/assets/about-header.jpg"
      />

     {/* === ABOUT SECTION === */} 
<section className="relative py-16 bg-gradient-to-b from-emerald-50 to-emerald-100">
  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

    {/* ✅ IMAGE — Full visible, not cut, parallel, same height */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="rounded-3xl overflow-hidden shadow-lg h-full flex"
    >
      <img
        src={about.image || "/assets/Homephoto.png"}
        alt="Hope Energy About"
        className="w-full h-full max-h-[450px] object-contain bg-white"
      />
    </motion.div>


    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-lg rounded-3xl p-8"
    >
      {/* 🌿 Styled Section Title */}
      <div className="flex justify-center mb-8">
        <h2 className="text-2xl font-bold text-emerald-700 px-8 py-3 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
          About Hope Energy
        </h2>
      </div>

      <p className="text-gray-700 leading-relaxed mb-6 text-lg">
        {about.description ||
          "Hope Energy & Electromechanical Work Plc delivers renewable energy and engineering solutions across Ethiopia driving sustainable growth with solar innovations and reliable infrastructure."}
      </p>

      <div className="bg-white rounded-xl p-6 border border-emerald-100">
        {[
          { title: "Our Vision", text: about.vision },
          { title: "Our Mission", text: about.mission },
          { title: "Our Goals", text: about.goals },
        ].map((item, i) => (
          <ExpandableCard key={i} title={item.title} text={item.text} />
        ))}
      </div>
    </motion.div>
  </div>
</section>

{/* === TEAM SECTION === */}
<section className="py-16 bg-gradient-to-b from-white to-emerald-50">
  <div className="max-w-7xl mx-auto px-6 text-center">
    {/* 🌿 Styled Title */}
    <div className="flex justify-center mb-10">
      <h3 className="text-2xl font-bold text-emerald-700 px-8 py-3 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
        Our Leadership & Team
      </h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
      {team.slice(0, 8).map((m, i) => (
        <motion.div
          key={m.id || i}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-emerald-100 group w-full max-w-[280px]"
        >
          <div className="bg-gradient-to-b from-emerald-50 to-white p-3 flex justify-center items-center">
            <img
              src={m.image}
              alt={m.name}
              className="h-[280px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4 text-center">
            <h4 className="font-semibold text-emerald-800 text-lg">{m.name}</h4>
            <p className="text-sm text-gray-500">{m.position}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* === PARTNERS SECTION === */}
<section className="py-16 bg-gradient-to-b from-emerald-100 to-white">
  <div className="max-w-6xl mx-auto px-6 text-center">
    {/* 🌿 Styled Title */}
    <div className="flex justify-center mb-10">
      <h3 className="text-2xl font-bold text-emerald-700 px-8 py-3 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
        Our Partners
      </h3>
    </div>

    <div className="relative overflow-hidden py-6">
      <motion.div
        ref={trackRef}
        animate={controls}
        className="flex gap-8 items-center"
        style={{ willChange: "transform" }}
      >
        {partnersDup.map((p, i) => (
          <motion.div
            key={`${p.id}-${i}`}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg border border-emerald-50 p-6 flex flex-col items-center justify-center min-w-[200px]"
          >
            <img
              src={p.logo}
              alt={p.name}
              className="w-24 h-24 object-contain mb-3"
            />
            <p className="text-emerald-700 font-semibold text-sm">{p.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </div>
</section>

{/* === TESTIMONIALS SECTION === */}
<section className="py-16 bg-gradient-to-b from-white to-emerald-50">
  <div className="max-w-6xl mx-auto px-6 text-center">
    {/* 🌿 Styled Title */}
    <div className="flex justify-center mb-10">
      <h3 className="text-2xl font-bold text-emerald-700 px-8 py-3 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
        Testimonials
      </h3>
    </div>

    {testimonials.length > 0 ? (
      <TestimonialCarousel testimonials={testimonials} />
    ) : (
      <p className="text-gray-500">No testimonials available yet.</p>
    )}
  </div>
</section>

      <Footer />
    </>
  );
}
