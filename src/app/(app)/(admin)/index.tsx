import React from 'react';
import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../../style/admin/home.styles';
import { useProfile } from '../../../hooks/useProfile';
import { useTranslation } from 'react-i18next';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';

export default function AdminManagementScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const profileState = useProfile();
  const { user, refreshProfile } = profileState;
  const { refreshing, onRefresh } = usePullToRefresh(refreshProfile);

  const horizontalPadding = width >= 1280 ? 40 : width >= 768 ? 28 : 20;
  const gridGap = 16;
  const maxPaddingWidth = 1400;
  const contentWidth = width > maxPaddingWidth ? maxPaddingWidth : width;
  const availableGridWidth = Math.max(contentWidth - horizontalPadding * 2, 0);

  // Responsive columns: 1 mobile, 2 tablet, 3 desktop
  let columnsCount = 1;
  if (width >= 1024) columnsCount = 3;
  else if (width >= 768) columnsCount = 2;

  const columnWidth =
    (availableGridWidth - gridGap * (columnsCount - 1)) / columnsCount;
  const cardFlexBasis = columnWidth;

  const adminOptions = [
    {
      title: t('adminHomeCourtsTitle'),
      subtitle: t('adminHomeCourtsSubtitle'),
      icon: 'stadium-variant',
      route: '/(admin)/(management)/courts',
      color: '#4CAF50',
      cta: t('adminHomeCourtsCta'),
    },
    {
      title: t('adminHomeInstallationsTitle'),
      subtitle: t('adminHomeInstallationsSubtitle'),
      icon: 'office-building-marker-outline',
      route: '/(admin)/(management)/installations',
      color: '#2E7D32',
      cta: t('adminHomeInstallationsCta'),
    },
    {
      title: t('adminHomeCourtTypesTitle'),
      subtitle: t('adminHomeCourtTypesSubtitle'),
      icon: 'shape',
      route: '/(admin)/(management)/court-types',
      color: '#00BCD4',
      cta: t('adminHomeCourtTypesCta'),
    },
    {
      title: t('adminHomeUsersTitle'),
      subtitle: t('adminHomeUsersSubtitle'),
      icon: 'account-group',
      route: '/(admin)/(management)/users',
      color: '#2196F3',
      cta: t('adminHomeUsersCta'),
    },
    {
      title: t('adminHomeBookingsTitle'),
      subtitle: t('adminHomeBookingsSubtitle'),
      icon: 'calendar-check',
      route: '/(admin)/(management)/reservations',
      color: '#FF9800',
      cta: t('adminHomeBookingsCta'),
    },
    {
      title: t('adminHomeValidateTitle'),
      subtitle: t('adminHomeValidateSubtitle'),
      icon: 'qrcode-scan',
      route: '/(app)/(admin)/(management)/validar-reserva',
      color: '#16A34A',
      cta: t('adminHomeValidateCta'),
    },
    {
      title: t('adminHomePaymentsTitle'),
      subtitle: t('adminHomePaymentsSubtitle'),
      icon: 'currency-eur',
      route: '/(admin)/(management)/pagos',
      color: '#E91E63',
      cta: t('adminHomePaymentsCta'),
    },
    {
      title: t('adminHomeMembershipsTitle'),
      subtitle: t('adminHomeMembershipsSubtitle'),
      icon: 'card-account-details',
      route: '/(admin)/(management)/membership',
      color: '#9C27B0',
      cta: t('adminHomeMembershipsCta'),
    },
    {
      title: t('adminHomeReviewsTitle'),
      subtitle: t('adminHomeReviewsSubtitle'),
      icon: 'star-circle',
      route: '/(admin)/(management)/reviews',
      color: '#FBC02D',
      cta: t('adminHomeReviewsCta'),
    },
    {
      title: t('adminHomeNotificationsTitle'),
      subtitle: t('adminHomeNotificationsSubtitle'),
      icon: 'bell-badge',
      route: '/(admin)/(management)/notifications',
      color: '#7C4DFF',
      cta: t('adminHomeNotificationsCta'),
    },
  ];

  const renderAdminCard = (item: (typeof adminOptions)[0]) => (
    <TouchableOpacity
      key={item.title}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderAccentSoft,
          flexBasis: cardFlexBasis,
          flexGrow: 1,
        },
      ]}
      activeOpacity={0.92}
      onPress={() => router.push(item.route as any)}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.color + '20',
              borderColor: item.color + '35',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={28}
            color={item.color}
          />
        </View>

        <View
          style={[styles.statusIndicator, { backgroundColor: item.color }]}
        />
      </View>

      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: theme.textTitle }]}>
          {item.title}
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSubtitle }]}>
          {item.subtitle}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.cardCta, { color: theme.primary }]}>
          {item.cta}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.primary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.pageContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 100 : 120),
          paddingHorizontal: horizontalPadding,
          width: '100%',
        }}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderAccentSoft,
            },
          ]}
        >
          <View
            style={[styles.heroTag, { borderColor: theme.borderAccentSoft }]}
          >
            <Text style={[styles.heroTagText, { color: theme.primary }]}>
              {t('adminHomePanel')}
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: theme.textTitle }]}>
            {t('adminHomeWelcome', { name: user?.username || '' })}
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSubtitle }]}>
            {t('adminHomeSubtitle')}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textTitle }]}>
            {t('adminHomeToolsTitle')}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSubtitle }]}>
            {t('adminHomeToolsSubtitle')}
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {adminOptions.map(renderAdminCard)}
          {columnsCount === 3 && adminOptions.length % 3 !== 0 && (
            <View style={{ flexBasis: cardFlexBasis, flexGrow: 1 }} />
          )}
          {columnsCount === 2 && adminOptions.length % 2 !== 0 && (
            <View style={{ flexBasis: cardFlexBasis, flexGrow: 1 }} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
