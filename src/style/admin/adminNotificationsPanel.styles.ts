import { StyleSheet } from 'react-native';

const createAdminNotificationsPanelStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
      marginVertical: 12,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.primarySoft,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: '700',
    },
    filtersContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.primarySoft,
      gap: 8,
    },
    filterButton: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-start',
    },
    typeChipsContainer: {
      gap: 6,
    },
    typeChip: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 5,
      alignSelf: 'flex-start',
    },
    listContent: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 8,
      minHeight: 60,
    },
    notificationCard: {
      flexDirection: 'row',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderLeftWidth: 4,
      alignItems: 'center',
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 13,
      marginBottom: 4,
    },
    notificationBody: {
      fontSize: 12,
      marginBottom: 6,
      lineHeight: 16,
    },
    notificationFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    notificationType: {
      fontSize: 10,
      fontWeight: '700',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      borderWidth: 1,
      overflow: 'hidden',
    },
    notificationDate: {
      fontSize: 10,
    },
    unreadBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 8,
    },
    loadingContainer: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: '600',
    },
    emptySubtitle: {
      fontSize: 12,
      marginTop: 4,
    },
    paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      gap: 12,
      borderTopWidth: 1,
    },
  });

export default createAdminNotificationsPanelStyles;
