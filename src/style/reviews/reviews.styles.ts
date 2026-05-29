import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createReviewsStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { paddingHorizontal: 16, gap: 12 },
    pageTitle: {
      fontSize: 26,
      fontWeight: '900',
      marginBottom: 4,
    },
    // Review card
    card: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      gap: 10,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    courtName: {
      fontSize: 15,
      fontWeight: '800',
    },
    courtType: {
      fontSize: 12,
      marginTop: 2,
    },
    statusBadge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    dateText: {
      fontSize: 12,
      fontWeight: '500',
    },
    reviewTitle: {
      fontSize: 14,
      fontWeight: '700',
    },
    reviewText: {
      fontSize: 13,
      lineHeight: 19,
    },
    adminReply: {
      borderRadius: 10,
      borderWidth: 1,
      padding: 10,
      gap: 4,
    },
    adminReplyLabel: {
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    adminReplyText: {
      fontSize: 13,
      lineHeight: 18,
    },
    // Edit inline
    editSection: { gap: 10 },
    editInput: {
      borderWidth: 1.5,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      minHeight: 90,
    },
    editActions: { flexDirection: 'row', gap: 10 },
    editBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editBtnCancel: { borderWidth: 1, backgroundColor: 'transparent' },
    editBtnSave: {},
    editBtnText: { fontSize: 14, fontWeight: '700' },
    editTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
    },
    editTriggerText: { fontSize: 12, fontWeight: '600' },
    // Empty state
    emptyState: {
      paddingTop: 60,
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
    },
    emptyTitle: { fontSize: 18, fontWeight: '800' },
    emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
    // Create section (feature users only)
    createCard: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      marginBottom: 20,
    },
    createTitle: { fontSize: 20, fontWeight: '800', marginBottom: 14 },
    createLabel: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
    chipsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 14,
    },
    chip: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    noCourtText: { fontSize: 13, marginBottom: 14 },
    createInput: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      marginBottom: 14,
    },
    createTextarea: { minHeight: 90, paddingTop: 12 },
    createBtn: {
      height: 46,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createBtnText: { fontSize: 15, fontWeight: '800' },
  });

export default createReviewsStyles;
