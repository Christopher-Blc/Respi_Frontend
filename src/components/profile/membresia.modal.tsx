import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function MembresiaModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  return (
    <Modal
      visible={visible} // Usa directamente la prop del padre
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: theme.backgroundMain }}>
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
