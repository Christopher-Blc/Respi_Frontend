import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { CourtAvailability } from '../types/types';

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

      const response = await api.get(`/courts/disponibilidad?fecha=${fecha}`);
      const payload = response?.data;
      console.log('Disponibilidad de pistas:', payload);
      console.log('Fecha solicitada:', fecha);

      const disponibles = Array.isArray(payload)
        ? payload.filter((pista: CourtAvailability) =>
            isDisponible((pista as any)?.status),
          )
        : [];

      setPistas(disponibles);
    } catch (err) {
      console.error('Error al cargar disponibilidad de pistas:', err);
      setError('No se pudo cargar la disponibilidad');
      setPistas([]);
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    if (!fecha) return;
    fetchPistasDisponibles();
  }, [fecha, fetchPistasDisponibles]);

  return { pistas, loading, error, refetch: fetchPistasDisponibles };
}
