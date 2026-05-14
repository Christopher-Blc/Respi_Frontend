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
import createReservationsStyles from '../../../style/reservations.styles';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import createPistasTabStyles from '../../../style/courtsTab.styles';
import {
  formatDateDisplay,
  formatPrice,
  useCourtsTab,
} from '../../../hooks/useCourtsTab';
import { CourtAvailability, Court } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../i18n';
import { getTipoPistaImage } from '../../../utils/getImage';

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
  const sportCardWidth = Math.min(cardBasis, 460);

  const renderStars = (rating: number, reviews: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(21, 26, 38, 0.46)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(199, 207, 221, 0.55)',
          alignSelf: 'flex-start',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 1 }}>
          {/* Full stars */}
          {Array.from({ length: fullStars }).map((_, i) => (
            <Ionicons key={`full-${i}`} name="star" size={14} color="#FFD700" />
          ))}
          {/* Half star */}
          {hasHalfStar && (
            <Ionicons name="star-half" size={14} color="#FFD700" />
          )}
          {/* Empty stars */}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <Ionicons
              key={`empty-${i}`}
              name="star-outline"
              size={14}
              color="rgba(255,255,255,0.5)"
            />
          ))}
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '600' }}>
          ({reviews})
        </Text>
      </View>
    );
  };

  const renderModel = (item: Court) => (
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
        source={getTipoPistaImage(item)}
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
              <Text style={localStyles.catalogTitle}>{item.name}</Text>
              <Text style={localStyles.catalogMeta}>
                {t('pistasReserveOnlineFast')}
              </Text>
            </View>
            <View style={localStyles.pricePill}>
              <Text style={localStyles.pricePillText}>
                {formatPrice(Number(item.price_per_hour || 0), locale)}/h
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

  const renderSportCourtCard = (pista: CourtAvailability) => {
    const pistaId = String(pista.id ?? '');
    const reservasHoy = pista.current_reservations?.length || 0;
    const pistaImage = getTipoPistaImage(pista);
    const canBook = Boolean(pistaId);

    const handleCourtPress = () => {
      if (!canBook) return;

      router.push({
        pathname: '/(app)/(tabs)/bookings/createBooking',
        params: {
          pistaId,
          pistaNombre: pista.name || 'Pista',
          fecha: formattedDate,
        },
      });
    };

    return (
      <TouchableOpacity
        key={pistaId || pista.name}
        activeOpacity={0.92}
        disabled={!canBook}
        onPress={handleCourtPress}
        style={[
          localStyles.sportCard,
          {
            flexBasis: isWideScreen ? sportCardWidth : '100%',
            width: isWideScreen ? sportCardWidth : '100%',
            maxWidth: sportCardWidth,
            flexGrow: 0,
          },
        ]}
      >
        <ImageBackground
          source={pistaImage}
          style={localStyles.sportCardImage}
          imageStyle={localStyles.sportCardImageStyle}
        >
          <LinearGradient
            colors={[
              'rgba(8, 12, 20, 0.16)',
              'rgba(8, 12, 20, 0.72)',
              'rgba(8, 12, 20, 0.92)',
            ]}
            style={localStyles.sportCardOverlay}
          >
            <View style={localStyles.sportCardHeader}>
              {renderStars(
                Number(pista.average_rating || 0),
                pista.total_reviews || 0,
              )}
              <View style={localStyles.pricePill}>
                <Text style={localStyles.pricePillText}>
                  {pista.price_per_hour
                    ? `${formatPrice(Number(pista.price_per_hour), locale)}/h`
                    : t('pistasPriceFallback')}
                </Text>
              </View>
            </View>

            <View>
              <Text style={localStyles.sportCardTitle} numberOfLines={1}>
                {pista.name || t('bookingCreateCourtFallback')}
              </Text>

              {!!pista.description && (
                <Text
                  style={localStyles.sportCardDescription}
                  numberOfLines={2}
                >
                  {pista.description}
                </Text>
              )}

              <View style={localStyles.sportChipsWrap}>
                <View style={localStyles.sportChip}>
                  <Text style={localStyles.sportChipText}>
                    {t('pistasCovered', {
                      value: pista.is_covered ? t('commonYes') : t('commonNo'),
                    })}
                  </Text>
                </View>
                <View style={localStyles.sportChip}>
                  <Text style={localStyles.sportChipText}>
                    {t('pistasLighting', {
                      value: pista.has_lighting
                        ? t('commonYes')
                        : t('commonNo'),
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
          </LinearGradient>
        </ImageBackground>

        <View
          style={[
            localStyles.reserveButton,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <Text
            style={[
              localStyles.reserveButtonText,
              {
                color: theme.textTitle,
              },
            ]}
          >
            {t('pistasReserveThisCourt')}
          </Text>
        </View>
      </TouchableOpacity>
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
              {selectedModel ? selectedModel.name : t('pistasHeroTitleDefault')}
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
