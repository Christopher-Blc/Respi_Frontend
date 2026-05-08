import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Reservation, User, Court, CourtType } from '../types/types';

type ViewMode = 'cards' | 'list';
type ConfirmActionType = '' | 'cancel' | 'delete';

export type ReservationFormData = {
  user_id: string;
  court_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: Reservation['status'];
  note: string;
};

const EMPTY_FORM: ReservationFormData = {
  user_id: '',
  court_id: '',
  reservation_date: '',
  start_time: '10:00',
  end_time: '11:00',
  status: 'PENDIENTE',
  note: '',
};

const normalizeTime = (value?: string | null) => {
  if (!value) return '';
  return String(value).slice(0, 5);
};

const normalizeDate = (value?: string | null) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const extractRows = (payload: unknown) => {
  if (Array.isArray(payload)) return payload;
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown[] }).data)
  ) {
    return (payload as { data: unknown[] }).data;
  }
  return [];
};

const canCancelReservation = (reservation: Reservation) =>
  reservation.status !== 'FINALIZADA' && reservation.status !== 'CANCELADA';

export function useAdminBookings() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtTypes, setCourtTypes] = useState<CourtType[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Reservation['status']>(
    'ALL',
  );
  const [courtFilter, setCourtFilter] = useState('ALL');
  const [courtTypeFilter, setCourtTypeFilter] = useState('ALL');

  const [modalVisible, setModalVisible] = useState(false);
  const [reservationToEdit, setReservationToEdit] =
    useState<Reservation | null>(null);
  const [formData, setFormData] = useState<ReservationFormData>(EMPTY_FORM);

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    actionType: '' as ConfirmActionType,
  });
  const [pendingReservation, setPendingReservation] =
    useState<Reservation | null>(null);

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [reservationsRes, usersRes, courtsRes, courtTypesRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/courts').catch(() => ({ data: [] })),
        api.get('/court-types').catch(() => ({ data: [] })),
      ]);

      setReservations(extractRows(reservationsRes?.data) as Reservation[]);
      setUsers(extractRows(usersRes?.data) as User[]);
      setCourts(extractRows(courtsRes?.data) as Court[]);
      setCourtTypes(extractRows(courtTypesRes?.data) as CourtType[]);
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudieron cargar las reservas.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredReservations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const reservationCourt =
        reservation.court ||
        courts.find((court) => Number(court.id) === Number(reservation.court_id));
      const resolvedCourtTypeId = reservationCourt?.court_type_id
        ? String(reservationCourt.court_type_id)
        : '';
      const text = [
        reservation.id,
        reservation.user?.username,
        reservation.user?.email,
        reservationCourt?.name,
        reservation.status,
        reservation.reservation_date,
        reservation.start_time,
        reservation.end_time,
        reservation.note,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = !q || text.includes(q);
      const reservationDate = normalizeDate(reservation.reservation_date);
      const matchesDateFrom = !dateFromFilter || reservationDate >= dateFromFilter;
      const matchesDateTo = !dateToFilter || reservationDate <= dateToFilter;
      const matchesStatus =
        statusFilter === 'ALL' || reservation.status === statusFilter;
      const matchesCourt =
        courtFilter === 'ALL' || String(reservation.court_id) === courtFilter;
      const matchesCourtType =
        courtTypeFilter === 'ALL' || resolvedCourtTypeId === courtTypeFilter;

      return (
        matchesSearch &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesStatus &&
        matchesCourt &&
        matchesCourtType
      );
    });
  }, [
    reservations,
    searchQuery,
    dateFromFilter,
    dateToFilter,
    statusFilter,
    courtFilter,
    courtTypeFilter,
    courts,
  ]);

  const clearFilters = () => {
    setDateFromFilter('');
    setDateToFilter('');
    setStatusFilter('ALL');
    setCourtFilter('ALL');
    setCourtTypeFilter('ALL');
    setSearchQuery('');
  };

  const openCreateModal = () => {
    const today = new Date().toISOString().slice(0, 10);
    setReservationToEdit(null);
    setFormData({
      ...EMPTY_FORM,
      reservation_date: today,
      user_id: users[0]?.id ? String(users[0].id) : '',
      court_id: courts[0]?.id ? String(courts[0].id) : '',
    });
    setModalVisible(true);
  };

  const openEditModal = (reservation: Reservation) => {
    setReservationToEdit(reservation);
    setFormData({
      user_id: String(reservation.user_id ?? ''),
      court_id: String(reservation.court_id ?? ''),
      reservation_date: normalizeDate(reservation.reservation_date),
      start_time: normalizeTime(reservation.start_time),
      end_time: normalizeTime(reservation.end_time),
      status: reservation.status || 'PENDIENTE',
      note: reservation.note || '',
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    const userId = Number(formData.user_id);
    const courtId = Number(formData.court_id);

    if (!Number.isFinite(userId) || userId <= 0)
      return 'El usuario es obligatorio.';
    if (!Number.isFinite(courtId) || courtId <= 0)
      return 'La pista es obligatoria.';
    if (!formData.reservation_date.trim()) return 'La fecha es obligatoria.';
    if (!formData.start_time.trim()) return 'La hora inicio es obligatoria.';
    if (!formData.end_time.trim()) return 'La hora fin es obligatoria.';
    if (formData.start_time >= formData.end_time)
      return 'La hora fin debe ser posterior a la hora inicio.';

    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorModal({
        visible: true,
        title: 'Campo invalido',
        message: validationError,
      });
      return;
    }

    if (
      reservationToEdit?.status === 'FINALIZADA' &&
      formData.status === 'CANCELADA'
    ) {
      setErrorModal({
        visible: true,
        title: 'Accion no permitida',
        message: 'Una reserva finalizada no se puede cancelar.',
      });
      return;
    }

    const basePayload = {
      user_id: Number(formData.user_id),
      court_id: Number(formData.court_id),
      reservation_date: formData.reservation_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      note: formData.note.trim(),
    };

    try {
      if (reservationToEdit) {
        const updatePayload = {
          ...basePayload,
          status: formData.status,
        };

        try {
          await api.put(`/reservations/${reservationToEdit.id}`, updatePayload);
        } catch {
          await api.patch(`/reservations/${reservationToEdit.id}`, updatePayload);
        }
      } else {
        await api.post('/reservations', basePayload);
      }

      setModalVisible(false);
      setReservationToEdit(null);
      setFormData(EMPTY_FORM);
      fetchInitialData();
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: reservationToEdit
          ? 'No se pudo actualizar la reserva.'
          : 'No se pudo crear la reserva.',
      });
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    if (!canCancelReservation(reservation)) {
      setErrorModal({
        visible: true,
        title: 'Accion no permitida',
        message:
          reservation.status === 'FINALIZADA'
            ? 'Una reserva finalizada no se puede cancelar.'
            : 'Esta reserva ya esta cancelada.',
      });
      return;
    }

    setPendingReservation(reservation);
    setConfirmModal({
      visible: true,
      title: 'Cancelar reserva',
      message: `Seguro que quieres cancelar la reserva #${reservation.id}?`,
      actionType: 'cancel',
    });
  };

  const handleDeleteReservation = (reservation: Reservation) => {
    setPendingReservation(reservation);
    setConfirmModal({
      visible: true,
      title: 'Eliminar reserva',
      message: `Seguro que quieres eliminar la reserva #${reservation.id}?`,
      actionType: 'delete',
    });
  };

  const confirmAction = async () => {
    if (!pendingReservation || !confirmModal.actionType) return;

    try {
      if (confirmModal.actionType === 'cancel') {
        const payload = { status: 'CANCELADA' };
        try {
          await api.patch(`/reservations/${pendingReservation.id}`, payload);
        } catch {
          await api.put(`/reservations/${pendingReservation.id}`, payload);
        }
      }

      if (confirmModal.actionType === 'delete') {
        await api.delete(`/reservations/${pendingReservation.id}`);
      }

      setConfirmModal({ visible: false, title: '', message: '', actionType: '' });
      setPendingReservation(null);
      fetchInitialData();
    } catch {
      setConfirmModal({ visible: false, title: '', message: '', actionType: '' });
      setPendingReservation(null);
      setErrorModal({
        visible: true,
        title: 'Error',
        message:
          confirmModal.actionType === 'cancel'
            ? 'No se pudo cancelar la reserva.'
            : 'No se pudo eliminar la reserva.',
      });
    }
  };

  const cancelConfirm = () => {
    setConfirmModal({ visible: false, title: '', message: '', actionType: '' });
    setPendingReservation(null);
  };

  return {
    users,
    courts,
    courtTypes,
    filteredReservations,
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    statusFilter,
    setStatusFilter,
    courtFilter,
    setCourtFilter,
    courtTypeFilter,
    setCourtTypeFilter,
    clearFilters,
    modalVisible,
    setModalVisible,
    reservationToEdit,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    handleSave,
    handleCancelReservation,
    handleDeleteReservation,
    confirmModal,
    confirmAction,
    cancelConfirm,
    errorModal,
    setErrorModal,
  };
}
