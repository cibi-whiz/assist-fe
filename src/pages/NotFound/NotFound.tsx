import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaHome, 
  FaArrowLeft, 
  FaQuestionCircle, 
} from 'react-icons/fa';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
  };

  return (
    <div className="min-h-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-2 lg:px-2">
      <div className="max-w-4xl w-full text-center flex flex-col items-center justify-center">
        {/* Animated 404 Number */}
        <div className="relative">
          <div className="text-5xl sm:text-[6rem] lg:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            404
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 animate-fade-in">
            {t('notFound.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in delay-200">
            {t('notFound.subtitle')}
          </p>

          {/* Description */}
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto animate-fade-in delay-300">
            {t('notFound.description')}
          </p>


          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-500">
            <button
              onClick={handleGoHome}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FaHome className="w-4 h-4 group-hover:animate-bounce" />
              <span>{t('notFound.buttons.goHome')}</span>
            </button>

            <button
              onClick={handleGoBack}
              className="group flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:animate-pulse" />
              <span>{t('notFound.buttons.goBack')}</span>
            </button>

            <button
              onClick={handleContactSupport}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FaQuestionCircle className="w-4 h-4 group-hover:animate-spin" />
              <span>{t('notFound.buttons.contactSupport')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;