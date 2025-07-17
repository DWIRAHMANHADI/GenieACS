import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";
import { motion } from "framer-motion";

// cardVariants tidak dipakai lagi, diganti animasi langsung di motion.div grid dan kartu

export default function DashboardPage() {
  const { user } = useAuth();
  const { apiUrl } = useConfig();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
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
        // GenieACS /devices returns array of devices
        if (data && data.length > 0) {
          console.log('Contoh data device:', data[0]);
        }
        const total = data.length;
        const now = Date.now();
        const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 menit
        let online = 0, offline = 0;
        data.forEach((d, idx) => {
          let lastInformMs = d._lastInformMs;
          if (lastInformMs) {
            // Deteksi satuan detik/ms
            if (lastInformMs < 1e12) lastInformMs = lastInformMs * 1000;
          } else if (d._lastInform) {
            // Fallback ke _lastInform ISO string
            lastInformMs = Date.parse(d._lastInform);
          }
          if (idx === 0) {
            console.log('now:', now, 'lastInformMs:', lastInformMs, 'selisih (ms):', now - lastInformMs);
          }
          if (lastInformMs && now - lastInformMs < ONLINE_THRESHOLD) online++;
          else offline++;
        });
        setStats({ total, online, offline });
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [user, apiUrl, navigate]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-6 flex items-center justify-center">
      {/* Dekorasi background blur bulat */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full opacity-30 blur-3xl z-0" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 blur-2xl z-0" style={{transform:'translateY(-50%)'}}/>
      <div className="max-w-3xl mx-auto w-full relative z-10">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-clip-text text-transparent tracking-tight mb-1">Dashboard - MyRise ACS</h1>
        <div className="text-center text-gray-500 dark:text-gray-300 italic text-sm mb-8">Statistik Perangkat TR-069</div>
        {loading ? (
          <div className="text-center text-gray-500">Memuat statistik perangkat...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
            initial="hidden" animate="visible" variants={{visible:{transition:{staggerChildren:0.13}},hidden:{}}}
          >
            {[
              { label: "Total Perangkat", value: stats.total, color: "bg-blue-100/70 dark:bg-blue-950/70", icon: 'devices' },
              { label: "Online", value: stats.online, color: "bg-green-100/70 dark:bg-green-950/70", icon: 'wifi' },
              { label: "Offline", value: stats.offline, color: "bg-red-100/70 dark:bg-red-950/70", icon: 'power-off' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i*0.12, type: "spring", stiffness: 70 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-2xl shadow-xl px-5 py-7 sm:px-7 sm:py-9 flex flex-col items-center gap-3 ${item.color} border border-blue-200/60 dark:border-blue-800/60 transition-all duration-200 group cursor-pointer active:scale-[0.98] select-none`}
                style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
                tabIndex={0}
                onClick={() => navigate('/devices')}
              >
                <div className="flex items-center gap-2 mb-1">
                  {item.icon === 'devices' && (
                    <svg className="w-10 h-10 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 18h6"/></svg>
                  )}
                  {item.icon === 'wifi' && (
                    <svg className="w-10 h-10 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M12 20h.01"/></svg>
                  )}
                  {item.icon === 'power-off' && (
                    <svg className="w-10 h-10 text-red-500 dark:text-red-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v10"/><path d="M6.38 6.38a9 9 0 1 0 11.24 0"/></svg>
                  )}
                </div>
                <div className="text-4xl font-extrabold mb-0.5 text-gray-800 dark:text-gray-100 drop-shadow-sm tracking-tight">{item.value}</div>
                <div className="text-base text-gray-700 dark:text-gray-200 font-semibold mb-1 text-center leading-tight">{item.label}</div>
                {item.label !== "Total Perangkat" && (
                  <span className={`px-3 py-0.5 text-xs rounded-full font-semibold ${item.label==='Online' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} shadow-sm`}>{item.label}</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
