import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Reservation, JWTPayload } from '../types/types';

const extractReservas = (payload: any): Reservation[] => {
  if (Array.isArray(payload)) return payload as Reservation[];
  if (Array.isArray(payload?.data)) return payload.data as Reservation[];
  if (Array.isArray(payload?.items)) return payload.items as Reservation[];
  if (Array.isArray(payload?.rows)) return payload.rows as Reservation[];
  if (Array.isArray(payload?.reservations)) return payload.reservations as Reservation[];
  return [];
};

const normalizeState = (value: string | undefined) =>
  String(value || '')
    .trim()
    .toLowerCase();

const isUpcoming = (reserva: Reservation) => {
  const state = normalizeState(reserva.status);
  if (state === 'cancelada' || state === 'finalizada') return false;

  const start = new Date(
    `${reserva.reservation_date}T${String(reserva.start_time || '00:00').slice(0, 5)}:00`,
  );

  if (Number.isNaN(start.getTime())) return true;
  return start.getTime() >= Date.now();
};

const getReservaTimestamp = (reserva: Reservation) => {
  const start = new Date(
    `${reserva.reservation_date}T${String(reserva.start_time || '00:00').slice(0, 5)}:00`,
  ).getTime();
  return Number.isNaN(start) ? Number.MAX_SAFE_INTEGER : start;
};

export function useHome() {
  const { userToken } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loggedUserId = useMemo(() => {
    if (!userToken) return null;
    try {
      const decoded = jwtDecode(userToken) as JWTPayload;
      return Number(decoded?.sub) || null;
    } catch {
      return null;
    }
  }, [userToken]);

  const fetchUserReservas = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const response = await api.get('/Reservation/mis-reservas');

        const allReservas = extractReservas(response?.data);

        const userScoped = allReservas.filter((reserva) => {
          if (!loggedUserId) return true;
          const ownerId =
            Number((reserva as any)?.user_id) ||
            Number((reserva as any)?.user?.id);

          // If backend doesn't include owner id for this row, keep it.
          if (!ownerId) return true;
          return ownerId === loggedUserId;
        });

        const upcoming = userScoped
          .filter(isUpcoming)
          .sort((a, b) => getReservaTimestamp(a) - getReservaTimestamp(b));

        setReservations(upcoming);
      } catch (error) {
        console.error('Error al traer mis reservas:', error);
        setReservations([]);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [loggedUserId],
  );

  useEffect(() => {
    fetchUserReservas();
  }, [fetchUserReservas]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserReservas(true);
    setRefreshing(false);
  }, [fetchUserReservas]);

  const nextReservationDate = useMemo(() => {
    if (!reservations.length) return 'Sin reservas';

    const sorted = [...reservations].sort(
      (a, b) => getReservaTimestamp(a) - getReservaTimestamp(b),
    );

    return new Date(sorted[0].reservation_date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  }, [reservations]);

  const uniqueSportsCount = useMemo(() => {
    const unique = new Set(
      reservations
        .map((reservation) => reservation.court?.name || '')
        .filter(Boolean),
    );
    return unique.size;
  }, [reservations]);

  return {
    reservations,
    loading,
    refreshing,
    onRefresh,
    nextReservationDate,
    uniqueSportsCount,
  };
}
