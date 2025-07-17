import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-xs">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound; 