import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { GlassTextButton } from '../../../components/login/glassTextButton';
import styles from '../../../style/reservations.styles';
import { useAuth } from '../../../context/AuthContext';

export default function tabLayout() {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };
  return (
    <React.Fragment>
      <StatusBar barStyle={'default'} animated={true} />

      <Tabs
        screenOptions={{
          headerRight: () => (
            <GlassTextButton
              text="Logout"
              style={styles.logoutButton}
              onPress={handleLogout}
              color="rgba(191, 4, 4, 0.27)"
              borderColor="#ffb8b8"
              borderWidth={1}
            />
          ),
          tabBarLabelPosition: 'below-icon',
          animation: 'fade',
          headerShown: true,
          headerTitleAlign: 'left',
          headerStyle: {
            height: 120,
          },

          tabBarStyle: {
            height: Platform.OS === 'web' ? 72 : 90,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'web' ? 10 : 6,
          },
          tabBarLabelStyle: {
            marginBottom: Platform.OS === 'web' ? 2 : 0,
          },
          tabBarActiveTintColor: '#CA8E0E',
          tabBarInactiveTintColor: 'gray',
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
              backgroundColor: '#CA8E0E',
              color: 'white',
            },
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Octicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="booking/createBooking"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="booking/index"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </React.Fragment>
  );
}
