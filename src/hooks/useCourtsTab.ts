import { useEffect, useMemo, useState } from 'react';
import { API_PUBLIC_URL } from '../constants';
import api from '../services/api';
import { Pista, PistaDisponibilidad, TipoPista } from '../types/types';
import { useTranslation } from 'react-i18next';
import {  getTipoPistaImage } from '../utils/getImage';


export const resolvePistaImageSource = (pista: PistaDisponibilidad) =>
  getTipoPistaImage(pista);

const resolvePistaCardImage = (
  pista: Pista,
  tipos: TipoPista[],
): { uri: string } | undefined => {
  const tipo = tipos.find(
    (item) => String(item.tipo_pista_id) === String(pista.tipo_pista_id),
  );
  if (!tipo?.imagen) return undefined;
  return {
    uri: `${API_PUBLIC_URL}${tipo.imagen.startsWith('/') ? '' : '/'}${tipo.imagen}`,
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
  const [tipos, setTipos] = useState<TipoPista[]>([]);
  const [pistas, setPistas] = useState<Pista[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Pista | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingSportInfo, setLoadingSportInfo] = useState(false);
  const [sportError, setSportError] = useState<string | null>(null);
  const [sportType, setSportType] = useState<TipoPista | null>(null);
  const [sportPistas, setSportPistas] = useState<PistaDisponibilidad[]>([]);

  const availableDays = useMemo(() => getNext7Days(), []);
  const formattedDate = formatDateForAPI(selectedDate);

  const displayedModelos = useMemo<Pista[]>(
    () => {
      const grouped = new Map<string, Pista>();
      for (const pista of pistas) {
        const key = String(pista.tipo_pista_id ?? '');
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
          api.get('/tipo_court'),
          api.get('/Court'),
        ]);
        if (mounted && Array.isArray(tiposRes.data)) {
          setTipos(tiposRes.data as TipoPista[]);
        }
        if (mounted && Array.isArray(pistasRes.data)) {
          setPistas(pistasRes.data as Pista[]);
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
            ? (disponibilidadRes.value.data as PistaDisponibilidad[])
            : [];

        const pistasPayload =
          pistasRes.status === 'fulfilled' &&
          Array.isArray(pistasRes.value?.data)
            ? (pistasRes.value.data as PistaDisponibilidad[])
            : [];

        const selectedType =
          tipos.find(
            (tipo) =>
              String(tipo.tipo_pista_id) === String(selectedModel.tipo_pista_id),
          ) ?? null;

        const fullMap = new Map<string, PistaDisponibilidad>();
        for (const pista of pistasPayload) {
          const id = String(pista.pista_id ?? '');
          if (id) fullMap.set(id, pista);
        }

        const filtered = disponibilidadPayload.filter(
          (pista) =>
            String(pista.tipo_pista_id) === String(selectedModel.tipo_pista_id),
        );

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
    resolveModelImage: (pista: Pista) => resolvePistaCardImage(pista, tipos),
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
