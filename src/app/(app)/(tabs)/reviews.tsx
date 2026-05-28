import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAppTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { Court, JWTPayload, Reservation, Review } from '../../../types/types';

const FEATURE_USER_IDS = [41, 31, 39, 43];

export default function ReviewsScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
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

  const isReviewFeatureEnabled = userId !== null && FEATURE_USER_IDS.includes(userId);

  // "Mis reseñas" state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);

  // "Crear reseña" state (only for feature users)
  const [availableCourts, setAvailableCourts] = useState<Court[]>([]);
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const loadData = useCallback(async () => {
    if (userId === null) return;
    setLoading(true);
    try {
      const [reviewsRes, reservationsRes] = await Promise.allSettled([
        api.get('/reviews'),
        isReviewFeatureEnabled ? api.get('/reservations/my-reservations') : Promise.resolve(null),
      ]);

      let mine: Review[] = [];
      let reviewedCourtIds = new Set<number>();

      if (reviewsRes.status === 'fulfilled') {
        const payload = reviewsRes.value.data;
        const all: Review[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.items)
              ? payload.items
              : [];
        mine = all
          .filter((r) => Number(r.user_id) === Number(userId))
          .sort(
            (a, b) =>
              new Date(b.comment_date).getTime() -
              new Date(a.comment_date).getTime(),
          );
        setReviews(mine);
        reviewedCourtIds = new Set(mine.map((r) => Number(r.court_id)));
      }

      if (isReviewFeatureEnabled && reservationsRes.status === 'fulfilled' && reservationsRes.value) {
        const data = reservationsRes.value.data;
        const allRes: Reservation[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.items)
              ? data.items
              : [];

        const finalisedCourts = new Map<number, Court>();
        for (const r of allRes) {
          if (r.status === 'FINALIZADA' && r.court && !reviewedCourtIds.has(r.court_id)) {
            finalisedCourts.set(r.court_id, r.court);
          }
        }
        setAvailableCourts(Array.from(finalisedCourts.values()));
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [userId, isReviewFeatureEnabled]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateReview = async () => {
    if (!selectedCourtId) {
      Alert.alert('Reseñas', 'Selecciona una pista para continuar.');
      return;
    }
    if (!reviewTitle.trim()) {
      Alert.alert('Reseñas', 'El título de la reseña es obligatorio.');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('Reseñas', 'Escribe un comentario para la reseña.');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/reviews', {
        court_id: Number(selectedCourtId),
        title: reviewTitle.trim(),
        text: reviewText.trim(),
        rating: reviewRating,
      });
      setSelectedCourtId('');
      setReviewTitle('');
      setReviewText('');
      setReviewRating(5);
      await loadData();
      Alert.alert('Reseñas', 'Tu reseña se ha guardado correctamente.');
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      Alert.alert(
        'Reseñas',
        Array.isArray(msg) ? msg.join(' ') : msg || 'No se pudo guardar la reseña.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async (id: number) => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await api.put(`/reviews/${id}`, { text: editText.trim() });
      setEditingId(null);
      setEditText('');
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating: number) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={13}
          color={i <= rating ? '#FFD700' : theme.textMuted}
        />
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: Review }) => {
    const isEditing = editingId === item.id;
    const dateStr = item.comment_date ? item.comment_date.slice(0, 10) : '';
    const visibilityColor = item.is_visible ? '#22c55e' : '#f59e0b';
    const visibilityLabel = item.is_visible ? 'Visible' : 'Pendiente';

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundCard,
            borderColor: theme.borderSoft,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.courtName, { color: theme.textTitle }]}
              numberOfLines={1}
            >
              {item.court?.name ?? `Pista #${item.court_id}`}
            </Text>
            <Text
              style={[styles.courtType, { color: theme.textMuted }]}
              numberOfLines={1}
            >
              {item.court?.courtType?.name ?? ''}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: visibilityColor + '18',
                borderColor: visibilityColor,
              },
            ]}
          >
            <Text style={[styles.statusText, { color: visibilityColor }]}>
              {visibilityLabel}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {renderStars(item.rating)}
          <Text style={[styles.dateText, { color: theme.textMuted }]}>
            {dateStr}
          </Text>
        </View>

        {!!item.title && (
          <Text style={[styles.reviewTitle, { color: theme.textTitle }]}>
            {item.title}
          </Text>
        )}

        {isEditing ? (
          <View style={styles.editSection}>
            <TextInput
              style={[
                styles.editInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.primary,
                  color: theme.textTitle,
                },
              ]}
              value={editText}
              onChangeText={setEditText}
              multiline
              textAlignVertical="top"
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[
                  styles.editBtn,
                  styles.editBtnCancel,
                  { borderColor: theme.borderSoft },
                ]}
                onPress={() => {
                  setEditingId(null);
                  setEditText('');
                }}
              >
                <Text style={[styles.editBtnText, { color: theme.textMuted }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.editBtn,
                  styles.editBtnSave,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => handleEditSave(item.id)}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={theme.onPrimary} />
                ) : (
                  <Text style={[styles.editBtnText, { color: theme.onPrimary }]}>
                    Guardar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={[styles.reviewText, { color: theme.textBody }]}>
            {item.text}
          </Text>
        )}

        {!!item.admin_answer && (
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
              {item.admin_answer}
            </Text>
          </View>
        )}

        {!isEditing && (
          <TouchableOpacity
            style={[styles.editTrigger, { borderColor: theme.borderSoft }]}
            onPress={() => {
              setEditingId(item.id);
              setEditText(item.text);
            }}
          >
            <Ionicons name="create-outline" size={14} color={theme.textMuted} />
            <Text style={[styles.editTriggerText, { color: theme.textMuted }]}>
              Editar reseña
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCreateSection = () => (
    <View
      style={[
        styles.createCard,
        { backgroundColor: theme.backgroundCard, borderColor: theme.primarySoft },
      ]}
    >
      <Text style={[styles.createTitle, { color: theme.textTitle }]}>
        Crear reseña
      </Text>

      <Text style={[styles.createLabel, { color: theme.textBody }]}>
        Pista reservada
      </Text>
      <View style={styles.chipsWrap}>
        {availableCourts.length === 0 ? (
          <Text style={[styles.noCourtText, { color: theme.textMuted }]}>
            No tienes pistas pendientes de reseñar.
          </Text>
        ) : (
          availableCourts.map((court) => {
            const selected = selectedCourtId === String(court.id);
            return (
              <TouchableOpacity
                key={court.id}
                onPress={() => setSelectedCourtId(String(court.id))}
                style={[
                  styles.chip,
                  {
                    borderColor: selected ? theme.primary : theme.primarySoft,
                    backgroundColor: selected ? theme.primary + '20' : 'transparent',
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected ? theme.primary : theme.textBody,
                    fontWeight: selected ? '700' : '500',
                    fontSize: 13,
                  }}
                >
                  {court.name}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <Text style={[styles.createLabel, { color: theme.textBody }]}>
        Título
      </Text>
      <TextInput
        value={reviewTitle}
        onChangeText={setReviewTitle}
        placeholder="Resume tu experiencia..."
        placeholderTextColor={theme.textMuted}
        style={[
          styles.createInput,
          {
            backgroundColor: theme.surface,
            borderColor: theme.borderSoft,
            color: theme.textTitle,
          },
        ]}
        maxLength={100}
      />

      <Text style={[styles.createLabel, { color: theme.textBody }]}>
        Comentario
      </Text>
      <TextInput
        value={reviewText}
        onChangeText={setReviewText}
        placeholder="Cuéntanos tu experiencia..."
        placeholderTextColor={theme.textMuted}
        multiline
        textAlignVertical="top"
        style={[
          styles.createInput,
          styles.createTextarea,
          {
            backgroundColor: theme.surface,
            borderColor: theme.borderSoft,
            color: theme.textTitle,
          },
        ]}
        maxLength={500}
      />

      <Text style={[styles.createLabel, { color: theme.textBody }]}>
        Valoración
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
            <Ionicons
              name={reviewRating >= star ? 'star' : 'star-outline'}
              size={26}
              color={reviewRating >= star ? '#FFD700' : theme.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleCreateReview}
        disabled={submitting || availableCourts.length === 0}
        style={[
          styles.createBtn,
          {
            backgroundColor: theme.primary,
            opacity: submitting || availableCourts.length === 0 ? 0.6 : 1,
          },
        ]}
      >
        {submitting ? (
          <ActivityIndicator size="small" color={theme.onPrimary} />
        ) : (
          <Text style={[styles.createBtnText, { color: theme.onPrimary }]}>
            Crear reseña
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && reviews.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingTop: headerHeight + 16,
              paddingBottom:
                insets.bottom + (Platform.OS === 'web' ? 100 : 120),
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
          ListHeaderComponent={
            <>
              {isReviewFeatureEnabled && renderCreateSection()}
              <Text style={[styles.pageTitle, { color: theme.textTitle }]}>
                Mis reseñas
              </Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="star-outline"
                size={52}
                color={theme.textMuted}
              />
              <Text style={[styles.emptyTitle, { color: theme.textTitle }]}>
                Sin reseñas
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
                Finaliza una reserva para poder dejar una valoración en la
                pista
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    listContent: { paddingHorizontal: 16, gap: 12 },
    pageTitle: {
      fontSize: 26,
      fontWeight: '900',
      marginBottom: 4,
    },
    card: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      gap: 10,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    courtName: {
      fontSize: 15,
      fontWeight: '800',
    },
    courtType: {
      fontSize: 12,
      marginTop: 2,
    },
    statusBadge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    dateText: {
      fontSize: 12,
      fontWeight: '500',
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
    editSection: { gap: 10 },
    editInput: {
      borderWidth: 1.5,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      minHeight: 90,
    },
    editActions: { flexDirection: 'row', gap: 10 },
    editBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editBtnCancel: { borderWidth: 1, backgroundColor: 'transparent' },
    editBtnSave: {},
    editBtnText: { fontSize: 14, fontWeight: '700' },
    editTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
    },
    editTriggerText: { fontSize: 12, fontWeight: '600' },
    emptyState: {
      paddingTop: 60,
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
    },
    emptyTitle: { fontSize: 18, fontWeight: '800' },
    emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
    // Create section
    createCard: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      marginBottom: 20,
    },
    createTitle: { fontSize: 20, fontWeight: '800', marginBottom: 14 },
    createLabel: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
    chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    chip: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    noCourtText: { fontSize: 13, marginBottom: 14 },
    createInput: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      marginBottom: 14,
    },
    createTextarea: { minHeight: 90, paddingTop: 12 },
    createBtn: {
      height: 46,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    createBtnText: { fontSize: 15, fontWeight: '800' },
  });
