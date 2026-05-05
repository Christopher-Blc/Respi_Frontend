import { useState, useEffect } from 'react';
import { Pista, TipoPista } from '../types/types';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const MAX_IMAGE_SIZE_BYTES = 950 * 1024;

const getImageSizeBytes = (asset: ImagePicker.ImagePickerAsset | null) => {
  if (!asset) return 0;

  const webFile = (asset as ImagePicker.ImagePickerAsset & { file?: File }).file;
  if (webFile?.size) return webFile.size;

  return asset.fileSize || 0;
};

const compressWebImageFile = async (
  file: File,
  quality = 0.7,
  maxWidth = 1400,
): Promise<File> => {
  if (typeof window === 'undefined') return file;

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
      img.src = imageUrl;
    });

    const scale = Math.min(1, maxWidth / image.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(image.width * scale));
    canvas.height = Math.max(1, Math.floor(image.height * scale));

    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    if (!blob) return file;

    const safeName = file.name.replace(/\.[^/.]+$/, '.jpg');
    return new File([blob], safeName, { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

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
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );
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
      const res = await api.get('/tipo_court');

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
    setImagen(null);
    setModalVisible(true);
  };

  const openEditModal = (item: TipoPista) => {
    setTipoPistaAEditar(item);
    setNombre(item.nombre);
    setImagen(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTipoPistaAEditar(null);
    setNombre('');
    setImagen(null);
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

    if (!tipoPistaAEditar && !imagen) {
      setErrorModal({
        visible: true,
        title: t('adminRequiredFieldTitle'),
        message: 'Debes seleccionar una imagen para crear el tipo de pista.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre.trim());

    if (imagen?.uri) {
      const webFile = (imagen as ImagePicker.ImagePickerAsset & { file?: File })
        .file;

      if (webFile) {
        let fileToUpload = webFile;

        if (fileToUpload.size > MAX_IMAGE_SIZE_BYTES) {
          fileToUpload = await compressWebImageFile(fileToUpload, 0.68, 1280);
        }

        if (fileToUpload.size > MAX_IMAGE_SIZE_BYTES) {
          setErrorModal({
            visible: true,
            title: t('bookingConfirmErrorTitle'),
            message:
              'La imagen sigue siendo muy pesada. Usa una imagen más ligera (idealmente menor a 1MB).',
          });
          return;
        }

        formData.append('imagen', fileToUpload, fileToUpload.name);
        // Backend DTO validates imagen as string, so we send a mirror text field too.
        formData.append('imagen', fileToUpload.name);
      } else {
        const imageSizeBytes = getImageSizeBytes(imagen);
        if (imageSizeBytes > MAX_IMAGE_SIZE_BYTES) {
          setErrorModal({
            visible: true,
            title: t('bookingConfirmErrorTitle'),
            message:
              'La imagen es demasiado grande. Usa una imagen menor de 1MB para evitar errores de subida.',
          });
          return;
        }

        formData.append(
          'imagen',
          {
            uri: imagen.uri,
            name: imagen.fileName || `tipo_pista_${Date.now()}.jpg`,
            type: imagen.mimeType || 'image/jpeg',
          } as any,
        );
        // Keep DTO validation happy when it expects imagen as string.
        formData.append('imagen', imagen.fileName || `tipo_pista_${Date.now()}.jpg`);
      }
    } else if (tipoPistaAEditar?.imagen) {
      // If no new file is selected (edit mode), keep imagen as string for DTO validation.
      formData.append('imagen', tipoPistaAEditar.imagen);
    }

    try {
      if (tipoPistaAEditar) {
        await api.put(`/tipo_court/${tipoPistaAEditar.tipo_pista_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/tipo_court', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      closeModal();
      fetchTiposPista();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Error creating/updating tipo_pista:', error.response?.data);

        if (error.response?.status === 413) {
          setErrorModal({
            visible: true,
            title: t('bookingConfirmErrorTitle'),
            message:
              'La imagen supera el tamaño permitido por el servidor. Prueba con una imagen más ligera.',
          });
          return;
        }
      }

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
      await api.delete(`/tipo_court/${deleteModal.item.tipo_pista_id}`);
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
    closeModal,
    nombre,
    setNombre,
    imagen,
    setImagen,
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
