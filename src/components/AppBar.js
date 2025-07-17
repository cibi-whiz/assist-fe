import React from 'react';

const AppBar = ({ onMenuClick, darkMode, onThemeToggle }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 w-full">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 w-full">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={onMenuClick} >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">A</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white hidden sm:block">Assist</h1>
          </div>
        </div>
        {/* Right side actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Modern Theme Switch */}
          <button
            onClick={onThemeToggle}
            className="flex items-center rounded-lg p-1"
            aria-label="Toggle dark mode"
            role="switch"
            aria-checked={darkMode}
          >
            <span className="mr-1 sm:mr-2 text-xs font-medium text-gray-700 dark:text-gray-200 select-none">
              {darkMode ? '🌙' : '☀️'}
            </span>
            <span className={`relative inline-block w-8 h-5 sm:w-10 sm:h-6 transition-colors duration-200 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'} rounded-full`}>
              <span
                className={`absolute left-0.5 top-0.5 sm:left-1 sm:top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${darkMode ? 'translate-x-3 sm:translate-x-4' : ''}`}
              />
            </span>
          </button>
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-600 dark:text-gray-200 font-medium text-xs sm:text-sm">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppBar; 