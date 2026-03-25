import React from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
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

	const renderReservation = ({ item }: { item: Reservation }) => (
		<View style={styles.card}>
			<Text style={styles.cardTitle}>{item.title}</Text>
			<Text style={styles.cardMeta}>{item.date} • {item.time}</Text>
		</View>
	);

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
		padding: 20,
		backgroundColor: '#f9fafb',
		minHeight: '100%'
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
		paddingVertical: 14,
		borderRadius: 10,
		alignItems: 'center',
		marginHorizontal: 6,
	},
	primary: {
		backgroundColor: '#4f46e5',
	},
	secondary: {
		backgroundColor: '#06b6d4',
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
		backgroundColor: '#fff',
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#e5e7eb',
	},
	cardTitle: {
		fontWeight: '700',
	},
	cardMeta: {
		color: '#6b7280',
		marginTop: 4,
	},
});
