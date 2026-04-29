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
import createPistasTabStyles from '../../../style/pistasTab.styles';
import {
  formatDateDisplay,
  formatPrice,
  resolvePistaImageSource,
  resolveImageSource,
  usePistasTab,
} from '../../../hooks/usePistasTab';
import { PistaDisponibilidad } from '../../../types/types';

const CARD_MIN_WIDTH = 230;
const CARD_MAX_WIDTH = 450;
const GRID_GAP = 16;
const MAX_CONTENT_WIDTH = 1400;

export default function PistasTab() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createReservationsStyles(theme), [theme]);
  const localStyles = useMemo(() => createPistasTabStyles(theme), [theme]);
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 1280 ? 40 : width >= 768 ? 28 : 20;
  const contentWidth = width > MAX_CONTENT_WIDTH ? MAX_CONTENT_WIDTH : width;
  const availableGridWidth = Math.max(contentWidth - horizontalPadding * 2, 0);
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
  } = usePistasTab();

  let baseColumnsCount = 1;
  if (width >= 1024) baseColumnsCount = 3;
  else if (width >= 768) baseColumnsCount = 2;

  const getResponsiveCardWidth = (itemCount: number) => {
    const columnsCount = Math.min(Math.max(itemCount, 1), baseColumnsCount);
    const columnWidth =
      (availableGridWidth - GRID_GAP * Math.max(columnsCount - 1, 0)) /
      columnsCount;

    return Math.min(Math.max(columnWidth, CARD_MIN_WIDTH), CARD_MAX_WIDTH);
  };

  const modelCardWidth = getResponsiveCardWidth(displayedModelos.length);
  const sportCardWidth = getResponsiveCardWidth(sportPistas.length);

  const renderModel = (item: Modelo) => (
    <TouchableOpacity
      key={item.id}
      style={[
        localStyles.catalogCard,
        {
          flexBasis: modelCardWidth,
          minWidth: CARD_MIN_WIDTH,
          maxWidth: CARD_MAX_WIDTH,
          width: '100%',
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
              <Text style={localStyles.statusText}>Disponible</Text>
            </View>
          </View>

          <View style={localStyles.catalogBottom}>
            <View>
              <Text style={localStyles.catalogTitle}>{item.title}</Text>
              <Text style={localStyles.catalogMeta}>
                Reserva online y confirma en segundos
              </Text>
            </View>
            <View style={localStyles.pricePill}>
              <Text style={localStyles.pricePillText}>
                {formatPrice(item.price)}/h
              </Text>
            </View>
          </View>

          <View style={localStyles.catalogFooter}>
            <Text style={localStyles.catalogCta}>Elegir deporte</Text>
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
            flexBasis: sportCardWidth,
            minWidth: CARD_MIN_WIDTH,
            maxWidth: CARD_MAX_WIDTH,
            width: '100%',
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
                {pista.nombre || 'Pista'}
              </Text>
              <Text style={localStyles.sportCardPrice}>
                {pista.precio_hora
                  ? `EUR ${pista.precio_hora}/h`
                  : 'Precio N/D'}
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
                  Capacidad: {pista.capacidad ?? 'N/D'}
                </Text>
              </View>
              <View style={localStyles.sportChip}>
                <Text style={localStyles.sportChipText}>
                  Cubierta: {pista.cubierta ? 'Si' : 'No'}
                </Text>
              </View>
              <View style={localStyles.sportChip}>
                <Text style={localStyles.sportChipText}>
                  Iluminacion: {pista.iluminacion ? 'Si' : 'No'}
                </Text>
              </View>
              <View style={localStyles.sportChip}>
                <Text style={localStyles.sportChipText}>
                  Reservas hoy: {reservasHoy}
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
                pathname: '/(app)/(tabs)/reservas/createBooking',
                params: {
                  pistaId,
                  pistaNombre: pista.nombre || 'Pista',
                  fecha: formattedDate,
                },
              })
            }
          >
            <Text style={localStyles.reserveButtonText}>
              Reservar esta pista
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
            maxWidth: contentWidth,
            alignSelf: 'center',
          }}
        >
          <View style={localStyles.heroCard}>
            <View style={localStyles.heroTag}>
              <Text style={localStyles.heroTagText}>Reservas</Text>
            </View>
            <Text style={localStyles.heroTitle}>
              {selectedModel ? selectedModel.title : 'Consulta disponibilidad'}
            </Text>
            <Text style={localStyles.heroSubtitle}>
              {selectedModel
                ? 'Informacion de pistas disponibles para este deporte en la fecha elegida.'
                : 'Aqui podrás encontrar todas las pistas, ver su disponibilidad y reservar desde aqui mismo.'}
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
                  <Text style={localStyles.filterBadgeText}>Quitar filtro</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {!selectedModel ? (
            <>
              <View style={localStyles.sectionHeader}>
                <Text style={localStyles.sectionTitle}>
                  Deportes disponibles
                </Text>
                <Text style={localStyles.sectionSubtitle}>
                  Selecciona uno para ver sus pistas sin salir de esta pantalla
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
                          {formatDateDisplay(day)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={localStyles.sectionHeader}>
                <Text style={localStyles.sectionTitle}>Pistas disponibles</Text>
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
                  No hay pistas disponibles para este deporte en la fecha
                  seleccionada.
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
