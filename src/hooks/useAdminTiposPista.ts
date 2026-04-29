import { useState, useEffect } from 'react';
import { Pista, TipoPista } from '../types/types';
import api from '../services/api';

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

export function useAdminTiposPista() {
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
        title: 'Error',
        message: 'No se pudieron cargar los tipos de pista.',
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
        title: 'Campo requerido',
        message: 'El nombre del tipo de pista no puede estar vacío.',
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
        title: 'Error',
        message: tipoPistaAEditar
          ? 'No se pudo actualizar el tipo de pista.'
          : 'No se pudo crear el tipo de pista.',
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
        ? `No puedes eliminar "${item.nombre}" porque tiene ${item.pistas.length} pista(s) asociada(s). Elimina primero las pistas.`
        : `¿Seguro que quieres eliminar el tipo "${item.nombre}"?`,
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
        title: 'Error',
        message: 'No se pudo eliminar el tipo de pista.',
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
