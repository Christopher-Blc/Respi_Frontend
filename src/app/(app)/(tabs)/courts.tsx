import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import createPistasTabStyles from '../../../style/courts/courtsTab.styles';
import {
  formatDateDisplay,
  formatPrice,
  useCourtsTab,
} from '../../../hooks/courts/useCourtsTab';
import { CourtAvailability, CourtType } from '../../../types/types';
import { useTranslation } from 'react-i18next';
import { getDateLocale } from '../../../i18n';
import { getTipoPistaImage } from '../../../utils/getImage';
import { API_PUBLIC_URL } from '../../../constants';
import CourtInfoModal from '../../../components/bookings/CourtInfoModal';
import CourtReviewsModal from '../../../components/reviews/CourtReviewsModal';
import { usePullToRefresh } from '../../../hooks/usePullToRefresh';

const GAP = 12;

export default function PistasTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const localStyles = useMemo(() => createPistasTabStyles(theme), [theme]);
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const locale = getDateLocale(i18n.resolvedLanguage || i18n.language);
  const padding = width >= 768 ? 16 : 12;
  const cols = width >= 1280 ? 3 : width >= 520 ? 2 : 1;
  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedCourtInfo, setSelectedCourtInfo] =
    useState<CourtAvailability | null>(null);
  const [selectedCourtReviews, setSelectedCourtReviews] =
    useState<CourtAvailability | null>(null);
  const effective = containerWidth || width;
  const cardWidth = Math.max(
    160,
    Math.floor((effective - padding * 2 - GAP * (cols - 1)) / cols),
  );
  const sportCardWidth = Math.min(cardWidth, 460);
  const isWideScreen = width >= 520;

  const {
    loading,
    tipos,
    selectedModel,
    setSelectedModel,
    selectedDate,
    setSelectedDate,
    loadingSportInfo,
    sportError,
    sportPistas,
    availableDays,
    formattedDate,
    clearSportFilter,
    refresh,
  } = useCourtsTab();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  const renderModel = ({ item }: { item: CourtType }) => {
    const src = item.image
      ? {
          uri: `${API_PUBLIC_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`,
        }
      : undefined;
    return (
      <View
        style={{
          width: cardWidth,
          flexGrow: 0,
          flexShrink: 0,
          alignSelf: 'stretch',
        }}
      >
        <TouchableOpacity
          style={localStyles.catalogCard}
          activeOpacity={0.9}
          onPress={() => setSelectedModel(item)}
        >
          <ImageBackground
            source={src}
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
                <View style={{ flex: 1 }}>
                  <Text style={localStyles.catalogTitle}>{item.name}</Text>
                </View>
                <View style={localStyles.statusBadge}>
                  <Text style={localStyles.statusText}>
                    {item.totalCourts} {t('pistasStatusAvailable')}
                  </Text>
                </View>
              </View>
              <View style={localStyles.catalogFooter}>
                <Text style={localStyles.catalogCta}>
                  {t('pistasChooseSport')}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.onPrimary}
                />
              </View>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStars = (rating: number, reviews: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          backgroundColor: 'rgba(21,26,38,0.46)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: 'rgba(199,207,221,0.55)',
          alignSelf: 'flex-start',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 1 }}>
          {Array.from({ length: full }).map((_, i) => (
            <Ionicons key={`f${i}`} name="star" size={14} color="#FFD700" />
          ))}
          {half && <Ionicons name="star-half" size={14} color="#FFD700" />}
          {Array.from({ length: empty }).map((_, i) => (
            <Ionicons
              key={`e${i}`}
              name="star-outline"
              size={14}
              color="rgba(255,255,255,0.5)"
            />
          ))}
        </View>
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>
          ({reviews})
        </Text>
      </View>
    );
  };

  const selectedSportImage = selectedModel?.image
    ? {
        uri: `${API_PUBLIC_URL}${selectedModel.image.startsWith('/') ? '' : '/'}${selectedModel.image}`,
      }
    : undefined;

  const renderSportCourtCard = (pista: CourtAvailability) => {
    const pistaId = String(pista.id ?? '');
    const reservasHoy = pista.current_reservations?.length || 0;
    const canBook = Boolean(pistaId);
    return (
      <TouchableOpacity
        key={pistaId || pista.name}
        activeOpacity={0.92}
        disabled={!canBook}
        onPress={() => {
          if (!canBook) return;
          router.push({
            pathname: '/(app)/(tabs)/bookings/createBooking',
            params: {
              pistaId,
              pistaNombre: pista.name || 'Pista',
              fecha: formattedDate,
            },
          });
        }}
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
          source={selectedSportImage || getTipoPistaImage(pista)}
          style={localStyles.sportCardImage}
          imageStyle={localStyles.sportCardImageStyle}
        >
          <LinearGradient
            colors={[
              'rgba(8,12,20,0.16)',
              'rgba(8,12,20,0.72)',
              'rgba(8,12,20,0.92)',
            ]}
            style={localStyles.sportCardOverlay}
          >
            <View style={localStyles.sportCardHeader}>
              <TouchableOpacity
                onPress={() => setSelectedCourtReviews(pista)}
                activeOpacity={0.75}
              >
                {renderStars(
                  Number(pista.average_rating || 0),
                  pista.total_reviews || 0,
                )}
              </TouchableOpacity>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <View style={localStyles.pricePill}>
                  <Text style={localStyles.pricePillText}>
                    {pista.price_per_hour
                      ? `${formatPrice(Number(pista.price_per_hour), locale)}/h`
                      : t('pistasPriceFallback')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedCourtInfo(pista)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.35)',
                  }}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color={theme.onPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={localStyles.sportCardTitle} numberOfLines={1}>
                {pista.name || t('bookingCreateCourtFallback')}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={localStyles.sportChipsWrap}
              >
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
              </ScrollView>
            </View>
          </LinearGradient>
        </ImageBackground>
        <View
          style={[
            localStyles.reserveButton,
            { backgroundColor: theme.surface },
          ]}
        >
          <Text
            style={[localStyles.reserveButtonText, { color: theme.textTitle }]}
          >
            {t('pistasReserveThisCourt')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.background }}
      onLayout={(e) => {
        const w = Math.floor(e.nativeEvent.layout.width);
        if (w > 0 && w !== containerWidth) setContainerWidth(w);
      }}
    >
      <CourtInfoModal
        court={selectedCourtInfo}
        onClose={() => setSelectedCourtInfo(null)}
      />

      {selectedCourtReviews && (
        <CourtReviewsModal
          court={selectedCourtReviews}
          onClose={() => setSelectedCourtReviews(null)}
        />
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: headerHeight + 16 }}
        />
      ) : !selectedModel ? (
        <FlatList
          key={`tipos-${cols}`}
          data={tipos}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          numColumns={cols}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={
            cols > 1
              ? {
                  gap: GAP,
                  justifyContent: 'flex-start',
                  alignItems: 'stretch',
                }
              : undefined
          }
          contentContainerStyle={{
            paddingTop: headerHeight + 18,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
            paddingHorizontal: padding,
            gap: GAP,
          }}
          ListHeaderComponent={
            <View style={localStyles.sectionHeader}>
              <Text style={localStyles.sectionTitle}>
                {t('pistasSportsAvailable')}
              </Text>
              <Text style={localStyles.sectionSubtitle}>
                {t('pistasSportsAvailableSubtitle')}
              </Text>
            </View>
          }
          renderItem={renderModel}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          contentContainerStyle={{
            paddingTop: headerHeight + 18,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
            paddingHorizontal: padding,
            gap: GAP,
          }}
        >
          <View style={localStyles.sectionHeader}>
            <Text style={localStyles.sectionTitle}>{selectedModel.name}</Text>
            <TouchableOpacity
              onPress={clearSportFilter}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons
                name="close-circle-outline"
                size={16}
                color={theme.primary}
              />
              <Text
                style={[localStyles.sectionSubtitle, { color: theme.primary }]}
              >
                {t('pistasRemoveFilter')}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={localStyles.dateChipsRow}
          >
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
        </ScrollView>
      )}
    </View>
  );
}
