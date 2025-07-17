function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <Router>
          <div>Test</div>
        </Router>
      </ConfigProvider>
    </AuthProvider>
  );
}