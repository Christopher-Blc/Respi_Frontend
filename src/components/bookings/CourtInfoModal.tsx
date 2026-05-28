import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';
import { AppTheme } from '../../theme';
import { Court, CourtAvailability } from '../../types/types';
import api from '../../services/api';
import { crearBloquesDisponibilidad } from './AvailabilityBar';
import { courtInfoModalStyles as styles } from '../../style/bookings/courtInfoModal.styles';

const DAY_ORDER: Court['day_of_week'][] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
];

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

  const [weeklySchedule, setWeeklySchedule] = useState<Court[]>([]);

  useEffect(() => {
    if (!court) {
      setWeeklySchedule([]);
      return;
    }
    let cancelled = false;
    api
      .get('/courts')
      .then((res) => {
        if (cancelled) return;
        const all: Court[] = Array.isArray(res.data) ? res.data : [];
        const matched = all.filter((c) => c.name === court.name);
        const sorted = matched.sort(
          (a, b) =>
            DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week),
        );
        setWeeklySchedule(sorted);
      })
      .catch(() => {
        if (!cancelled) setWeeklySchedule([]);
      });
    return () => {
      cancelled = true;
    };
  }, [court?.name]);

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
              <Ionicons name="close-circle" size={26} color={theme.textBody} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            directionalLockEnabled
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
              <ScrollView
                horizontal
                nestedScrollEnabled
                directionalLockEnabled
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayCardsRow}
              >
                {weeklySchedule.map((dayRecord) => (
                  <View
                    key={dayRecord.id}
                    style={[
                      styles.dayCard,
                      dayRecord.day_of_week === court?.day_of_week && {
                        borderColor: theme.primary,
                        backgroundColor: theme.primary + '18',
                      },
                      dayRecord.day_of_week !== court?.day_of_week && {
                        borderColor: theme.primarySoft,
                        backgroundColor: theme.backgroundCard,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.dayCardName, { color: theme.primary }]}
                    >
                      {t(`dayShort${dayRecord.day_of_week}`)}
                    </Text>
                    <Text
                      style={[styles.dayCardTime, { color: theme.textTitle }]}
                    >
                      {dayRecord.opening_time.slice(0, 5)}
                    </Text>
                    <Text
                      style={[styles.dayCardSep, { color: theme.textBody }]}
                    >
                      –
                    </Text>
                    <Text
                      style={[styles.dayCardTime, { color: theme.textTitle }]}
                    >
                      {dayRecord.closing_time.slice(0, 5)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
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
      </View>
    </Modal>
  );
}

<<<<<<< HEAD
=======
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '90%',
    maxWidth: 520,
    maxHeight: '84%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dayCardsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  dayCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 58,
    gap: 2,
  },
  dayCardName: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dayCardTime: {
    fontSize: 12,
    fontWeight: '700',
  },
  dayCardSep: {
    fontSize: 10,
  },
});
>>>>>>> 45064c4666ee7aca8c60e8eb4c2e15eb645486a0
