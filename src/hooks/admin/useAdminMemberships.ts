import { useEffect, useMemo, useState } from 'react';
import { Membership } from '../../types/types';
import api from '../../services/api';

export type MembershipFormData = {
  level: string;
  name: string;
  discount: string;
  required_reservations: string;
  benefits: string;
};

type DeleteModalState = {
  visible: boolean;
  item: Membership | null;
  message: string;
  canDelete: boolean;
};

type BasicUser = {
  id?: number;
  user_id?: number;
  membership_id?: number | null;
};

const EMPTY_FORM: MembershipFormData = {
  level: '',
  name: '',
  discount: '',
  required_reservations: '',
  benefits: '',
};

export function useAdminMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [membershipToEdit, setMembershipToEdit] = useState<Membership | null>(
    null,
  );
  const [formData, setFormData] = useState<MembershipFormData>(EMPTY_FORM);

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    visible: false,
    item: null,
    message: '',
    canDelete: false,
  });

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/memberships');
      const rows = (Array.isArray(res.data) ? res.data : []).filter(
        (m: any) => m != null && m.id != null,
      );
      setMemberships(rows);
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudieron cargar las membresias.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const filteredMemberships = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return memberships;

    return memberships.filter((m) => {
      const text = `${m.name} ${m.benefits} ${m.level}`.toLowerCase();
      return text.includes(q);
    });
  }, [memberships, searchQuery]);

  const openCreateModal = () => {
    setMembershipToEdit(null);
    setFormData(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEditModal = (item: Membership) => {
    setMembershipToEdit(item);
    setFormData({
      level: String(item.level),
      name: item.name,
      discount: String(item.discount),
      required_reservations: String(item.required_reservations),
      benefits: item.benefits,
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    const level = Number(formData.level);
    const discount = Number(formData.discount);
    const requiredReservations = Number(formData.required_reservations);

    if (!formData.name.trim()) return 'El nombre de la membresia es obligatorio.';
    if (!Number.isFinite(level) || level <= 0)
      return 'El nivel debe ser un numero mayor a 0.';
    if (!Number.isFinite(discount) || discount < 0 || discount >= 100)
      return 'El descuento debe estar entre 0 y 99.';
    if (!Number.isFinite(requiredReservations) || requiredReservations < 0)
      return 'Las reservas requeridas no pueden ser negativas.';
    if (!formData.benefits.trim()) return 'Los beneficios son obligatorios.';

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

    const payload = {
      level: Number(formData.level),
      name: formData.name.trim(),
      discount: Number(formData.discount),
      required_reservations: Number(formData.required_reservations),
      benefits: formData.benefits.trim(),
    };

    try {
      if (membershipToEdit) {
        await api.put(`/memberships/${membershipToEdit.id}`, payload);
      } else {
        await api.post('/memberships', payload);
      } 

      setModalVisible(false);
      setMembershipToEdit(null);
      setFormData(EMPTY_FORM);
      fetchMemberships();
    } catch {
      console.log('Error.... Lamentable  :', payload);
      setErrorModal({
        visible: true,
        title: 'Error',
        message: membershipToEdit
          ? 'No se pudo actualizar la membresia.'
          : 'No se pudo crear la membresia.',
      });
    }
  };

  const fetchUsersForDeleteCheck = async (): Promise<BasicUser[]> => {
    const endpoints = ['/users', '/usuario', '/usuarios'];

    for (const endpoint of endpoints) {
      try {
        const res = await api.get(endpoint);
        if (Array.isArray(res.data)) {
          return res.data as BasicUser[];
        }
      } catch {
        // Try next endpoint
      }
    }

    return [];
  };

  const handleDelete = async (item: Membership) => {
    try {
      const users = await fetchUsersForDeleteCheck();
      const usersUsingMembership = users.filter(
        (u) => Number(u.membership_id) === item.id,
      );

      if (usersUsingMembership.length > 0) {
        setDeleteModal({
          visible: true,
          item,
          canDelete: false,
          message: `No puedes eliminar \"${item.name}\" porque hay ${usersUsingMembership.length} usuario(s) usando esta membresia.`,
        });
        return;
      }

      setDeleteModal({
        visible: true,
        item,
        canDelete: true,
        message: `Seguro que quieres eliminar la membresia \"${item.name}\"?`,
      });
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudo validar si la membresia esta en uso.',
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.item || !deleteModal.canDelete) return;

    try {
      await api.delete(`/memberships/${deleteModal.item.id}`);
      setDeleteModal({ visible: false, item: null, message: '', canDelete: false });
      fetchMemberships();
    } catch {
      setDeleteModal({ visible: false, item: null, message: '', canDelete: false });
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudo eliminar la membresia.',
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ visible: false, item: null, message: '', canDelete: false });
  };

  return {
    memberships,
    filteredMemberships,
    loading,
    refresh: fetchMemberships,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    membershipToEdit,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteModal,
    errorModal,
    setErrorModal,
  };
}
