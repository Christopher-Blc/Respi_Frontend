import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassTextButton } from '../components/login/glassTextButton';
import { useAppTheme } from '../context/ThemeContext';

interface Props {
  visible: boolean;
  onConfirm: () => void;
}

export const SessionExpiredModal = ({ visible, onConfirm }: Props) => {
  const { isDarkMode, theme } = useAppTheme();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={[modalStyles.overlay, { backgroundColor: theme.overlayDark }]}>
        <BlurView
          intensity={30}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[modalStyles.glassContainer, { borderColor: theme.borderGlass }]}
        >
          <Text
            style={[
              modalStyles.title,
              {
                color: theme.textTitle,
              },
            ]}
          >
            Sesión Caducada
          </Text>
          <Text
            style={[
              modalStyles.message,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            Tu sesión ha expirado por seguridad. Por favor, vuelve a iniciar
            sesión.
          </Text>

          <GlassTextButton
            text="Entendido"
            textColor={theme.onPrimary}
            onPress={onConfirm}
            color={theme.primarySoft}
          />
        </BlurView>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    width: '80%',
    padding: 30,
    borderRadius: 30,
    borderWidth: 0.8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
});
