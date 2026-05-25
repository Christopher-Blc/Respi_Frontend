import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { pistasStyles as styles } from '../../../style/admin/courts.styles';
import { SessionExpiredModal } from '../../alert.modal';
import {
  Installation,
  Court,
  CourtType,
  CourtFormData,
  WeeklyScheduleItem,
} from '../../../types/types';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { API_PUBLIC_URL } from '../../../constants';

type Props = {
  visible: boolean;
  pistaAEditar: Court | null;
  formData: CourtFormData;
  setFormData: (data: CourtFormData) => void;
  weeklySchedule: WeeklyScheduleItem[];
  weeklyCardWidth: string;
  tiposPista: CourtType[];
  instalaciones: Installation[];
  onClose: () => void;
  onSave: () => void;
  updateWeeklySchedule: <K extends keyof WeeklyScheduleItem>(
    day: Court['day_of_week'],
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
  imagen: ImagePicker.ImagePickerAsset | null;
  setImagen: (value: ImagePicker.ImagePickerAsset | null) => void;
  existingImageUri?: string;
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

export function CourtFormModal({
  visible,
  pistaAEditar,
  formData,
  setFormData,
  weeklySchedule,
  weeklyCardWidth,
  tiposPista,
  instalaciones,
  onClose,
  onSave,
  updateWeeklySchedule,
  errorModal,
  setErrorModal,
  samePriceMode,
  globalPrice,
  setGlobalPrice,
  toggleSamePrice,
  imagen,
  setImagen,
  existingImageUri,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const switchTrackOff = theme.borderMain;
  const switchTrackOn = theme.primary;
  const switchThumbOff = theme.backgroundCard;
  const switchThumbOn = theme.onPrimary;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.55,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagen(result.assets[0]);
    }
  };

  const previewUri =
    imagen?.uri ||
    (existingImageUri
      ? existingImageUri.startsWith('http')
        ? existingImageUri
        : `${API_PUBLIC_URL}/${existingImageUri.replace(/^\//, '')}`
      : null);

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
                {pistaAEditar
                  ? t('adminCourtEditTitle')
                  : t('adminCourtNewTitle')}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color={theme.textTitle} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <InputLabel label={t('adminCourtTypeLabel')} theme={theme} />
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
                    formData.court_type_id === tipo.id.toString();
                  return (
                    <TouchableOpacity
                      key={tipo.id}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          court_type_id: tipo.id.toString(),
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
                        {tipo.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <InputLabel
                label={t('adminCourtInstallationLabel')}
                theme={theme}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {instalaciones.map((instalacion) => {
                  const selected =
                    formData.installation_id === instalacion.id.toString();
                  return (
                    <TouchableOpacity
                      key={instalacion.id}
                      onPress={() =>
                        setFormData({
                          ...formData,
                          installation_id: instalacion.id.toString(),
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
                        {instalacion.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {instalaciones.length === 0 && (
                  <Text style={{ color: theme.textBody, opacity: 0.8 }}>
                    {t('adminCourtInstallationEmpty')}
                  </Text>
                )}
              </View>

              <InputLabel label={t('adminCourtNameLabel')} theme={theme} />
              <TextInput
                style={[
                  styles.input,
                  { color: theme.textTitle, borderColor: theme.primarySoft },
                ]}
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
              />

              <InputLabel label="Imagen de pista" theme={theme} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={{
                    flex: 1,
                    minHeight: 54,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: theme.primarySoft,
                    backgroundColor: theme.primary + '10',
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                  onPress={pickImage}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: theme.primary + '24',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={
                          previewUri ? 'sync-outline' : 'cloud-upload-outline'
                        }
                        size={16}
                        color={theme.primary}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: theme.textTitle,
                          fontWeight: '700',
                          fontSize: 13,
                        }}
                      >
                        {previewUri
                          ? 'Cambiar foto de la pista'
                          : 'Subir foto de la pista'}
                      </Text>
                      <Text
                        style={{
                          color: theme.textBody,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        Recomendado 16:9, maximo 1MB
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={theme.textSubtitle}
                  />
                </TouchableOpacity>

                {previewUri ? (
                  <Image
                    source={{ uri: previewUri }}
                    style={{
                      width: 92,
                      height: 54,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: theme.primarySoft,
                    }}
                    resizeMode="cover"
                  />
                ) : null}
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <InputLabel label={t('adminCapacityLabel')} theme={theme} />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.textTitle,
                        borderColor: theme.primarySoft,
                      },
                    ]}
                    value={formData.capacity}
                    keyboardType="numeric"
                    onChangeText={(t) =>
                      setFormData({ ...formData, capacity: t })
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
                <InputLabel label={t('adminSamePriceAlways')} theme={theme} />
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
                  <InputLabel label={t('adminPricePerHour')} theme={theme} />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.textTitle,
                        borderColor: theme.primarySoft,
                      },
                    ]}
                    placeholder={t('adminPriceAllDaysPlaceholder')}
                    value={globalPrice}
                    keyboardType="numeric"
                    onChangeText={(t) => {
                      setGlobalPrice(t);
                      toggleSamePrice(true, t);
                    }}
                  />
                </>
              )}

              <InputLabel label={t('adminWeeklySchedule')} theme={theme} />
              <View style={styles.weeklyGrid}>
                {weeklySchedule.map((day) => (
                  <View
                    key={day.day_of_week}
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
                      {day.day_of_week}
                    </Text>

                    <InputLabel label={t('adminPrice')} theme={theme} />
                    <TextInput
                      style={[
                        styles.weeklyHourInput,
                        {
                          color: theme.textTitle,
                          borderColor:
                            day.closed || samePriceMode
                              ? theme.borderSoft
                              : theme.primarySoft,
                          opacity: day.closed || samePriceMode ? 0.55 : 1,
                          backgroundColor:
                            day.closed || samePriceMode
                              ? theme.backgroundCard
                              : theme.backgroundCard,
                          marginBottom: 8,
                        },
                      ]}
                      placeholder={t('adminPricePerHourPlaceholder')}
                      value={day.price_per_hour}
                      editable={!day.closed && !samePriceMode}
                      keyboardType="numeric"
                      onChangeText={(t) =>
                        updateWeeklySchedule(
                          day.day_of_week,
                          'price_per_hour',
                          t,
                        )
                      }
                    />

                    <View style={styles.weeklyHoursRow}>
                      <View style={{ flex: 1 }}>
                        <InputLabel label={t('adminStartTime')} theme={theme} />
                        <TextInput
                          style={[
                            styles.weeklyHourInput,
                            {
                              color: theme.textTitle,
                              borderColor: day.closed
                                ? theme.borderSoft
                                : theme.primarySoft,
                              opacity: day.closed ? 0.55 : 1,
                              backgroundColor: day.closed
                                ? theme.backgroundCard
                                : theme.backgroundCard,
                            },
                          ]}
                          value={day.opening_time}
                          editable={!day.closed}
                          onChangeText={(t) =>
                            updateWeeklySchedule(
                              day.day_of_week,
                              'opening_time',
                              t,
                            )
                          }
                        />
                      </View>
                      <Text style={{ color: theme.textBody, marginTop: 24 }}>
                        -
                      </Text>
                      <View style={{ flex: 1 }}>
                        <InputLabel label={t('adminEndTime')} theme={theme} />
                        <TextInput
                          style={[
                            styles.weeklyHourInput,
                            {
                              color: theme.textTitle,
                              borderColor: day.closed
                                ? theme.borderSoft
                                : theme.primarySoft,
                              opacity: day.closed ? 0.55 : 1,
                              backgroundColor: day.closed
                                ? theme.backgroundCard
                                : theme.backgroundCard,
                            },
                          ]}
                          value={day.closing_time}
                          editable={!day.closed}
                          onChangeText={(t) =>
                            updateWeeklySchedule(
                              day.day_of_week,
                              'closing_time',
                              t,
                            )
                          }
                        />
                      </View>
                    </View>

                    <View style={styles.weeklyClosedRow}>
                      <Text style={{ color: theme.textBody }}>
                        {t('adminClosed')}
                      </Text>
                      <Switch
                        value={day.closed}
                        onValueChange={(v) =>
                          updateWeeklySchedule(day.day_of_week, 'closed', v)
                        }
                        ios_backgroundColor={switchTrackOff}
                        thumbColor={day.closed ? switchThumbOn : switchThumbOff}
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
                  {t('adminCoveredQuestion')}
                </Text>
                <Switch
                  value={formData.is_covered}
                  onValueChange={(v) =>
                    setFormData({ ...formData, is_covered: v })
                  }
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={
                    formData.is_covered ? switchThumbOn : switchThumbOff
                  }
                  trackColor={{ false: switchTrackOff, true: switchTrackOn }}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={{ color: theme.textTitle }}>
                  {t('adminLightingAvailable')}
                </Text>
                <Switch
                  value={formData.has_lighting}
                  onValueChange={(v) =>
                    setFormData({ ...formData, has_lighting: v })
                  }
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={
                    formData.has_lighting ? switchThumbOn : switchThumbOff
                  }
                  trackColor={{ false: switchTrackOff, true: switchTrackOn }}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                onPress={onSave}
              >
                <Text style={styles.saveBtnText}>{t('adminSaveCourt')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <SessionExpiredModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        confirmText={t('commonUnderstood')}
        onConfirm={() =>
          setErrorModal({ visible: false, title: '', message: '' })
        }
      />
    </>
  );
}
