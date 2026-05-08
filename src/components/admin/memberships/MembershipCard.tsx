import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Membership } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { membershipsStyles as styles } from '../../../style/admin/memberships.styles';

type Props = {
  item: Membership;
  theme: AppTheme;
  onEdit: (item: Membership) => void;
  onDelete: (item: Membership) => void;
};

export function MembershipCard({ item, theme, onEdit, onDelete }: Props) {
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
            {item.name}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textBody }]}>
            Nivel {item.level} · {item.discount}% dto ·{' '}
            {item.required_reservations} reservas
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#2196F320' }]}>
          <Text style={{ color: '#2196F3', fontSize: 12, fontWeight: 'bold' }}>
            #{item.level}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.textBody, marginBottom: 12 }}>
        {item.benefits}
      </Text>

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

        <TouchableOpacity
          style={[
            styles.btnAction,
            {
              backgroundColor: theme.primary + '12',
              borderWidth: 1,
              borderColor: theme.primarySoft,
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
