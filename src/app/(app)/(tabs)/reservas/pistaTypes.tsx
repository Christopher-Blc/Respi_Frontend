import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../../services/api';
import { TipoPista } from '../../../../types/types';

export default function PistaTypeIndex() {
  const router = useRouter();
  const [modelos, setModelos] = useState<TipoPista[]>([]);
  const [loading, setLoading] = useState(true);

  //guardamos el ancho de la pantalla
  const { width } = useWindowDimensions();
  const isWeb = width > 768; //cuando la pantalla llega a ese ancho , las cards se ponen en modo grid

  // 3. Calculamos el número de columnas y el ancho dinámico
  const numColumns = isWeb ? 3 : 1;
  // Ajustamos el margen para que no toquen los bordes en el grid
  const cardWidth = isWeb ? (width - 64) / numColumns : '100%';

  const imageSelector = (sportType: string) => {
    const type = sportType.toLowerCase();
    if (type.includes('tenis'))
      return require('../../../../../assets/fondo-tennis.png');
    if (type.includes('padel'))
      return require('../../../../../assets/fondo-padel.png');
    if (type.includes('futbol'))
      return require('../../../../../assets/fondo-futbol.png');
    if (type.includes('basket'))
      return require('../../../../../assets/fondo-basket.png');
    return require('../../../../../assets/fondo-tennis.png');
  };

  const fetchTipos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tipo_pista');
      setModelos(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return (
    <View style={styles.container}>
      <Tabs.Screen options={{ title: 'Nueva reserva' }} />

      <View style={styles.headerCard}>
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#fff"
            />{' '}
            Reserva tu pista
          </Text>
          <Text style={styles.headerSubtitle}>
            Selecciona el deporte para continuar
          </Text>
        </View>
      </View>

      <FlatList
        // 4. Clave importante: key cambia si cambia numColumns para forzar el re-render
        key={isWeb ? 'grid' : 'list'}
        style={{ marginVertical: 8 }}
        data={modelos}
        numColumns={numColumns} // 5. Aplicamos las columnas
        keyExtractor={(i) => String(i.tipo_pista_id)}
        renderItem={({ item }) => {
          const imgSource: ImageSourcePropType = imageSelector(item.nombre);
          return (
            <TouchableOpacity
              // 6. Aplicamos el ancho dinámico aquí
              style={[
                styles.modelCard,
                { width: isWeb ? width / numColumns - 32 : '100%' },
              ]}
              onPress={() =>
                router.push(
                  `/(app)/booking/details?modelId=${item.tipo_pista_id}`,
                )
              }
            >
              <ImageBackground
                source={imgSource}
                style={styles.modelBg}
                imageStyle={styles.modelImageStyle}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.48)']}
                  style={styles.modelGradient}
                >
                  <View style={styles.modelTopRow}>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceTagText}>desde €/h</Text>
                    </View>
                  </View>
                  <View style={styles.modelBottom}>
                    <Text style={styles.modelTitle}>{item.nombre}</Text>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={20}
                      color="#fff"
                    />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
        // Ajustamos los espacios entre cards en modo grid
        columnWrapperStyle={isWeb ? { gap: 16 } : null}
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
  headerCard: {
    marginTop: 16, // Corregido de top: 16
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#CA8E0E',
    justifyContent: 'center',
  },
  headerOverlay: { paddingHorizontal: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#fff', fontSize: 13 },
  modelCard: {
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 4,
  },
  modelBg: { flex: 1, justifyContent: 'flex-end' },
  modelImageStyle: { borderRadius: 14 },
  modelGradient: { flex: 1, justifyContent: 'space-between', padding: 12 },
  modelTopRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  priceTag: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priceTagText: { color: '#CA8E0E', fontWeight: '700' },
  modelBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  modelTitle: { fontWeight: '800', fontSize: 18, color: '#fff' },
  loadingOverlayList: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
