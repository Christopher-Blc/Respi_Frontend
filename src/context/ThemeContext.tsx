import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppTheme, darkTheme, lightTheme } from '../theme';

const THEME_STORAGE_KEY = 'respi.theme.mode';

type ThemeContextValue = {
  isDarkMode: boolean;
  theme: AppTheme;
  setDarkMode: (enabled: boolean) => void;
  toggleTheme: () => void;
  isThemeReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  isDarkMode: false,
  theme: lightTheme,
  setDarkMode: () => {},
  toggleTheme: () => {},
  isThemeReady: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    const restore = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode === 'dark') {
          setIsDarkMode(true);
        }
      } catch (error) {
        console.error('Error loading theme preference', error);
      } finally {
        setIsThemeReady(true);
      }
    };

    restore();
  }, []);

  const persistTheme = useCallback(async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, enabled ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference', error);
    }
  }, []);

  const setDarkMode = useCallback(
    (enabled: boolean) => {
      setIsDarkMode(enabled);
      persistTheme(enabled);
    },
    [persistTheme],
  );

  const toggleTheme = useCallback(() => {
    setIsDarkMode((current) => {
      const next = !current;
      persistTheme(next);
      return next;
    });
  }, [persistTheme]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({
      isDarkMode,
      theme,
      setDarkMode,
      toggleTheme,
      isThemeReady,
    }),
    [isDarkMode, theme, setDarkMode, toggleTheme, isThemeReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
