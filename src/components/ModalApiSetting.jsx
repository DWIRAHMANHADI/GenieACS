import React, { useState } from "react";
import { useConfig } from "../context/ConfigContext";
import { motion } from "framer-motion";

export default function ModalApiSetting({ onClose }) {
  const { apiUrl, updateApiUrl } = useConfig();
  const [url, setUrl] = useState(apiUrl || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateApiUrl(url);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-xs"
      >
        <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-300">Setting API GenieACS</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="https://genieacs.example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >Batal</button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >Simpan</button>
          </div>
        </form>
        {saved && <div className="text-green-600 mt-2 text-sm">Tersimpan!</div>}
      </motion.div>
    </motion.div>
  );
}
