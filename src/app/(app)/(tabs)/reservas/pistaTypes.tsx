import React from 'react';
import {
  View,
  Text,
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
import { API_PUBLIC_URL } from '../../../../constants';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { usePistaTypes } from '../../../../hooks/usePistaTypes';
import createPistaTypesStyles from '../../../../style/pistaTypes.styles';

export default function PistaTypeIndex() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createPistaTypesStyles(theme), [theme]);
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 768;
  const { modelos, loading, getCardDescription } = usePistaTypes();

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

      <View style={styles.headerCard}>
        <LinearGradient
          colors={[
            theme.reservationsCardOverlayStart,
            theme.reservationsCardOverlayEnd,
          ]}
          style={styles.headerGradient}
        >
          <View style={styles.headerTopRow}>
            <View style={styles.headerIconBadge}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={theme.onPrimary}
              />
            </View>
            <Text style={styles.headerKicker}>NUEVA RESERVA</Text>
          </View>

          <Text style={styles.headerTitle}>Reserva tu pista ideal</Text>
          <Text style={styles.headerSubtitle}>
            Selecciona un deporte y consulta disponibilidad al instante.
          </Text>

          <View style={styles.headerMetaRow}>
            <View style={styles.headerMetaChip}>
              <Ionicons
                name="tennisball-outline"
                size={14}
                color={theme.onPrimary}
              />
              <Text style={styles.headerMetaText}>{modelos.length} deportes</Text>
            </View>
            <View style={styles.headerMetaChip}>
              <Ionicons name="flash-outline" size={14} color={theme.onPrimary} />
              <Text style={styles.headerMetaText}>Reserva en segundos</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.gridContainer}>
        {modelos.map((item) => {
          const imgSource = item.imagen
            ? { uri: `${API_PUBLIC_URL}/${item.imagen}` }
            : require('../../../../../assets/RespiLogo.png');
          const description = getCardDescription(item);

          return (
            <TouchableOpacity
              key={item.tipo_pista_id}
              style={[
                styles.modelCard,
                { flexBasis: isWideScreen ? 320 : '100%', flexGrow: 1 },
              ]}
              activeOpacity={0.8}
              onPress={() =>
                router.push(`/(app)/booking/details?modelId=${item.tipo_pista_id}`)
              }
            >
              <ImageBackground
                source={imgSource}
                style={styles.modelBg}
                imageStyle={styles.modelImageStyle}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={[
                    theme.reservationsCardOverlayStart,
                    theme.reservationsCardOverlayEnd,
                  ]}
                  style={styles.modelGradient}
                >
                  <View style={styles.modelTopRow}>
                    <View style={styles.availableBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={14}
                        color={theme.success}
                      />
                      <Text style={styles.availableBadgeText}>Disponible</Text>
                    </View>
                    <View style={styles.priceTag}>
                      <Text style={styles.priceTagText}>desde EUR/h</Text>
                    </View>
                  </View>

                  <View style={styles.modelBottomPanel}>
                    <View style={styles.modelBottom}>
                      <View style={styles.modelInfoWrap}>
                        <Text style={styles.modelTitle}>{item.nombre}</Text>
                        <Text style={styles.modelDescription} numberOfLines={3}>
                          {description}
                        </Text>
                      </View>

                      <View style={styles.modelMetaRow}>
                        <View style={styles.modelMetaChip}>
                          <Ionicons
                            name="calendar-outline"
                            size={13}
                            color={theme.onPrimary}
                          />
                          <Text style={styles.modelMetaText}>
                            Disponibilidad diaria
                          </Text>
                        </View>
                        <View style={styles.modelMetaChip}>
                          <Ionicons
                            name="flash-outline"
                            size={13}
                            color={theme.onPrimary}
                          />
                          <Text style={styles.modelMetaText}>Reserva inmediata</Text>
                        </View>
                      </View>

                      <View style={styles.modelCtaPill}>
                        <Text style={styles.modelCtaText}>Ver pistas</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.onPrimary}
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}

        {isWideScreen && <View style={styles.dummyCard} />}
        {isWideScreen && <View style={styles.dummyCard} />}
        {isWideScreen && <View style={styles.dummyCard} />}
      </View>

      {!loading && modelos.length === 0 && (
        <View style={styles.emptyStateCard}>
          <Ionicons name="layers-outline" size={30} color={theme.textMuted} />
          <Text style={styles.emptyStateTitle}>No hay deportes disponibles</Text>
          <Text style={styles.emptyStateText}>
            Vuelve a intentarlo en unos segundos.
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Cargando deportes...</Text>
        </View>
      )}
    </ScrollView>
  );
}
