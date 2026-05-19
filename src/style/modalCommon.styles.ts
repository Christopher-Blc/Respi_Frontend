import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

const createModalCommonStyles = (theme: AppTheme) => {
  return StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: 'transparent',
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 8,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      fontWeight: '500',
      color: theme.textTitle,
    },
    saveText: {
      color: theme.primary,
      fontWeight: '700',
    },
    settingsSection: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.backgroundCard,
      paddingHorizontal: 18,
      paddingTop: 40,
    },
    settingsCard: {
      width: '88%',
      maxWidth: 410,
      paddingHorizontal: 24,
      paddingVertical: 20,
      backgroundColor: theme.surface,
      borderRadius: 20,
      borderColor: theme.borderSoft,
      borderWidth: 1,
    },
    title: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: '700',
      color: theme.textTitle,
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    titleText: {
      fontSize: 19,
      color: theme.textTitle,
      fontFamily: 'Segoe UI',
      fontWeight: '700',
    },
    description: {
      fontSize: 14,
      marginBottom: 18,
      color: theme.textBody,
    },
    inputLabel: {
      color: theme.textBody,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 8,
    },
    inputCounter: {
      textAlign: 'right',
      color: theme.grayPlaceholder,
      fontSize: 12,
      marginBottom: 10,
    },
    optionRow: {
      borderWidth: 1,
      borderColor: theme.borderMain,
      backgroundColor: theme.backgroundCard,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    optionRowSelected: {
      borderColor: theme.primary,
      borderWidth: 2,
      backgroundColor: `${theme.primary}20`,
    },
    optionText: {
      color: theme.textTitle,
      fontWeight: '700',
    },
  });
};

export default createModalCommonStyles;
