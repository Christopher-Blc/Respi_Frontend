import { useState, useEffect } from 'react';
import { Pista, TipoPista } from '../types/types';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const getUniquePistasByNombre = (pistas: Pista[] = []) => {
  const seen = new Map<string, Pista>();

  pistas.forEach((pista) => {
    const normalizedNombre = pista.nombre?.trim().toLowerCase();
    const key = normalizedNombre || `pista-${pista.pista_id}`;

    if (!seen.has(key)) {
      seen.set(key, pista);
    }
  });

  return Array.from(seen.values());
};

export function useAdminCourtTypes() {
  const { t } = useTranslation();
  const [tiposPista, setTiposPista] = useState<TipoPista[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipoPistaAEditar, setTipoPistaAEditar] = useState<TipoPista | null>(
    null,
  );

  // Delete confirm modal
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    item: TipoPista | null;
    message: string;
    canDelete: boolean;
  }>({ visible: false, item: null, message: '', canDelete: false });

  // Error modal
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchTiposPista = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tipo_pista');

      const normalizedTipos: TipoPista[] = res.data.map((tipo: TipoPista) => ({
        ...tipo,
        pistas: getUniquePistasByNombre(tipo.pistas),
      }));

      setTiposPista(normalizedTipos);
    } catch {
      setErrorModal({
        visible: true,
        title: t('bookingConfirmErrorTitle'),
        message: t('adminLoadCourtTypesError'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposPista();
  }, []);

  const filteredTiposPista = tiposPista.filter((t) =>
    t.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openModal = () => {
    setTipoPistaAEditar(null);
    setNombre('');
    setModalVisible(true);
  };

  const openEditModal = (item: TipoPista) => {
    setTipoPistaAEditar(item);
    setNombre(item.nombre);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      setErrorModal({
        visible: true,
        title: t('adminRequiredFieldTitle'),
        message: t('adminCourtTypeNameRequired'),
      });
      return;
    }
    try {
      if (tipoPistaAEditar) {
        try {
          await api.patch(`/tipo_pista/${tipoPistaAEditar.tipo_pista_id}`, {
            nombre: nombre.trim(),
          });
        } catch {
          await api.put(`/tipo_pista/${tipoPistaAEditar.tipo_pista_id}`, {
            nombre: nombre.trim(),
          });
        }
      } else {
        await api.post('/tipo_pista', { nombre: nombre.trim() });
      }

      setModalVisible(false);
      setTipoPistaAEditar(null);
      setNombre('');
      fetchTiposPista();
    } catch {
      setErrorModal({
        visible: true,
        title: t('bookingConfirmErrorTitle'),
        message: tipoPistaAEditar
          ? t('adminCourtTypeUpdateError')
          : t('adminCourtTypeCreateError'),
      });
    }
  };

  const handleDelete = (item: TipoPista) => {
    const hasPistas = item.pistas && item.pistas.length > 0;
    setDeleteModal({
      visible: true,
      item,
      canDelete: !hasPistas,
      message: hasPistas
        ? t('adminTypeDeleteBlocked', {
            name: item.nombre,
            count: item.pistas.length,
          })
        : t('adminTypeDeleteConfirm', { name: item.nombre }),
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item || !deleteModal.canDelete) return;
    try {
      await api.delete(`/tipo_pista/${deleteModal.item.tipo_pista_id}`);
      setDeleteModal({ visible: false, item: null, message: '', canDelete: false });
      fetchTiposPista();
    } catch {
      setDeleteModal({ visible: false, item: null, message: '', canDelete: false });
      setErrorModal({
        visible: true,
        title: t('bookingConfirmErrorTitle'),
        message: t('adminTypeDeleteError'),
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ visible: false, item: null, message: '', canDelete: false });
  };

  return {
    tiposPista,
    filteredTiposPista,
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    nombre,
    setNombre,
    tipoPistaAEditar,
    openModal,
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
