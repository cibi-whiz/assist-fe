import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './Hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';
import AppBar from './components/AppBar';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import { ToastProvider } from './components/ToastContext';
import Toast from './components/Toast';
import { LanguageProvider } from './Hooks/useLanguage';
import './i18n'; // Initialize i18n

// Lazy imports for route components
const Login = lazy(() => import('./pages/Login/Login'));
const AbandonedCart = lazy(() => import('./pages/B2C/DM/AbandonedCart/AbandonedCart'));
const Dashboard = lazy(() => import('./pages/B2C/Dashboard/Dashboard'));
const RolesandPermission = lazy(() => import('./pages/Auth/RolesandPermission/RolesandPermission'));
const AssistUsers = lazy(() => import('./pages/Auth/AssistUsers/AssistUsers'));

interface AppRoutesProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  darkMode: boolean;
  handleThemeToggle: () => void;
  showWelcome: boolean;
  onWelcomeComplete: () => void;
}

function AppRoutes({ sidebarOpen, toggleSidebar, darkMode, handleThemeToggle, showWelcome, onWelcomeComplete }: AppRoutesProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (showWelcome && (user || loading)) {
    return (
      <WelcomeScreen 
        isVisible={showWelcome}
        onComplete={onWelcomeComplete}
        userName={user?.user_name || "User"}
        darkMode={darkMode}
      />
    );
  }

  if (!user) {
    // Not authenticated: Only allow /login, redirect all else to /login
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Suspense>
    );
  }

  // Show welcome screen if just logged in (ensure user exists or is loading)


  // Authenticated: If on /login or root, redirect to /dashboard
  if (location.pathname === '/login' || location.pathname === '/') {
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
          <div className="p-4 sm:p-6 w-full max-w-full transition-colors duration-300">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Suspense fallback={<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>}>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dm/abandonedcart" element={<AbandonedCart darkMode={darkMode} />} />
                  <Route path="/roles-and-permission" element={<RolesandPermission />} />
                  <Route path="/assist-users" element={<AssistUsers />} />
                  <Route path="*" element={<Dashboard />} />
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored) return stored === 'true';
    // Default to open initially
    return true;
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    // Default to light mode initially
    return false;
  });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Check for welcome screen flag when component mounts and on storage changes
  useEffect(() => {
    const checkWelcomeFlag = () => {
      const justLoggedIn = localStorage.getItem('justLoggedIn');
      if (justLoggedIn === 'true') {
        localStorage.removeItem('justLoggedIn'); // Remove flag after reading
        // Small delay to ensure user state is fully loaded
        setTimeout(() => {
          setShowWelcome(true);
        }, 100);
      }
    };

    // Check on mount
    checkWelcomeFlag();

    // Listen for storage changes and custom welcome trigger event
    window.addEventListener('storage', checkWelcomeFlag);
    window.addEventListener('welcomeScreenTrigger', checkWelcomeFlag);
    
    return () => {
      window.removeEventListener('storage', checkWelcomeFlag);
      window.removeEventListener('welcomeScreenTrigger', checkWelcomeFlag);
    };
  }, []);

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
    const newSidebarState = !sidebarOpen;
    setSidebarOpen(newSidebarState);
    localStorage.setItem('sidebarOpen', newSidebarState.toString());
  };

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <LanguageProvider>
      <ToastProvider>
      <Router>
        <AuthProvider>
          <AppRoutes
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            handleThemeToggle={handleThemeToggle}
            showWelcome={showWelcome}
            onWelcomeComplete={handleWelcomeComplete}
          />
          <Toast />

        </AuthProvider>
      </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App; 