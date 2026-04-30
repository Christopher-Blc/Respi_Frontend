import { useState, useMemo } from 'react';
import { Pista } from '../types/types';

export function useCourtFilters(pistas: Pista[], searchQuery: string) {
  const [filterTipoPistaId, setFilterTipoPistaId] = useState<number | null>(null);
  const [filterPrecioMax, setFilterPrecioMax] = useState('');
  const [filterEstado, setFilterEstado] = useState<
    'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA' | null
  >(null);

  const filteredPistas = useMemo(() => {
    const seen = new Set<string>();
    const uniquePistas = pistas.filter((p) => {
      const key = (p.nombre || '').trim().toLowerCase();
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const query = searchQuery.trim().toLowerCase();
    const precioMax = filterPrecioMax.trim().replace(',', '.');
    const maxPrice = precioMax.length > 0 ? parseFloat(precioMax) : null;

    return uniquePistas.filter((p) => {
      const matchesSearch =
        !query ||
        (p.nombre || '').toLowerCase().includes(query) ||
        (p.instalacion?.nombre || '').toLowerCase().includes(query);
      const matchesTipo =
        filterTipoPistaId === null || Number(p.tipo_pista_id) === filterTipoPistaId;
      const matchesPrecio =
        maxPrice === null || isNaN(maxPrice) || parseFloat(p.precio_hora) <= maxPrice;
      const matchesEstado = filterEstado === null || p.estado === filterEstado;
      const isNotInactiva = p.estado !== 'INACTIVA';
      return matchesSearch && matchesTipo && matchesPrecio && matchesEstado && isNotInactiva;
    });
  }, [pistas, searchQuery, filterTipoPistaId, filterPrecioMax, filterEstado]);

  return {
    filterTipoPistaId,
    setFilterTipoPistaId,
    filterPrecioMax,
    setFilterPrecioMax,
    filterEstado,
    setFilterEstado,
    filteredPistas,
  };
}
