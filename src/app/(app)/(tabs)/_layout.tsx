import { Tabs } from 'expo-router';
import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Octicons from '@expo/vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { BlurViewCompat } from '../../../components/general/BlurViewCompat';
import { useRouter, useSegments } from 'expo-router';
import { useAppTheme } from '../../../context/ThemeContext';
import WebSidebar, {
  SidebarSection,
} from '../../../components/general/WebSidebar';
import WebBurgerMenu, {
  BurgerNavItem,
} from '../../../components/general/WebBurgerMenu';
import WebProfileBadge from '../../../components/general/WebProfileBadge';
import { useTranslation } from 'react-i18next';
import { RESPONSIVE_NAVIGATION_BREAKPOINT } from '../../../constants';

export default function tabLayout() {
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const segments = useSegments();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width >= RESPONSIVE_NAVIGATION_BREAKPOINT;

  // Altura base del tab bar + safe area inferior (barra de navegación Android/iOS)
  const TAB_BAR_BASE_HEIGHT = 56;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  const webSidebarSections: SidebarSection[] = [
    {
      label: t('tabsSectionApp'),
      items: [
        {
          label: t('tabsHome'),
          route: '/(app)/(tabs)',
          icon: 'home',
          pathMatch: '/',
        },
        {
          label: t('tabsCourts'),
          route: '/(app)/(tabs)/courts',
          icon: 'location',
          pathMatch: 'courts',
        },
        {
          label: t('tabsBookings'),
          route: '/(app)/(tabs)/bookings',
          icon: 'calendar',
          pathMatch: 'bookings',
        },
        {
          label: t('tabsProfile'),
          route: '/(app)/(tabs)/profile',
          icon: 'person',
          pathMatch: 'profile',
        },
      ],
    },
  ];

  const webBurgerNavItems: BurgerNavItem[] = [
    {
      label: t('tabsHome'),
      route: '/(app)/(tabs)',
      icon: 'home',
      segment: 'index',
    },
    {
      label: t('tabsCourts'),
      route: '/(app)/(tabs)/courts',
      icon: 'location',
      segment: 'courts',
    },
    {
      label: t('tabsBookings'),
      route: '/(app)/(tabs)/bookings',
      icon: 'calendar',
      segment: 'bookings',
    },
    {
      label: t('tabsProfile'),
      route: '/(app)/(tabs)/profile',
      icon: 'person',
      segment: 'profile',
    },
  ];

  const bookingsSegmentIndex = segments.lastIndexOf('bookings');
  const isReservasNestedScreen =
    bookingsSegmentIndex !== -1 && segments.length > bookingsSegmentIndex + 1;

  const tabs = (
    <Tabs
      screenOptions={{
        headerTitleContainerStyle: {
          paddingBottom: 10,
        },
        // 1. CORRECCIÓN CLAVE: El contenedor del fondo DEBE ser transparente en Android
        headerBackgroundContainerStyle: {
          backgroundColor:
            Platform.OS === 'android' ? 'transparent' : theme.primaryHeader,
          borderBottomColor: theme.primarySoft,
          borderBottomWidth: 1,
        },
        headerShown: true,
        headerTitleAlign: isWideScreen ? 'left' : 'center',
        headerTintColor: theme.headerText,
        headerLeft:
          isWeb && !isWideScreen
            ? () => <WebBurgerMenu navItems={webBurgerNavItems} />
            : undefined,
        headerTransparent: true,

        // 2. CORRECCIÓN CLAVE: Pasamos el color de respaldo directamente al wrapper limpio
        headerBackground: () => (
          <BlurViewCompat
            intensity={50}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            // Dejamos que el componente decida internamente, quitamos el "none" forzado
            androidBackgroundColor={
              isDarkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.85)'
            }
          />
        ),

        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle:
          isWeb || isWideScreen
            ? { display: 'none' }
            : {
                position: 'absolute',
                height: tabBarHeight,
                paddingTop: 6,
                paddingBottom: insets.bottom + 4,
                // 3. CORRECCIÓN CLAVE: Si usas Blur en el TabBar, su fondo base debe ser transparente
                backgroundColor:
                  Platform.OS === 'android'
                    ? 'transparent'
                    : theme.primaryHeader,
                elevation: 0,
                borderColor: theme.primarySoft,
                borderTopWidth: 1,
              },
        headerRight: isWideScreen ? () => <WebProfileBadge /> : undefined,

        // 4. CORRECCIÓN CLAVE: Optimizamos también el TabBar inferior
        tabBarBackground: () => (
          <BlurViewCompat
            intensity={80}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            androidBackgroundColor={
              isDarkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.92)'
            }
          />
        ),
        tabBarLabelStyle: {
          marginBottom: 0,
        },
        animation: 'fade',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabsHome'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courts"
        options={{
          title: t('tabsCourts'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabsBookings'),
          headerLeft: () => {
            if (isWeb) {
              return <WebBurgerMenu navItems={webBurgerNavItems} />;
            }

            if (!isReservasNestedScreen) {
              return null;
            }

            return (
              <TouchableOpacity
                onPress={() => {
                  if (router.canGoBack()) {
                    router.back();
                    return;
                  }

                  router.replace('/(app)/(tabs)/bookings');
                }}
                style={{ marginLeft: 8, padding: 4 }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="arrow-back" size={22} color={theme.primary} />
              </TouchableOpacity>
            );
          },
          tabBarIcon: ({ color, size }) => (
            <Octicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarBadge: '1',
          tabBarBadgeStyle: {
            backgroundColor: theme.primary,
            color: theme.onPrimary,
          },
          title: t('tabsProfile'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications-history"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );

  return (
    <React.Fragment>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        animated
      />
      {isWideScreen ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <WebSidebar
            sections={webSidebarSections}
            appName="RESPI"
            appSubtitle={t('tabsUserPortal')}
          />
          <View style={{ flex: 1 }}>{tabs}</View>
        </View>
      ) : (
        tabs
      )}
    </React.Fragment>
  );
}
