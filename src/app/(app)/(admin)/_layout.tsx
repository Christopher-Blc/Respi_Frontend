import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../../context/ThemeContext';
import WebSidebar, {
  SidebarSection,
} from '../../../components/general/WebSidebar';
import WebProfileBadge from '../../../components/general/WebProfileBadge';

const ADMIN_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: 'General',
    items: [
      {
        label: 'Info',
        route: '/(app)/(admin)/info',
        icon: 'graph',
        pathMatch: 'info',
      },
      {
        label: 'Perfil',
        route: '/(app)/(admin)/profile',
        icon: 'person',
        pathMatch: 'profile',
      },
    ],
  },
  {
    label: 'Administración',
    items: [
      {
        label: 'Gestión',
        icon: 'tools',
        pathMatch: 'gestion-parent',
        children: [
          {
            label: 'Pistas',
            route: '/(app)/(admin)/(management)/pistas',
            pathMatch: '/pistas',
          },
          {
            label: 'Tipos de Pista',
            route: '/(app)/(admin)/(management)/tipos_pista',
            pathMatch: 'tipos_pista',
          },
          {
            label: 'Usuarios',
            route: '/(app)/(admin)/usuarios',
            pathMatch: 'usuarios',
          },
          {
            label: 'Reservas',
            route: '/(app)/(admin)/reservas-global',
            pathMatch: 'reservas-global',
          },
          { label: 'Pagos', route: '/(app)/(admin)/pagos', pathMatch: 'pagos' },
          {
            label: 'Membresías',
            route: '/(app)/(admin)/membresias',
            pathMatch: 'membresias',
          },
          {
            label: 'Reseñas',
            route: '/(app)/(admin)/resenyas',
            pathMatch: 'resenyas',
          },
        ],
      },
    ],
  },
];

export default function AdminTabLayout() {
  const { isDarkMode, theme } = useAppTheme();

  const isWeb = Platform.OS === 'web';

  const tabs = (
    <Tabs
      screenOptions={{
        headerTitleContainerStyle: {
          paddingBottom: 10,
        },
        headerBackgroundContainerStyle: {
          backgroundColor: theme.primaryHeader,
          borderBottomColor: theme.primarySoft,
          borderBottomWidth: 1,
        },
        headerShown: true,
        headerTitleAlign: isWeb ? 'left' : 'center',
        headerTintColor: theme.headerText,
        headerTransparent: true,
        headerBackground: () => (
          <BlurView
            intensity={50}
            tint={isDarkMode ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod="none"
          />
        ),
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: isWeb
          ? { display: 'none' }
          : {
              position: 'absolute',
              height: 90,
              paddingTop: 6,
              paddingBottom: 6,
              backgroundColor: theme.primaryHeader,
              elevation: 0,
              borderColor: theme.primarySoft,
              borderTopWidth: 1,
            },
        headerRight: isWeb
          ? () => <WebProfileBadge profileRoute="/(app)/(admin)/profile" />
          : undefined,
        tabBarBackground: () => (
          <BlurView
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
          title: 'Gestión',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="tools" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="info"
        options={{
          title: 'Información',
          tabBarLabel: 'Info',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="graph" size={size} color={color} />
          ),
        }}
      />

      {/* TAB 3: PERFIL ADMIN */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(management)"
        options={{
          title: 'Gestión',
          headerShown: false,
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
      {isWeb ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <WebSidebar
            sections={ADMIN_SIDEBAR_SECTIONS}
            appName="RESPI"
            appSubtitle="Panel admin"
          />
          <View style={{ flex: 1 }}>{tabs}</View>
        </View>
      ) : (
        tabs
      )}
    </React.Fragment>
  );
}
