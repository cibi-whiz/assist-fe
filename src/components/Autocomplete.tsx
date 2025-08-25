import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "antd";
import { FaChevronUp, FaChevronDown, FaTimes } from "react-icons/fa";

interface AutocompleteOption {
  value: string | number;
  label?: string;
  name?: string;
  [key: string]: any;
}

interface AutocompleteProps {
  label: string;
  Icon: React.ReactNode;
  options: AutocompleteOption[];
  value: AutocompleteOption | string | null;
  onChange: (value: AutocompleteOption | string | null) => void;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}

const Autocomplete = ({ 
  label, 
  Icon, 
  options, 
  value, 
  onChange, 
  placeholder, 
  disabled = false,
  error 
}: AutocompleteProps) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Memoize getDisplayValue to prevent unnecessary re-renders
  const getDisplayValue = useCallback((option: AutocompleteOption | string | null): string => {
    if (typeof option === "string") return option;
    if (option && typeof option === "object") {
      return option.label || option.name || String(option.value) || "";
    }
    return "";
  }, []);

  // Update filteredOptions when options prop changes
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  // Initialize inputValue when value prop changes
  useEffect(() => {
    const displayValue = getDisplayValue(value);
    setInputValue(displayValue);
  }, [value, getDisplayValue]);

  // Debounced filtering function
  const debouncedFilter = useCallback((searchTerm: string) => {
    const filtered = options.filter((option) =>
      getDisplayValue(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [options, getDisplayValue]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setShowDropdown(true);
    setHighlightedIndex(-1);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce the filtering
    timeoutRef.current = setTimeout(() => {
      debouncedFilter(newValue);
    }, 150);
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    const displayValue = getDisplayValue(option);
    setInputValue(displayValue);
    onChange(option);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  // Keyboard navigation (↑ ↓ Enter Esc)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClear = () => {
    setInputValue("");
    setFilteredOptions(options);
    onChange(null);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    if (!showDropdown) {
      setFilteredOptions(options);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <label className="flex block text-xs font-medium text-gray-700 dark:text-gray-200 mb-1">
        <span className="w-3 h-3 mr-1">{Icon}</span>
        {label}
      </label>
      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-2 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error 
              ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
              : "border-gray-300 dark:border-gray-600"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          aria-label={label}
        />
        
        {/* Clear Button */}
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear input"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        )}
        
        {/* Dropdown Toggle */}
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={showDropdown ? "Close dropdown" : "Open dropdown"}
        >
          {showDropdown ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
          aria-label={`${label} options`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={String(option.value)}
                onClick={() => handleOptionSelect(option)}
                className={`px-3 py-2 text-sm cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 
                ${
                  index === highlightedIndex
                    ? "bg-blue-500 text-white"
                    : "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {getDisplayValue(option)}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
