import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { useAppTheme } from '../../../context/ThemeContext';

const unstable_settings = {
  initialRouteName: '(tabs)',
};
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
          // headerRight: () => null, //meter algun boton aqui?
          tabBarLabelPosition: 'below-icon',
          animation: 'fade',
          headerShown: true,
          headerTitleAlign: 'center',
          headerBackButtonDisplayMode: 'default',
          // headerStyle: {
          //   height: 70,
          // },

          tabBarLabelStyle: {
            marginBottom: Platform.OS === 'web' ? 2 : 0,
          },
          tabBarActiveTintColor: theme.tabActive,
          tabBarInactiveTintColor: theme.tabInactive,
          tabBarStyle: {
            height: Platform.OS === 'web' ? 72 : 90,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'web' ? 10 : 6,
            backgroundColor: theme.tabBackground,
            borderTopColor: theme.borderDefault,
          },
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.headerText,
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
              backgroundColor: theme.primary,
              color: theme.onPrimary,
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
