import React from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { GlassTextInputPassword } from '../login/glassTextInputPassword';
import { PasswordStrengthIndicator } from '../login/passwordStrengthIndicator';
import { SessionExpiredModal } from '../general/alert.modal';
import { useChangePassword } from '../../hooks/auth/useChangePassword';
import createModalCommonStyles from '../../style/general/modalCommon.styles';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function EditPasswordModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createModalCommonStyles(theme), [theme]);

  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
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
      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: 20 }]}>
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

      {/* Un solo KeyboardAvoidingView envolviendo la vista */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: theme.backgroundCard,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // Ajusta este offset si notas que se solapa con el header en iOS
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          // Eliminamos flex: 1 de aquí para que pueda hacer scroll al abrir el teclado
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 18,
            paddingTop: 20,
            paddingBottom: insets.bottom + 40, // Espacio extra abajo para que no pegue al borde inferior
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.settingsCard, { width: '92%', maxWidth: 410 }]}>
            <Text style={styles.titleText}>
              {t('profileChangePassword', {
                defaultValue: 'Cambiar contraseña',
              })}
            </Text>

            <Text style={styles.description}>
              {t('profileChangePasswordDescription', {
                defaultValue:
                  'Ingresa tu contraseña actual y establece una nueva contraseña segura.',
              })}
            </Text>

            <Text style={styles.inputLabel}>
              {t('profileCurrentPassword', {
                defaultValue: 'Contraseña actual',
              })}
            </Text>
            <GlassTextInputPassword
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder={t('examplePassword')}
              autoComplete="current-password"
            />

            <Animated.View style={newSectionStyle}>
              <Text style={[styles.inputLabel, { marginTop: 16 }]}>
                {t('profileNewPassword', {
                  defaultValue: 'Nueva contraseña',
                })}
              </Text>
              <GlassTextInputPassword
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder={t('examplePassword')}
                autoComplete="new-password"
              />

              <PasswordStrengthIndicator password={newPassword} />

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>
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

              {confirmPassword.length > 0 && !passwordsMatch && (
                <Text
                  style={{
                    color: theme.errorText,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {t('profilePasswordsMismatch', {
                    defaultValue: 'Las contraseñas no coinciden.',
                  })}
                </Text>
              )}
            </Animated.View>
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
