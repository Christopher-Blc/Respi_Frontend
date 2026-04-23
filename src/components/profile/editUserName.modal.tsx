import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { lightModeSemanticTokens } from '../../theme';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function EditUserNameModal({ visible, onClose }: Props) {
  const [saveActive, setSaveActive] = useState(false);
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
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
                color: '#000000',
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
                color: saveActive ? '#000000' : 'rgb(173, 173, 173)',
              }}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 90,
            paddingVertical: 20,
            backgroundColor: '#f7dca3ab',
            borderRadius: 20,
            borderColor: lightModeSemanticTokens.surface,
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
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
