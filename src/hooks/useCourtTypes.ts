import { useEffect, useState } from 'react';
import api from '../services/api';
import { CourtType } from '../types/types';
import { useTranslation } from 'react-i18next';

export function useCourtTypes() {
  const { t } = useTranslation();
  const [modelos, setModelos] = useState<CourtType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTipos = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tipo_court');
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

  const getCardDescription = (item: CourtType) =>
    (item as any)?.description ||
    t('pistaTypesFallbackDescription', {
      sport: String(item.name || 'deporte').toLowerCase(),
    });

  return {
    modelos,
    loading,
    getCardDescription,
  };
}
