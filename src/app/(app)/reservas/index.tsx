import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text, Alert } from 'react-native';
import { Stack } from 'expo-router';
import ReservaCard from '../../../components/reservas/ReservaCard';
import { useReservas } from '../../../hooks/useReservas';

export default function ReservasScreen() {
  const { reservas, isLoading, isRefreshing, handleRefresh, formatDateEs, handleCancelReserva } = useReservas();

  const onCancel = (id: string) => {
    Alert.alert('Confirmar', '¿Cancelar reserva?', [
      { text: 'No' },
      { text: 'Sí', onPress: () => handleCancelReserva(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Mis reservas' }} />

      <FlatList
        data={reservas}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ReservaCard reserva={item} onCancel={onCancel} onEdit={() => Alert.alert('Editar', 'Funcionalidad pendiente')} />
        )}
        contentContainerStyle={reservas.length === 0 ? styles.emptyContainer : { padding: 12 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyTitle}>Aún no tienes reservas</Text>
            <Text style={styles.emptyText}>Cuando hagas una reserva, aparecerá aquí.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyWrapper: { alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#6b7280' },
});
