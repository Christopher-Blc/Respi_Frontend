import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

const createModalDarkModeStyles = (theme: AppTheme, isWeb: boolean) => {
  const previewHeight = isWeb ? 240 : 205;

  return StyleSheet.create({
    headerContainer: {
      width: '100%',
      backgroundColor: theme.backgroundCard,
      paddingTop: 24,
      paddingBottom: 8,
    },
    headerRow: {
      width: '88%',
      maxWidth: 410,
      alignSelf: 'center',
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
    previewSection: {
      width: '100%',
      backgroundColor: theme.backgroundCard,
    },
    previewRow: {
      flexDirection: 'row',
      gap: 14,
      paddingTop: 10,
      paddingBottom: 10,
      width: '88%',
      backgroundColor: theme.backgroundCard,
      maxWidth: 410,
      alignSelf: 'center',
    },
    previewCard: {
      flex: 1,
      borderRadius: 14,
      overflow: 'hidden',
      backgroundColor: theme.surface,
      borderColor: theme.borderSoft,
      borderWidth: 1,
    },
    previewCardSelected: {
      borderColor: theme.primary,
      borderWidth: 2,
    },
    previewImage: {
      width: '100%',
      height: previewHeight,
      backgroundColor: theme.backgroundCard,
    },
    previewLabel: {
      paddingVertical: 8,
      textAlign: 'center',
      fontWeight: '700',
      color: theme.textTitle,
      fontSize: 12,
    },
    settingsSection: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.backgroundCard,
      paddingTop: 6,
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
    },
    description: {
      fontSize: 14,
      marginBottom: 18,
      color: theme.textBody,
    },
    toggleGroup: {
      gap: 14,
    },
    paletteSection: {
      marginTop: 20,
      gap: 10,
    },
    paletteTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textTitle,
    },
    paletteRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    paletteChip: {
      minWidth: '48%',
      flexGrow: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      paddingVertical: 8,
      paddingHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.backgroundCard,
    },
    paletteChipSelected: {
      borderColor: theme.primary,
      borderWidth: 2,
      backgroundColor: theme.primarySoft,
    },
    paletteDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },
    paletteChipLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.textTitle,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    disabledPreview: {
      opacity: 0.45,
    },
    toggleLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.textTitle,
    },
  });
};

export default createModalDarkModeStyles;
