import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Reserva } from '../types/types';
import { JWTPayload } from '../types/types';

const extractReservas = (payload: any): Reserva[] => {
  if (Array.isArray(payload)) return payload as Reserva[];
  if (Array.isArray(payload?.data)) return payload.data as Reserva[];
  if (Array.isArray(payload?.items)) return payload.items as Reserva[];
  if (Array.isArray(payload?.rows)) return payload.rows as Reserva[];
  if (Array.isArray(payload?.reservas)) return payload.reservas as Reserva[];
  return [];
};

const normalizeState = (value: string | undefined) =>
  String(value || '')
    .trim()
    .toLowerCase();

const isUpcoming = (reserva: Reserva) => {
  const state = normalizeState(reserva.estado);
  if (state === 'cancelada' || state === 'finalizada') return false;

  const start = new Date(
    `${reserva.fecha_reserva}T${String(reserva.hora_inicio || '00:00').slice(0, 5)}:00`,
  );

  if (Number.isNaN(start.getTime())) return true;
  return start.getTime() >= Date.now();
};

const getReservaTimestamp = (reserva: Reserva) => {
  const start = new Date(
    `${reserva.fecha_reserva}T${String(reserva.hora_inicio || '00:00').slice(0, 5)}:00`,
  ).getTime();
  return Number.isNaN(start) ? Number.MAX_SAFE_INTEGER : start;
};

export function useHome() {
  const { userToken } = useAuth();
  const [reservations, setReservations] = useState<Reserva[]>([]);
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
        const response = await api.get('/reserva/mis-reservas');

        const allReservas = extractReservas(response?.data);

        const userScoped = allReservas.filter((reserva) => {
          if (!loggedUserId) return true;
          const ownerId =
            Number((reserva as any)?.usuario_id) ||
            Number((reserva as any)?.usuario?.usuario_id);

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

    return new Date(sorted[0].fecha_reserva).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
  }, [reservations]);

  const uniqueSportsCount = useMemo(() => {
    const unique = new Set(
      reservations
        .map((reservation) => reservation.pista?.nombre || '')
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
