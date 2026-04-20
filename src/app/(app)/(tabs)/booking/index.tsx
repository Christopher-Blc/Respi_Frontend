import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { reservasService } from '../../../../services/reservasService';
import { MODELOS, Modelo } from '../../../../data/modelos';

export default function BookingCreate() {
  const router = useRouter();
  const [modelos, setModelos] = useState<Modelo[]>(MODELOS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ms = await reservasService.getModelos();
        if (mounted && ms && Array.isArray(ms) && ms.length > 0) setModelos(ms);
      } catch (e) {
        // fallback already handled in service
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Nueva reserva' }} />

      <View style={styles.headerCard}>
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Reserva tu pista</Text>
          <Text style={styles.headerSubtitle}>Selecciona el deporte para continuar</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Elige un deporte</Text>

      <FlatList
        style={{ marginVertical: 8 }}
        data={modelos}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => {
          // safe fallback image if item.img is missing
          const imgSource = item.img ? item.img : require('../../../../../assets/RespiLogo.png');
          return (
            <TouchableOpacity
              style={styles.modelCard}
              onPress={() => router.push(`/(app)/booking/details?modelId=${item.id}`)}
            >
              <ImageBackground source={imgSource} style={styles.modelBg} imageStyle={styles.modelImageStyle}>
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.48)"]} style={styles.modelGradient}>
                  <View style={styles.modelTopRow}>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceTagText}>{item.price} €/h</Text>
                    </View>
                  </View>

                  <View style={styles.modelBottom}>
                    <Text style={styles.modelTitle}>{item.title}</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#fff" />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {loading && (
        <View style={styles.loadingOverlayList} pointerEvents="none">
          <ActivityIndicator size={36} color="#CA8E0E" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f8fafc' },
  headerCard: { height: 120, borderRadius: 12, overflow: 'hidden', marginBottom: 12, backgroundColor: '#CA8E0E', justifyContent: 'center' },
  headerOverlay: { position: 'absolute', left: 16, bottom: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#fff', fontSize: 13 },
  sectionLabel: { marginTop: 6, fontWeight: '700', color: '#111827' },
  modelCard: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  modelBg: { flex: 1, justifyContent: 'flex-end' },
  modelImageStyle: { borderRadius: 14 },
  modelGradient: { flex: 1, justifyContent: 'space-between', padding: 12 },
  modelTopRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  priceTag: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  priceTagText: { color: '#CA8E0E', fontWeight: '700' },
  modelBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  modelTitle: { fontWeight: '800', fontSize: 18, color: '#fff' },
  loadingOverlayList: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 20,
  },
});
