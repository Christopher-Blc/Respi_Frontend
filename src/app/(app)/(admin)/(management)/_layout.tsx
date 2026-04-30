import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
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
      }}
    >
      <Stack.Screen
        name="courts"
        options={{
          title: t('adminManageCourts'),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                  return;
                }

                router.replace('/(admin)');
              }}
              hitSlop={12}
              style={{ paddingHorizontal: 4, paddingVertical: 4 }}
            >
              <Octicons
                name="chevron-left"
                size={24}
                color={theme.headerText}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="court-types"
        options={{
          title: t('adminCourtTypes'),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                  return;
                }

                router.replace('/(admin)');
              }}
              hitSlop={12}
              style={{ paddingHorizontal: 4, paddingVertical: 4 }}
            >
              <Octicons
                name="chevron-left"
                size={24}
                color={theme.headerText}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
