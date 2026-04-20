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
import { IconButton } from 'react-native-paper';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { Reserva } from '../../../types/types';
import styles from '../../../style/reservations.styles';
import { GlassTextButton } from '../../../components/login/glassTextButton';

export interface Pista {
    pista_id: number;
    nombre: string;
}

export default function HomeScreen() {
    const { signOut } = useAuth();
    const router = useRouter();

    const [reservations, setReservations] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reserva/mis-reservas');
            console.log('Reservas obtenidas:', response.data);
            
            // Filtrado por estado confirmada
            const reservasActivas = response.data.filter(
             (reserva: Reserva) => reserva.estado.toLowerCase() === 'confirmada'
            );
            setReservations(reservasActivas);
        } catch (error) {
            console.error("Error al traer mis reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    const getImageForReservation = (title: string) => {
        const found = MODELOS.find((m) => title.toLowerCase().includes(m.title.toLowerCase()));
        return found ? found.img : MODELOS[0].img;
    };

    const renderReservation = ({ item }: { item: Reserva }) => {
        const title = item.pista?.nombre || 'Reserva sin nombre';
        const img = getImageForReservation(title);
        const cleanDate = item.fecha_reserva.split('T')[0];
        const cleanTime = item.hora_inicio.split(':').slice(0, 2).join(':') + ' - ' + item.hora_fin.split(':').slice(0, 2).join(':');

        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => router.push(`/(app)/reservas/${item.reserva_id}`)}
            >
                <ImageBackground source={img} style={styles.cardBg} imageStyle={{ borderRadius: 12 }}>
                    <LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]} style={styles.cardOverlay}>
                        
                        <View style={styles.cardHeaderRow}>
                            <Text style={styles.cardTitle}>{title}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{item.estado}</Text>
                            </View>
                        </View>

                        <View style={styles.cardBottom}>
                            <View>
                                <Text style={styles.cardMeta}>
                                    <Ionicons name="calendar-outline" size={14} color="#fff" /> {cleanDate}
                                </Text>
                                <Text style={styles.cardMeta}>
                                    <Ionicons name="time-outline" size={14} color="#fff" /> {cleanTime}
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
            <GlassTextButton text="Refetch" textColor="#fff" onPress={fetchReservas} color={'rgba(191, 132, 4, 0.51)'} />
            {loading ? (
                <ActivityIndicator size="large" color="#CA8E0E" style={{ marginTop: 50 }} />
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
                            
                            {/* --- SECCIÓN DE BOTONES MEJORADA --- */}
                            <View style={styles.premiumActionRow}>
                                <TouchableOpacity
                                    style={styles.pillButtonPrimary}
                                    onPress={() => router.push('/(app)/booking')}
                                >
                                    <LinearGradient 
                                        colors={["#CA8E0E", "#A06B08"]} 
                                        style={styles.pillButtonGradient}
                                        start={{ x: 0, y: 0 }} 
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <Text style={styles.pillButtonText}>Nueva reserva</Text>
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.pillButtonOutline}
                                    onPress={() => alert('Próximamente')}
                                >
                                    <Text style={styles.pillButtonTextOutline}>Unirse a partido</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.sectionTitle}>Próximas reservas</Text>
                        </>
                    }
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
                />
            )}
            
            <IconButton
                style={styles.logoutButton}
                icon="door"
                iconColor={"#ffffff"}
                size={20}
                onPress={handleLogout}
            />
        </View>
    );
}