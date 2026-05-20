import React, { useMemo, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Reservation } from '../../../types/types';
import createReservationsStyles from '../../../style/reservations.styles';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useHome } from '../../../hooks/useHome';
import { createHomeStyles } from '../../../style/home.styles';
import DateModal from '../../../components/bookings/date.modal';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../i18n';
import { getTipoPistaImage } from '../../../utils/getImage';

//pantalla home del cliente

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createReservationsStyles(theme), [theme]);
  const localStyles = useMemo(() => createHomeStyles(theme), [theme]);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const isWideScreen = width > 768;
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);
  const {
    reservations,
    loading,
    refreshing,
    onRefresh,
    nextReservationDate,
    uniqueSportsCount,
  } = useHome();

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [reservations.length]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(reservations.length / PAGE_SIZE) || 1;
  const pagedReservations = reservations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const normalize = (value: string) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const renderReservation = (item: Reservation) => {
    const title = item.court?.name || t('homeReservationFallback');
    const img = getTipoPistaImage(item);
    const cleanDate = new Date(item.reservation_date).toLocaleDateString(
      locale,
      {
        day: '2-digit',
        month: 'short',
      },
    );
    const cleanTime =
      item.start_time.split(':').slice(0, 2).join(':') +
      ' - ' +
      item.end_time.split(':').slice(0, 2).join(':');

    return (
      <TouchableOpacity
        key={item.id}
        style={localStyles.card}
        onPress={() => router.push(`/(app)/(tabs)/bookings/${item.id}`)}
      >
        <ImageBackground
          source={img}
          style={localStyles.cardBg}
          imageStyle={localStyles.cardImage}
        >
          <LinearGradient
            colors={[
              theme.reservationsCardOverlayStart,
              theme.reservationsCardOverlayEnd,
            ]}
            style={localStyles.cardOverlay}
          >
            <View style={localStyles.cardHeaderRow}>
              <Text style={localStyles.cardTitle}>{title}</Text>
              <View style={localStyles.statusBadge}>
                <Text style={localStyles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={localStyles.cardBottom}>
              <View>
                <Text style={localStyles.cardMeta}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={theme.onPrimary}
                  />{' '}
                  {cleanDate}
                </Text>
                <Text style={localStyles.cardMeta}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={theme.onPrimary}
                  />{' '}
                  {cleanTime}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={theme.onPrimary}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, localStyles.page]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: headerHeight + 24 }}
        />
      ) : (
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
            paddingTop: headerHeight + 14,
            paddingBottom: 110,
          }}
        >
          <View style={localStyles.heroCard}>
            <View style={localStyles.heroTopRow}>
              <Text style={localStyles.heroEyebrow}>
                {t('homeHeroEyebrow')}
              </Text>
              <View style={localStyles.livePill}>
                <View style={localStyles.liveDot} />
                <Text style={localStyles.liveText}>{t('homeOnline')}</Text>
              </View>
            </View>
            <Text style={localStyles.heroTitle}>{t('homeHeroTitle')}</Text>
            <Text style={localStyles.heroSubtitle}>
              {t('homeHeroSubtitle')}
            </Text>
          </View>

          <View style={localStyles.statsRow}>
            <View style={localStyles.statCard}>
              <Text style={localStyles.statValue}>{reservations.length}</Text>
              <Text style={localStyles.statLabel}>
                {t('homeActiveBookings')}
              </Text>
            </View>
            <View style={localStyles.statCard}>
              <Text style={localStyles.statValue}>{nextReservationDate}</Text>
              <Text style={localStyles.statLabel}>{t('homeNextBooking')}</Text>
            </View>
            <View style={localStyles.statCard}>
              <Text style={localStyles.statValue}>
                {uniqueSportsCount || '-'}
              </Text>
              <Text style={localStyles.statLabel}>{t('homeSportsInUse')}</Text>
            </View>
          </View>

          <View style={localStyles.actionsRow}>
            <TouchableOpacity
              style={[localStyles.actionCard, localStyles.actionPrimary]}
              onPress={() => router.push('/(app)/(tabs)/bookings/courtTypes')}
            >
              <Ionicons name="calendar" size={18} color={theme.onPrimary} />
              <Text style={localStyles.actionPrimaryText}>
                {t('homeNewBooking')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[localStyles.actionCard, localStyles.actionSecondary]}
              onPress={() => router.push('/courts')}
            >
              <Ionicons name="location" size={18} color={theme.primary} />
              <Text style={localStyles.actionSecondaryText}>
                {t('homeViewCourts')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={localStyles.sectionHeader}>
            <Text style={localStyles.sectionTitle}>
              {t('homeUpcomingBookings')}
            </Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text style={localStyles.sectionLink}>{t('homeRefresh')}</Text>
            </TouchableOpacity>
          </View>

          {reservations.length === 0 ? (
            <View style={localStyles.emptyCard}>
              <Ionicons
                name="calendar-clear-outline"
                size={24}
                color={theme.textMuted}
              />
              <Text style={localStyles.emptyTitle}>
                {t('homeNoUpcomingBookingsTitle')}
              </Text>
              <Text style={localStyles.emptySubtitle}>
                {t('homeNoUpcomingBookingsSubtitle')}
              </Text>
              <TouchableOpacity
                style={localStyles.emptyCta}
                onPress={() => router.push('/bookings')}
              >
                <Text style={localStyles.emptyCtaText}>{t('homeBookNow')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={localStyles.gridContainer}>
              {pagedReservations.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexBasis: isWideScreen ? 320 : '100%',
                    flexGrow: 1,
                  }}
                >
                  {renderReservation(item)}
                </View>
              ))}
            </View>
          )}
          {!loading && totalPages > 1 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: 16,
                gap: 16,
                backgroundColor: theme.backgroundCard,
                borderTopWidth: 1,
                borderTopColor: theme.primarySoft,
                marginTop: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={
                    currentPage === 1 ? theme.textBody + '40' : theme.primary
                  }
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: theme.textTitle,
                  fontWeight: '700',
                  fontSize: 14,
                }}
              >
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color={
                    currentPage === totalPages
                      ? theme.textBody + '40'
                      : theme.primary
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <DateModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSave={() => setDateModalVisible(false)}
        initialDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
        maximumDate={new Date()}
      />
    </View>
  );
}
