import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourtType } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { tiposPistaStyles as styles } from '../../../style/admin/courtTypes.styles';
import { API_PUBLIC_URL } from '../../../constants';

const getImageUri = (
  imagePath: string | null | undefined,
): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_PUBLIC_URL}/${imagePath.replace(/^\//, '')}`;
};

type Props = {
  item: CourtType;
  theme: AppTheme;
  onEdit: (item: CourtType) => void;
  onDelete: (item: CourtType) => void;
};

export function TipoCourtCard({ item, theme, onEdit, onDelete }: Props) {
  const pistasCount = item.totalCourts ?? 0;

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
      {item.image ? (
        <Image
          source={{ uri: getImageUri(item.image) }}
          style={{
            width: '100%',
            height: 120,
            borderRadius: 10,
            marginBottom: 12,
          }}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.textTitle }]}>
            {item.name}
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
