import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform, ImageBackground, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { reservasService } from '../../../services/reservasService';
import { MODELOS, Modelo } from '../../../data/modelos';

export default function BookingDetails() {
  const params = useLocalSearchParams<{ modelId?: string }>();
  const modelId = params?.modelId;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [precioDia, setPrecioDia] = useState('10');
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date(Date.now() + 24 * 3600 * 1000));
  const [showPicker, setShowPicker] = useState<'inicio' | 'fin' | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<Modelo | null>(null);
  const [loadingModel, setLoadingModel] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await reservasService.getModelos();
        const found = remote.find((m) => String(m.id) === String(modelId));
        if (mounted && found) {
          setModel(found);
          setPrecioDia(String(found.price));
          return;
        }
      } catch (e) {
        // ignore
      }

      // fallback local
      const local = MODELOS.find((m) => m.id === String(modelId)) ?? MODELOS[0];
      if (mounted) {
        setModel(local);
        setPrecioDia(String(local.price));
      }
    })();
    return () => {
      mounted = false;
      setLoadingModel(false);
    };
  }, [modelId]);

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
        modeloId: Number(modelId ?? 0),
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

  if (!model) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator/></View>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Detalles de reserva' }} />

      <View style={styles.headerCard}>
        <ImageBackground source={model.img} style={styles.headerImage} imageStyle={{ borderRadius: 12 }}>
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)"]} style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>{model.title}</Text>
            <Text style={styles.headerSubtitle}>{model.price} €/día</Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Nombre (opcional)</Text>
        <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

        <Text style={styles.label}>Precio/día (€)</Text>
        <TextInput style={styles.input} value={precioDia} onChangeText={setPrecioDia} keyboardType="numeric" />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
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
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f8fafc' },
  headerCard: { height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  headerImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  headerOverlay: { padding: 16, justifyContent: 'flex-end' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
  headerSubtitle: { color: '#fff', fontSize: 14, marginTop: 4 },
  sectionLabel: { marginTop: 6, fontWeight: '700', color: '#111827' },
  formCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 6,
    borderLeftColor: '#CA8E0E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: { marginTop: 12, fontWeight: '600', color: '#111827' },
  input: { borderWidth: 1, borderColor: '#eef2f4', padding: 12, borderRadius: 10, marginTop: 6, backgroundColor: '#fbfdfe' },
  dateBtn: { padding: 12, borderWidth: 1, borderColor: '#eef2f4', borderRadius: 10, marginTop: 6, backgroundColor: '#fff' },
  submit: { marginTop: 20, backgroundColor: '#CA8E0E', padding: 14, borderRadius: 10, alignItems: 'center', shadowColor: '#CA8E0E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 2 },
  submitText: { color: '#fff', fontWeight: '700' },
});
