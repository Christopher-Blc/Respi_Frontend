import { useState } from 'react';
import { Alert } from 'react-native';
import { Court } from '../types/types';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import {
  toDateInputValue,
  parseDateInput,
  eachDateInclusive,
  countUniqueReservas,
} from './courtUtils';

const EMPTY_DELETE_MODAL = {
  visible: false,
  nombre: '',
  ids: [] as number[],
  reservasCount: 0,
  loadingCount: false,
  accion: 'eliminar' as 'eliminar' | 'mantenimiento',
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

export function useCourtMaintenance(pistas: Court[], fetchPistas: () => void) {
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
            api.get('/reservations', { params: { pista_id: id, fecha_inicio: maintenanceDesde, fecha_fin: maintenanceHasta } }),
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
            days.map((fecha) => api.get('/reservations', { params: { fecha, pista_id: id } })),
          ),
        );
        return countUniqueReservas(results);
      }
    }

    const today = new Date().toISOString().slice(0, 10);
    const results = await Promise.all(
      ids.map((id) => api.get('/reservations', { params: { fecha: today, pista_id: id } })),
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

  const getIdsForPista = (item: Court) =>
    pistas
      .filter((p) => p.name?.trim().toLowerCase() === item.name?.trim().toLowerCase())
      .map((p) => p.id);

  const handleDelete = (item: Court) =>
    openConfirmModal({ nombre: item.name, ids: getIdsForPista(item), accion: 'eliminar' });

  const handleMantenimiento = (item: Court) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    setMaintenanceDateModal({
      visible: true,
      nombre: item.name,
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
            const pista = pistas.find((p) => p.id === id);
            if (!pista) return Promise.resolve();
            return api.put(`/courts/${id}`, { name: `deleted ('${pista.name}')`, status: 'INACTIVA' });
          }),
        );
      } else {
        await Promise.all(
          deleteModal.ids.map((id) =>
            api.put(
              `/courts/${id}`,
              {
                status: 'MANTENIMIENTO',
              },
              {
                headers: {
                  maintenance_from: deleteModal.mantenimientoDesde,
                  maintenance_until: deleteModal.mantenimientoHasta,
                },
              },
            ),
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
