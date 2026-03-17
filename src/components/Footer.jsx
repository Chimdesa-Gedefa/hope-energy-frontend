import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  // Define your social links here for easy management
  const socialLinks = [
    { 
      Icon: Facebook, 
      href: "https://web.facebook.com/sagni.tesfahun", 
      label: "Facebook" 
    },
    { 
      Icon: Twitter, 
      href: "https://twitter.com/your-profile", 
      label: "Twitter" 
    },
    { 
      Icon: Linkedin, 
      href: "https://www.linkedin.com/in/sagni-tesfahun-863a58254", 
      label: "LinkedIn" 
    },
  ];

  return (
    <footer className="bg-gradient-to-tr from-emerald-800 via-cyan-700 to-emerald-900 text-white pt-12 pb-8 mt-12">
      
      {/* WRAPPER */}
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-sm">

        {/* LOGO & INTRO */}
        <div className="text-center md:text-left">
          <img
            src="/assets/logo.png"
            alt="Hope Energy PLC"
            className="w-16 h-16 mx-auto md:mx-0 mb-4 object-contain drop-shadow-md"
          />

          <h2 className="font-bold text-2xl mb-2 tracking-wide">
            Hope Energy PLC
          </h2>

          <p className="text-gray-200 leading-relaxed">
            Empowering Ethiopia through renewable energy solutions,
            innovation, and sustainable development.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-yellow-300 text-lg mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow-300 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-yellow-300 transition">About Us</Link></li>
            <li><Link to="/services" className="hover:text-yellow-300 transition">Our Services</Link></li>
            <li><Link to="/projects" className="hover:text-yellow-300 transition">Projects</Link></li>
            <li><Link to="/news" className="hover:text-yellow-300 transition">News & Updates</Link></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-yellow-300 text-lg mb-4">Contact</h3>

          <ul className="space-y-3 text-gray-200">
            <li className="flex justify-center md:justify-start items-center gap-2">
              <MapPin size={16} /> Meskel Flower Hotel, Addis Ababa, Ethiopia
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2">
              <Phone size={16} /> +251919238224
            </li>
            <li className="flex justify-center md:justify-start items-center gap-2">
              <Mail size={16} /> hopeenergy1923@gmail.com
            </li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-yellow-300 text-lg mb-4">Follow Us</h3>

          <div className="flex justify-center md:justify-start gap-4">
            {socialLinks.map(({ Icon, href, label }, index) => (
              <a
                key={index}
                href={href}
                target="_blank" 
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 bg-white/10 rounded-full hover:bg-yellow-300 hover:text-gray-900 transition shadow-sm"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-white/20 mt-10 pt-4 text-center text-xs sm:text-sm text-gray-300">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-yellow-300">Hope Energy PLC</span>.
        All rights reserved.

        <div className="mt-2">
          Developed by{" "}
          <a
            href="https://web.facebook.com/profile.php?id=100007245858030"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-300"
          >
            <span className="font-bold text-green-400 hover:text-green-300 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]">
              Bush
            </span>
            <span className="font-bold text-red-500 hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              Techs
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}