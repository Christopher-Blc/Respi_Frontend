import { useCallback, useMemo, useState } from 'react';
import api from '../services/api';
import { Reservation } from '../types/types';

export function useReservas() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [reservas, setReservas] = useState<Reservation[]>([]);

  const fetchReservas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reservations/my-reservations');
      const payload = response?.data;
      const data: Reservation[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
      setReservas(data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReservas();
    setRefreshing(false);
  }, [fetchReservas]);

  const handleCancelReserva = useCallback(
    async (id: number) => {
      try {
        await api.put(`/reservations/${id}`, { status: 'CANCELADA' });
        // El backend procesa el reembolso automáticamente si la reserva estaba confirmada
        await fetchReservas();
      } catch (error) {
        console.error('Error al cancelar reserva:', error);
      }
    },
    [fetchReservas],
  );

  const formatDateEs = useCallback((iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }, []);

  return useMemo(
    () => ({
      isLoading,
      reservas,
      isRefreshing,
      handleRefresh,
      formatDateEs,
      handleCancelReserva,
    }),
    [
      isLoading,
      reservas,
      isRefreshing,
      handleRefresh,
      formatDateEs,
      handleCancelReserva,
    ],
  );
}
