import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { API_PUBLIC_URL } from '../constants';
import { MODELOS, Modelo } from '../data/modelos';
import { useAuth } from '../context/AuthContext';
import { reservasService } from '../services/reservasService';
import { JWTPayload } from '../types/types';

export const DURATION_CHIPS = [60, 90, 120, 180, 240, 360, 480];
const MIN_MINUTES = 60;
const MAX_MINUTES = 8 * 60;
export const COURT_3D_URL =
  'https://my.spline.design/untitled-o8FhbQhvF8XmEF9SVboAdTmE/';

export type DatePickerMode = 'date' | 'time' | null;

export type CourtOption = {
  id: string;
  name: string;
  openingHour?: string;
  closingHour?: string;
  status?: string;
};

const normalizeCourtsFromPayload = (payload: any): CourtOption[] => {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.rows)
          ? payload.rows
          : Array.isArray(payload?.pistas)
            ? payload.pistas
            : [];

  return raw.map((item: any, idx: number) => ({
    id: String(item.id ?? item.pista_id ?? item._id ?? idx + 1),
    name: item.nombre || item.name || `Pista ${idx + 1}`,
    openingHour: item.hora_apertura || item.openingHour,
    closingHour: item.hora_cierre || item.closingHour,
    status: item.estado || item.status,
  }));
};

const dedupeCourts = (list: CourtOption[]) => {
  const seen = new Set<string>();
  return list.filter((court) => {
    if (seen.has(court.id)) return false;
    seen.add(court.id);
    return true;
  });
};

export const formatDate = (date: Date) => date.toISOString().slice(0, 10);
export const formatTime = (date: Date) => date.toTimeString().slice(0, 5);
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes ? ` ${remainingMinutes}m` : ''}`;
};

export const resolveImageSource = (img: Modelo['img']) => {
  if (typeof img === 'number') return img;
  if (typeof img === 'string') {
    return img.startsWith('http')
      ? { uri: img }
      : { uri: `${API_PUBLIC_URL}/${img.replace(/^\//, '')}` };
  }

  return img;
};

export function useCreateBooking() {
  const params = useLocalSearchParams<{ modelId?: string | string[] }>();
  const modelId = Array.isArray(params?.modelId)
    ? params.modelId[0]
    : params?.modelId;
  const router = useRouter();
  const { userToken } = useAuth();

  const [model, setModel] = useState<Modelo | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [notes, setNotes] = useState('');
  const [precioHora, setPrecioHora] = useState('0');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(
    new Date(Date.now() + 60 * 60 * 1000),
  );
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [showPicker, setShowPicker] = useState<DatePickerMode>(null);
  const [showHoursExpanded, setShowHoursExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [isLoadingCourts, setIsLoadingCourts] = useState(false);
  const [courts, setCourts] = useState<CourtOption[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<CourtOption | null>(null);

  const sessionEmail = useMemo(() => {
    if (!userToken) return '';
    try {
      const decoded = jwtDecode(userToken) as JWTPayload;
      return decoded?.email || '';
    } catch {
      return '';
    }
  }, [userToken]);

  const imageSource = useMemo(
    () => resolveImageSource(model?.img as Modelo['img']),
    [model],
  );
  const total =
    (durationMinutes / 60) * Number(precioHora || model?.price || 0);

  useEffect(() => {
    if (!email && sessionEmail) {
      setEmail(sessionEmail);
    }
  }, [email, sessionEmail]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const remote = await reservasService.getModelos();
        const found = remote.find(
          (item) => String(item.id) === String(modelId),
        );
        const selected =
          found ??
          MODELOS.find((item) => item.id === String(modelId)) ??
          remote[0] ??
          MODELOS[0];

        if (!mounted) return;
        setModel(selected);
        setPrecioHora(String(selected.price));
      } catch (error) {
        if (!mounted) return;
        const fallback =
          MODELOS.find((item) => item.id === String(modelId)) ?? MODELOS[0];
        setModel(fallback);
        setPrecioHora(String(fallback.price));
        console.error('Error al cargar el deporte seleccionado', error);
      } finally {
        if (mounted) setLoadingModel(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [modelId]);

  useEffect(() => {
    let mounted = true;

    const tryProfile = async () => {
      if (!userToken) return;
      const api = (await import('../services/api')).default;
      const endpoints = ['/auth/me', '/me', '/users/me', '/profile'];

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          if (!mounted || !response?.data) continue;
          const data = response.data;
          if (!email && (data.email || data.mail))
            setEmail(data.email || data.mail);
          if (!nombre && (data.name || data.nombre || data.displayName)) {
            setNombre(data.name || data.nombre || data.displayName);
          }
          return;
        } catch {
          // probar siguiente endpoint
        }
      }
    };

    tryProfile();
    return () => {
      mounted = false;
    };
  }, [userToken, email, nombre]);

  useEffect(() => {
    const start = fechaInicio.getTime();
    const end = fechaFin.getTime();
    const minutes = Math.max(
      MIN_MINUTES,
      Math.ceil((end - start) / (1000 * 60)),
    );
    setDurationMinutes(minutes);
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    let mounted = true;

    const loadCourts = async () => {
      setIsLoadingCourts(true);
      try {
        const api = (await import('../services/api')).default;
        const endpoints = [
          '/pista',
          '/pistas',
          '/pista/all',
          '/instalacion/pistas',
        ];
        let merged: CourtOption[] = [];

        for (const endpoint of endpoints) {
          try {
            const response = await api.get(endpoint);
            const mapped = normalizeCourtsFromPayload(response?.data);
            if (mapped.length > 0) {
              merged = dedupeCourts([...merged, ...mapped]);
            }
          } catch {
            // probar siguiente endpoint
          }
        }

        if (!mounted) return;
        const sorted = [...merged].sort((a, b) => a.name.localeCompare(b.name));
        setCourts(sorted);
      } catch (error) {
        console.error('No se pudieron cargar las pistas', error);
      } finally {
        if (mounted) setIsLoadingCourts(false);
      }
    };

    loadCourts();
    return () => {
      mounted = false;
    };
  }, []);

  const closePicker = () => setShowPicker(null);

  const onChangeDate = (_event: any, selected?: Date) => {
    const current = showPicker;
    closePicker();
    if (!selected) return;

    const msMinute = 1000 * 60;

    if (current === 'date') {
      const nextStart = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        fechaInicio.getHours(),
        fechaInicio.getMinutes(),
        0,
        0,
      );
      const nextEnd = new Date(
        nextStart.getTime() + durationMinutes * msMinute,
      );
      if (nextEnd.getDate() !== nextStart.getDate()) {
        const maxAvailable = Math.max(
          MIN_MINUTES,
          Math.floor(
            (new Date(nextStart).setHours(23, 59, 59, 999) -
              nextStart.getTime()) /
              msMinute,
          ),
        );
        const adjustedMinutes = Math.min(durationMinutes, maxAvailable);
        if (adjustedMinutes < durationMinutes) {
          Alert.alert(
            'Aviso',
            'La duración se ha reducido para no cruzar el día.',
          );
        }
        setFechaInicio(nextStart);
        setFechaFin(new Date(nextStart.getTime() + adjustedMinutes * msMinute));
        setDurationMinutes(adjustedMinutes);
        return;
      }
      setFechaInicio(nextStart);
      setFechaFin(nextEnd);
      return;
    }

    if (current === 'time') {
      const nextStart = new Date(fechaInicio);
      nextStart.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      const nextEnd = new Date(
        nextStart.getTime() + durationMinutes * msMinute,
      );
      if (nextEnd.getDate() !== nextStart.getDate()) {
        const maxAvailable = Math.max(
          MIN_MINUTES,
          Math.floor(
            (new Date(nextStart).setHours(23, 59, 59, 999) -
              nextStart.getTime()) /
              msMinute,
          ),
        );
        const adjustedMinutes = Math.min(durationMinutes, maxAvailable);
        if (adjustedMinutes < durationMinutes) {
          Alert.alert(
            'Aviso',
            'La duración se ha reducido para no cruzar el día.',
          );
        }
        setFechaInicio(nextStart);
        setFechaFin(new Date(nextStart.getTime() + adjustedMinutes * msMinute));
        setDurationMinutes(adjustedMinutes);
        return;
      }
      setFechaInicio(nextStart);
      setFechaFin(nextEnd);
    }
  };

  const adjustDuration = (nextMinutes: number) => {
    const bounded = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, nextMinutes));
    if (bounded === durationMinutes) return;
    setDurationMinutes(bounded);
    setFechaFin(new Date(fechaInicio.getTime() + bounded * 60 * 1000));
  };

  const handleSubmit = async () => {
    const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
    const resolvedEmail = (email || sessionEmail || '').trim();

    if (!resolvedEmail) {
      setSnackbarMessage(
        'No se pudo obtener tu email de sesión. Vuelve a iniciar sesión.',
      );
      setSnackbarVisible(true);
      return;
    }

    if (!isValidEmail(resolvedEmail)) {
      setSnackbarMessage('El email de sesión es inválido');
      setSnackbarVisible(true);
      return;
    }

    if (fechaFin <= fechaInicio) {
      setSnackbarMessage('La fecha fin debe ser posterior');
      setSnackbarVisible(true);
      return;
    }

    if (!selectedCourt) {
      setSnackbarMessage('Selecciona una pista para continuar');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);

    const mergedNotes = selectedCourt
      ? [notes?.trim(), `Pista seleccionada: ${selectedCourt.name}`]
          .filter(Boolean)
          .join(' | ')
      : notes;

    try {
      const id = await reservasService.createReserva({
        usuarioId: 'local-uid',
        email: resolvedEmail,
        nombre,
        modeloId: Number(modelId ?? model?.id ?? 0),
        pistaId: Number(selectedCourt.id),
        precioHora: Number(precioHora || model?.price || 0),
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        notas: mergedNotes,
      });

      setSnackbarMessage(`Reserva creada - ID: ${id}`);
      setSnackbarVisible(true);
      setTimeout(() => router.replace('/reservas'), 900);
    } catch (error: any) {
      console.error('createReserva error', error);
      setSnackbarMessage(
        error?.response?.data?.message ||
          error?.message ||
          'No se pudo crear la reserva',
      );
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    model,
    loadingModel,
    email,
    nombre,
    notes,
    precioHora,
    fechaInicio,
    fechaFin,
    durationMinutes,
    showPicker,
    showHoursExpanded,
    loading,
    snackbarVisible,
    snackbarMessage,
    showCourtModal,
    isLoadingCourts,
    courts,
    selectedCourt,
    sessionEmail,
    imageSource,
    total,
    setNombre,
    setNotes,
    setShowPicker,
    setShowHoursExpanded,
    setSnackbarVisible,
    setShowCourtModal,
    setSelectedCourt,
    onChangeDate,
    adjustDuration,
    handleSubmit,
  };
}
