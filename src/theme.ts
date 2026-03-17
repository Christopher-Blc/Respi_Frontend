import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const mainThemeColors = {
  // PRIMARIOS - Botones principales y elementos destacados
  primaryButton: "#0d9488",        // Botones guardar, FAB, iconos principales (teal brillante)
  primaryHeader: "#0f766e",        // Header y tab bar (teal medio-claro)

  // SECUNDARIOS
  secondaryLink: "#06b6d4",        // Links y textos secundarios (cyan luminoso)

  // PELIGRO/ERROR - Acciones destructivas
  errorButton: "#ff6b6b",          // Botón cancelar, delete button (rojo brillante)
  errorBorder: "#ff0000",          // Borde delete button (rojo más intenso)
  errorText: "#ff7675",            // Textos de error (rojo claro)

  // FONDOS - Colores de fondo
  backgroundCard: "#ffffff",        // Cards, inputs, popups
  backgroundMain: "#f0f9f8",        // Contenedor principal (blanco con tint teal más fuerte)
  backgroundInput: "#e0f2f1",       // Fondo inputs de login (muy claro y luminoso)
  backgroundInputPopup: "#f0f9f8",  // Fondo inputs en PopUpCrear (teal muy claro para resaltar)

  // GRAYS - Tonos neutros y grises
  grayLabelText: "#6b7280",         // Labels, textos secundarios, iconos (gris neutro)
  grayPlaceholder: "#9ca3af",       // Placeholder, textos terciarios (gris claro)
  borderMain: "#7eccc4",        // Bordes generales (teal más saturado y visible)
  borderLight: "#a8d8d3",       // Bordes claros (teal claro pero distinguible)
  iconMain: "#26a69a",          // Iconos (teal medio)

  // TEXTOS - Colores de texto principales
  textTitle: "#00453d",             // Nombres, títulos principales (teal muy oscuro)
  textBody: "#00453d",              // Textos normales (nombre cliente)
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
  cardBackground: "#ffffff",        // Fondo cards clientes
  cardBorderAccent: "#0d9488",      // Borde izquierdo cards (teal)

  // NAVEGACIÓN - Tab bar y header
  headerBackground: "#0f766e",      // Fondo header (teal medio-claro - LIGHT MODE)
  headerText: "#ffffff",            // Texto header
  tabBackground: "#0f766e",         // Fondo tab bar (teal medio-claro)
  tabActive: "#87e4f0",             // Tab activo (cyan luminoso - muy visible y llamativo)
  tabInactive: "#b9bdc2",           // Tab inactivo (gris claro - visible pero discreto)
};

// Paleta modo oscuro: respeta la identidad teal pero con fondos oscuros elegantes
export const mainThemeColorsDark = {
  // PRIMARIOS (teal profesional, menos saturado)
  primaryButton: "#1aa38f",
  primaryHeader: "#102033",

  // SECUNDARIOS
  secondaryLink: "#4db6e2",

  // PELIGRO/ERROR
  errorButton: "#e75f5f",
  errorBorder: "#d64545",
  errorText: "#f5b5b5",

  // FONDOS (oscuro elegante con matiz azul marino)
  backgroundCard: "#102033",
  backgroundMain: "#0f141f",
  backgroundInput: "#1a2e3d",
  backgroundInputPopup: "#1a2e3d",

  // NEUTROS
  grayLabelText: "#9da6b0",
  grayPlaceholder: "#7ec4b8",
  borderMain: "#2a4a5e",
  borderLight: "#1e3545",
  iconMain: "#1aa38f",

  // TEXTOS
  textTitle: "#f4f8fc",
  textBody: "#e5ecf5",
  textValue: "#8ddcd1",
  textSubtitle: "#6bb8e3",
  textSeparator: "#1e3545",
  textInput: "#abb5b3",

  // INPUTS
  inputBorder: "#2a9d8f",
  inputBackground: "#1a2e3d",
  inputPlaceholder: "#6bb8e3",

  // COMPONENTES
  avatarBackground: "#1a2537",
  avatarText: "#1aa38f",
  cardBackground: "#131b28",
  cardBorderAccent: "#1aa38f",

  // NAVEGACIÓN
  headerBackground: "#102033",
  headerText: "#f1f4f9",
  tabBackground: "#102033",
  tabActive: "#1aa38f",
  tabInactive: "#5b6b84",
};

export const themeApp = {
  ...DefaultTheme,
  colors: mainThemeColors,
};

export const themeAppDark = {
  ...DefaultTheme,
  colors: mainThemeColorsDark,
};