import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { membershipsStyles as styles } from '../../../style/admin/memberships.styles';
import { MembershipFormData } from '../../../hooks/useAdminMemberships';

type Props = {
  visible: boolean;
  isEditing?: boolean;
  formData: MembershipFormData;
  setFormData: (value: MembershipFormData) => void;
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

export function MembershipFormModal({
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
              {isEditing ? 'Editar Membresia' : 'Nueva Membresia'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <InputLabel label="Rango (menor = mejor)" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              keyboardType="numeric"
              value={formData.level}
              onChangeText={(v) => setFormData({ ...formData, level: v })}
            />

            <InputLabel label="Nombre" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              value={formData.name}
              onChangeText={(v) => setFormData({ ...formData, name: v })}
            />

            <InputLabel label="Descuento (%)" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              keyboardType="numeric"
              value={formData.discount}
              onChangeText={(v) => setFormData({ ...formData, discount: v })}
            />

            <InputLabel label="Reservas requeridas" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              keyboardType="numeric"
              value={formData.required_reservations}
              onChangeText={(v) =>
                setFormData({ ...formData, required_reservations: v })
              }
            />

            <InputLabel label="Beneficios" theme={theme} />
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              multiline
              value={formData.benefits}
              onChangeText={(v) => setFormData({ ...formData, benefits: v })}
            />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Guardar cambios' : 'Crear membresia'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
