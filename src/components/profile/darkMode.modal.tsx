import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Switch, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { lightModeSemanticTokens, mainThemeColorsDark } from '../../theme';

interface Props {
  visible: boolean;
  isDarkMode: boolean;
  onSave: (nextValue: boolean) => void;
  onClose: () => void;
}

export default function DarkModeModal({
  visible,
  isDarkMode,
  onSave,
  onClose,
}: Props) {
  const [localValue, setLocalValue] = useState(isDarkMode);

  useEffect(() => {
    if (visible) {
      setLocalValue(isDarkMode);
    }
  }, [visible, isDarkMode]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: lightModeSemanticTokens.overlayDark,
        }}
      >
        <View
          style={{
            width: '88%',
            maxWidth: 420,
            paddingHorizontal: 24,
            paddingVertical: 20,
            backgroundColor: localValue
              ? mainThemeColorsDark.backgroundCard
              : lightModeSemanticTokens.surface,
            borderRadius: 20,
            borderColor: localValue
              ? mainThemeColorsDark.borderMain
              : lightModeSemanticTokens.borderSoft,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
              fontWeight: '700',
              color: localValue
                ? mainThemeColorsDark.textTitle
                : lightModeSemanticTokens.textPrimary,
            }}
          >
            Modo oscuro
          </Text>

          <Text
            style={{
              fontSize: 14,
              marginBottom: 18,
              color: localValue
                ? mainThemeColorsDark.textBody
                : lightModeSemanticTokens.textSecondary,
            }}
          >
            Activa o desactiva el modo oscuro para la pantalla de perfil.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 22,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: localValue
                  ? mainThemeColorsDark.textTitle
                  : lightModeSemanticTokens.textPrimary,
              }}
            >
              {localValue ? 'Activado' : 'Desactivado'}
            </Text>
            <Switch
              value={localValue}
              onValueChange={setLocalValue}
              thumbColor={
                localValue
                  ? mainThemeColorsDark.primaryButton
                  : lightModeSemanticTokens.textSubtle
              }
              trackColor={{
                false: lightModeSemanticTokens.borderSoft,
                true: 'rgba(202, 142, 14, 0.4)',
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{
                  color: localValue
                    ? mainThemeColorsDark.grayLabelText
                    : lightModeSemanticTokens.textSecondary,
                  fontWeight: '600',
                  fontSize: 15,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
            <Button
              mode="contained"
              buttonColor={
                localValue
                  ? mainThemeColorsDark.primaryButton
                  : lightModeSemanticTokens.primary
              }
              textColor={lightModeSemanticTokens.onPrimary}
              onPress={() => onSave(localValue)}
            >
              Guardar
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
