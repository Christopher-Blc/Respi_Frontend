import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Reservation } from '../../types/types';
import { lightModeSemanticTokens } from '../../theme';
import { useTranslation } from 'react-i18next';

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightModeSemanticTokens.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightModeSemanticTokens.borderSoft,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  code: { fontWeight: '700' },
  status: { color: '#374151' },
  meta: { color: '#6b7280', marginTop: 4 },
  note: { marginTop: 8, color: '#374151' },
  actions: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  cancel: {
    backgroundColor: lightModeSemanticTokens.danger,
    borderColor: lightModeSemanticTokens.danger,
  },
  btnText: { color: '#06b6d4', fontWeight: '600' },
});
