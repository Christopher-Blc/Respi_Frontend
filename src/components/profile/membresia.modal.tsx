import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { Membresia } from '../../types/types';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type TierPalette = {
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  shine: string;
  accent: string;
};

const getMembershipPalette = (
  tipo: string,
  isDarkMode: boolean,
): TierPalette => {
  const normalized = tipo.trim().toLowerCase();

  if (normalized.includes('oro') || normalized.includes('gold')) {
    if (isDarkMode) {
      return {
        cardBg: 'rgba(255, 184, 28, 0.2)',
        cardBorder: '#D6A11A',
        badgeBg: 'rgba(255, 184, 28, 0.34)',
        badgeBorder: '#E6B325',
        badgeText: '#FFE7AD',
        shine: 'rgba(255, 234, 176, 0.2)',
        accent: '#F4B000',
      };
    }

    return {
      cardBg: 'rgba(255, 212, 95, 0.28)',
      cardBorder: 'rgba(202, 142, 14, 0.78)',
      badgeBg: 'rgba(255, 212, 95, 0.38)',
      badgeBorder: 'rgba(202, 142, 14, 0.84)',
      badgeText: '#8A5E00',
      shine: 'rgba(255, 238, 186, 0.28)',
      accent: '#CA8E0E',
    };
  }

  if (normalized.includes('plata') || normalized.includes('silver')) {
    if (isDarkMode) {
      return {
        cardBg: 'rgba(203, 213, 225, 0.17)',
        cardBorder: 'rgba(203, 213, 225, 0.48)',
        badgeBg: 'rgba(226, 232, 240, 0.24)',
        badgeBorder: 'rgba(203, 213, 225, 0.56)',
        badgeText: '#CBD5E1',
        shine: 'rgba(255, 255, 255, 0.1)',
        accent: '#A8B2BF',
      };
    }

    return {
      cardBg: 'rgba(156, 163, 175, 0.24)',
      cardBorder: 'rgba(156, 163, 175, 0.55)',
      badgeBg: 'rgba(209, 213, 219, 0.34)',
      badgeBorder: 'rgba(156, 163, 175, 0.62)',
      badgeText: '#4B5563',
      shine: 'rgba(255, 255, 255, 0.16)',
      accent: '#9CA3AF',
    };
  }

  if (isDarkMode) {
    return {
      cardBg: 'rgba(205, 127, 50, 0.22)',
      cardBorder: 'rgba(205, 127, 50, 0.6)',
      badgeBg: 'rgba(205, 127, 50, 0.32)',
      badgeBorder: 'rgba(205, 127, 50, 0.68)',
      badgeText: '#FBD8B2',
      shine: 'rgba(255, 210, 168, 0.14)',
      accent: '#B87333',
    };
  }

  return {
    cardBg: 'rgba(168, 101, 44, 0.24)',
    cardBorder: 'rgba(168, 101, 44, 0.62)',
    badgeBg: 'rgba(168, 101, 44, 0.34)',
    badgeBorder: 'rgba(168, 101, 44, 0.66)',
    badgeText: '#6F3E14',
    shine: 'rgba(234, 179, 122, 0.14)',
    accent: '#A8652C',
  };
};

export default function MembresiaModal({ visible, onClose }: Props) {
  const { theme, isDarkMode } = useAppTheme();
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMembresias = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const response = await api.get('/membresia');
      const payload = response.data;
      const parsed = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setMembresias(parsed);
    } catch (error) {
      console.error('Error al cargar membresias', error);
      setErrorMsg('No se pudieron cargar las membresias ahora mismo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      fetchMembresias();
    }
  }, [visible, fetchMembresias]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.backgroundCard,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 30,
          paddingHorizontal: 24,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.borderSoft,
        },
        headerAction: {
          fontSize: 20,
          fontWeight: '600',
          color: theme.textTitle,
        },
        body: {
          paddingHorizontal: 18,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'web' ? 36 : 24,
          gap: 14,
        },
        introCard: {
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.borderSoft,
          padding: 16,
        },
        introTitle: {
          fontSize: 21,
          fontWeight: '800',
          color: theme.textTitle,
          marginBottom: 8,
        },
        introText: {
          fontSize: 14,
          lineHeight: 21,
          color: theme.textBody,
        },
        membershipCard: {
          backgroundColor: theme.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.borderSoft,
          padding: 16,
          overflow: 'hidden',
        },
        membershipAccentBar: {
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 5,
        },
        membershipShine: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 45,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        },
        topRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        },
        tipo: {
          fontSize: 20,
          fontWeight: '800',
          color: theme.textTitle,
        },
        badge: {
          backgroundColor: theme.primarySoft,
          borderColor: theme.borderAccentSoft,
          borderWidth: 1,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 4,
        },
        badgeText: {
          color: theme.primary,
          fontSize: 12,
          fontWeight: '800',
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        },
        label: {
          color: theme.textMuted,
          fontSize: 13,
          fontWeight: '600',
        },
        value: {
          color: theme.textTitle,
          fontSize: 14,
          fontWeight: '700',
        },
        benefitsLabel: {
          marginTop: 4,
          color: theme.textMuted,
          fontSize: 13,
          fontWeight: '700',
          marginBottom: 4,
        },
        benefits: {
          color: theme.textBody,
          fontSize: 14,
          lineHeight: 20,
        },
        centerState: {
          backgroundColor: theme.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: theme.borderSoft,
          paddingVertical: 22,
          alignItems: 'center',
        },
        stateText: {
          color: theme.textBody,
          fontSize: 14,
          fontWeight: '600',
        },
        retry: {
          marginTop: 12,
          backgroundColor: theme.primary,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
        },
        retryText: {
          color: theme.onPrimary,
          fontWeight: '700',
        },
      }),
    [theme],
  );

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerAction}>Cerrar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Tu progreso de membresia</Text>
            <Text style={styles.introText}>
              Cuantas mas reservas hagas, mas nivel de membresia alcanzas y
              mejores descuentos recibes. Cada rango desbloquea beneficios para
              tus proximas reservas.
            </Text>
          </View>

          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : errorMsg ? (
            <View style={styles.centerState}>
              <Text style={styles.stateText}>{errorMsg}</Text>
              <TouchableOpacity style={styles.retry} onPress={fetchMembresias}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : membresias.length === 0 ? (
            <View style={styles.centerState}>
              <Text style={styles.stateText}>
                No hay membresias disponibles.
              </Text>
            </View>
          ) : (
            membresias.map((item) => {
              const palette = getMembershipPalette(item.tipo, isDarkMode);

              return (
                <View
                  key={item.membresia_id}
                  style={[
                    styles.membershipCard,
                    {
                      backgroundColor: palette.cardBg,
                      borderColor: palette.cardBorder,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.membershipAccentBar,
                      { backgroundColor: palette.accent },
                    ]}
                  />
                  <View
                    style={[
                      styles.membershipShine,
                      { backgroundColor: palette.shine },
                    ]}
                  />

                  <View style={styles.topRow}>
                    <Text style={styles.tipo}>{item.tipo}</Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: palette.badgeBg,
                          borderColor: palette.badgeBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.badgeText, { color: palette.badgeText }]}
                      >
                        Rango {item.rango}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Descuento</Text>
                    <Text style={styles.value}>{item.descuento}%</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Reservas requeridas</Text>
                    <Text style={styles.value}>{item.reservas_requeridas}</Text>
                  </View>

                  <Text style={styles.benefitsLabel}>Beneficios</Text>
                  <Text style={styles.benefits}>{item.beneficios}</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
