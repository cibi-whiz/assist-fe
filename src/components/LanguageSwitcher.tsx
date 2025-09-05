import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../Hooks/useLanguage";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

interface LanguageSwitcherProps {
  darkMode?: boolean;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  darkMode = false,
  className = "",
}) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = availableLanguages.find(
    (lang) => lang.code === currentLanguage
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors duration-200
         border-slate-600 text-slate-200 bg-slate-900' 

          }
        `}
        aria-label="Select language"
      >
        <FaGlobe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.name}</span>
        <FaChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`
          absolute top-full left-0 mt-1 w-32 rounded-lg shadow-lg border z-50
          ${
            darkMode
              ? "bg-slate-900 border-slate-600"
              : "bg-white border-gray-200"
          }
        `}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-150
                  ${
                    currentLanguage === language.code
                      ? darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-700"
                      : darkMode
                      ? "text-slate-200 hover:bg-slate-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                
                <span className="text-sm font-medium ">{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
