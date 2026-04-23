import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Switch, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';

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
  const { theme } = useAppTheme();
  const [localValue, setLocalValue] = useState(isDarkMode);

  useEffect(() => {
    if (visible) {
      setLocalValue(isDarkMode);
    }
  }, [visible, isDarkMode]);
  const isWeb = Platform.OS === 'web';

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      {/*Row con los textbuttons arriba*/}
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 30,
          justifyContent: 'space-between',
          backgroundColor: theme.backgroundCard,
        }}
      >
        <View style={{ paddingLeft: 30 }}>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                fontSize: 20,
                //fontFamily: 'Open-Sans',
                fontWeight: '500',
                color: theme.textTitle,
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingRight: 30 }}>
          <TouchableOpacity>
            <Text
              onPress={() => onSave(localValue)}
              style={{
                fontSize: 20,
                fontFamily: isWeb ? 'system' : 'Segoe UI',
                fontWeight: '500',
                color: theme.textTitle,
              }}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: theme.backgroundCard,
        }}
      >
        <View
          style={{
            width: '88%',
            maxWidth: 420,
            paddingHorizontal: 24,
            paddingVertical: 20,
            backgroundColor: theme.backgroundCard,
            borderRadius: 20,
            borderColor: theme.borderSoft,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
              fontWeight: '700',
              color: theme.textTitle,
            }}
          >
            Modo oscuro
          </Text>

          <Text
            style={{
              fontSize: 14,
              marginBottom: 18,
              color: theme.textBody,
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
                color: theme.textTitle,
              }}
            >
              {localValue ? 'Activado' : 'Desactivado'}
            </Text>
            <Switch
              value={localValue}
              onValueChange={setLocalValue}
              ios_backgroundColor={theme.primary}
              thumbColor={localValue ? theme.primary : theme.textSubtle}
              trackColor={{
                false: theme.iconPrimary,
                true: theme.primarySoft,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
