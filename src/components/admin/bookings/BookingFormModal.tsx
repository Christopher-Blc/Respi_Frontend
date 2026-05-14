import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { ReservationFormData } from '../../../hooks/useAdminBookings';
import { bookingsAdminStyles as styles } from '../../../style/admin/bookings.styles';
import { Court, User, Reservation } from '../../../types/types';

type Props = {
  visible: boolean;
  isEditing?: boolean;
  formData: ReservationFormData;
  setFormData: (value: ReservationFormData) => void;
  users: User[];
  courts: Court[];
  reservationStatus?: Reservation['status'] | null;
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

const EDITABLE_STATUS_OPTIONS: Reservation['status'][] = [
  'PENDIENTE',
  'CONFIRMADA',
  'FINALIZADA',
];

export function BookingFormModal({
  visible,
  isEditing = false,
  formData,
  setFormData,
  users,
  courts,
  reservationStatus = null,
  onClose,
  onSave,
}: Props) {
  const { theme } = useAppTheme();
  const [showCourtPicker, setShowCourtPicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, overlayOpacity]);

  const selectedCourt = useMemo(
    () =>
      courts.find((court) => String(court.id) === String(formData.court_id)),
    [courts, formData.court_id],
  );

  const selectedUser = useMemo(
    () => users.find((user) => String(user.id) === String(formData.user_id)),
    [users, formData.user_id],
  );

  // Eliminar duplicados de pistas por nombre
  const uniqueCourts = useMemo(() => {
    const seen = new Set<string>();
    return courts.filter((court) => {
      if (seen.has(court.name)) return false;
      seen.add(court.name);
      return true;
    });
  }, [courts]);

  const isStatusLocked =
    isEditing &&
    (reservationStatus === 'FINALIZADA' || reservationStatus === 'CANCELADA');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundCard },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
              {isEditing ? 'Editar reserva' : 'Nueva reserva'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.twoColumnsRow}>
              <View style={styles.column}>
                <InputLabel label="Usuario" theme={theme} />
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    {
                      backgroundColor: theme.backgroundMain,
                      borderColor: theme.primarySoft,
                    },
                  ]}
                  onPress={() => setShowUserPicker(true)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      {
                        color: selectedUser ? theme.textTitle : theme.textBody,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedUser
                      ? selectedUser.username
                      : 'Selecciona un usuario'}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={theme.textBody}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.column}>
                <InputLabel label="Pista" theme={theme} />
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    {
                      backgroundColor: theme.backgroundMain,
                      borderColor: theme.primarySoft,
                    },
                  ]}
                  onPress={() => setShowCourtPicker(true)}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      {
                        color: selectedCourt ? theme.textTitle : theme.textBody,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedCourt
                      ? selectedCourt.name
                      : 'Selecciona una pista'}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={theme.textBody}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.twoColumnsRow}>
              <View style={styles.column}>
                <InputLabel label="Fecha (YYYY-MM-DD)" theme={theme} />
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.textTitle, borderColor: theme.primarySoft },
                  ]}
                  value={formData.reservation_date}
                  onChangeText={(v) =>
                    setFormData({ ...formData, reservation_date: v })
                  }
                  placeholder="2026-05-08"
                  placeholderTextColor={theme.textBody + '70'}
                />
              </View>

              <View style={styles.column}>
                <InputLabel label="Estado" theme={theme} />
                {isStatusLocked ? (
                  <>
                    <View style={styles.segmentedRow}>
                      <View
                        style={[
                          styles.segment,
                          {
                            backgroundColor: theme.primary + '14',
                            borderColor: theme.primarySoft,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: theme.textTitle,
                            fontWeight: '700',
                            fontSize: 12,
                          }}
                        >
                          {formData.status}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[styles.helperText, { color: theme.textBody }]}
                    >
                      El estado queda bloqueado cuando la reserva esta
                      finalizada o cancelada.
                    </Text>
                  </>
                ) : (
                  <View style={styles.segmentedRow}>
                    {EDITABLE_STATUS_OPTIONS.map((status) => {
                      const selected = formData.status === status;
                      return (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.segment,
                            {
                              backgroundColor: selected
                                ? theme.primary + '20'
                                : theme.primary + '08',
                              borderColor: selected
                                ? theme.primary
                                : theme.primarySoft,
                            },
                          ]}
                          onPress={() => setFormData({ ...formData, status })}
                        >
                          <Text
                            style={{
                              color: selected ? theme.primary : theme.textBody,
                              fontWeight: '600',
                              fontSize: 12,
                            }}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.twoColumnsRow}>
              <View style={styles.column}>
                <InputLabel label="Hora inicio (HH:mm)" theme={theme} />
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.textTitle, borderColor: theme.primarySoft },
                  ]}
                  value={formData.start_time}
                  onChangeText={(v) =>
                    setFormData({ ...formData, start_time: v })
                  }
                  placeholder="10:00"
                  placeholderTextColor={theme.textBody + '70'}
                />
              </View>

              <View style={styles.column}>
                <InputLabel label="Hora fin (HH:mm)" theme={theme} />
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.textTitle, borderColor: theme.primarySoft },
                  ]}
                  value={formData.end_time}
                  onChangeText={(v) =>
                    setFormData({ ...formData, end_time: v })
                  }
                  placeholder="11:00"
                  placeholderTextColor={theme.textBody + '70'}
                />
              </View>
            </View>

            <InputLabel label="Nota" theme={theme} />
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.textTitle,
                  borderColor: theme.primarySoft,
                  minHeight: 90,
                  textAlignVertical: 'top',
                },
              ]}
              multiline
              value={formData.note}
              onChangeText={(v) => setFormData({ ...formData, note: v })}
              placeholder="Detalles de la reserva"
              placeholderTextColor={theme.textBody + '70'}
            />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Guardar cambios' : 'Crear reserva'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Animated.View>

      <Modal
        visible={showCourtPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCourtPicker(false)}
      >
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setShowCourtPicker(false)}
        >
          <Pressable
            onPress={() => {}}
            style={[
              styles.dropdownCard,
              {
                backgroundColor: theme.backgroundCard,
                borderColor: theme.primarySoft,
              },
            ]}
          >
            <Text style={[styles.dropdownTitle, { color: theme.textTitle }]}>
              Selecciona una pista
            </Text>
            <ScrollView style={styles.dropdownList}>
              {uniqueCourts.map((court) => {
                const selected = String(court.id) === String(formData.court_id);
                return (
                  <TouchableOpacity
                    key={court.id}
                    style={[
                      styles.dropdownOption,
                      {
                        backgroundColor: selected
                          ? theme.primary + '12'
                          : theme.backgroundMain,
                        borderColor: selected
                          ? theme.primary
                          : theme.primarySoft,
                      },
                      selected && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, court_id: String(court.id) });
                      setShowCourtPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        selected
                          ? styles.dropdownOptionTextSelected
                          : styles.dropdownOptionText,
                        { color: selected ? theme.primary : theme.textTitle },
                      ]}
                    >
                      {court.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={showUserPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUserPicker(false)}
      >
        <Pressable
          style={styles.dropdownBackdrop}
          onPress={() => setShowUserPicker(false)}
        >
          <Pressable
            onPress={() => {}}
            style={[
              styles.dropdownCard,
              {
                backgroundColor: theme.backgroundCard,
                borderColor: theme.primarySoft,
              },
            ]}
          >
            <Text style={[styles.dropdownTitle, { color: theme.textTitle }]}>
              Selecciona un usuario
            </Text>
            <ScrollView style={styles.dropdownList}>
              {users.map((user) => {
                const selected = String(user.id) === String(formData.user_id);
                return (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.dropdownOption,
                      {
                        backgroundColor: selected
                          ? theme.primary + '12'
                          : theme.backgroundMain,
                        borderColor: selected
                          ? theme.primary
                          : theme.primarySoft,
                      },
                      selected && styles.dropdownOptionSelected,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, user_id: String(user.id) });
                      setShowUserPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        selected
                          ? styles.dropdownOptionTextSelected
                          : styles.dropdownOptionText,
                        { color: selected ? theme.primary : theme.textTitle },
                      ]}
                    >
                      {user.username}
                    </Text>
                    <Text
                      style={{
                        color: theme.textBody,
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {user.email}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}
