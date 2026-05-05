import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

export type ReservaActual = {
  inicio: string;
  fin: string;
};

export type TipoPistaDisponibilidad = {
  imagen?: string;
};

export type PistaDisponibilidad = {
  pista_id: number;
  nombre: string;
  hora_apertura: string;
  hora_cierre: string;
  estado?: string;
  tipo_pista?: TipoPistaDisponibilidad;
  reservas_actuales: ReservaActual[];
  precio_hora?: string | number;
  cubierta?: boolean;
  iluminacion?: boolean;
};

const isDisponible = (value?: string) =>
  String(value || '')
    .trim()
    .toUpperCase() === 'DISPONIBLE';

export function useAvailableBookings(fecha: string) {
  const [pistas, setPistas] = useState<PistaDisponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPistasDisponibles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/Court/disponibilidad?fecha=${fecha}`);
      const payload = response?.data;
      console.log('Disponibilidad de pistas:', payload);
      console.log('Fecha solicitada:', fecha);

      const disponibles = Array.isArray(payload)
        ? payload.filter((pista: PistaDisponibilidad) =>
            isDisponible((pista as any)?.estado),
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
