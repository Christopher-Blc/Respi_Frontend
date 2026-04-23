import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export type AppTheme = {
  primary: string;
  onPrimary: string;
  primarySoft: string;
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceMuted: string;
  surfaceGlass: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textPlaceholder: string;
  textSubtle: string;
  borderDefault: string;
  borderSoft: string;
  borderGlass: string;
  borderInput: string;
  borderAccentSoft: string;
  inputBg: string;
  inputBgSoft: string;
  inputPlaceholder: string;
  inputFocus: string;
  overlayDark: string;
  iconPrimary: string;
  iconMuted: string;
  iconCardBg: string;
  avatarBorder: string;
  profileGradientStart: string;
  profileGradientMiddle: string;
  profileGradientEnd: string;
  reservationsCardOverlayStart: string;
  reservationsCardOverlayEnd: string;
  danger: string;
  dangerSoft: string;
  errorText: string;
  success: string;
  successSoft: string;
  info: string;
  infoSoft: string;
  warning: string;
  warningSoft: string;
  logoutGlass: string;
  logoutBorder: string;

  // Legacy aliases used across the codebase.
  primaryButton: string;
  primaryHeader: string;
  secondaryLink: string;
  errorButton: string;
  errorBorder: string;
  backgroundCard: string;
  backgroundMain: string;
  backgroundInput: string;
  backgroundInputPopup: string;
  grayLabelText: string;
  grayPlaceholder: string;
  borderMain: string;
  borderLight: string;
  iconMain: string;
  textTitle: string;
  textBody: string;
  textValue: string;
  textSubtitle: string;
  textSeparator: string;
  textInput: string;
  inputBorder: string;
  inputBackground: string;
  avatarBackground: string;
  avatarText: string;
  cardBackground: string;
  cardBorderAccent: string;
  headerBackground: string;
  headerText: string;
  tabBackground: string;
  tabActive: string;
  tabInactive: string;
  buttonGradient: readonly [string, string];
  buttonGradientAlt: readonly [string, string];
};

export const lightTheme: AppTheme = {
  primary: '#CA8E0E',
  onPrimary: '#FFFFFF',
  primarySoft: 'rgba(202, 142, 14, 0.15)',
  background: '#F8F9FA',
  backgroundAlt: '#F0F9F8',
  surface: '#FFFFFF',
  surfaceMuted: '#FAF3E0',
  surfaceGlass: 'rgba(255, 255, 255, 0.6)',
  textPrimary: '#333333',
  textSecondary: '#444444',
  textMuted: '#888888',
  textPlaceholder: '#AAAAAA',
  textSubtle: '#CCCCCC',
  borderDefault: '#c4c4c4',
  borderSoft: '#E2E8F0',
  borderGlass: 'rgba(255, 255, 255, 0.3)',
  borderInput: 'rgba(0, 0, 0, 0.12)',
  borderAccentSoft: 'rgba(202, 142, 14, 0.3)',
  inputBg: 'rgba(255,255,255,0.4)',
  inputBgSoft: 'rgba(255, 255, 255, 0.1)',
  inputPlaceholder: 'rgba(0,0,0,0.4)',
  inputFocus: '#CA8E0E',
  overlayDark: 'rgba(0,0,0,0.5)',
  iconPrimary: '#B89B5E',
  iconMuted: '#C7C7CC',
  iconCardBg: '#FDF8ED',
  avatarBorder: '#D4AF37',
  profileGradientStart: '#FFFFFF',
  profileGradientMiddle: '#F3D69B',
  profileGradientEnd: '#FFFFFF',
  reservationsCardOverlayStart: 'rgba(0,0,0,0.6)',
  reservationsCardOverlayEnd: 'rgba(0,0,0,0.8)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.15)',
  errorText: '#D32F2F',
  success: '#16A34A',
  successSoft: 'rgba(22, 163, 74, 0.18)',
  info: '#3B82F6',
  infoSoft: 'rgba(59, 130, 246, 0.15)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.15)',
  logoutGlass: 'rgba(191, 4, 4, 0.4)',
  logoutBorder: '#FFB8B8',

  primaryButton: '#CA8E0E',
  primaryHeader: '#0F766E',
  secondaryLink: '#06B6D4',
  errorButton: '#EF4444',
  errorBorder: '#FF0000',
  backgroundCard: '#FFFFFF',
  backgroundMain: '#F0F9F8',
  backgroundInput: '#E0F2F1',
  backgroundInputPopup: '#F0F9F8',
  grayLabelText: '#6B7280',
  grayPlaceholder: '#9CA3AF',
  borderMain: '#7ECCC4',
  borderLight: '#A8D8D3',
  iconMain: '#26A69A',
  textTitle: '#00453D',
  textBody: '#00453D',
  textValue: '#00897B',
  textSubtitle: '#4DB8A8',
  textSeparator: '#80CBC4',
  textInput: '#00453D',
  inputBorder: '#00897B',
  inputBackground: '#F0F9F8',
  avatarBackground: '#B2EBF2',
  avatarText: '#0D9488',
  cardBackground: '#FFFFFF',
  cardBorderAccent: '#0D9488',
  headerBackground: '#ffffff',
  headerText: '#000000',
  tabBackground: '#ffffff',
  tabActive: '#CA8E0E',
  tabInactive: '#AAAAAA',
  buttonGradient: ['#F5CA7E', '#E9E9E9'],
  buttonGradientAlt: ['#F5CA7E', '#F2D59A'],
};

export const darkTheme: AppTheme = {
  primary: '#CA8E0E',
  onPrimary: '#FFFFFF',
  primarySoft: 'rgba(202, 142, 14, 0.2)',
  background: '#0B0B0B',
  backgroundAlt: '#121212',
  surface: '#171717',
  surfaceMuted: '#1E1E1E',
  surfaceGlass: 'rgba(23, 23, 23, 0.7)',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#BBBBBB',
  textPlaceholder: '#AAAAAA',
  textSubtle: '#777777',
  borderDefault: '#242424',
  borderSoft: '#2A2A2A',
  borderGlass: 'rgba(255, 255, 255, 0.14)',
  borderInput: 'rgba(255, 255, 255, 0.22)',
  borderAccentSoft: 'rgba(202, 142, 14, 0.45)',
  inputBg: 'rgba(255,255,255,0.08)',
  inputBgSoft: 'rgba(255, 255, 255, 0.08)',
  inputPlaceholder: 'rgba(255,255,255,0.4)',
  inputFocus: '#CA8E0E',
  overlayDark: 'rgba(0,0,0,0.65)',
  iconPrimary: '#CA8E0E',
  iconMuted: '#9CA3AF',
  iconCardBg: '#1E1E1E',
  avatarBorder: '#CA8E0E',
  profileGradientStart: '#0B0B0B',
  profileGradientMiddle: '#171717',
  profileGradientEnd: '#0B0B0B',
  reservationsCardOverlayStart: 'rgba(0,0,0,0.4)',
  reservationsCardOverlayEnd: 'rgba(0,0,0,0.82)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.2)',
  errorText: '#D32F2F',
  success: '#22C55E',
  successSoft: 'rgba(34, 197, 94, 0.2)',
  info: '#60A5FA',
  infoSoft: 'rgba(96, 165, 250, 0.2)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.2)',
  logoutGlass: 'rgba(127, 35, 35, 0.45)',
  logoutBorder: '#D88888',

  primaryButton: '#CA8E0E',
  primaryHeader: '#0F0F0F',
  secondaryLink: '#CA8E0E',
  errorButton: '#EF4444',
  errorBorder: '#D32F2F',
  backgroundCard: '#171717',
  backgroundMain: '#0B0B0B',
  backgroundInput: 'rgba(255,255,255,0.08)',
  backgroundInputPopup: '#141414',
  grayLabelText: '#BBBBBB',
  grayPlaceholder: '#AAAAAA',
  borderMain: '#2A2A2A',
  borderLight: '#1F1F1F',
  iconMain: '#CA8E0E',
  textTitle: '#FFFFFF',
  textBody: '#CCCCCC',
  textValue: '#CA8E0E',
  textSubtitle: '#BBBBBB',
  textSeparator: '#2A2A2A',
  textInput: '#FFFFFF',
  inputBorder: '#CA8E0E',
  inputBackground: 'rgba(255,255,255,0.08)',
  avatarBackground: '#1A1A1A',
  avatarText: '#CA8E0E',
  cardBackground: '#171717',
  cardBorderAccent: '#CA8E0E',
  headerBackground: '#0F0F0F',
  headerText: '#FFFFFF',
  tabBackground: '#0F0F0F',
  tabActive: '#CA8E0E',
  tabInactive: '#AAAAAA',
  buttonGradient: ['#1A1A1A', '#000000'],
  buttonGradientAlt: ['#CA8E0E', '#2B2B2B'],
};

export const buildPaperTheme = (isDarkMode: boolean) => {
  const current = isDarkMode ? darkTheme : lightTheme;
  const base = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  return {
    ...base,
    dark: isDarkMode,
    colors: {
      ...base.colors,
      primary: current.primary,
      onPrimary: current.onPrimary,
      background: current.background,
      surface: current.surface,
      onSurface: current.textPrimary,
      outline: current.borderSoft,
      error: current.errorText,
    },
  };
};

// Temporary aliases for untouched files during migration.
export const lightModeSemanticTokens = lightTheme;
export const mainThemeColors = lightTheme;
export const mainThemeColorsDark = darkTheme;
export const themeApp = buildPaperTheme(false);
export const themeAppDark = buildPaperTheme(true);
