import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../theme';
import { membershipsStyles as styles } from '../../../style/admin/memberships.styles';
import { Installation } from '../../../types/types';

type Props = {
  item: Installation;
  theme: AppTheme;
  onEdit: (item: Installation) => void;
  onDelete: (item: Installation) => void;
};

export function InstallationCard({ item, theme, onEdit, onDelete }: Props) {
  const isInactive = String(item.status || '').toLowerCase() === 'inactiva';

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
            {item.phone || 'Sin telefono'} · {item.email || 'Sin email'}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isInactive ? '#F4433620' : '#4CAF5020',
            },
          ]}
        >
          <Text
            style={{
              color: isInactive ? '#F44336' : '#4CAF50',
              fontSize: 11,
              fontWeight: '700',
            }}
          >
            {item.status || 'activa'}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.textBody, marginBottom: 6 }}>
        {item.address}
      </Text>

      {!!item.description && (
        <Text style={{ color: theme.textBody, marginBottom: 12 }}>
          {item.description}
        </Text>
      )}

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
