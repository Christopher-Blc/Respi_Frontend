import React, { useState } from 'react';
import {
  Modal,
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAppTheme } from '../../context/ThemeContext';
import { Reservation } from '../../types/types';
import { reservationDetailModalStyles as styles } from '../../style/bookings/reservationDetailModal.styles';

const STATUS_COLOR: Record<string, string> = {
  CONFIRMADA: '#22c55e',
  PENDIENTE: '#f59e0b',
  CANCELADA: '#ef4444',
  FINALIZADA: '#6b7280',
};

type Props = {
  reservation: Reservation | null;
  onClose: () => void;
  onCancel?: (id: number) => Promise<void>;
};

export default function ReservationDetailModal({
  reservation,
  onClose,
  onCancel,
}: Props) {
  const { theme } = useAppTheme();
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!reservation) return null;

  const handleClose = () => {
    setConfirming(false);
    onClose();
  };

  const handleCancel = () => setConfirming(true);

  const handleConfirmCancel = async () => {
    if (!onCancel) return;
    setCancelling(true);
    setConfirming(false);
    try {
      await onCancel(reservation.id);
      onClose();
    } catch {
      setCancelling(false);
    }
  };

  const statusColor = STATUS_COLOR[reservation.status] ?? theme.primary;
  const court = reservation.court;
  const payment = reservation.payments?.[0];
  const membership = reservation.user?.membership;

  const isPaid = payment?.payment_status === 'Pagado';
  const isRefunded = payment?.payment_status === 'Reembolsado';

  const isPast = (() => {
    const [h, m] = reservation.end_time.split(':').map(Number);
    const end = new Date(reservation.reservation_date);
    end.setHours(h, m, 0, 0);
    return end < new Date();
  })();

  const canCancel =
    !isPast &&
    (reservation.status === 'PENDIENTE' || reservation.status === 'CONFIRMADA');
  const willRefund = reservation.status === 'CONFIRMADA' && isPaid;

  const date = new Date(reservation.reservation_date).toLocaleDateString(
    undefined,
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  );

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          style={styles.backdropTouchLayer}
        />
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.background,
                borderColor: theme.borderSoft,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.courtName, { color: theme.textTitle }]}>
                  {court?.name ?? '-'}
                </Text>
                <Text style={[styles.courtType, { color: theme.textMuted }]}>
                  {court?.courtType?.name ?? '-'}
                </Text>
              </View>
              <View style={{ gap: 6, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons
                    name="close-circle"
                    size={26}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: statusColor + '22',
                      borderColor: statusColor,
                    },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: statusColor }]}>
                    {reservation.status}
                  </Text>
                </View>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={styles.contentScroll}
              contentContainerStyle={styles.contentScrollContainer}
            >
              {/* Reserva */}
              <SectionLabel label="Reserva" theme={theme} />
              <Row
                icon="calendar-outline"
                label="Fecha"
                value={date}
                theme={theme}
              />
              <Row
                icon="time-outline"
                label="Hora inicio"
                value={reservation.start_time.slice(0, 5)}
                theme={theme}
              />
              <Row
                icon="time-outline"
                label="Hora fin"
                value={reservation.end_time.slice(0, 5)}
                theme={theme}
              />
              <Row
                icon="cash-outline"
                label="Total"
                value={
                  reservation.total_price ? reservation.total_price + ' €' : '-'
                }
                theme={theme}
              />
              {!!reservation.note && (
                <Row
                  icon="document-text-outline"
                  label="Nota"
                  value={reservation.note}
                  theme={theme}
                />
              )}

              {!!reservation.verification_code && !isPast && (
                <View
                  style={[
                    styles.qrWrap,
                    {
                      borderColor: theme.borderSoft,
                      backgroundColor: theme.backgroundAlt,
                    },
                  ]}
                >
                  <Text style={[styles.qrTitle, { color: theme.textTitle }]}>
                    Codigo de verificacion
                  </Text>
                  <View style={styles.qrCard}>
                    <QRCode
                      value={reservation.verification_code}
                      size={150}
                      backgroundColor="white"
                      color="black"
                    />
                  </View>
                  <Text style={[styles.qrCodeText, { color: theme.textTitle }]}>
                    {reservation.verification_code.toUpperCase()}
                  </Text>
                </View>
              )}

              {/* Detalles de la pista */}
              {!!court && (
                <>
                  <SectionLabel label="Detalles de la pista" theme={theme} />
                  <Row
                    icon={court.is_covered ? 'home-outline' : 'sunny-outline'}
                    label="Cubierta"
                    value={court.is_covered ? 'Sí' : 'No'}
                    theme={theme}
                  />
                  <Row
                    icon="flashlight-outline"
                    label="Luz artificial"
                    value={court.has_lighting ? 'Sí' : 'No'}
                    theme={theme}
                  />
                  {!!court.capacity && (
                    <Row
                      icon="people-outline"
                      label="Capacidad"
                      value={String(court.capacity)}
                      theme={theme}
                    />
                  )}
                  {!!court.description && (
                    <Row
                      icon="information-circle-outline"
                      label="Descripción"
                      value={court.description}
                      theme={theme}
                    />
                  )}
                </>
              )}

              {/* Pago */}
              <SectionLabel label="Pago" theme={theme} />
              <Row
                icon="card-outline"
                label="Método de pago"
                value={payment?.payment_method ?? 'No disponible'}
                theme={theme}
              />
              {!!payment?.payment_status && (
                <Row
                  icon={isRefunded ? 'refresh-circle-outline' : 'checkmark-circle-outline'}
                  label="Estado del pago"
                  value={payment.payment_status}
                  theme={theme}
                />
              )}
              {isRefunded && (
                <View style={styles.refundBanner}>
                  <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                  <Text style={styles.refundBannerText}>
                    Reembolso procesado correctamente
                    {payment?.refund_amount ? ` · ${payment.refund_amount} €` : ''}
                  </Text>
                </View>
              )}

              {/* Membresía */}
              {!!membership && (
                <>
                  <SectionLabel label="Membresía" theme={theme} />
                  <Row
                    icon="star-outline"
                    label="Nivel"
                    value={membership.name}
                    theme={theme}
                  />
                  <Row
                    icon="pricetag-outline"
                    label="Descuento"
                    value={membership.discount + '%'}
                    theme={theme}
                  />
                  {!!membership.benefits && (
                    <Row
                      icon="ribbon-outline"
                      label="Beneficios"
                      value={membership.benefits}
                      theme={theme}
                    />
                  )}
                </>
              )}

              {canCancel && !!onCancel && !confirming && (
                <TouchableOpacity
                  style={[
                    styles.cancelBtn,
                    willRefund ? styles.refundBtn : styles.cancelBtnRed,
                    { opacity: cancelling ? 0.6 : 1 },
                  ]}
                  onPress={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <ActivityIndicator size="small" color={willRefund ? '#0ea5e9' : '#ef4444'} />
                  ) : (
                    <>
                      <Ionicons
                        name={willRefund ? 'card-outline' : 'close-circle-outline'}
                        size={16}
                        color={willRefund ? '#0ea5e9' : '#ef4444'}
                      />
                      <Text style={[styles.cancelBtnText, willRefund && styles.refundBtnText]}>
                        {willRefund ? 'Cancelar y devolver pago' : 'Cancelar reserva'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {confirming && (
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmTitle}>
                    {willRefund ? '¿Cancelar y devolver pago?' : '¿Cancelar reserva?'}
                  </Text>
                  <Text style={styles.confirmBody}>
                    {willRefund
                      ? `Se devolverán ${reservation.total_price} € automáticamente.`
                      : 'Esta acción no se puede deshacer.'}
                  </Text>
                  <View style={styles.confirmRow}>
                    <TouchableOpacity
                      style={styles.confirmNoBtn}
                      onPress={() => setConfirming(false)}
                    >
                      <Text style={styles.confirmNoText}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.confirmYesBtn, willRefund ? styles.refundBtn : styles.cancelBtnRed]}
                      onPress={handleConfirmCancel}
                    >
                      <Text style={[styles.cancelBtnText, willRefund && styles.refundBtnText]}>
                        {willRefund ? 'Sí, cancelar y devolver' : 'Sí, cancelar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

function SectionLabel({ label, theme }: { label: string; theme: any }) {
  return (
    <Text
      style={{
        color: theme.textMuted,
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginTop: 14,
        marginBottom: 6,
        paddingHorizontal: 2,
      }}
    >
      {label}
    </Text>
  );
}

function Row({
  icon,
  label,
  value,
  theme,
}: {
  icon: string;
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.surface, borderColor: theme.borderSoft },
      ]}
    >
      <Ionicons name={icon as any} size={16} color={theme.primary} />
      <Text style={[styles.rowLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.textTitle }]}>{value}</Text>
    </View>
  );
}

