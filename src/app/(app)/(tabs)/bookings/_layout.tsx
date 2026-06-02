import { Stack } from 'expo-router';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function bookingLayout() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.textTitle,
        headerBackButtonMenuEnabled: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="createBooking"
        options={{ title: t('bookingLayoutCreateTitle') }}
      />
      <Stack.Screen
        name="confirmation"
        options={{ headerShown: false, title: t('bookingLayoutConfirmTitle') }}
      />
      <Stack.Screen
        name="courtTypes"
        options={{ title: t('bookingLayoutCourtTypesTitle') }}
      />
    </Stack>
  );
}
