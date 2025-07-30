import { useState } from "react";
import Cookies from "js-cookie";

/**
 * Custom hook to manage a value in cookies (as local storage alternative).
 * @param keyName - The cookie key name.
 * @param defaultValue - The default value if not set.
 * @returns [value, setValue]
 */
export const useLocalStorage = <T>(keyName: string, defaultValue: T): [T, (value: T | null) => void] => {
  const cookieOptions = {
    expires: 1, // 1 day
    path: '/',
    sameSite: 'strict' as const,
    secure: true,
  };

  const [storedValue, setStoredValue] = useState<T>(() => {
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

  const setValue = (newValue: T | null): void => {
    try {
      if (newValue === undefined || newValue === null) {
        Cookies.remove(keyName);
      } else {
        Cookies.set(keyName, JSON.stringify(newValue), cookieOptions);
      }
    } catch (err) {
      console.error(`Error setting cookie ${keyName}:`, err);
    }
    setStoredValue(newValue as T);
  };

  return [storedValue, setValue];
}; 