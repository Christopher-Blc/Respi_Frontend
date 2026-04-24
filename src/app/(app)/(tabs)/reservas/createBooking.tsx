import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from '@react-navigation/elements';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '../../../../context/ThemeContext';
import { createCreateBookingStyles } from '../../../../style/createBooking.styles';
import {
  COURT_3D_URL,
  DURATION_CHIPS,
  formatDate,
  formatDuration,
  formatTime,
  useCreateBooking,
} from '../../../../hooks/useCreateBooking';

export default function CreateBooking() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const styles = useMemo(() => createCreateBookingStyles(theme), [theme]);
  const money = useMemo(
    () =>
      new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 2,
      }),
    [],
  );

  const {
    model,
    loadingModel,
    email,
    nombre,
    notes,
    precioHora,
    fechaInicio,
    fechaFin,
    durationMinutes,
    showPicker,
    showHoursExpanded,
    loading,
    snackbarVisible,
    snackbarMessage,
    showCourtModal,
    isLoadingCourts,
    courts,
    selectedCourt,
    sessionEmail,
    imageSource,
    total,
    setNombre,
    setNotes,
    setShowPicker,
    setShowHoursExpanded,
    setSnackbarVisible,
    setShowCourtModal,
    setSelectedCourt,
    onChangeDate,
    adjustDuration,
    handleSubmit,
  } = useCreateBooking();

  if (loadingModel || !model) {
    return (
      <View style={[styles.loadingRoot, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 16 }]}
      >
        <Stack.Screen options={{ title: 'Confirmar reserva' }} />

        <View style={styles.heroCard}>
          <ImageBackground
            source={imageSource}
            style={styles.heroImage}
            imageStyle={styles.heroImageRadius}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.78)']}
              style={styles.heroOverlay}
            >
              <View style={styles.heroTopRow}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                  <Ionicons name="chevron-back" size={22} color={theme.onPrimary} />
                </TouchableOpacity>
                <View style={styles.heroChip}>
                  <Text style={styles.heroChipText}>Selección lista</Text>
                </View>
              </View>

              <View>
                <Text style={styles.heroTitle}>{model.title}</Text>
                <Text style={styles.heroSubtitle}>{money.format(model.price)}/h</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        <View style={styles.formCard}>
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark" size={16} color={theme.primary} />
            <Text style={styles.badgeText}>Reserva guiada y segura</Text>
          </View>

          <Text style={styles.label}>Email de tu sesión</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={theme.textMuted} />
            <Text style={styles.infoValueText}>{email || sessionEmail || 'Sin email de sesión'}</Text>
          </View>

          <Text style={styles.label}>Nombre (opcional)</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre completo"
            placeholderTextColor={theme.textPlaceholder}
          />

          <Text style={styles.label}>Notas (opcional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Nivel, material, observaciones..."
            placeholderTextColor={theme.textPlaceholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Precio/hora</Text>
          <View style={styles.infoRow}>
            <Ionicons name="cash-outline" size={18} color={theme.textMuted} />
            <Text style={styles.infoValueText}>{money.format(Number(precioHora || model.price))}/h</Text>
          </View>

          <Text style={styles.label}>Pista a jugar</Text>
          <TouchableOpacity style={styles.selectorButton} onPress={() => setShowCourtModal(true)}>
            <View style={styles.selectorContent}>
              <Ionicons name="location-outline" size={18} color={theme.textMuted} />
              <Text style={styles.selectorCourtText}>{selectedCourt?.name || 'Seleccionar pista'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
          <Text style={styles.selectorHintText}>Vista 3D + selección de pista</Text>

          <Text style={styles.label}>Día y hora de inicio</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[styles.dateBtn, styles.dateBtnLarge]}
              onPress={() => setShowPicker('date')}
            >
              <Ionicons name="calendar-outline" size={18} color={theme.textMuted} />
              <Text style={styles.dateBtnText}>{formatDate(fechaInicio)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateBtn, styles.dateBtnLarge]}
              onPress={() => setShowPicker('time')}
            >
              <Ionicons name="time-outline" size={18} color={theme.textMuted} />
              <Text style={styles.dateBtnText}>{formatTime(fechaInicio)}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={fechaInicio}
              mode={showPicker}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}

          <View style={styles.durationHeader}>
            <Text style={styles.label}>Duración</Text>
            <TouchableOpacity onPress={() => setShowHoursExpanded((current) => !current)}>
              <Text style={styles.linkText}>{showHoursExpanded ? 'Ocultar' : 'Editar'}</Text>
            </TouchableOpacity>
          </View>

          {!showHoursExpanded ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>{formatDuration(durationMinutes)}</Text>
              <Text style={styles.summaryText}>
                Fin: <Text style={styles.summaryStrong}>{formatTime(fechaFin)}</Text>
              </Text>
            </View>
          ) : (
            <View>
              <View style={styles.chipsRow}>
                {DURATION_CHIPS.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={`Duración ${formatDuration(minutes)}`}
                    onPress={() => adjustDuration(minutes)}
                    style={[
                      styles.chip,
                      durationMinutes === minutes ? styles.chipSelected : undefined,
                    ]}
                  >
                    <Text
                      style={durationMinutes === minutes ? styles.chipTextSelected : styles.chipText}
                    >
                      {formatDuration(minutes)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => adjustDuration(durationMinutes - 15)}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperText}>-</Text>
                </TouchableOpacity>
                <View style={styles.stepperCenter}>
                  <Text style={styles.stepperValue}>{formatDuration(durationMinutes)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => adjustDuration(durationMinutes + 15)}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLabel}>Total estimado</Text>
              <Text style={styles.totalValue}>{money.format(total)}</Text>
            </View>
            <View style={styles.totalMeta}>
              <Text style={styles.totalMetaText}>{formatDuration(durationMinutes)}</Text>
              <Text style={styles.totalMetaText}>{formatDate(fechaInicio)} · {formatTime(fechaInicio)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submit, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>{loading ? 'Creando...' : 'Confirmar reserva'}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color={theme.onPrimary} />
          </View>
        )}

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
        >
          {snackbarMessage}
        </Snackbar>

        <Modal
          visible={showCourtModal}
          animationType="slide"
          onRequestClose={() => setShowCourtModal(false)}
        >
          <SafeAreaView style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar pista</Text>
              <TouchableOpacity onPress={() => setShowCourtModal(false)}>
                <Ionicons name="close-circle" size={30} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.webviewWrapper}>
              <WebView source={{ uri: COURT_3D_URL }} style={styles.webview} />
            </View>

            <Text style={styles.modalHint}>Explora en 3D y selecciona una pista abajo</Text>

            <View style={styles.courtListContainer}>
              <Text style={styles.courtListTitle}>Pistas disponibles</Text>
              {isLoadingCourts ? (
                <ActivityIndicator color={theme.primary} style={{ marginTop: 12 }} />
              ) : courts.length === 0 ? (
                <View style={styles.emptyCourtsState}>
                  <Text style={styles.emptyCourtsTitle}>No se encontraron pistas</Text>
                  <Text style={styles.emptyCourtsText}>Revisa conexión o endpoints de pistas</Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {courts.map((court) => {
                    const isSelected = selectedCourt?.id === court.id;
                    return (
                      <TouchableOpacity
                        key={court.id}
                        onPress={() => {
                          setSelectedCourt(court);
                          setShowCourtModal(false);
                        }}
                        style={[styles.courtRow, isSelected && styles.courtRowSelected]}
                      >
                        <View>
                          <Text style={[styles.courtRowText, isSelected && styles.courtRowTextSelected]}>
                            {court.name}
                          </Text>
                          {(court.openingHour || court.closingHour || court.status) && (
                            <Text style={styles.courtMetaText}>
                              {[
                                court.status,
                                court.openingHour && court.closingHour
                                  ? `${court.openingHour} - ${court.closingHour}`
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(' · ')}
                            </Text>
                          )}
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
