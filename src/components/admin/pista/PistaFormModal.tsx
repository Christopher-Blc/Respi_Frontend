import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { pistasStyles as styles } from '../../../style/admin/pistas.styles';
import { SessionExpiredModal } from '../../alert.modal';
import {
  Pista,
  TipoPista,
  PistaFormData,
  WeeklyScheduleItem,
} from '../../../types/types';
import { WEEK_DAYS } from '../../../hooks/pistaUtils';

type Props = {
  visible: boolean;
  pistaAEditar: Pista | null;
  formData: PistaFormData;
  setFormData: (data: PistaFormData) => void;
  weeklySchedule: WeeklyScheduleItem[];
  weeklyCardWidth: string;
  tiposPista: TipoPista[];
  onClose: () => void;
  onSave: () => void;
  updateWeeklySchedule: <K extends keyof WeeklyScheduleItem>(
    dia: Pista['dia_semana'],
    field: K,
    value: WeeklyScheduleItem[K],
  ) => void;
  errorModal: { visible: boolean; title: string; message: string };
  setErrorModal: (state: {
    visible: boolean;
    title: string;
    message: string;
  }) => void;
  samePriceMode: boolean;
  globalPrice: string;
  setGlobalPrice: (price: string) => void;
  toggleSamePrice: (enabled: boolean, price: string) => void;
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

export function PistaFormModal({
  visible,
  pistaAEditar,
  formData,
  setFormData,
  weeklySchedule,
  weeklyCardWidth,
  tiposPista,
  onClose,
  onSave,
  updateWeeklySchedule,
  errorModal,
  setErrorModal,
  samePriceMode,
  globalPrice,
  setGlobalPrice,
  toggleSamePrice,
}: Props) {
  const { theme } = useAppTheme();
  const switchTrackOff = theme.borderMain;
  const switchTrackOn = theme.primary;
  const switchThumbOff = theme.backgroundCard;
  const switchThumbOn = theme.onPrimary;

  return (
    <>
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
                {pistaAEditar ? 'Editar Pista' : 'Nueva Pista'}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color={theme.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputLabel label="Tipo de Pista" theme={theme} />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {tiposPista.map((tipo) => {
                  const selected =
                    formData.tipo_pista_id === tipo.tipo_pista_id.toString();
                  return (
                    <TouchableOpacity
                      key={tipo.tipo_pista_id}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          tipo_pista_id: tipo.tipo_pista_id.toString(),
                        })
                      }
                      style={[
                        {
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: selected
                            ? theme.primary
                            : theme.primarySoft,
                          backgroundColor: selected
                            ? theme.primary + '20'
                            : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? theme.primary : theme.textBody,
                          fontWeight: selected ? '700' : '400',
                          fontSize: 13,
                        }}
                      >
                        {tipo.nombre}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <InputLabel label="Nombre de la Pista" theme={theme} />
              <TextInput
                style={[
                  styles.input,
                  { color: theme.textTitle, borderColor: theme.primarySoft },
                ]}
                value={formData.nombre}
                onChangeText={(t) => setFormData({ ...formData, nombre: t })}
              />

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <InputLabel label="Capacidad" theme={theme} />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.textTitle,
                        borderColor: theme.primarySoft,
                      },
                    ]}
                    value={formData.capacidad}
                    keyboardType="numeric"
                    onChangeText={(t) =>
                      setFormData({ ...formData, capacidad: t })
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <InputLabel label="Mismo precio siempre" theme={theme} />
                <Switch
                  value={samePriceMode}
                  onValueChange={(enabled) =>
                    toggleSamePrice(enabled, globalPrice)
                  }
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={samePriceMode ? switchThumbOn : switchThumbOff}
                  trackColor={{ false: switchTrackOff, true: switchTrackOn }}
                />
              </View>

              {samePriceMode && (
                <>
                  <InputLabel label="Precio/Hora (€)" theme={theme} />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.textTitle,
                        borderColor: theme.primarySoft,
                      },
                    ]}
                    placeholder="Ingrese el precio para todos los días"
                    value={globalPrice}
                    keyboardType="numeric"
                    onChangeText={(t) => {
                      setGlobalPrice(t);
                      toggleSamePrice(true, t);
                    }}
                  />
                </>
              )}

              <InputLabel label="Horario semanal" theme={theme} />
              <View style={styles.weeklyGrid}>
                {weeklySchedule.map((day) => (
                  <View
                    key={day.dia_semana}
                    style={[
                      styles.weeklyRow,
                      {
                        borderColor: theme.primarySoft,
                        backgroundColor: theme.backgroundMain,
                        width: weeklyCardWidth as any,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.weeklyDayLabel,
                        { color: theme.textTitle },
                      ]}
                    >
                      {day.dia_semana}
                    </Text>

                    <InputLabel label="Precio" theme={theme} />
                    <TextInput
                      style={[
                        styles.weeklyHourInput,
                        {
                          color: theme.textTitle,
                          borderColor:
                            day.cerrado || samePriceMode
                              ? theme.borderSoft
                              : theme.primarySoft,
                          opacity: day.cerrado || samePriceMode ? 0.55 : 1,
                          backgroundColor:
                            day.cerrado || samePriceMode
                              ? theme.backgroundCard
                              : theme.backgroundCard,
                          marginBottom: 8,
                        },
                      ]}
                      placeholder="Precio/h (€)"
                      value={day.precio_hora}
                      editable={!day.cerrado && !samePriceMode}
                      keyboardType="numeric"
                      onChangeText={(t) =>
                        updateWeeklySchedule(day.dia_semana, 'precio_hora', t)
                      }
                    />

                    <View style={styles.weeklyHoursRow}>
                      <View style={{ flex: 1 }}>
                        <InputLabel label="Hora Inicio" theme={theme} />
                        <TextInput
                          style={[
                            styles.weeklyHourInput,
                            {
                              color: theme.textTitle,
                              borderColor: day.cerrado
                                ? theme.borderSoft
                                : theme.primarySoft,
                              opacity: day.cerrado ? 0.55 : 1,
                              backgroundColor: day.cerrado
                                ? theme.backgroundCard
                                : theme.backgroundCard,
                            },
                          ]}
                          value={day.hora_apertura}
                          editable={!day.cerrado}
                          onChangeText={(t) =>
                            updateWeeklySchedule(
                              day.dia_semana,
                              'hora_apertura',
                              t,
                            )
                          }
                        />
                      </View>
                      <Text style={{ color: theme.textBody, marginTop: 24 }}>
                        -
                      </Text>
                      <View style={{ flex: 1 }}>
                        <InputLabel label="Hora Fin" theme={theme} />
                        <TextInput
                          style={[
                            styles.weeklyHourInput,
                            {
                              color: theme.textTitle,
                              borderColor: day.cerrado
                                ? theme.borderSoft
                                : theme.primarySoft,
                              opacity: day.cerrado ? 0.55 : 1,
                              backgroundColor: day.cerrado
                                ? theme.backgroundCard
                                : theme.backgroundCard,
                            },
                          ]}
                          value={day.hora_cierre}
                          editable={!day.cerrado}
                          onChangeText={(t) =>
                            updateWeeklySchedule(
                              day.dia_semana,
                              'hora_cierre',
                              t,
                            )
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.weeklyClosedRow}>
                      <Text style={{ color: theme.textBody }}>Cerrado</Text>
                      <Switch
                        value={day.cerrado}
                        onValueChange={(v) =>
                          updateWeeklySchedule(day.dia_semana, 'cerrado', v)
                        }
                        ios_backgroundColor={switchTrackOff}
                        thumbColor={
                          day.cerrado ? switchThumbOn : switchThumbOff
                        }
                        trackColor={{
                          false: switchTrackOff,
                          true: switchTrackOn,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.switchRow}>
                <Text style={{ color: theme.textTitle }}>
                  ¿Es pista cubierta?
                </Text>
                <Switch
                  value={formData.cubierta}
                  onValueChange={(v) =>
                    setFormData({ ...formData, cubierta: v })
                  }
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={
                    formData.cubierta ? switchThumbOn : switchThumbOff
                  }
                  trackColor={{ false: switchTrackOff, true: switchTrackOn }}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={{ color: theme.textTitle }}>
                  Iluminación disponible
                </Text>
                <Switch
                  value={formData.iluminacion}
                  onValueChange={(v) =>
                    setFormData({ ...formData, iluminacion: v })
                  }
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={
                    formData.iluminacion ? switchThumbOn : switchThumbOff
                  }
                  trackColor={{ false: switchTrackOff, true: switchTrackOn }}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                onPress={onSave}
              >
                <Text style={styles.saveBtnText}>Guardar Pista</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SessionExpiredModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="Entendido"
        onConfirm={() =>
          setErrorModal({ visible: false, title: '', message: '' })
        }
      />
    </>
  );
}
