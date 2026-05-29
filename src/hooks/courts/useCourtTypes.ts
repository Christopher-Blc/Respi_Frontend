import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Court, CourtType } from '../../types/types';
import { useTranslation } from 'react-i18next';

export type CourtTypeListItem = CourtType & { previewImage?: string };

export function useCourtTypes() {
  const { t } = useTranslation();
  const [modelos, setModelos] = useState<CourtTypeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTipos = async () => {
      try {
        setLoading(true);
        const [typesResponse, courtsResponse] = await Promise.all([
          api.get('/court-types'),
          api.get('/courts').catch(() => ({ data: [] })),
        ]);

        if (!mounted) return;

        const types = Array.isArray(typesResponse.data)
          ? (typesResponse.data as CourtType[])
          : [];
        const courts = Array.isArray(courtsResponse.data)
          ? (courtsResponse.data as Court[])
          : [];

        const tiposConPreview = types.map((type) => {
          const matchingCourt = courts.find(
            (court) =>
              String(court.court_type_id) === String(type.id) &&
              Boolean(court.image),
          );

          return {
            ...type,
            previewImage: matchingCourt?.image,
          };
        });

        setModelos(tiposConPreview);
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
