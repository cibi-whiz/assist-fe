import { useState, useEffect } from 'react';

interface UseThemeReturn {
  isDark: boolean;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      return stored;
    }
    // Default to system preference
    return 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  });

  useEffect(() => {
    const updateTheme = () => {
      let shouldBeDark = false;
      
      if (theme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        shouldBeDark = theme === 'dark';
      }
      
      setIsDark(shouldBeDark);
      
      // Apply theme to document
      const root = document.documentElement;
      const body = document.body;
      
      if (shouldBeDark) {
        root.classList.add('dark');
        body.classList.add('bg-gray-950');
        body.classList.remove('bg-gray-50');
      } else {
        root.classList.remove('dark');
        body.classList.add('bg-gray-50');
        body.classList.remove('bg-gray-950');
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return {
    isDark,
    theme,
    setTheme,
    toggleTheme,
  };
};
