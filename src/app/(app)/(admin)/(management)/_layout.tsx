import React from 'react';
import { Stack } from 'expo-router/stack';
import { useTranslation } from 'react-i18next';

export default function ManagementLayout() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('adminManagement'),
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
      {/* <Stack.Screen
        name="notificaciones"
        options={{ title: 'Notificaciones' }}
      /> */}
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
