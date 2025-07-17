import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function DevicesPage() {
  const { user } = useAuth();
  const { apiUrl } = useConfig();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  // Filter devices sesuai status
  const now = Date.now();
  const getStatus = (d) => {
    let lastInformMs = d._lastInformMs;
    if (lastInformMs) {
      if (lastInformMs < 1e12) lastInformMs = lastInformMs * 1000;
    } else if (d._lastInform) {
      lastInformMs = Date.parse(d._lastInform);
    }
    return lastInformMs && now - lastInformMs < 5 * 60 * 1000 ? "online" : "offline";
  };
  const filteredDevices = devices.filter(d => {
    if (filterStatus === "all") return true;
    return getStatus(d) === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight mb-1">Daftar Perangkat</h1>
        <div className="text-center text-gray-500 dark:text-gray-300 italic text-sm mb-8">List perangkat TR-069 dari GenieACS</div>
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button onClick={() => setFilterStatus("all")} className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition ${filterStatus==='all' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'}`}>All</button>
          <button onClick={() => setFilterStatus("online")} className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition ${filterStatus==='online' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'}`}>Online</button>
          <button onClick={() => setFilterStatus("offline")} className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition ${filterStatus==='offline' ? 'bg-red-600 text-white' : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'}`}>Offline</button>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Memuat data perangkat...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div initial={{opacity:0, y:24}} animate={{opacity:1, y:0}} transition={{duration:0.5}}>
            <div className="overflow-x-auto rounded-xl shadow-lg bg-white/80 dark:bg-gray-900/80 border border-blue-100 dark:border-blue-900 backdrop-blur">
              <table className="min-w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-blue-50 dark:bg-blue-950">
                    <th className="px-3 py-2 text-left">Serial Number</th>
                    <th className="px-3 py-2 text-left">Model</th>
                    <th className="px-3 py-2 text-left">IP</th>
                    <th className="px-3 py-2 text-left">Last Contact</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Virtual Params</th>
                    <th className="px-3 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDevices.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400">Tidak ada perangkat</td></tr>
                  )}
                  {filteredDevices.map((d, i) => {
                    const status = getStatus(d);
                    return (
                      <tr key={d._id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition cursor-pointer" onClick={() => navigate(`/devices/${d._id}`)}>
                        <td className="px-3 py-2 font-mono break-all">{d._id}</td>
                        <td className="px-3 py-2">{d["Device.DeviceInfo.ModelName"] || d["InternetGatewayDevice.DeviceInfo.ModelName"] || "-"}</td>
                        <td className="px-3 py-2">{d["Device.WAN.IPConnection.1.ExternalIPAddress"] || d["InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress"] || "-"}</td>
                        <td className="px-3 py-2">{d._lastInform ? new Date(d._lastInform).toLocaleString() : "-"}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status === "online" ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}`}>{status === "online" ? "Online" : "Offline"}</span>
                        </td>
                        <td className="px-3 py-2 text-center">{d.VirtualParameters ? Object.keys(d.VirtualParameters).length : 0}</td>
                        <td className="px-3 py-2 text-right">
                          <button className="text-blue-500 hover:text-blue-700" onClick={e => {e.stopPropagation();navigate(`/devices/${d._id}`)}}><Eye size={18} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
