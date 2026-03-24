import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, Image, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import { reservasService } from '../../..//services/reservasService';

export default function BookingCreate() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [modeloId, setModeloId] = useState('1');
  const [precioDia, setPrecioDia] = useState('10');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date(Date.now() + 24 * 3600 * 1000));
  const [showPicker, setShowPicker] = useState<'inicio' | 'fin' | null>(null);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event: any, selected?: Date) => {
    setShowPicker(null as any);
    if (!selected) return;
    if (showPicker === 'inicio') setFechaInicio(selected);
    if (showPicker === 'fin') setFechaFin(selected);
  };

  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  const handleSubmit = async () => {
    if (!email) return Alert.alert('Error', 'Email requerido');
    if (fechaFin <= fechaInicio) return Alert.alert('Error', 'Fecha fin debe ser posterior');
    setLoading(true);
    try {
      const id = await reservasService.createReserva({
        usuarioId: 'local-uid',
        email,
        nombre,
        modeloId: Number(modeloId),
        precioDia: Number(precioDia),
        fechaInicio: formatDate(fechaInicio),
        fechaFin: formatDate(fechaFin),
        notas: '',
      });
      Alert.alert('Reserva creada', `ID: ${id}`);
      router.replace('/(app)/reservas');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudo crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  // modelos mock (en prod vendrán de API)
  const modelos = [
    { id: '1', title: 'Tenis', img: require('../../../../assets/fondo-tennis.png'), price: 12 },
    { id: '2', title: 'Pádel', img: require('../../../../assets/fondo-padel.png'), price: 15 },
    { id: '3', title: 'Fútbol', img: require('../../../../assets/fondo-futbol.png'), price: 20 },
    { id: '4', title: 'Baloncesto', img: require('../../../../assets/fondo-basket.png'), price: 10 },
  ];

  const selectedModel = modelos.find((m) => m.id === modeloId) ?? modelos[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Nueva reserva' }} />

      {/* Header card with image */}
      <View style={styles.headerCard}>
        <Image source={selectedModel.img} style={styles.headerImage} resizeMode="cover" />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Reserva tu pista</Text>
          <Text style={styles.headerSubtitle}>Selecciona modelo y fechas</Text>
        </View>
      </View>

      {/* Model selector */}
      <Text style={styles.sectionLabel}>Elige un deporte</Text>
      <FlatList
        style={{ marginVertical: 8 }}
        horizontal
        data={modelos}
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.modelCard, item.id === modeloId && styles.modelCardActive]}
            onPress={() => { setModeloId(item.id); setPrecioDia(String(item.price)); }}
          >
            <Image source={item.img} style={styles.modelImage} resizeMode="cover" />
            <Text style={styles.modelTitle}>{item.title}</Text>
            <Text style={styles.modelPrice}>{item.price} €/día</Text>
          </TouchableOpacity>
        )}
      />

      {/* Form card */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Nombre (opcional)</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

        <Text style={styles.label}>Precio/día (€)</Text>
        <TextInput style={styles.input} value={precioDia} onChangeText={setPrecioDia} keyboardType="numeric" />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Fecha inicio</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker('inicio')}>
              <Text>{formatDate(fechaInicio)}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Fecha fin</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => setShowPicker('fin')}>
              <Text>{formatDate(fechaFin)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showPicker && (
          <DateTimePicker
            value={showPicker === 'inicio' ? fechaInicio : fechaFin}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity style={[styles.submit, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? 'Creando...' : 'Crear reserva'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  headerCard: { height: 160, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  headerImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', left: 16, bottom: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#fff', fontSize: 13 },
  sectionLabel: { marginTop: 6, fontWeight: '700', color: '#111827' },
  modelCard: { width: 128, height: 140, borderRadius: 12, marginRight: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', padding: 8 },
  modelCardActive: { borderColor: '#4f46e5', shadowColor: '#4f46e5', shadowOpacity: 0.12, shadowRadius: 8 },
  modelImage: { width: '100%', height: 70, borderRadius: 8 },
  modelTitle: { marginTop: 8, fontWeight: '700', fontSize: 14 },
  modelPrice: { color: '#6b7280', fontSize: 12 },
  formCard: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' },
  label: { marginTop: 12, fontWeight: '600', color: '#111827' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 8, marginTop: 6, backgroundColor: '#fff' },
  dateBtn: { padding: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, marginTop: 6, backgroundColor: '#fff' },
  submit: { marginTop: 20, backgroundColor: '#4f46e5', padding: 14, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
});
