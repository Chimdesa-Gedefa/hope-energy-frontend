import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  Wrench,
  Briefcase,
  Newspaper,
  Phone,
  Mail,
  Menu,
  X,
  Zap,
  Cpu,
  ShieldCheck,
  Activity,
} from "lucide-react";

export default function Header({ navSolid = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { id: "home", label: "Home", icon: <Home size={18} /> },
    { id: "about", label: "About", icon: <Info size={18} /> },
    { id: "services", label: "Services", icon: <Wrench size={18} /> },
    { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
    { id: "news", label: "News", icon: <Newspaper size={18} /> },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    setOpenMenu(false);
    const target = document.getElementById(sectionId);
    if (location.pathname === "/") {
      if (sectionId === "home") window.scrollTo({ top: 0, behavior: "smooth" });
      else target?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        if (sectionId === "home") window.scrollTo({ top: 0, behavior: "smooth" });
        else document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 font-sans transition-all duration-700">
      {/* === TOP BAR: AI NEURAL INTERFACE === */}
      <div className="relative bg-[#020617] text-white py-2 overflow-hidden border-b border-emerald-500/20">
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `radial-gradient(#334155 1px, transparent 0)`,
               backgroundSize: '20px 20px' 
             }}>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-400">System Live</span>
            </div>
            <span className="font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400">
              Hope Energy & Electromechanical Work PLC
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="tel:+251919238224" className="flex items-center gap-2 group text-[11px] font-bold">
              <Phone size={12} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="group-hover:text-emerald-400 transition-colors">+251 919 238 224</span>
            </a>
            <a href="mailto:hopeenergy1923@gmail.com" className="flex items-center gap-2 group text-[11px] font-bold">
              <Mail size={12} className="text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-emerald-400 transition-colors">hopeenergy1923@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* === MAIN NAVIGATION: HOLOGRAPHIC PILL === */}
      <div className={`px-4 md:px-10 transition-all duration-700 ${scrolled ? "py-3" : "py-8"}`}>
        <div className={`mx-auto max-w-7xl rounded-[2.5rem] transition-all duration-700 relative ${
          scrolled 
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-white/50" 
          : "bg-white/10 backdrop-blur-md border border-white/20"
        }`}>
          
          <div className="relative px-8 py-3 flex items-center justify-between">
            {/* Branding with Tech-Icon */}
            <Link to="/" className="flex items-center gap-5 group">
              <div className="relative">
                <div className="absolute -inset-3 bg-emerald-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition duration-700"></div>
                <div className="relative p-1.5 bg-white rounded-2xl shadow-2xl">
                  <img src="/assets/logo.png" alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                  <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Activity size={8} className="text-white animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tighter">
                  HOPE<span className="text-emerald-600">ENERGY</span>
                </h1>
               
              </div>
            </Link>

            {/* Desktop Links: AI Capsule Style */}
            <nav className="hidden lg:flex items-center gap-2 bg-slate-900/5 p-1 rounded-full border border-slate-900/5">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`/#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                  className="px-6 py-2.5 text-sm font-black text-slate-700 hover:text-emerald-700 transition-all rounded-full hover:bg-white hover:shadow-xl flex items-center gap-2 group"
                >
                  <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">{link.icon}</span>
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Action Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => handleScroll(e, "contact")}
                className="hidden md:flex items-center gap-3 bg-slate-950 text-white px-8 py-3.5 rounded-full font-black text-[11px] tracking-[0.2em] hover:bg-emerald-600 transition-all hover:scale-105 shadow-2xl group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                Contact Us
              </button>

              <button
                className="lg:hidden p-3.5 rounded-2xl bg-slate-950 text-white"
                onClick={() => setOpenMenu(!openMenu)}
              >
                {openMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile AI Interface Overlay */}
      <div className={`lg:hidden fixed inset-x-6 top-32 transition-all duration-500 ${openMenu ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white p-6">
           <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.id} href={`/#${link.id}`} onClick={(e) => handleScroll(e, link.id)} 
                   className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 hover:bg-emerald-600 hover:text-white transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">{link.icon}</div>
                    <span className="font-black text-lg tracking-tight">{link.label}</span>
                  </div>
                  <Zap size={18} className="text-emerald-500 group-hover:text-white" />
                </a>
              ))}
              <button onClick={(e) => handleScroll(e, "contact")} className="w-full bg-slate-950 text-emerald-400 py-6 rounded-[2rem] font-black text-xl mt-4 shadow-2xl flex items-center justify-center gap-3">
                <ShieldCheck size={24} />
                CONTACT EXPERT
              </button>
           </div>
        </div>
      </div>
    </header>
  );
}