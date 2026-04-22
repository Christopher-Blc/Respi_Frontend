import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Button } from 'react-native-paper';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function MembresiaModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible} // Usa directamente la prop del padre
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 90,
            paddingVertical: 20,
            backgroundColor: '#f7dca3ab',
            borderRadius: 20,
            borderColor: '#ffffff',
            borderWidth: 1,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            Detalles de Membresía
          </Text>
          <Button
            mode="contained"
            onPress={onClose} // Llama a la función del padre
          >
            Cerrar
          </Button>
        </View>
      </View>
    </Modal>
  );
}
