import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Installation } from '../types/types';

type InstallationFormData = {
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  status: string;
};

type DeleteModalState = {
  visible: boolean;
  item: Installation | null;
  message: string;
};

const EMPTY_FORM: InstallationFormData = {
  name: '',
  address: '',
  phone: '',
  email: '',
  description: '',
  status: 'activa',
};

const INSTALLATION_POST_ENDPOINT = '/Installation';

const getRowsFromResponse = (data: any): Installation[] => {
  if (Array.isArray(data)) return data as Installation[];
  if (Array.isArray(data?.data)) return data.data as Installation[];
  if (Array.isArray(data?.items)) return data.items as Installation[];
  return [];
};

const getInstallationId = (item: Installation) => Number(item.id);

const isSuccessStatus = (status: number) => status >= 200 && status < 300;

const normalizeEstado = (value: string): 'activa' | 'inactiva' | undefined => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === 'activa' || normalized === 'inactiva') return normalized;
  return undefined;
};

export function useAdminInstallations() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [installationToEdit, setInstallationToEdit] = useState<Installation | null>(
    null,
  );
  const [formData, setFormData] = useState<InstallationFormData>(EMPTY_FORM);

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    visible: false,
    item: null,
    message: '',
  });

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Installation');
      const rows = getRowsFromResponse(response?.data);
      if (rows.length > 0) {
        setInstallations(rows);
        return;
      }
      
      setInstallations([]);
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudieron cargar las instalaciones.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  const filteredInstallations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return installations;

    return installations.filter((item) => {
      const text = [
        item.name,
        item.address,
        item.phone,
        item.email,
        item.description,
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(query);
    });
  }, [installations, searchQuery]);

  const openCreateModal = () => {
    setInstallationToEdit(null);
    setFormData(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEditModal = (item: Installation) => {
    setInstallationToEdit(item);
    setFormData({
      name: item.name || '',
      address: item.address || '',
      phone: item.phone || '',
      email: item.email || '',
      description: item.description || '',
      status: item.status || 'activa',
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    const estado = normalizeEstado(formData.status);

    if (!formData.name.trim()) return 'El nombre es obligatorio.';
    if (!formData.address.trim()) return 'La direccion es obligatoria.';
    if (formData.status.trim() && !estado) {
      return 'El estado debe ser activa o inactiva.';
    }

    if (formData.email.trim()) {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      );
      if (!isValidEmail) return 'El email no tiene un formato valido.';
    }

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

    const estado = normalizeEstado(formData.status);

    const payload: {
      name: string;
      address: string;
      phone: string;
      email: string;
      description: string;
      status?: 'activa' | 'inactiva';
    } = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      description: formData.description.trim(),
    };

    if (estado) {
      payload.status = estado;
    }

    try {
      if (installationToEdit) {
        const installationId = getInstallationId(installationToEdit);
        const response = await api.put(`/Installation/${installationId}`, payload);

        if (!isSuccessStatus(response.status)) {
          throw new Error('No se pudo actualizar la instalacion.');
        }
      } else {
        const response = await api.post(INSTALLATION_POST_ENDPOINT, payload);
        if (!isSuccessStatus(response.status)) {
          throw new Error('No se pudo crear la instalacion.');
        }
      }

      setModalVisible(false);
      setInstallationToEdit(null);
      setFormData(EMPTY_FORM);
      fetchInstallations();
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: installationToEdit
          ? 'No se pudo actualizar la instalacion.'
          : 'No se pudo crear la instalacion.',
      });
    }
  };

  const handleDelete = (item: Installation) => {
    setDeleteModal({
      visible: true,
      item,
      message: `Seguro que quieres eliminar la instalacion "${item.name}"?`,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    const installationId = getInstallationId(deleteModal.item);

    try {
      const response = await api.delete(`/Installation/${installationId}`);
      if (!isSuccessStatus(response.status)) {
        throw new Error('No se pudo eliminar la instalacion.');
      }

      setDeleteModal({ visible: false, item: null, message: '' });
      fetchInstallations();
    } catch {
      setDeleteModal({ visible: false, item: null, message: '' });
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudo eliminar la instalacion.',
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ visible: false, item: null, message: '' });
  };

  return {
    installations,
    filteredInstallations,
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    installationToEdit,
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
