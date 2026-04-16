import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Platform, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta sea correcta

export default function AppLayout() {
  const { signOut } = useAuth();
  const GOLD_COLOR = '#ffb71c';
  const APP_BG = '#FBF8F2';

  return (
    <Tabs
      screenOptions={{
        // --- HEADER ESTILO PREMIUM ---
        headerShown: true,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTransparent: false, // Sólido para que no se mezcle con el scroll si prefieres
        headerStyle: {
          height: Platform.OS === 'ios' ? 110 : 90,
          backgroundColor: APP_BG,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: '900',
          color: '#1A2F4B',
          letterSpacing: 0.5,
        },
        // ICONO IZQUIERDA (Avatar)
        headerLeft: () => (
          <TouchableOpacity style={styles.headerAvatar}>
            <Ionicons name="person-circle" size={32} color="#1A2F4B" />
          </TouchableOpacity>
        ),
        // ICONO DERECHA (Logout)
        headerRight: () => (
          <TouchableOpacity style={styles.headerLogout} onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color="#1A2F4B" />
          </TouchableOpacity>
        ),
        
        // --- CONFIGURACIÓN TAB BAR ---
        tabBarShowLabel: false,
        tabBarActiveTintColor: GOLD_COLOR,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'ResPi.',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reservas/index"
        options={{
          title: 'Reservas.',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={26} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />

      {/* Rutas ocultas */}
      <Tabs.Screen name="reservas/[id]" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="booking/index" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="booking/select" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="booking/details" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="preferences" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerAvatar: {
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogout: {
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 65,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 60,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ffb71c',
    shadowColor: '#ffb71c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});