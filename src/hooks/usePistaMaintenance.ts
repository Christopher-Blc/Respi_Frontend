import { useState } from 'react';
import { Alert } from 'react-native';
import { Pista } from '../types/types';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import {
  toDateInputValue,
  parseDateInput,
  eachDateInclusive,
  countUniqueReservas,
} from './pistaUtils';

const EMPTY_DELETE_MODAL = {
  visible: false,
  nombre: '',
  ids: [] as number[],
  reservasCount: 0,
  loadingCount: false,
  accion: 'eliminar' as const,
  mantenimientoDesde: '',
  mantenimientoHasta: '',
};

const EMPTY_MAINTENANCE_MODAL = {
  visible: false,
  nombre: '',
  ids: [] as number[],
  desde: '',
  hasta: '',
  error: '',
};

export function usePistaMaintenance(pistas: Pista[], fetchPistas: () => void) {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState(EMPTY_DELETE_MODAL);
  const [maintenanceDateModal, setMaintenanceDateModal] = useState(EMPTY_MAINTENANCE_MODAL);

  const fetchReservasCount = async (
    ids: number[],
    maintenanceDesde?: string,
    maintenanceHasta?: string,
  ): Promise<number> => {
    if (maintenanceDesde && maintenanceHasta) {
      try {
        const results = await Promise.all(
          ids.map((id) =>
            api.get('/reserva', { params: { pista_id: id, fecha_inicio: maintenanceDesde, fecha_fin: maintenanceHasta } }),
          ),
        );
        return countUniqueReservas(results);
      } catch {
        const from = parseDateInput(maintenanceDesde);
        const to = parseDateInput(maintenanceHasta);
        if (!from || !to) return 0;
        const days = eachDateInclusive(from, to);
        const results = await Promise.all(
          ids.flatMap((id) =>
            days.map((fecha) => api.get('/reserva', { params: { fecha, pista_id: id } })),
          ),
        );
        return countUniqueReservas(results);
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    const results = await Promise.all(
      ids.map((id) => api.get('/reserva', { params: { fecha: today, pista_id: id } })),
    );
    return results.reduce((sum, r) => sum + (Array.isArray(r.data) ? r.data.length : 0), 0);
  };

  const openConfirmModal = async ({
    nombre,
    ids,
    accion,
    mantenimientoDesde = '',
    mantenimientoHasta = '',
  }: {
    nombre: string;
    ids: number[];
    accion: 'eliminar' | 'mantenimiento';
    mantenimientoDesde?: string;
    mantenimientoHasta?: string;
  }) => {
    setDeleteModal({ visible: true, nombre, ids, reservasCount: 0, loadingCount: true, accion, mantenimientoDesde, mantenimientoHasta });
    try {
      const count = await fetchReservasCount(ids, mantenimientoDesde, mantenimientoHasta);
      setDeleteModal((prev) => ({ ...prev, reservasCount: count, loadingCount: false }));
    } catch {
      setDeleteModal((prev) => ({ ...prev, loadingCount: false }));
    }
  };

  const getIdsForPista = (item: Pista) =>
    pistas
      .filter((p) => p.nombre?.trim().toLowerCase() === item.nombre?.trim().toLowerCase())
      .map((p) => p.pista_id);

  const handleDelete = (item: Pista) =>
    openConfirmModal({ nombre: item.nombre, ids: getIdsForPista(item), accion: 'eliminar' });

  const handleMantenimiento = (item: Pista) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    setMaintenanceDateModal({
      visible: true,
      nombre: item.nombre,
      ids: getIdsForPista(item),
      desde: toDateInputValue(today),
      hasta: toDateInputValue(nextWeek),
      error: '',
    });
  };

  const updateMaintenanceRange = (field: 'desde' | 'hasta', value: string) =>
    setMaintenanceDateModal((prev) => ({ ...prev, [field]: value, error: '' }));

  const cancelMaintenanceDates = () => setMaintenanceDateModal(EMPTY_MAINTENANCE_MODAL);

  const confirmMaintenanceDates = async () => {
    const from = parseDateInput(maintenanceDateModal.desde);
    const to = parseDateInput(maintenanceDateModal.hasta);

    if (!from || !to) {
      setMaintenanceDateModal((prev) => ({
        ...prev,
        error: t('adminMaintenanceInvalidFormat'),
      }));
      return;
    }
    if (from > to) {
      setMaintenanceDateModal((prev) => ({
        ...prev,
        error: t('adminMaintenanceInvalidRange'),
      }));
      return;
    }

    const payload = {
      nombre: maintenanceDateModal.nombre,
      ids: maintenanceDateModal.ids,
      accion: 'mantenimiento' as const,
      mantenimientoDesde: maintenanceDateModal.desde,
      mantenimientoHasta: maintenanceDateModal.hasta,
    };
    cancelMaintenanceDates();
    await openConfirmModal(payload);
  };

  const confirmDelete = async () => {
    try {
      if (deleteModal.accion === 'eliminar') {
        await Promise.all(
          deleteModal.ids.map((id) => {
            const pista = pistas.find((p) => p.pista_id === id);
            if (!pista) return Promise.resolve();
            return api.put(`/pista/${id}`, { nombre: `deleted ('${pista.nombre}')`, estado: 'INACTIVA' });
          }),
        );
      } else {
        await Promise.all(
          deleteModal.ids.map((id) =>
            api.put(`/pista/${id}`, {
              estado: 'MANTENIMIENTO',
              mantenimiento_desde: deleteModal.mantenimientoDesde,
              mantenimiento_hasta: deleteModal.mantenimientoHasta,
            }),
          ),
        );
      }
      fetchPistas();
    } catch {
      Alert.alert(
        t('bookingConfirmErrorTitle'),
        deleteModal.accion === 'eliminar'
          ? t('adminDeleteError')
          : t('adminMaintenanceError'),
      );
    } finally {
      setDeleteModal(EMPTY_DELETE_MODAL);
    }
  };

  const cancelDelete = () => setDeleteModal(EMPTY_DELETE_MODAL);

  return {
    deleteModal,
    maintenanceDateModal,
    handleDelete,
    handleMantenimiento,
    updateMaintenanceRange,
    cancelMaintenanceDates,
    confirmMaintenanceDates,
    confirmDelete,
    cancelDelete,
  };
}
