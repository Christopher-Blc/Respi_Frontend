import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurViewCompat } from '../../../../components/general/BlurViewCompat';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import WebBurgerMenu, {
  BurgerNavItem,
} from '../../../../components/general/WebBurgerMenu';
import { RESPONSIVE_NAVIGATION_BREAKPOINT } from '../../../../constants';
import { WEB_ADMIN_HEADER_HEIGHT } from '../_layout';

export default function ManagementLayout() {
  const router = useRouter();
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWideScreen = width >= RESPONSIVE_NAVIGATION_BREAKPOINT;

  const handleBackPress = () => {
    router.replace('/(app)/(admin)/index');
  };

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.primaryHeader,
        },
        headerTintColor: theme.headerText,
        headerBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                height: WEB_ADMIN_HEADER_HEIGHT,
                backgroundColor: theme.primaryHeader,
                borderBottomColor: theme.primarySoft,
                borderBottomWidth: 1,
              },
            ]}
          >
            <BlurViewCompat
              intensity={50}
              tint={isDarkMode ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
              experimentalBlurMethod="none"
            />
          </View>
        ),
        headerLeft: () => {
          if (Platform.OS === 'web') {
            // On web small screens show the burger menu top-left; on wide screens keep null
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
                label: t('adminReviews'),
                route: '/(app)/(admin)/(management)/resenyas',
                icon: 'star',
                segment: 'resenyas',
              },
            ];

            return isWideScreen ? null : (
              <WebBurgerMenu navItems={adminBurgerNavItems} />
            );
          }

          return (
            <TouchableOpacity
              onPress={handleBackPress}
              hitSlop={12}
              style={{ paddingHorizontal: 4, paddingVertical: 4 }}
            >
              <Octicons
                name="chevron-left"
                size={24}
                color={theme.headerText}
              />
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('adminManagement'),
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="courts"
        options={{
          title: t('adminManageCourts'),
        }}
      />
      <Stack.Screen
        name="installations"
        options={{
          title: t('adminInstallations'),
        }}
      />
      <Stack.Screen
        name="court-types"
        options={{
          title: t('adminCourtTypes'),
        }}
      />
      <Stack.Screen name="resenyas" options={{ title: t('adminReviews') }} />
      <Stack.Screen name="usuarios" options={{ title: t('adminUsers') }} />
      <Stack.Screen
        name="membresias"
        options={{ title: t('adminMemberships') }}
      />
      <Stack.Screen
        name="notificaciones"
        options={{ title: 'Notificaciones' }}
      />
      <Stack.Screen
        name="reservas-global"
        options={{ title: t('tabsBookings') }}
      />
    </Stack>
  );
}
