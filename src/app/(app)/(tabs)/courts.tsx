import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modelo } from '../../../data/modelos';
import createReservationsStyles from '../../../style/reservations.styles';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import createPistasTabStyles from '../../../style/courtsTab.styles';
import {
  formatDateDisplay,
  formatPrice,
  resolvePistaImageSource,
  resolveImageSource,
  useCourtsTab,
} from '../../../hooks/useCourtsTab';
import { PistaDisponibilidad } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../i18n';

const GRID_GAP = 16;

export default function PistasTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const styles = React.useMemo(() => createReservationsStyles(theme), [theme]);
  const localStyles = useMemo(() => createPistasTabStyles(theme), [theme]);
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);
  const horizontalPadding = width >= 1280 ? 20 : width >= 768 ? 16 : 8;
  const availableGridWidth = Math.max(width - horizontalPadding * 2, 0);
  const {
    loading,
    displayedModelos,
    selectedModel,
    setSelectedModel,
    selectedDate,
    setSelectedDate,
    loadingSportInfo,
    sportError,
    sportType,
    sportPistas,
    availableDays,
    formattedDate,
    clearSportFilter,
  } = useCourtsTab();

  let baseColumnsCount = 1;
  if (width >= 1024) baseColumnsCount = 3;
  else if (width >= 768) baseColumnsCount = 2;

  const getResponsiveCardBasis = () => {
    const columnsCount = baseColumnsCount;
    const columnWidth =
      (availableGridWidth - GRID_GAP * Math.max(columnsCount - 1, 0)) /
      columnsCount;

    return Math.max(columnWidth, 280);
  };

  const cardBasis = getResponsiveCardBasis();
  const isWideScreen = width >= 768;

  const renderModel = (item: Modelo) => (
    <TouchableOpacity
      key={item.id}
      style={[
        localStyles.catalogCard,
        {
          flexBasis: isWideScreen ? cardBasis : '100%',
          flexGrow: 1,
        },
      ]}
      activeOpacity={0.9}
      onPress={() => setSelectedModel(item)}
    >
      <ImageBackground
        source={resolveImageSource(item.img)}
        style={localStyles.catalogCardBg}
        imageStyle={{ borderRadius: 18 }}
      >
        <LinearGradient
          colors={[
            theme.reservationsCardOverlayStart,
            theme.reservationsCardOverlayEnd,
          ]}
          style={localStyles.catalogCardOverlay}
        >
          <View style={localStyles.catalogHeaderRow}>
            <View style={localStyles.statusBadge}>
              <Text style={localStyles.statusText}>
                {t('pistasStatusAvailable')}
              </Text>
            </View>
          </View>

          <View style={localStyles.catalogBottom}>
            <View>
              <Text style={localStyles.catalogTitle}>{item.title}</Text>
              <Text style={localStyles.catalogMeta}>
                {t('pistasReserveOnlineFast')}
              </Text>
            </View>
            <View style={localStyles.pricePill}>
              <Text style={localStyles.pricePillText}>
                {formatPrice(item.price, locale)}/h
              </Text>
            </View>
          </View>

          <View style={localStyles.catalogFooter}>
            <Text style={localStyles.catalogCta}>{t('pistasChooseSport')}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.onPrimary}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderSportCourtCard = (pista: PistaDisponibilidad) => {
    const pistaId = String(pista.pista_id ?? '');
    const reservasHoy = pista.reservas_actuales?.length || 0;
    const pistaImage = resolvePistaImageSource(pista, selectedModel);

    return (
      <View
        key={pistaId || pista.nombre}
        style={[
          localStyles.sportCard,
          {
            flexBasis: isWideScreen ? cardBasis : '100%',
            flexGrow: 1,
          },
        ]}
      >
        <ImageBackground
          source={pistaImage}
          style={localStyles.sportCardImage}
          imageStyle={localStyles.sportCardImageStyle}
        >
          <View style={localStyles.sportCardOverlay}>
            <View style={localStyles.sportCardHeader}>
              <Text style={localStyles.sportCardTitle}>
                {pista.nombre || t('bookingCreateCourtFallback')}
              </Text>
              <Text style={localStyles.sportCardPrice}>
                {pista.precio_hora
                  ? `${formatPrice(pista.precio_hora, locale)}/h`
                  : t('pistasPriceFallback')}
              </Text>
            </View>

            {!!pista.descripcion && (
              <Text style={localStyles.sportCardDescription}>
                {pista.descripcion}
              </Text>
            )}

            <View style={localStyles.sportChipsWrap}>
              <View style={localStyles.sportChip}>
                <Text style={localStyles.sportChipText}>
                  {t('pistasCovered', {
                    value: pista.cubierta ? t('commonYes') : t('commonNo'),
                  })}
                </Text>
              </View>
              <View style={localStyles.sportChip}>
                <Text style={localStyles.sportChipText}>
                  {t('pistasLighting', {
                    value: pista.iluminacion ? t('commonYes') : t('commonNo'),
                  })}
                </Text>
              </View>
              <View style={localStyles.sportChip}>
                <Text style={localStyles.sportChipText}>
                  {t('pistasBookingsToday', { count: reservasHoy })}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {!!pistaId && (
          <TouchableOpacity
            style={localStyles.reserveButton}
            onPress={() =>
              router.push({
                pathname: '/(app)/(tabs)/bookings/createBooking',
                params: {
                  pistaId,
                  pistaNombre: pista.nombre || 'Pista',
                  fecha: formattedDate,
                },
              })
            }
          >
            <Text style={localStyles.reserveButtonText}>
              {t('pistasReserveThisCourt')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, localStyles.pageContainer]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: headerHeight + 16 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: headerHeight + 18,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
            paddingHorizontal: horizontalPadding,
            width: '100%',
          }}
        >
          <View style={localStyles.heroCard}>
            <View style={localStyles.heroTag}>
              <Text style={localStyles.heroTagText}>{t('tabsBookings')}</Text>
            </View>
            <Text style={localStyles.heroTitle}>
              {selectedModel
                ? selectedModel.title
                : t('pistasHeroTitleDefault')}
            </Text>
            <Text style={localStyles.heroSubtitle}>
              {selectedModel
                ? t('pistasHeroSubtitleSelected')
                : t('pistasHeroSubtitleDefault')}
            </Text>

            {selectedModel && (
              <View style={localStyles.heroActionsRow}>
                <TouchableOpacity
                  style={localStyles.filterBadge}
                  activeOpacity={0.9}
                  onPress={clearSportFilter}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={16}
                    color={theme.primary}
                  />
                  <Text style={localStyles.filterBadgeText}>
                    {t('pistasRemoveFilter')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!selectedModel ? (
            <>
              <View style={localStyles.sectionHeader}>
                <Text style={localStyles.sectionTitle}>
                  {t('pistasSportsAvailable')}
                </Text>
                <Text style={localStyles.sectionSubtitle}>
                  {t('pistasSportsAvailableSubtitle')}
                </Text>
              </View>

              <View style={localStyles.gridContainer}>
                {displayedModelos.map(renderModel)}
              </View>
            </>
          ) : (
            <>
              <View style={localStyles.dateChipsRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {availableDays.map((day) => {
                    const selected =
                      day.toDateString() === selectedDate.toDateString();
                    return (
                      <TouchableOpacity
                        key={day.toISOString()}
                        style={[
                          localStyles.dateChip,
                          selected && localStyles.dateChipActive,
                        ]}
                        onPress={() => setSelectedDate(day)}
                      >
                        <Text
                          style={[
                            localStyles.dateChipText,
                            selected && localStyles.dateChipTextActive,
                          ]}
                        >
                          {formatDateDisplay(day, locale)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={localStyles.sectionHeader}>
                <Text style={localStyles.sectionTitle}>
                  {t('pistasCourtsAvailable')}
                </Text>
                <Text style={localStyles.sectionSubtitle}>{formattedDate}</Text>
              </View>

              {loadingSportInfo ? (
                <ActivityIndicator
                  size="large"
                  color={theme.primary}
                  style={{ marginTop: 12 }}
                />
              ) : sportError ? (
                <Text style={localStyles.feedbackText}>{sportError}</Text>
              ) : sportPistas.length === 0 ? (
                <Text style={localStyles.feedbackText}>
                  {t('pistasNoCourtsForSport')}
                </Text>
              ) : (
                <View style={localStyles.gridContainer}>
                  {sportPistas.map(renderSportCourtCard)}
                </View>
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
