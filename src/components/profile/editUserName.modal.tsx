import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function EditUserNameModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const [saveActive, setSaveActive] = useState(false);
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
          flexDirection: 'row',
          paddingTop: 20,
          justifyContent: 'space-between',
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
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingRight: 20 }}>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Segoe UI',
                fontWeight: '500',
                color: saveActive ? theme.textTitle : theme.grayPlaceholder,
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
          backgroundColor: theme.backgroundMain,
        }}
      >
        <View
          style={{
            paddingHorizontal: 90,
            paddingVertical: 20,
            backgroundColor: theme.surfaceMuted,
            borderRadius: 20,
            borderColor: theme.surface,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 20, color: theme.textTitle }}>
            Editar nombre de usuario
          </Text>
          <Button mode="contained" onPress={() => setSaveActive(!saveActive)}>
            <Text>test</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
