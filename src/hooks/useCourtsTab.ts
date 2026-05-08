import { useEffect, useMemo, useState } from 'react';
import { API_PUBLIC_URL } from '../constants';
import api from '../services/api';
import { Court, CourtAvailability, CourtType } from '../types/types';
import { useTranslation } from 'react-i18next';
import { getTipoPistaImage } from '../utils/getImage';


export const resolvePistaImageSource = (pista: CourtAvailability) =>
  getTipoPistaImage(pista);

const resolvePistaCardImage = (
  pista: Court,
  tipos: CourtType[],
): { uri: string } | undefined => {
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

const getNext7Days = () => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const formatDateForAPI = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useCourtsTab() {
  const { t } = useTranslation();
  const [tipos, setTipos] = useState<CourtType[]>([]);
  const [pistas, setPistas] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Court | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingSportInfo, setLoadingSportInfo] = useState(false);
  const [sportError, setSportError] = useState<string | null>(null);
  const [sportType, setSportType] = useState<CourtType | null>(null);
  const [sportPistas, setSportPistas] = useState<CourtAvailability[]>([]);

  const availableDays = useMemo(() => getNext7Days(), []);
  const formattedDate = formatDateForAPI(selectedDate);

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [tiposRes, pistasRes] = await Promise.all([
          api.get( '/court-types'),
          api.get('/Court'),
        ]);
        if (mounted && Array.isArray(tiposRes.data)) {
          setTipos(tiposRes.data as CourtType[]);
        }
        if (mounted && Array.isArray(pistasRes.data)) {
          setPistas(pistasRes.data as Court[]);
        }
      } catch (error) {
        console.error('Error al cargar tipos de pista', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedModel) {
      setSportType(null);
      setSportPistas([]);
      setSportError(null);
      return;
    }

    let mounted = true;

    const fetchSportInfo = async () => {
      try {
        setLoadingSportInfo(true);
        setSportError(null);

        const [disponibilidadRes, pistasRes] = await Promise.allSettled([
          api.get(`/Court/disponibilidad?fecha=${formattedDate}`),
          api.get('/Court'),
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

        const selectedType =
          tipos.find(
            (tipo) =>
              String(tipo.id) === String(selectedModel.court_type_id),
          ) ?? null;

        const fullMap = new Map<string, Court>();
        for (const pista of pistasPayload) {
          const id = String(pista.id ?? '');
          if (id) fullMap.set(id, pista);
        }

        const filtered = disponibilidadPayload.filter(
          (pista) =>
            String(pista.court_type_id) === String(selectedModel.court_type_id),
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

        if (!mounted) return;
        setSportType(selectedType);
        setSportPistas(merged);
      } catch (error) {
        if (!mounted) return;
        console.error('Error al cargar detalles del deporte', error);
        setSportError(t('authConnectionError'));
        setSportPistas([]);
      } finally {
        if (mounted) setLoadingSportInfo(false);
      }
    };

    fetchSportInfo();

    return () => {
      mounted = false;
    };
  }, [formattedDate, selectedModel, tipos, t]);

  const clearSportFilter = () => {
    setSelectedModel(null);
    setSelectedDate(new Date());
  };

  return {
    loading,
    displayedModelos,
    resolveModelImage: (pista: Court) => resolvePistaCardImage(pista, tipos),
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
  };
}
