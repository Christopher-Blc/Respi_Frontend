import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassTextButton } from '../components/login/glassTextButton';
import { lightModeSemanticTokens, mainThemeColorsDark } from '../theme';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export const SessionExpiredModal = ({
  visible,
  onConfirm,
  isDarkMode,
}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={modalStyles.overlay}>
        <BlurView
          intensity={30}
          tint={isDarkMode ? 'dark' : 'light'}
          style={modalStyles.glassContainer}
        >
          <Text
            style={[
              modalStyles.title,
              {
                color: isDarkMode
                  ? mainThemeColorsDark.textTitle
                  : lightModeSemanticTokens.textPrimary,
              },
            ]}
          >
            Sesión Caducada
          </Text>
          <Text
            style={[
              modalStyles.message,
              {
                color: isDarkMode
                  ? mainThemeColorsDark.grayLabelText
                  : lightModeSemanticTokens.textSecondary,
              },
            ]}
          >
            Tu sesión ha expirado por seguridad. Por favor, vuelve a iniciar
            sesión.
          </Text>

          <GlassTextButton
            text="Entendido"
            textColor={lightModeSemanticTokens.onPrimary}
            onPress={onConfirm}
            color={
              isDarkMode ? 'rgba(202, 142, 14, 0.4)' : 'rgba(191, 132, 4, 0.6)'
            }
          />
        </BlurView>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: lightModeSemanticTokens.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    width: '80%',
    padding: 30,
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: lightModeSemanticTokens.borderGlass,
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
