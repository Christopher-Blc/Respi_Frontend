// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import { lightModeSemanticTokens } from '../../theme';

//creo que este layout se puede elimuinar pero ns

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: lightModeSemanticTokens.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(admin)" />
    </Stack>
  );
}
