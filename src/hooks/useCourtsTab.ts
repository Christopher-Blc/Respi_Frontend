import { useEffect, useMemo, useState } from 'react';
import { MODELOS, Modelo } from '../data/modelos';
import { API_PUBLIC_URL } from '../constants';
import { bookingsService } from '../services/bookingsService';
import api from '../services/api';
import { PistaDisponibilidad, TipoPista } from '../types/types';
import { useTranslation } from 'react-i18next';
 
 


export const formatPrice = (price: number, locale = 'es-ES') =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);

export const resolveImageSource = (img: Modelo['img']) => {
  if (typeof img === 'number') return img;
  if (typeof img === 'string') {
    return img.startsWith('http')
      ? { uri: img }
      : { uri: `${API_PUBLIC_URL}/${img.replace(/^\//, '')}` };
  }

  return img;
};

export const resolvePistaImageSource = (
  pista: PistaDisponibilidad,
  fallbackModel?: Modelo | null,
) => {
  const candidate =
    pista?.tipo_pista?.imagen || fallbackModel?.img;

  if (typeof candidate === 'number') return candidate;
  if (typeof candidate === 'string') {
    return candidate.startsWith('http')
      ? { uri: candidate }
      : { uri: `${API_PUBLIC_URL}/${candidate.replace(/^\//, '')}` };
  }

  return fallbackModel?.img || MODELOS[0].img;
};

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

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getTypeIdCandidates = (item: PistaDisponibilidad): string =>
  String(item?.tipo_pista_id ?? '');

export function useCourtsTab() {
  const { t } = useTranslation();
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Modelo | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingSportInfo, setLoadingSportInfo] = useState(false);
  const [sportError, setSportError] = useState<string | null>(null);
  const [sportType, setSportType] = useState<TipoPista | null>(null);
  const [sportPistas, setSportPistas] = useState<PistaDisponibilidad[]>([]);

  const availableDays = useMemo(() => getNext7Days(), []);
  const formattedDate = formatDateForAPI(selectedDate);
  const displayedModelos = modelos.length ? modelos : MODELOS;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const remote = await bookingsService.getModelos();
        if (mounted) {
          setModelos(remote.length ? remote : MODELOS);
        }
      } catch (error) {
        if (mounted) {
          setModelos(MODELOS);
        }
        console.error('Error al cargar deportes', error);
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

        const [tiposRes, disponibilidadRes, pistasRes] =
          await Promise.allSettled([
            api.get('/tipo_court'),
            api.get(`/Court/disponibilidad?fecha=${formattedDate}`),
            api.get('/Court'),
          ]);

        const tiposPayload =
          tiposRes.status === 'fulfilled' && Array.isArray(tiposRes.value?.data)
            ? (tiposRes.value.data as TipoPista[])
            : [];

        const disponibilidadPayload =
          disponibilidadRes.status === 'fulfilled' &&
          Array.isArray(disponibilidadRes.value?.data)
            ? (disponibilidadRes.value.data as PistaDisponibilidad[])
            : [];

        const pistasPayload =
          pistasRes.status === 'fulfilled' &&
          Array.isArray(pistasRes.value?.data)
            ? (pistasRes.value.data as PistaDisponibilidad[])
            : [];

        const selectedType = tiposPayload.find((tipo) => {
          const typeId = String(tipo.tipo_pista_id ?? '');
          const typeName = normalizeText(tipo.nombre || '');
          return (
            typeId === String(selectedModel.id) ||
            typeName.includes(normalizeText(selectedModel.title))
          );
        });

        const fullMap = new Map<string, PistaDisponibilidad>();
        for (const pista of pistasPayload) {
          const id = String(pista.pista_id ?? '');
          if (id) fullMap.set(id, pista);
        }

        const filtered = disponibilidadPayload.filter((pista) => {
          const ids = getTypeIdCandidates(pista);
          const idMatch = ids.includes(String(selectedModel.id));
          const typeName = normalizeText(pista.tipo_pista?.nombre || '');
          const pistaName = normalizeText(pista.nombre || '');
          const title = normalizeText(selectedModel.title);
          return (
            idMatch || typeName.includes(title) || pistaName.includes(title)
          );
        });

        const merged = filtered.map((pista) => {
          const id = String(pista.pista_id ?? '');
          const full = fullMap.get(id);
          return {
            ...full,
            ...pista,
            descripcion: pista.descripcion || full?.descripcion,
            capacidad: pista.capacidad ?? full?.capacidad,
            cubierta: pista.cubierta ?? full?.cubierta,
            iluminacion: pista.iluminacion ?? full?.iluminacion,
            estado: pista.estado || full?.estado,
            precio_hora: pista.precio_hora ?? full?.precio_hora,
          } as PistaDisponibilidad;
        });

        if (!mounted) return;
        setSportType(selectedType ?? null);
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
  }, [formattedDate, selectedModel, t]);

  const clearSportFilter = () => {
    setSelectedModel(null);
    setSelectedDate(new Date());
  };

  return {
    loading,
    displayedModelos,
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
