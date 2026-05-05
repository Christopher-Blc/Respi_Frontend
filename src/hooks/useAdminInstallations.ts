import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Instalacion } from '../types/types';

type InstallationFormData = {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  estado: string;
};

type DeleteModalState = {
  visible: boolean;
  item: Instalacion | null;
  message: string;
};

const EMPTY_FORM: InstallationFormData = {
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
  descripcion: '',
  estado: 'activa',
};

const INSTALLATION_POST_ENDPOINT = '/Installation';

const getRowsFromResponse = (data: any): Instalacion[] => {
  if (Array.isArray(data)) return data as Instalacion[];
  if (Array.isArray(data?.data)) return data.data as Instalacion[];
  if (Array.isArray(data?.items)) return data.items as Instalacion[];
  return [];
};

const getInstallationId = (item: Instalacion) =>
  Number((item as any)?.instalacion_id ?? (item as any)?.id);

const isSuccessStatus = (status: number) => status >= 200 && status < 300;

const normalizeEstado = (value: string): 'activa' | 'inactiva' | undefined => {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (normalized === 'activa' || normalized === 'inactiva') return normalized;
  return undefined;
};

export function useAdminInstallations() {
  const [installations, setInstallations] = useState<Instalacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [installationToEdit, setInstallationToEdit] = useState<Instalacion | null>(
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
        item.nombre,
        item.direccion,
        item.telefono,
        item.email,
        item.descripcion,
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

  const openEditModal = (item: Instalacion) => {
    setInstallationToEdit(item);
    setFormData({
      nombre: item.nombre || '',
      direccion: item.direccion || '',
      telefono: item.telefono || '',
      email: item.email || '',
      descripcion: item.descripcion || '',
      estado: item.estado || 'activa',
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    const estado = normalizeEstado(formData.estado);

    if (!formData.nombre.trim()) return 'El nombre es obligatorio.';
    if (!formData.direccion.trim()) return 'La direccion es obligatoria.';
    if (formData.estado.trim() && !estado) {
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

    const estado = normalizeEstado(formData.estado);

    const payload: {
      nombre: string;
      direccion: string;
      telefono: string;
      email: string;
      descripcion: string;
      estado?: 'activa' | 'inactiva';
    } = {
      nombre: formData.nombre.trim(),
      direccion: formData.direccion.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      descripcion: formData.descripcion.trim(),
    };

    if (estado) {
      payload.estado = estado;
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

  const handleDelete = (item: Instalacion) => {
    setDeleteModal({
      visible: true,
      item,
      message: `Seguro que quieres eliminar la instalacion "${item.nombre}"?`,
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
