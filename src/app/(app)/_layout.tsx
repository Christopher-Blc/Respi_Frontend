// app/(app)/_layout.tsx
import { Stack } from 'expo-router';

//creo que este layout se puede elimuinar pero ns

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FAF7F0' },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
