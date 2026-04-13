import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MODELOS } from '../../data/modelos';
import { IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Reserva } from '../../types/types';
import styles from '../../style/reservations.styles';

// --- INTERFACES ADAPTADAS ---
export interface Pista {
    pista_id: number;
    nombre: string;
    // ... otros campos de Pista
}



export default function HomeScreen() {
    const { signOut } = useAuth();
    const router = useRouter();

    // Estado usando la interfaz Reserva
    const [reservations, setReservations] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            // El interceptor de tu 'api.ts' ya añade el token automáticamente
            const response = await api.get('/reserva/mis-reservas');
            setReservations(response.data);
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
		//quitamos los segundos
		const cleanTime = item.hora_inicio.split(':').slice(0, 2).join(':') + ' - ' + item.hora_fin.split(':').slice(0, 2).join(':');

		return (
			<TouchableOpacity 
				style={styles.card} 
				onPress={() => router.push(`/(app)/reservas/${item.reserva_id}`)}
			>
				<ImageBackground source={img} style={styles.cardBg} imageStyle={{ borderRadius: 12 }}>
					<LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]} style={styles.cardOverlay}>
						
						{/* FILA SUPERIOR: Título a la izquierda, Estado a la derecha */}
						<View style={styles.cardHeaderRow}>
							<Text style={styles.cardTitle}>{title}</Text>
							<View style={styles.statusBadge}>
								<Text style={styles.statusText}>{item.estado}</Text>
							</View>
						</View>

						{/* FILA INFERIOR: Fecha/Hora y Flecha */}
						<View style={styles.cardBottom}>
							<View>
								<Text style={styles.cardMeta}><Ionicons name="calendar-outline" size={14} color="#fff" style={{ marginRight: 4 }} /> {cleanDate}</Text>
								<Text style={styles.cardMeta}><Ionicons name="time-outline" size={14} color="#fff" style={{ marginRight: 4 }} /> {cleanTime}</Text>
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
                            <View style={styles.quickRow}>
                                <TouchableOpacity
                                    style={[styles.quickButton, styles.primary]}
                                    onPress={() => router.push('/(app)/booking')}
                                >
                                    <Text style={styles.quickText}>Nueva reserva</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.quickButton, styles.secondary]}
                                    onPress={() => alert('Pendiente')}
                                >
                                    <Text style={[styles.quickText, { color: '#000' }]}>Unirse a partido</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.sectionTitle}>Próximas reservas</Text>
                        </>
                    }
                    contentContainerStyle={{ paddingBottom: 100 }}
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
