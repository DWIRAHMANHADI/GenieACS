import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { motion } from "framer-motion";

export default function DevicesPage() {
  const { user } = useAuth();
  const { apiUrl } = useConfig();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (!apiUrl) {
      setError("URL API GenieACS belum diatur.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${apiUrl.replace(/\/$/, "")}/devices`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data perangkat");
        return res.json();
      })
      .then((data) => {
        setDevices(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [user, apiUrl, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight mb-1">Daftar Perangkat</h1>
        <div className="text-center text-gray-500 dark:text-gray-300 italic text-sm mb-8">Semua perangkat terdaftar di GenieACS</div>
        {loading ? (
          <div className="text-center text-gray-500">Memuat perangkat...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 bg-white/70 dark:bg-gray-900/70 backdrop-blur mb-10"
          >
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200">
                  <th className="px-4 py-3 font-semibold">Serial Number</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">IP Address</th>
                  <th className="px-4 py-3 font-semibold">Last Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Virtual Param</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {devices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">Tidak ada perangkat ditemukan.</td>
                  </tr>
                )}
                {devices.map((dev, i) => {
                  const status = dev["_online"] ? "Online" : "Offline";
                  const lastContact = dev["_lastInform"] ? new Date(dev["_lastInform"]).toLocaleString() : "-";
                  return (
                    <motion.tr
                      key={dev._id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="hover:bg-blue-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-2 font-mono">{dev["_id"] || "-"}</td>
                      <td className="px-4 py-2">{dev["Device.DeviceInfo.ModelName"] || "-"}</td>
                      <td className="px-4 py-2">{dev["InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress"] || dev["Device.WAN.IPConnection.1.ExternalIPAddress"] || "-"}</td>
                      <td className="px-4 py-2">{lastContact}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${status === "Online" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}`}>{status}</span>
                      </td>
                      <td className="px-4 py-2">{dev["VirtualParameters"] ? Object.keys(dev["VirtualParameters"]).length : 0}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => navigate(`/devices/${encodeURIComponent(dev._id)}`)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow transition-all"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
