import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './Hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import { ToastProvider } from './components/ToastContext';
import Toast from './components/Toast';

// Lazy imports for route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AbandonedCart = lazy(() => import('./pages/DM/AbandonedCart'));

interface AppRoutesProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  darkMode: boolean;
  handleThemeToggle: () => void;
}

function AppRoutes({ sidebarOpen, toggleSidebar, darkMode, handleThemeToggle }: AppRoutesProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (!user) {
    // Not authenticated: Only allow /login, redirect all else to /login
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
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
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Suspense fallback={<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/dm/abandonedcart" element={<AbandonedCart />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    // Default to light mode initially
    return false;
  });

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

  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <AppRoutes
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            handleThemeToggle={handleThemeToggle}
          />
          <Toast />

        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App; 