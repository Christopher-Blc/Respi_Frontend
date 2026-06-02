import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import createModalCommonStyles from '../../style/general/modalCommon.styles';
import createMembresiaModalStyles from '../../style/profile/membershipModal.styles';
import api from '../../services/api';
import { Membership } from '../../types/types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const commonStyles = useMemo(() => createModalCommonStyles(theme), [theme]);
  const [membresias, setMembresias] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMembresias = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const response = await api.get('/memberships');
      const payload = response.data;
      const parsed = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setMembresias(parsed);
    } catch (error) {
      console.error('Error al cargar membresias', error);
      setErrorMsg(t('membershipLoadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (visible) {
      fetchMembresias();
    }
  }, [visible, fetchMembresias]);

  const styles = useMemo(() => createMembresiaModalStyles(theme), [theme]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        <View style={[commonStyles.headerContainer, { paddingTop: 20 }]}>
          <View style={commonStyles.headerRow}>
            <TouchableOpacity onPress={onClose}>
              <Text style={commonStyles.headerText}>{t('commonCancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={commonStyles.headerText}>{t('commonClose')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={[styles.body, { paddingTop: 70 }]}>
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>
              {t('membershipProgressTitle')}
            </Text>
            <Text style={styles.introText}>{t('membershipProgressText')}</Text>
          </View>

          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : errorMsg ? (
            <View style={styles.centerState}>
              <Text style={styles.stateText}>{errorMsg}</Text>
              <TouchableOpacity style={styles.retry} onPress={fetchMembresias}>
                <Text style={styles.retryText}>{t('membershipRetry')}</Text>
              </TouchableOpacity>
            </View>
          ) : membresias.length === 0 ? (
            <View style={styles.centerState}>
              <Text style={styles.stateText}>{t('membershipEmpty')}</Text>
            </View>
          ) : (
            membresias.map((item) => {
              const palette = getMembershipPalette(item.name, isDarkMode);

              return (
                <View
                  key={item.id}
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
                    <Text style={styles.tipo}>{item.name}</Text>
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
                        {t('membershipRange', { value: item.level })}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>{t('membershipDiscount')}</Text>
                    <Text style={styles.value}>{item.discount}%</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>
                      {t('membershipRequiredBookings')}
                    </Text>
                    <Text style={styles.value}>
                      {item.required_reservations}
                    </Text>
                  </View>

                  <Text style={styles.benefitsLabel}>
                    {t('membershipBenefits')}
                  </Text>
                  <Text style={styles.benefits}>{item.benefits}</Text>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
