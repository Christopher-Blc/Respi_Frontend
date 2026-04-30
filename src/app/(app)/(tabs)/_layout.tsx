import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter, useSegments } from 'expo-router';
import { useAppTheme } from '../../../context/ThemeContext';
import WebSidebar, {
  SidebarSection,
} from '../../../components/general/WebSidebar';
import WebProfileBadge from '../../../components/general/WebProfileBadge';

const WEB_SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    label: 'App',
    items: [
      { label: 'Inicio', route: '/(app)/(tabs)', icon: 'home', pathMatch: '/' },
      {
        label: 'Pistas',
        route: '/(app)/(tabs)/pistas',
        icon: 'location',
        pathMatch: 'pistas',
      },
      {
        label: 'Reservas',
        route: '/(app)/(tabs)/reservas',
        icon: 'calendar',
        pathMatch: 'reservas',
      },
      {
        label: 'Perfil',
        route: '/(app)/(tabs)/profile',
        icon: 'person',
        pathMatch: 'profile',
      },
    ],
  },
];

export default function tabLayout() {
  const { isDarkMode, theme } = useAppTheme();
  const router = useRouter();
  const segments = useSegments();

  const reservasSegmentIndex = segments.lastIndexOf('reservas');
  const isReservasNestedScreen =
    reservasSegmentIndex !== -1 && segments.length > reservasSegmentIndex + 1;

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
        headerRight: isWeb ? () => <WebProfileBadge /> : undefined,
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pistas"
        options={{
          title: 'Pistas',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="location" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Reservas',
          headerLeft: () => {
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

                  router.replace('/(app)/(tabs)/reservas');
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
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={size} color={color} />
          ),
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
            sections={WEB_SIDEBAR_SECTIONS}
            appName="RESPI"
            appSubtitle="Portal usuario"
          />
          <View style={{ flex: 1 }}>{tabs}</View>
        </View>
      ) : (
        tabs
      )}
    </React.Fragment>
  );
}
