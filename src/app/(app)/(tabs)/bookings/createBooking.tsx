import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAppTheme } from '../../../../context/ThemeContext';
import { createCreateBookingStyles } from '../../../../style/bookings/create-booking.styles';
import { useTranslation } from 'react-i18next';
import api from '../../../../services/api';
import { getDateLocale } from '../../../../i18n';
import { CourtAvailability, Membership, User } from '../../../../types/types';
import { BookingStepBar } from '../../../../components/bookings/BookingStepBar';
import { SessionExpiredModal } from '../../../../components/general/alert.modal';

type ReservaActual = CourtAvailability['current_reservations'][number];

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
      ? parsed.filter((item) => item?.start && item?.end)
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
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);

  const [duration, setDuration] = useState(60);
  const [horaInicioMin, setHoraInicioMin] = useState<number | null>(null);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [nota, setNota] = useState('');
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });
  const [membershipName, setMembershipName] = useState('');
  const [membershipDiscountPct, setMembershipDiscountPct] = useState(0);
  const [loadingMembership, setLoadingMembership] = useState(true);

  const openingMinutes = useMemo(() => toMinutes(horaApertura), [horaApertura]);
  const closingMinutes = useMemo(() => toMinutes(horaCierre), [horaCierre]);

  // Minutes since midnight that must have already passed for today's bookings
  const minStartMinutes = useMemo(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (fechaReserva !== today) return 0;
    return now.getHours() * 60 + now.getMinutes();
  }, [fechaReserva]);

  const reservedRanges = useMemo(
    () =>
      reservasActuales
        .map((reserva) => ({
          start: toMinutes(reserva.start),
          end: toMinutes(reserva.end),
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
      if (start <= minStartMinutes) continue;
      const end = start + duration;
      const hasOverlap = reservedRanges.some(
        (range) => start < range.end && end > range.start,
      );

      if (!hasOverlap) slots.push(start);
    }

    return slots;
  }, [openingMinutes, closingMinutes, duration, reservedRanges, minStartMinutes]);

  useEffect(() => {
    if (availableStarts.length === 0) {
      setHoraInicioMin(null);
      return;
    }

    if (horaInicioMin == null || !availableStarts.includes(horaInicioMin)) {
      setHoraInicioMin(availableStarts[0]);
    }
  }, [availableStarts, horaInicioMin]);

  useEffect(() => {
    let mounted = true;

    const fetchMembershipDiscount = async () => {
      try {
        const profileResponse = await api.get('/users/profile/me');
        const user = profileResponse.data as User;

        if (!user?.membership_id || user?.is_active === false) {
          if (mounted) {
            setMembershipDiscountPct(0);
            setMembershipName('');
          }
          return;
        }

        const membershipsResponse = await api.get('/memberships');
        const payload = membershipsResponse.data;
        const memberships: Membership[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        const activeMembership = memberships.find(
          (item) => item.id === user.membership_id,
        );

        if (mounted && activeMembership) {
          setMembershipName(activeMembership.name);
          setMembershipDiscountPct(Number(activeMembership.discount || 0));
        }
      } catch (error) {
        if (mounted) {
          setMembershipDiscountPct(0);
          setMembershipName('');
        }
        console.error('Error loading membership discount', error);
      } finally {
        if (mounted) setLoadingMembership(false);
      }
    };

    fetchMembershipDiscount();

    return () => {
      mounted = false;
    };
  }, []);

  const horaInicio = horaInicioMin != null ? toHHmm(horaInicioMin) : '--:--';
  const horaFin =
    horaInicioMin != null ? toHHmm(horaInicioMin + duration) : '--:--';

  const totalBase = useMemo(() => {
    if (!precioHora) return 0;
    return (precioHora * duration) / 60;
  }, [precioHora, duration]);

  const discountAmount = useMemo(
    () => (totalBase * membershipDiscountPct) / 100,
    [totalBase, membershipDiscountPct],
  );

  const totalFinal = useMemo(
    () => Math.max(0, totalBase - discountAmount),
    [totalBase, discountAmount],
  );

  const hasMembershipDiscount = membershipDiscountPct > 0;

  const showError = (title: string, message: string) => {
    setAlertModal({ visible: true, title, message });
  };

  const handleSubmit = () => {
    if (!pistaId || !fechaReserva) {
      showError('Datos incompletos', t('bookingCreateMissingData'));
      return;
    }

    if (horaInicioMin == null) {
      showError('Sin disponibilidad', t('bookingCreateNoSlots'));
      return;
    }

    // BUG-UX-004 + BUG-EDGE-005: Prevent booking a past time on today's date
    if (fechaReserva) {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (fechaReserva === today) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        if (horaInicioMin <= nowMinutes) {
          showError('Horario inválido', 'No puedes reservar un horario en el pasado. Por favor selecciona una hora futura.');
          return;
        }
      }
    }

    router.push({
      pathname: '/(app)/(tabs)/bookings/confirmation',
      params: {
        pistaId: pistaId,
        fecha: fechaReserva,
        hora: horaInicio,
        duracion: String(duration),
      },
    });
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
        <BookingStepBar currentStep={2} />
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

            {loadingMembership ? (
              <Text style={styles.totalMeta}>
                Calculando precio...
              </Text>
            ) : hasMembershipDiscount ? (
              <>
                <Text style={styles.totalOldValue}>
                  {totalBase.toFixed(2)} EUR
                </Text>
                <Text style={styles.totalValue}>
                  {totalFinal.toFixed(2)} EUR
                </Text>
                <Text style={styles.membershipDiscountText}>
                  Membresia {membershipName}: -{membershipDiscountPct}% (-
                  {discountAmount.toFixed(2)} EUR)
                </Text>
              </>
            ) : (
              <Text style={styles.totalValue}>{totalBase.toFixed(2)} EUR</Text>
            )}

            <Text style={styles.totalMeta}>
              {horaInicio} - {horaFin}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submit,
              availableStarts.length === 0 && styles.submitDisabled,
            ]}
            onPress={handleSubmit}
            disabled={availableStarts.length === 0}
          >
            <Text style={styles.submitText}>{t('bookingCreateSubmit')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <SessionExpiredModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={t('commonUnderstood')}
        onConfirm={() => setAlertModal({ visible: false, title: '', message: '' })}
      />
    </View>
  );
}
