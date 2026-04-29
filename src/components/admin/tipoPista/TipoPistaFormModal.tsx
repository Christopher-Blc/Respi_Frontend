import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { tiposPistaStyles as styles } from '../../../style/admin/tiposPista.styles';

type Props = {
  visible: boolean;
  isEditing?: boolean;
  nombre: string;
  setNombre: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function TipoPistaFormModal({
  visible,
  isEditing = false,
  nombre,
  setNombre,
  onClose,
  onSave,
}: Props) {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundCard },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
              {isEditing ? 'Editar Tipo de Pista' : 'Nuevo Tipo de Pista'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: theme.textBody,
              fontSize: 12,
              marginBottom: 4,
              fontWeight: '600',
            }}
          >
            Nombre
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.textTitle, borderColor: theme.primarySoft },
            ]}
            placeholder="Ej: Tenis, Pádel, Fútbol..."
            placeholderTextColor={theme.textBody + '80'}
            value={nombre}
            onChangeText={setNombre}
          />

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={onSave}
          >
            <Text style={styles.saveBtnText}>
              {isEditing ? 'Guardar cambios' : 'Crear tipo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
