import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import { useAppTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { CourtAvailability, JWTPayload, Reservation, Review } from '../../types/types';
import api from '../../services/api';
import CreateReviewModal from './CreateReviewModal';

type Props = {
  court: CourtAvailability | null;
  onClose: () => void;
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: full }).map((_, i) => (
        <Ionicons key={`f${i}`} name="star" size={size} color="#FFD700" />
      ))}
      {half && <Ionicons name="star-half" size={size} color="#FFD700" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Ionicons key={`e${i}`} name="star-outline" size={size} color="#FFD700" />
      ))}
    </View>
  );
}

function ReviewItem({
  review,
  theme,
  isOwn,
}: {
  review: Review;
  theme: any;
  isOwn: boolean;
}) {
  const dateStr = review.comment_date ? review.comment_date.slice(0, 10) : '';
  return (
    <View
      style={[
        styles.reviewItem,
        { backgroundColor: theme.surface, borderColor: theme.borderSoft },
      ]}
    >
      <View style={styles.reviewHeader}>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.reviewUser, { color: theme.textTitle }]}
            numberOfLines={1}
          >
            {review.user?.username ?? `Usuario #${review.user_id}`}
            {isOwn && (
              <Text style={{ color: theme.primary, fontWeight: '700' }}>
                {' '}(tú)
              </Text>
            )}
          </Text>
          <StarRow rating={review.rating} size={13} />
        </View>
        <Text style={[styles.reviewDate, { color: theme.textMuted }]}>
          {dateStr}
        </Text>
      </View>
      {!!review.title && (
        <Text style={[styles.reviewTitle, { color: theme.textTitle }]}>
          {review.title}
        </Text>
      )}
      <Text style={[styles.reviewText, { color: theme.textBody }]}>
        {review.text}
      </Text>
      {!!review.admin_answer && (
        <View
          style={[
            styles.adminReply,
            {
              backgroundColor: theme.primary + '0D',
              borderColor: theme.primarySoft,
            },
          ]}
        >
          <Text style={[styles.adminReplyLabel, { color: theme.primary }]}>
            Respuesta del equipo
          </Text>
          <Text style={[styles.adminReplyText, { color: theme.textBody }]}>
            {review.admin_answer}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function CourtReviewsModal({ court, onClose }: Props) {
  const { theme } = useAppTheme();
  const { userToken } = useAuth();

  const userId = useMemo<number | null>(() => {
    if (!userToken) return null;
    try {
      const decoded = jwtDecode(userToken) as unknown as JWTPayload;
      return decoded.sub ?? null;
    } catch {
      return null;
    }
  }, [userToken]);

  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [hasFinalisedReservation, setHasFinalisedReservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);

  const loadData = useCallback(async () => {
    if (!court || userId === null) return;
    setLoading(true);
    try {
      const [reviewsRes, reservationsRes] = await Promise.allSettled([
        api.get('/reviews'),
        api.get('/reservations/my-reservations'),
      ]);

      if (reviewsRes.status === 'fulfilled') {
        const payload = reviewsRes.value.data;
        const all: any[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.items)
              ? payload.items
              : [];
        const forCourt = all.filter((r) =>
          court.name && r.court?.name
            ? r.court.name === court.name
            : Number(r.court_id) === Number(court.id),
        );
        setVisibleReviews(forCourt);
        setUserHasReviewed(
          forCourt.some((r) => Number(r.user_id) === Number(userId)),
        );
      }

      if (reservationsRes.status === 'fulfilled') {
        const data = reservationsRes.value.data;
        const all: Reservation[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.items)
              ? data.items
              : [];
        setHasFinalisedReservation(
          all.some(
            (r) =>
              r.status === 'FINALIZADA' &&
              (court.name && r.court?.name
                ? r.court.name === court.name
                : Number(r.court_id) === Number(court.id)),
          ),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [court, userId]);

  useEffect(() => {
    if (court && userId !== null) {
      setVisibleReviews([]);
      setUserHasReviewed(false);
      setHasFinalisedReservation(false);
      loadData();
    }
  }, [court?.id, userId]);

  const avgRating =
    visibleReviews.length
      ? visibleReviews.reduce((sum, r) => sum + r.rating, 0) /
        visibleReviews.length
      : 0;

  const isCourtAvailable = court?.status === 'DISPONIBLE';
  const canCreateReview =
    hasFinalisedReservation && !userHasReviewed && isCourtAvailable;

  if (!court) return null;

  return (
    <>
      <Modal
        visible
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.backdrop}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            style={styles.backdropTouch}
          />
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.backgroundCard,
                  borderColor: theme.primarySoft,
                },
              ]}
            >
              <View
                style={[styles.handle, { backgroundColor: theme.borderSoft }]}
              />

              {/* Header */}
              <View style={styles.sheetHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sheetTitle, { color: theme.textTitle }]}>
                    {court.name}
                  </Text>
                  <View style={styles.summaryRow}>
                    <StarRow rating={avgRating} size={14} />
                    <Text
                      style={[styles.summaryText, { color: theme.textMuted }]}
                    >
                      {visibleReviews.length > 0
                        ? `${avgRating.toFixed(1)} · ${visibleReviews.length} reseña${visibleReviews.length !== 1 ? 's' : ''}`
                        : 'Sin reseñas'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={28}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* CTA section */}
              <View
                style={[
                  styles.ctaSection,
                  { borderTopColor: theme.borderSoft },
                ]}
              >
                {canCreateReview && (
                  <TouchableOpacity
                    style={[
                      styles.ctaBtn,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={() => setCreateVisible(true)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color={theme.onPrimary}
                    />
                    <Text
                      style={[styles.ctaBtnText, { color: theme.onPrimary }]}
                    >
                      Escribir reseña
                    </Text>
                  </TouchableOpacity>
                )}
                {userHasReviewed && (
                  <View
                    style={[
                      styles.infoNote,
                      {
                        backgroundColor: theme.primary + '12',
                        borderColor: theme.primarySoft,
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={theme.primary}
                    />
                    <Text
                      style={[styles.infoNoteText, { color: theme.primary }]}
                    >
                      Ya has valorado esta pista
                    </Text>
                  </View>
                )}
                {!userHasReviewed && !hasFinalisedReservation && !loading && (
                  <View
                    style={[
                      styles.lockedNote,
                      {
                        backgroundColor: theme.backgroundAlt,
                        borderColor: theme.borderSoft,
                      },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={15}
                      color={theme.textMuted}
                    />
                    <Text
                      style={[styles.lockedText, { color: theme.textMuted }]}
                    >
                      Podrás añadir una reseña después de finalizar una reserva
                    </Text>
                  </View>
                )}
              </View>

              {/* Reviews list */}
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.primary}
                  style={{ marginVertical: 30 }}
                />
              ) : visibleReviews.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="star-outline"
                    size={44}
                    color={theme.textMuted}
                  />
                  <Text
                    style={[styles.emptyTitle, { color: theme.textTitle }]}
                  >
                    Sin reseñas aún
                  </Text>
                  {canCreateReview && (
                    <Text
                      style={[
                        styles.emptySubtitle,
                        { color: theme.textMuted },
                      ]}
                    >
                      ¡Sé el primero en valorar esta pista!
                    </Text>
                  )}
                </View>
              ) : (
                <FlatList
                  data={visibleReviews}
                  keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={styles.list}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <ReviewItem
                      review={item}
                      theme={theme}
                      isOwn={Number(item.user_id) === Number(userId)}
                    />
                  )}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>

      {createVisible && (
        <CreateReviewModal
          court={court}
          onClose={() => setCreateVisible(false)}
          onCreated={() => {
            setCreateVisible(false);
            loadData();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '86%',
    minHeight: 200,
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaBtnText: {
    fontSize: 15,
    fontWeight: '800',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoNoteText: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  lockedNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  lockedText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 10,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
    paddingTop: 6,
  },
  reviewItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewText: {
    fontSize: 13,
    lineHeight: 19,
  },
  adminReply: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  adminReplyLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adminReplyText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
