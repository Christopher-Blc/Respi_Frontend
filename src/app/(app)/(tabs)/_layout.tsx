import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { Icon, IconButton } from 'react-native-paper';

const unstable_settings = {
  initialRouteName: '(tabs)',
};
export default function tabLayout() {
  return (
    <React.Fragment>
      <StatusBar barStyle={'default'} animated={true} />

      <Tabs
        screenOptions={{
          // headerRight: () => null, //meter algun boton aqui?
          tabBarLabelPosition: 'below-icon',
          animation: 'fade',
          headerShown: true,
          headerTitleAlign: 'center',
          headerBackButtonDisplayMode: 'default',
          headerStyle: {
            height: 70,
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
            headerShown: false,
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
        {/* <Tabs.Screen
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
        /> */}
      </Tabs>
    </React.Fragment>
  );
}
