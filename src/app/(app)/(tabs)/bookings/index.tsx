import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useHeaderHeight } from '@react-navigation/elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import createReservationsStyles from '../../../../style/reservations.styles';
import { useAppTheme } from '../../../../context/ThemeContext';
import {
  PistaDisponibilidad,
  useAvailableBookings,
} from '../../../../hooks/useAvailableBookings';
import { API_PUBLIC_URL } from '../../../../constants';
import DateModal from '../../../../components/bookings/date.modal';
import AvailabilityBar, {
  BloqueDisponibilidad,
  crearBloquesDisponibilidad,
} from '../../../../components/bookings/AvailabilityBar';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import createReservasTabStyles from '../../../../style/bookingsTab.styles';
import { useTranslation } from 'react-i18next';

const getNext7Days = () => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const formatDateForAPI = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
};

const formatDateDisplay = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

const formatCompactHour = (hhmm: string) => {
  const [hRaw = '0', mRaw = '0'] = String(hhmm || '').split(':');
  const h = String(Number(hRaw));
  const m = Number(mRaw);
  return m === 0 ? h : `${h}:${String(m).padStart(2, '0')}`;
};

const buildFreeRanges = (bloques: BloqueDisponibilidad[]) =>
  bloques
    .filter(
      (bloque) => bloque.tipo === 'libre' && bloque.finMin > bloque.inicioMin,
    )
    .map(
      (bloque) =>
        `${formatCompactHour(bloque.inicio)} - ${formatCompactHour(bloque.fin)}`,
    );

const getImageForPista = (pista: PistaDisponibilidad) => {
  if (pista.tipo_pista?.imagen) {
    const path = pista.tipo_pista.imagen;
    return {
      uri: path.startsWith('http')
        ? path
        : API_PUBLIC_URL + '/' + String(path).replace(/^\//, ''),
    };
  }

  return require('../../../../../assets/RespiLogo.png');
};

export default function ReservasTab() {
  const { t, i18n } = useTranslation();
  const { theme, isDarkMode } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    modelId?: string | string[];
    modelTitle?: string | string[];
  }>();
  const styles = useMemo(() => createReservationsStyles(theme), [theme]);
  const reservasTabStyles = useMemo(
    () => createReservasTabStyles(theme),
    [theme],
  );
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const locale = i18n.language === 'en' ? 'en-US' : 'es-ES';

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoRanges, setInfoRanges] = useState<string[]>([]);
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
  const { pistas, loading } = useAvailableBookings(formattedDate);
  const availableDays = useMemo(() => getNext7Days(), []);

  const filteredPistas = useMemo(() => {
    if (!selectedModelId && !selectedModelTitle) return pistas;

    const targetTitle = selectedModelTitle
      ? normalizeText(selectedModelTitle)
      : '';

    return pistas.filter((pista) => {
      const item = pista as any;
      const candidateTypeIds = [
        item?.tipo_pista_id,
        item?.tipoPistaId,
        item?.tipo_pista?.tipo_pista_id,
        item?.tipo_pista?.id,
      ]
        .filter((id) => id !== undefined && id !== null)
        .map((id) => String(id));

      const idMatch =
        !!selectedModelId && candidateTypeIds.includes(String(selectedModelId));

      if (idMatch) return true;
      if (!targetTitle) return false;

      const tipoNombre = String(
        item?.tipo_pista?.nombre || item?.tipo_pista?.title || '',
      );
      const pistaNombre = String(item?.nombre || '');

      return (
        normalizeText(tipoNombre).includes(targetTitle) ||
        normalizeText(pistaNombre).includes(targetTitle)
      );
    });
  }, [pistas, selectedModelId, selectedModelTitle]);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowDateModal(false);
  };

  const openInfo = (pista: PistaDisponibilidad) => {
    const bloques = crearBloquesDisponibilidad(
      pista.hora_apertura,
      pista.hora_cierre,
      pista.reservas_actuales || [],
    );
    setInfoTitle(pista.nombre);
    setInfoRanges(buildFreeRanges(bloques));
    setShowInfoModal(true);
  };

  const openCreateBooking = (pista: PistaDisponibilidad) => {
    const bloques = crearBloquesDisponibilidad(
      pista.hora_apertura,
      pista.hora_cierre,
      pista.reservas_actuales || [],
    );
    const hasFreeSlot = bloques.some(
      (bloque) =>
        bloque.tipo === 'libre' && bloque.finMin - bloque.inicioMin >= 30,
    );

    if (!hasFreeSlot) {
      setNoSlotsTitle(pista.nombre);
      setShowNoSlotsModal(true);
      return;
    }

    router.push({
      pathname: '/(app)/(tabs)/bookings/createBooking',
      params: {
        pistaId: String(pista.pista_id),
        pistaNombre: pista.nombre,
        fecha: formattedDate,
        horaApertura: pista.hora_apertura,
        horaCierre: pista.hora_cierre,
        precioHora: String(pista.precio_hora ?? ''),
        reservasActuales: JSON.stringify(pista.reservas_actuales || []),
      },
    });
  };

  const renderDateSelector = () => (
    <>
      <BlurView
        intensity={50}
        tint={isDarkMode ? 'dark' : 'light'}
        style={[
          StyleSheet.absoluteFill,
          { paddingTop: headerHeight + 10, height: headerHeight + 74 },
        ]}
      />
      <View
        style={[
          reservasTabStyles.dateSelector,
          { paddingTop: headerHeight + 10 },
        ]}
      >
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={availableDays}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={reservasTabStyles.dateScrollContent}
          renderItem={({ item }) => {
            const isSelected =
              item.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                style={[
                  reservasTabStyles.dateButton,
                  isSelected && reservasTabStyles.dateButtonSelected,
                ]}
                onPress={() => setSelectedDate(item)}
              >
                <Text
                  style={[
                    reservasTabStyles.dateButtonText,
                    isSelected && reservasTabStyles.dateButtonTextSelected,
                  ]}
                >
                  {formatDateDisplay(item, locale)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <TouchableOpacity
          style={reservasTabStyles.calendarButton}
          onPress={() => setShowDateModal(true)}
        >
          <Ionicons name="calendar" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderCourtCard = (pista: PistaDisponibilidad) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openCreateBooking(pista)}
      key={pista.pista_id}
      style={[
        reservasTabStyles.pistaCard,
        { flexBasis: isWideScreen ? '48%' : '100%', flexGrow: 1 },
      ]}
    >
      <ImageBackground
        source={getImageForPista(pista)}
        style={reservasTabStyles.pistaImageBg}
        imageStyle={{ borderRadius: 14 }}
      >
        <LinearGradient
          colors={[
            theme.reservationsCardOverlayStart,
            theme.reservationsCardOverlayEnd,
          ]}
          style={reservasTabStyles.pistaOverlay}
        >
          <View style={reservasTabStyles.pistaHeader}>
            <Text style={reservasTabStyles.pistaName}>{pista.nombre}</Text>
            <View style={reservasTabStyles.priceBadge}>
              <Text style={reservasTabStyles.priceText}>
                {t('bookingTabPricePerHour', {
                  price: pista.precio_hora ?? '-',
                })}
              </Text>
            </View>
          </View>

          <View style={reservasTabStyles.timelineContainer}>
            <View style={reservasTabStyles.timelineTitleRow}>
              <Text style={reservasTabStyles.horariosLabel}>
                {t('bookingTabAvailabilityToday')}
              </Text>
              <TouchableOpacity
                style={reservasTabStyles.infoButton}
                onPress={() => openInfo(pista)}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={theme.onPrimary}
                />
              </TouchableOpacity>
            </View>

            <AvailabilityBar
              horaApertura={pista.hora_apertura}
              horaCierre={pista.hora_cierre}
              reservasActuales={pista.reservas_actuales || []}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <DateModal
        visible={showDateModal}
        onSave={handleSelectDate}
        onClose={() => setShowDateModal(false)}
      />

      <SessionExpiredModal
        visible={showInfoModal}
        onConfirm={() => setShowInfoModal(false)}
        title={infoTitle || t('bookingTabFreeSlots')}
        confirmText={t('commonClose')}
        content={
          <View>
            <Text style={reservasTabStyles.infoListTitle}>
              {t('bookingTabFreeSlots')}
            </Text>
            {infoRanges.length === 0 ? (
              <Text style={reservasTabStyles.infoListEmpty}>
                {t('bookingTabNoAvailability')}
              </Text>
            ) : (
              <View style={reservasTabStyles.infoListWrap}>
                {infoRanges.map((range, index) => (
                  <View
                    key={range + String(index)}
                    style={reservasTabStyles.infoRangeChip}
                  >
                    <Text style={reservasTabStyles.infoRangeText}>{range}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        }
      />

      <SessionExpiredModal
        visible={showNoSlotsModal}
        onConfirm={() => setShowNoSlotsModal(false)}
        title={noSlotsTitle || t('bookingTabNoSlotsTitle')}
        message={t('bookingTabNoSlotsMessage')}
        confirmText={t('commonUnderstood')}
      />

      {renderDateSelector()}

      {loading ? (
        <View style={reservasTabStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 14,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
            paddingHorizontal: 12,
          }}
        >
          {!!selectedModelTitle && (
            <View
              style={{
                marginBottom: 12,
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
          )}
          <View style={reservasTabStyles.gridContainer}>
            {filteredPistas.map(renderCourtCard)}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
