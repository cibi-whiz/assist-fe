import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronRight, FaHome } from 'react-icons/fa';
import { useBreadcrumb, BreadcrumbItem } from '../Hooks/useBreadcrumb';

interface BreadcrumbProps {
  className?: string;
  isTablet?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ className = '', isTablet = false }) => {
  const { t } = useTranslation('common');
  const location = useLocation();
  const breadcrumbItems = useBreadcrumb(location.pathname);


  // Don't render breadcrumbs on login page or if no items
  if (location.pathname === '/login' || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      className={`flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 overflow-x-auto scrollbar-hide ${
        isTablet ? 'tablet-touch-target' : ''
      } ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home icon */}
      <Link
        to="/dashboard"
        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 mobile-touch-target p-1"
        title={t('navigation.dashboard')}
      >
        <FaHome className="w-4 h-4" />
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbItems.map((item: BreadcrumbItem) => (
        <React.Fragment key={item.path}>
          <FaChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          {item.isLast ? (
            <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 truncate max-w-[200px] mobile-touch-target p-1"
              title={item.label}
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
