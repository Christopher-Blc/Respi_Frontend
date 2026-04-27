import React, { ReactNode } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassTextButton } from './login/glassTextButton';
import { useAppTheme } from '../context/ThemeContext';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  content?: ReactNode;
}

export const SessionExpiredModal = ({
  visible,
  onConfirm,
  title = 'Sesion Caducada',
  message = 'Tu sesion ha expirado por seguridad. Por favor, vuelve a iniciar sesion.',
  confirmText = 'Entendido',
  content,
}: Props) => {
  const { isDarkMode, theme } = useAppTheme();

  const overlayColor = isDarkMode ? theme.overlayDark : 'rgba(0,0,0,0.35)';
  const cardBackground = isDarkMode
    ? 'rgba(20, 20, 20, 0.72)'
    : 'rgba(255, 255, 255, 0.72)';
  const borderColor = isDarkMode
    ? theme.borderGlass
    : 'rgba(255, 255, 255, 0.35)';
  const messageColor = isDarkMode ? theme.textBody : theme.textSecondary;
  const buttonColor = isDarkMode ? theme.primarySoft : theme.primary;
  const buttonTextColor = '#FFFFFF';

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
            {title}
          </Text>

          {content ? (
            <View style={styles.contentContainer}>{content}</View>
          ) : (
            <Text style={[styles.message, { color: messageColor }]}>
              {message}
            </Text>
          )}

          <GlassTextButton
            text={confirmText}
            textColor={buttonTextColor}
            onPress={onConfirm}
            color={buttonColor}
            borderColor={borderColor}
            borderWidth={1}
          />
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
});
