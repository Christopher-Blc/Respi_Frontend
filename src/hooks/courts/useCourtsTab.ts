import { useCallback, useEffect, useMemo, useState } from 'react';
import { API_PUBLIC_URL } from '../../constants';
import api from '../../services/api';
import { Court, CourtAvailability, CourtType } from '../../types/types';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD:src/hooks/courts/useCourtsTab.ts
import { getTipoPistaImage } from '../../utils/getImage';
=======
import { getTipoPistaImage } from '../utils/getImage';
import { getNext7Days, formatDateForAPI } from '../utils/bookingUtils';
>>>>>>> 45064c4666ee7aca8c60e8eb4c2e15eb645486a0:src/hooks/useCourtsTab.ts


export const resolvePistaImageSource = (pista: CourtAvailability) =>
  getTipoPistaImage(pista);

const resolvePistaCardImage = (
  pista: Court,
  tipos: CourtType[],
): { uri: string } | undefined => {
  if (pista.image) {
    return {
      uri: `${API_PUBLIC_URL}${pista.image.startsWith('/') ? '' : '/'}${pista.image}`,
    };
  }

  const tipo = tipos.find(
    (item) => String(item.id) === String(pista.court_type_id),
  );
  if (!tipo?.image) return undefined;
  return {
    uri: `${API_PUBLIC_URL}${tipo.image.startsWith('/') ? '' : '/'}${tipo.image}`,
  };
};

export const formatPrice = (price: number, locale = 'es-ES') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);


export const formatDateDisplay = (date: Date, locale = 'es-ES') =>
  date.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });


export function useCourtsTab() {
  const { t } = useTranslation();
  const [tipos, setTipos] = useState<CourtType[]>([]);
  const [pistas, setPistas] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<CourtType | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingSportInfo, setLoadingSportInfo] = useState(false);
  const [sportError, setSportError] = useState<string | null>(null);
  const [sportType, setSportType] = useState<CourtType | null>(null);
  const [sportPistas, setSportPistas] = useState<CourtAvailability[]>([]);

  const availableDays = useMemo(() => getNext7Days(), []);
  const formattedDate = formatDateForAPI(selectedDate);

  const refreshCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const [tiposRes, pistasRes] = await Promise.all([
        api.get('/court-types'),
        api.get('/courts'),
      ]);

      setTipos(Array.isArray(tiposRes.data) ? (tiposRes.data as CourtType[]) : []);
      setPistas(Array.isArray(pistasRes.data) ? (pistasRes.data as Court[]) : []);
    } catch (error) {
      console.error('Error al cargar tipos de pista', error);
      setTipos([]);
      setPistas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const displayedModelos = useMemo<Court[]>(
    () => {
      const grouped = new Map<string, Court>();
      for (const pista of pistas) {
        const key = String(pista.court_type_id ?? '');
        if (key && !grouped.has(key)) {
          grouped.set(key, pista);
        }
      }
      return Array.from(grouped.values());
    },
    [pistas],
  );

  const getModelImagePath = (model: CourtType): string | undefined => {
    const matchingCourt = pistas.find(
      (pista) =>
        String(pista.court_type_id) === String(model.id) &&
        Boolean(pista.image),
    );

    return matchingCourt?.image || model.image;
  };

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const refreshSportInfo = useCallback(async () => {
    if (!selectedModel) {
      setSportType(null);
      setSportPistas([]);
      setSportError(null);
      return;
    }

    try {
      setLoadingSportInfo(true);
      setSportError(null);

      const [disponibilidadRes, pistasRes] = await Promise.allSettled([
        api.get(`/courts/availability?date=${formattedDate}`),
        api.get('/courts'),
      ]);

      const disponibilidadPayload =
        disponibilidadRes.status === 'fulfilled' &&
        Array.isArray(disponibilidadRes.value?.data)
          ? (disponibilidadRes.value.data as CourtAvailability[])
          : [];

      const pistasPayload =
        pistasRes.status === 'fulfilled' &&
        Array.isArray(pistasRes.value?.data)
          ? (pistasRes.value.data as Court[])
          : [];

      const fullMap = new Map<string, Court>();
      for (const pista of pistasPayload) {
        const id = String(pista.id ?? '');
        if (id) fullMap.set(id, pista);
      }

      const filtered = disponibilidadPayload.filter(
        (pista) => String(pista.court_type_id) === String(selectedModel.id),
      );

      const merged = filtered.map((pista) => {
        const id = String(pista.id ?? '');
        const full = fullMap.get(id);
        return {
          ...full,
          ...pista,
          description: pista.description || full?.description,
          capacity: pista.capacity ?? full?.capacity,
          is_covered: pista.is_covered ?? full?.is_covered,
          has_lighting: pista.has_lighting ?? full?.has_lighting,
          status: pista.status || full?.status,
          price_per_hour: pista.price_per_hour ?? full?.price_per_hour,
        } as CourtAvailability;
      });

      setSportType(selectedModel);
      setSportPistas(merged);
    } catch (error) {
      console.error('Error al cargar detalles del deporte', error);
      setSportError(t('authConnectionError'));
      setSportPistas([]);
    } finally {
      setLoadingSportInfo(false);
    }
  }, [formattedDate, selectedModel, t]);

  useEffect(() => {
    refreshSportInfo();
  }, [refreshSportInfo]);

  const refresh = useCallback(async () => {
    await refreshCatalog();
    await refreshSportInfo();
  }, [refreshCatalog, refreshSportInfo]);

  const clearSportFilter = () => {
    setSelectedModel(null);
    setSelectedDate(new Date());
  };

  return {
    loading,
    refresh,
    tipos,
    selectedModel,
    setSelectedModel,
    selectedDate,
    setSelectedDate,
    loadingSportInfo,
    sportError,
    sportType,
    sportPistas,
    availableDays,
    formattedDate,
    clearSportFilter,
    getModelImagePath,
  };
}
