import { StyleSheet } from 'react-native';

export const notificationsAdminStyles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  pageSubtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  multiline: {
    minHeight: 120,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyWrap: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  notificationCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationType: {
    fontSize: 12,
    fontWeight: '800',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  notificationMessage: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});
