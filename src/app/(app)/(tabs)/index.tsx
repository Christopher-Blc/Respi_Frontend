import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
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

//pantalla home del cliente

export default function HomeScreen() {
  const router = useRouter();

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
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.8)']}
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
                  <Ionicons name="calendar-outline" size={14} color="#fff" />{' '}
                  {cleanDate}
                </Text>
                <Text style={styles.cardMeta}>
                  <Ionicons name="time-outline" size={14} color="#fff" />{' '}
                  {cleanTime}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={22} color="#fff" />
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
          color="#CA8E0E"
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
                  style={styles.pillButtonPrimary}
                  color="rgba(191, 132, 4, 0.51)"
                  height={90}
                />

                <GlassTextButton
                  text="Unirse a partido"
                  onPress={() => alert('Próximamente')}
                  color="rgba(191, 132, 4, 0)"
                  style={styles.pillButtonPrimary}
                  borderColor="rgba(191, 132, 4, 0.51)"
                  borderWidth={4}
                  textColor="rgba(191, 132, 4, 0.51)"
                  height={90}
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
