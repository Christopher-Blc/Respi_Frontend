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
import {
  AppTheme,
  THEME_PALETTES,
  ThemePalette,
  getThemeVariant,
} from '../theme';

const THEME_STORAGE_KEY = 'respi.theme.preferences';
export type ThemeMode = 'system' | 'light' | 'dark';
type ThemePreferences = {
  mode: ThemeMode;
  palette: ThemePalette;
};

const defaultThemePreferences: ThemePreferences = {
  mode: 'system',
  palette: 'orange',
};

const isThemeMode = (value: string): value is ThemeMode =>
  value === 'dark' || value === 'light' || value === 'system';

const isThemePalette = (value: string): value is ThemePalette =>
  THEME_PALETTES.includes(value as ThemePalette);

type ThemeContextValue = {
  themeMode: ThemeMode;
  themePalette: ThemePalette;
  isSystemTheme: boolean;
  isDarkMode: boolean;
  theme: AppTheme;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeModePreview: (mode: ThemeMode) => void;
  setThemePalette: (palette: ThemePalette) => void;
  setThemePalettePreview: (palette: ThemePalette) => void;
  setThemePreferences: (mode: ThemeMode, palette: ThemePalette) => void;
  setThemePreferencesPreview: (mode: ThemeMode, palette: ThemePalette) => void;
  setDarkMode: (enabled: boolean) => void;
  setDarkModePreview: (enabled: boolean) => void;
  setSystemTheme: (enabled: boolean) => void;
  setSystemThemePreview: (enabled: boolean) => void;
  toggleTheme: () => void;
  isThemeReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: 'system',
  themePalette: 'orange',
  isSystemTheme: true,
  isDarkMode: false,
  theme: getThemeVariant(false),
  setThemeMode: () => {},
  setThemeModePreview: () => {},
  setThemePalette: () => {},
  setThemePalettePreview: () => {},
  setThemePreferences: () => {},
  setThemePreferencesPreview: () => {},
  setDarkMode: () => {},
  setDarkModePreview: () => {},
  setSystemTheme: () => {},
  setSystemThemePreview: () => {},
  toggleTheme: () => {},
  isThemeReady: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [themePalette, setThemePaletteState] = useState<ThemePalette>('orange');
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
        const savedPreferences = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (!savedPreferences) {
          setThemeModeState(defaultThemePreferences.mode);
          setThemePaletteState(defaultThemePreferences.palette);
        } else {
          try {
            const parsed = JSON.parse(
              savedPreferences,
            ) as Partial<ThemePreferences>;
            const restoredMode =
              typeof parsed.mode === 'string' && isThemeMode(parsed.mode)
                ? parsed.mode
                : defaultThemePreferences.mode;
            const restoredPalette =
              typeof parsed.palette === 'string' &&
              isThemePalette(parsed.palette)
                ? parsed.palette
                : defaultThemePreferences.palette;

            setThemeModeState(restoredMode);
            setThemePaletteState(restoredPalette);
          } catch {
            // Backward compatibility with previous versions storing only mode.
            if (isThemeMode(savedPreferences)) {
              setThemeModeState(savedPreferences);
              setThemePaletteState(defaultThemePreferences.palette);
            } else {
              setThemeModeState(defaultThemePreferences.mode);
              setThemePaletteState(defaultThemePreferences.palette);
            }
          }
        }
      } catch (error) {
        console.error('Error loading theme preference', error);
      } finally {
        setIsThemeReady(true);
      }
    };

    restore();
  }, []);

  const persistThemePreferences = useCallback(
    async (prefs: ThemePreferences) => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(prefs));
      } catch (error) {
        console.error('Error saving theme preference', error);
      }
    },
    [],
  );

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeModeState(mode);
      persistThemePreferences({ mode, palette: themePalette });
    },
    [persistThemePreferences, themePalette],
  );

  const setThemeModePreview = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const setThemePalette = useCallback(
    (palette: ThemePalette) => {
      setThemePaletteState(palette);
      persistThemePreferences({ mode: themeMode, palette });
    },
    [persistThemePreferences, themeMode],
  );

  const setThemePalettePreview = useCallback((palette: ThemePalette) => {
    setThemePaletteState(palette);
  }, []);

  const setThemePreferences = useCallback(
    (mode: ThemeMode, palette: ThemePalette) => {
      setThemeModeState(mode);
      setThemePaletteState(palette);
      persistThemePreferences({ mode, palette });
    },
    [persistThemePreferences],
  );

  const setThemePreferencesPreview = useCallback(
    (mode: ThemeMode, palette: ThemePalette) => {
      setThemeModeState(mode);
      setThemePaletteState(palette);
    },
    [],
  );

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

  const theme = getThemeVariant(isDarkMode, themePalette);

  const value = useMemo(
    () => ({
      themeMode,
      themePalette,
      isSystemTheme,
      isDarkMode,
      theme,
      setThemeMode,
      setThemeModePreview,
      setThemePalette,
      setThemePalettePreview,
      setThemePreferences,
      setThemePreferencesPreview,
      setDarkMode,
      setDarkModePreview,
      setSystemTheme,
      setSystemThemePreview,
      toggleTheme,
      isThemeReady,
    }),
    [
      themeMode,
      themePalette,
      isSystemTheme,
      isDarkMode,
      theme,
      setThemeMode,
      setThemeModePreview,
      setThemePalette,
      setThemePalettePreview,
      setThemePreferences,
      setThemePreferencesPreview,
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
