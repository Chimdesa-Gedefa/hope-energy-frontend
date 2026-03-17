// ✅ frontend/src/admin/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminApp from "./AdminApp";

export default function AdminRouter() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />       {/* note: no "/admin" prefix */}
      <Route path="/*" element={<AdminApp />} />       {/* note: no "/admin" prefix */}
    </Routes>
  );
}
