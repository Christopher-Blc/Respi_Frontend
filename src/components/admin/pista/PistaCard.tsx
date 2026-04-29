import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pista } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { pistasStyles as styles } from '../../../style/admin/pistas.styles';

type Props = {
  item: Pista;
  theme: AppTheme;
  onEdit: (item: Pista) => void;
  onMaintenance: (item: Pista) => void;
  onDelete: (item: Pista) => void;
};

export function PistaCard({
  item,
  theme,
  onEdit,
  onMaintenance,
  onDelete,
}: Props) {
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
            {item.instalacion?.nombre || 'Instalación N/D'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.estado === 'DISPONIBLE' ? '#4CAF5020' : '#F4433620',
            },
          ]}
        >
          <Text
            style={{
              color: item.estado === 'DISPONIBLE' ? '#4CAF50' : '#F44336',
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {item.estado}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <DetailItem
          icon="people-outline"
          text={`Cap: ${item.capacidad}`}
          theme={theme}
        />
        <DetailItem
          icon="cash-outline"
          text={`${item.precio_hora}€/h`}
          theme={theme}
        />
        <DetailItem
          icon={item.cubierta ? 'business-outline' : 'trail-sign-outline'}
          text={item.cubierta ? 'Cubierta' : 'Exterior'}
          theme={theme}
        />
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.btnAction, { backgroundColor: theme.primary + '15' }]}
          onPress={() => onEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color={theme.primary} />
          <Text
            style={{ color: theme.primary, marginLeft: 4, fontWeight: '600' }}
          >
            Editar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAction, { backgroundColor: '#FF980015' }]}
          onPress={() => onMaintenance(item)}
        >
          <Ionicons name="construct-outline" size={18} color="#FF9800" />
          <Text style={{ color: '#FF9800', marginLeft: 4, fontWeight: '600' }}>
            Mant.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAction, { backgroundColor: '#F4433615' }]}
          onPress={() => onDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
          <Text style={{ color: '#F44336', marginLeft: 4, fontWeight: '600' }}>
            Borrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type DetailItemProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
  theme: AppTheme;
};

function DetailItem({ icon, text, theme }: DetailItemProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name={icon} size={14} color={theme.primary} />
      <Text style={{ fontSize: 12, marginLeft: 4, color: theme.textBody }}>
        {text}
      </Text>
    </View>
  );
}
