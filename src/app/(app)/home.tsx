import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MODELOS } from '../../data/modelos';
import { IconButton } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';

type Reservation = {
	id: string;
	title: string;
	date: string;
	time: string;
};



const mockReservations: Reservation[] = [
	{ id: '1', title: 'Pista 1 - Tenis', date: '2026-04-02', time: '18:00' },
	{ id: '2', title: 'Pista 3 - Pádel', date: '2026-04-05', time: '20:30' },
];

export default function HomeScreen() {
    //para el logout temporal (Moverlo despues plis cuando este la pantalla de ajustes)
    const { signOut } = useAuth();
    const handleLogout = async () => {
        try {
            signOut();
            
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };
	const router = useRouter();

	const getImageForReservation = (title: string) => {
		const found = MODELOS.find((m) => title.toLowerCase().includes(m.title.toLowerCase()));
		return found ? found.img : MODELOS[0].img;
	};

	const renderReservation = ({ item }: { item: Reservation }) => {
		const img = getImageForReservation(item.title);
		return (
			<TouchableOpacity style={styles.card} onPress={() => router.push(`/(app)/reservas/${item.id}`)}>
				<ImageBackground source={img} style={styles.cardBg} imageStyle={{ borderRadius: 12 }}>
					<LinearGradient colors={["transparent", "rgba(0,0,0,0.48)"]} style={styles.cardOverlay}>
						<View style={styles.cardTop}>
							<Text style={styles.cardTitle}>{item.title}</Text>
						</View>
						<View style={styles.cardBottom}>
							<Text style={styles.cardMeta}>{item.date} • {item.time}</Text>
							<Ionicons name="chevron-forward-outline" size={20} color="#fff" />
						</View>
					</LinearGradient>
				</ImageBackground>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={mockReservations}
				keyExtractor={(i) => i.id}
				renderItem={renderReservation}
				ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
								onPress={() => alert('Ir a Unirse a partido (pendiente)')}
							>
								<Text style={styles.quickText}>Unirse a partido</Text>
							</TouchableOpacity>
						</View>

						<Text style={styles.sectionTitle}>Próximas reservas</Text>
					</>
				}
				contentContainerStyle={{ paddingBottom: 40 }}
			/>
			{/* Boton que redirrige a la pantalla de login */}
			 <IconButton
				style= {styles.logoutButton}
				icon="door"
				iconColor={"#ffffff"}
				size={20}
				onPress={() => handleLogout()}
			/>
			
		</View>
	);
}

const styles = StyleSheet.create({
	logoutButton: {
		bottom: 150,
		left: 10,
		backgroundColor:"#979797",
		shadowColor:"#fff",
	},
	container: {
		paddingHorizontal: 16,
		paddingTop: 18,
		backgroundColor: '#f9fafb',
		minHeight: '100%',
	},
	header: {
		fontSize: 28,
		fontWeight: '700',
		marginBottom: 16,
	},
	quickRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	quickButton: {
		flex: 1,
		paddingVertical: 12,
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
		fontWeight: '600',
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 10,
	},
	card: {
		width: '100%',
		padding: 14,
		borderRadius: 12,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.06,
		shadowRadius: 12,
		elevation: 4,
	},
	cardBg: { width: '100%', height: 140, justifyContent: 'flex-end' },
	cardOverlay: { flex: 1, justifyContent: 'space-between', padding: 12 },
	cardTop: {},
	cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	cardTitle: { fontWeight: '800', fontSize: 16, color: '#fff' },
	cardMeta: { color: '#fff', opacity: 0.9 },
});
