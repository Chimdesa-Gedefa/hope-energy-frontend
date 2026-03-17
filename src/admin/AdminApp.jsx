import React from "react";
import { Link, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

// ✅ Import paths matching your database / backend naming
import AboutInfoForm from "./about_info/AboutInfoForm";
import ServiceForm from "./services/ServiceForm";
import ProjectForm from "./projects/ProjectForm";
import NewsForm from "./news/NewsForm";
import PartnerForm from "./partners/PartnerForm";
import TeamMemberForm from "./team_members/TeamMemberForm";
import TestimonialForm from "./testimonials/TestimonialForm";
import ContactSubmissionsList from "./contact_submissions/ContactSubmissionsList";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  return token ? children : <Navigate to="/admin/login" />;
};

export default function AdminApp() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8 text-center border-b pb-3">
          Hope Energy Admin
        </h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/admin" className="hover:bg-emerald-800 p-2 rounded">Dashboard</Link>
          <Link to="/admin/about_info" className="hover:bg-emerald-800 p-2 rounded">About Info</Link>
          <Link to="/admin/services" className="hover:bg-emerald-800 p-2 rounded">Services</Link>
          <Link to="/admin/projects" className="hover:bg-emerald-800 p-2 rounded">Projects</Link>
          <Link to="/admin/news" className="hover:bg-emerald-800 p-2 rounded">News</Link>
          <Link to="/admin/partners" className="hover:bg-emerald-800 p-2 rounded">Partners</Link>
          <Link to="/admin/team_members" className="hover:bg-emerald-800 p-2 rounded">Team Members</Link>
          <Link to="/admin/testimonials" className="hover:bg-emerald-800 p-2 rounded">Testimonials</Link>
          <Link to="/admin/contact_submissions" className="hover:bg-emerald-800 p-2 rounded">Contact Submissions</Link>
        </nav>

        <button
          onClick={logout}
          className="mt-6 bg-red-600 py-2 rounded hover:bg-red-700 text-white"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/about_info" element={<ProtectedRoute><AboutInfoForm /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
          <Route path="/partners" element={<ProtectedRoute><PartnerForm /></ProtectedRoute>} />
          <Route path="/team_members" element={<ProtectedRoute><TeamMemberForm /></ProtectedRoute>} />
          <Route path="/testimonials" element={<ProtectedRoute><TestimonialForm /></ProtectedRoute>} />
          <Route path="/contact_submissions" element={<ProtectedRoute><ContactSubmissionsList /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
