import React, { useMemo } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';
import { AppTheme } from '../../theme';
import { CourtAvailability } from '../../types/types';
import { crearBloquesDisponibilidad } from './AvailabilityBar';
import { courtInfoModalStyles as styles } from '../../style/bookings/courtInfoModal.styles';

type Props = {
  court: CourtAvailability | null;
  onClose: () => void;
};

const SectionTitle = ({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: AppTheme;
}) => (
  <Text style={[styles.sectionTitle, { color: theme.textTitle }]}>
    {children}
  </Text>
);

const InfoRow = ({
  icon,
  label,
  value,
  theme,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  theme: AppTheme;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelRow}>
      <Ionicons name={icon} size={17} color={theme.primary} />
      <Text style={[styles.infoLabel, { color: theme.textBody }]}>{label}</Text>
    </View>
    <Text style={[styles.infoValue, { color: theme.textTitle }]}>{value}</Text>
  </View>
);

export default function CourtInfoModal({ court, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const blocks = useMemo(() => {
    if (!court) return [];
    return crearBloquesDisponibilidad(
      court.opening_time,
      court.closing_time,
      court.current_reservations || [],
    );
  }, [court]);

  const freeBlocks = useMemo(
    () => blocks.filter((block) => block.tipo === 'libre'),
    [blocks],
  );

  const availabilitySummary = freeBlocks.length
    ? t('bookingCourtInfoFreeSlotsAvailable')
    : t('bookingCourtInfoNoFreeSlots');

  if (!court) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={styles.backdropTouch}
        />
        <TouchableWithoutFeedback>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.backgroundCard,
                borderColor: theme.primarySoft,
              },
            ]}
          >
            <View style={styles.header}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={[styles.title, { color: theme.textTitle }]}>
                  {court.name}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textBody }]}>
                  {court.installation?.name || court.courtType?.name || '-'}
                </Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close-circle"
                  size={26}
                  color={theme.textBody}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              {court.description ? (
                <View style={styles.sectionBlock}>
                  <SectionTitle theme={theme}>
                    {t('bookingCourtInfoDescriptionTitle')}
                  </SectionTitle>
                  <Text style={[styles.description, { color: theme.textBody }]}>
                    {court.description}
                  </Text>
                </View>
              ) : null}

              <View style={styles.sectionBlock}>
                <SectionTitle theme={theme}>
                  {t('bookingCourtInfoDetailsTitle')}
                </SectionTitle>
                <InfoRow
                  icon="people-outline"
                  label={t('bookingCourtInfoCapacity')}
                  value={String(court.capacity)}
                  theme={theme}
                />
                <InfoRow
                  icon="cash-outline"
                  label={t('bookingCourtInfoPricePerHour')}
                  value={`${court.price_per_hour} €/h`}
                  theme={theme}
                />
                <InfoRow
                  icon={
                    court.is_covered ? 'business-outline' : 'trail-sign-outline'
                  }
                  label={t('bookingCourtInfoCovered')}
                  value={court.is_covered ? t('commonYes') : t('commonNo')}
                  theme={theme}
                />
                <InfoRow
                  icon={
                    court.has_lighting
                      ? 'bulb-outline'
                      : ('bulb-off-outline' as any)
                  }
                  label={t('bookingCourtInfoLighting')}
                  value={court.has_lighting ? t('commonYes') : t('commonNo')}
                  theme={theme}
                />
              </View>

              <View style={styles.sectionBlock}>
                <SectionTitle theme={theme}>
                  {t('bookingCourtInfoScheduleTitle')}
                </SectionTitle>
                <InfoRow
                  icon="time-outline"
                  label={t('bookingCourtInfoStartTime')}
                  value={court.opening_time.slice(0, 5)}
                  theme={theme}
                />
                <InfoRow
                  icon="time-outline"
                  label={t('bookingCourtInfoEndTime')}
                  value={court.closing_time.slice(0, 5)}
                  theme={theme}
                />
              </View>

              <View style={styles.sectionBlock}>
                <SectionTitle theme={theme}>
                  {t('bookingCourtInfoAvailabilityTitle')}
                </SectionTitle>
                <View
                  style={[
                    styles.summaryBox,
                    {
                      backgroundColor: theme.primary + '10',
                      borderColor: theme.primarySoft,
                    },
                  ]}
                >
                  <Text style={[styles.summaryText, { color: theme.textBody }]}>
                    {availabilitySummary}
                  </Text>
                </View>
                {freeBlocks.length > 0 ? (
                  <View style={styles.chipsWrap}>
                    {freeBlocks.map((block, index) => (
                      <View
                        key={`${block.inicio}-${block.fin}-${index}`}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: theme.primary + '18',
                            borderColor: theme.primarySoft,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.chipText, { color: theme.textTitle }]}
                        >
                          {block.inicio} - {block.fin}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

