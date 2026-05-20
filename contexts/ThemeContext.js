import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../constants/themes';

const STORAGE_KEY = '@cinefinder_theme';

const ThemeContext = createContext({
  isDark: true,
  colors: darkColors,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light') setIsDark(false);
      if (stored === 'dark') setIsDark(true);
    });
  }, []);

  const persist = async (dark) => {
    await AsyncStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  };

  const setDarkMode = (dark) => {
    setIsDark(dark);
    persist(dark);
  };

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
