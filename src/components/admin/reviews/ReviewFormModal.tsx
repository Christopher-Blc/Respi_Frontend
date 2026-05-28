import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { AdminReview } from '../../../hooks/admin/useAdminReviews';
import { reviewsStyles as styles } from '../../../style/admin/reviews.styles';

type Props = {
  visible: boolean;
  review: AdminReview | null;
  adminAnswerText: string;
  setAdminAnswerText: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const InputLabel = ({ label, theme }: { label: string; theme: any }) => (
  <Text
    style={{
      color: theme.textBody,
      fontSize: 12,
      marginBottom: 4,
      fontWeight: '600',
    }}
  >
    {label}
  </Text>
);

export function ReviewFormModal({
  visible,
  review,
  adminAnswerText,
  setAdminAnswerText,
  onClose,
  onSave,
}: Props) {
  const { theme } = useAppTheme();

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundCard },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
              Contestar reseña
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                styles.reviewInfoCard,
                {
                  backgroundColor: theme.backgroundMain,
                  borderColor: theme.primarySoft,
                },
              ]}
            >
              <Text
                style={[styles.reviewInfoTitle, { color: theme.textTitle }]}
              >
                {review?.title || 'Sin titulo'}
              </Text>
              <Text style={[styles.reviewInfoMeta, { color: theme.textBody }]}>
                {review?.court?.name || `Pista #${review?.court_id || '-'}`} ·{' '}
                {review?.user?.username || `Usuario #${review?.user_id || '-'}`}{' '}
                · {review?.rating || 0}/5
              </Text>
              <Text style={[styles.reviewInfoBody, { color: theme.textBody }]}>
                {review?.text || 'Sin contenido'}
              </Text>
            </View>

            <InputLabel label="Respuesta del admin" theme={theme} />
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                { color: theme.textTitle, borderColor: theme.primarySoft },
              ]}
              multiline
              value={adminAnswerText}
              onChangeText={setAdminAnswerText}
              placeholder="Escribe una respuesta clara y profesional"
              placeholderTextColor={theme.textBody + '70'}
            />

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={onSave}
            >
              <Text style={styles.saveBtnText}>Guardar respuesta</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
