<<<<<<< HEAD
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
=======
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
>>>>>>> d3c03d371cbe9660d1f057b9b15e9bc4ecb31fad
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
<<<<<<< HEAD
import { JWTPayload, Review } from '../../../types/types';
=======
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';

const extractRows = (payload: unknown) => {
  if (Array.isArray(payload)) return payload;
  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown[] }).data)
  ) {
    return (payload as { data: unknown[] }).data;
  }
  return [];
};

const normalizeReview = (item: any, index: number): Review => ({
  id: Number(item?.id ?? item?.review_id ?? index),
  user_id: Number(item?.user_id ?? item?.user?.id ?? 0),
  court_id: Number(item?.court_id ?? item?.court?.id ?? 0),
  title: String(item?.title ?? ''),
  text: String(item?.text ?? item?.comment ?? ''),
  rating: Number(item?.rating ?? 0),
  comment_date: String(item?.comment_date ?? item?.created_at ?? ''),
  is_visible: Boolean(item?.is_visible ?? true),
  admin_answer: item?.admin_answer ? String(item.admin_answer) : null,
  user: item?.user,
  court: item?.court,
});
>>>>>>> d3c03d371cbe9660d1f057b9b15e9bc4ecb31fad

export default function ReviewsScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { userToken } = useAuth();

<<<<<<< HEAD
  const userId = useMemo<number | null>(() => {
    if (!userToken) return null;
=======
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reservedCourts, setReservedCourts] = useState<Court[]>([]);
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [updatingReview, setUpdatingReview] = useState(false);

  const isReviewFeatureEnabled =
    Number(user?.id) === 41 || Number(user?.id) === 31;

  const selectedCourtName = useMemo(() => {
    const found = reservedCourts.find(
      (court) => String(court.id) === String(selectedCourtId),
    );
    return found?.name || '';
  }, [reservedCourts, selectedCourtId]);

  const loadData = useCallback(async () => {
    if (!isReviewFeatureEnabled || !user?.id) return;

>>>>>>> d3c03d371cbe9660d1f057b9b15e9bc4ecb31fad
    try {
      const decoded = jwtDecode(userToken) as unknown as JWTPayload;
      return decoded.sub ?? null;
    } catch {
      return null;
    }
  }, [userToken]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const loadReviews = useCallback(async () => {
    if (userId === null) return;
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      const all: Review[] = Array.isArray(res.data) ? res.data : [];
      const mine = all
        .filter((r) => Number(r.user_id) === Number(userId))
        .sort(
          (a, b) =>
            new Date(b.comment_date).getTime() -
            new Date(a.comment_date).getTime(),
        );
      setReviews(mine);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [loadReviews]),
  );
=======
  }, [isReviewFeatureEnabled, user?.id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const { refreshing, onRefresh } = usePullToRefresh(loadData);

  const handleCreateReview = async () => {
    if (!selectedCourtId) {
      Alert.alert('Reseñas', 'Selecciona una pista para continuar.');
      return;
    }

    if (!reviewTitle.trim()) {
      Alert.alert('Reseñas', 'El titulo de la reseña es obligatorio.');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Reseñas', 'Escribe un comentario para la reseña.');
      return;
    }

    const body = {
      court_id: Number(selectedCourtId),
      title: reviewTitle.trim(),
      text: reviewText.trim(),
      rating: reviewRating,
    };

    try {
      setSubmitting(true);

      await api.post('/reviews', body);

      setReviewTitle('');
      setReviewText('');
      setReviewRating(5);
      await loadData();
      console.log('Review creada correctamente');
      Alert.alert('Reseñas', 'Tu reseña se ha guardado correctamente.');
    } catch (error) {
      let backendMessage = 'No se pudo guardar la reseña.';

      if (axios.isAxiosError(error)) {
        const rawMessage = error.response?.data?.message;
        if (Array.isArray(rawMessage) && rawMessage.length > 0) {
          backendMessage = rawMessage.join(' | ');
        } else if (
          typeof rawMessage === 'string' &&
          rawMessage.trim().length > 0
        ) {
          backendMessage = rawMessage;
        }

        console.error('Error creating review', {
          status: error.response?.status,
          payload: body,
          message: rawMessage,
        });
      } else {
        console.error('Error creating review', error);
      }

      Alert.alert('Reseñas', backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditingReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditingText(review.text || '');
  };

  const cancelEditingReview = () => {
    setEditingReviewId(null);
    setEditingText('');
  };

  const handleSaveReviewText = async (reviewId: number) => {
    const text = editingText.trim();

    if (!text) {
      Alert.alert('Reseñas', 'El contenido de la reseña no puede estar vacio.');
      return;
    }

    try {
      setUpdatingReview(true);
      await api.put(`/reviews/${reviewId}`, { text });

      setMyReviews((prev) =>
        prev.map((item) =>
          item.id === reviewId
            ? {
                ...item,
                text,
              }
            : item,
        ),
      );

      setEditingReviewId(null);
      setEditingText('');
      Alert.alert('Reseñas', 'Contenido actualizado correctamente.');
    } catch (error) {
      console.error('Error updating review text', error);
      Alert.alert('Reseñas', 'No se pudo actualizar la reseña.');
    } finally {
      setUpdatingReview(false);
    }
  };
>>>>>>> d3c03d371cbe9660d1f057b9b15e9bc4ecb31fad

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  const handleEditSave = async (id: number) => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await api.put(`/reviews/${id}`, { text: editText.trim() });
      setEditingId(null);
      setEditText('');
      await loadReviews();
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
<<<<<<< HEAD
        style={[
          styles.card,
          {
=======
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
          padding: 24,
        }}
      >
        <Text
          style={{ color: theme.textTitle, fontWeight: '700', fontSize: 18 }}
        >
          Reseñas
        </Text>
        <Text
          style={{
            color: theme.textBody,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Esta pantalla no está habilitada para tu usuario.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
        />
      }
      contentContainerStyle={{
        paddingTop: headerHeight + 12,
        paddingHorizontal: 16,
        paddingBottom: 120,
        gap: 14,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: theme.backgroundCard,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.primarySoft,
          padding: 14,
        }}
      >
        <Text
          style={{ color: theme.textTitle, fontSize: 16, fontWeight: '800' }}
        >
          Centro de reseñas
        </Text>
        <Text style={{ color: theme.textBody, marginTop: 6, lineHeight: 20 }}>
          Aqui podras crear reseñas para tus pistas y ver las respuestas del
          administrador.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: theme.backgroundCard,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.primarySoft,
          padding: 14,
        }}
      >
        <Text
          style={{ color: theme.textTitle, fontSize: 20, fontWeight: '800' }}
        >
          Crear reseña
        </Text>

        <Text
          style={{ color: theme.textBody, marginTop: 10, fontWeight: '600' }}
        >
          Pista reservada
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 8,
          }}
        >
          {reservedCourts.length === 0 ? (
            <Text style={{ color: theme.textBody }}>
              No tienes pistas pendientes de reseñar.
            </Text>
          ) : (
            reservedCourts.map((court) => {
              const selected = selectedCourtId === String(court.id);
              return (
                <TouchableOpacity
                  key={court.id}
                  onPress={() => setSelectedCourtId(String(court.id))}
                  style={{
                    borderWidth: 1,
                    borderColor: selected ? theme.primary : theme.primarySoft,
                    backgroundColor: selected
                      ? theme.primary + '20'
                      : 'transparent',
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? theme.primary : theme.textBody,
                      fontWeight: selected ? '700' : '500',
                    }}
                  >
                    {court.name}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <Text
          style={{ color: theme.textBody, marginTop: 12, fontWeight: '600' }}
        >
          Titulo
        </Text>
        <TextInput
          value={reviewTitle}
          onChangeText={setReviewTitle}
          placeholder="Escribe un titulo"
          placeholderTextColor={theme.textBody + '80'}
          style={{
            marginTop: 6,
            borderWidth: 1,
            borderColor: theme.primarySoft,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: theme.textTitle,
          }}
        />

        <Text
          style={{ color: theme.textBody, marginTop: 12, fontWeight: '600' }}
        >
          Comentario
        </Text>
        <TextInput
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Cuenta tu experiencia"
          placeholderTextColor={theme.textBody + '80'}
          multiline
          style={{
            marginTop: 6,
            minHeight: 90,
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: theme.primarySoft,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: theme.textTitle,
          }}
        />

        <Text
          style={{ color: theme.textBody, marginTop: 12, fontWeight: '600' }}
        >
          Valoracion
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 8,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
              <Ionicons
                name={reviewRating >= star ? 'star' : 'star-outline'}
                size={24}
                color={reviewRating >= star ? '#F4B400' : theme.textBody}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleCreateReview}
          disabled={submitting || reservedCourts.length === 0}
          style={{
            marginTop: 14,
            height: 46,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
            opacity: submitting || reservedCourts.length === 0 ? 0.6 : 1,
          }}
        >
          <Text style={{ color: theme.onPrimary, fontWeight: '700' }}>
            {submitting ? 'Guardando...' : 'Crear reseña'}
          </Text>
        </TouchableOpacity>

        {selectedCourtName ? (
          <Text
            style={{ color: theme.textSubtitle, marginTop: 8, fontSize: 12 }}
          >
            Pista seleccionada: {selectedCourtName}
          </Text>
        ) : null}
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{ color: theme.textTitle, fontSize: 17, fontWeight: '800' }}
        >
          Mis reseñas
        </Text>

        <TouchableOpacity
          onPress={handleRefresh}
          disabled={loading}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: theme.primarySoft,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Ionicons name="refresh" size={14} color={theme.primary} />
          <Text style={{ color: theme.primary, fontWeight: '600' }}>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={theme.primary} />
      ) : myReviews.length === 0 ? (
        <View
          style={{
>>>>>>> d3c03d371cbe9660d1f057b9b15e9bc4ecb31fad
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
                <Text
                  style={[styles.editBtnText, { color: theme.textMuted }]}
                >
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
                  <Text
                    style={[styles.editBtnText, { color: theme.onPrimary }]}
                  >
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
            <Text
              style={[styles.adminReplyText, { color: theme.textBody }]}
            >
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
            <Text
              style={[styles.editTriggerText, { color: theme.textMuted }]}
            >
              Editar reseña
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
            <Text style={[styles.pageTitle, { color: theme.textTitle }]}>
              Mis reseñas
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="star-outline"
                size={52}
                color={theme.textMuted}
              />
              <Text
                style={[styles.emptyTitle, { color: theme.textTitle }]}
              >
                Sin reseñas
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: theme.textMuted }]}
              >
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
    editSection: {
      gap: 10,
    },
    editInput: {
      borderWidth: 1.5,
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      minHeight: 90,
    },
    editActions: {
      flexDirection: 'row',
      gap: 10,
    },
    editBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editBtnCancel: {
      borderWidth: 1,
      backgroundColor: 'transparent',
    },
    editBtnSave: {},
    editBtnText: {
      fontSize: 14,
      fontWeight: '700',
    },
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
    editTriggerText: {
      fontSize: 12,
      fontWeight: '600',
    },
    emptyState: {
      paddingTop: 60,
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '800',
    },
    emptySubtitle: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
