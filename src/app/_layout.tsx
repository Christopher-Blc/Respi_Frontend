import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useAppTheme } from '../context/ThemeContext';
import { PaperProvider } from 'react-native-paper';
import { buildPaperTheme } from '../theme';

function AuthNavigation() {
  const { userToken, isLoading, role } = useAuth();
  const { theme, isThemeReady, isDarkMode } = useAppTheme();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    //si no hay login lo mandamos al login
    if (!userToken) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
      return;
    }

    //si hay token se mira el rol y segun rol o se va a admin o a tabs que es el panel de clientes
    if (userToken) {
      if (inAuthGroup || segments.length === 0 || segments[0] === 'index') {
        const dest =
          role === 'SUPER_ADMIN' ? '/(app)/(admin)' : '/(app)/(tabs)';
        router.replace(dest);
        return;
      }

      // 3. PROTECCIÓN DE ROL (Aquí evitamos el error de segments[1])
      // Usamos segments.includes() para que no importe la posición y siempre verifique si tiene acceso a esa pantalla o no
      if (role === 'SUPER_ADMIN' && !segments.includes('(admin)')) {
        router.replace('/(app)/(admin)');
      } else if (role === 'CLIENTE' && !segments.includes('(tabs)')) {
        router.replace('/(app)/(tabs)');
      }
    }
  }, [userToken, isLoading, segments, role]);

  if (isLoading || !isThemeReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.backgroundMain,
        }}
      >
        <ActivityIndicator size="large" color={theme.primaryButton} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
      <Stack.Screen name="index" />
    </Stack>
  );
}

function AppProviders() {
  const { isDarkMode } = useAppTheme();
  const paperTheme = buildPaperTheme(isDarkMode);

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <AuthNavigation />
      </AuthProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppProviders />
    </ThemeProvider>
  );
}
