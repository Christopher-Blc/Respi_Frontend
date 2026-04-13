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
								<Text style={styles.cardMeta}>{cleanDate}</Text>
								<Text style={styles.cardMeta}>{cleanTime}</Text>
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

const styles = StyleSheet.create({
    logoutButton: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        backgroundColor:"#979797",
        elevation: 5,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 18,
        backgroundColor: '#f9fafb',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        color: '#111827',
    },
    quickRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    quickButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    primary: {
        backgroundColor: '#CA8E0E',
    },
    secondary: {
        backgroundColor: 'rgba(10,10,10,0.06)',
    },
    quickText: {
        color: '#fff',
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#374151',
    },
    card: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#fff',
    
    // 1. FUNDAMENTAL: Esto corta la imagen para que respete el borderRadius
    overflow: 'hidden', 
    
    // 2. Quita o suaviza el borde
    borderWidth: 0, // Prueba a ponerlo en 0
    
    // 3. Mejora la sombra para que se vea más premium
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
},
cardBg: { 
    width: '100%', 
    height: 160, 
    justifyContent: 'flex-end',
    // Asegúrate de que no haya padding aquí para que la imagen pegue al borde
},
    cardOverlay: { 
        flex: 1, 
        justifyContent: 'space-between', // Separa el header del bottom
        padding: 14 
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Empuja el título a la izq y badge a la dcha
        alignItems: 'center', // Los centra verticalmente entre ellos
    },
    statusBadge: {
        backgroundColor: 'rgba(202, 142, 14, 0.8)', // Naranja con transparencia
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardTitle: { 
        flex: 1, // Para que si el título es muy largo no pise al badge
        fontWeight: '900', 
        fontSize: 17, 
        color: '#fff',
        marginRight: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4
    },
    cardBottom: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end' 
    },
    cardMeta: { 
        color: '#fff', 
        fontSize: 13, 
        fontWeight: '500',
        opacity: 0.9
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 16,
    }
});