import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../../i18n';
import api from '../../../../services/api';
import { Reservation } from '../../../../types/types';
import { API_PUBLIC_URL } from '../../../../constants';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMADA: '#22c55e',
  PENDIENTE: '#f59e0b',
  CANCELADA: '#ef4444',
  FINALIZADA: '#6b7280',
};

export default function ReservationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const headerHeight = useHeaderHeight();
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/reservations/${id}`)
      .then((res) => setReservation(res?.data ?? null))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const imagePath =
    reservation?.CourtType?.image ?? reservation?.court?.courtType?.image;
  const imageSource = imagePath
    ? {
        uri: imagePath.startsWith('http')
          ? imagePath
          : API_PUBLIC_URL + '/' + String(imagePath).replace(/^\//, ''),
      }
    : require('../../../../../assets/RespiLogo.png');

  const courtName = reservation?.court?.name ?? t('homeReservationFallback');
  const courtType =
    reservation?.CourtType?.name ?? reservation?.court?.courtType?.name ?? '';
  const date = reservation
    ? new Date(reservation.reservation_date).toLocaleDateString(locale, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';
  const time = reservation
    ? reservation.start_time.slice(0, 5) +
      ' – ' +
      reservation.end_time.slice(0, 5)
    : '';
  const statusColor = STATUS_COLOR[reservation?.status ?? ''] ?? theme.primary;

  const rows: { icon: string; label: string; value: string }[] = reservation
    ? [
        {
          icon: 'calendar-outline',
          label: t('reservationCardStart'),
          value: date,
        },
        {
          icon: 'time-outline',
          label: t('bookingTabAvailabilityToday'),
          value: time,
        },
        {
          icon: 'cash-outline',
          label: t('bookingTabPricePerHour', { price: '' }).trim(),
          value: reservation.total_price ? `${reservation.total_price} €` : '-',
        },
        ...(reservation.note
          ? [
              {
                icon: 'document-text-outline',
                label: t('reservationCardNote', { value: '' }).trim(),
                value: reservation.note,
              },
            ]
          : []),
      ]
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: headerHeight + 40 }}
        />
      ) : error || !reservation ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={theme.textMuted}
          />
          <Text style={{ color: theme.textMuted, fontSize: 15 }}>
            {t('commonError')}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Hero */}
          <ImageBackground
            source={imageSource}
            style={{ width: '100%', height: 240 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.75)']}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                gap: 6,
              }}
            >
              {!!courtType && (
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: 13,
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {courtType}
                </Text>
              )}
              <Text
                style={{
                  color: '#fff',
                  fontSize: 26,
                  fontWeight: '900',
                  textShadowColor: 'rgba(0,0,0,0.5)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 6,
                }}
              >
                {courtName}
              </Text>
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: statusColor + '33',
                  borderWidth: 1,
                  borderColor: statusColor,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: statusColor,
                    fontSize: 11,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {reservation.status}
                </Text>
              </View>
            </View>
          </ImageBackground>

          {/* Details */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 12 }}>
            {rows.map((row) => (
              <View
                key={row.icon}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: 14,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: theme.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.borderSoft,
                }}
              >
                <Ionicons
                  name={row.icon as any}
                  size={20}
                  color={theme.primary}
                />
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      color: theme.textMuted,
                      fontSize: 11,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {row.label}
                  </Text>
                  <Text
                    style={{
                      color: theme.textTitle,
                      fontSize: 15,
                      fontWeight: '700',
                    }}
                  >
                    {row.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
