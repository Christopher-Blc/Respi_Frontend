import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, Platform } from 'react-native';
import { AppTheme, darkTheme, lightTheme } from '../theme';

const THEME_STORAGE_KEY = 'respi.theme.mode';
type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  themeMode: ThemeMode;
  isSystemTheme: boolean;
  isDarkMode: boolean;
  theme: AppTheme;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeModePreview: (mode: ThemeMode) => void;
  setDarkMode: (enabled: boolean) => void;
  setDarkModePreview: (enabled: boolean) => void;
  setSystemTheme: (enabled: boolean) => void;
  setSystemThemePreview: (enabled: boolean) => void;
  toggleTheme: () => void;
  isThemeReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'system',
  isSystemTheme: true,
  isDarkMode: false,
  theme: lightTheme,
  setThemeMode: () => {},
  setThemeModePreview: () => {},
  setDarkMode: () => {},
  setDarkModePreview: () => {},
  setSystemTheme: () => {},
  setSystemThemePreview: () => {},
  toggleTheme: () => {},
  isThemeReady: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [, setAppearanceVersion] = useState(0);
  const [isThemeReady, setIsThemeReady] = useState(false);

  const getIsSystemDark = () => {
    const colorScheme = Appearance.getColorScheme();
    if (colorScheme === 'dark') {
      return true;
    }

    if (colorScheme === 'light') {
      return false;
    }

    // Fallback for environments where Appearance can return null.
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    }

    return false;
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      setAppearanceVersion((current) => current + 1);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const restore = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (
          savedMode === 'dark' ||
          savedMode === 'light' ||
          savedMode === 'system'
        ) {
          setThemeModeState(savedMode);
        } else {
          setThemeModeState('system');
        }
      } catch (error) {
        console.error('Error loading theme preference', error);
      } finally {
        setIsThemeReady(true);
      }
    };

    restore();
  }, []);

  const persistThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme preference', error);
    }
  }, []);

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState(mode);
      persistThemeMode(mode);
    },
    [persistThemeMode],
  );

  const setThemeModePreview = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const isDarkMode =
    themeMode === 'system' ? getIsSystemDark() : themeMode === 'dark';
  const isSystemTheme = themeMode === 'system';

  const setDarkMode = useCallback(
    (enabled: boolean) => {
      setThemeMode(enabled ? 'dark' : 'light');
    },
    [setThemeMode],
  );

  const setDarkModePreview = useCallback(
    (enabled: boolean) => {
      setThemeModePreview(enabled ? 'dark' : 'light');
    },
    [setThemeModePreview],
  );

  const setSystemTheme = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        setThemeMode('system');
        return;
      }

      setThemeMode(isDarkMode ? 'dark' : 'light');
    },
    [isDarkMode, setThemeMode],
  );

  const setSystemThemePreview = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        setThemeModePreview('system');
        return;
      }

      setThemeModePreview(isDarkMode ? 'dark' : 'light');
    },
    [isDarkMode, setThemeModePreview],
  );

  const toggleTheme = useCallback(() => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setThemeMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = useMemo(
    () => ({
      themeMode,
      isSystemTheme,
      isDarkMode,
      theme,
      setThemeMode,
      setThemeModePreview,
      setDarkMode,
      setDarkModePreview,
      setSystemTheme,
      setSystemThemePreview,
      toggleTheme,
      isThemeReady,
    }),
    [
      themeMode,
      isSystemTheme,
      isDarkMode,
      theme,
      setThemeMode,
      setThemeModePreview,
      setDarkMode,
      setDarkModePreview,
      setSystemTheme,
      setSystemThemePreview,
      toggleTheme,
      isThemeReady,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
