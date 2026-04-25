import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MODELOS, Modelo } from '../../../../data/modelos';
import { reservasService } from '../../../../services/reservasService';
import createReservationsStyles from '../../../../style/reservations.styles';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { API_PUBLIC_URL } from '../../../../constants';
import { AppTheme } from '../../../../theme';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);

const resolveImageSource = (img: Modelo['img']) => {
  if (typeof img === 'number') return img;
  if (typeof img === 'string') {
    return img.startsWith('http')
      ? { uri: img }
      : { uri: `${API_PUBLIC_URL}/${img.replace(/^\//, '')}` };
  }

  return img;
};

export default function PistaTypeIndex() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createReservationsStyles(theme), [theme]);
  const localStyles = useMemo(() => createLocalStyles(theme), [theme]);
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const remote = await reservasService.getModelos();
        if (mounted) {
          setModelos(remote.length ? remote : MODELOS);
        }
      } catch (error) {
        if (mounted) {
          setModelos(MODELOS);
        }
        console.error('Error al cargar deportes', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const renderModel = (item: Modelo) => (
    <TouchableOpacity
      key={item.id}
      style={[
        localStyles.catalogCard,
        { flexBasis: isWideScreen ? (width - 72) / 2 : '100%', flexGrow: 1 },
      ]}
      activeOpacity={0.9}
      onPress={() => router.push(`/reservas/createBooking?modelId=${item.id}`)}
    >
      <ImageBackground
        source={resolveImageSource(item.img)}
        style={localStyles.catalogCardBg}
        imageStyle={{ borderRadius: 18 }}
      >
        <LinearGradient
          colors={[
            theme.reservationsCardOverlayStart,
            theme.reservationsCardOverlayEnd,
          ]}
          style={localStyles.catalogCardOverlay}
        >
          <View style={localStyles.catalogHeaderRow}>
            <View style={localStyles.statusBadge}>
              <Text style={localStyles.statusText}>Disponible</Text>
            </View>
          </View>

          <View style={localStyles.catalogBottom}>
            <View>
              <Text style={localStyles.catalogTitle}>{item.title}</Text>
              <Text style={localStyles.catalogMeta}>
                Reserva online y confirma en segundos
              </Text>
            </View>
            <View style={localStyles.pricePill}>
              <Text style={localStyles.pricePillText}>
                {formatPrice(item.price)}/h
              </Text>
            </View>
          </View>

          <View style={localStyles.catalogFooter}>
            <Text style={localStyles.catalogCta}>Elegir deporte</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.onPrimary}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, localStyles.pageContainer]}>
      <Stack.Screen options={{ title: 'Reservas' }} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: headerHeight + 16 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: headerHeight + 18,
            paddingBottom: Platform.OS === 'web' ? 96 : 140,
          }}
        >
          <View style={localStyles.heroCard}>
            <View style={localStyles.heroTag}>
              <Text style={localStyles.heroTagText}>Reservas</Text>
            </View>
            <Text style={localStyles.heroTitle}>
              Elige tu deporte y reserva en minutos
            </Text>
            <Text style={localStyles.heroSubtitle}>
              Catálogo actualizado de pistas para una experiencia rápida, clara
              y profesional.
            </Text>
          </View>

          <View style={localStyles.sectionHeader}>
            <Text style={localStyles.sectionTitle}>Deportes disponibles</Text>
            <Text style={localStyles.sectionSubtitle}>
              Selecciona uno para empezar tu reserva
            </Text>
          </View>

          <View style={localStyles.gridContainer}>
            {(modelos.length ? modelos : MODELOS).map(renderModel)}
            {isWideScreen && <View style={localStyles.dummyCard} />}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const createLocalStyles = (theme: AppTheme) =>
  StyleSheet.create({
    pageContainer: {
      backgroundColor: theme.background,
    },
    heroCard: {
      borderRadius: 24,
      padding: 20,
      marginTop: 8,
      marginBottom: 20,
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.borderAccentSoft,
    },
    heroTag: {
      alignSelf: 'flex-start',
      backgroundColor: theme.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.borderAccentSoft,
    },
    heroTagText: {
      color: theme.primary,
      fontWeight: '800',
      fontSize: 12,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    heroTitle: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '900',
      color: theme.textTitle,
    },
    heroSubtitle: {
      marginTop: 10,
      fontSize: 15,
      lineHeight: 22,
      color: theme.textSubtitle,
    },
    statsRow: {
      marginTop: 18,
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    statCard: {
      flexGrow: 1,
      minWidth: 96,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 14,
      backgroundColor: theme.surfaceGlass,
      borderWidth: 1,
      borderColor: theme.borderSoft,
    },
    statValue: {
      color: theme.textTitle,
      fontSize: 18,
      fontWeight: '900',
    },
    statLabel: {
      marginTop: 4,
      color: theme.textSubtitle,
      fontSize: 12,
      fontWeight: '600',
    },
    sectionHeader: {
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.textTitle,
    },
    sectionSubtitle: {
      marginTop: 4,
      color: theme.textSubtitle,
      fontSize: 13,
      fontWeight: '500',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    dummyCard: {
      flexBasis: 320,
      flexGrow: 1,
      height: 0,
    },
    catalogCard: {
      minHeight: 220,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.borderAccentSoft,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 14,
      elevation: 5,
    },
    catalogCardBg: {
      flex: 1,
    },
    catalogCardOverlay: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 18,
    },
    catalogHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    statusBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },
    statusText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    catalogBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    catalogTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '900',
      textShadowColor: 'rgba(0,0,0,0.45)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 8,
    },
    catalogMeta: {
      marginTop: 6,
      color: 'rgba(255,255,255,0.84)',
      fontSize: 13,
      fontWeight: '500',
      maxWidth: 190,
    },
    pricePill: {
      backgroundColor: 'rgba(255,255,255,0.92)',
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    pricePillText: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '900',
    },
    catalogFooter: {
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    catalogCta: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 0.2,
    },
  });
