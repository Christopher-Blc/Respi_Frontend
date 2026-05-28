import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createCourtReviewsModalStyles = (_theme: AppTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.52)',
      justifyContent: 'flex-end',
    },
    backdropTouch: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      maxHeight: '86%',
      minHeight: 200,
    },
    handle: {
      alignSelf: 'center',
      width: 38,
      height: 4,
      borderRadius: 2,
      marginTop: 10,
      marginBottom: 2,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 16,
    },
    sheetTitle: {
      fontSize: 20,
      fontWeight: '800',
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    },
    summaryText: {
      fontSize: 13,
      fontWeight: '600',
    },
    ctaSection: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 16,
      borderTopWidth: 1,
    },
    ctaBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
    },
    ctaBtnText: {
      fontSize: 15,
      fontWeight: '800',
    },
    infoNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
    },
    infoNoteText: {
      fontSize: 13,
      fontWeight: '700',
      flex: 1,
    },
    lockedNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
    },
    lockedText: {
      fontSize: 13,
      fontWeight: '500',
      flex: 1,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      gap: 10,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '800',
    },
    emptySubtitle: {
      fontSize: 13,
      fontWeight: '500',
      textAlign: 'center',
    },
    list: {
      paddingHorizontal: 16,
      paddingBottom: 32,
      gap: 12,
      paddingTop: 6,
    },
    reviewItem: {
      borderRadius: 14,
      borderWidth: 1,
      padding: 14,
      gap: 8,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    reviewUser: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 4,
    },
    reviewDate: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
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
  });

export default createCourtReviewsModalStyles;
