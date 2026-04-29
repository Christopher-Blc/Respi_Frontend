import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TipoPista } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { tiposPistaStyles as styles } from '../../../style/admin/tiposPista.styles';

type Props = {
  item: TipoPista;
  theme: AppTheme;
  onEdit: (item: TipoPista) => void;
  onDelete: (item: TipoPista) => void;
};

export function TipoPistaCard({ item, theme, onEdit, onDelete }: Props) {
  const pistasCount = item.pistas?.length ?? 0;

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
            {item.nombre}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textBody }]}>
            {item.imagen}
          </Text>
        </View>
        <View
          style={[
            styles.pistasCountBadge,
            {
              backgroundColor: pistasCount > 0 ? '#2196F320' : '#9E9E9E20',
            },
          ]}
        >
          <Text
            style={{
              color: pistasCount > 0 ? '#2196F3' : '#9E9E9E',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {pistasCount} pista{pistasCount !== 1 ? 's' : ''}
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
