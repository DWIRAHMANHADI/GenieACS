import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const DEFAULT_USER = {
  email: "acs@myrise.id",
  password: "myrise007",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("myrise_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
      setUser({ email });
      localStorage.setItem("myrise_user", JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("myrise_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
