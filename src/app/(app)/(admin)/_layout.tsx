import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../../context/ThemeContext'; // Ajusta la ruta según tu estructura

export default function AdminTabLayout() {
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
              intensity={50}
              tint={isDarkMode ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
              experimentalBlurMethod="none"
            />
          ),

          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: {
            position: 'absolute',
            height: Platform.OS === 'web' ? 72 : 90,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'web' ? 10 : 6,
            backgroundColor: theme.primaryHeader,
            elevation: 0,
            borderColor: theme.primarySoft,
            borderTopWidth: 1,
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
            href: null,
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}
