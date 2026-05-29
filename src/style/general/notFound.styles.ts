import { Platform, StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createNotFoundStyles = (theme: AppTheme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    glass: {
      width: '85%',
      maxWidth: 400,
      padding: 40,
      borderRadius: 30,
      borderWidth: 0.8,
      borderColor: theme.borderGlass,
      alignItems: 'center',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        },
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    errorCode: {
      fontSize: 80,
      fontWeight: '900',
      color: theme.primary,
      opacity: 0.8,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: 10,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      textShadowColor: theme.surfaceGlass,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
  });

export default createNotFoundStyles;
