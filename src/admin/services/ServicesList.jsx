import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/services").then((res) => {
      setServices(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    await api.delete(`/admin/services/${id}`);
    setServices(services.filter((s) => s.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Services</h2>
        <Link to="/admin/services/new" className="bg-green-600 text-white px-3 py-2 rounded">
          Add Service
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm">{s.description?.slice(0, 100)}...</p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/services/edit/${s.id}`}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(s.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
