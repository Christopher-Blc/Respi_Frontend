import { useEffect, useMemo, useState } from 'react';
import { Membresia } from '../types/types';
import api from '../services/api';

type MembershipFormData = {
  rango: string;
  tipo: string;
  descuento: string;
  reservas_requeridas: string;
  beneficios: string;
};

type DeleteModalState = {
  visible: boolean;
  item: Membresia | null;
  message: string;
  canDelete: boolean;
};

type BasicUser = {
  usuario_id?: number;
  user_id?: number;
  membresia_id?: number | null;
};

const EMPTY_FORM: MembershipFormData = {
  rango: '',
  tipo: '',
  descuento: '',
  reservas_requeridas: '',
  beneficios: '',
};

export function useAdminMemberships() {
  const [memberships, setMemberships] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [membershipToEdit, setMembershipToEdit] = useState<Membresia | null>(
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
      const res = await api.get('/membresia');
      const rows = Array.isArray(res.data) ? res.data : [];
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
      const text = `${m.tipo} ${m.beneficios} ${m.rango}`.toLowerCase();
      return text.includes(q);
    });
  }, [memberships, searchQuery]);

  const openCreateModal = () => {
    setMembershipToEdit(null);
    setFormData(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEditModal = (item: Membresia) => {
    setMembershipToEdit(item);
    setFormData({
      rango: String(item.rango),
      tipo: item.tipo,
      descuento: String(item.descuento),
      reservas_requeridas: String(item.reservas_requeridas),
      beneficios: item.beneficios,
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    const rango = Number(formData.rango);
    const descuento = Number(formData.descuento);
    const reservas = Number(formData.reservas_requeridas);

    if (!formData.tipo.trim()) return 'El nombre del tipo es obligatorio.';
    if (!Number.isFinite(rango) || rango <= 0)
      return 'El rango debe ser un numero mayor a 0.';
    if (!Number.isFinite(descuento) || descuento < 0 || descuento >= 100)
      return 'El descuento debe estar entre 0 y 99.';
    if (!Number.isFinite(reservas) || reservas < 0)
      return 'Las reservas requeridas no pueden ser negativas.';
    if (!formData.beneficios.trim()) return 'Los beneficios son obligatorios.';

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
      rango: String(Number(formData.rango)),
      tipo: formData.tipo.trim(),
      descuento: Number(formData.descuento),
      reservas_requeridas: Number(formData.reservas_requeridas),
      beneficios: formData.beneficios.trim(),
    };

    try {
      if (membershipToEdit) {
        try {
          await api.patch(`/membresia/${membershipToEdit.membresia_id}`, payload);
        } catch {
          await api.put(`/membresia/${membershipToEdit.membresia_id}`, payload);
        }
      } else {
        await api.post('/membresia', payload);
      }

      setModalVisible(false);
      setMembershipToEdit(null);
      setFormData(EMPTY_FORM);
      fetchMemberships();
    } catch {
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

  const handleDelete = async (item: Membresia) => {
    try {
      const users = await fetchUsersForDeleteCheck();
      const usersUsingMembership = users.filter(
        (u) => Number(u.membresia_id) === item.membresia_id,
      );

      if (usersUsingMembership.length > 0) {
        setDeleteModal({
          visible: true,
          item,
          canDelete: false,
          message: `No puedes eliminar \"${item.tipo}\" porque hay ${usersUsingMembership.length} usuario(s) usando esta membresia.`,
        });
        return;
      }

      setDeleteModal({
        visible: true,
        item,
        canDelete: true,
        message: `Seguro que quieres eliminar la membresia \"${item.tipo}\"?`,
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
      await api.delete(`/membresia/${deleteModal.item.membresia_id}`);
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
