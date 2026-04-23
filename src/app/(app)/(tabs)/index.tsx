import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
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
import styles from '../../../style/reservations.styles';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import { reservasActivasFilter } from '../../../filtrosApi';
import { lightModeSemanticTokens } from '../../../theme';

//pantalla home del cliente

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
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

  const renderReservation = ({ item }: { item: Reserva }) => {
    const title = item.pista?.nombre || 'Reserva sin nombre';
    const img = getImageForReservation(title);
    const cleanDate = item.fecha_reserva.split('T')[0];
    const cleanTime =
      item.hora_inicio.split(':').slice(0, 2).join(':') +
      ' - ' +
      item.hora_fin.split(':').slice(0, 2).join(':');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(app)/reservas/${item.reserva_id}`)}
      >
        <ImageBackground
          source={img}
          style={styles.cardBg}
          imageStyle={{ borderRadius: 12 }}
        >
          <LinearGradient
            colors={[
              lightModeSemanticTokens.reservationsCardOverlayStart,
              lightModeSemanticTokens.reservationsCardOverlayEnd,
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
                    color={lightModeSemanticTokens.onPrimary}
                  />{' '}
                  {cleanDate}
                </Text>
                <Text style={styles.cardMeta}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={lightModeSemanticTokens.onPrimary}
                  />{' '}
                  {cleanTime}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={22}
                color={lightModeSemanticTokens.onPrimary}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={lightModeSemanticTokens.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(i) => i.reserva_id.toString()}
          renderItem={renderReservation}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes reservas próximas</Text>
            </View>
          }
          ListHeaderComponent={
            <>
              <Text style={styles.header}>Bienvenido a ResPi</Text>

              <View style={styles.premiumActionRow}>
                <GlassTextButton
                  text="Nueva reserva"
                  onPress={() => router.push('/reservas/createBooking')}
                  style={[
                    styles.pillButtonPrimary,
                    { marginRight: dynamicSeparatorWidth },
                  ]}
                  // Naranja "Golden Hour": más vivo pero con transparencia para que no sea un bloque
                  color={lightModeSemanticTokens.primarySoft}
                  // Borde blanco cristalino: vital para que el naranja no se "coma" el botón
                  borderColor={lightModeSemanticTokens.surface}
                  borderWidth={1.5}
                  height={buttonHeight}
                  textColor={lightModeSemanticTokens.primary}
                />

                <GlassTextButton
                  text="Unirse a partido"
                  onPress={() => alert('Próximamente')}
                  // Fondo neutro cristalino para que el otro naranja resalte
                  color={lightModeSemanticTokens.surfaceGlass}
                  style={styles.pillButtonPrimary}
                  // Borde naranja fino
                  borderColor={lightModeSemanticTokens.borderAccentSoft}
                  borderWidth={1.5}
                  textColor={lightModeSemanticTokens.primary}
                  height={buttonHeight}
                />
              </View>

              <Text style={styles.sectionTitle}>Próximas reservas</Text>
            </>
          }
        />
      )}
    </View>
  );
}
