import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useAvailableBookings } from '../../../../hooks/bookings/useAvailableBookings';
import { CourtAvailability } from '../../../../types/types';
import DateModal from '../../../../components/bookings/date.modal';
import { crearBloquesDisponibilidad } from '../../../../components/bookings/AvailabilityBar';
import { SessionExpiredModal } from '../../../../components/general/alert.modal';
import createReservasTabStyles from '../../../../style/bookings/bookingsTab.styles';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../../i18n';
import BookingDateStrip from '../../../../components/bookings/BookingDateStrip';
import BookingCourtCard from '../../../../components/bookings/BookingCourtCard';
import CourtInfoModal from '../../../../components/bookings/CourtInfoModal';
import { BookingStepBar } from '../../../../components/bookings/BookingStepBar';
import {
  getNext7Days,
  sameDay,
  normalizeDay,
  addHours,
  addMonths,
  formatDateForAPI,
} from '../../../../utils/bookingUtils';
import { usePullToRefresh } from '../../../../hooks/usePullToRefresh';

function BookingSkeleton({ theme }: { theme: any }) {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {[1, 2, 3].map(i => (
        <View
          key={i}
          style={{
            height: 120,
            borderRadius: 12,
            backgroundColor: theme.surfaceMuted,
            opacity: 0.6,
          }}
        />
      ))}
    </View>
  );
}

export default function ReservasTab() {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    modelId?: string | string[];
    modelTitle?: string | string[];
  }>();
  const reservasTabStyles = useMemo(
    () => createReservasTabStyles(theme),
    [theme],
  );
  const { width } = useWindowDimensions();
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);
  const cols = width >= 1280 ? 3 : width >= 520 ? 2 : 1;
  const [containerWidth, setContainerWidth] = useState(0);
  const padding = 8;
  const effective = containerWidth || width;
  const cardWidth = Math.max(
    160,
    Math.floor((effective - padding * 2 - 12 * (cols - 1)) / cols),
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);

  const [selectedCourtInfo, setSelectedCourtInfo] =
    useState<CourtAvailability | null>(null);
  const [showNoSlotsModal, setShowNoSlotsModal] = useState(false);
  const [noSlotsTitle, setNoSlotsTitle] = useState('');

  const normalizeParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;
  const selectedModelId = normalizeParam(params.modelId);
  const selectedModelTitle = normalizeParam(params.modelTitle);
  const normalizeText = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const formattedDate = formatDateForAPI(selectedDate);
  const { pistas, loading, refetch } = useAvailableBookings(formattedDate);
  const { refreshing, onRefresh } = usePullToRefresh(refetch);
  const availableDays = useMemo(() => getNext7Days(), []);
  const minimumDate = useMemo(
    () => normalizeDay(addHours(new Date(), 2)),
    [showDateModal],
  );
  const maximumDate = useMemo(
    () => normalizeDay(addMonths(new Date(), 3)),
    [showDateModal],
  );

  const selectedDateChips = useMemo(() => {
    const remaining = availableDays.filter(
      (day) => !sameDay(day, selectedDate),
    );
    return [selectedDate, ...remaining];
  }, [availableDays, selectedDate]);

  const filteredPistas = useMemo(() => {
    if (!selectedModelId && !selectedModelTitle) return pistas;

    const targetTitle = selectedModelTitle
      ? normalizeText(selectedModelTitle)
      : '';

    return pistas.filter((pista) => {
      const item = pista as any;
      const candidateTypeIds = [
        item?.court_type_id,
        item?.tipoPistaId,
        item?.courtType?.id,
      ]
        .filter((id) => id !== undefined && id !== null)
        .map((id) => String(id));

      const idMatch =
        !!selectedModelId && candidateTypeIds.includes(String(selectedModelId));

      if (idMatch) return true;
      if (!targetTitle) return false;

      const tipoNombre = String(
        item?.courtType?.name ||
          item?.tipo_pista?.nombre ||
          item?.tipo_pista?.title ||
          '',
      );
      const pistaNombre = String(item?.name || item?.nombre || '');

      return (
        normalizeText(tipoNombre).includes(targetTitle) ||
        normalizeText(pistaNombre).includes(targetTitle)
      );
    });
  }, [pistas, selectedModelId, selectedModelTitle]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(normalizeDay(date));
    setShowDateModal(false);
  };

  const openInfo = (pista: CourtAvailability) => {
    setSelectedCourtInfo(pista);
  };

  const openCreateBooking = (pista: CourtAvailability) => {
    const bloques = crearBloquesDisponibilidad(
      pista.opening_time,
      pista.closing_time,
      pista.current_reservations || [],
    );
    const hasFreeSlot = bloques.some(
      (bloque) =>
        bloque.tipo === 'libre' && bloque.finMin - bloque.inicioMin >= 30,
    );

    if (!hasFreeSlot) {
      setNoSlotsTitle(pista.name);
      setShowNoSlotsModal(true);
      return;
    }

    router.push({
      pathname: '/(app)/(tabs)/bookings/createBooking',
      params: {
        pistaId: String(pista.id),
        pistaNombre: pista.name,
        fecha: formattedDate,
        horaApertura: pista.opening_time,
        horaCierre: pista.closing_time,
        precioHora: String(pista.price_per_hour ?? ''),
        reservasActuales: JSON.stringify(pista.current_reservations || []),
      },
    });
  };

  const renderCourtCard = ({ item: pista }: { item: CourtAvailability }) => (
    <BookingCourtCard
      pista={pista}
      cardWidth={cardWidth}
      onPress={() => openCreateBooking(pista)}
      onInfo={() => openInfo(pista)}
    />
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.background }}
      onLayout={(e) => {
        const w = Math.floor(e.nativeEvent.layout.width);
        if (w > 0 && w !== containerWidth) setContainerWidth(w);
      }}
    >
      <DateModal
        visible={showDateModal}
        onSave={handleSelectDate}
        onClose={() => setShowDateModal(false)}
        initialDate={selectedDate}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
      />

      <CourtInfoModal
        court={selectedCourtInfo}
        onClose={() => setSelectedCourtInfo(null)}
      />

      <SessionExpiredModal
        visible={showNoSlotsModal}
        onConfirm={() => setShowNoSlotsModal(false)}
        title={noSlotsTitle || t('bookingTabNoSlotsTitle')}
        message={t('bookingTabNoSlotsMessage')}
        confirmText={t('commonUnderstood')}
      />

      <BookingDateStrip
        selectedDate={selectedDate}
        selectedDateChips={selectedDateChips}
        availableDays={availableDays}
        locale={locale}
        onSelectDate={setSelectedDate}
        onOpenCalendar={() => setShowDateModal(true)}
      />

      <BookingStepBar currentStep={1} />

      {loading ? (
        <BookingSkeleton theme={theme} />
      ) : filteredPistas.length === 0 ? (
        <View style={reservasTabStyles.emptyContainer}>
          <Ionicons
            name="calendar-clear-outline"
            size={48}
            color={theme.textMuted}
          />
          <Text style={reservasTabStyles.emptyTitle}>
            {t('bookingTabEmptyTitle')}
          </Text>
          <Text style={reservasTabStyles.emptySubtitle}>
            {t('bookingTabEmptySubtitle')}
          </Text>
        </View>
      ) : (
        <FlatList
          key={`bookings-${cols}`}
          data={filteredPistas}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          numColumns={cols}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={
            cols > 1
              ? { gap: 12, justifyContent: 'flex-start', alignItems: 'stretch' }
              : undefined
          }
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
            paddingHorizontal: padding,
            gap: 12,
          }}
          ListHeaderComponent={
            !!selectedModelTitle ? (
              <View
                style={{
                  borderRadius: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  backgroundColor: theme.primarySoft,
                  borderWidth: 1,
                  borderColor: theme.borderAccentSoft,
                }}
              >
                <Text
                  style={{
                    color: theme.textTitle,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {t('bookingTabShowingCourts', {
                    sport: String(selectedModelTitle),
                  })}
                </Text>
              </View>
            ) : null
          }
          renderItem={renderCourtCard}
          initialNumToRender={4}
        />
      )}
    </View>
  );
}
