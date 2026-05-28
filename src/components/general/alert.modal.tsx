import React, { ReactNode } from 'react';
import { Modal, Text, View } from 'react-native';
import { BlurViewCompat } from './BlurViewCompat';
import { GlassTextButton } from '../login/glassTextButton';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { alertModalStyles as styles } from '../../style/general/alertModal.styles';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'session' | 'generic';
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  content?: ReactNode;
}

export const SessionExpiredModal = ({
  visible,
  onConfirm,
  onCancel,
  variant = 'generic',
  title,
  message,
  confirmText,
  cancelText,
  content,
}: Props) => {
  const { t } = useTranslation();
  const { isDarkMode, theme } = useAppTheme();
  const resolvedTitle =
    title ??
    (variant === 'session'
      ? t('modalSessionExpiredTitle')
      : t('authConnectionError', { defaultValue: 'Error' }));
  const resolvedMessage =
    message ??
    (variant === 'session'
      ? t('modalSessionExpiredMessage')
      : t('bookingCreateError', {
          defaultValue: 'Ha ocurrido un error. Intentalo de nuevo.',
        }));
  const resolvedConfirmText = confirmText || t('commonUnderstood');
  const resolvedCancelText = cancelText || t('commonCancel');

  const overlayColor = isDarkMode ? theme.overlayDark : 'rgba(0,0,0,0.35)';
  const cardBackground = isDarkMode ? theme.surfaceGlass : theme.surfaceGlass;
  const borderColor = isDarkMode
    ? theme.borderAccentSoft
    : 'rgba(255, 255, 255, 0.35)';
  const messageColor = isDarkMode ? theme.textSecondary : theme.textSecondary;
  const confirmButtonColor = isDarkMode ? theme.primaryButton : theme.primary;
  const secondaryButtonColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.06)'
    : 'transparent';
  const buttonTextColor = '#FFFFFF';
  const cancelTextColor = isDarkMode ? theme.textTitle : theme.primary;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <BlurViewCompat
          intensity={30}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[
            styles.glassContainer,
            { borderColor, backgroundColor: cardBackground },
          ]}
        >
          <Text style={[styles.title, { color: theme.textTitle }]}>
            {resolvedTitle}
          </Text>

          {content ? (
            <View style={styles.contentContainer}>{content}</View>
          ) : (
            <Text style={[styles.message, { color: messageColor }]}>
              {resolvedMessage}
            </Text>
          )}

          <View style={styles.buttonsContainer}>
            <GlassTextButton
              text={resolvedConfirmText}
              textColor={buttonTextColor}
              onPress={onConfirm}
              color={confirmButtonColor}
              borderColor={borderColor}
              borderWidth={1}
            />
            {onCancel && (
              <GlassTextButton
                text={resolvedCancelText}
                textColor={cancelTextColor}
                onPress={onCancel}
                color={secondaryButtonColor}
                borderColor={borderColor}
                borderWidth={1}
              />
            )}
          </View>
        </BlurViewCompat>
      </View>
    </Modal>
  );
};

