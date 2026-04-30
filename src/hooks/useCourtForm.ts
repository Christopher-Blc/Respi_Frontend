import { useState } from 'react';
import { Pista, WeeklyScheduleItem, PistaFormData } from '../types/types';
import api from '../services/api';
import {
  WEEK_DAYS,
  DEFAULT_FORM,
  createDefaultWeeklySchedule,
  isValidHour,
  hourToMinutes,
  isValidPrice,
} from './courtUtils';

export function useCourtForm(pistas: Pista[], fetchPistas: () => void) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pistaAEditar, setPistaAEditar] = useState<Pista | null>(null);
  const [formData, setFormData] = useState<PistaFormData>(DEFAULT_FORM);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(
    createDefaultWeeklySchedule(),
  );
  const [errorModal, setErrorModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: '', message: '' });
  const [samePriceMode, setSamePriceMode] = useState(false);
  const [globalPrice, setGlobalPrice] = useState('');

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
          const existing = pistas.find(
            (p) =>
              p.nombre?.trim().toLowerCase() === pista.nombre?.trim().toLowerCase() &&
              p.dia_semana === dia,
          );
          return {
            dia_semana: dia,
            hora_apertura: existing ? existing.hora_apertura.substring(0, 5) : '08:00',
            hora_cierre: existing ? existing.hora_cierre.substring(0, 5) : '22:00',
            precio_hora: existing ? existing.precio_hora.toString() : '',
            cerrado: !existing,
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

  const handleSave = async () => {
    try {
      const capacidad = Number(formData.capacidad);
      if (!Number.isInteger(capacidad) || capacidad < 2 || capacidad > 20) {
        setErrorModal({ visible: true, title: 'Capacidad invalida', message: 'La capacidad debe ser un numero entero entre 2 y 20.' });
        return;
      }

      const activeDays = weeklySchedule.filter((day) => !day.cerrado);
      if (activeDays.length === 0) {
        setErrorModal({ visible: true, title: 'Horario invalido', message: 'Debes dejar al menos un dia abierto para la pista.' });
        return;
      }

      if (samePriceMode && !isValidPrice(globalPrice)) {
        setErrorModal({ visible: true, title: 'Precio invalido', message: 'El precio general debe ser un numero mayor que 0.' });
        return;
      }

      for (const day of activeDays) {
        if (!isValidHour(day.hora_apertura) || !isValidHour(day.hora_cierre)) {
          setErrorModal({ visible: true, title: 'Hora invalida', message: `Revisa las horas de ${day.dia_semana}. Usa formato HH:MM.` });
          return;
        }
        if (hourToMinutes(day.hora_apertura) === hourToMinutes(day.hora_cierre)) {
          setErrorModal({ visible: true, title: 'Horario invalido', message: `La hora de inicio y fin de ${day.dia_semana} no pueden ser iguales.` });
          return;
        }
        const precioAValidar = samePriceMode ? globalPrice : day.precio_hora;
        if (!isValidPrice(precioAValidar)) {
          setErrorModal({ visible: true, title: 'Precio invalido', message: `Revisa el precio de ${day.dia_semana}. Debe ser un numero mayor que 0.` });
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
          activeDays.map((day) => {
            const existingId = existingByDay[day.dia_semana];
            const precio = (samePriceMode ? globalPrice : day.precio_hora).trim().replace(',', '.');
            const body = {
              ...bodyBase,
              precio_hora: parseFloat(precio),
              dia_semana: day.dia_semana,
              hora_apertura: day.hora_apertura.substring(0, 5),
              hora_cierre: day.hora_cierre.substring(0, 5),
              estado: 'DISPONIBLE',
            };
            return existingId ? api.put(`/pista/${existingId}`, body) : api.post('/pista', body);
          }),
        );
      } else {
        await Promise.all(
          activeDays.map((day) => {
            const precio = (samePriceMode ? globalPrice : day.precio_hora).trim().replace(',', '.');
            return api.post('/pista', {
              ...bodyBase,
              precio_hora: parseFloat(precio),
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
      setErrorModal({
        visible: true,
        title: isUniqueError
          ? i18next.t('adminCourtNameExistsTitle')
          : i18next.t('adminSaveErrorTitle'),
        message: isUniqueError
          ? i18next.t('adminCourtNameExistsMessage', { name: formData.nombre })
          : errorMessage,
      });
    }
  };

  const updateWeeklySchedule = <K extends keyof WeeklyScheduleItem>(
    dia: Pista['dia_semana'],
    field: K,
    value: WeeklyScheduleItem[K],
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item) => (item.dia_semana === dia ? { ...item, [field]: value } : item)),
    );
  };

  const toggleSamePrice = (enabled: boolean, price: string = '') => {
    setSamePriceMode(enabled);
    setGlobalPrice(price);
    if (enabled && price) {
      setWeeklySchedule((prev) => prev.map((day) => ({ ...day, precio_hora: price })));
    }
  };

  return {
    modalVisible,
    setModalVisible,
    pistaAEditar,
    formData,
    setFormData,
    weeklySchedule,
    errorModal,
    setErrorModal,
    samePriceMode,
    globalPrice,
    setGlobalPrice,
    openModal,
    handleSave,
    updateWeeklySchedule,
    toggleSamePrice,
  };
}
