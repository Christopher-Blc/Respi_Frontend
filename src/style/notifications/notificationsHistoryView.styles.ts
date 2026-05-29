import { StyleSheet } from 'react-native';

const createNotificationsHistoryStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    customHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    listHeaderWrap: {
      marginBottom: 12,
      gap: 10,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
    },
    typeFilterRow: {
      flexDirection: 'row',
      gap: 6,
      flexWrap: 'wrap',
    },
    typeChip: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignSelf: 'flex-start',
    },
    notificationCard: {
      flexDirection: 'row',
      borderRadius: 12,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderLeftWidth: 4,
      alignItems: 'center',
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      marginBottom: 6,
    },
    notificationBody: {
      fontSize: 14,
      marginBottom: 6,
      lineHeight: 20,
    },
    notificationDate: {
      fontSize: 12,
    },
    unreadBadge: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: 12,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

export default createNotificationsHistoryStyles;
