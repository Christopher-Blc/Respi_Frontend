import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { usersAdminStyles as styles } from '../../../style/admin/users.styles';

type AdminUser = User & {
  membresia?: { tipo?: string; rango?: string } | null;
};

type Props = {
  item: AdminUser;
  theme: AppTheme;
  onEdit: (item: AdminUser) => void;
  onToggleActive: (item: AdminUser) => void;
};

export function UserCard({ item, theme, onEdit, onToggleActive }: Props) {
  const membershipLabel = item.membresia?.tipo
    ? `${item.membresia.tipo} · Rango ${item.membresia?.rango || '-'}`
    : 'Sin membresia';

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
            {item.username}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textBody }]}>
            {item.name} {item.surname} · {item.email}
          </Text>
        </View>
        <View
          style={[
            styles.pill,
            {
              backgroundColor: item.isActive ? '#4CAF5020' : '#F4433620',
              borderColor: item.isActive ? '#4CAF50' : '#F44336',
            },
          ]}
        >
          <Text
            style={{
              color: item.isActive ? '#4CAF50' : '#F44336',
              fontWeight: '700',
            }}
          >
            {item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
      </View>

      <View style={styles.rowWrap}>
        <MetaPill label={item.role} theme={theme} />
        <MetaPill label={membershipLabel} theme={theme} />
        <MetaPill label={item.phone || 'Sin telefono'} theme={theme} />
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
        <TouchableOpacity
          style={[
            styles.btnAction,
            {
              backgroundColor: theme.primary + '12',
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={() => onToggleActive(item)}
        >
          <Ionicons
            name={
              item.isActive
                ? 'pause-circle-outline'
                : 'checkmark-circle-outline'
            }
            size={18}
            color={theme.textBody}
          />
          <Text
            style={{ color: theme.textBody, marginLeft: 4, fontWeight: '600' }}
          >
            {item.isActive ? 'Desactivar' : 'Activar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MetaPill({ label, theme }: { label: string; theme: AppTheme }) {
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: theme.primary + '10',
          borderColor: theme.primarySoft,
        },
      ]}
    >
      <Text style={{ color: theme.textBody, fontSize: 12, fontWeight: '600' }}>
        {label}
      </Text>
    </View>
  );
}
