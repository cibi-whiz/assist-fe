import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import assistBlack from "../Assets/Images/assist-black.svg";
import assistWhite from "../Assets/Images/assist-white.svg";
import {
  FaBars,
  FaChevronDown,
  FaStore,
  FaBuilding,
  FaGraduationCap,
  FaComments,
  FaPlay,
} from "react-icons/fa";
import { useAuth } from "../Hooks/useAuth";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useTheme } from "../Hooks/useTheme";

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
}

// Portal configuration will be created inside the component to access translations

const AppBar: React.FC<AppBarProps> = ({ onMenuClick }) => {
  const { t } = useTranslation("common");
  const { isDark, toggleTheme } = useTheme();
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

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-700 shadow z-50 flex items-center justify-between px-2 sm:px-4 transition-colors duration-300">
      {/* Left Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-300"
          aria-label={t("appBar.toggleSidebar")}
        >
          <FaBars className="text-gray-700 dark:text-slate-200 text-lg" />
        </button>
        <img
          src={isDark ? assistWhite : assistBlack}
          alt="Assist"
          className="w-auto h-6 sm:h-8 object-contain"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-4">
        {/* Portal Selector */}
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
            className="group flex items-center space-x-1 sm:space-x-2 px-1 sm:px-2 py-1 dark:from-slate-800 dark:to-slate-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-slate-700 dark:hover:to-slate-600 rounded-md transition-all duration-300 border border-gray-200/60 dark:border-slate-600/60 hover:border-gray-300 dark:hover:border-slate-500 shadow-sm hover:shadow-md"
            aria-expanded={portalDropdownOpen}
            aria-haspopup="listbox"
          >
            <div
              className={`w-7 h-7 border-2 border-solid bg-gradient-to-br ${selectedPortal.bgColor} rounded-lg flex items-center justify-center text-white  group-hover:shadow-md transition-shadow duration-300`}
            >
              {renderIcon(selectedPortal.iconName)}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {selectedPortal.name}
              </div>
              {selectedPortal.status === "beta" && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  {t("appBar.beta")}
                </div>
              )}
            </div>
            <FaChevronDown
              className={`w-3 h-3 text-gray-500 dark:text-slate-400 transition-all duration-300 group-hover:text-gray-700 dark:group-hover:text-slate-200 ${
                portalDropdownOpen ? "rotate-180 scale-110" : ""
              }`}
            />
          </button>

          {portalDropdownOpen && (
            <div
              ref={portalDropdownRef}
              className="absolute right-0 mt-3 w-64 sm:w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 py-3 z-50 animate-fade-in-up"
              role="listbox"
              aria-label="Portal selection"
            >
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {t("appBar.switchPortal")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {t("appBar.chooseWorkspace")}
                </p>
              </div>

              <div className="py-2">
                {portals.map((portal, index) => (
                  <button
                    key={portal.id}
                    onClick={() => handlePortalSelect(portal)}
                    onMouseEnter={() => setFocusedPortalIndex(index)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 group ${
                      selectedPortal.id === portal.id
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500"
                        : focusedPortalIndex === index
                        ? "bg-gray-50 dark:bg-slate-800/30"
                        : ""
                    } ${isAnimating ? "pointer-events-none" : ""}`}
                    role="option"
                    aria-selected={selectedPortal.id === portal.id}
                    tabIndex={-1}
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${
                        portal.bgColor
                      } rounded-xl flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-300 ${
                        selectedPortal.id === portal.id
                          ? "scale-110 shadow-lg"
                          : ""
                      }`}
                    >
                      {renderIcon(portal.iconName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-semibold text-sm ${
                            selectedPortal.id === portal.id
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-900 dark:text-slate-100"
                          }`}
                        >
                          {portal.name}
                        </span>
                        {getStatusBadge(portal.status)}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">
                        {portal.description}
                      </p>
                    </div>

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

              <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-400 dark:text-slate-500">
                  {t("appBar.keyboardNavigation")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher darkMode={isDark} />

        {/* Avatar + Popover */}
        <div className="relative">
          <button
            ref={avatarRef}
            onClick={() => setPopoverOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold flex items-center justify-center border-2 border-white dark:border-slate-800"
          >
            {user?.user_name?.charAt(0).toUpperCase() || "U"}
          </button>

          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 py-3 z-50 animate-fade-in-up"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">
                  {user?.user_name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                  {user?.user_email || "user@example.com"}
                </p>
              </div>

              {/* Dark Mode Toggle */}
              <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition">
                <span className="text-sm text-gray-700 dark:text-slate-200">
                  {t("appBar.darkMode")}
                </span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none shadow-sm 
        ${isDark ? "bg-blue-600" : "bg-gray-300 dark:bg-slate-600"}`}
                  role="switch"
                  aria-checked={isDark}
                >
                  <span
                    className={`inline-block h-5 w-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out
          ${isDark ? "translate-x-5 scale-105" : "translate-x-0.5 scale-100"}`}
                  />
                </button>
              </div>

              {/* Menu Items */}
              <div className="mt-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
                  onClick={() => setPopoverOpen(false)}
                >
                  {t("appBar.profile")}
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 border-t border-gray-200 dark:border-slate-700 mt-2 rounded-b-xl transition"
                  onClick={handleLogout}
                >
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
