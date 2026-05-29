import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../context/ThemeContext';
import { Court } from '../../types/types';
import api from '../../services/api';
import createCreateReviewModalStyles from '../../style/reviews/createReviewModal.styles';

type Props = {
  court: Court;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateReviewModal({ court, onClose, onCreated }: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createCreateReviewModalStyles(theme), [theme]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setRating(0);
    setTitle('');
    setText('');
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Selecciona una valoración');
      return;
    }
    if (!title.trim()) {
      setError('Añade un título a tu reseña');
      return;
    }
    if (!text.trim()) {
      setError('Escribe tu reseña');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.post('/reviews', {
        court_id: court.id,
        title: title.trim(),
        text: text.trim(),
        rating,
      });
      setRating(0);
      setTitle('');
      setText('');
      onCreated();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(
        Array.isArray(msg) ? msg[0] : msg || 'No se pudo enviar la reseña',
      );
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels = ['', 'Muy mala', 'Mala', 'Regular', 'Buena', 'Excelente'];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.backdrop}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleClose}
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
              <View style={styles.header}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: theme.textTitle }]}>
                    Nueva reseña
                  </Text>
                  <Text
                    style={[styles.subtitle, { color: theme.textMuted }]}
                    numberOfLines={1}
                  >
                    {court.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={26}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Star rating */}
              <View style={styles.starsSection}>
                <Text style={[styles.label, { color: theme.textBody }]}>
                  Valoración
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={34}
                        color={star <= rating ? '#FFD700' : theme.textMuted}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {rating > 0 && (
                  <Text
                    style={[styles.ratingLabel, { color: theme.primary }]}
                  >
                    {ratingLabels[rating]}
                  </Text>
                )}
              </View>

              {/* Title */}
              <View style={styles.inputSection}>
                <Text style={[styles.label, { color: theme.textBody }]}>
                  Título
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSoft,
                      color: theme.textTitle,
                    },
                  ]}
                  placeholder="Resume tu experiencia..."
                  placeholderTextColor={theme.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>

              {/* Text */}
              <View style={styles.inputSection}>
                <Text style={[styles.label, { color: theme.textBody }]}>
                  Reseña
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textarea,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.borderSoft,
                      color: theme.textTitle,
                    },
                  ]}
                  placeholder="Cuéntanos tu experiencia en la pista..."
                  placeholderTextColor={theme.textMuted}
                  value={text}
                  onChangeText={setText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />
              </View>

              {!!error && (
                <Text style={[styles.error, { color: theme.danger }]}>
                  {error}
                </Text>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: loading ? 0.7 : 1,
                  },
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={theme.onPrimary} />
                ) : (
                  <>
                    <Ionicons
                      name="send-outline"
                      size={18}
                      color={theme.onPrimary}
                    />
                    <Text
                      style={[styles.submitText, { color: theme.onPrimary }]}
                    >
                      Enviar reseña
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
