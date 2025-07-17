import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { motion } from "framer-motion";
import { Pencil, RefreshCcw, Download, Power } from "lucide-react";

function formatUptime(uptime) {
  if (!uptime) return "-";
  const d = Math.floor(uptime / 86400);
  const h = Math.floor((uptime % 86400) / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

export default function DeviceDetailPage() {
  const { user } = useAuth();
  const { apiUrl } = useConfig();
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
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
    fetch(`${apiUrl.replace(/\/$/, "")}/devices/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data perangkat");
        return res.json();
      })
      .then((data) => {
        setDevice(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [user, apiUrl, id, navigate]);

  // Kumpulan parameter penting (bisa disesuaikan)
  const info = device || {};
  const infoRows = [
    { label: "Serial Number", value: info._id },
    { label: "MAC Address", value: info["Device.DeviceInfo.SerialNumber"] || info["InternetGatewayDevice.DeviceInfo.SerialNumber"] },
    { label: "Model", value: info["Device.DeviceInfo.ModelName"] || info["InternetGatewayDevice.DeviceInfo.ModelName"] },
    { label: "Firmware", value: info["Device.DeviceInfo.SoftwareVersion"] || info["InternetGatewayDevice.DeviceInfo.SoftwareVersion"] },
    { label: "IP Address", value: info["Device.WAN.IPConnection.1.ExternalIPAddress"] || info["InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress"] },
    { label: "Uptime", value: formatUptime(info["Device.DeviceInfo.UpTime"] || info["InternetGatewayDevice.DeviceInfo.UpTime"]) },
    { label: "Last Contact", value: info._lastInform ? new Date(info._lastInform).toLocaleString() : "-" },
  ];

  // Ambil semua parameter TR-069 (yang lain)
  const tr069Params = Object.entries(device || {})
    .filter(([k, v]) => k.includes("Device.") || k.includes("InternetGatewayDevice."))
    .filter(([k]) => !["Device.DeviceInfo.SerialNumber","Device.DeviceInfo.ModelName","Device.DeviceInfo.SoftwareVersion","Device.DeviceInfo.UpTime","InternetGatewayDevice.DeviceInfo.SerialNumber","InternetGatewayDevice.DeviceInfo.ModelName","InternetGatewayDevice.DeviceInfo.SoftwareVersion","InternetGatewayDevice.DeviceInfo.UpTime"].includes(k))
    .slice(0, 20); // tampilkan max 20 dulu

  // Virtual Parameters
  const virtualParams = device && device.VirtualParameters ? device.VirtualParameters : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight mb-1">Detail Perangkat</h1>
        <div className="text-center text-gray-500 dark:text-gray-300 italic text-sm mb-8">Informasi lengkap perangkat TR-069</div>
        {loading ? (
          <div className="text-center text-gray-500">Memuat detail perangkat...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : device ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900 backdrop-blur p-6 mb-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {infoRows.map((row) => (
                <div key={row.label} className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{row.label}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-base break-all">{row.value || "-"}</span>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <div className="font-semibold text-blue-600 dark:text-blue-300 mb-3">Parameter TR-069</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-blue-50 dark:bg-blue-950">
                      <th className="px-3 py-2 text-left">Parameter</th>
                      <th className="px-3 py-2 text-left">Nilai</th>
                      <th className="px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tr069Params.length === 0 && (
                      <tr><td colSpan={3} className="text-center py-6 text-gray-400">Tidak ada parameter lain</td></tr>
                    )}
                    {tr069Params.map(([k, v]) => (
                      <tr key={k} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                        <td className="px-3 py-2 font-mono break-all">{k}</td>
                        <td className="px-3 py-2 break-all">{String(v)}</td>
                        <td className="px-2 py-2 text-right">
                          {/* Untuk parameter editable, nanti tampilkan icon pencil di sini */}
                          <button className="text-blue-500 hover:text-blue-700"><Pencil size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {virtualParams && (
              <div className="mb-6">
                <div className="font-semibold text-blue-600 dark:text-blue-300 mb-3">Virtual Parameters</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr className="bg-blue-50 dark:bg-blue-950">
                        <th className="px-3 py-2 text-left">Nama</th>
                        <th className="px-3 py-2 text-left">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(virtualParams).map(([k, v]) => (
                        <tr key={k} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                          <td className="px-3 py-2 font-mono break-all">{k}</td>
                          <td className="px-3 py-2 break-all">{String(v)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Tombol aksi */}
            <div className="flex flex-wrap gap-3 mt-8 justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-all"><Power size={18}/> Reboot</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow transition-all"><RefreshCcw size={18}/> Factory Reset</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-all"><Download size={18}/> Download Config</button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
