import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';
import { Reservation } from '../../../types/types';
import ReservationDetailModal from '../../../components/bookings/ReservationDetailModal';
import { SessionExpiredModal } from '../../../components/alert.modal';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMADA: '#22c55e',
  PENDIENTE: '#f59e0b',
  CANCELADA: '#ef4444',
  FINALIZADA: '#6b7280',
};

const STATUS_ICON: Record<string, string> = {
  CONFIRMADA: 'checkmark-circle',
  PENDIENTE: 'time',
  CANCELADA: 'close-circle',
  FINALIZADA: 'flag',
};

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past', label: 'Pasadas' },
  { key: 'cancelled', label: 'Canceladas' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

function applyFilter(reservations: Reservation[], filter: FilterKey): Reservation[] {
  const now = Date.now();
  switch (filter) {
    case 'upcoming':
      return reservations.filter((r) => {
        if (r.status === 'CANCELADA' || r.status === 'FINALIZADA' || r.status === 'PENDIENTE') return false;
        const t = new Date(`${r.reservation_date}T${r.start_time.slice(0, 5)}:00`).getTime();
        return isNaN(t) || t >= now;
      });
    case 'past':
      return reservations.filter((r) => {
        if (r.status === 'CANCELADA' || r.status === 'PENDIENTE') return false;
        const t = new Date(`${r.reservation_date}T${r.start_time.slice(0, 5)}:00`).getTime();
        return !isNaN(t) && t < now;
      });
    case 'cancelled':
      return reservations.filter((r) => r.status === 'CANCELADA');
    default:
      return reservations.filter((r) => r.status !== 'PENDIENTE');
  }
}

export default function ReservationsHistory() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });
  const [allReservations, setAllReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 12;

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/reservations/my-reservations');
      const raw = res?.data;
      const data: Reservation[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : [];
      const sorted = [...data].sort((a, b) => {
        const ta = new Date(a.reservation_date).getTime();
        const tb = new Date(b.reservation_date).getTime();
        return tb - ta;
      });
      setAllReservations(sorted);
    } catch {
      setAllReservations([]);
      if (!silent) setAlertModal({ visible: true, title: 'Error', message: 'No se pudieron cargar las reservas. Inténtalo de nuevo.' });
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetch();
    }, [fetch]),
  );

  useEffect(() => {
    setPage(1);
  }, [filter, allReservations.length]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetch(true);
    setRefreshing(false);
  }, [fetch]);

  const handleCancel = useCallback(
    async (id: number) => {
      try {
        await api.put(`/reservations/${id}`, { status: 'CANCELADA' });
        await fetch(true);
      } catch {
        setAlertModal({ visible: true, title: 'Error', message: 'No se pudo cancelar la reserva. Inténtalo de nuevo.' });
      }
    },
    [fetch],
  );

  const filtered = useMemo(() => applyFilter(allReservations, filter), [allReservations, filter]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderItem = useCallback(
    ({ item }: { item: Reservation }) => {
      const statusColor = STATUS_COLOR[item.status] ?? theme.primary;
      const statusIcon = STATUS_ICON[item.status] ?? 'ellipse';
      const date = new Date(item.reservation_date).toLocaleDateString('es-ES', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const time = `${item.start_time.slice(0, 5)} – ${item.end_time.slice(0, 5)}`;
      const payment = item.payments?.[0];

      return (
        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.backgroundCard, borderColor: theme.borderSoft }]}
          onPress={() => setSelected(item)}
          activeOpacity={0.75}
        >
          <View style={styles.cardLeft}>
            <View style={[styles.statusDot, { backgroundColor: statusColor + '22', borderColor: statusColor }]}>
              <Ionicons name={statusIcon as any} size={16} color={statusColor} />
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardTopRow}>
              <Text style={[styles.courtName, { color: theme.textTitle }]} numberOfLines={1}>
                {item.court?.name ?? 'Pista'}
              </Text>
              <View style={[styles.badge, { backgroundColor: statusColor + '18', borderColor: statusColor }]}>
                <Text style={[styles.badgeText, { color: statusColor }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={[styles.courtType, { color: theme.textMuted }]}>
              {item.court?.courtType?.name ?? ''}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textBody }]}>{date}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={13} color={theme.textMuted} />
              <Text style={[styles.metaText, { color: theme.textBody }]}>{time}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={[styles.price, { color: theme.primary }]}>
                {item.total_price ? `${item.total_price} €` : '—'}
              </Text>
              {!!payment?.payment_status && (
                <View style={styles.paymentChip}>
                  <Ionicons
                    name={payment.payment_status === 'Reembolsado' ? 'refresh-circle-outline' : 'card-outline'}
                    size={11}
                    color={theme.textMuted}
                  />
                  <Text style={[styles.paymentText, { color: theme.textMuted }]}>
                    {payment.payment_status}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.textMuted} style={styles.chevron} />
        </TouchableOpacity>
      );
    },
    [theme],
  );

  const counts = useMemo(
    () => ({
      all: allReservations.length,
      upcoming: applyFilter(allReservations, 'upcoming').length,
      past: applyFilter(allReservations, 'past').length,
      cancelled: applyFilter(allReservations, 'cancelled').length,
    }),
    [allReservations],
  );

  return (
    <LinearGradient
      colors={[theme.profileGradientStart, theme.profileGradientMiddle, theme.profileGradientEnd]}
      style={StyleSheet.absoluteFill}
    >
      <ReservationDetailModal
        reservation={selected}
        onClose={() => setSelected(null)}
        onCancel={handleCancel}
      />
      <SessionExpiredModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="Entendido"
        onConfirm={() => setAlertModal({ visible: false, title: '', message: '' })}
      />

      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={[styles.header, { paddingLeft: insets.left + 8, paddingRight: insets.right + 16 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="chevron-back" size={26} color={theme.textTitle} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTitle }]}>Mis reservas</Text>
          <Text style={[styles.headerCount, { color: theme.textMuted }]}>{allReservations.length}</Text>
        </View>

        {/* Filtros */}
        <View style={styles.filtersRow}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.borderSoft,
                  },
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.filterText, { color: active ? theme.onPrimary : theme.textMuted }]}>
                  {f.label}
                </Text>
                <View style={[styles.filterCount, { backgroundColor: active ? 'rgba(255,255,255,0.25)' : theme.backgroundAlt }]}>
                  <Text style={[styles.filterCountText, { color: active ? theme.onPrimary : theme.textMuted }]}>
                    {counts[f.key]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <>
            <FlatList
              data={paged}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 100 : 80) },
              ]}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
              }
              ListEmptyComponent={
                <View style={styles.emptyWrap}>
                  <Ionicons name="calendar-clear-outline" size={52} color={theme.textMuted} />
                  <Text style={[styles.emptyTitle, { color: theme.textTitle }]}>Sin reservas</Text>
                  <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                    No tienes reservas en esta categoría
                  </Text>
                </View>
              }
            />

            {totalPages > 1 && (
              <View style={[styles.pagination, { borderTopColor: theme.borderSoft, backgroundColor: theme.backgroundCard }]}>
                <TouchableOpacity onPress={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  <Ionicons name="chevron-back" size={22} color={page === 1 ? theme.textMuted + '40' : theme.primary} />
                </TouchableOpacity>
                <Text style={[styles.pageText, { color: theme.textTitle }]}>{page} / {totalPages}</Text>
                <TouchableOpacity onPress={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  <Ionicons name="chevron-forward" size={22} color={page === totalPages ? theme.textMuted + '40' : theme.primary} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      gap: 8,
    },
    backBtn: { padding: 6 },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '800',
    },
    headerCount: {
      fontSize: 13,
      fontWeight: '700',
    },
    filtersRow: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 16,
      paddingBottom: 12,
      flexWrap: 'wrap',
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
    },
    filterText: {
      fontSize: 13,
      fontWeight: '700',
    },
    filterCount: {
      borderRadius: 999,
      paddingHorizontal: 6,
      paddingVertical: 1,
    },
    filterCountText: {
      fontSize: 11,
      fontWeight: '800',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingTop: 4,
      gap: 10,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      gap: 12,
    },
    cardLeft: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusDot: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBody: {
      flex: 1,
      gap: 3,
    },
    cardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    courtName: {
      fontSize: 15,
      fontWeight: '800',
      flex: 1,
    },
    courtType: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 2,
    },
    badge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: 9,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    metaText: {
      fontSize: 12,
      fontWeight: '500',
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    price: {
      fontSize: 15,
      fontWeight: '900',
    },
    paymentChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    paymentText: {
      fontSize: 11,
      fontWeight: '600',
    },
    chevron: {
      marginLeft: 2,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyWrap: {
      paddingTop: 60,
      alignItems: 'center',
      gap: 10,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '800',
    },
    emptySubtitle: {
      fontSize: 13,
      fontWeight: '500',
      textAlign: 'center',
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: 20,
      borderTopWidth: 1,
    },
    pageText: {
      fontSize: 14,
      fontWeight: '700',
    },
  });
