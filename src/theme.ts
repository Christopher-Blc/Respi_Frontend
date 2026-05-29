import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export type ThemePalette = 'orange' | 'blue' | 'green' | 'red' | 'cyan' | 'pastelPink' | 'skyBlue';
export const THEME_PALETTES: readonly ThemePalette[] = [
  'orange',
  'blue',
  'green',
  'red',
  'cyan',
  'pastelPink',
  'skyBlue',
];

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
  availabilityFree: string;
  availabilityBusy: string;
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
  backgroundAlt: '#F7F5F1',
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
  inputPlaceholder: 'rgba(0,0,0,0.5)',
  inputFocus: '#CA8E0E',
  overlayDark: 'rgba(0,0,0,0.5)',
  iconPrimary: '#B89B5E',
  iconMuted: '#8E8E93',
  iconCardBg: '#FDF8ED',
  avatarBorder: '#D4AF37',
  profileGradientStart: '#FFFFFF',
  profileGradientMiddle: '#F3D69B',
  profileGradientEnd: '#FFFFFF',
  reservationsCardOverlayStart: 'rgba(0,0,0,0.32)',
  reservationsCardOverlayEnd: 'rgba(0,0,0,0.52)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.15)',
  errorText: '#D32F2F',
  success: '#CA8E0E',
  successSoft: 'rgba(202, 142, 14, 0.18)',
  info: '#CA8E0E',
  infoSoft: 'rgba(202, 142, 14, 0.14)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.15)',
  availabilityFree: 'rgba(209, 250, 229, 0.92)',
  availabilityBusy: 'rgba(113, 149, 248, 0.68)',
  logoutGlass: 'rgba(191, 4, 4, 0.4)',
  logoutBorder: '#FFB8B8',

  primaryButton: 'rgba(191, 132, 4, 0.51)',
  primaryHeader: '#ffffff9c',
  secondaryLink: '#CA8E0E',
  errorButton: '#EF4444',
  errorBorder: '#FF0000',
  backgroundCard: '#FFFFFF',
  backgroundMain: '#F7F5F1',
  backgroundInput: '#F5EEDF',
  backgroundInputPopup: '#F7F5F1',
  grayLabelText: '#6B7280',
  grayPlaceholder: '#9CA3AF',
  borderMain: '#D8C39A',
  borderLight: '#E6D8BE',
  iconMain: '#CA8E0E',
  textTitle: '#1F1F1F',
  textBody: '#2F2F2F',
  textValue: '#CA8E0E',
  textSubtitle: '#666666',
  textSeparator: '#D6D6D6',
  textInput: '#1F1F1F',
  inputBorder: '#CA8E0E',
  inputBackground: 'rgba(255,255,255,0.4)',
  avatarBackground: '#F6E8C8',
  avatarText: '#8A5E00',
  cardBackground: '#FFFFFF',
  cardBorderAccent: '#CA8E0E',
  headerBackground: '#ffffff',
  headerText: '#000000',
  tabBackground: '#ffffff',
  tabActive: '#CA8E0E',
  tabInactive: '#6B6B6B',
  buttonGradient: ['#F5CA7E', '#E9E9E9'],
  buttonGradientAlt: ['#F5CA7E', '#F2D59A'],
};

export const darkTheme: AppTheme = {
  primary: '#CA8E0E',
  onPrimary: '#FFFFFF',
  primarySoft: 'rgba(202, 142, 14, 0.2)',
  background: '#0B0B0B',
  backgroundAlt: '#121212',
  surface: '#1b1b1b',
  surfaceMuted: 'rgba(255, 174, 0, 0.08)',
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
  inputPlaceholder: 'rgba(255,255,255,0.55)',
  inputFocus: '#CA8E0E',
  overlayDark: 'rgba(0,0,0,0.65)',
  iconPrimary: '#CA8E0E',
  iconMuted: '#9CA3AF',
  iconCardBg: '#141414',
  avatarBorder: '#CA8E0E',
  profileGradientStart: '#0B0B0B',
  profileGradientMiddle: '#171717',
  profileGradientEnd: '#0B0B0B',
  reservationsCardOverlayStart: 'rgba(0,0,0,0.2)',
  reservationsCardOverlayEnd: 'rgba(0,0,0,0.4)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.2)',
  errorText: '#D32F2F',
  success: '#CA8E0E',
  successSoft: 'rgba(202, 142, 14, 0.2)',
  info: '#CA8E0E',
  infoSoft: 'rgba(202, 142, 14, 0.2)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.2)',
  availabilityFree: 'rgba(161, 187, 174, 0.92)',
  availabilityBusy: 'rgba(113, 149, 248, 0.68)',
  logoutGlass: 'rgba(127, 35, 35, 0.45)',
  logoutBorder: '#e9313146',

  primaryButton: 'rgba(202, 142, 14, 0.45)',
  primaryHeader: '#000000a6',
  secondaryLink: '#CA8E0E',
  errorButton: '#EF4444',
  errorBorder: '#D32F2F',
  backgroundCard: '#1b1b1b',
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
  tabInactive: '#A1A1AA',
  buttonGradient: ['#1A1A1A', '#000000'],
  buttonGradientAlt: ['#CA8E0E', '#2B2B2B'],
};

type PaletteTokens = {
  primary: string;
  primarySoft: string;
  borderAccentSoft: string;
  iconPrimary: string;
  avatarBorder: string;
  profileGradientMiddleLight: string;
  profileGradientMiddleDark: string;
  success: string;
  successSoftLight: string;
  successSoftDark: string;
  primaryButtonLight: string;
  primaryButtonDark: string;
  borderMainLight: string;
  borderMainDark: string;
  avatarTextLight: string;
  avatarTextDark: string;
  buttonGradientAltLight: readonly [string, string];
  buttonGradientAltDark: readonly [string, string];
};

const paletteTokens: Record<ThemePalette, PaletteTokens> = {
  orange: {
    primary: '#CA8E0E',
    primarySoft: 'rgba(202, 142, 14, 0.16)',
    borderAccentSoft: 'rgba(202, 142, 14, 0.38)',
    iconPrimary: '#CA8E0E',
    avatarBorder: '#CA8E0E',
    profileGradientMiddleLight: '#F3D69B',
    profileGradientMiddleDark: '#171717',
    success: '#CA8E0E',
    successSoftLight: 'rgba(202, 142, 14, 0.18)',
    successSoftDark: 'rgba(202, 142, 14, 0.2)',
    primaryButtonLight: 'rgba(191, 132, 4, 0.51)',
    primaryButtonDark: 'rgba(202, 142, 14, 0.45)',
    borderMainLight: '#D8C39A',
    borderMainDark: '#2A2A2A',
    avatarTextLight: '#8A5E00',
    avatarTextDark: '#CA8E0E',
    buttonGradientAltLight: ['#F5CA7E', '#F2D59A'],
    buttonGradientAltDark: ['#CA8E0E', '#2B2B2B'],
  },
  blue: {
    primary: '#2563EB',
    primarySoft: 'rgba(37, 99, 235, 0.16)',
    borderAccentSoft: 'rgba(37, 99, 235, 0.35)',
    iconPrimary: '#2563EB',
    avatarBorder: '#3B82F6',
    profileGradientMiddleLight: '#C6DAFF',
    profileGradientMiddleDark: '#101E33',
    success: '#2563EB',
    successSoftLight: 'rgba(37, 99, 235, 0.16)',
    successSoftDark: 'rgba(37, 99, 235, 0.24)',
    primaryButtonLight: 'rgba(37, 99, 235, 0.42)',
    primaryButtonDark: 'rgba(37, 99, 235, 0.45)',
    borderMainLight: '#B7C9EE',
    borderMainDark: '#26364F',
    avatarTextLight: '#1E3A8A',
    avatarTextDark: '#60A5FA',
    buttonGradientAltLight: ['#BFDBFE', '#DBEAFE'],
    buttonGradientAltDark: ['#1D4ED8', '#1E293B'],
  },
  green: {
    primary: '#2E7D32',
    primarySoft: 'rgba(46, 125, 50, 0.18)',
    borderAccentSoft: 'rgba(46, 125, 50, 0.36)',
    iconPrimary: '#2E7D32',
    avatarBorder: '#43A047',
    profileGradientMiddleLight: '#CAEACB',
    profileGradientMiddleDark: '#102514',
    success: '#2E7D32',
    successSoftLight: 'rgba(46, 125, 50, 0.16)',
    successSoftDark: 'rgba(67, 160, 71, 0.25)',
    primaryButtonLight: 'rgba(46, 125, 50, 0.43)',
    primaryButtonDark: 'rgba(67, 160, 71, 0.45)',
    borderMainLight: '#B7D7BA',
    borderMainDark: '#234128',
    avatarTextLight: '#1B5E20',
    avatarTextDark: '#81C784',
    buttonGradientAltLight: ['#C8E6C9', '#E8F5E9'],
    buttonGradientAltDark: ['#2E7D32', '#1B2A1E'],
  },
  red: {
    primary: '#C62828',
    primarySoft: 'rgba(198, 40, 40, 0.16)',
    borderAccentSoft: 'rgba(198, 40, 40, 0.35)',
    iconPrimary: '#C62828',
    avatarBorder: '#E53935',
    profileGradientMiddleLight: '#FFD0D0',
    profileGradientMiddleDark: '#2A1010',
    success: '#C62828',
    successSoftLight: 'rgba(198, 40, 40, 0.16)',
    successSoftDark: 'rgba(229, 57, 53, 0.24)',
    primaryButtonLight: 'rgba(198, 40, 40, 0.43)',
    primaryButtonDark: 'rgba(229, 57, 53, 0.45)',
    borderMainLight: '#E6B6B6',
    borderMainDark: '#4A2424',
    avatarTextLight: '#8E1B1B',
    avatarTextDark: '#EF9A9A',
    buttonGradientAltLight: ['#FECACA', '#FEE2E2'],
    buttonGradientAltDark: ['#B91C1C', '#2B1212'],
  },
  cyan: {
    primary: '#00838F',
    primarySoft: 'rgba(0, 131, 143, 0.16)',
    borderAccentSoft: 'rgba(0, 131, 143, 0.35)',
    iconPrimary: '#00838F',
    avatarBorder: '#00ACC1',
    profileGradientMiddleLight: '#CDEFF3',
    profileGradientMiddleDark: '#0E2227',
    success: '#00838F',
    successSoftLight: 'rgba(0, 131, 143, 0.16)',
    successSoftDark: 'rgba(0, 172, 193, 0.24)',
    primaryButtonLight: 'rgba(0, 131, 143, 0.43)',
    primaryButtonDark: 'rgba(0, 172, 193, 0.45)',
    borderMainLight: '#B6DADE',
    borderMainDark: '#234149',
    avatarTextLight: '#00626D',
    avatarTextDark: '#80DEEA',
    buttonGradientAltLight: ['#CFFAFE', '#ECFEFF'],
    buttonGradientAltDark: ['#0E7490', '#112329'],
  },
  pastelPink: {
    primary: '#F0A8D8',
    primarySoft: 'rgba(240, 168, 216, 0.16)',
    borderAccentSoft: 'rgba(240, 168, 216, 0.35)',
    iconPrimary: '#F0A8D8',
    avatarBorder: '#F08FCC',
    profileGradientMiddleLight: '#FFE0F0',
    profileGradientMiddleDark: '#2A1A22',
    success: '#F0A8D8',
    successSoftLight: 'rgba(240, 168, 216, 0.16)',
    successSoftDark: 'rgba(240, 168, 216, 0.24)',
    primaryButtonLight: 'rgba(240, 168, 216, 0.43)',
    primaryButtonDark: 'rgba(240, 168, 216, 0.45)',
    borderMainLight: '#E6BFDB',
    borderMainDark: '#3D2A3A',
    avatarTextLight: '#C2488F',
    avatarTextDark: '#F5C8E8',
    buttonGradientAltLight: ['#F5D5E8', '#FCE8F3'],
    buttonGradientAltDark: ['#D95AB5', '#3B2535'],
  },
  skyBlue: {
    primary: '#87CEEB',
    primarySoft: 'rgba(135, 206, 235, 0.16)',
    borderAccentSoft: 'rgba(135, 206, 235, 0.35)',
    iconPrimary: '#87CEEB',
    avatarBorder: '#79BFDB',
    profileGradientMiddleLight: '#E0F7FF',
    profileGradientMiddleDark: '#0F1E2A',
    success: '#87CEEB',
    successSoftLight: 'rgba(135, 206, 235, 0.16)',
    successSoftDark: 'rgba(135, 206, 235, 0.24)',
    primaryButtonLight: 'rgba(135, 206, 235, 0.43)',
    primaryButtonDark: 'rgba(135, 206, 235, 0.45)',
    borderMainLight: '#B8D9E8',
    borderMainDark: '#1F3A4D',
    avatarTextLight: '#3B7E9F',
    avatarTextDark: '#B5E7F5',
    buttonGradientAltLight: ['#D5F2FF', '#ECFAFF'],
    buttonGradientAltDark: ['#4A9BC7', '#0F2A3D'],
  },
};

export const getThemeVariant = (
  isDarkMode: boolean,
  palette: ThemePalette = 'orange',
): AppTheme => {
  const baseTheme = isDarkMode ? darkTheme : lightTheme;
  const tokens = paletteTokens[palette];

  return {
    ...baseTheme,
    primary: tokens.primary,
    primarySoft: tokens.primarySoft,
    borderAccentSoft: tokens.borderAccentSoft,
    inputFocus: tokens.primary,
    iconPrimary: tokens.iconPrimary,
    avatarBorder: tokens.avatarBorder,
    profileGradientMiddle: isDarkMode
      ? tokens.profileGradientMiddleDark
      : tokens.profileGradientMiddleLight,
    success: tokens.success,
    successSoft: isDarkMode ? tokens.successSoftDark : tokens.successSoftLight,
    info: tokens.primary,
    infoSoft: isDarkMode ? tokens.successSoftDark : tokens.successSoftLight,
    primaryButton: isDarkMode
      ? tokens.primaryButtonDark
      : tokens.primaryButtonLight,
    secondaryLink: tokens.primary,
    borderMain: isDarkMode ? tokens.borderMainDark : tokens.borderMainLight,
    iconMain: tokens.iconPrimary,
    textValue: tokens.primary,
    inputBorder: tokens.primary,
    avatarText: isDarkMode ? tokens.avatarTextDark : tokens.avatarTextLight,
    cardBorderAccent: tokens.primary,
    tabActive: tokens.primary,
    buttonGradientAlt: isDarkMode
      ? tokens.buttonGradientAltDark
      : tokens.buttonGradientAltLight,
  };
};

export const buildPaperTheme = (
  isDarkMode: boolean,
  palette: ThemePalette = 'orange',
) => {
  const current = getThemeVariant(isDarkMode, palette);
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
