import { useState } from 'react';
import {
  Installation,
  Court,
  WeeklyScheduleItem,
  CourtFormData,
} from '../types/types';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import {
  WEEK_DAYS,
  DEFAULT_FORM,
  createDefaultWeeklySchedule,
  isValidHour,
  hourToMinutes,
  isValidPrice,
} from './courtUtils';
import { useTranslation } from 'react-i18next';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const getImageSizeBytes = (asset: ImagePicker.ImagePickerAsset | null) => {
  if (!asset) return 0;

  const webFile = (asset as ImagePicker.ImagePickerAsset & { file?: File }).file;
  if (webFile?.size) return webFile.size;

  return asset.fileSize || 0;
};

export function useCourtForm(
  pistas: Court[],
  instalaciones: Installation[],
  fetchPistas: () => void,
) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pistaAEditar, setPistaAEditar] = useState<Court | null>(null);
  const [formData, setFormData] = useState<CourtFormData>(DEFAULT_FORM);
  const { t } = useTranslation();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(
    createDefaultWeeklySchedule(),
  );
  const [errorModal, setErrorModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: '', message: '' });
  const [samePriceMode, setSamePriceMode] = useState(false);
  const [globalPrice, setGlobalPrice] = useState('');
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const openModal = (pista: Court | null = null) => {
    setPistaAEditar(pista);
    if (pista) {
      setFormData({
        name: pista.name,
        description: pista.description,
        capacity: pista.capacity.toString(),
        is_covered: pista.is_covered,
        has_lighting: pista.has_lighting,
        status: pista.status,
        day_of_week: pista.day_of_week,
        installation_id: pista.installation_id.toString(),
        court_type_id: pista.court_type_id.toString(),
      });
      setWeeklySchedule(
        WEEK_DAYS.map((day) => {
          const existing = pistas.find(
            (p) =>
              p.name?.trim().toLowerCase() === pista.name?.trim().toLowerCase() &&
              p.day_of_week === day,
          );
          return {
            day_of_week: day,
            opening_time: existing ? existing.opening_time.substring(0, 5) : '08:00',
            closing_time: existing ? existing.closing_time.substring(0, 5) : '22:00',
            price_per_hour: existing ? existing.price_per_hour.toString() : '',
            closed: !existing,
          };
        }),
      );
      setImagen(null);
      setRemoveExistingImage(false);
    } else {
      setFormData({
        ...DEFAULT_FORM,
        installation_id:
          instalaciones[0]?.id?.toString() || DEFAULT_FORM.installation_id,
      });
      setWeeklySchedule(createDefaultWeeklySchedule());
      setImagen(null);
      setRemoveExistingImage(false);
    }
    setSamePriceMode(false);
    setGlobalPrice('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const capacity = Number(formData.capacity);
      const installationId = Number(formData.installation_id);
      const courtTypeId = Number(formData.court_type_id);
      if (!Number.isInteger(capacity) || capacity < 2 || capacity > 20) {
        setErrorModal({ visible: true, title: 'Capacidad invalida', message: 'La capacidad debe ser un numero entero entre 2 y 20.' });
        return;
      }

      if (!Number.isInteger(installationId) || installationId <= 0) {
        setErrorModal({
          visible: true,
          title: 'Instalacion obligatoria',
          message: 'Debes seleccionar una instalacion antes de guardar.',
        });
        return;
      }

      if (!Number.isInteger(courtTypeId) || courtTypeId <= 0) {
        setErrorModal({
          visible: true,
          title: 'Tipo de pista obligatorio',
          message: 'Debes seleccionar un tipo de pista antes de guardar.',
        });
        return;
      }

      const activeDays = weeklySchedule.filter((day) => !day.closed);
      if (activeDays.length === 0) {
        setErrorModal({ visible: true, title: 'Horario invalido', message: 'Debes dejar al menos un dia abierto para la pista.' });
        return;
      }

      const imageSizeBytes = getImageSizeBytes(imagen);
      if (imageSizeBytes > MAX_IMAGE_SIZE_BYTES) {
        setErrorModal({
          visible: true,
          title: 'Imagen demasiado grande',
          message: 'La imagen no puede superar los 5MB.',
        });
        return;
      }

      if (samePriceMode && !isValidPrice(globalPrice)) {
        setErrorModal({ visible: true, title: 'Precio invalido', message: 'El precio general debe ser un numero mayor que 0.' });
        return;
      }

      for (const day of activeDays) {
        if (!isValidHour(day.opening_time) || !isValidHour(day.closing_time)) {
          setErrorModal({ visible: true, title: 'Hora invalida', message: `Revisa las horas de ${day.day_of_week}. Usa formato HH:MM.` });
          return;
        }
        if (hourToMinutes(day.opening_time) === hourToMinutes(day.closing_time)) {
          setErrorModal({ visible: true, title: 'Horario invalido', message: `La hora de inicio y fin de ${day.day_of_week} no pueden ser iguales.` });
          return;
        }
        const precioAValidar = samePriceMode ? globalPrice : day.price_per_hour;
        if (!isValidPrice(precioAValidar)) {
          setErrorModal({ visible: true, title: 'Precio invalido', message: `Revisa el precio de ${day.day_of_week}. Debe ser un numero mayor que 0.` });
          return;
        }
      }

      const bodyBase = {
        name: formData.name,
        description: formData.description,
        capacity,
        is_covered: formData.is_covered,
        has_lighting: formData.has_lighting,
        installation_id: installationId,
        court_type_id: courtTypeId,
      };

      const createCourtPayload = (day: WeeklyScheduleItem) => ({
        ...bodyBase,
        ...(removeExistingImage && pistaAEditar ? { image: null } : {}),
        price_per_hour: parseFloat(
          (samePriceMode ? globalPrice : day.price_per_hour)
            .trim()
            .replace(',', '.'),
        ),
        day_of_week: day.day_of_week,
        opening_time: day.opening_time.substring(0, 5),
        closing_time: day.closing_time.substring(0, 5),
        status: 'DISPONIBLE',
      });

      const selectedWebFile = (imagen as ImagePicker.ImagePickerAsset & {
        file?: File;
      })?.file;

      const appendPayloadToFormData = (
        fd: FormData,
        payload: Record<string, any>,
      ) => {
        Object.entries(payload).forEach(([key, value]) => {
          fd.append(key, String(value));
        });
      };

      const appendSelectedImage = (fd: FormData) => {
        if (!imagen?.uri) return;

        if (selectedWebFile) {
          fd.append('image', selectedWebFile, selectedWebFile.name);
          return;
        }

        fd.append(
          'image',
          {
            uri: imagen.uri,
            name: imagen.fileName || `court_${Date.now()}.jpg`,
            type: imagen.mimeType || 'image/jpeg',
          } as any,
        );
      };

      if (pistaAEditar) {
        const existingByDay = pistas.reduce(
          (acc, p) => {
            if (p.name?.trim().toLowerCase() === pistaAEditar.name?.trim().toLowerCase()) {
              acc[p.day_of_week] = p.id;
            }
            return acc;
          },
          {} as Record<string, number>,
        );

        await Promise.all(
          activeDays.map((day) => {
            const existingId = existingByDay[day.day_of_week];
            const body = createCourtPayload(day);

            if (imagen?.uri) {
              const formPayload = new FormData();
              appendPayloadToFormData(formPayload, body);
              appendSelectedImage(formPayload);

              return existingId
                ? api.put(`/courts/${existingId}`, formPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  })
                : api.post('/courts', formPayload, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  });
            }

            return existingId
              ? api.put(`/courts/${existingId}`, body)
              : api.post('/courts', body);
          }),
        );
      } else {
        await Promise.all(
          activeDays.map((day) => {
            const body = createCourtPayload(day);

            if (imagen?.uri) {
              const formPayload = new FormData();
              appendPayloadToFormData(formPayload, body);
              appendSelectedImage(formPayload);

              return api.post('/courts', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });
            }

            return api.post('/courts', body);
          }),
        );
      }

      setModalVisible(false);
      setImagen(null);
      setRemoveExistingImage(false);
      fetchPistas();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
      const isUniqueError =
        errorMessage.toLowerCase().includes('unique') ||
        errorMessage.toLowerCase().includes('nombre') ||
        errorMessage.toLowerCase().includes('duplicat');
      setErrorModal({
        visible: true,
        title: isUniqueError
          ? t('adminCourtNameExistsTitle')
          : t('adminSaveErrorTitle'),
        message: isUniqueError
          ? t('adminCourtNameExistsMessage', { name: formData.name })
          : errorMessage,
      });
    }
  };

  const updateWeeklySchedule = <K extends keyof WeeklyScheduleItem>(
    day: Court['day_of_week'],
    field: K,
    value: WeeklyScheduleItem[K],
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item) => (item.day_of_week === day ? { ...item, [field]: value } : item)),
    );
  };

  const toggleSamePrice = (enabled: boolean, price: string = '') => {
    setSamePriceMode(enabled);
    setGlobalPrice(price);
    if (enabled && price) {
      setWeeklySchedule((prev) => prev.map((day) => ({ ...day, price_per_hour: price })));
    }
  };

  return {
    modalVisible,
    setModalVisible,
    pistaAEditar,
    formData,
    setFormData,
    weeklySchedule,
    errorModal,
    setErrorModal,
    samePriceMode,
    globalPrice,
    setGlobalPrice,
    imagen,
    setImagen,
    removeExistingImage,
    setRemoveExistingImage,
    openModal,
    handleSave,
    updateWeeklySchedule,
    toggleSamePrice,
  };
}
