import { Platform, StyleSheet } from 'react-native';
import { AppTheme } from '../../theme';

const createMembresiaModalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundCard,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 8,
      backgroundColor: theme.backgroundCard,
    },
    body: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: Platform.OS === 'web' ? 36 : 24,
      gap: 14,
    },
    introCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      padding: 16,
    },
    introTitle: {
      fontSize: 21,
      fontWeight: '800',
      color: theme.textTitle,
      marginBottom: 8,
    },
    introText: {
      fontSize: 14,
      lineHeight: 21,
      color: theme.textBody,
    },
    membershipCard: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      padding: 16,
      overflow: 'hidden',
    },
    membershipAccentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: 5,
    },
    membershipShine: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 45,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    tipo: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.textTitle,
    },
    badge: {
      backgroundColor: theme.primarySoft,
      borderColor: theme.borderAccentSoft,
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    badgeText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '800',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    value: {
      color: theme.textTitle,
      fontSize: 14,
      fontWeight: '700',
    },
    benefitsLabel: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 4,
    },
    benefits: {
      color: theme.textBody,
      fontSize: 14,
      lineHeight: 20,
    },
    centerState: {
      backgroundColor: theme.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.borderSoft,
      paddingVertical: 22,
      alignItems: 'center',
    },
    stateText: {
      color: theme.textBody,
      fontSize: 14,
      fontWeight: '600',
    },
    retry: {
      marginTop: 12,
      backgroundColor: theme.primary,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    retryText: {
      color: theme.onPrimary,
      fontWeight: '700',
    },
  });

export default createMembresiaModalStyles;
