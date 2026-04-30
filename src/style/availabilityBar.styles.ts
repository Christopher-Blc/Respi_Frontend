import { StyleSheet } from 'react-native';
import { AppTheme } from '../theme';

const createAvailabilityBarStyles = (theme: AppTheme) =>
  StyleSheet.create({
    ruleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    ruleText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.onPrimary,
    },
    barContainer: {
      flexDirection: 'row',
      height: 20,
      borderRadius: 999,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.borderGlass,
      backgroundColor: theme.surfaceGlass,
    },
    block: {
      height: '100%',
    },
    blockLibre: {
      backgroundColor: theme.availabilityFree,
    },
    blockOcupado: {
      backgroundColor: theme.availabilityBusy,
    },
    legendRow: {
      marginTop: 8,
      flexDirection: 'row',
      gap: 14,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },
    legendLibre: {
      backgroundColor: theme.availabilityFree,
    },
    legendOcupado: {
      backgroundColor: theme.availabilityBusy,
    },
    legendText: {
      color: theme.onPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
  });

export default createAvailabilityBarStyles;
