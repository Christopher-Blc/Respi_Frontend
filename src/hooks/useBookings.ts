import { useCallback, useMemo, useState } from 'react';

export type Reserva = {
  id: string;
  codigo_reserva?: string;
  estado?: string;
  fecha_inicio: string; // ISO
  fecha_fin: string; // ISO
  nota?: string;
};

export function useReservas() {
  const [isLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>(() => [
    {
      id: '1',
      codigo_reserva: 'R-001',
      estado: 'PREPARADA',
      fecha_inicio: new Date(Date.now() + 86400000).toISOString(),
      fecha_fin: new Date(Date.now() + 2 * 86400000).toISOString(),
      nota: 'Traer raqueta',
    },
    {
      id: '2',
      codigo_reserva: 'R-002',
      estado: 'ENTREGADA',
      fecha_inicio: new Date(Date.now() + 3 * 86400000).toISOString(),
      fecha_fin: new Date(Date.now() + 4 * 86400000).toISOString(),
    },
  ]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular recarga
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleCancelReserva = useCallback((id: string) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: 'CANCELADA' } : r)),
    );
  }, []);

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
