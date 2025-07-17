import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Settings, Home, List } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { label: "Dashboard", to: "/dashboard", icon: <Home size={18}/> },
    { label: "Devices", to: "/devices", icon: <List size={18}/> },
    { label: "Settings", to: "/settings", icon: <Settings size={18}/> },
  ];

  if (!user) return null;

  return (
    <nav className="w-full bg-white/70 dark:bg-gray-950/80 backdrop-blur border-b border-blue-100 dark:border-blue-900 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 text-lg tracking-tight select-none">
          <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent">MyRise ACS</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          {menus.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition text-sm ${location.pathname.startsWith(m.to) ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200" : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800"}`}
            >
              {m.icon} <span className="hidden sm:inline">{m.label}</span>
            </Link>
          ))}
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition"
            title="Logout"
          >
            <LogOut size={18}/> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
