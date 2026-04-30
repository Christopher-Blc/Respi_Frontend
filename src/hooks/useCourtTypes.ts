import { useEffect, useState } from 'react';
import api from '../services/api';
import { TipoPista } from '../types/types';
import { useTranslation } from 'react-i18next';

export function useCourtTypes() {
  const { t } = useTranslation();
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
    (item as any)?.descripcion ||
    t('pistaTypesFallbackDescription', {
      sport: String(item.nombre || 'deporte').toLowerCase(),
    });

  return {
    modelos,
    loading,
    getCardDescription,
  };
}
