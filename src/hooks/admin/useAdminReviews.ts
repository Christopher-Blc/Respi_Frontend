import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import api from '../../services/api';
import { Court, Review, User } from '../../types/types';

export type AdminReview = Omit<Review, 'user' | 'court'> & {
  user?: User | null;
  court?: Court | null;
};

export type ReplyFilter = 'all' | 'answered' | 'pending';

type ViewMode = 'cards' | 'list';

const normalizeCourtName = (value: string) => value.trim().toLowerCase();

const extractRows = (payload: any) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;

  const backendMessage = error.response?.data?.message;
  if (Array.isArray(backendMessage)) return backendMessage.join(' | ');
  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage;
  }

  return fallback;
};

const normalizeReview = (item: any, index: number): AdminReview => ({
  id: Number(item?.id ?? item?.review_id ?? index),
  user_id: Number(item?.user_id ?? item?.user?.id ?? 0),
  court_id: Number(item?.court_id ?? item?.court?.id ?? 0),
  title: String(item?.title ?? ''),
  text: String(item?.text ?? item?.comment ?? ''),
  rating: Number(item?.rating ?? 0),
  comment_date: String(
    item?.comment_date ?? item?.created_at ?? item?.createdAt ?? '',
  ),
  is_visible: Boolean(item?.is_visible ?? true),
  admin_answer: item?.admin_answer ? String(item.admin_answer) : null,
  user: item?.user ?? null,
  court: item?.court ?? null,
});

const updateReviewRequest = async (
  reviewId: number,
  payload: Record<string, unknown>,
) => {
  try {
    await api.put(`/reviews/${reviewId}`, payload);
    console.log('Review updated successfully:', { reviewId, payload });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      console.log('Error updating review:', {
        status,
        message: error.response?.data?.message,
      });
    }
    throw error;
  }
};

export function useAdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterCourtName, setFilterCourtName] = useState<string>('all');
  const [replyFilter, setReplyFilter] = useState<ReplyFilter>('all');

  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [reviewToAnswer, setReviewToAnswer] = useState<AdminReview | null>(
    null,
  );
  const [adminAnswerText, setAdminAnswerText] = useState('');

  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [reviewsRes, courtsRes] = await Promise.all([
        api.get('/reviews'),
        api.get('/courts'),
      ]);

      setReviews(extractRows(reviewsRes.data).map(normalizeReview));
      setCourts(extractRows(courtsRes.data) as Court[]);
    } catch (error) {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: getErrorMessage(error, 'No se pudieron cargar las reseñas.'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchReviews();
  }, []);

  const courtNameById = useMemo(() => {
    const map = new Map<number, string>();

    for (const court of courts) {
      const name = String(court?.name ?? '').trim();
      if (!name) continue;
      if (!map.has(court.id)) {
        map.set(court.id, name);
      }
    }

    return map;
  }, [courts]);

  const courtFilterOptions = useMemo(() => {
    const uniqueNames = new Map<string, string>();

    for (const court of courts) {
      const name = String(court?.name ?? '').trim();
      if (!name) continue;

      const key = normalizeCourtName(name);
      if (!uniqueNames.has(key)) {
        uniqueNames.set(key, name);
      }
    }

    return Array.from(uniqueNames.values()).sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' }),
    );
  }, [courts]);

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = reviews
      .filter((review) => {
        if (filterRating !== 'all' && review.rating !== filterRating) {
          return false;
        }

        if (filterCourtName !== 'all') {
          const reviewCourtName = String(
            review.court?.name ?? courtNameById.get(review.court_id) ?? '',
          );

          if (
            normalizeCourtName(reviewCourtName) !==
            normalizeCourtName(filterCourtName)
          ) {
            return false;
          }
        }

        const hasAnswer = Boolean(String(review.admin_answer || '').trim());
        if (replyFilter === 'answered' && !hasAnswer) return false;
        if (replyFilter === 'pending' && hasAnswer) return false;

        if (!q) return true;

        const searchableText = [
          review.title,
          review.text,
          review.admin_answer || '',
          review.user?.username || '',
          review.user?.email || '',
          review.court?.name || '',
          String(review.rating),
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(q);
      })
      .sort((a, b) => {
        const dateA = new Date(a.comment_date || 0).getTime();
        const dateB = new Date(b.comment_date || 0).getTime();
        return dateB - dateA;
      });

    return result;
  }, [
    reviews,
    searchQuery,
    filterRating,
    filterCourtName,
    replyFilter,
    courtNameById,
  ]);

  const openAnswerModal = (review: AdminReview) => {
    setReviewToAnswer(review);
    setAdminAnswerText(String(review.admin_answer || ''));
    setAnswerModalVisible(true);
  };

  const closeAnswerModal = () => {
    setAnswerModalVisible(false);
    setReviewToAnswer(null);
    setAdminAnswerText('');
  };

  const handleSaveAnswer = async () => {
    if (!reviewToAnswer) return;

    const trimmedAnswer = adminAnswerText.trim();
    // if (!trimmedAnswer) {
    //   setErrorModal({
    //     visible: true,
    //     title: 'Campo invalido',
    //     message: 'La respuesta del admin no puede estar vacia.',
    //   });
    //   return;
    // }

    try {
      await updateReviewRequest(reviewToAnswer.id, {
        admin_answer: trimmedAnswer,
      });

      closeAnswerModal();
      await fetchReviews();
    } catch (error) {
      setErrorModal({
        visible: true,
        title: 'Error',
        message: getErrorMessage(error, 'No se pudo guardar la respuesta.'),
      });
    }
  };

  const clearFilters = () => {
    setFilterRating('all');
    setFilterCourtName('all');
    setReplyFilter('all');
  };

  return {
    courts,
    courtFilterOptions,
    filteredReviews,
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filterRating,
    setFilterRating,
    filterCourtName,
    setFilterCourtName,
    replyFilter,
    setReplyFilter,
    answerModalVisible,
    reviewToAnswer,
    adminAnswerText,
    setAdminAnswerText,
    openAnswerModal,
    closeAnswerModal,
    handleSaveAnswer,
    clearFilters,
    errorModal,
    setErrorModal,
  };
}
