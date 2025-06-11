import React from "react";
import { HiHome, HiShoppingBag } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-neutral-900 shadow-lg sticky top-0 z-10">
      {/* Upper navbar */}
      <div className="max-w-5xl mx-auto px-4 py-3 border-b border-neutral-800">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-neutral-100">GS CURVAS</h1>
        </div>
      </div>

      {/* Lower navbar with icons */}
      <div className="max-w-5xl mx-auto px-8 py-2">
        <div className="flex justify-center gap-12">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <HiHome className="w-5 h-5" />
            <span>Productos</span>
          </button>
          <button
            onClick={() => navigate("/admin/categories")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-200"
          >
            <HiShoppingBag className="w-5 h-5" />
            <span>Categorias</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
