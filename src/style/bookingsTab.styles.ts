import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

const createReservasTabStyles = (theme: AppTheme) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    dateSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.05)',
      backgroundColor: 'transparent',
    },
    dateScrollContent: {
      paddingRight: 12,
    },
    dateButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    dateButtonSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    dateButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textPrimary,
      textTransform: 'capitalize',
    },
    dateButtonTextSelected: {
      color: theme.onPrimary,
    },
    calendarButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 24,
    },
    pistaCard: {
      marginBottom: 12,
      borderRadius: 14,
      overflow: 'hidden',
      minHeight: 270,
      borderWidth: 1,
      borderColor: theme.borderGlass,
    },
    pistaImageBg: {
      flex: 1,
      justifyContent: 'space-between',
    },
    pistaOverlay: {
      flex: 1,
      padding: 14,
      justifyContent: 'space-between',
    },
    pistaHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    pistaName: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.onPrimary,
      flex: 1,
    },
    priceBadge: {
      backgroundColor: theme.overlayDark,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    priceText: {
      color: theme.onPrimary,
      fontWeight: '600',
      fontSize: 12,
    },
    timelineContainer: {
      marginTop: 'auto',
    },
    timelineTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    horariosLabel: {
      color: theme.onPrimary,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    infoButton: {
      padding: 2,
    },
    infoModalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.overlayDark,
      paddingHorizontal: 16,
    },
    infoModalCard: {
      width: '100%',
      maxWidth: 420,
      borderRadius: 14,
      backgroundColor: theme.surface,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    infoModalTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.textTitle,
      marginBottom: 8,
    },
    infoModalBody: {
      fontSize: 14,
      color: theme.textBody,
      lineHeight: 20,
    },
    infoModalCloseBtn: {
      marginTop: 14,
      alignSelf: 'flex-end',
      backgroundColor: theme.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    infoModalCloseText: {
      color: theme.onPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    infoListTitle: {
      color: theme.textTitle,
      fontSize: 15,
      fontWeight: '800',
      marginBottom: 10,
      textAlign: 'center',
    },
    infoListEmpty: {
      color: theme.textBody,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
    infoListWrap: {
      gap: 8,
    },
    infoRangeChip: {
      borderWidth: 1,
      borderColor: theme.borderSoft,
      borderRadius: 10,
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    infoRangeText: {
      color: theme.textTitle,
      fontSize: 15,
      fontWeight: '700',
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginTop: 16,
      color: theme.textTitle,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.textSubtitle,
      marginTop: 8,
    },
  });

export default createReservasTabStyles;
