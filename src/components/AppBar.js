import React, { useRef, useState, useEffect } from 'react';
import assistBlack from '../Assets/Images/assist-black.svg';
import assistWhite from '../Assets/Images/assist-white.svg';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../Hooks/useAuth';

const AppBar = ({ onMenuClick, darkMode, onThemeToggle }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const avatarRef = useRef(null);
  const popoverRef = useRef(null);
  const { logout, user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setPopoverOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setPopoverOpen(false);
    logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 shadow z-50 flex items-center justify-between px-4  transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900"
          aria-label="Toggle Sidebar"
        >
          <FaBars className="text-gray-700 dark:text-gray-200 text-lg" />
        </button>
        <img
          src={darkMode ? assistWhite : assistBlack}
          alt="Assist"
          className="w-auto h-8 object-contain transition-all duration-300"
        />
      </div>
      {console.log('user', user)}

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={onThemeToggle}
          className="relative flex items-center px-1.5 py-1 bg-gray-200 dark:bg-gray-800 rounded-full transition duration-300 shadow-inner"
          style={{ width: '52px', height: '32px' }}
          role="switch"
          aria-checked={darkMode}
        >
          <span
            className={`absolute left-1 text-yellow-400 text-sm transition-opacity duration-300 ${
              darkMode ? 'opacity-100' : 'opacity-0'
            }`}
          >
            🌙
          </span>
          <span
            className={`absolute right-1 text-blue-500 text-sm transition-opacity duration-300 ${
              darkMode ? 'opacity-0' : 'opacity-100'
            }`}
          >
            ☀️
          </span>
          <span
            className={`inline-block w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              darkMode ? 'translate-x-[20px]' : 'translate-x-0'
            }`}
          />
        </button>

        {/* Avatar */}
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => setPopoverOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center border-2 border-white dark:border-gray-800"
          >
            {user?.user_name?.charAt(0)}
          </button>
          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-2 z-50"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setPopoverOpen(false)}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setPopoverOpen(false)}
              >
                Account Settings
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition border-t border-gray-200 dark:border-gray-800"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppBar;
