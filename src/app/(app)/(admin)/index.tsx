import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../../style/admin/home.styles';
import { useProfile } from '../../../hooks/useProfile';

export default function AdminManagementScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useProfile();

  const horizontalPadding = width >= 1280 ? 40 : width >= 768 ? 28 : 20;
  const gridGap = 16;
  const maxPaddingWidth = 1400;
  const contentWidth = width > maxPaddingWidth ? maxPaddingWidth : width;
  const availableGridWidth = Math.max(contentWidth - horizontalPadding * 2, 0);

  // Responsive columns: 1 mobile, 2 tablet, 3 desktop
  let columnsCount = 1;
  if (width >= 1024) columnsCount = 3;
  else if (width >= 768) columnsCount = 2;

  const columnWidth =
    (availableGridWidth - gridGap * (columnsCount - 1)) / columnsCount;
  const cardFlexBasis = columnWidth;

  const adminOptions = [
    {
      title: 'Pistas',
      subtitle:
        'Crea, edita y elimina pistas deportivas disponibles en el centro.',
      icon: 'stadium-variant',
      route: '/(admin)/(management)/pistas',
      color: '#4CAF50',
      cta: 'Gestionar pistas',
    },
    {
      title: 'Tipos de Pista',
      subtitle:
        'Gestiona los tipos de pista disponibles: tenis, pádel, fútbol y más.',
      icon: 'shape',
      route: '/(admin)/(management)/tipos_pista',
      color: '#00BCD4',
      cta: 'Gestionar tipos',
    },
    {
      title: 'Usuarios',
      subtitle:
        'Consulta perfiles, cambia roles y gestiona el acceso de cada usuario.',
      icon: 'account-group',
      route: '/(admin)/usuarios',
      color: '#2196F3',
      cta: 'Ver usuarios',
    },
    {
      title: 'Reservas',
      subtitle:
        'Visualiza y controla todas las reservas activas y pasadas del centro.',
      icon: 'calendar-check',
      route: '/(admin)/reservas-global',
      color: '#FF9800',
      cta: 'Revisar reservas',
    },
    {
      title: 'Pagos',
      subtitle:
        'Revisa el historial de cobros y el estado de cada transacción.',
      icon: 'currency-eur',
      route: '/(admin)/pagos',
      color: '#E91E63',
      cta: 'Abrir pagos',
    },
    {
      title: 'Membresías',
      subtitle:
        'Ajusta los planes, precios y beneficios de cada tipo de membresía.',
      icon: 'card-account-details',
      route: '/(admin)/membresias',
      color: '#9C27B0',
      cta: 'Editar planes',
    },
    {
      title: 'Reseñas',
      subtitle: 'Modera los comentarios y valoraciones que dejan los usuarios.',
      icon: 'star-circle',
      route: '/(admin)/resenyas',
      color: '#FBC02D',
      cta: 'Moderar reseñas',
    },
    {
      title: 'test',
      subtitle: 'testtest.',
      icon: 'star-circle',
      route: '/(admin)/resenyas',
      color: '#83651b',
      cta: 'Moderar reseñas',
    },
  ];

  const renderAdminCard = (item: (typeof adminOptions)[0]) => (
    <TouchableOpacity
      key={item.title}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderAccentSoft,
          flexBasis: cardFlexBasis,
          flexGrow: 1,
        },
      ]}
      activeOpacity={0.92}
      onPress={() => router.push(item.route as any)}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.color + '20',
              borderColor: item.color + '35',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={28}
            color={item.color}
          />
        </View>

        <View
          style={[styles.statusIndicator, { backgroundColor: item.color }]}
        />
      </View>

      <View style={styles.cardInfo}>
        <Text style={[styles.cardTitle, { color: theme.textTitle }]}>
          {item.title}
        </Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSubtitle }]}>
          {item.subtitle}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={[styles.cardCta, { color: theme.primary }]}>
          {item.cta}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.primary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.pageContainer, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 100 : 120),
          paddingHorizontal: horizontalPadding,
          width: '100%',
        }}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderAccentSoft,
            },
          ]}
        >
          <View
            style={[styles.heroTag, { borderColor: theme.borderAccentSoft }]}
          >
            <Text style={[styles.heroTagText, { color: theme.primary }]}>
              Panel admin
            </Text>
          </View>

          <Text style={[styles.heroTitle, { color: theme.textTitle }]}>
            Bienvenido {user?.username}
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSubtitle }]}>
            Desde aquí tienes acceso a todos los flujos de gestión de ResPi®.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textTitle }]}>
            Herramientas disponibles
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSubtitle }]}>
            Cada bloque abre un flujo distinto con más espacio horizontal para
            leer y escanear mejor en escritorio.
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {adminOptions.map(renderAdminCard)}
          {columnsCount === 3 && adminOptions.length % 3 !== 0 && (
            <View style={{ flexBasis: cardFlexBasis, flexGrow: 1 }} />
          )}
          {columnsCount === 2 && adminOptions.length % 2 !== 0 && (
            <View style={{ flexBasis: cardFlexBasis, flexGrow: 1 }} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
