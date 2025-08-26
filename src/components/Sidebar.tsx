import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaChartBar, FaChevronDown, FaChevronRight,
  FaRegFileAlt
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";
import { useLocalStorage } from "../Hooks/useLocalStorage";

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
}

const navItems: NavItem[] = [
  {
    title: "Digital Marketing",
    icon: <FaChartBar />,
    subNav: [
      { title: "Abandoned Cart", url: "/dm/abandonedcart", icon: <FaRegFileAlt /> },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openPath, setOpenPath] = useLocalStorage<string[]>('sidebar-openPath', []);
  const { user } = useAuth();
  
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
    <ul className={depth === 0 ? "w-full" : "pl-4 border-l border-gray-200 dark:border-gray-700 ml-2"}>
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
              className={`group flex items-center w-full rounded-xl transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 ${
                isOpen ? "justify-start px-4" : "justify-center px-2"
              } text-gray-600 dark:text-gray-300 focus:outline-none`}
              aria-expanded={isOpenMenu}
              {...tooltipProps}
            >
              <span className="w-6 h-6 flex items-center justify-center transition-colors duration-300">
                {item.icon || <FaChevronRight className="opacity-60 transition-colors duration-300" />}
              </span>
              <span
                className={`ml-3 text-sm font-medium transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                } ${item.title.length > 20 ? "truncate max-w-[140px]" : "whitespace-nowrap"}`}
                title={item.title.length > 20 ? item.title : ""}
              >
                {item.title}
              </span>
              <span className={`ml-auto transition-transform duration-300 ${isOpenMenu ? "rotate-90" : ""} ${!isOpen ? "hidden" : ""}`}>
                <FaChevronDown />
              </span>
            </button>
          ) : (
            <NavLink
              to={item.url || ""}
              className={({ isActive }) =>
                `group flex items-center w-full rounded-xl transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 ${
                  isOpen ? "justify-start px-4" : "justify-center px-2"
                } ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300"
                }`
              }
              {...tooltipProps}
            >
              <span className="w-6 h-6 flex items-center justify-center transition-colors duration-300">
                {item.icon || <FaChevronRight className="opacity-60 transition-colors duration-300" />}
              </span>
              <span
                className={`ml-3 text-sm font-medium transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 hidden"
                } ${item.title.length > 20 ? "truncate max-w-[140px]" : "whitespace-nowrap"}`}
                title={item.title.length > 20 ? item.title : ""}
              >
                {item.title}
              </span>
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
      <aside
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] z-50 flex flex-col justify-between border-r shadow-md transition-colors duration-300
          ${isOpen ? "w-64" : "w-16"}
          bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800
        `}
        style={{ transitionProperty: "width" }}
      >
        {/* Navigation Items */}
        {/* NOTE: Add the .scrollbar-hide CSS to your global styles if not using the Tailwind plugin */}
        <nav className="flex flex-col p-2 pb-4 gap-2 items-center w-full overflow-y-auto scrollbar-hide transition-colors duration-300" style={{msOverflowStyle:'none', scrollbarWidth:'none'}}>
          {renderNav(navItems)}
        </nav>
        {/* Bottom User Info */}
        {isOpen ? (
          <div className="w-full px-4 pb-4 transition-colors duration-300">
            <div
              className={`flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm
          justify-start space-x-3 hover:shadow-md transition-colors duration-300
        `}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center transition-colors duration-300">
                {(user?.user_name && user.user_name.charAt(0))}
                
              </div>
              <div className="transition-colors duration-300 whitespace-nowrap">
                <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {user?.user_name}
                </p>
                <p className="text-xs truncate max-w-[140px] text-gray-500 dark:text-gray-300 transition-colors duration-300" title={user?.user_email}>
                  {user?.user_email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full px-4 pb-4 flex items-center justify-center transition-all duration-500 ease-in-out">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center">
              {(user?.user_name && user.user_name.charAt(0)) || "U"}
            </div>
          </div>
        )}

      </aside>
      {/* Custom Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-[9999] px-3 py-1.5 text-xs font-medium rounded shadow-lg bg-gray-900 text-white dark:bg-gray-800 dark:text-gray-100 opacity-90 animate-fade-in"
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
          {tooltip.title}
        </div>
      )}
    </>
  );
};

export default Sidebar;

// Add this to your global CSS for fade-in animation:
// .animate-fade-in { animation: fadeIn 0.15s ease; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 0.9; } } 