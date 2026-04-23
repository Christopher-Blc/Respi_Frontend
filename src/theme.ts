import { MD3LightTheme as DefaultTheme } from "react-native-paper";

// Semantic tokens for LIGHT mode based on current hardcoded usage in the app.
// Use these roles when migrating screens/components away from literal colors.
export const lightModeSemanticTokens = {
  // Brand
  primary: "#CA8E0E", // Main CTA and highlights (buttons, loaders)
  primaryStrong: "#BF8404", // Stronger text/accent version of primary
  primarySoft: "rgba(202, 142, 14, 0.15)", // Soft primary background
  onPrimary: "#FFFFFF",

  // Base surfaces
  background: "#F8F9FA", // Main app page background
  backgroundAlt: "#f0f9f8", // Soft tinted background used in cards/sections
  surface: "#FFFFFF", // Cards and modals
  surfaceMuted: "#FAF3E0", // Secondary card surface (profile reservas card)
  surfaceGlass: "rgba(255, 255, 255, 0.6)",

  // Text
  textPrimary: "#333333",
  textSecondary: "#444444",
  textMuted: "#888888",
  textPlaceholder: "#AAAAAA",
  textSubtle: "#CCCCCC",
  textOnDark: "#FFFFFF",

  // Borders and separators
  borderDefault: "#F0F0F0",
  borderSoft: "#E2E8F0",
  borderGlass: "rgba(255, 255, 255, 0.3)",
  borderInput: "rgba(0, 0, 0, 0.12)",
  borderAccentSoft: "rgba(202, 142, 14, 0.3)",

  // Inputs and overlays
  inputBg: "rgba(255,255,255,0.4)",
  inputBgSoft: "rgba(255, 255, 255, 0.1)",
  inputPlaceholder: "rgba(0,0,0,0.4)",
  inputFocus: "#CA8E0E",
  overlayDark: "rgba(0,0,0,0.5)",

  // Icon and badges
  iconPrimary: "#B89B5E",
  iconMuted: "#C7C7CC",
  iconCardBg: "#FDF8ED",
  avatarBorder: "#D4AF37",

  // Feature gradients and backgrounds
  profileGradientStart: "#FFFFFF",
  profileGradientMiddle: "#F3D69B",
  profileGradientEnd: "#FFFFFF",
  reservationsCardOverlayStart: "rgba(0,0,0,0.6)",
  reservationsCardOverlayEnd: "rgba(0,0,0,0.8)",

  // Status and feedback
  danger: "#EF4444",
  dangerSoft: "rgba(239, 68, 68, 0.15)",
  errorText: "#D32F2F",
  success: "#16A34A",
  successSoft: "rgba(22, 163, 74, 0.18)",
  info: "#3B82F6",
  infoSoft: "rgba(59, 130, 246, 0.15)",
  warning: "#F59E0B",
  warningSoft: "rgba(245, 158, 11, 0.15)",

  // Legacy/special
  debugButton: "#5100ff",
  logoutGlass: "rgba(191, 4, 4, 0.4)",
  logoutBorder: "#ffb8b8",
} as const;

export const mainThemeColors = {
  // PRIMARIOS - Botones principales y elementos destacados
  primaryButton: lightModeSemanticTokens.primary,
  primaryHeader: "#0f766e",

  // SECUNDARIOS
  secondaryLink: "#06b6d4",

  // PELIGRO/ERROR - Acciones destructivas
  errorButton: lightModeSemanticTokens.danger,
  errorBorder: "#ff0000",
  errorText: lightModeSemanticTokens.errorText,

  // FONDOS - Colores de fondo
  backgroundCard: lightModeSemanticTokens.surface,
  backgroundMain: lightModeSemanticTokens.backgroundAlt,
  backgroundInput: "#e0f2f1",       // Fondo inputs de login (muy claro y luminoso)
  backgroundInputPopup: "#f0f9f8",  // Fondo inputs en PopUpCrear (teal muy claro para resaltar)

  // GRAYS - Tonos neutros y grises
  grayLabelText: "#6b7280",
  grayPlaceholder: "#9ca3af",
  borderMain: "#7eccc4",        // Bordes generales (teal más saturado y visible)
  borderLight: "#a8d8d3",       // Bordes claros (teal claro pero distinguible)
  iconMain: "#26a69a",          // Iconos (teal medio)

  // TEXTOS - Colores de texto principales
  textTitle: "#00453d",
  textBody: "#00453d",
  textValue: "#00897b",             // Valores, textos medianos (teal oscuro)
  textSubtitle: "#4db8a8",          // Subtítulos login (teal claro)
  textSeparator: "#80cbc4",         // Separator text (teal muy claro)
  textInput: "#00453d",             // Texto input email y editar modal

  // INPUTS - Específicos para campos de entrada
  inputBorder: "#00897b",           // Borde inputs modal editar (teal más oscuro y visible)
  inputBackground: "#f0f9f8",       // Fondo inputs (teal muy claro para resaltar)
  inputPlaceholder: "#80cbc4",      // Placeholder inputs login

  // COMPONENTES - Elementos específicos
  avatarBackground: "#b2ebf2",      // Fondo avatar clientes (cyan muy claro)
  avatarText: "#0d9488",            // Texto avatar (teal)
  cardBackground: lightModeSemanticTokens.surface,
  cardBorderAccent: "#0d9488",      // Borde izquierdo cards (teal)

  // NAVEGACIÓN - Tab bar y header
  headerBackground: "#0f766e",      // Fondo header (teal medio-claro - LIGHT MODE)
  headerText: lightModeSemanticTokens.onPrimary,
  tabBackground: "#0f766e",         // Fondo tab bar (teal medio-claro)
  tabActive: "#87e4f0",             // Tab activo (cyan luminoso - muy visible y llamativo)
  tabInactive: "#b9bdc2",           // Tab inactivo (gris claro - visible pero discreto)

  // GRADIENTS (botones)
  buttonGradient: ["#F5CA7E", "#E9E9E9"] as const,
  buttonGradientAlt: ["#F5CA7E", "#F2D59A"] as const,
};

// Paleta modo oscuro: respeta la identidad teal pero con fondos oscuros elegantes
export const mainThemeColorsDark = {
  // PRIMARIOS (basado en prototipo dark de login/register: naranja + negro)
  primaryButton: "#CA8E0E",
  primaryHeader: "#0F0F0F",

  // SECUNDARIOS
  secondaryLink: "#CA8E0E",

  // PELIGRO/ERROR
  errorButton: "#EF4444",
  errorBorder: "#D32F2F",
  errorText: "#F5B5B5",

  // FONDOS (negro/gris oscuro)
  backgroundCard: "#171717",
  backgroundMain: "#0B0B0B",
  backgroundInput: "rgba(255,255,255,0.08)",
  backgroundInputPopup: "#141414",

  // NEUTROS
  grayLabelText: "#BBBBBB",
  grayPlaceholder: "#AAAAAA",
  borderMain: "#2A2A2A",
  borderLight: "#1F1F1F",
  iconMain: "#CA8E0E",

  // TEXTOS
  textTitle: "#FFFFFF",
  textBody: "#CCCCCC",
  textValue: "#CA8E0E",
  textSubtitle: "#BBBBBB",
  textSeparator: "#2A2A2A",
  textInput: "#FFFFFF",

  // INPUTS
  inputBorder: "#CA8E0E",
  inputBackground: "rgba(255,255,255,0.08)",
  inputPlaceholder: "rgba(255,255,255,0.4)",

  // COMPONENTES
  avatarBackground: "#1A1A1A",
  avatarText: "#CA8E0E",
  cardBackground: "#171717",
  cardBorderAccent: "#CA8E0E",

  // NAVEGACIÓN
  headerBackground: "#0F0F0F",
  headerText: "#FFFFFF",
  tabBackground: "#0F0F0F",
  tabActive: "#CA8E0E",
  tabInactive: "#AAAAAA",

  // GRADIENTS (botones)
  buttonGradient: ["#1A1A1A", "#000000"] as const,
  buttonGradientAlt: ["#CA8E0E", "#2B2B2B"] as const,
};

export const themeApp = {
  ...DefaultTheme,
  colors: mainThemeColors,
};

export const themeAppDark = {
  ...DefaultTheme,
  colors: mainThemeColorsDark,
};