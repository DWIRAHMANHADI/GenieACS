import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import DevicesPage from "./pages/DevicesPage";
import DeviceDetailPage from "./pages/DeviceDetailPage";
import VirtualParamPage from "./pages/VirtualParamPage";
import SettingsPage from "./pages/SettingsPage";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function LayoutWithNavbar({ children }) {
  const location = useLocation();
  // Jangan tampilkan navbar di halaman login
  const hideNavbar = location.pathname === "/";
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <LayoutWithNavbar>
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                </LayoutWithNavbar>
              }
            />
            <Route
              path="/devices"
              element={
                <LayoutWithNavbar>
                  <PrivateRoute>
                    <DevicesPage />
                  </PrivateRoute>
                </LayoutWithNavbar>
              }
            />
            <Route
              path="/devices/:id"
              element={
                <LayoutWithNavbar>
                  <PrivateRoute>
                    <DeviceDetailPage />
                  </PrivateRoute>
                </LayoutWithNavbar>
              }
            />
            <Route
              path="/settings"
              element={
                <LayoutWithNavbar>
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                </LayoutWithNavbar>
              }
            />
            <Route
              path="/virtual-params"
              element={
                <LayoutWithNavbar>
                  <PrivateRoute>
                    <VirtualParamPage />
                  </PrivateRoute>
                </LayoutWithNavbar>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;
