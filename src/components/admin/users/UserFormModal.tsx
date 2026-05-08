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
import { usersAdminStyles as styles } from '../../../style/admin/users.styles';
import { Membership } from '../../../types/types';

export type UserFormData = {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  role: 'SUPER_ADMIN' | 'CLIENTE';
  isActive: boolean;
  fecha_nacimiento: string;
  direccion: string;
  membresia_id: string;
};

type Props = {
  visible: boolean;
  isEditing?: boolean;
  formData: UserFormData;
  setFormData: (value: UserFormData) => void;
  memberships: Membership[];
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

export function UserFormModal({
  visible,
  isEditing = false,
  formData,
  setFormData,
  memberships,
  onClose,
  onSave,
}: Props) {
  const { theme } = useAppTheme();

  const segmentBase = {
    borderColor: theme.primarySoft,
    backgroundColor: theme.primary + '08',
  };

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
              {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <InputLabel label="Username" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              value={formData.username}
              onChangeText={(v) => setFormData({ ...formData, username: v })}
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

            <InputLabel label="Apellido" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              value={formData.surname}
              onChangeText={(v) => setFormData({ ...formData, surname: v })}
            />

            <InputLabel label="Email" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(v) => setFormData({ ...formData, email: v })}
            />

            <InputLabel label="Telefono" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(v) => setFormData({ ...formData, phone: v })}
            />

            {!isEditing && (
              <>
                <InputLabel label="Password" theme={theme} />
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.textTitle, borderColor: theme.primarySoft },
                  ]}
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(v) =>
                    setFormData({ ...formData, password: v })
                  }
                />
              </>
            )}

            <InputLabel label="Rol" theme={theme} />
            <View style={styles.segmentedRow}>
              {(['CLIENTE', 'SUPER_ADMIN'] as const).map((role) => {
                const selected = formData.role === role;
                return (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setFormData({ ...formData, role })}
                    style={[
                      styles.segment,
                      segmentBase,
                      selected && {
                        backgroundColor: theme.primary + '20',
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? theme.primary : theme.textBody,
                        fontWeight: selected ? '700' : '500',
                      }}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <InputLabel label="Estado" theme={theme} />
            <View style={styles.segmentedRow}>
              {[
                { label: 'Activa', value: true },
                { label: 'Inactiva', value: false },
              ].map((state) => {
                const selected = formData.isActive === state.value;
                return (
                  <TouchableOpacity
                    key={state.label}
                    onPress={() =>
                      setFormData({ ...formData, isActive: state.value })
                    }
                    style={[
                      styles.segment,
                      segmentBase,
                      selected && {
                        backgroundColor: theme.primary + '20',
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? theme.primary : theme.textBody,
                        fontWeight: selected ? '700' : '500',
                      }}
                    >
                      {state.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <InputLabel label="Fecha nacimiento (YYYY-MM-DD)" theme={theme} />
            <TextInput
              style={[
                styles.input,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              value={formData.fecha_nacimiento}
              onChangeText={(v) =>
                setFormData({ ...formData, fecha_nacimiento: v })
              }
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

            <InputLabel label="Membresia" theme={theme} />
            <View style={styles.segmentedRow}>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, membresia_id: '' })}
                style={[
                  styles.segment,
                  segmentBase,
                  !formData.membresia_id && {
                    backgroundColor: theme.primary + '20',
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Text
                  style={{
                    color: !formData.membresia_id
                      ? theme.primary
                      : theme.textBody,
                    fontWeight: !formData.membresia_id ? '700' : '500',
                  }}
                >
                  Sin membresia
                </Text>
              </TouchableOpacity>
              {memberships.map((membership) => {
                const selected =
                  formData.membresia_id === String(membership.id);
                return (
                  <TouchableOpacity
                    key={membership.id}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        membresia_id: String(membership.id),
                      })
                    }
                    style={[
                      styles.segment,
                      segmentBase,
                      selected && {
                        backgroundColor: theme.primary + '20',
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? theme.primary : theme.textBody,
                        fontWeight: selected ? '700' : '500',
                      }}
                    >
                      {membership.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Guardar cambios' : 'Crear usuario'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
