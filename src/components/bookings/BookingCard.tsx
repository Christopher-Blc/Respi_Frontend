import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Reservation } from '../../types/types';
import { lightModeSemanticTokens } from '../../theme';
import { useTranslation } from 'react-i18next';
import { bookingCardStyles as styles } from '../../style/bookings/bookingCard.styles';

type Props = {
  reserva: Reservation;
  onCancel?: (id: number) => void;
  onEdit?: (id: number) => void;
};

export default function BookingCard({ reserva, onCancel, onEdit }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.code}>{reserva.id}</Text>
        <Text style={styles.status}>{reserva.status}</Text>
      </View>

      <Text style={styles.meta}>
        {t('reservationCardStart', {
          value: new Date(
            `${reserva.reservation_date}T${reserva.start_time}`,
          ).toLocaleString(),
        })}
      </Text>
      <Text style={styles.meta}>
        {t('reservationCardEnd', {
          value: new Date(
            `${reserva.reservation_date}T${reserva.end_time}`,
          ).toLocaleString(),
        })}
      </Text>

      {reserva.note ? (
        <Text style={styles.note}>
          {t('reservationCardNote', { value: reserva.note })}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onEdit?.(reserva.id)}
        >
          <Text style={styles.btnText}>{t('reservationCardEdit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.cancel]}
          onPress={() => onCancel?.(reserva.id)}
        >
          <Text
            style={[
              styles.btnText,
              { color: lightModeSemanticTokens.onPrimary },
            ]}
          >
            {t('reservationCardCancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

