import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { reservasService } from '../../../../services/reservasService';
import { MODELOS, Modelo } from '../../../../data/modelos';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../services/api';
import { Modal } from 'react-native'; // Añade Modal a los imports de react-native
import { WebView } from 'react-native-webview';
import { useAppTheme } from '../../../../context/ThemeContext';
import { AppTheme } from '../../../../theme';

export default function CreateBooking() {
  const params = useLocalSearchParams<{ modelId?: string }>();
  const modelId = params?.modelId;
  const router = useRouter();
  const { theme } = useAppTheme();
  const { userToken } = useAuth();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [precioHora, setPrecioHora] = useState('10');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(
    new Date(Date.now() + 60 * 60 * 1000),
  );
  const [showPicker, setShowPicker] = useState<
    'inicio-date' | 'inicio-time' | null
  >(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [showHoursExpanded, setShowHoursExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<Modelo | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<
    'success' | 'error' | 'info'
  >('info');
  const [pistaSeleccionada, setPistaSeleccionada] = useState<string | null>(
    null,
  );
  const [showMap, setShowMap] = useState(false);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await reservasService.getModelos();
        const found = remote.find((m) => String(m.id) === String(modelId));
        if (mounted && found) {
          setModel(found);
          setPrecioHora(String(found.price));
          setLoadingModel(false);
          return;
        }
      } catch (e) {
        // ignore
      }

      // fallback local
      const local = MODELOS.find((m) => m.id === String(modelId)) ?? MODELOS[0];
      if (mounted) {
        setModel(local);
        setPrecioHora(String(local.price));
        setLoadingModel(false);
      }
    })();
    return () => {
      mounted = false;
      setLoadingModel(false);
    };
  }, [modelId]);

  // Intentar obtener perfil del usuario para autocompletar email/nombre
  useEffect(() => {
    let mounted = true;
    const tryProfile = async () => {
      if (!userToken) return;
      const endpoints = ['/auth/me', '/me', '/users/me', '/profile'];
      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          if (res?.data && mounted) {
            const d = res.data;
            if (!email && (d.email || d.mail)) setEmail(d.email || d.mail);
            if (!nombre && (d.name || d.nombre || d.displayName))
              setNombre(d.name || d.nombre || d.displayName);
            return;
          }
        } catch (e) {
          // seguir intentando
        }
      }
    };
    tryProfile();
    return () => {
      mounted = false;
    };
  }, [userToken]);

  const onChangeDate = (event: any, selected?: Date) => {
    const current = showPicker;
    setShowPicker(null);
    if (!selected) return;

    // Build a new start date preserving intent depending on picker mode
    if (current === 'inicio-date') {
      // selected contains a Date with the chosen day; preserve time from fechaInicio
      const newStart = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        fechaInicio.getHours(),
        fechaInicio.getMinutes(),
        0,
        0,
      );

      // clamp so it doesn't cross to next day
      const endOfDay = new Date(newStart);
      endOfDay.setHours(23, 59, 59, 999);
      const msMinute = 1000 * 60;
      const maxMinutesAvailable = Math.max(
        60,
        Math.floor((endOfDay.getTime() - newStart.getTime()) / msMinute),
      );
      const candidateEnd = new Date(
        newStart.getTime() + durationMinutes * msMinute,
      );
      if (candidateEnd.getDate() !== newStart.getDate()) {
        const newMinutes = Math.min(durationMinutes, maxMinutesAvailable);
        if (newMinutes < durationMinutes)
          Alert.alert(
            'Aviso',
            'La duración se ha reducido para no cruzar el día',
          );
        setDurationMinutes(newMinutes);
        setFechaInicio(newStart);
        setFechaFin(new Date(newStart.getTime() + newMinutes * msMinute));
      } else {
        setFechaInicio(newStart);
        setFechaFin(candidateEnd);
      }
    }

    if (current === 'inicio-time') {
      // selected is a Date with the chosen time; apply to current start date
      const newStart = new Date(fechaInicio);
      newStart.setHours(selected.getHours(), selected.getMinutes(), 0, 0);

      const endOfDay = new Date(newStart);
      endOfDay.setHours(23, 59, 59, 999);
      const msMinute = 1000 * 60;
      const maxMinutesAvailable = Math.max(
        60,
        Math.floor((endOfDay.getTime() - newStart.getTime()) / msMinute),
      );
      const candidateEnd = new Date(
        newStart.getTime() + durationMinutes * msMinute,
      );
      if (candidateEnd.getDate() !== newStart.getDate()) {
        const newMinutes = Math.min(durationMinutes, maxMinutesAvailable);
        if (newMinutes < durationMinutes)
          Alert.alert(
            'Aviso',
            'La duración se ha reducido para no cruzar el día',
          );
        setDurationMinutes(newMinutes);
        setFechaInicio(newStart);
        setFechaFin(new Date(newStart.getTime() + newMinutes * msMinute));
      } else {
        setFechaInicio(newStart);
        setFechaFin(candidateEnd);
      }
    }
  };

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

  const handleSubmit = async () => {
    const isValidEmail = (em: string) => /^\S+@\S+\.\S+$/.test(em);
    if (!email) {
      setSnackbarType('error');
      setSnackbarMessage('Email requerido');
      setSnackbarVisible(true);
      return;
    }
    if (!isValidEmail(email)) {
      setSnackbarType('error');
      setSnackbarMessage('Email inválido');
      setSnackbarVisible(true);
      return;
    }
    if (fechaFin <= fechaInicio) {
      setSnackbarType('error');
      setSnackbarMessage('Fecha fin debe ser posterior');
      setSnackbarVisible(true);
      return;
    }
    setLoading(true);
    try {
      const id = await reservasService.createReserva({
        usuarioId: 'local-uid',
        email,
        nombre,
        modeloId: Number(modelId ?? 0),
        precioHora: Number(precioHora),
        fechaInicio: fechaInicio.toISOString(),
        fechaFin: fechaFin.toISOString(),
        notas: '',
      });
      setSnackbarType('success');
      setSnackbarMessage(`Reserva creada — ID: ${id}`);
      setSnackbarVisible(true);
      setTimeout(() => router.replace('/(app)/reservas'), 900);
    } catch (err: any) {
      console.error('createReserva error', err);
      setSnackbarType('error');
      setSnackbarMessage(
        err?.response?.data?.message ||
          err?.message ||
          'No se pudo crear la reserva',
      );
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  // calcular duración y total en minutos (soportando fracciones)
  const msHour = 1000 * 60 * 60;
  const msMinute = 1000 * 60;
  // sincronizar duración (minutos) cuando cambian fechas
  useEffect(() => {
    const startMs = fechaInicio.getTime();
    const endMs = fechaFin.getTime();
    const newMinutes = Math.max(60, Math.ceil((endMs - startMs) / msMinute));
    setDurationMinutes(newMinutes);
  }, [fechaInicio, fechaFin]);

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m ? ' ' + m + 'm' : ''}`;
  };

  const DURATION_CHIPS = [60, 90, 105, 120, 180, 240, 360, 480];

  if (!model)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );

  const total = (durationMinutes / 60) * Number(precioHora || model.price || 0);

  const MAX_MINUTES = 8 * 60;
  const MIN_MINUTES = 60;
  const adjustDuration = (deltaMinutes: number) => {
    const next = Math.min(
      MAX_MINUTES,
      Math.max(MIN_MINUTES, durationMinutes + deltaMinutes),
    );
    if (next === durationMinutes) {
      setSnackbarType('info');
      setSnackbarMessage(
        next <= MIN_MINUTES ? 'Duración mínima 1h' : 'Duración máxima 8h',
      );
      setSnackbarVisible(true);
      return;
    }
    setDurationMinutes(next);
    setFechaFin(new Date(fechaInicio.getTime() + next * msMinute));
  };

  // Función para recibir el mensaje del mapa 3D
  const handleMapMessage = (event: any) => {
    const data = event.nativeEvent.data;
    // Si en tu Spline configuraste que al clicar envíe un mensaje con el nombre
    if (data) {
      setPistaSeleccionada(data);
      setShowMap(false); // Cerramos el mapa al elegir
      setSnackbarMessage(`Pista ${data} seleccionada`);
      setSnackbarType('success');
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        <Stack.Screen options={{ title: 'Detalles de reserva' }} />

        {/* MODAL DEL MAPA 3D */}
        <Modal
          visible={showMap}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: theme.backgroundMain,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}
              >
                Mapa del Polideportivo
              </Text>
              <TouchableOpacity onPress={() => setShowMap(false)}>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color={theme.textTitle}
                />
              </TouchableOpacity>
            </View>
            <WebView
              source={{
                uri: 'https://my.spline.design/untitled-o8FhbQhvF8XmEF9SVboAdTmE/',
              }}
              style={{ flex: 1 }}
              onMessage={handleMapMessage}
            />
            <View
              style={{
                padding: 20,
                backgroundColor: theme.backgroundCard,
              }}
            >
              <Text
                style={{
                  color: theme.grayPlaceholder,
                  textAlign: 'center',
                }}
              >
                Toca una pista para seleccionarla
              </Text>
            </View>
          </SafeAreaView>
        </Modal>

        <View style={styles.headerCard}>
          <ImageBackground
            source={model.img}
            style={styles.headerImage}
            imageStyle={{ borderRadius: 12 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)']}
              style={styles.headerOverlay}
            >
              <Text style={styles.headerTitle}>{model.title}</Text>
              <Text style={styles.headerSubtitle}>{model.price} €/h</Text>
            </LinearGradient>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.onPrimary}
              />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Ubicación / Pista</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: pistaSeleccionada
                  ? theme.primary
                  : theme.borderInput,
              },
            ]}
            onPress={() => setShowMap(true)}
          >
            <Ionicons
              name="map-outline"
              size={20}
              color={
                pistaSeleccionada
                  ? theme.primary
                  : theme.textMuted
              }
            />
            <Text
              style={{
                marginLeft: 10,
                color: pistaSeleccionada
                  ? theme.textPrimary
                  : theme.textPlaceholder,
                fontWeight: pistaSeleccionada ? '700' : '400',
              }}
            >
              {pistaSeleccionada
                ? `Pista: ${pistaSeleccionada}`
                : 'Abrir mapa 3D para elegir pista'}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.textMuted}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Nombre (opcional)</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Precio/hora (€)</Text>
          <View style={[styles.input, { justifyContent: 'center' }]}>
            <Text
              style={{
                color: theme.textPrimary,
                fontWeight: '700',
              }}
            >
              {precioHora} €/h
            </Text>
          </View>

          <View style={{ marginBottom: 6 }}>
            <Text style={styles.label}>Día y hora de inicio</Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                accessibilityLabel="Seleccionar día"
                style={[styles.dateBtn, styles.dateBtnLarge]}
                onPress={() => setShowPicker('inicio-date')}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={theme.textMuted}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.dateBtnText}>
                  {formatDate(fechaInicio)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel="Seleccionar hora de inicio"
                style={[
                  styles.dateBtn,
                  styles.dateBtnLarge,
                  { marginLeft: 10 },
                ]}
                onPress={() => setShowPicker('inicio-time')}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={theme.textMuted}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.dateBtnText}>
                  {formatTime(fechaInicio)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {showPicker && (
            <DateTimePicker
              value={fechaInicio}
              mode={showPicker.endsWith('time') ? 'time' : 'date'}
              display={
                Platform.OS === 'ios'
                  ? showPicker.endsWith('time')
                    ? 'spinner'
                    : 'inline'
                  : 'default'
              }
              onChange={onChangeDate}
            />
          )}

          <View style={{ marginTop: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={styles.label}>Duración</Text>
              <TouchableOpacity
                onPress={() => setShowHoursExpanded((s) => !s)}
                style={{ padding: 6 }}
              >
                <Text
                  style={{
                    color: theme.primary,
                    fontWeight: '700',
                  }}
                >
                  {showHoursExpanded ? 'Ocultar' : 'Editar'}
                </Text>
              </TouchableOpacity>
            </View>

            {!showHoursExpanded ? (
              <View
                style={{
                  marginTop: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.summaryText}>
                  {formatDuration(durationMinutes)}
                </Text>
                <Text style={styles.summaryText}>
                  Fin:{' '}
                  <Text style={{ fontWeight: '800' }}>
                    {formatTime(fechaFin)}
                  </Text>
                </Text>
              </View>
            ) : (
              <View style={{ marginTop: 8 }}>
                <View style={{ marginTop: 8 }}>
                  <View style={styles.chipsRow}>
                    {DURATION_CHIPS.map((m) => (
                      <TouchableOpacity
                        key={m}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel={`Duración ${formatDuration(m)}`}
                        onPress={() => {
                          const next = Math.min(
                            MAX_MINUTES,
                            Math.max(MIN_MINUTES, m),
                          );
                          setDurationMinutes(next);
                          setFechaFin(
                            new Date(fechaInicio.getTime() + next * msMinute),
                          );
                        }}
                        style={[
                          styles.chip,
                          durationMinutes === m
                            ? styles.chipSelected
                            : undefined,
                        ]}
                      >
                        <Text
                          style={
                            durationMinutes === m
                              ? styles.chipTextSelected
                              : styles.chipText
                          }
                        >
                          {formatDuration(m)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => adjustDuration(-15)}
                      style={styles.stepperBtn}
                    >
                      <Text style={styles.stepperText}>-</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text
                        style={{
                          fontWeight: '800',
                          fontSize: 16,
                          color: theme.textPrimary,
                        }}
                      >
                        {formatDuration(durationMinutes)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => adjustDuration(15)}
                      style={styles.stepperBtn}
                    >
                      <Text style={styles.stepperText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryText}>
                      Duración:{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {formatDuration(durationMinutes)}
                      </Text>
                    </Text>
                    <Text style={styles.summaryText}>
                      Fin:{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {formatTime(fechaFin)}
                      </Text>
                    </Text>
                    <Text style={styles.summaryText}>
                      Total:{' '}
                      <Text style={{ fontWeight: '800' }}>
                        {total.toFixed(2)} €
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submit, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'Creando...' : 'Crear reserva'}
            </Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator
              size="large"
              color={theme.onPrimary}
            />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  headerCard: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  headerImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  headerOverlay: { padding: 16, justifyContent: 'flex-end' },
  headerTitle: {
    color: theme.onPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: theme.onPrimary,
    fontSize: 14,
    marginTop: 4,
  },
  sectionLabel: {
    marginTop: 6,
    fontWeight: '700',
    color: theme.textPrimary,
  },
  formCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderSoft,
    borderLeftWidth: 6,
    borderLeftColor: theme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
    color: theme.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.borderInput,
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: theme.inputBgSoft,
  },
  dateBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: theme.borderInput,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: theme.surface,
  },
  submit: {
    marginTop: 20,
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  submitText: { color: theme.onPrimary, fontWeight: '700' },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    padding: 8,
    borderRadius: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    alignItems: 'center',
  },
  summaryText: { color: theme.textPrimary, fontSize: 16 },
  stepperBtn: {
    width: 44,
    height: 36,
    borderRadius: 8,
    backgroundColor: theme.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.textPrimary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  dateBtnLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.borderInput,
    borderRadius: 10,
    backgroundColor: theme.surface,
  },
  dateBtnText: {
    color: theme.textPrimary,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.borderInput,
    marginRight: 10,
    marginTop: 10,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  chipText: {
    color: theme.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  chipTextSelected: {
    color: theme.onPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
  });
