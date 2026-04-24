import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { reservasActivasFilter } from '../filtrosApi';
import { Reserva } from '../types/types';

export function useHome() {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservas = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get('/reserva/mis-reservas');
      const reservasActivas = reservasActivasFilter(response);
      setReservations(reservasActivas);
    } catch (error) {
      console.error('Error al traer mis reservas:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReservas(true);
    setRefreshing(false);
  }, [fetchReservas]);

  const nextReservationDate = useMemo(() => {
    if (!reservations.length) return 'Sin reservas';

    const sorted = [...reservations].sort(
      (a, b) =>
        new Date(a.fecha_reserva).getTime() -
        new Date(b.fecha_reserva).getTime(),
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
