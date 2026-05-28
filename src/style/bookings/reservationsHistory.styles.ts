import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createReservationsHistoryStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 8,
    },
    backBtn: { padding: 6 },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '800',
    },
    headerCount: {
      fontSize: 13,
      fontWeight: '700',
    },
    filtersRow: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexWrap: 'wrap',
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
    },
    filterText: {
      fontSize: 13,
      fontWeight: '700',
    },
    filterCount: {
      borderRadius: 999,
      paddingHorizontal: 6,
      paddingVertical: 1,
    },
    filterCountText: {
      fontSize: 11,
      fontWeight: '800',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 4,
      gap: 10,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
    },
    cardLeft: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusDot: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBody: {
      flex: 1,
      gap: 3,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    courtName: {
      fontSize: 15,
      fontWeight: '800',
      flex: 1,
    },
    courtType: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 2,
    },
    badge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: 9,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    metaText: {
      fontSize: 12,
      fontWeight: '500',
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    price: {
      fontSize: 15,
      fontWeight: '900',
    },
    paymentChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    paymentText: {
      fontSize: 11,
      fontWeight: '600',
    },
    chevron: {
      marginLeft: 2,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyWrap: {
      paddingTop: 60,
      alignItems: 'center',
      gap: 10,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '800',
    },
    emptySubtitle: {
      fontSize: 13,
      fontWeight: '500',
      textAlign: 'center',
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: 20,
      borderTopWidth: 1,
    },
    pageText: {
      fontSize: 14,
      fontWeight: '700',
    },
  });

export default createReservationsHistoryStyles;
