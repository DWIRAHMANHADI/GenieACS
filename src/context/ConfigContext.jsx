import React, { createContext, useContext, useState } from "react";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem("myrise_api_url") || "";
  });

  const updateApiUrl = (url) => {
    setApiUrl(url);
    localStorage.setItem("myrise_api_url", url);
  };

  const resetConfig = () => {
    setApiUrl("");
    localStorage.removeItem("myrise_api_url");
    localStorage.removeItem("myrise_user");
  };

  return (
    <ConfigContext.Provider value={{ apiUrl, updateApiUrl, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
