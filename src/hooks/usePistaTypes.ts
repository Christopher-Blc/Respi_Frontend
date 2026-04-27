import { useEffect, useState } from 'react';
import api from '../services/api';
import { TipoPista } from '../types/types';

const fallbackDescription = (nombre: string) =>
  `Reserva tu pista de ${String(nombre || '').toLowerCase()} de forma rapida y sencilla.`;

export function usePistaTypes() {
  const [modelos, setModelos] = useState<TipoPista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTipos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tipo_pista');
        if (!mounted) return;
        setModelos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        if (!mounted) return;
        console.error('Error:', error);
        setModelos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTipos();

    return () => {
      mounted = false;
    };
  }, []);

  const getCardDescription = (item: TipoPista) =>
    (item as any)?.descripcion || fallbackDescription(item.nombre || 'deporte');

  return {
    modelos,
    loading,
    getCardDescription,
  };
}
