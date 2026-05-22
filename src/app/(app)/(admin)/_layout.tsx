import { Tabs } from 'expo-router';
import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSegments } from 'expo-router';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurViewCompat } from '../../../components/general/BlurViewCompat';
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
import { useAdminRoleCheck } from '../../../hooks/admin/useAdminRoleCheck';
import { SessionExpiredModal } from '../../../components/alert.modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const WEB_ADMIN_HEADER_HEIGHT = 73;

export default function AdminTabLayout() {
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width >= RESPONSIVE_NAVIGATION_BREAKPOINT;

  // Verificar periódicamente si el usuario sigue siendo admin
  const { showExpiredModal, setShowExpiredModal } = useAdminRoleCheck();

  const TAB_BAR_BASE_HEIGHT = 56;
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + insets.bottom;

  const adminSidebarSections: SidebarSection[] = [
    {
      label: t('adminSectionGeneral'),
      items: [
        {
          label: 'Home',
          route: '/(app)/(admin)/index',
          icon: 'home',
          pathMatch: '/',
        },
        {
          label: t('adminInfo'),
          route: '/(app)/(admin)/info',
          icon: 'graph',
          pathMatch: 'info',
        },
        {
          label: t('tabsProfile'),
          route: '/(app)/(admin)/profile',
          icon: 'person',
          pathMatch: 'profile',
        },
      ],
    },
    {
      label: t('adminSectionAdministration'),
      items: [
        {
          label: t('tabsCourts'),
          route: '/(app)/(admin)/(management)/courts',
          icon: 'project',
          pathMatch: '/courts',
        },
        {
          label: t('adminInstallations'),
          route: '/(app)/(admin)/(management)/installations',
          icon: 'organization',
          pathMatch: 'installations',
        },
        {
          label: t('adminCourtTypes'),
          route: '/(app)/(admin)/(management)/court-types',
          icon: 'tag',
          pathMatch: 'court-types',
        },
        {
          label: t('adminUsers'),
          route: '/(app)/(admin)/(management)/usuarios',
          icon: 'people',
          pathMatch: 'usuarios',
        },
        {
          label: t('tabsBookings'),
          route: '/(app)/(admin)/(management)/reservas-global',
          icon: 'calendar',
          pathMatch: 'reservas-global',
        },
        {
          label: t('adminPayments'),
          route: '/(app)/(admin)/pagos',
          icon: 'credit-card',
          pathMatch: 'pagos',
        },
        {
          label: t('adminMemberships'),
          route: '/(app)/(admin)/membresias',
          icon: 'gift',
          pathMatch: 'membresias',
        },
        {
          label: t('adminReviews'),
          route: '/(app)/(admin)/(management)/resenyas',
          icon: 'star',
          pathMatch: 'resenyas',
        },
        {
          label: 'Notificaciones',
          route: '/(app)/(admin)/notificaciones',
          icon: 'bell',
          pathMatch: 'notificaciones',
        },
      ],
    },
  ];

  const adminBurgerNavItems: BurgerNavItem[] = [
    {
      label: 'Home',
      route: '/(app)/(admin)/index',
      icon: 'home',
      segment: 'index',
    },
    {
      label: t('adminInfo'),
      route: '/(app)/(admin)/info',
      icon: 'graph',
      segment: 'info',
    },
    {
      label: t('tabsProfile'),
      route: '/(app)/(admin)/profile',
      icon: 'person',
      segment: 'profile',
    },
    {
      label: t('tabsCourts'),
      route: '/(app)/(admin)/(management)/courts',
      icon: 'project',
      segment: 'courts',
    },
    {
      label: t('adminInstallations'),
      route: '/(app)/(admin)/(management)/installations',
      icon: 'organization',
      segment: 'installations',
    },
    {
      label: t('adminCourtTypes'),
      route: '/(app)/(admin)/(management)/court-types',
      icon: 'tag',
      segment: 'court-types',
    },
    {
      label: t('adminUsers'),
      route: '/(app)/(admin)/(management)/usuarios',
      icon: 'people',
      segment: 'usuarios',
    },
    {
      label: t('tabsBookings'),
      route: '/(app)/(admin)/(management)/reservas-global',
      icon: 'calendar',
      segment: 'reservas-global',
    },
    {
      label: 'Validar reserva',
      route: '/(app)/(admin)/(management)/validar-reserva',
      icon: 'verified',
      segment: 'validar-reserva',
    },
    {
      label: t('adminPayments'),
      route: '/(app)/(admin)/pagos',
      icon: 'credit-card',
      segment: 'pagos',
    },
    {
      label: t('adminMemberships'),
      route: '/(app)/(admin)/(management)/membresias',
      icon: 'gift',
      segment: 'membresias',
    },
    {
      label: t('adminReviews'),
      route: '/(app)/(admin)/(management)/resenyas',
      icon: 'star',
      segment: 'resenyas',
    },
    {
      label: 'Notificaciones',
      route: '/(app)/(admin)/(management)/notificaciones',
      icon: 'bell',
      segment: 'notificaciones',
    },
  ];

  const tabs = (
    <Tabs
      screenOptions={{
        headerTitleContainerStyle: isWideScreen
          ? {
              top: 0,
              bottom: 0,
            }
          : {
              paddingBottom: 10,
            },
        headerBackgroundContainerStyle: {
          backgroundColor: theme.primaryHeader,
          borderBottomColor: theme.primarySoft,
          borderBottomWidth: 1,
        },
        headerStyle: isWideScreen
          ? {
              height: WEB_ADMIN_HEADER_HEIGHT,
            }
          : undefined,
        headerShown: true,
        headerTitleAlign: isWideScreen ? 'left' : 'center',
        headerTintColor: theme.headerText,
        headerLeft: !isWideScreen
          ? () => (
              <WebBurgerMenu
                navItems={adminBurgerNavItems}
                navigationMode="replace"
              />
            )
          : undefined,
        headerTransparent: true,
        headerBackground: () => (
          <BlurViewCompat
            intensity={50}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod="none"
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
                backgroundColor: theme.primaryHeader,
                elevation: 0,
                borderColor: theme.primarySoft,
                borderTopWidth: 1,
              },
        headerRight: isWideScreen
          ? () => <WebProfileBadge profileRoute="/(app)/(admin)/profile" />
          : undefined,
        tabBarBackground: () => (
          <BlurViewCompat
            intensity={80}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          marginBottom: 0,
        },
        animation: 'fade',
      }}
    >
      {/* TAB 1: GESTIÓN GENERAL */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('adminManagement'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="tools" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="info"
        options={{
          title: t('adminInfo'),
          tabBarLabel: t('adminInfo'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="graph" size={size} color={color} />
          ),
        }}
      />

      {/* TAB 3: PERFIL ADMIN */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabsProfile'),
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="notificaciones"
        options={{
          title: 'Notificaciones',
          href: null,
        }}
      /> */}

      <Tabs.Screen
        name="(management)"
        options={{
          title: t('adminManagement'),
          href: null,
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
            sections={adminSidebarSections}
            appName="RESPI"
            appSubtitle={t('adminPanelSubtitle')}
            topAreaHeight={WEB_ADMIN_HEADER_HEIGHT}
          />
          <View style={{ flex: 1 }}>{tabs}</View>
        </View>
      ) : (
        tabs
      )}
      <SessionExpiredModal
        visible={showExpiredModal}
        title="Acceso revocado"
        message="Tu rol de administrador ha sido removido. Por favor inicia sesión nuevamente."
        confirmText="Entendido"
        onConfirm={() => setShowExpiredModal(false)}
      />
    </React.Fragment>
  );
}
