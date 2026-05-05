import React from 'react';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function ManagementLayout() {
  const router = useRouter();
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();

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
                backgroundColor: theme.primaryHeader,
                borderBottomColor: theme.primarySoft,
                borderBottomWidth: 1,
              },
            ]}
          >
            <BlurView
              intensity={50}
              tint={isDarkMode ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
              experimentalBlurMethod="none"
            />
          </View>
        ),
        headerLeft: () => {
          if (Platform.OS === 'web') return null;
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
      <Stack.Screen name="usuarios" options={{ title: t('adminUsers') }} />
      <Stack.Screen
        name="membresias"
        options={{ title: t('adminMemberships') }}
      />
      <Stack.Screen
        name="notificaciones"
        options={{ title: 'Notificaciones' }}
      />
    </Stack>
  );
}
