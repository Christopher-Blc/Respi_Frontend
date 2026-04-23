// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';

//creo que este layout se puede elimuinar pero ns

export default function AppLayout() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
