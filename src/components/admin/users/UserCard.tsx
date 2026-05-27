import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Membership, User } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { usersAdminStyles as styles } from '../../../style/admin/users.styles';

type AdminUser = User & {
  membership?: Membership | null;
};

type Props = {
  item: AdminUser;
  theme: AppTheme;
  onEdit: (item: AdminUser) => void;
  onToggleActive: (item: AdminUser) => void;
};

const formatLastTimeSeen = (value?: string | null) => {
  if (!value) return 'Nunca';
  const trimmed = String(value).trim();
  if (!trimmed) return 'Nunca';

  // Backend can send SQL-like datetime: "YYYY-MM-DD HH:mm:ss"
  const normalized = trimmed.includes('T')
    ? trimmed
    : trimmed.replace(' ', 'T');
  let parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    const match = trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2})(?::(\d{2}))?$/,
    );
    if (!match) return 'Nunca';

    const [, y, m, d, hh, mm, ss = '00'] = match;
    parsed = new Date(
      Number(y),
      Number(m) - 1,
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss),
    );
    if (Number.isNaN(parsed.getTime())) return 'Nunca';
  }

  return parsed.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function UserCard({ item, theme, onEdit, onToggleActive }: Props) {
  const membershipLabel = item.membership?.name
    ? `${item.membership.name} · Nivel ${item.membership.level}`
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
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={[styles.cardTitle, { color: theme.textTitle }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.username}
          </Text>
          <Text
            style={[
              styles.cardSubtitle,
              { color: theme.textBody, fontSize: 12 },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.email}
          </Text>
        </View>
        <View
          style={[
            styles.pill,
            {
              backgroundColor: item.is_active ? '#4CAF5020' : '#F4433620',
              borderColor: item.is_active ? '#4CAF50' : '#F44336',
            },
          ]}
        >
          <Text
            style={{
              color: item.is_active ? '#4CAF50' : '#F44336',
              fontWeight: '700',
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.is_active ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
        <View
          style={[
            styles.pill,
            {
              backgroundColor: item.email_verified ? '#4CAF5020' : '#F4433620',
              borderColor: item.email_verified ? '#4CAF50' : '#F44336',
              marginLeft: 6,
            },
          ]}
        >
          <Text
            style={{
              color: item.email_verified ? '#4CAF50' : '#F44336',
              fontWeight: '700',
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.email_verified ? 'Verificado' : 'Sin verificar'}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsScrollContent}
        style={styles.rowWrap}
      >
        <MetaPill label={item.role} theme={theme} />
        <MetaPill label={membershipLabel} theme={theme} />
        <MetaPill label={item.phone || 'Sin telefono'} theme={theme} />
        <MetaPill
          label={`Ult. vez: ${formatLastTimeSeen(item.last_time_seen)}`}
          theme={theme}
        />
      </ScrollView>

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
              item.is_active
                ? 'pause-circle-outline'
                : 'checkmark-circle-outline'
            }
            size={18}
            color={theme.textBody}
          />
          <Text
            style={{ color: theme.textBody, marginLeft: 4, fontWeight: '600' }}
          >
            {item.is_active ? 'Desactivar' : 'Activar'}
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
        styles.metaPill,
        {
          backgroundColor: theme.primary + '10',
          borderColor: theme.primarySoft,
        },
      ]}
    >
      <Text
        style={{ color: theme.textBody, fontSize: 12, fontWeight: '600' }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );
}
