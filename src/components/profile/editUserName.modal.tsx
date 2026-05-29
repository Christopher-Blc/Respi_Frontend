import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { GlassTextInput } from '../login/glassTextInput';
import { SessionExpiredModal } from '../general/alert.modal';
import createModalCommonStyles from '../../style/general/modalCommon.styles';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
  currentUsername?: string;
  onUpdated?: (username: string) => void | Promise<void>;
}

export default function EditUserNameModal({
  visible,
  onClose,
  currentUsername,
  onUpdated,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createModalCommonStyles(theme), [theme]);
  const [username, setUsername] = useState(currentUsername || '');
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: '',
    message: '',
    closeParent: false,
  });

  useEffect(() => {
    if (visible) {
      setUsername(currentUsername || '');
    }
  }, [visible, currentUsername]);

  const saveActive = useMemo(() => {
    const trimmed = username.trim();
    const currentTrimmed = (currentUsername || '').trim();
    return trimmed.length > 0 && trimmed !== currentTrimmed && !isSaving;
  }, [username, currentUsername, isSaving]);

  const handleSave = async () => {
    if (!saveActive) return;

    const trimmedUsername = username.trim();

    try {
      setIsSaving(true);
      await api.put('/users/profile/update', { username: trimmedUsername });
      await onUpdated?.(trimmedUsername);
      setFeedbackModal({
        visible: true,
        title: t('commonSave', { defaultValue: 'Guardar' }),
        message: t('profileUsernameUpdatedMessage', {
          defaultValue: 'Nombre de usuario actualizado correctamente.',
        }),
        closeParent: true,
      });
    } catch (error) {
      console.error('Error updating username:', error);
      setFeedbackModal({
        visible: true,
        title: t('authConnectionError', { defaultValue: 'Error' }),
        message: t('bookingCreateError', {
          defaultValue: 'No se pudo guardar el cambio',
        }),
        closeParent: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedbackConfirm = () => {
    const shouldCloseParent = feedbackModal.closeParent;
    setFeedbackModal({
      visible: false,
      title: '',
      message: '',
      closeParent: false,
    });

    if (shouldCloseParent) {
      onClose();
    }
  };

  const handleChangeUsername = (text: string) => {
    setUsername(text.slice(0, 32));
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerText}>{t('commonCancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} disabled={!saveActive}>
            <Text
              style={[
                styles.headerText,
                saveActive ? styles.saveText : undefined,
              ]}
            >
              {t('commonSave')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.titleIcon,
                { backgroundColor: `${theme.primaryButton}22` },
              ]}
            >
              <Ionicons name="person-outline" size={22} color={theme.surface} />
            </View>
            <Text style={styles.titleText}>{t('editUsernameTitle')}</Text>
          </View>

          <Text style={styles.description}>
            {t('profileCurrentUsername', {
              defaultValue: 'Nombre de usuario actual',
            })}
          </Text>

          <GlassTextInput
            value={currentUsername || ''}
            onChangeText={() => {}}
            placeholder={t('profileUsername', { defaultValue: 'Usuario' })}
            autoComplete="username"
            readonly
          />

          <Text style={[styles.inputLabel, { marginTop: 4 }]}>
            {t('profileNewUsername', {
              defaultValue: 'Nuevo nombre de usuario',
            })}
          </Text>

          <GlassTextInput
            value={username}
            onChangeText={handleChangeUsername}
            placeholder={t('profileUsername', { defaultValue: 'Usuario' })}
            autoComplete="username"
          />

          <Text style={styles.inputCounter}>{username.length}/32</Text>
        </View>
      </View>

      <SessionExpiredModal
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        confirmText={t('commonUnderstood', { defaultValue: 'Entendido' })}
        onConfirm={handleFeedbackConfirm}
      />
    </Modal>
  );
}
