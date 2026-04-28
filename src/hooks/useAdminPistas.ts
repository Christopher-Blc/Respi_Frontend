import { useState, useMemo, useEffect } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { Pista, TipoPista } from '../types/types';
import api from '../services/api';
  
export const WEEK_DAYS: Pista['dia_semana'][] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
];

export type WeeklyScheduleItem = {
  dia_semana: Pista['dia_semana'];
  hora_apertura: string;
  hora_cierre: string;
  precio_hora: string;
  cerrado: boolean;
};

export type PistaFormData = {
  nombre: string;
  descripcion: string;
  capacidad: string;
  cubierta: boolean;
  iluminacion: boolean;
  estado: string;
  dia_semana: Pista['dia_semana'];
  instalacion_id: string;
  tipo_pista_id: string;
};

const DEFAULT_FORM: PistaFormData = {
  nombre: '',
  descripcion: '',
  capacidad: '4',
  cubierta: false,
  iluminacion: false,
  estado: 'DISPONIBLE',
  dia_semana: 'LUNES',
  instalacion_id: '1',
  tipo_pista_id: '1',
};

export const createDefaultWeeklySchedule = (): WeeklyScheduleItem[] =>
  WEEK_DAYS.map((dia) => ({
    dia_semana: dia,
    hora_apertura: '08:00',
    hora_cierre: '22:00',
    precio_hora: '',
    cerrado: false,
  }));

const HOUR_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const isValidHour = (value: string) => HOUR_PATTERN.test(value.trim());

const hourToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const isValidPrice = (value: string) => {
  const normalized = value.trim().replace(',', '.');
  const amount = Number(normalized);
  return normalized.length > 0 && Number.isFinite(amount) && amount > 0;
};

export function useAdminPistas() {
  const { width } = useWindowDimensions();
  const weeklyCardWidth = width >= 1400 ? '32%' : width >= 980 ? '49%' : '100%';

  const [pistas, setPistas] = useState<Pista[]>([]);
  const [tiposPista, setTiposPista] = useState<TipoPista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [pistaAEditar, setPistaAEditar] = useState<Pista | null>(null);
  const [formData, setFormData] = useState<PistaFormData>(DEFAULT_FORM);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(
    createDefaultWeeklySchedule(),
  );
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    nombre: string;
    ids: number[];
    reservasCount: number;
    loadingCount: boolean;
    accion: 'eliminar' | 'mantenimiento';
  }>({ visible: false, nombre: '', ids: [], reservasCount: 0, loadingCount: false, accion: 'eliminar' });
  const [errorModal, setErrorModal] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });
  const [samePriceMode, setSamePriceMode] = useState(false);
  const [globalPrice, setGlobalPrice] = useState('');

  const fetchPistas = async () => {
    try {
      setLoading(true);
      const [pistaRes, tipoRes] = await Promise.all([
        api.get('/pista'),
        api.get('/tipo_pista'),
      ]);
      setPistas(pistaRes.data);
      setTiposPista(tipoRes.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar las pistas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPistas();
  }, []);

  const handleSave = async () => {
    try {
      const capacidad = Number(formData.capacidad);
      if (!Number.isInteger(capacidad) || capacidad < 2 || capacidad > 20) {
        setErrorModal({
          visible: true,
          title: 'Capacidad invalida',
          message: 'La capacidad debe ser un numero entero entre 2 y 20.',
        });
        return;
      }

      const activeDays = weeklySchedule.filter((day) => !day.cerrado);
      if (activeDays.length === 0) {
        setErrorModal({
          visible: true,
          title: 'Horario invalido',
          message: 'Debes dejar al menos un dia abierto para la pista.',
        });
        return;
      }

      if (samePriceMode && !isValidPrice(globalPrice)) {
        setErrorModal({
          visible: true,
          title: 'Precio invalido',
          message: 'El precio general debe ser un numero mayor que 0.',
        });
        return;
      }

      for (const day of activeDays) {
        if (!isValidHour(day.hora_apertura) || !isValidHour(day.hora_cierre)) {
          setErrorModal({
            visible: true,
            title: 'Hora invalida',
            message: `Revisa las horas de ${day.dia_semana}. Usa formato HH:MM.`,
          });
          return;
        }

        if (hourToMinutes(day.hora_apertura) >= hourToMinutes(day.hora_cierre)) {
          setErrorModal({
            visible: true,
            title: 'Horario invalido',
            message: `La hora de inicio de ${day.dia_semana} debe ser menor que la hora de fin.`,
          });
          return;
        }

        const precioAValidar = samePriceMode ? globalPrice : day.precio_hora;
        if (!isValidPrice(precioAValidar)) {
          setErrorModal({
            visible: true,
            title: 'Precio invalido',
            message: `Revisa el precio de ${day.dia_semana}. Debe ser un numero mayor que 0.`,
          });
          return;
        }
      }

      const bodyBase = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        capacidad,
        cubierta: formData.cubierta,
        iluminacion: formData.iluminacion,
        instalacion_id: parseInt(formData.instalacion_id),
        tipo_pista_id: parseInt(formData.tipo_pista_id),
      };

      if (pistaAEditar) {
        // Edición: actualizar días existentes y crear nuevos si es necesario
        const existingByDay = pistas.reduce(
          (acc, p) => {
            if (p.nombre?.trim().toLowerCase() === pistaAEditar.nombre?.trim().toLowerCase()) {
              acc[p.dia_semana] = p.pista_id;
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        await Promise.all(
          weeklySchedule
            .filter((day) => !day.cerrado)
            .map((day) => {
              const existingId = existingByDay[day.dia_semana];
              const precioAUsar = (samePriceMode ? globalPrice : day.precio_hora)
                .trim()
                .replace(',', '.');
              if (existingId) {
                // Actualizar existente
                return api.put(`/pista/${existingId}`, {
                  ...bodyBase,
                  precio_hora: parseFloat(precioAUsar),
                  dia_semana: day.dia_semana,
                  hora_apertura: day.hora_apertura.substring(0, 5),
                  hora_cierre: day.hora_cierre.substring(0, 5),
                  estado: 'DISPONIBLE',
                });
              } else {
                // Crear nuevo
                return api.post('/pista', {
                  ...bodyBase,
                  precio_hora: parseFloat(precioAUsar),
                  dia_semana: day.dia_semana,
                  hora_apertura: day.hora_apertura.substring(0, 5),
                  hora_cierre: day.hora_cierre.substring(0, 5),
                  estado: 'DISPONIBLE',
                });
              }
            }),
        );
      } else {
        // Creación: crear todos los días no cerrados
        await Promise.all(
          weeklySchedule
            .filter((day) => !day.cerrado)
            .map((day) => {
              const precioAUsar = (samePriceMode ? globalPrice : day.precio_hora)
                .trim()
                .replace(',', '.');
              return api.post('/pista', {
                ...bodyBase,
                precio_hora: parseFloat(precioAUsar),
                dia_semana: day.dia_semana,
                hora_apertura: day.hora_apertura.substring(0, 5),
                hora_cierre: day.hora_cierre.substring(0, 5),
                estado: 'DISPONIBLE',
              });
            }),
        );
      }

      setModalVisible(false);
      fetchPistas();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      const isUniqueError =
        errorMessage.toLowerCase().includes('unique') ||
        errorMessage.toLowerCase().includes('nombre') ||
        errorMessage.toLowerCase().includes('duplicat');

      let title = 'Error al guardar';
      let message = errorMessage;

      if (isUniqueError) {
        title = 'El nombre ya existe';
        message = `El nombre "${formData.nombre}" ya está en uso. El nombre de la pista debe ser único.`;
      }

      setErrorModal({ visible: true, title, message });
    }
  };

  const fetchReservasCount = async (ids: number[]): Promise<number> => {
    const today = new Date().toISOString().slice(0, 10);
    const results = await Promise.all(
      ids.map((id) =>
        api.get('/reserva', { params: { fecha: today, pista_id: id } }),
      ),
    );
    return results.reduce(
      (sum, r) => sum + (Array.isArray(r.data) ? r.data.length : 0),
      0,
    );
  };

  const openConfirmModal = async (
    item: Pista,
    accion: 'eliminar' | 'mantenimiento',
  ) => {
    const nombre = item.nombre;
    const ids = pistas
      .filter(
        (p) => p.nombre?.trim().toLowerCase() === nombre?.trim().toLowerCase(),
      )
      .map((p) => p.pista_id);
    setDeleteModal({ visible: true, nombre, ids, reservasCount: 0, loadingCount: true, accion });
    try {
      const count = await fetchReservasCount(ids);
      setDeleteModal((prev) => ({ ...prev, reservasCount: count, loadingCount: false }));
    } catch {
      setDeleteModal((prev) => ({ ...prev, loadingCount: false }));
    }
  };

  const handleDelete = (item: Pista) => openConfirmModal(item, 'eliminar');

  const handleMantenimiento = (item: Pista) => openConfirmModal(item, 'mantenimiento');

  const confirmDelete = async () => {
    try {
      if (deleteModal.accion === 'eliminar') {
        await Promise.all(
          deleteModal.ids.map((id) => api.delete(`/pista/${id}`)),
        );
      } else {
        await Promise.all(
          deleteModal.ids.map((id) => {
            const pista = pistas.find((p) => p.pista_id === id);
            if (!pista) return Promise.resolve();
            return api.put(`/pista/${id}`, {
              nombre: pista.nombre,
              descripcion: pista.descripcion,
              capacidad: pista.capacidad,
              precio_hora: parseFloat(pista.precio_hora),
              cubierta: pista.cubierta,
              iluminacion: pista.iluminacion,
              instalacion_id: pista.instalacion_id,
              tipo_pista_id: pista.tipo_pista_id,
              dia_semana: pista.dia_semana,
              hora_apertura: pista.hora_apertura.substring(0, 5),
              hora_cierre: pista.hora_cierre.substring(0, 5),
              estado: 'MANTENIMIENTO',
            });
          }),
        );
      }
      fetchPistas();
    } catch {
      Alert.alert(
        'Error',
        deleteModal.accion === 'eliminar'
          ? 'No se pudo eliminar'
          : 'No se pudo poner en mantenimiento',
      );
    } finally {
      setDeleteModal({ visible: false, nombre: '', ids: [], reservasCount: 0, loadingCount: false, accion: 'eliminar' });
    }
  };

  const cancelDelete = () =>
    setDeleteModal({ visible: false, nombre: '', ids: [], reservasCount: 0, loadingCount: false, accion: 'eliminar' });

  const openModal = (pista: Pista | null = null) => {
    setPistaAEditar(pista);
    if (pista) {
      setFormData({
        nombre: pista.nombre,
        descripcion: pista.descripcion,
        capacidad: pista.capacidad.toString(),
        cubierta: pista.cubierta,
        iluminacion: pista.iluminacion,
        estado: pista.estado,
        dia_semana: pista.dia_semana,
        instalacion_id: pista.instalacion_id.toString(),
        tipo_pista_id: pista.tipo_pista_id.toString(),
      });
      setWeeklySchedule(
        WEEK_DAYS.map((dia) => {
          const existingPista = pistas.find(
            (p) => p.nombre?.trim().toLowerCase() === pista.nombre?.trim().toLowerCase() && p.dia_semana === dia
          );
          return {
            dia_semana: dia,
            hora_apertura: existingPista ? existingPista.hora_apertura.substring(0, 5) : '08:00',
            hora_cierre: existingPista ? existingPista.hora_cierre.substring(0, 5) : '22:00',
            precio_hora: existingPista ? existingPista.precio_hora.toString() : '',
            cerrado: !existingPista,
          };
        }),
      );
    } else {
      setFormData(DEFAULT_FORM);
      setWeeklySchedule(createDefaultWeeklySchedule());
    }
    setSamePriceMode(false);
    setGlobalPrice('');
    setModalVisible(true);
  };

  const toggleSamePrice = (enabled: boolean, price: string = '') => {
    setSamePriceMode(enabled);
    setGlobalPrice(price);
    if (enabled && price) {
      setWeeklySchedule((prev) =>
        prev.map((day) => ({
          ...day,
          precio_hora: price,
        })),
      );
    }
  };

  const updateWeeklySchedule = <K extends keyof WeeklyScheduleItem>(
    dia: Pista['dia_semana'],
    field: K,
    value: WeeklyScheduleItem[K],
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.dia_semana === dia ? { ...item, [field]: value } : item,
      ),
    );
  };

  const filteredPistas = useMemo(() => {
    const seen = new Set<string>();
    const uniquePistas = pistas.filter((p) => {
      const key = (p.nombre || '').trim().toLowerCase();
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return uniquePistas.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.instalacion?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [pistas, searchQuery]);

  return {
    pistas,
    tiposPista,
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    pistaAEditar,
    formData,
    setFormData,
    weeklySchedule,
    weeklyCardWidth,
    deleteModal,
    filteredPistas,
    openModal,
    handleSave,
    handleDelete,
    handleMantenimiento,
    confirmDelete,
    cancelDelete,
    updateWeeklySchedule,
    errorModal,
    setErrorModal,
    samePriceMode,
    globalPrice,
    setGlobalPrice,
    toggleSamePrice,
  };
}
