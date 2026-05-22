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
                label: t('tabsCourts'),
                route: '/(app)/(admin)/(management)/courts',
                icon: 'project',
                segment: 'courts',
              },
              {
                label: t('adminInstallations'),
                route: '/(app)/(admin)/(management)/installations',
                icon: 'organization',
                segment: 'installations',
              },
              {
                label: t('adminCourtTypes'),
                route: '/(app)/(admin)/(management)/court-types',
                icon: 'tag',
                segment: 'court-types',
              },
              {
                label: t('adminUsers'),
                route: '/(app)/(admin)/(management)/usuarios',
                icon: 'people',
                segment: 'usuarios',
              },
              {
                label: t('tabsBookings'),
                route: '/(app)/(admin)/(management)/reservas-global',
                icon: 'calendar',
                segment: 'reservas-global',
              },
              {
                label: 'Validar reserva',
                route: '/(app)/(admin)/(management)/validar-reserva',
                icon: 'verified',
                segment: 'validar-reserva',
              },
              {
                label: t('adminMemberships'),
                route: '/(app)/(admin)/(management)/membresias',
                icon: 'gift',
                segment: 'membresias',
              },
              {
                label: t('adminReviews'),
                route: '/(app)/(admin)/(management)/resenyas',
                icon: 'star',
                segment: 'resenyas',
              },
              {
                label: 'Notificaciones',
                route: '/(app)/(admin)/(management)/notificaciones',
                icon: 'bell',
                segment: 'notificaciones',
              },
            ];

            return isWideScreen ? null : (
              <WebBurgerMenu
                navItems={adminBurgerNavItems}
                navigationMode="replace"
              />
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
      <Stack.Screen
        name="validar-reserva"
        options={{ title: 'Validar reserva' }}
      />
    </Stack>
  );
}
