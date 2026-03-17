import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

export default function ContactPage() {
  return (
    <>
      <Header navSolid={true} />

      {/* ✅ Hero consistent with others */}
      <Hero
        title="Get In Touch"
        subtitle="We’re here to help you with renewable energy solutions and project inquiries."
      />

      <main className="bg-gradient-to-b from-white to-emerald-50 text-gray-800">
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-8">
            Have a question or want to start a project with Hope Energy?
            Reach out to us today.
          </p>

          <form className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-emerald-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-emerald-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full border border-emerald-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-full transition"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}
