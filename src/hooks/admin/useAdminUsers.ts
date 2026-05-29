import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { Membership, User } from '../../types/types';
import { UserFormData } from '../../components/admin/users/UserFormModal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AdminUser = User & {
  membership?: Membership | null;
};

type ViewMode = 'cards' | 'list';

const USERS_FILTERS_STORAGE_KEY = 'admin_users_filters_v1';

type PersistedUsersFilters = {
  searchQuery: string;
  viewMode: ViewMode;
  registrationFromFilter: string;
  registrationToFilter: string;
  roleFilter: 'ALL' | User['role'];
  activeFilter: 'ALL' | 'ACTIVE' | 'INACTIVE';
  userFilter: string;
};

const DEFAULT_PERSISTED_FILTERS: PersistedUsersFilters = {
  searchQuery: '',
  viewMode: 'cards',
  registrationFromFilter: '',
  registrationToFilter: '',
  roleFilter: 'ALL',
  activeFilter: 'ALL',
  userFilter: '',
};

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
  const [hydratedFilters, setHydratedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    DEFAULT_PERSISTED_FILTERS.searchQuery,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(
    DEFAULT_PERSISTED_FILTERS.viewMode,
  );

  const [registrationFromFilter, setRegistrationFromFilter] = useState(
    DEFAULT_PERSISTED_FILTERS.registrationFromFilter,
  );
  const [registrationToFilter, setRegistrationToFilter] = useState(
    DEFAULT_PERSISTED_FILTERS.registrationToFilter,
  );
  const [roleFilter, setRoleFilter] = useState<'ALL' | User['role']>(
    DEFAULT_PERSISTED_FILTERS.roleFilter,
  );
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'ACTIVE' | 'INACTIVE'
  >(DEFAULT_PERSISTED_FILTERS.activeFilter);
  const [userFilter, setUserFilter] = useState(
    DEFAULT_PERSISTED_FILTERS.userFilter,
  );

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

  useEffect(() => {
    const hydrateFilters = async () => {
      try {
        const raw = await AsyncStorage.getItem(USERS_FILTERS_STORAGE_KEY);
        if (!raw) {
          setHydratedFilters(true);
          return;
        }

        const parsed = JSON.parse(raw) as Partial<PersistedUsersFilters>;
        setSearchQuery(
          typeof parsed.searchQuery === 'string'
            ? parsed.searchQuery
            : DEFAULT_PERSISTED_FILTERS.searchQuery,
        );
        setViewMode(
          parsed.viewMode === 'cards' || parsed.viewMode === 'list'
            ? parsed.viewMode
            : DEFAULT_PERSISTED_FILTERS.viewMode,
        );
        setRegistrationFromFilter(
          typeof parsed.registrationFromFilter === 'string'
            ? parsed.registrationFromFilter
            : DEFAULT_PERSISTED_FILTERS.registrationFromFilter,
        );
        setRegistrationToFilter(
          typeof parsed.registrationToFilter === 'string'
            ? parsed.registrationToFilter
            : DEFAULT_PERSISTED_FILTERS.registrationToFilter,
        );
        setRoleFilter(
          parsed.roleFilter === 'ALL' ||
            parsed.roleFilter === 'SUPER_ADMIN' ||
            parsed.roleFilter === 'ADMIN' ||
            parsed.roleFilter === 'USER' ||
            parsed.roleFilter === 'CLIENTE'
            ? parsed.roleFilter
            : DEFAULT_PERSISTED_FILTERS.roleFilter,
        );
        setActiveFilter(
          parsed.activeFilter === 'ALL' ||
            parsed.activeFilter === 'ACTIVE' ||
            parsed.activeFilter === 'INACTIVE'
            ? parsed.activeFilter
            : DEFAULT_PERSISTED_FILTERS.activeFilter,
        );
        setUserFilter(
          typeof parsed.userFilter === 'string'
            ? parsed.userFilter
            : DEFAULT_PERSISTED_FILTERS.userFilter,
        );
      } catch {
        // Ignore bad persisted data and keep defaults.
      } finally {
        setHydratedFilters(true);
      }
    };

    hydrateFilters();
  }, []);

  useEffect(() => {
    if (!hydratedFilters) return;

    const persistFilters = async () => {
      const payload: PersistedUsersFilters = {
        searchQuery,
        viewMode,
        registrationFromFilter,
        registrationToFilter,
        roleFilter,
        activeFilter,
        userFilter,
      };

      try {
        await AsyncStorage.setItem(
          USERS_FILTERS_STORAGE_KEY,
          JSON.stringify(payload),
        );
      } catch {
        // Avoid blocking UI if persistence fails.
      }
    };

    persistFilters();
  }, [
    hydratedFilters,
    searchQuery,
    viewMode,
    registrationFromFilter,
    registrationToFilter,
    roleFilter,
    activeFilter,
    userFilter,
  ]);

  const clearFilters = () => {
    setRegistrationFromFilter('');
    setRegistrationToFilter('');
    setRoleFilter('ALL');
    setActiveFilter('ALL');
    setUserFilter('');
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const qUser = userFilter.trim().toLowerCase();

    return users.filter((user) => {
      if (q) {
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
        if (!text.includes(q)) return false;
      }

      if (qUser) {
        const userText = [user.username, user.name, user.surname, user.email]
          .join(' ')
          .toLowerCase();
        if (!userText.includes(qUser)) return false;
      }

      const regDate = (user.registration_date || '').slice(0, 10);
      if (registrationFromFilter && regDate < registrationFromFilter) return false;
      if (registrationToFilter && regDate > registrationToFilter) return false;

      if (roleFilter !== 'ALL' && user.role !== roleFilter) return false;

      if (activeFilter === 'ACTIVE' && !user.is_active) return false;
      if (activeFilter === 'INACTIVE' && user.is_active) return false;

      return true;
    });
  }, [
    users,
    searchQuery,
    userFilter,
    registrationFromFilter,
    registrationToFilter,
    roleFilter,
    activeFilter,
  ]);

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
    if (!formData.username.trim()) return 'El username es obligatorio.';
    if (!formData.name.trim()) return 'El nombre es obligatorio.';
    if (!formData.surname.trim()) return 'El apellido es obligatorio.';
    if (!formData.email.trim()) return 'El email es obligatorio.';
    if (!formData.fecha_nacimiento.trim()) return 'La fecha de nacimiento es obligatoria.';
    if (!formData.direccion.trim()) return 'La direccion es obligatoria.';
    if (!userToEdit && !formData.password.trim()) {
      return 'La password es obligatoria.';
    }
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
        const password = formData.password.trim();
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
        if (password) payload.password = password;

        if (Object.keys(payload).length > 0) {
          const updateUrl = `/users/${userToEdit.id}`;
          await api.put(updateUrl, payload);
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
    refresh: fetchUsers,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    registrationFromFilter,
    setRegistrationFromFilter,
    registrationToFilter,
    setRegistrationToFilter,
    roleFilter,
    setRoleFilter,
    activeFilter,
    setActiveFilter,
    userFilter,
    setUserFilter,
    clearFilters,
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