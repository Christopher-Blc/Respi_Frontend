import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GlassTextInput } from '../login/glassTextInput';
import { SessionExpiredModal } from '../alert.modal';

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
      {/* boton de cancelar arriba izquierda */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: 'row',
          paddingTop: 20,
          paddingBottom: 8,
          justifyContent: 'space-between',
          backgroundColor: theme.backgroundMain,
        }}
      >
        <View style={{ paddingLeft: 20 }}>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Segoe UI',
                fontWeight: '500',
                color: theme.textTitle,
              }}
            >
              {t('commonCancel')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingRight: 20 }}>
          <TouchableOpacity onPress={handleSave} disabled={!saveActive}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Segoe UI',
                fontWeight: '500',
                color: saveActive ? theme.textTitle : theme.grayPlaceholder,
              }}
            >
              {t('commonSave')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: theme.backgroundMain,
          paddingHorizontal: 18,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            minHeight: 320,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: 140,
              top: '20%',
              alignSelf: 'center',
              opacity: 0.9,
              backgroundColor: `${theme.primaryButton}22`,
            }}
          />

          <BlurView
            tint={theme.backgroundMain === '#FFFFFF' ? 'light' : 'dark'}
            intensity={20}
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.surface,
              overflow: 'hidden',
              paddingHorizontal: 18,
              paddingVertical: 18,
              backgroundColor: `${theme.surfaceMuted}CC`,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: `${theme.primaryButton}22`,
                  marginRight: 10,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={theme.primaryButton}
                />
              </View>
              <Text
                style={{
                  fontSize: 19,
                  color: theme.textTitle,
                  fontFamily: 'Segoe UI',
                  fontWeight: '700',
                }}
              >
                {t('editUsernameTitle')}
              </Text>
            </View>

            <Text
              style={{
                color: theme.textBody,
                fontSize: 13,
                lineHeight: 19,
                marginBottom: 8,
              }}
            >
              {t('profileCurrentUsername', {
                defaultValue: 'Username actual',
              })}
            </Text>

            <GlassTextInput
              value={currentUsername || ''}
              onChangeText={() => {}}
              placeholder={t('profileUsername', { defaultValue: 'Usuario' })}
              autoComplete="username"
              readonly
            />

            <Text
              style={{
                color: theme.textBody,
                fontSize: 13,
                lineHeight: 19,
                marginBottom: 8,
                marginTop: 4,
              }}
            >
              {t('profileNewUsername', { defaultValue: 'Nuevo username' })}
            </Text>

            <GlassTextInput
              value={username}
              onChangeText={handleChangeUsername}
              placeholder={t('profileUsername', { defaultValue: 'Usuario' })}
              autoComplete="username"
            />

            <Text
              style={{
                textAlign: 'right',
                color: theme.grayPlaceholder,
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {username.length}/32
            </Text>

            <Button
              mode="contained"
              onPress={handleSave}
              disabled={!saveActive}
              loading={isSaving}
              style={{ borderRadius: 12 }}
              contentStyle={{ paddingVertical: 4 }}
            >
              <Text style={{ color: '#FFFFFF' }}>{t('commonSave')}</Text>
            </Button>
          </BlurView>
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
