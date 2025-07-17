import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import ModalApiSetting from "../components/ModalApiSetting";

export default function LoginPage() {
  const { login } = useAuth();
  const { apiUrl } = useConfig();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    const success = login(email, password);
    if (success) {
      setError("");
      navigate("/dashboard");
    } else {
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 dark:from-gray-900 to-white dark:to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-10 bg-white/60 dark:bg-gray-800/60 rounded-3xl shadow-2xl relative overflow-visible border border-gray-200 dark:border-gray-700 backdrop-blur-[6px]"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
      >
        {/* Gear icon kanan atas */}
        <button
          aria-label="Setting API URL"
          onClick={() => setShowModal(true)}
          className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 z-10 bg-white/70 dark:bg-gray-800/70 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-700"
        >
          <Settings2 size={22} />
        </button>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="flex justify-center mb-3"
        >
          <img
            src="https://nms.myriseid.com/public/img/bg/logo2.png"
            alt="MyRise Logo"
            className="h-24 w-auto drop-shadow-lg select-none"
            draggable={false}
          />
        </motion.div>
        {/* Judul */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="text-xl font-bold text-center mb-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight"
        >
          
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.34, duration: 0.5 }}
          className="text-center text-gray-500 dark:text-gray-300 italic text-sm mb-6"
        >
          Manajemen Perangkat TR-069 dengan GenieACS
        </motion.div>
        <div className="w-16 mx-auto border-b border-blue-200 dark:border-blue-800 mb-4 opacity-70" />
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Divider dekoratif di bawah subtitle sudah ada di atas */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-semibold">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2.5 rounded-lg shadow-lg transition-all duration-200 text-lg tracking-wide backdrop-blur hover:scale-[1.025] active:scale-100"
            style={{ letterSpacing: '.02em' }}
          >
            Login
          </button>
        </form>
      </motion.div>
      {showModal && (
        <ModalApiSetting onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
