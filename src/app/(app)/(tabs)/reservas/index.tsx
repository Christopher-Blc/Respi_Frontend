import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MODELOS } from '../../../../data/modelos';
import { Reserva } from '../../../../types/types';
import createReservationsStyles from '../../../../style/reservations.styles';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useHome } from '../../../../hooks/useHome';
import { createHomeStyles } from '../../../../style/home.styles';

//pantalla home del cliente

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = useMemo(() => createReservationsStyles(theme), [theme]);
  const localStyles = useMemo(() => createHomeStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const isWideScreen = width > 768;
  const { reservations, loading, refreshing, onRefresh } = useHome();

  const getImageForReservation = (title: string) => {
    const found = MODELOS.find((m) =>
      title.toLowerCase().includes(m.title.toLowerCase()),
    );
    return found ? found.img : MODELOS[0].img;
  };

  const renderReservation = (item: Reserva) => {
    const title = item.pista?.nombre || 'Reserva sin nombre';
    const img = getImageForReservation(title);
    const cleanDate = new Date(item.fecha_reserva).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    });
    const cleanTime =
      item.hora_inicio.split(':').slice(0, 2).join(':') +
      ' - ' +
      item.hora_fin.split(':').slice(0, 2).join(':');

    return (
      <TouchableOpacity
        key={item.reserva_id}
        style={localStyles.card}
        onPress={() => router.push(`/(app)/reservas/${item.reserva_id}`)}
      >
        <ImageBackground
          source={img}
          style={localStyles.cardBg}
          imageStyle={localStyles.cardImage}
        >
          <LinearGradient
            colors={[
              theme.reservationsCardOverlayStart,
              theme.reservationsCardOverlayEnd,
            ]}
            style={localStyles.cardOverlay}
          >
            <View style={localStyles.cardHeaderRow}>
              <Text style={localStyles.cardTitle}>{title}</Text>
              <View style={localStyles.statusBadge}>
                <Text style={localStyles.statusText}>{item.estado}</Text>
              </View>
            </View>

            <View style={localStyles.cardBottom}>
              <View>
                <Text style={localStyles.cardMeta}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={theme.onPrimary}
                  />{' '}
                  {cleanDate}
                </Text>
                <Text style={localStyles.cardMeta}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={theme.onPrimary}
                  />{' '}
                  {cleanTime}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={theme.onPrimary}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, localStyles.page]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: headerHeight + 24 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
          contentContainerStyle={{
            paddingTop: headerHeight + 14,
            paddingBottom: 120,
          }}
        >
          {/*eso seran filtros para buscar o reservas activas o finalizadas hechas por este usuario*/}
          <View style={localStyles.actionsRow}>
            <TouchableOpacity
              style={[localStyles.actionCard, localStyles.actionPrimary]}
              onPress={() => null}
            >
              <Ionicons name="time" size={18} color={theme.onPrimary} />
              <Text style={localStyles.actionPrimaryText}>Activas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[localStyles.actionCard, localStyles.actionSecondary]}
              onPress={() => null}
            >
              <Ionicons name="checkmark" size={18} color={theme.primary} />
              <Text style={localStyles.actionSecondaryText}>Finalizadas</Text>
            </TouchableOpacity>
          </View>

          <View style={localStyles.sectionHeader}>
            <Text style={localStyles.sectionTitle}>Próximas reservas</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text style={localStyles.sectionLink}>Actualizar</Text>
            </TouchableOpacity>
          </View>

          {reservations.length === 0 ? (
            <View style={localStyles.emptyCard}>
              <Ionicons
                name="calendar-clear-outline"
                size={24}
                color={theme.textMuted}
              />
              <Text style={localStyles.emptyTitle}>Sin reservas próximas</Text>
              <Text style={localStyles.emptySubtitle}>
                Haz tu primera reserva para empezar.
              </Text>
              <TouchableOpacity
                style={localStyles.emptyCta}
                onPress={() => router.push('/reservas')}
              >
                <Text style={localStyles.emptyCtaText}>Reservar ahora</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={localStyles.gridContainer}>
              {reservations.map((item) => (
                <View
                  key={item.reserva_id}
                  style={{
                    flexBasis: isWideScreen ? 320 : '100%',
                    flexGrow: 1,
                  }}
                >
                  {renderReservation(item)}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
