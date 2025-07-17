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