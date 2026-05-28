import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createDateModalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderMain,
      backgroundColor: theme.backgroundMain,
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textBody,
    },
    saveText: {
      color: theme.primary,
      fontWeight: '700',
    },
    container: {
      flex: 1,
      backgroundColor: theme.backgroundMain,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    datePickerContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default createDateModalStyles;
