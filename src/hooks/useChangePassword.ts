import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { profileService } from '../services/profileService';

function isPasswordValid(pwd: string): boolean {
  return (
    pwd.length >= 8 &&
    pwd.length <= 128 &&
    /[a-z]/.test(pwd) &&
    /[A-Z]/.test(pwd) &&
    /\d/.test(pwd) &&
    /[!@#$%&*_\-+=\[\]{};:'",.<>?/\\|`~^()]/.test(pwd)
  );
}

export const useChangePassword = (visible: boolean) => {
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: '',
    message: '',
    closeParent: false,
  });

  // Animación de reveal del bloque nueva contraseña
  const newSectionAnim = useRef(new Animated.Value(0)).current;

  // Resetear todo al abrir/cerrar
  useEffect(() => {
    if (visible) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      newSectionAnim.setValue(0);
    }
  }, [visible]);

  // Revelar/ocultar bloque de nueva contraseña según si se ha escrito la actual
  useEffect(() => {
    Animated.timing(newSectionAnim, {
      toValue: currentPassword.length > 0 ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [currentPassword]);

  const passwordValid = useMemo(() => isPasswordValid(newPassword), [newPassword]);
  const passwordsMatch = newPassword === confirmPassword;

  const saveActive =
    currentPassword.length > 0 &&
    passwordValid &&
    confirmPassword.length > 0 &&
    passwordsMatch &&
    !isSaving;

  const handleSave = async () => {
    if (!saveActive) return;
    try {
      setIsSaving(true);
      await profileService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setFeedbackModal({
        visible: true,
        title: t('commonSave', { defaultValue: 'Guardar' }),
        message: t('profilePasswordUpdatedMessage', {
          defaultValue: 'Contraseña actualizada correctamente.',
        }),
        closeParent: true,
      });
    } catch (error) {
      const isWrongPassword =
        axios.isAxiosError(error) &&
        (error.response?.status === 400 || error.response?.status === 401);
      setFeedbackModal({
        visible: true,
        title: t('authConnectionError', { defaultValue: 'Error' }),
        message: isWrongPassword
          ? t('profilePasswordWrongCurrent', {
              defaultValue: 'La contraseña actual es incorrecta.',
            })
          : t('bookingCreateError', {
              defaultValue: 'No se pudo guardar el cambio',
            }),
        closeParent: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const dismissFeedback = () => {
    setFeedbackModal({ visible: false, title: '', message: '', closeParent: false });
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isSaving,
    saveActive,
    passwordValid,
    passwordsMatch,
    newSectionAnim,
    feedbackModal,
    handleSave,
    dismissFeedback,
  };
};
