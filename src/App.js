import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function AppRoutes({ isAuthenticated, onLogin, sidebarOpen, toggleSidebar, darkMode, handleThemeToggle }) {
  const location = useLocation();

  if (!isAuthenticated) {
    // Not authenticated: Only allow /login, redirect all else to /login
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated: If on /login, redirect to /dashboard
  if (location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated: Render portal layout for all other routes
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* AppBar */}
      <AppBar onMenuClick={toggleSidebar} darkMode={darkMode} onThemeToggle={handleThemeToggle} />
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />
        {/* Main Content */}
        <main className={`flex-1 w-full transition-all duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'lg:ml-64 md:ml-16' : 'lg:ml-16'
        } ml-0`}>
          <div className="p-4 sm:p-6 w-full max-w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    // Default to light mode initially
    return false;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Apply theme immediately on mount and when darkMode changes
    const root = document.documentElement;
    const body = document.body;
    
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('bg-gray-950');
      body.classList.remove('bg-gray-50');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.add('bg-gray-50');
      body.classList.remove('bg-gray-950');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  // Handler for login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        onLogin={handleLoginSuccess}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        handleThemeToggle={handleThemeToggle}
      />
    </Router>
  );
}

export default App;
