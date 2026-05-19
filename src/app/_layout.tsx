import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider, useAppTheme } from '../context/ThemeContext';
import { PaperProvider } from 'react-native-paper';
import { buildPaperTheme } from '../theme';
import { setupI18n } from '../i18n';
import * as Notifications from 'expo-notifications';
import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  removeNotificationSubscription,
  requestPushPermissionsAndToken,
  setupNotificationChannelAndroid,
} from '../services/notificationsService';
import api from '../services/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';

/**
 * Este componente se encarga de que la web se vea como una App nativa.
 * Inyecta el CSS necesario y configura el viewport para iOS/Android.
 */
function WebStyleHandler() {
  const { theme, isDarkMode } = useAppTheme(); // Sacamos isDarkMode para forzar el update

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    // 1. Actualizar el color de la barra de estado del sistema (iOS/Android)
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }
    // Esto cambia el color de la interfaz del navegador al vuelo
    themeColorMeta.setAttribute('content', theme.backgroundMain);

    // 2. Inyección de CSS (Ahora con dependencia real)
    let styleTag = document.getElementById('respi-web-root-reset');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'respi-web-root-reset';
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      html, body, #root {
        background-color: ${theme.backgroundMain} !important; 
        transition: background-color 0.3s ease-in-out; /* Suaviza el cambio de color */
      }
      /* Forzar que el fondo del documento sea el del tema */
      :root {
        color-scheme: ${isDarkMode ? 'dark' : 'light'};
      }
    `;
  }, [theme.backgroundMain, isDarkMode]); // <--- CRUCIAL: Escucha estos cambios

  return null;
}

function AuthNavigation() {
  const { userToken, isLoading, role } = useAuth();
  const { theme, isThemeReady } = useAppTheme();
  const segments = useSegments() as string[];
  const router = useRouter();
  const hasRegisteredPushTokenRef = useRef(false);

  useEffect(() => {
    if (!userToken) {
      hasRegisteredPushTokenRef.current = false;
    }
  }, [userToken]);

  useEffect(() => {
    if (!userToken || hasRegisteredPushTokenRef.current) return;

    hasRegisteredPushTokenRef.current = true;

    const registerPushToken = async () => {
      try {
        const result = await requestPushPermissionsAndToken();
        if (!result.granted || !result.token) return;

        try {
          await api.patch('/users/push-token', { expoPushToken: result.token });
        } catch {
          await api.post('/users/push-token', { expoPushToken: result.token });
        }
      } catch (error) {
        console.log('error al hacer push/patch del notification token', error);
      }
    };

    void registerPushToken();
  }, [userToken]);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!userToken) {
      if (!inAuthGroup) router.replace('/(auth)/login');
      return;
    }

    if (userToken) {
      if (inAuthGroup || segments.length === 0 || segments[0] === 'index') {
        const dest =
          role === 'SUPER_ADMIN' ? '/(app)/(admin)' : '/(app)/(tabs)';
        router.replace(dest);
        return;
      }

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
    <View style={{ flex: 1, backgroundColor: theme.backgroundMain }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}

function AppProviders() {
  const { isDarkMode, themePalette } = useAppTheme();
  const [isI18nReady, setIsI18nReady] = useState(false);
  const paperTheme = buildPaperTheme(isDarkMode, themePalette);
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    let mounted = true;
    setupI18n()
      .catch((error) => console.error('Error initializing i18n', error))
      .finally(() => {
        if (mounted) setIsI18nReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setupNotificationChannelAndroid().catch(console.error);

    notificationListener.current = addNotificationReceivedListener(() => {});
    responseListener.current = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data as
        | { screen?: string }
        | undefined;
      if (typeof data?.screen === 'string' && data.screen.length > 0) {
        router.push(data.screen as any);
        return;
      }
      router.push('/(app)/(admin)/notificaciones');
    });

    return () => {
      removeNotificationSubscription(notificationListener.current);
      removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isI18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <AuthProvider>
        <AuthNavigation />
      </AuthProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  const content = (
    <ThemeProvider>
      <WebStyleHandler />
      <SafeAreaProvider>
        <AppProviders />
      </SafeAreaProvider>
    </ThemeProvider>
  );

  if (Platform.OS !== 'android') return content;

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY ?? ''}
      merchantIdentifier="merchant.com.respiteam.ResPi"
    >
      {content}
    </StripeProvider>
  );
}
