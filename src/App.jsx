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
    <ConfigProvider>
      <AuthProvider>
        <Router>
          <LayoutWithNavbar>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/devices"
                element={
                  <PrivateRoute>
                    <DevicesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/devices/:id"
                element={
                  <PrivateRoute>
                    <DeviceDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/virtual-params"
                element={
                  <PrivateRoute>
                    <VirtualParamPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </LayoutWithNavbar>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
