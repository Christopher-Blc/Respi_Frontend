import { Stack } from 'expo-router';
import { useAppTheme } from '../../../../context/ThemeContext';

export default function bookingLayout() {
  const { theme } = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },

        headerBackButtonMenuEnabled: false,
        headerLeft: () => null, // Elimina el botón de retroceso en la primera pantalla
      }}
    ></Stack>
  );
}
