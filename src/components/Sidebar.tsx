import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartBar, FaChevronDown, FaChevronRight,
  FaRegFileAlt
} from "react-icons/fa";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import whizlabsLogo from "../Assets/Images/assist-white.svg";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  url?: string;
  subNav?: NavItem[];
}

interface TooltipState {
  title: string;
  depth: number;
  position: {
    top: number;
    left: number;
    width: number;
  };
}

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile, onClose }) => {
  const { t } = useTranslation('common');
  const [openPath, setOpenPath] = useLocalStorage<string[]>('sidebar-openPath', ['Digital Marketing']);

  // Create navItems with translations
  const navItems: NavItem[] = [
    {
      title: t('sidebar.digitalMarketing'),
      icon: <FaChartBar />,
      subNav: [
        { title: t('sidebar.abandonedCart'), url: "/dm/abandonedcart", icon: <FaRegFileAlt /> },
      ],
    },
  ];
  
  // Tooltip state: { title, depth, position: {top, left, width} }
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Clear tooltip on scroll to prevent positioning issues
  useEffect(() => {
    const handleScroll = () => {
      if (tooltip) {
        setTooltip(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tooltip]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.classList.add('mobile-sidebar-open');
    } else {
      document.body.classList.remove('mobile-sidebar-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-sidebar-open');
    };
  }, [isMobile, isOpen]);

  const handleToggle = (title: string, depth: number): void => {
    if (openPath[depth] === title) {
      setOpenPath(openPath.slice(0, depth));
    } else {
      const newPath = openPath.slice(0, depth);
      newPath[depth] = title;
      setOpenPath(newPath);
    }
  };

  // Show tooltip if sidebar is collapsed or title is long
  const shouldShowTooltip = (title: string): boolean => !isOpen || title.length > 20;

  // Mouse events for tooltip
  const handleMouseEnter = (e: React.MouseEvent, title: string, depth: number): void => {
    if (!shouldShowTooltip(title)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate tooltip position
    let left = rect.right + 8;
    let top = rect.top + rect.height / 2;
    
    // Adjust horizontal position if tooltip would go off-screen
    const tooltipWidth = Math.min(title.length * 8 + 24, 200); // Estimate tooltip width
    if (left + tooltipWidth > viewportWidth - 16) {
      left = rect.left - tooltipWidth - 8;
    }
    
    // Adjust vertical position if tooltip would go off-screen
    const tooltipHeight = 32; // Estimate tooltip height
    if (top + tooltipHeight > viewportHeight - 16) {
      top = viewportHeight - tooltipHeight - 16;
    } else if (top - tooltipHeight < 16) {
      top = 16;
    }
    
    setTooltip({
      title,
      depth,
      position: {
        top: top + window.scrollY,
        left: left,
        width: rect.width,
      },
    });
  };
  
  const handleMouseLeave = (): void => setTooltip(null);

  const renderNav = (items: NavItem[], depth: number = 0): React.ReactNode => (
    <ul className={depth === 0 ? "w-full" : "pl-4 border-l border-slate-600 dark:border-slate-600 ml-2"}>
      {items.map((item) => {
        const hasChildren = item.subNav && item.subNav.length > 0;
        const isOpenMenu = openPath[depth] === item.title;
        const tooltipProps = shouldShowTooltip(item.title)
          ? {
              onMouseEnter: (e: React.MouseEvent) => handleMouseEnter(e, item.title, depth),
              onMouseLeave: handleMouseLeave,
            }
          : {};
        return (
          <React.Fragment key={item.title}>
          <li className="w-full">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => handleToggle(item.title, depth)}
              className={`group flex items-center w-full rounded-xl transition-all duration-300 hover:bg-slate-700 dark:hover:bg-slate-700 hover:shadow-md py-3 px-4 text-slate-300 dark:text-slate-300  hover:scale-[1.02] active:scale-[0.98]`}
              aria-expanded={isOpenMenu}
              {...tooltipProps}
            >
              <span className="w-6 h-6 flex items-center justify-center transition-all duration-300 group-hover:text-blue-400 group-hover:scale-110">
                {item.icon || <FaChevronRight className="opacity-60 transition-all duration-300" />}
              </span>
              <span
                className={`ml-3 text-sm font-medium transition-all duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                } ${item.title.length > 20 ? "truncate max-w-[140px]" : "whitespace-nowrap"} group-hover:text-slate-100`}
                title={item.title.length > 20 ? item.title : ""}
              >
                {item.title}
              </span>
              <span className={`ml-auto transition-all duration-300 ${isOpenMenu ? "rotate-90" : ""} ${!isOpen ? "hidden" : ""} group-hover:text-blue-400`}>
                <FaChevronDown />
              </span>
            </button>
          ) : (
            <NavLink
              to={item.url || ""}
              className={({ isActive }) =>
                `group flex items-center w-full rounded-xl transition-all duration-300 ease-in-out hover:bg-slate-700 dark:hover:bg-slate-700 hover:shadow-md py-3 px-4 hover:scale-[1.02] active:scale-[0.98] transform ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-600 text-white dark:text-white shadow-lg"
                    : "text-slate-300 dark:text-slate-300"
                }`
              }
              onClick={() => {
                // Close sidebar on mobile when navigating
                if (isMobile && onClose) {
                  onClose();
                }
              }}
              {...tooltipProps}
            >
              {({ isActive }) => (
                <>
                  <span className={`w-6 h-6 flex items-center justify-center transition-all duration-300 ${
                    isActive ? "text-white" : "group-hover:text-blue-400 group-hover:scale-110"
                  }`}>
                    {item.icon || <FaChevronRight className="opacity-60 transition-all duration-300" />}
                  </span>
                  <span
                    className={`ml-3 text-sm font-medium transition-all duration-300 ${
                      isOpen ? "opacity-100" : "opacity-0 hidden"
                    } ${item.title.length > 20 ? "truncate max-w-[140px]" : "whitespace-nowrap"} ${
                      isActive ? "text-white" : "group-hover:text-slate-100"
                    }`}
                    title={item.title.length > 20 ? item.title : ""}
                  >
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          )}
          {hasChildren && isOpenMenu && renderNav(item.subNav!, depth + 1)}
        </li>
          </React.Fragment>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}
      
      <aside
        className={`fixed top-0 left-0 h-[calc(100vh)] z-50 flex flex-col border-r shadow-xl gpu-accelerated
          ${isMobile 
            ? (isOpen ? "w-64 translate-x-0" : "-translate-x-full w-64") 
            : (isOpen ? "w-64 sidebar-transition" : "w-0 overflow-hidden sidebar-transition")
          }
          bg-slate-800 dark:bg-slate-800 border-slate-600 dark:border-slate-600
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-4 dark:border-slate-600 transition-all duration-300 ease-in-out">
          <div className="flex items-center space-x-2">
            <img 
              src={whizlabsLogo} 
              alt="Assist" 
              className={`w-96 h-8 object-contain transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100" : "opacity-0"
              }`} 
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className={`flex flex-col p-1 gap-2 w-full overflow-y-auto scrollbar-hide transition-colors duration-300 flex-1 ${isMobile ? 'mobile-sidebar' : ''}`} style={{msOverflowStyle:'none', scrollbarWidth:'none'}}>
          {renderNav(navItems)}
        </nav>
      </aside>
      
      {/* Enhanced Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[9999] px-3 py-2 text-xs font-medium rounded-lg shadow-2xl bg-slate-900 text-slate-100 dark:bg-slate-900 dark:text-slate-100 opacity-95 animate-fade-in backdrop-blur-sm border border-slate-700"
          style={{
            top: Math.max(0, tooltip.position.top),
            left: Math.max(0, tooltip.position.left),
            transform: "translateY(-50%)",
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span>{tooltip.title}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
