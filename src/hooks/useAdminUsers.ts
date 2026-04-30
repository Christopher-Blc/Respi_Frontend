import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Membresia, User } from '../types/types';
import { UserFormData } from '../components/admin/users/UserFormModal';

type AdminUser = User & {
  membresia?: Membresia | null;
};

type ViewMode = 'cards' | 'list';

const EMPTY_FORM: UserFormData = {
  username: '',
  name: '',
  surname: '',
  email: '',
  phone: '',
  password: '',
  role: 'CLIENTE',
  isActive: true,
  fecha_nacimiento: '',
  direccion: '',
  membresia_id: '',
};

const USER_ENDPOINTS = ['/users', '/usuario', '/usuarios'];

async function requestWithFallback<T>(
  method: 'get' | 'post' | 'put' | 'patch',
  pathSuffix = '',
  data?: unknown,
) {
  let lastError: unknown;

  for (const endpoint of USER_ENDPOINTS) {
    try {
      if (method === 'get') return await api.get<T>(`${endpoint}${pathSuffix}`);
      if (method === 'post') return await api.post<T>(endpoint, data);
      if (method === 'put') return await api.put<T>(`${endpoint}${pathSuffix}`, data);
      return await api.patch<T>(`${endpoint}${pathSuffix}`, data);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [memberships, setMemberships] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const [modalVisible, setModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);

  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirmType: '' as '' | 'toggle-active',
  });

  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [usersRes, membershipsRes] = await Promise.all([
        requestWithFallback<AdminUser[]>('get'),
        api.get('/membresia'),
      ]);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setMemberships(Array.isArray(membershipsRes.data) ? membershipsRes.data : []);
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: 'No se pudieron cargar los usuarios.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) => {
      const text = [
        user.username,
        user.name,
        user.surname,
        user.email,
        user.phone,
        user.role,
        user.membresia?.tipo || '',
      ]
        .join(' ')
        .toLowerCase();

      return text.includes(q);
    });
  }, [users, searchQuery]);

  const openCreateModal = () => {
    setUserToEdit(null);
    setFormData(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEditModal = (user: AdminUser) => {
    setUserToEdit(user);
    setFormData({
      username: user.username || '',
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'CLIENTE',
      isActive: Boolean(user.isActive),
      fecha_nacimiento: user.fecha_nacimiento || '',
      direccion: user.direccion || '',
      membresia_id: user.membresia_id ? String(user.membresia_id) : '',
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!formData.username.trim()) return 'El username es obligatorio.';
    if (!formData.name.trim()) return 'El nombre es obligatorio.';
    if (!formData.surname.trim()) return 'El apellido es obligatorio.';
    if (!formData.email.trim()) return 'El email es obligatorio.';
    if (!formData.fecha_nacimiento.trim()) return 'La fecha de nacimiento es obligatoria.';
    if (!formData.direccion.trim()) return 'La direccion es obligatoria.';
    if (!userToEdit && !formData.password.trim()) return 'La password es obligatoria.';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorModal({ visible: true, title: 'Campo invalido', message: validationError });
      return;
    }

    try {
      if (userToEdit) {
        const payload = {
          username: formData.username.trim(),
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          membresia_id: formData.membresia_id ? Number(formData.membresia_id) : null,
          role: formData.role,
          isActive: formData.isActive,
          fecha_nacimiento: formData.fecha_nacimiento.trim(),
          direccion: formData.direccion.trim(),
        };

        try {
          await requestWithFallback('patch', `/${userToEdit.usuario_id}`, payload);
        } catch {
          await requestWithFallback('put', `/${userToEdit.usuario_id}`, payload);
        }
      } else {
        const payload = {
          username: formData.username.trim(),
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive,
          fecha_nacimiento: formData.fecha_nacimiento.trim(),
          direccion: formData.direccion.trim(),
          membresia_id: formData.membresia_id ? Number(formData.membresia_id) : null,
        };

        await requestWithFallback('post', '', payload);
      }

      setModalVisible(false);
      setUserToEdit(null);
      setFormData(EMPTY_FORM);
      fetchUsers();
    } catch {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: userToEdit ? 'No se pudo actualizar el usuario.' : 'No se pudo crear el usuario.',
      });
    }
  };

  const handleToggleActive = (user: AdminUser) => {
    setPendingUser(user);
    setConfirmModal({
      visible: true,
      title: user.isActive ? 'Desactivar usuario' : 'Activar usuario',
      message: user.isActive
        ? `Seguro que quieres desactivar a \"${user.username}\"?`
        : `Seguro que quieres activar a \"${user.username}\"?`,
      onConfirmType: 'toggle-active',
    });
  };

  const confirmAction = async () => {
    if (confirmModal.onConfirmType !== 'toggle-active' || !pendingUser) return;

    try {
      const payload = {
        username: pendingUser.username,
        name: pendingUser.name,
        surname: pendingUser.surname,
        email: pendingUser.email,
        phone: pendingUser.phone,
        membresia_id: pendingUser.membresia_id,
        role: pendingUser.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'CLIENTE',
        isActive: !pendingUser.isActive,
        fecha_nacimiento: pendingUser.fecha_nacimiento,
        direccion: pendingUser.direccion,
      };

      try {
        await requestWithFallback('patch', `/${pendingUser.usuario_id}`, payload);
      } catch {
        await requestWithFallback('put', `/${pendingUser.usuario_id}`, payload);
      }

      setConfirmModal({ visible: false, title: '', message: '', onConfirmType: '' });
      setPendingUser(null);
      fetchUsers();
    } catch {
      setConfirmModal({ visible: false, title: '', message: '', onConfirmType: '' });
      setPendingUser(null);
      setErrorModal({ visible: true, title: 'Error', message: 'No se pudo cambiar el estado del usuario.' });
    }
  };

  const cancelConfirm = () => {
    setConfirmModal({ visible: false, title: '', message: '', onConfirmType: '' });
    setPendingUser(null);
  };

  return {
    filteredUsers,
    memberships,
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    modalVisible,
    setModalVisible,
    userToEdit,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    handleSave,
    handleToggleActive,
    confirmModal,
    confirmAction,
    cancelConfirm,
    errorModal,
    setErrorModal,
  };
}
