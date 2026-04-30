import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassTextButton } from './login/glassTextButton';
import { useAppTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
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
  title,
  message,
  confirmText,
  cancelText,
  content,
}: Props) => {
  const { t } = useTranslation();
  const { isDarkMode, theme } = useAppTheme();
  const resolvedTitle = title || t('modalSessionExpiredTitle');
  const resolvedMessage = message || t('modalSessionExpiredMessage');
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
        <BlurView
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
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    width: '80%',
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  contentContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
});
