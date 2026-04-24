import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../../services/api';
import { TipoPista } from '../../../../types/types';
import { API_PUBLIC_URL } from '../../../../constants';
import { useAppTheme } from '../../../../context/ThemeContext';
import { AppTheme } from '../../../../theme';
import { useHeaderHeight } from '@react-navigation/elements';

export default function PistaTypeIndex() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const [modelos, setModelos] = useState<TipoPista[]>([]);
  const [loading, setLoading] = useState(true);
  const headerHeight = useHeaderHeight();

  // 1. Detectar el ancho de la pantalla
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

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
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: headerHeight + 10,
        },
      ]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Platform.OS === 'web' ? 96 : 140 },
      ]}
    >
      <Tabs.Screen options={{ title: 'Nueva reserva' }} />

      {/* Header Naranja que ocupa todo el ancho */}
      <View style={styles.headerCard}>
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.onPrimary}
            />
            {'  '}Reserva tu pista
          </Text>
          <Text style={styles.headerSubtitle}>
            Selecciona el deporte para continuar
          </Text>
        </View>
      </View>

      {/* GRID ELÁSTICO: Se estira para llenar la pantalla */}
      <View style={styles.gridContainer}>
        {modelos.map((item) => {
          const imgSource = item.imagen
            ? { uri: `${API_PUBLIC_URL}/${item.imagen}` }
            : require('../../../../../assets/RespiLogo.png');

          return (
            <TouchableOpacity
              key={item.tipo_pista_id}
              // flexBasis: 300 en web significa "mide al menos 300px"
              // flexGrow: 1 hace que se estiren para rellenar el hueco blanco
              style={[
                styles.modelCard,
                { flexBasis: isWeb ? 320 : '100%', flexGrow: 1 },
              ]}
              activeOpacity={0.8}
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
                resizeMode="cover"
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
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
                      name="chevron-forward-circle"
                      size={26}
                      color={theme.onPrimary}
                    />
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}

        {/* TRUCO PARA WEB: 
            Añadimos varios Views invisibles para que si la última fila tiene 
            menos elementos, no se estiren de forma desproporcionada. 
        */}
        {isWeb && <View style={styles.dummyCard} />}
        {isWeb && <View style={styles.dummyCard} />}
        {isWeb && <View style={styles.dummyCard} />}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },
    headerCard: {
      marginTop: 16,
      height: 80,
      borderRadius: 14,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      marginBottom: 20,
      width: '100%',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: { elevation: 3 },
      }),
    },
    headerOverlay: { paddingHorizontal: 20 },
    headerTitle: {
      color: theme.onPrimary,
      fontSize: 22,
      fontWeight: '900',
    },
    headerSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },

    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      width: '100%',
    },

    modelCard: {
      height: 220, // Un poco más alto para que luzca en web
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: '#1e293b',
      borderWidth: 1,
      borderColor: theme.borderSoft,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        android: { elevation: 5 },
      }),
    },

    // Estilo para las tarjetas invisibles que rellenan el hueco
    dummyCard: {
      flexBasis: 320,
      flexGrow: 1,
      height: 0, // No ocupan espacio vertical
      marginHorizontal: 0,
    },

    modelBg: { flex: 1 },
    modelImageStyle: { borderRadius: 18 },
    modelGradient: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 18,
    },
    modelTopRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    priceTag: {
      backgroundColor: theme.surface,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 20,
    },
    priceTagText: {
      color: theme.primary,
      fontWeight: '800',
      fontSize: 12,
    },
    modelBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modelTitle: {
      fontWeight: '900',
      fontSize: 24,
      color: theme.onPrimary,
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
    },
    loadingContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
  });
