import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAppTheme } from '../../../context/ThemeContext';
import { useProfile } from '../../../hooks/useProfile';
import { Court, Reservation, Review } from '../../../types/types';
import api from '../../../services/api';

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

export default function ReviewsScreen() {
  const { theme } = useAppTheme();
  const { user, loading: profileLoading } = useProfile();
  const headerHeight = useHeaderHeight();

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

  const isReviewFeatureEnabled = Number(user?.id) === 41;

  const selectedCourtName = useMemo(() => {
    const found = reservedCourts.find(
      (court) => String(court.id) === String(selectedCourtId),
    );
    return found?.name || '';
  }, [reservedCourts, selectedCourtId]);

  const loadData = async () => {
    if (!isReviewFeatureEnabled || !user?.id) return;

    try {
      setLoading(true);
      const [reservationsRes, reviewsRes] = await Promise.all([
        api.get('/reservations/my-reservations').catch(() => ({ data: [] })),
        api.get('/reviews').catch(() => ({ data: [] })),
      ]);

      const reservations = extractRows(reservationsRes?.data) as Reservation[];
      const reviews = extractRows(reviewsRes?.data)
        .map((item, index) => normalizeReview(item, index))
        .filter((item) => item.user_id === Number(user.id));

      const uniqueCourts = new Map<number, Court>();
      reservations.forEach((reservation) => {
        const courtId = Number(reservation.court_id);
        if (!Number.isFinite(courtId) || courtId <= 0) return;

        if (!uniqueCourts.has(courtId)) {
          uniqueCourts.set(courtId, {
            ...(reservation.court || ({} as Court)),
            id: courtId,
            name: reservation.court?.name || `Pista #${courtId}`,
          });
        }
      });

      const courts = Array.from(uniqueCourts.values());
      setReservedCourts(courts);
      setMyReviews(reviews);
      setSelectedCourtId(
        (prev) => prev || (courts[0]?.id ? String(courts[0].id) : ''),
      );
    } catch (error) {
      console.error('Error loading reviews data', error);
      Alert.alert('Reseñas', 'No se pudieron cargar tus reseñas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [isReviewFeatureEnabled, user?.id]);

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
      console.error('Error creating review', body);
      Alert.alert('Reseñas', 'No se pudo guardar la reseña.');
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

  const handleRefresh = async () => {
    await loadData();
  };

  if (profileLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!isReviewFeatureEnabled) {
    return (
      <View
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
              No tienes pistas reservadas.
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
            backgroundColor: theme.backgroundCard,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.primarySoft,
            padding: 12,
          }}
        >
          <Text style={{ color: theme.textBody }}>
            Aun no has creado reseñas.
          </Text>
        </View>
      ) : (
        myReviews.map((review) => (
          <View
            key={review.id}
            style={{
              backgroundColor: theme.backgroundCard,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.primarySoft,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.primarySoft,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: theme.textTitle,
                    fontWeight: '700',
                  }}
                >
                  Reseña
                </Text>

                {editingReviewId !== review.id ? (
                  <TouchableOpacity
                    onPress={() => startEditingReview(review)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.primarySoft,
                    }}
                  >
                    <Ionicons name="pencil" size={14} color={theme.primary} />
                    <Text style={{ color: theme.primary, fontWeight: '600' }}>
                      Editar
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.primarySoft,
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: theme.surface,
                }}
              >
                <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
                  {review.title || 'Sin titulo'} ·{' '}
                  {review.court?.name || `Pista #${review.court_id}`}
                </Text>

                {editingReviewId === review.id ? (
                  <>
                    <TextInput
                      value={editingText}
                      onChangeText={setEditingText}
                      multiline
                      placeholder="Edita el contenido de tu reseña"
                      placeholderTextColor={theme.textBody + '80'}
                      style={{
                        marginTop: 8,
                        minHeight: 90,
                        textAlignVertical: 'top',
                        borderWidth: 1,
                        borderColor: theme.primarySoft,
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        color: theme.textTitle,
                        backgroundColor: theme.backgroundCard,
                      }}
                    />

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        gap: 8,
                      }}
                    >
                      <TouchableOpacity
                        onPress={cancelEditingReview}
                        disabled={updatingReview}
                        style={{
                          flex: 1,
                          height: 40,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: theme.primarySoft,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{ color: theme.textBody, fontWeight: '600' }}
                        >
                          Cancelar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleSaveReviewText(review.id)}
                        disabled={updatingReview}
                        style={{
                          flex: 1,
                          height: 40,
                          borderRadius: 8,
                          backgroundColor: theme.primary,
                          opacity: updatingReview ? 0.6 : 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{ color: theme.onPrimary, fontWeight: '700' }}
                        >
                          {updatingReview ? 'Guardando...' : 'Guardar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <Text style={{ color: theme.textBody, marginTop: 6 }}>
                    {review.text}
                  </Text>
                )}

                <Text
                  style={{
                    color: theme.textSubtitle,
                    marginTop: 6,
                    fontWeight: '600',
                  }}
                >
                  Valoracion: {review.rating}/5
                </Text>
              </View>
            </View>

            <View style={{ padding: 12 }}>
              <Text
                style={{
                  color: theme.textTitle,
                  fontWeight: '700',
                  marginBottom: 8,
                }}
              >
                Respuesta
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.primarySoft,
                  borderRadius: 10,
                  padding: 10,
                  backgroundColor: theme.surface,
                }}
              >
                <Text style={{ color: theme.textBody }}>
                  {review.admin_answer?.trim() ||
                    'Pendiente de respuesta del administrador.'}
                </Text>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}
