import { StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createCreateReviewModalStyles = (_theme: AppTheme) =>
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
      paddingHorizontal: 20,
      paddingBottom: 36,
    },
    handle: {
      alignSelf: 'center',
      width: 38,
      height: 4,
      borderRadius: 2,
      marginTop: 10,
      marginBottom: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 14,
      paddingBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
    },
    subtitle: {
      fontSize: 13,
      marginTop: 3,
    },
    starsSection: {
      marginBottom: 18,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 8,
    },
    starsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    ratingLabel: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: '700',
    },
    inputSection: {
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
    },
    textarea: {
      minHeight: 90,
      paddingTop: 12,
    },
    error: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 10,
    },
    submitBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 15,
      borderRadius: 14,
      marginTop: 4,
    },
    submitText: {
      fontSize: 15,
      fontWeight: '800',
    },
  });

export default createCreateReviewModalStyles;
