import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  FaStore,
  FaBuilding,
  FaGraduationCap,
  FaComments,
  FaChevronDown,
  FaPlay,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useTheme } from "../Hooks/useTheme";
import { useLocation } from "react-router-dom";
import { getPageTitle } from "../config/routes";
import { PanelRightOpen } from "lucide-react";
import { PanelRightClose } from "lucide-react";

interface Portal {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  bgColor: string;
  status: "active" | "maintenance" | "beta";
}

interface AppBarProps {
  onMenuClick: () => void;
  isMobile: boolean;
  isTablet: boolean;
  isOpen: boolean;
}

// Portal configuration will be created inside the component to access translations

const AppBar: React.FC<AppBarProps> = ({ onMenuClick, isMobile, isTablet, isOpen}) => {
  const { t } = useTranslation("common");
  const { isDark, toggleTheme, theme } = useTheme();
  const location = useLocation();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState<boolean>(false);
  const [focusedPortalIndex, setFocusedPortalIndex] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const avatarRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const portalButtonRef = useRef<HTMLButtonElement>(null);

  const { logout, user } = useAuth();

  // Create portals array with translations
  const portals: Portal[] = useMemo(
    () => [
      {
        id: "b2c",
        name: t("portals.b2c.name"),
        description: t("portals.b2c.description"),
        iconName: "FaStore",
        color: "bg-blue-500",
        bgColor: "from-blue-500 to-blue-600",
        status: "active",
      },
      {
        id: "b2b",
        name: t("portals.b2b.name"),
        description: t("portals.b2b.description"),
        iconName: "FaBuilding",
        color: "bg-purple-500",
        bgColor: "from-purple-500 to-purple-600",
        status: "active",
      },
      {
        id: "lms",
        name: t("portals.lms.name"),
        description: t("portals.lms.description"),
        iconName: "FaGraduationCap",
        color: "bg-green-500",
        bgColor: "from-green-500 to-green-600",
        status: "active",
      },
      {
        id: "forums",
        name: t("portals.forums.name"),
        description: t("portals.forums.description"),
        iconName: "FaComments",
        color: "bg-orange-500",
        bgColor: "from-orange-500 to-orange-600",
        status: "beta",
      },
      {
        id: "play",
        name: t("portals.play.name"),
        description: t("portals.play.description"),
        iconName: "FaPlay",
        color: "bg-red-500",
        bgColor: "from-red-500 to-red-600",
        status: "beta",
      },
    ],
    [t]
  );

  const [selectedPortal, setSelectedPortal] = useLocalStorage<Portal>(
    "selectedPortal",
    portals[0]
  );

  // Function to render icons based on iconName
  const renderIcon = (iconName: string, className: string = "w-4 h-4") => {
    switch (iconName) {
      case "FaStore":
        return <FaStore className={className} />;
      case "FaBuilding":
        return <FaBuilding className={className} />;
      case "FaGraduationCap":
        return <FaGraduationCap className={className} />;
      case "FaComments":
        return <FaComments className={className} />;
      case "FaPlay":
        return <FaPlay className={className} />;
      default:
        return <FaStore className={className} />;
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle user popover
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }

      // Handle portal dropdown
      if (
        portalDropdownRef.current &&
        !portalDropdownRef.current.contains(event.target as Node) &&
        portalButtonRef.current &&
        !portalButtonRef.current.contains(event.target as Node)
      ) {
        setPortalDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (): void => {
    setPopoverOpen(false);
    logout();
  };

  const handlePortalSelect = useCallback(
    (portal: Portal): void => {
      if (isAnimating) return;

      setIsAnimating(true);
      setSelectedPortal(portal);

      // Add a small delay for better UX
      setTimeout(() => {
        setPortalDropdownOpen(false);
        setFocusedPortalIndex(-1);
        setIsAnimating(false);
      }, 150);
    },
    [isAnimating, setSelectedPortal]
  );

  // Keyboard navigation for portal dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!portalDropdownOpen) return;

      switch (event.key) {
        case "Escape":
          setPortalDropdownOpen(false);
          setFocusedPortalIndex(-1);
          portalButtonRef.current?.focus();
          break;
        case "ArrowDown":
          event.preventDefault();
          setFocusedPortalIndex((prev) =>
            prev < portals.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedPortalIndex((prev) =>
            prev > 0 ? prev - 1 : portals.length - 1
          );
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (focusedPortalIndex >= 0) {
            handlePortalSelect(portals[focusedPortalIndex]);
          }
          break;
        case "Home":
          event.preventDefault();
          setFocusedPortalIndex(0);
          break;
        case "End":
          event.preventDefault();
          setFocusedPortalIndex(portals.length - 1);
          break;
      }
    };

    if (portalDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [portalDropdownOpen, focusedPortalIndex, handlePortalSelect, portals]);

  const getStatusBadge = (status: Portal["status"]) => {
    switch (status) {
      case "beta":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            {t("appBar.beta")}
          </span>
        );
      case "maintenance":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            {t("appBar.maintenance")}
          </span>
        );
      default:
        return null;
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <FaSun className="w-4 h-4" />;
      case "dark":
        return <FaMoon className="w-4 h-4" />;
      default:
        return <FaMoon className="w-4 h-4" />;
    }
  };

  const getCurrentPageTitle = () => {
    return getPageTitle(location.pathname, t, selectedPortal.name);
  };

  return (
    <header className={`fixed top-0 h-16 bg-slate-800 dark:bg-slate-800 border-b border-slate-600 shadow-lg z-50 flex items-center justify-between px-2
      appbar-transition gpu-accelerated
      ${isMobile ? "left-0 w-full mobile-appbar" : 
        isTablet ? (isOpen ? "left-64 w-[calc(100%-16rem)] tablet-appbar" : "left-0 w-full tablet-appbar") :
        (isOpen ? "left-[16rem] w-[calc(100%-16rem)]" : "left-0 w-full")}
      transition-colors`}>
      {/* Left Section - Mobile Menu Button */}
      <div className="flex items-center space-x-3 sm:space-x-3">
        {/* Mobile menu button - only visible on mobile */}
        <button
          onClick={onMenuClick}
          className="sm:hidden w-12 h-12 rounded-lg flex items-center button-transition mobile-button mobile-touch-target"
          aria-label={t("appBar.toggleSidebar")}
        >
          {isOpen ? (
            <PanelRightClose className="text-slate-200 text-lg transition-transform duration-300 ease-in-out" />
          ) : (
            <PanelRightOpen className="text-slate-200 text-lg transition-transform duration-300 ease-in-out" />
          )}
        </button>
        
        {/* Tablet menu button - visible on tablet */}
        {isTablet && (
          <button
            onClick={onMenuClick}
            className="w-12 h-12 rounded-lg flex items-center button-transition tablet-button tablet-touch-target"
            aria-label={t("appBar.toggleSidebar")}
          >
            {isOpen ? (
              <PanelRightClose className="text-slate-200 text-lg transition-transform duration-300 ease-in-out" />
            ) : (
              <PanelRightOpen className="text-slate-200 text-lg transition-transform duration-300 ease-in-out" />
            )}
          </button>
        )}
      </div>

      {/* Center Section - Desktop Menu Button and Title */}
      <div className={`flex-1 items-center justify-start ${isTablet ? 'hidden' : 'hidden sm:flex'}`}>
        <button
          onClick={onMenuClick}
          className="w-9 h-9 rounded-lg flex items-center button-transition"
          aria-label={t("appBar.toggleSidebar")}
        >
          {isOpen ? (
            <PanelRightClose className="text-slate-200 text-lg transition-transform duration-300 ease-in-out" />
          ) : (
            <PanelRightOpen className="text-slate-200 text-lg transition-transform duration-300 ease-in-out" />
          )}
        </button>
        <h1 className="lg:text-lg md:text-base font-semibold text-slate-200 truncate transition-all duration-300 ease-in-out">
          {getCurrentPageTitle()}
        </h1>
      </div>

      {/* Mobile/Tablet Title Section */}
      <div className={`flex-1 flex items-center ${isTablet ? 'block' : 'sm:hidden'}`}>
        <h1 className="text-base md:text-base font-semibold text-slate-200 truncate transition-all duration-300 ease-in-out">
          {getCurrentPageTitle()}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Portal Selector */}
        {!isMobile && !isTablet && (
        <div className="relative">
          <button
            ref={portalButtonRef}
            onClick={() => {
              setPortalDropdownOpen(!portalDropdownOpen);
              setFocusedPortalIndex(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && !portalDropdownOpen) {
                e.preventDefault();
                setPortalDropdownOpen(true);
                setFocusedPortalIndex(0);
              }
            }}
            className="group flex items-center space-x-1 sm:space-x-2 px-1 sm:px-2 py-1 from-slate-800 to-slate-700 dark:from-slate-800 dark:to-slate-700 hover:from-slate-700 hover:to-slate-600 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-md transition-all duration-300 border border-slate-600/60 dark:border-slate-600/60 hover:border-slate-500 dark:hover:border-slate-500 shadow-sm hover:shadow-md"
            aria-expanded={portalDropdownOpen}
            aria-haspopup="listbox"
          >
            <div
              className={`w-7 h-7 border-2 border-solid bg-gradient-to-br ${selectedPortal.bgColor} rounded-lg flex items-center justify-center text-white  group-hover:shadow-md transition-shadow duration-300`}
            >
              {renderIcon(selectedPortal.iconName)}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-slate-100 dark:text-slate-100">
                {selectedPortal.name}
              </div>
              {selectedPortal.status === "beta" && (
                <div className="text-xs text-yellow-400 dark:text-yellow-400 font-medium">
                  {t("appBar.beta")}
                </div>
              )}
            </div>
            <FaChevronDown
              className={`w-3 h-3 text-slate-400 dark:text-slate-400 transition-all duration-300 group-hover:text-slate-200 dark:group-hover:text-slate-200 ${
                portalDropdownOpen ? "rotate-180 scale-110" : ""
              }`}
            />
          </button>

          {portalDropdownOpen && (
            <div
              ref={portalDropdownRef}
              className="absolute right-0 mt-3 w-64 sm:w-72 
           bg-white/95 dark:bg-slate-900/95 
           backdrop-blur-xl rounded-2xl shadow-2xl 
           border border-slate-200 dark:border-slate-700/50 
           py-3 z-50 animate-fade-in-up"
              role="listbox"
              aria-label="Portal selection"
            >
              {/* Header */}
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t("appBar.switchPortal")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t("appBar.chooseWorkspace")}
                </p>
              </div>

              {/* List */}
              <div className="py-2">
                {portals.map((portal, index) => (
                  <button
                    key={portal.id}
                    onClick={() => handlePortalSelect(portal)}
                    onMouseEnter={() => setFocusedPortalIndex(index)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left 
                 hover:bg-slate-100 dark:hover:bg-slate-800/50 
                 transition-all duration-200 group
       ${
         selectedPortal.id === portal.id
           ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500"
           : focusedPortalIndex === index
           ? "bg-slate-50 dark:bg-slate-800/30"
           : ""
       } ${isAnimating ? "pointer-events-none" : ""}`}
                    role="option"
                    aria-selected={selectedPortal.id === portal.id}
                    tabIndex={-1}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${portal.bgColor} 
                    rounded-xl flex items-center justify-center text-white 
                    shadow-sm group-hover:shadow-md transition-all duration-300 
          ${selectedPortal.id === portal.id ? "scale-110 shadow-lg" : ""}`}
                    >
                      {renderIcon(portal.iconName)}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-semibold text-sm ${
                            selectedPortal.id === portal.id
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-slate-900 dark:text-slate-100"
                          }`}
                        >
                          {portal.name}
                        </span>
                        {getStatusBadge(portal.status)}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {portal.description}
                      </p>
                    </div>

                    {/* Active indicator */}
                    {selectedPortal.id === portal.id && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          {t("appBar.active")}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {t("appBar.keyboardNavigation")}
                </div>
              </div>
            </div>
          )}
        </div>
        )}
        {/* Language Switcher */}
        {!isMobile && !isTablet && (
        <LanguageSwitcher darkMode={isDark} />
        )}

        {/* Avatar */}
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => setPopoverOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            aria-label="User menu"
          >
            {user?.user_name?.charAt(0).toUpperCase() || "U"}
          </button>

          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute right-0 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-fade-in-up"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.user_name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black dark:text-slate-100 truncate">
                      {user?.user_name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {user?.user_email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Switcher */}
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-black dark:text-slate-200">
                    Theme
                  </span>
                  <div className="flex items-center space-x-1">
                    {getThemeIcon()}
                    <span className="text-xs text-gray-600 dark:text-slate-400 capitalize">
                      {theme}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Switch theme"
                >
                  Switch Theme
                </button>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                  onClick={() => setPopoverOpen(false)}
                >
                  <FaUser className="w-4 h-4 mr-3 text-gray-500 dark:text-slate-400" />
                  {t("appBar.profile")}
                </button>
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                  onClick={() => setPopoverOpen(false)}
                >
                  <FaCog className="w-4 h-4 mr-3 text-gray-500 dark:text-slate-400" />
                  Settings
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                  {t("appBar.logout")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default AppBar;
