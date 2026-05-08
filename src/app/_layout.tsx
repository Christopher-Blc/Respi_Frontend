import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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

function AuthNavigation() {
  const { userToken, isLoading, role } = useAuth();
  const { theme, isThemeReady, isDarkMode } = useAppTheme();
  const segments = useSegments() as string[];
  const router = useRouter();
  const hasRegisteredPushTokenRef = useRef(false);

  useEffect(() => {
    if (!userToken) {
      hasRegisteredPushTokenRef.current = false;
    }
  }, [userToken]);

  useEffect(() => {
    if (!userToken || hasRegisteredPushTokenRef.current) {
      return;
    }

    hasRegisteredPushTokenRef.current = true;

    const registerPushToken = async () => {
      try {
        const result = await requestPushPermissionsAndToken();

        if (!result.granted || !result.token) {
          return;
        }

        try {
          await api.patch('/users/push-token', { expoPushToken: result.token });
        } catch {
          await api.post('/users/push-token', { expoPushToken: result.token });
        }
      } catch (error) {
        console.log('error al hacer push/patch del notification token', error);
        // Silent fail to avoid interrupting user experience.
      }
    };

    void registerPushToken();
  }, [userToken]);

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
      .catch((error) => {
        console.error('Error initializing i18n', error);
      })
      .finally(() => {
        if (mounted) {
          setIsI18nReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setupNotificationChannelAndroid().catch((error) => {
      console.error('Error configuring notification channel', error);
    });

    notificationListener.current = addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received', notification.request.identifier);
      },
    );

    responseListener.current = addNotificationResponseListener((response) => {
      console.log(
        'Notification response',
        response.notification.request.identifier,
      );

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
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
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
  return (
    <ThemeProvider>
      <AppProviders />
    </ThemeProvider>
  );
}
