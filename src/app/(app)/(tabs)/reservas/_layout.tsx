import { Stack } from 'expo-router';
import { useAppTheme } from '../../../../context/ThemeContext';

export default function bookingLayout() {
  const { theme } = useAppTheme();
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
      <Stack.Screen name="createBooking" options={{ title: 'Nueva reserva' }} />
      <Stack.Screen
        name="confirmacion"
        options={{ title: 'Confirmar reserva' }}
      />
      <Stack.Screen name="pistaTypes" options={{ title: 'Tipos de pista' }} />
    </Stack>
  );
}
