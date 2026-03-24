import React, { useMemo } from 'react';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';

export default function AppLayout() {
  const ICON_SIZE = 26;

  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      headerTitleAlign: 'center' as const,
      tabBarStyle: { height: 64 },
      tabBarLabelStyle: { display: 'none' as const },
    }),
    []
  );

  // Si necesitas proteccion de rutas, aquí puedes hacer un redirect a login
  // por simplicidad dejamos acceso abierto.
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={ICON_SIZE} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="reservas/index"
          options={{
            title: 'Reservas',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={ICON_SIZE} color={color} />
            ),
          }}
        />

        {/* ocultas (rutas que no deben aparecer en la tab bar) */}
        <Tabs.Screen name="reservas/[id]" options={{ href: null }} />
      </Tabs>
    </>
  );
}
