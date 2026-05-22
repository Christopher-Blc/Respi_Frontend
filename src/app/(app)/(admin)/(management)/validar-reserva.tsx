import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { useHeaderHeight } from '@react-navigation/elements';
import { useAppTheme } from '../../../../context/ThemeContext';
import { Reservation } from '../../../../types/types';
import ReservationQrScanner from '../../../../components/admin/bookings/ReservationQrScanner';

const VALIDATION_BASE_URL = 'https://tuapi.com';

type ValidationResult =
  | {
      kind: 'success';
      reservation: Reservation;
      message?: string;
    }
  | {
      kind: 'error';
      message: string;
    }
  | null;

const normalizeCode = (value: string) => value.trim().toUpperCase();

const getValidationErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error))
    return 'Error inesperado al validar la reserva.';

  const backendMessage = error.response?.data?.message;
  if (Array.isArray(backendMessage)) return backendMessage.join(' | ');
  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage;
  }

  if (error.response?.status === 404) return 'Reserva no encontrada.';
  if (error.response?.status === 403)
    return 'Reserva no valida para este acceso.';
  return 'No se pudo validar la reserva.';
};

const extractReservation = (payload: any): Reservation | null => {
  if (!payload) return null;
  if (payload?.reservation && typeof payload.reservation === 'object') {
    return payload.reservation as Reservation;
  }
  if (payload?.data && typeof payload.data === 'object') {
    return payload.data as Reservation;
  }
  if (payload?.id && payload?.reservation_date) {
    return payload as Reservation;
  }
  return null;
};

export default function AdminReservationValidationScreen() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanEnabled, setScanEnabled] = useState(true);
  const [result, setResult] = useState<ValidationResult>(null);

  const cardStyle = useMemo(() => {
    if (!result) return null;

    if (result.kind === 'success') {
      return {
        borderColor: '#1fa15c',
        backgroundColor: 'rgba(34, 197, 94, 0.14)',
      };
    }

    return {
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    };
  }, [result]);

  const validateCode = async (rawCode: string) => {
    const code = normalizeCode(rawCode);
    if (!code) {
      Alert.alert(
        'Codigo requerido',
        'Introduce o escanea un codigo de verificacion.',
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `${VALIDATION_BASE_URL}/reservations/validar/${encodeURIComponent(code)}`,
      );
      const reservation = extractReservation(response.data);

      if (!reservation) {
        setResult({
          kind: 'error',
          message:
            'Respuesta invalida del servidor. No se encontro la reserva.',
        });
        return;
      }

      setResult({
        kind: 'success',
        reservation,
        message: response.data?.message,
      });
      setManualCode(code);
    } catch (error) {
      setResult({
        kind: 'error',
        message: getValidationErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const onCodeScanned = (data: string) => {
    if (!scanEnabled || loading) return;
    setScanEnabled(false);
    setManualCode(data || '');
    validateCode(data || '');
  };

  const reservation = result?.kind === 'success' ? result.reservation : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundMain }}
      contentContainerStyle={{
        paddingTop: headerHeight + 14,
        paddingHorizontal: 16,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.block,
          {
            backgroundColor: theme.backgroundCard,
            borderColor: theme.primarySoft,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.textTitle }]}>
          Validacion de reservas
        </Text>
        <Text style={[styles.subtitle, { color: theme.textBody }]}>
          Escanea el QR del usuario o introduce el codigo manualmente.
        </Text>

        <ReservationQrScanner
          loading={loading}
          scanEnabled={scanEnabled}
          onCodeScanned={onCodeScanned}
          onEnableScan={() => setScanEnabled(true)}
          primaryButtonColor={theme.primaryButton}
          onPrimaryColor={theme.onPrimary}
          primaryColor={theme.primary}
          borderColor={theme.borderInput}
          backgroundColor={theme.inputBackground}
          textColor={theme.textBody}
        />

        <View style={styles.manualRow}>
          <TextInput
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
            placeholder="RES-X7R2K9"
            placeholderTextColor={theme.textPlaceholder}
            style={[
              styles.manualInput,
              {
                color: theme.textTitle,
                borderColor: theme.borderInput,
                backgroundColor: theme.inputBackground,
              },
            ]}
          />
          <TouchableOpacity
            style={[styles.searchBtn, { backgroundColor: theme.primaryButton }]}
            onPress={() => validateCode(manualCode)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.onPrimary} />
            ) : (
              <Text style={[styles.searchBtnText, { color: theme.onPrimary }]}>
                Buscar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {result && cardStyle && (
        <View style={[styles.resultCard, cardStyle]}>
          <Text
            style={[
              styles.resultTitle,
              { color: result.kind === 'success' ? '#166534' : '#991b1b' },
            ]}
          >
            {result.kind === 'success' ? 'RESERVA VALIDA' : 'RESERVA NO VALIDA'}
          </Text>

          {result.kind === 'success' && reservation ? (
            <View style={styles.resultData}>
              <ResultRow
                label="Cliente"
                value={reservation.user?.name || '-'}
              />
              <ResultRow label="Email" value={reservation.user?.email || '-'} />
              <ResultRow
                label="Telefono"
                value={reservation.user?.phone || '-'}
              />
              <ResultRow label="Pista" value={reservation.court?.name || '-'} />
              <ResultRow
                label="Fecha"
                value={reservation.reservation_date || '-'}
              />
              <ResultRow
                label="Hora"
                value={`${String(reservation.start_time || '').slice(0, 5)} - ${String(reservation.end_time || '').slice(0, 5)}`}
              />
              <ResultRow label="Estado" value={reservation.status || '-'} />
              <ResultRow
                label="Codigo"
                value={String(
                  reservation.verification_code || '',
                ).toUpperCase()}
              />
            </View>
          ) : (
            <Text style={[styles.errorMessage, { color: '#7f1d1d' }]}>
              {result.message}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  searchBtn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultCard: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 10,
  },
  resultData: {
    gap: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  resultValue: {
    flex: 1,
    fontSize: 13,
    textAlign: 'right',
    color: '#111827',
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '600',
  },
});
