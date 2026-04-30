import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import ro from '../locales/ro.json';
import ca from '../locales/ca.json';

const LANGUAGE_STORAGE_KEY = 'respi.language';
export const SUPPORTED_LANGUAGES = ['en', 'es', 'de', 'fr', 'ro', 'ca'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: Array<{ code: AppLanguage; labelKey: string }> = [
  { code: 'es', labelKey: 'languageSpanish' },
  { code: 'en', labelKey: 'languageEnglish' },
  { code: 'de', labelKey: 'languageGerman' },
  { code: 'fr', labelKey: 'languageFrench' },
  { code: 'ro', labelKey: 'languageRomanian' },
  { code: 'ca', labelKey: 'languageCatalan' },
];

export const languageResources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  ro: { translation: ro },
  ca: { translation: ca },
};

let initialized = false;

export const setupI18n = async () => {
  if (initialized || i18next.isInitialized) {
    initialized = true;
    return i18next;
  }

  const savedLanguage = (await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)) || 'es';
  const initialLanguage = getAppLanguage(savedLanguage);

  await i18next.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    lng: initialLanguage,
    fallbackLng: 'es',
    supportedLngs: [...SUPPORTED_LANGUAGES],
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

export const getAppLanguage = (language?: string | null): AppLanguage => {
  const baseLanguage = String(language || 'es').split('-')[0] as AppLanguage;
  return SUPPORTED_LANGUAGES.includes(baseLanguage) ? baseLanguage : 'es';
};

export const getDateLocale = (language?: string | null) => {
  const appLanguage = getAppLanguage(language);
  const localeMap: Record<AppLanguage, string> = {
    en: 'en-US',
    es: 'es-ES',
    de: 'de-DE',
    fr: 'fr-FR',
    ro: 'ro-RO',
    ca: 'ca-ES',
  };

  return localeMap[appLanguage];
};

export const setAppLanguage = async (language: AppLanguage) => {
  await i18next.changeLanguage(language);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export default i18next;
