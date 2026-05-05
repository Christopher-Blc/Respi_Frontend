import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { membershipsStyles as styles } from '../../../style/admin/memberships.styles';

type InstallationFormData = {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  estado: string;
};

type Props = {
  visible: boolean;
  isEditing?: boolean;
  formData: InstallationFormData;
  setFormData: (value: InstallationFormData) => void;
  onClose: () => void;
  onSave: () => void;
};

const InputLabel = ({ label, theme }: { label: string; theme: any }) => (
  <Text
    style={{
      color: theme.textBody,
      fontSize: 12,
      marginBottom: 4,
      fontWeight: '600',
    }}
  >
    {label}
  </Text>
);

export function InstallationFormModal({
  visible,
  isEditing = false,
  formData,
  setFormData,
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
              {isEditing ? 'Editar instalacion' : 'Nueva instalacion'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <InputLabel label="Nombre" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              value={formData.nombre}
              onChangeText={(v) => setFormData({ ...formData, nombre: v })}
            />

            <InputLabel label="Direccion" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              value={formData.direccion}
              onChangeText={(v) => setFormData({ ...formData, direccion: v })}
            />

            <InputLabel label="Telefono" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              keyboardType="phone-pad"
              value={formData.telefono}
              onChangeText={(v) => setFormData({ ...formData, telefono: v })}
            />

            <InputLabel label="Email" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              autoCapitalize="none"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(v) => setFormData({ ...formData, email: v })}
            />

            <InputLabel label="Descripcion" theme={theme} />
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              multiline
              value={formData.descripcion}
              onChangeText={(v) => setFormData({ ...formData, descripcion: v })}
            />

            <InputLabel label="Estado" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              placeholder="activa o inactiva"
              placeholderTextColor={theme.textBody + '80'}
              value={formData.estado}
              onChangeText={(v) => setFormData({ ...formData, estado: v })}
            />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Guardar cambios' : 'Crear instalacion'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
