import React, { useMemo, useState } from 'react';
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
import { MODELOS } from '../../../data/modelos';
import { Reserva } from '../../../types/types';
import createReservationsStyles from '../../../style/reservations.styles';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useHome } from '../../../hooks/useHome';
import { createHomeStyles } from '../../../style/home.styles';
import DateModal from '../../../components/bookings/date.modal';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../i18n';

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

  const normalize = (value: string) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const getImageForReservation = (reservation: Reserva) => {
    const pista = reservation.pista as any;

    const typeId =
      String(
        pista?.tipo_pista_id ??
          pista?.tipoPistaId ??
          pista?.tipo_pista?.tipo_pista_id ??
          pista?.tipo_pista?.id ??
          '',
      ) || null;

    if (typeId) {
      const byId = MODELOS.find((m) => String(m.id) === typeId);
      if (byId) return byId.img;
    }

    const typeName = normalize(
      pista?.tipo_pista?.nombre || pista?.tipo || pista?.deporte || '',
    );
    if (typeName) {
      const byTypeName = MODELOS.find((m) =>
        typeName.includes(normalize(m.title)),
      );
      if (byTypeName) return byTypeName.img;
    }

    const title = normalize(pista?.nombre || '');
    const byTitle = MODELOS.find((m) => title.includes(normalize(m.title)));
    return byTitle ? byTitle.img : MODELOS[0].img;
  };

  const renderReservation = (item: Reserva) => {
    const title = item.pista?.nombre || t('homeReservationFallback');
    const img = getImageForReservation(item);
    const cleanDate = new Date(item.fecha_reserva).toLocaleDateString(locale, {
      day: '2-digit',
      month: 'short',
    });
    const cleanTime =
      item.hora_inicio.split(':').slice(0, 2).join(':') +
      ' - ' +
      item.hora_fin.split(':').slice(0, 2).join(':');

    return (
      <TouchableOpacity
        key={item.reserva_id}
        style={localStyles.card}
        onPress={() => router.push(`/(app)/(tabs)/bookings/${item.reserva_id}`)}
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
                <Text style={localStyles.statusText}>{item.estado}</Text>
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
              onPress={() => null}
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
              {reservations.map((item) => (
                <View
                  key={item.reserva_id}
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
        </ScrollView>
      )}

      <DateModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSave={function (selectedDate: Date): void {
          throw new Error('Function not implemented.');
        }}
      />
    </View>
  );
}
