import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './Hooks/useAuth';
import { useTheme } from './Hooks/useTheme';
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
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

interface AppRoutesProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  showWelcome: boolean;
  onWelcomeComplete: () => void;
  isMobile: boolean;
}

function AppRoutes({ sidebarOpen, toggleSidebar, showWelcome, onWelcomeComplete, isMobile }: AppRoutesProps) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  if (showWelcome && (user || loading)) {
    return (
      <WelcomeScreen 
        isVisible={showWelcome}
        onComplete={onWelcomeComplete}
        userName={user?.user_name || "User"}
        darkMode={isDark}
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
    <div className=" w-full min-h-full transition-colors duration-300">
      {/* AppBar */}
      <AppBar onMenuClick={toggleSidebar} isMobile={isMobile} isOpen={sidebarOpen} />
      <div className="flex w-full">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} isMobile={isMobile} />
        {/* Main Content */}
        <main className={`flex-1 w-full transition-all duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'lg:ml-64 md:ml-16' : 'lg:ml-16'
        } ml-0`}>
          <div className="p-2 sm:p-4 lg:p-6 w-full max-w-full transition-colors duration-300">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Suspense fallback={<div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div></div>}>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/dm/abandonedcart" element={<AbandonedCart darkMode={isDark} />} />
                  <Route path="/roles-and-permission" element={<RolesandPermission />} />
                  <Route path="/assist-users" element={<AssistUsers />} />
                  <Route path="/dashboard" element={<Dashboard />} />
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
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored) return stored === 'true';
    // Default to open initially
    return true;
  });
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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



  const toggleSidebar = () => {
    const newSidebarState = !sidebarOpen;
    setSidebarOpen(newSidebarState);
    localStorage.setItem('sidebarOpen', newSidebarState.toString());
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
            showWelcome={showWelcome}
            onWelcomeComplete={handleWelcomeComplete}
            isMobile={isMobile}
          />
          <Toast />

        </AuthProvider>
      </Router>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App; 