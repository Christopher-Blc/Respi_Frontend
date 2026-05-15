import React from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { GlassTextInputPassword } from '../login/glassTextInputPassword';
import { PasswordStrengthIndicator } from '../login/passwordStrengthIndicator';
import { SessionExpiredModal } from '../alert.modal';
import { useChangePassword } from '../../hooks/useChangePassword';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EditPasswordModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isSaving,
    saveActive,
    passwordsMatch,
    newSectionAnim,
    feedbackModal,
    handleSave,
    dismissFeedback,
  } = useChangePassword(visible);

  const handleFeedbackConfirm = () => {
    const shouldClose = feedbackModal.closeParent;
    dismissFeedback();
    if (shouldClose) onClose();
  };

  const newSectionStyle = {
    opacity: newSectionAnim,
    transform: [
      {
        translateY: newSectionAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/* Barra superior Cancel / Save */}
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

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.backgroundMain }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 18,
            paddingTop: 70,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: '100%', maxWidth: 420 }}>
            {/* Blob decorativo de fondo */}
            <View
              style={{
                position: 'absolute',
                width: 280,
                height: 280,
                borderRadius: 140,
                top: '10%',
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
              {/* Cabecera del card */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
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
                    name="lock-closed-outline"
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
                  {t('editPasswordTitle', { defaultValue: 'Cambiar contraseña' })}
                </Text>
              </View>

              {/* Campo: contraseña actual */}
              <Text
                style={{
                  color: theme.textBody,
                  fontSize: 13,
                  lineHeight: 19,
                  marginBottom: 8,
                }}
              >
                {t('profileCurrentPassword', { defaultValue: 'Contraseña actual' })}
              </Text>
              <GlassTextInputPassword
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder={t('examplePassword')}
                autoComplete="current-password"
              />

              {/* Bloque animado: nueva contraseña + confirmar */}
              <Animated.View style={newSectionStyle}>
                <Text
                  style={{
                    color: theme.textBody,
                    fontSize: 13,
                    lineHeight: 19,
                    marginBottom: 8,
                    marginTop: 4,
                  }}
                >
                  {t('profileNewPassword', { defaultValue: 'Nueva contraseña' })}
                </Text>
                <GlassTextInputPassword
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder={t('examplePassword')}
                  autoComplete="new-password"
                />

                <PasswordStrengthIndicator password={newPassword} />

                <Text
                  style={{
                    color: theme.textBody,
                    fontSize: 13,
                    lineHeight: 19,
                    marginBottom: 8,
                  }}
                >
                  {t('profileConfirmPassword', {
                    defaultValue: 'Confirmar nueva contraseña',
                  })}
                </Text>
                <GlassTextInputPassword
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t('examplePassword')}
                  autoComplete="new-password"
                />

                {/* Indicador de coincidencia */}
                {confirmPassword.length > 0 && (
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      textAlign: 'center',
                      marginBottom: 10,
                      color: passwordsMatch ? theme.primaryButton : theme.danger,
                    }}
                  >
                    {passwordsMatch
                      ? `✓ ${t('profilePasswordMatch', { defaultValue: 'Las contraseñas coinciden' })}`
                      : `✗ ${t('profilePasswordNoMatch', { defaultValue: 'Las contraseñas no coinciden' })}`}
                  </Text>
                )}
              </Animated.View>

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
        </ScrollView>
      </KeyboardAvoidingView>

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
