import { useEffect, useState, useCallback } from 'react';
<<<<<<< HEAD:src/hooks/bookings/useAvailableBookings.ts
import api from '../../services/api';
import { CourtAvailability } from '../../types/types';
=======
import api from '../services/api';
import { CourtAvailability } from '../types/types';
>>>>>>> 45064c4666ee7aca8c60e8eb4c2e15eb645486a0:src/hooks/useAvailableBookings.ts

const isDisponible = (value?: string) =>
  String(value || '')
    .trim()
    .toUpperCase() === 'DISPONIBLE';

export function useAvailableBookings(fecha: string) {
  const [pistas, setPistas] = useState<CourtAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPistasDisponibles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/courts/availability?date=${fecha}`);
      const payload = response?.data;

      const disponibles = Array.isArray(payload)
        ? payload.filter((pista: CourtAvailability) =>
            isDisponible((pista as any)?.status),
          )
        : [];

      setPistas(disponibles);
    } catch (err) {
      if (__DEV__) {
        console.error('Error al cargar disponibilidad de pistas:', err);
      }
      setError('No se pudo cargar la disponibilidad');
      setPistas([]);
    }
  }, [fecha]);

  useEffect(() => {
    if (!fecha) return;
    fetchPistasDisponibles();
  }, [fecha, fetchPistasDisponibles]);

  return { pistas, loading, error, refetch: fetchPistasDisponibles };
}
