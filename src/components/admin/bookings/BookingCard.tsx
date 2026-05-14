import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reservation } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { bookingsAdminStyles as styles } from '../../../style/admin/bookings.styles';

type Props = {
  item: Reservation;
  theme: AppTheme;
  onEdit: (item: Reservation) => void;
  onCancel: (item: Reservation) => void;
  onDelete: (item: Reservation) => void;
};

const statusColorMap: Record<string, string> = {
  CONFIRMADA: '#1E88E5',
  PENDIENTE: '#FB8C00',
  CANCELADA: '#E53935',
  FINALIZADA: '#43A047',
};

export function BookingCard({
  item,
  theme,
  onEdit,
  onCancel,
  onDelete,
}: Props) {
  const statusColor = statusColorMap[item.status] || theme.textBody;
  const canCancel = item.status !== 'FINALIZADA' && item.status !== 'CANCELADA';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundCard,
          borderColor: theme.primarySoft,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.textTitle }]}>
            Reserva {item.id}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textBody }]}>
            {item.reservation_date} · {String(item.start_time).slice(0, 5)}-
            {String(item.end_time).slice(0, 5)}
          </Text>
        </View>
        <View
          style={[
            styles.pill,
            {
              borderColor: statusColor + '55',
              backgroundColor: statusColor + '18',
            },
          ]}
        >
          <Text style={{ color: statusColor, fontSize: 12, fontWeight: '700' }}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.rowWrap}>
        <View
          style={[
            styles.pill,
            {
              borderColor: theme.primarySoft,
              backgroundColor: theme.primary + '10',
            },
          ]}
        >
          <Text style={{ color: theme.textBody, fontWeight: '600' }}>
            Usuario: {item.user?.username || item.user_id}
          </Text>
        </View>

        <View
          style={[
            styles.pill,
            {
              borderColor: theme.primarySoft,
              backgroundColor: theme.primary + '10',
            },
          ]}
        >
          <Text style={{ color: theme.textBody, fontWeight: '600' }}>
            Pista: {item.court?.name || item.court_id}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[
            styles.btnAction,
            {
              backgroundColor: theme.primary + '12',
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={() => onEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color={theme.textBody} />
          <Text
            style={{ color: theme.textBody, marginLeft: 4, fontWeight: '600' }}
          >
            Editar
          </Text>
        </TouchableOpacity>

        {canCancel && (
          <TouchableOpacity
            style={[
              styles.btnAction,
              {
                backgroundColor: '#E6510012',
                borderWidth: 1,
                borderColor: '#E6510040',
              },
            ]}
            onPress={() => onCancel(item)}
          >
            <Ionicons
              name="close-circle-outline"
              size={18}
              color={theme.textBody}
            />
            <Text
              style={{
                color: theme.textBody,
                marginLeft: 4,
                fontWeight: '600',
              }}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.btnAction,
            {
              backgroundColor: '#B71C1C12',
              borderWidth: 1,
              borderColor: '#B71C1C44',
            },
          ]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color={theme.textBody} />
          <Text
            style={{ color: theme.textBody, marginLeft: 4, fontWeight: '600' }}
          >
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
