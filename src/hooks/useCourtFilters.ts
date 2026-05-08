import { useState, useMemo } from 'react';
import { Court } from '../types/types';

export function useCourtFilters(pistas: Court[], searchQuery: string) {
  const [filterTipoPistaId, setFilterTipoPistaId] = useState<number | null>(null);
  const [filterPrecioMax, setFilterPrecioMax] = useState('');
  const [filterEstado, setFilterEstado] = useState<
    'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA' | null
  >(null);

  const filteredPistas = useMemo(() => {
    const seen = new Set<string>();
    const uniquePistas = pistas.filter((p) => {
      const key = (p.name || '').trim().toLowerCase();
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
        (p.name || '').toLowerCase().includes(query) ||
        (p.installation?.name || '').toLowerCase().includes(query);
      const matchesTipo =
        filterTipoPistaId === null || Number(p.court_type_id) === filterTipoPistaId;
      const matchesPrecio =
        maxPrice === null || isNaN(maxPrice) || Number(p.price_per_hour) <= maxPrice;
      const matchesEstado = filterEstado === null || p.status === filterEstado;
      const isNotInactiva = p.status !== 'INACTIVA';
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
