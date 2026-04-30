import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';

const LANGUAGE_STORAGE_KEY = 'respi.language';

export const languageResources = {
  en: { translation: en },
  es: { translation: es },
};

let initialized = false;

export const setupI18n = async () => {
  if (initialized || i18next.isInitialized) {
    initialized = true;
    return i18next;
  }

  const savedLanguage = (await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)) || 'es';

  await i18next.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    lng: savedLanguage,
    fallbackLng: 'es',
    supportedLngs: ['en', 'es'],
    resources: languageResources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  initialized = true;
  return i18next;
};

export const setAppLanguage = async (language: 'en' | 'es') => {
  await i18next.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18next;
