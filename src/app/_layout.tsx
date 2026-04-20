import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

function AuthNavigation() {
  const { userToken, isLoading, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // segments[0] suele ser el nombre del grupo entre paréntesis
    const inAppGroup = segments[0] === '(app)';
    const inAuthGroup = segments[0] === '(auth)';

    // 1. SI NO HAY TOKEN: Mandar a login si intenta entrar a cualquier sitio que no sea auth
    if (!userToken) {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
      return; // Detenemos aquí si no hay usuario
    }

    // 2. SI HAY TOKEN (YA ESTÁ LOGUEADO)
    if (userToken) {
      // Si el rol es Admin (Asegúrate de que coincida con tu JWT: 'SUPER_ADMIN')
      if (role === 'SUPER_ADMIN') {
        // Si no está en la carpeta (admin), lo mandamos para allá
        if (segments[1] !== '(admin)') {
          router.replace('/(app)/(admin)');
        }
      } 
      // Si el rol es Cliente
      else if (role === 'CLIENTE') {
        // Si no está en la carpeta (tabs), lo mandamos
        if (segments[1] !== '(tabs)') {
          router.replace('/(app)/(tabs)');
        }
      }
    }
  }, [userToken, isLoading, segments, role]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#212121' }}>
        <ActivityIndicator size="large" color="#61DA5F" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Definimos los grupos principales */}
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(app)" options={{ animation: 'fade' }} />
    </Stack>
  );
}