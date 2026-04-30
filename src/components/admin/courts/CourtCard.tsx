import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pista } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { pistasStyles as styles } from '../../../style/admin/courts.styles';
import { useTranslation } from 'react-i18next';

type Props = {
  item: Pista;
  theme: AppTheme;
  onEdit: (item: Pista) => void;
  onMaintenance: (item: Pista) => void;
  onDelete: (item: Pista) => void;
};

export function CourtCard({
  item,
  theme,
  onEdit,
  onMaintenance,
  onDelete,
}: Props) {
  const { t } = useTranslation();
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
            {item.instalacion?.nombre || t('courtCardInstallationFallback')}
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
          text={t('courtCardCapacity', { count: item.capacidad })}
          theme={theme}
        />
        <DetailItem
          icon="cash-outline"
          text={`${item.precio_hora}€/h`}
          theme={theme}
        />
        <DetailItem
          icon={item.cubierta ? 'business-outline' : 'trail-sign-outline'}
          text={item.cubierta ? t('courtCardCovered') : t('courtCardOutdoor')}
          theme={theme}
        />
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
            {t('courtCardEdit')}
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
          onPress={() => onMaintenance(item)}
        >
          <Ionicons name="construct-outline" size={18} color={theme.textBody} />
          <Text
            style={{ color: theme.textBody, marginLeft: 4, fontWeight: '600' }}
          >
            {t('courtCardMaintenance')}
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
            {t('courtCardDelete')}
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
      <Ionicons name={icon} size={14} color={theme.textSubtitle} />
      <Text style={{ fontSize: 12, marginLeft: 4, color: theme.textBody }}>
        {text}
      </Text>
    </View>
  );
}
