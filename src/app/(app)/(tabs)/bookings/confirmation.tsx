import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import createConfirmacionReservaStyles from '../../../../style/bookingConfirmation.styles';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../../i18n';
import { useStripePayment } from '../../../../hooks/useStripePayment';
import { BookingStepBar } from '../../../../components/bookings/BookingStepBar';
import { Reservation } from '../../../../types/types';
import { SessionExpiredModal } from '../../../../components/alert.modal';

export default function ConfirmacionReserva() {
  const { t, i18n } = useTranslation();
  const { pistaId, fecha, hora, duracion } = useLocalSearchParams<{
    pistaId: string;
    fecha: string;
    hora: string;
    duracion?: string;
  }>();
  const pistaIdValue = Array.isArray(pistaId) ? pistaId[0] : pistaId;
  const fechaValue = Array.isArray(fecha) ? fecha[0] : fecha;
  const horaValue = Array.isArray(hora) ? hora[0] : hora;
  const duracionValue = Array.isArray(duracion) ? duracion[0] : duracion;

  const router = useRouter();
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  useAuth();
  const styles = useMemo(() => createConfirmacionReservaStyles(theme), [theme]);
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);

  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });
  const [pista, setPista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [notes, setNotes] = useState('');
  const [completedReservation, setCompletedReservation] =
    useState<Reservation | null>(null);
  const durationMinutes = Number(duracionValue || 60);

  const {
    initAndPay,
    loading: stripeLoading,
    error: stripeError,
    PaymentModal,
  } = useStripePayment();

  const showAlert = (title: string, message: string) => {
    setAlertModal({ visible: true, title, message });
  };

  // Mostrar error de Stripe si ocurre fuera del flujo de pago
  useEffect(() => {
    if (stripeError) {
      showAlert(t('bookingConfirmErrorTitle'), stripeError);
    }
  }, [stripeError]);

  useEffect(() => {
    if (!pistaIdValue) {
      setLoading(false);
      return;
    }

    const fetchPista = async () => {
      try {
        const response = await api.get(`/courts/${pistaIdValue}`);
        setPista(response.data);
      } catch (error) {
        console.error('Error loading court:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPista();
  }, [pistaIdValue]);

  const handleConfirm = async () => {
    if (!pistaIdValue || !fechaValue || !horaValue) {
      showAlert(t('bookingConfirmErrorTitle'), t('bookingConfirmMissingData'));
      return;
    }

    try {
      setConfirming(true);

      // 1. Calcular hora de fin según la duración elegida
      const [hourStr, minStr] = horaValue.split(':');
      const startMinutes = parseInt(hourStr) * 60 + parseInt(minStr);
      const endMinutes = startMinutes + durationMinutes;
      const endHour = String(Math.floor(endMinutes / 60)).padStart(2, '0');
      const endMin = String(endMinutes % 60).padStart(2, '0');
      const endTime = `${endHour}:${endMin}`;

      const payload = {
        court_id: parseInt(pistaIdValue),
        reservation_date: fechaValue,
        start_time: horaValue,
        end_time: endTime,
        note: notes,
      };

      console.log('[DEBUG] Enviando reserva:', JSON.stringify(payload));

      // 2. Crear la reserva en el backend (queda en estado PENDIENTE)
      const response = await api.post('/reservations', payload);
      console.log('[DEBUG] Reserva creada:', JSON.stringify(response.data));
      const createdReservation = response.data as Reservation;
      const reservationId: number = response.data?.id;

      if (!reservationId) {
        throw new Error('El servidor no devolvió el ID de la reserva');
      }

      console.log('[DEBUG] Abriendo payment sheet para reserva', reservationId);
      // 3. Iniciar flujo de pago con Stripe
      const paid = await initAndPay(reservationId, 'ResPi', precioEstimado);
      console.log('[DEBUG] paid =', paid);

      if (paid) {
        // Intentar obtener la reserva actualizada (el webhook puede haberla confirmado ya)
        try {
          const updated = await api.get(`/reservations/${reservationId}`);
          setCompletedReservation(updated.data as Reservation);
        } catch {
          // Si falla el refresh, mostramos los datos originales (PENDIENTE)
          setCompletedReservation(createdReservation);
        }
      }
      // Si paid === false, el usuario canceló el pago — la reserva queda PENDIENTE
      // No mostramos error: el usuario volvió atrás voluntariamente
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        t('bookingConfirmErrorMessage');
      console.error('[DEBUG] ERROR en handleConfirm:', message);
      console.error(
        '[DEBUG] Error completo:',
        JSON.stringify(error?.response?.data),
      );
      showAlert(t('bookingConfirmErrorTitle'), message);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleCopyVerificationLink = async () => {
    const code = completedReservation?.verification_code;
    if (!code) {
      showAlert('Codigo no disponible', 'No hay codigo de verificacion para copiar.');
      return;
    }

    const verificationUrl = `https://midominio.com/validar/${code}`;
    await Clipboard.setStringAsync(verificationUrl);
    showAlert('Enlace copiado', 'El enlace de verificacion se ha copiado al portapapeles.');
  };

  const isProcessing = confirming || stripeLoading;

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const precioEstimado = pista
    ? (parseFloat(pista.price_per_hour || 0) * (durationMinutes / 60)).toFixed(
        2,
      )
    : '0.00';

  const [hourStr, minStr] = String(horaValue || '00:00').split(':');
  const startMinutes = parseInt(hourStr || '0') * 60 + parseInt(minStr || '0');
  const endMinutes = startMinutes + durationMinutes;
  const endHourLabel = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(
    endMinutes % 60,
  ).padStart(2, '00')}`;

  return (
    <View style={styles.container}>
      {PaymentModal}
      <SessionExpiredModal
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        confirmText={t('commonUnderstood')}
        onConfirm={() => setAlertModal({ visible: false, title: '', message: '' })}
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: Platform.OS === 'web' ? 96 : 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BookingStepBar currentStep={3} />
        {completedReservation ? (
          <View
            style={[
              localStyles.successWrap,
              {
                backgroundColor: theme.backgroundCard,
                borderColor: theme.primarySoft,
              },
            ]}
          >
            <View style={localStyles.successTitleRow}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.success}
              />
              <Text
                style={[localStyles.successTitle, { color: theme.textTitle }]}
              >
                Reserva completada con exito
              </Text>
            </View>
            <Text
              style={[localStyles.successSubtitle, { color: theme.textBody }]}
            >
              Muestra este QR en el polideportivo para validar tu reserva.
            </Text>

            <View style={localStyles.qrBox}>
              <QRCode
                value={completedReservation.verification_code}
                size={190}
                backgroundColor="white"
                color="black"
              />
            </View>

            <Text style={[localStyles.codeLabel, { color: theme.textMuted }]}>
              Codigo
            </Text>
            <Text style={[localStyles.codeValue, { color: theme.textTitle }]}>
              {completedReservation.verification_code.toUpperCase()}
            </Text>

            <TouchableOpacity
              style={[
                localStyles.copyBtn,
                {
                  backgroundColor: theme.primaryButton,
                  borderColor: theme.primary,
                },
              ]}
              onPress={handleCopyVerificationLink}
            >
              <Ionicons name="copy-outline" size={18} color={theme.onPrimary} />
              <Text
                style={[localStyles.copyBtnText, { color: theme.onPrimary }]}
              >
                Copiar enlace de verificacion
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                localStyles.homeBtn,
                {
                  borderColor: theme.borderInput,
                  backgroundColor: theme.inputBackground,
                },
              ]}
              onPress={() => router.push('/(app)/(tabs)')}
            >
              <Text
                style={[localStyles.homeBtnText, { color: theme.textTitle }]}
              >
                Volver al inicio
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Header Card */}
            <View style={styles.headerCard}>
              <View style={styles.headerTag}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={theme.primary}
                />
                <Text style={styles.headerTagText}>
                  {t('bookingConfirmHeaderTag')}
                </Text>
              </View>
              <Text style={styles.headerTitle}>
                {t('bookingConfirmHeaderTitle')}
              </Text>
            </View>

            {/* Pista Info */}
            {pista && (
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="football-outline"
                    size={20}
                    color={theme.primary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>
                      {t('bookingConfirmCourt')}
                    </Text>
                    <Text style={styles.infoValue}>{pista.name}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={theme.primary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>
                      {t('bookingConfirmDate')}
                    </Text>
                    <Text style={styles.infoValue}>
                      {new Date(`${fechaValue}T00:00:00`).toLocaleDateString(
                        locale,
                        {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        },
                      )}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={theme.primary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>
                      {t('bookingConfirmTime')}
                    </Text>
                    <Text style={styles.infoValue}>
                      {horaValue} - {endHourLabel} ({durationMinutes} min)
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={theme.primary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>
                      {t('bookingConfirmEstimatedPrice')}
                    </Text>
                    <Text style={styles.infoValue}>€{precioEstimado}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Características */}
            {pista && (
              <View style={styles.featuresCard}>
                <Text style={styles.sectionTitle}>
                  {t('bookingConfirmFeatures')}
                </Text>
                <View style={styles.featuresList}>
                  {pista.is_covered && (
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={16}
                        color={theme.primary}
                      />
                      <Text style={styles.featureItemText}>
                        {t('bookingConfirmCoveredCourt')}
                      </Text>
                    </View>
                  )}
                  {pista.has_lighting && (
                    <View style={styles.featureItem}>
                      <Ionicons
                        name="flashlight-outline"
                        size={16}
                        color={theme.primary}
                      />
                      <Text style={styles.featureItemText}>
                        {t('bookingConfirmLighting')}
                      </Text>
                    </View>
                  )}
                  <View style={styles.featureItem}>
                    <Ionicons
                      name="people-outline"
                      size={16}
                      color={theme.primary}
                    />
                    <Text style={styles.featureItemText}>
                      {t('bookingConfirmCapacity', { count: pista.capacity })}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Notas */}
            <View style={styles.notesCard}>
              <Text style={styles.sectionTitle}>
                {t('bookingConfirmNotes')}
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder={t('bookingConfirmNotesPlaceholder')}
                placeholderTextColor={theme.textPlaceholder}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Aviso de pago */}
            <View style={[styles.notesCard, { marginTop: 0 }]}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={theme.primary}
                />
                <Text style={[styles.infoLabel, { flex: 1 }]}>
                  Pago seguro procesado por Stripe
                </Text>
              </View>
            </View>

            {/* Botones de acción */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isProcessing}
              >
                <Text style={styles.cancelButtonText}>
                  {t('bookingConfirmCancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color={theme.onPrimary} />
                ) : (
                  <>
                    <Ionicons
                      name="card-outline"
                      size={18}
                      color={theme.onPrimary}
                    />
                    <Text style={styles.confirmButtonText}>
                      Pagar €{precioEstimado}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  successWrap: {
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginTop: 6,
    alignItems: 'center',
  },
  successTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
  },
  qrBox: {
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  codeValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  copyBtn: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  copyBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  homeBtn: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
