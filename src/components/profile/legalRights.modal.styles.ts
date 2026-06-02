import { StyleSheet } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export default function createLegalModalStyles(
  theme: any,
  isDarkMode: boolean,
  insets: EdgeInsets,
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    body: {
      paddingHorizontal: 20,
      paddingBottom: insets.bottom + 20,
    },
    textCard: {
      backgroundColor: theme.backgroundCard,
      borderRadius: 12,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      shadowColor: theme.textTitle,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    legalText: {
      fontSize: 14,
      lineHeight: 22,
      color: theme.textBody,
      textAlign: 'justify',
    },
    footer: {
      padding: 20,
      paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderColor: theme.borderSoft,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.4 : 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
