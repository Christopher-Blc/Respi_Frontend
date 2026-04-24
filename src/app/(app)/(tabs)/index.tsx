import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MODELOS } from '../../../data/modelos';
import api from '../../../services/api';
import { Reserva } from '../../../types/types';
import createReservationsStyles from '../../../style/reservations.styles';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import { reservasActivasFilter } from '../../../filtrosApi';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';

//pantalla home del cliente

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createReservationsStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const isWideScreen = width > 768;
  //const buttonHeight = width > 768 ? 60 : width > 480 ? 80 : 120;

  const isWeb = Platform.OS === 'web';
  const dynamicHeight = isWeb ? (width / 2) * 0.4 : 100;
  // Ponemos un límite para que en pantallas 4K no sean gigantescos
  const buttonHeight = Math.min(dynamicHeight, 200);
  const dynamicSeparatorWidth = isWeb ? (width / 2) * 0.05 : 10;

  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reserva/mis-reservas');
      console.log(
        'Reservas obtenidas:',
        'status:',
        response.status,
        response.data,
      );

      // Filtrado por estado confirmada
      const reservasActivas = reservasActivasFilter(response);
      setReservations(reservasActivas);
    } catch (error) {
      console.error('Error al traer mis reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const getImageForReservation = (title: string) => {
    const found = MODELOS.find((m) =>
      title.toLowerCase().includes(m.title.toLowerCase()),
    );
    return found ? found.img : MODELOS[0].img;
  };

  const renderReservation = (item: Reserva) => {
    const title = item.pista?.nombre || 'Reserva sin nombre';
    const img = getImageForReservation(title);
    const cleanDate = item.fecha_reserva.split('T')[0];
    const cleanTime =
      item.hora_inicio.split(':').slice(0, 2).join(':') +
      ' - ' +
      item.hora_fin.split(':').slice(0, 2).join(':');

    return (
      <TouchableOpacity
        key={item.reserva_id}
        style={styles.card}
        onPress={() => router.push(`/(app)/reservas/${item.reserva_id}`)}
      >
        <ImageBackground
          source={img}
          style={styles.cardBg}
          imageStyle={{
            borderRadius: 16,
            borderColor: '#fff',
            borderWidth: 0.5,
          }}
        >
          <LinearGradient
            colors={[
              theme.reservationsCardOverlayStart,
              theme.reservationsCardOverlayEnd,
            ]}
            style={styles.cardOverlay}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>{title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.estado}</Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.cardMeta}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={theme.onPrimary}
                  />{' '}
                  {cleanDate}
                </Text>
                <Text style={styles.cardMeta}>
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
                size={22}
                color={theme.onPrimary}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: headerHeight + 10,
            paddingBottom: Platform.OS === 'web' ? 88 : 120,
          }}
        >
          <Text style={styles.header}>Bienvenido a ResPi</Text>

          <View style={styles.premiumActionRow}>
            <GlassTextButton
              text="Nueva reserva"
              onPress={() => router.push('/reservas/createBooking')}
              style={[
                styles.pillButtonPrimary,
                { marginRight: dynamicSeparatorWidth },
              ]}
              color={theme.primarySoft}
              borderColor={theme.surface}
              borderWidth={1.5}
              height={buttonHeight}
              textColor={theme.primary}
            />

            <GlassTextButton
              text="Unirse a partido"
              onPress={() => alert('Próximamente')}
              color={theme.surfaceGlass}
              style={styles.pillButtonPrimary}
              borderColor={theme.borderAccentSoft}
              borderWidth={1.5}
              textColor={theme.primary}
              height={buttonHeight}
            />
          </View>

          <Text style={styles.sectionTitle}>Próximas reservas</Text>

          {reservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes reservas próximas</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {reservations.map((item) => (
                <View
                  key={item.reserva_id}
                  style={[
                    styles.cardWrapper,
                    {
                      flexBasis: isWideScreen ? 320 : '100%',
                      flexGrow: 1,
                    },
                  ]}
                >
                  {renderReservation(item)}
                </View>
              ))}

              {isWideScreen && <View style={styles.dummyCard} />}
              {isWideScreen && <View style={styles.dummyCard} />}
              {isWideScreen && <View style={styles.dummyCard} />}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
