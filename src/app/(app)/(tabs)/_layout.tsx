import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../../context/ThemeContext';

export default function tabLayout() {
  const { isDarkMode, theme } = useAppTheme();

  return (
    <React.Fragment>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        animated
      />

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
          headerTitleAlign: 'center',
          headerTintColor: theme.headerText,

          headerTransparent: true,
          headerBackground: () => (
            <BlurView
              intensity={50} // Más intensidad para el efecto "cristal"
              tint={isDarkMode ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
              experimentalBlurMethod="none"
            />
          ),

          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: {
            position: 'absolute', // Permite que el contenido pase por detrás
            height: Platform.OS === 'web' ? 72 : 90,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'web' ? 10 : 6,
            backgroundColor: theme.primaryHeader,
            elevation: 0, // Quitamos sombra en Android
            borderColor: theme.primarySoft,
            borderWidth: 1,
          },

          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint={isDarkMode ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ),

          tabBarLabelStyle: {
            marginBottom: Platform.OS === 'web' ? 2 : 0,
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
    </React.Fragment>
  );
}
