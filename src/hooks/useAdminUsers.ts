import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { Membership, User } from '../types/types';
import { UserFormData } from '../components/admin/users/UserFormModal';
import axios from 'axios';

type AdminUser = User & {
  membership?: Membership | null;
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
  email_verified: false,
  fecha_nacimiento: '',
  direccion: '',
  membresia_id: '',
};

const normalizeDateOnly = (value?: string | null) => {
  if (!value) return '';
  return String(value).slice(0, 10);
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;

  const backendMessage = error.response?.data?.message;
  if (Array.isArray(backendMessage)) return backendMessage.join(' | ');
  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage;
  }

  return fallback;
};

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
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
        api.get<AdminUser[]>('/users'),
        api.get('/memberships'),
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
        user.membership?.name || '',
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
      isActive: Boolean(user.is_active),
      email_verified: Boolean(user.email_verified),
      fecha_nacimiento: normalizeDateOnly(user.date_of_birth),
      direccion: user.address || '',
      membresia_id: user.membership_id ? String(user.membership_id) : '',
    });
    setModalVisible(true);
  };

  const validateForm = () => {
    if (userToEdit) return null;

    if (!formData.username.trim()) return 'El username es obligatorio.';
    if (!formData.name.trim()) return 'El nombre es obligatorio.';
    if (!formData.surname.trim()) return 'El apellido es obligatorio.';
    if (!formData.email.trim()) return 'El email es obligatorio.';
    if (!formData.fecha_nacimiento.trim()) return 'La fecha de nacimiento es obligatoria.';
    if (!formData.direccion.trim()) return 'La direccion es obligatoria.';
    if (!formData.password.trim()) return 'La password es obligatoria.';
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
        const payload: Record<string, unknown> = {};
        const username = formData.username.trim();
        const name = formData.name.trim();
        const surname = formData.surname.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();
        const fechaNacimiento = formData.fecha_nacimiento.trim();
        const direccion = formData.direccion.trim();
        const membresiaId = formData.membresia_id
          ? Number(formData.membresia_id)
          : null;
        const currentMembresiaId =
          userToEdit.membership_id === undefined || userToEdit.membership_id === null
            ? null
            : Number(userToEdit.membership_id);
        const currentRole =
          userToEdit.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'CLIENTE';
        const currentFechaNacimiento = (userToEdit.date_of_birth || '').slice(0, 10);

        if (username !== (userToEdit.username || '')) payload.username = username;
        if (name !== (userToEdit.name || '')) payload.name = name;
        if (surname !== (userToEdit.surname || '')) payload.surname = surname;
        if (email !== (userToEdit.email || '')) payload.email = email;
        if (phone !== (userToEdit.phone || '')) payload.phone = phone;
        if (fechaNacimiento !== currentFechaNacimiento) {
          payload.date_of_birth = fechaNacimiento;
        }
        if (direccion !== (userToEdit.address || '')) payload.address = direccion;
        if (membresiaId !== currentMembresiaId) {
          payload.membership_id = membresiaId;
        }
        if (formData.role !== currentRole) payload.role = formData.role;
        if (formData.isActive !== Boolean(userToEdit.is_active)) {
          payload.is_active = formData.isActive;
        }
        if (formData.email_verified !== Boolean(userToEdit.email_verified)) {
          payload.email_verified = formData.email_verified;
        }

        if (Object.keys(payload).length > 0) {
          const updateUrl = `/users/${userToEdit.id}`;
          const res = await api.put(updateUrl, payload);  
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
          email_verified: formData.email_verified,
          fecha_nacimiento: formData.fecha_nacimiento.trim(),
          direccion: formData.direccion.trim(),
        };

        await api.post('/users', payload);
       }
      await fetchUsers();
      setModalVisible(false);
       setUserToEdit(null);
      setFormData(EMPTY_FORM); 
    } catch (err){
       setErrorModal({
        visible: true,
        title: 'Error',
        message: getApiErrorMessage(
          err,
          userToEdit
            ? 'No se pudo actualizar el usuario.'
            : 'No se pudo crear el usuario.',
        ),
      });
    }
  };

  const handleToggleActive = (user: AdminUser) => {
    setPendingUser(user);
    setConfirmModal({
      visible: true,
      title: user.is_active ? 'Desactivar usuario' : 'Activar usuario',
      message: user.is_active
        ? `Seguro que quieres desactivar a "${user.username}"?`
        : `Seguro que quieres activar a "${user.username}"?`,
      onConfirmType: 'toggle-active',
    });
  };

  const confirmAction = async () => {
    if (confirmModal.onConfirmType !== 'toggle-active' || !pendingUser) return;

    try {
      const updateUrl = `/users/${pendingUser.id}`;
      const payload = {
        is_active: !pendingUser.is_active,
      };

      await api.put(updateUrl, payload);

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
