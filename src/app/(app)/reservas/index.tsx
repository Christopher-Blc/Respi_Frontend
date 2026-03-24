import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function ReservasScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Mis reservas' }} />
      <Text style={styles.title}>Reservas</Text>
      <Text style={styles.helper}>Aquí aparecerán tus reservas (placeholder).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  helper: {
    color: '#6b7280',
  },
});
