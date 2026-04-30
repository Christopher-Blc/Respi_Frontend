import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAppTheme } from '../../../../context/ThemeContext';
import { createCreateBookingStyles } from '../../../../style/create-booking.styles';
import api from '../../../../services/api';
import { useTranslation } from 'react-i18next';

type ReservaActual = {
  inicio: string;
  fin: string;
};

const DURATION_OPTIONS = [30, 60, 90, 120];

const normalizeParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] || '' : value || '';

const getTimeOnly = (value: string) => {
  const [hours = '00', minutes = '00'] = value.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const toMinutes = (value: string) => {
  const [hours = '0', minutes = '0'] = getTimeOnly(value).split(':');
  return Number(hours) * 60 + Number(minutes);
};

const toHHmm = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

const formatDateLabel = (date: string, locale: string) => {
  if (!date) return '-';
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const parseReservas = (value: string): ReservaActual[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item) => item?.inicio && item?.fin)
      : [];
  } catch {
    return [];
  }
};

export default function CreateBooking() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    pistaId?: string | string[];
    pistaNombre?: string | string[];
    fecha?: string | string[];
    horaApertura?: string | string[];
    horaCierre?: string | string[];
    precioHora?: string | string[];
    reservasActuales?: string | string[];
  }>();

  const pistaId = normalizeParam(params.pistaId);
  const pistaNombre =
    normalizeParam(params.pistaNombre) || t('bookingCreateCourtFallback');
  const fechaReserva = normalizeParam(params.fecha);
  const horaApertura = normalizeParam(params.horaApertura) || '09:00';
  const horaCierre = normalizeParam(params.horaCierre) || '23:00';
  const precioHora = Number(normalizeParam(params.precioHora) || 0);
  const reservasActuales = parseReservas(
    normalizeParam(params.reservasActuales),
  );

  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const styles = useMemo(() => createCreateBookingStyles(theme), [theme]);
  const locale = i18n.language === 'en' ? 'en-US' : 'es-ES';

  const [duration, setDuration] = useState(60);
  const [horaInicioMin, setHoraInicioMin] = useState<number | null>(null);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [nota, setNota] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const openingMinutes = useMemo(() => toMinutes(horaApertura), [horaApertura]);
  const closingMinutes = useMemo(() => toMinutes(horaCierre), [horaCierre]);

  const reservedRanges = useMemo(
    () =>
      reservasActuales
        .map((reserva) => ({
          start: toMinutes(reserva.inicio),
          end: toMinutes(reserva.fin),
        }))
        .filter((range) => range.end > range.start),
    [reservasActuales],
  );

  // Duraciones posibles dado el inicio seleccionado, el cierre y sin colisiones.
  const availableDurations = useMemo(() => {
    return DURATION_OPTIONS.filter((minutes) => {
      if (horaInicioMin == null) return true;
      const end = horaInicioMin + minutes;
      if (end > closingMinutes) return false;
      return !reservedRanges.some(
        (range) => horaInicioMin < range.end && end > range.start,
      );
    });
  }, [horaInicioMin, closingMinutes, reservedRanges]);

  // Si la duración actual ya no cabe tras cambiar la hora inicio, bajamos a la máxima válida.
  useEffect(() => {
    if (availableDurations.length === 0) return;
    if (!availableDurations.includes(duration)) {
      setDuration(availableDurations[availableDurations.length - 1]);
    }
  }, [availableDurations, duration]);

  const availableStarts = useMemo(() => {
    const slots: number[] = [];

    for (
      let start = openingMinutes;
      start + duration <= closingMinutes;
      start += 30
    ) {
      const end = start + duration;
      const hasOverlap = reservedRanges.some(
        (range) => start < range.end && end > range.start,
      );

      if (!hasOverlap) slots.push(start);
    }

    return slots;
  }, [openingMinutes, closingMinutes, duration, reservedRanges]);

  useEffect(() => {
    if (availableStarts.length === 0) {
      setHoraInicioMin(null);
      return;
    }

    if (horaInicioMin == null || !availableStarts.includes(horaInicioMin)) {
      setHoraInicioMin(availableStarts[0]);
    }
  }, [availableStarts, horaInicioMin]);

  const horaInicio = horaInicioMin != null ? toHHmm(horaInicioMin) : '--:--';
  const horaFin =
    horaInicioMin != null ? toHHmm(horaInicioMin + duration) : '--:--';

  const total = useMemo(() => {
    if (!precioHora) return 0;
    return (precioHora * duration) / 60;
  }, [precioHora, duration]);

  const showError = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleSubmit = async () => {
    if (!pistaId || !fechaReserva) {
      showError(t('bookingCreateMissingData'));
      return;
    }

    if (horaInicioMin == null) {
      showError(t('bookingCreateNoSlots'));
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        pista_id: Number(pistaId),
        fecha_reserva: fechaReserva,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        estado: 'PENDIENTE',
        nota: nota.trim(),
      };

      await api.post('/reserva', payload);

      setSnackbarMessage(t('bookingCreateSuccess'));
      setSnackbarVisible(true);
      setTimeout(() => router.replace('/(app)/(tabs)/bookings'), 700);
    } catch (error: any) {
      const message = error?.response?.data?.message || t('bookingCreateError');
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.badgeRow}>
            <Ionicons name="calendar" size={16} color={theme.primary} />
            <Text style={styles.badgeText}>
              {t('bookingCreateQuickBooking')}
            </Text>
          </View>

          <Text style={styles.label}>{t('bookingCreateCourt')}</Text>
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyValue}>{pistaNombre}</Text>
          </View>

          <Text style={styles.label}>{t('bookingCreateDate')}</Text>
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyValue}>
              {formatDateLabel(fechaReserva, locale)}
            </Text>
          </View>

          <Text style={styles.label}>{t('bookingCreateStartTime')}</Text>
          {availableStarts.length === 0 ? (
            <View style={styles.emptySlotsCard}>
              <Text style={styles.emptySlotsTitle}>
                {t('bookingCreateNoSlotsShort')}
              </Text>
              <Text style={styles.emptySlotsText}>
                {t('bookingCreateNoSlotsHint')}
              </Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowStartDropdown(true)}
              >
                <Text style={styles.selectButtonText}>{horaInicio}</Text>
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={theme.textMuted}
                />
              </TouchableOpacity>

              <Modal
                visible={showStartDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowStartDropdown(false)}
              >
                <TouchableOpacity
                  style={styles.dropdownBackdrop}
                  activeOpacity={1}
                  onPress={() => setShowStartDropdown(false)}
                >
                  <View style={styles.dropdownCard}>
                    <Text style={styles.dropdownTitle}>
                      {t('bookingCreateSelectStartTime')}
                    </Text>
                    <ScrollView
                      style={styles.dropdownList}
                      showsVerticalScrollIndicator={false}
                    >
                      {availableStarts.map((slot) => {
                        const selected = horaInicioMin === slot;
                        return (
                          <TouchableOpacity
                            key={slot}
                            style={[
                              styles.dropdownOption,
                              selected && styles.dropdownOptionSelected,
                            ]}
                            onPress={() => {
                              setHoraInicioMin(slot);
                              setShowStartDropdown(false);
                            }}
                          >
                            <Text
                              style={
                                selected
                                  ? styles.dropdownOptionTextSelected
                                  : styles.dropdownOptionText
                              }
                            >
                              {toHHmm(slot)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          )}

          <Text style={styles.label}>{t('bookingCreateDuration')}</Text>
          <View style={styles.chipsRow}>
            {DURATION_OPTIONS.map((minutes) => {
              const selected = duration === minutes;
              const disabled = !availableDurations.includes(minutes);
              return (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.chip,
                    selected && styles.chipSelected,
                    disabled && styles.chipDisabled,
                  ]}
                  onPress={() => !disabled && setDuration(minutes)}
                  disabled={disabled}
                >
                  <Text
                    style={
                      disabled
                        ? styles.chipTextDisabled
                        : selected
                          ? styles.chipTextSelected
                          : styles.chipText
                    }
                  >
                    {minutes / 60}h{minutes % 60 ? ` ${minutes % 60}m` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>{t('bookingCreateEndTime')}</Text>
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyValue}>{horaFin}</Text>
          </View>

          <Text style={styles.label}>{t('bookingCreateNotes')}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={t('bookingCreateNotesPlaceholder')}
            placeholderTextColor={theme.textPlaceholder}
            value={nota}
            onChangeText={setNota}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>
              {t('bookingCreateEstimatedTotal')}
            </Text>
            <Text style={styles.totalValue}>{total.toFixed(2)} EUR</Text>
            <Text style={styles.totalMeta}>
              {horaInicio} - {horaFin}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submit, submitting && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={submitting || availableStarts.length === 0}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={theme.onPrimary} />
            ) : (
              <Text style={styles.submitText}>{t('bookingCreateSubmit')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
