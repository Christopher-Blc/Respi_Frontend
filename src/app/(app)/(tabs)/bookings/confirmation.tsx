import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import api from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';
import createConfirmacionReservaStyles from '../../../../style/bookingConfirmation.styles';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../../i18n';

export default function ConfirmacionReserva() {
  const { t, i18n } = useTranslation();
  const { pistaId, fecha, hora, duracion } = useLocalSearchParams<{
    pistaId: string;
    fecha: string;
    hora: string;
    duracion?: string;
  }>();
  const pistaIdValue = Array.isArray(pistaId) ? pistaId[0] : pistaId;
  const fechaValue = Array.isArray(fecha) ? fecha[0] : fecha;
  const horaValue = Array.isArray(hora) ? hora[0] : hora;
  const duracionValue = Array.isArray(duracion) ? duracion[0] : duracion;

  const router = useRouter();
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const { userToken } = useAuth();
  const styles = useMemo(() => createConfirmacionReservaStyles(theme), [theme]);
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);

  const [pista, setPista] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [notes, setNotes] = useState('');
  const durationMinutes = Number(duracionValue || 60);

  useEffect(() => {
    if (!pistaIdValue) {
      setLoading(false);
      return;
    }

    const fetchPista = async () => {
      try {
        const response = await api.get(`/pista/${pistaIdValue}`);
        setPista(response.data);
      } catch (error) {
        console.error('Error loading court:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPista();
  }, [pistaIdValue]);

  const handleConfirm = async () => {
    if (!pistaIdValue || !fechaValue || !horaValue) {
      Alert.alert(
        t('bookingConfirmErrorTitle'),
        t('bookingConfirmMissingData'),
      );
      return;
    }

    try {
      setConfirming(true);

      // Crear la hora de fin segun la duracion elegida
      const [hourStr, minStr] = horaValue.split(':');
      const startMinutes = parseInt(hourStr) * 60 + parseInt(minStr);
      const endMinutes = startMinutes + durationMinutes;
      const endHour = String(Math.floor(endMinutes / 60)).padStart(2, '0');
      const endMin = String(endMinutes % 60).padStart(2, '0');
      const endTime = `${endHour}:${endMin}:00`;

      const payload = {
        pista_id: parseInt(pistaIdValue),
        fecha_reserva: fechaValue,
        hora_inicio: `${horaValue}:00`,
        hora_fin: endTime,
        nota: notes,
      };

      const response = await api.post('/reserva', payload);

      if (response.status === 201 || response.data?.reserva_id) {
        Alert.alert(
          t('bookingConfirmSuccessTitle'),
          t('bookingConfirmSuccessMessage'),
          [
            {
              text: 'OK',
              onPress: () => router.push('/(app)/(tabs)'),
            },
          ],
        );
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || t('bookingConfirmErrorMessage');
      Alert.alert(t('bookingConfirmErrorTitle'), message);
      console.error('Error:', error);
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const precioEstimado = pista
    ? (parseFloat(pista.precio_hora || 0) * (durationMinutes / 60)).toFixed(2)
    : '0.00';

  const [hourStr, minStr] = String(horaValue || '00:00').split(':');
  const startMinutes = parseInt(hourStr || '0') * 60 + parseInt(minStr || '0');
  const endMinutes = startMinutes + durationMinutes;
  const endHourLabel = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(
    endMinutes % 60,
  ).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight + 16,
          paddingBottom: Platform.OS === 'web' ? 96 : 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTag}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={theme.primary}
            />
            <Text style={styles.headerTagText}>
              {t('bookingConfirmHeaderTag')}
            </Text>
          </View>
          <Text style={styles.headerTitle}>
            {t('bookingConfirmHeaderTitle')}
          </Text>
        </View>

        {/* Pista Info */}
        {pista && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="football-outline"
                size={20}
                color={theme.primary}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('bookingConfirmCourt')}</Text>
                <Text style={styles.infoValue}>{pista.nombre}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.primary}
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('bookingConfirmDate')}</Text>
                <Text style={styles.infoValue}>
                  {new Date(`${fechaValue}T00:00:00`).toLocaleDateString(
                    locale,
                    {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={theme.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t('bookingConfirmTime')}</Text>
                <Text style={styles.infoValue}>
                  {horaValue} - {endHourLabel} ({durationMinutes} min)
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={20} color={theme.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t('bookingConfirmEstimatedPrice')}
                </Text>
                <Text style={styles.infoValue}>€{precioEstimado}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Características */}
        {pista && (
          <View style={styles.featuresCard}>
            <Text style={styles.sectionTitle}>
              {t('bookingConfirmFeatures')}
            </Text>
            <View style={styles.featuresList}>
              {pista.cubierta && (
                <View style={styles.featureItem}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color={theme.primary}
                  />
                  <Text style={styles.featureItemText}>
                    {t('bookingConfirmCoveredCourt')}
                  </Text>
                </View>
              )}
              {pista.iluminacion && (
                <View style={styles.featureItem}>
                  <Ionicons
                    name="flashlight-outline"
                    size={16}
                    color={theme.primary}
                  />
                  <Text style={styles.featureItemText}>
                    {t('bookingConfirmLighting')}
                  </Text>
                </View>
              )}
              <View style={styles.featureItem}>
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={theme.primary}
                />
                <Text style={styles.featureItemText}>
                  {t('bookingConfirmCapacity', { count: pista.capacidad })}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Notas */}
        <View style={styles.notesCard}>
          <Text style={styles.sectionTitle}>{t('bookingConfirmNotes')}</Text>
          <TextInput
            style={styles.notesInput}
            placeholder={t('bookingConfirmNotesPlaceholder')}
            placeholderTextColor={theme.textPlaceholder}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={confirming}
          >
            <Text style={styles.cancelButtonText}>
              {t('bookingConfirmCancel')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <ActivityIndicator size="small" color={theme.onPrimary} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-done-outline"
                  size={18}
                  color={theme.onPrimary}
                />
                <Text style={styles.confirmButtonText}>
                  {t('bookingConfirmButton')}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
