import { useState } from "react";
import Cookies from "js-cookie";

/**
 * Custom hook to manage a value in cookies (as local storage alternative).
 * @param {string} keyName - The cookie key name.
 * @param {*} defaultValue - The default value if not set.
 * @returns {[any, function]} - [value, setValue]
 */
export const useLocalStorage = (keyName, defaultValue) => {
  const cookieOptions = {
    expires: 1, // 1 day
    path: '/',
    sameSite: 'strict',
    secure: true,
  };

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = Cookies.get(keyName);
      if (value !== undefined && value !== null && value !== '') {
        return JSON.parse(value);
      } else {
        // Only set the cookie if defaultValue is not null/undefined
        if (defaultValue !== null && defaultValue !== undefined) {
          Cookies.set(keyName, JSON.stringify(defaultValue), cookieOptions);
        }
        return defaultValue;
      }
    } catch (err) {
      console.error(`Error reading cookie ${keyName}:`, err);
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      if (newValue === undefined || newValue === null) {
        Cookies.remove(keyName);
      } else {
        Cookies.set(keyName, JSON.stringify(newValue), cookieOptions);
      }
    } catch (err) {
      console.error(`Error setting cookie ${keyName}:`, err);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
