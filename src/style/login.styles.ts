import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

const createLoginStyles = (theme: AppTheme) =>
  StyleSheet.create({
    testErrorButton: {
      position: 'absolute',
      bottom: 40,
      right: 80,
      zIndex: 10,
      backgroundColor: theme.primary,
    },
    darkModeButton: {
      position: 'absolute',
      bottom: 40,
      right: 20,
      zIndex: 10,
      backgroundColor: theme.primary,
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    glass: {
      width: '85%',
      maxWidth: 340,
      padding: 25,
      borderRadius: 30,
      borderWidth: 0.8,
      borderColor: theme.textSubtle,
      overflow: 'hidden',
      alignItems: 'center',
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      marginBottom: 20,
    },
    label: {
      alignSelf: 'flex-start',
      marginBottom: 5,
      fontWeight: '500',
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      textShadowColor: theme.surfaceGlass,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
    input: {
      width: '100%',
      backgroundColor: theme.inputBgSoft,
      borderRadius: 12,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.borderInput,
      color: theme.textInput,
    },
    error: {
      color: theme.errorText,
      marginTop: 10,
      fontWeight: 'bold',
    },
  });

export default createLoginStyles;
