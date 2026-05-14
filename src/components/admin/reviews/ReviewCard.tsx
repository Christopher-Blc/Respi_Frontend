import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../theme';
import { reviewsStyles as styles } from '../../../style/admin/reviews.styles';
import { AdminReview } from '../../../hooks/useAdminReviews';

type Props = {
  item: AdminReview;
  theme: AppTheme;
  onAnswer: (item: AdminReview) => void;
};

const renderStars = (rating: number, theme: AppTheme) => {
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, index) => {
        const iconName = index < safeRating ? 'star' : 'star-outline';
        return (
          <Ionicons
            key={`${rating}-${index}`}
            name={iconName}
            size={16}
            color={index < safeRating ? theme.primary : theme.textBody + '55'}
          />
        );
      })}
      <Text style={{ color: theme.textBody, fontSize: 12, marginLeft: 4 }}>
        {safeRating}/5
      </Text>
    </View>
  );
};

export function ReviewCard({ item, theme, onAnswer }: Props) {
  const hasAdminAnswer = Boolean(String(item.admin_answer || '').trim());
  const answerLabel = hasAdminAnswer ? 'Contestada' : 'Pendiente';
  const answerColor = hasAdminAnswer ? '#22C55E' : '#F59E0B';

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
          >
            {item.title}
          </Text>
          <Text
            style={[styles.cardSubtitle, { color: theme.textBody }]}
            numberOfLines={1}
          >
            {item.court?.name || `Pista #${item.court_id}`} ·{' '}
            {item.user?.username || `Usuario #${item.user_id}`}
          </Text>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: answerColor + '18',
              borderColor: answerColor + '35',
            },
          ]}
        >
          <Text style={{ color: answerColor, fontSize: 12, fontWeight: '700' }}>
            {answerLabel}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        {renderStars(item.rating, theme)}
        <Text style={{ color: theme.textBody, fontSize: 12 }}>
          {item.comment_date
            ? String(item.comment_date).slice(0, 10)
            : 'Sin fecha'}
        </Text>
      </View>

      <Text
        style={[styles.reviewText, { color: theme.textBody }]}
        numberOfLines={4}
      >
        {item.text}
      </Text>

      <View
        style={[
          styles.adminAnswerBox,
          {
            borderColor: theme.primarySoft,
            backgroundColor: theme.backgroundMain,
          },
        ]}
      >
        <Text style={[styles.adminAnswerLabel, { color: theme.textSubtitle }]}>
          Respuesta admin
        </Text>
        <Text
          style={[styles.adminAnswerText, { color: theme.textBody }]}
          numberOfLines={3}
        >
          {hasAdminAnswer ? item.admin_answer : 'Aun no hay respuesta.'}
        </Text>
      </View>

      <View style={{ flex: 1 }} />

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
          onPress={() => onAnswer(item)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={theme.textBody}
          />
          <Text
            style={{ color: theme.textBody, marginLeft: 4, fontWeight: '600' }}
          >
            {hasAdminAnswer ? 'Editar respuesta' : 'Contestar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
