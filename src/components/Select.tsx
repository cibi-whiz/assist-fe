import React from "react";
import { useTheme } from "../Hooks/useTheme";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void; // fixed typing
  placeholder?: string;
  Icon?: React.ReactNode;
  options: SelectOption[];
}

const Select = ({
  label,
  value,
  onChange,
  placeholder,
  Icon,
  options,
}: SelectProps) => {
  const { theme } = useTheme(); // using theme if needed

  return (
    <div>
      <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-100 mb-1">
        {Icon && (
          <span className="w-4 h-4 text-gray-500 dark:text-gray-300">
            {Icon}
          </span>
        )}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)} // now correctly typed
        className="w-full px-2 py-2 text-xs sm:text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          bg-white border-gray-300 text-gray-900
             dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
