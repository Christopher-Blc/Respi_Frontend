import { Stack } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons'; // Viene con Expo
import { mainThemeColorsDark } from '../../../theme';

export default function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: mainThemeColorsDark.backgroundMain,
        },
        headerTintColor: mainThemeColorsDark.primaryButton,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={signOut}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: mainThemeColorsDark.errorText,
                marginRight: 5,
                fontWeight: '600',
              }}
            >
              Salir
            </Text>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={mainThemeColorsDark.errorText}
            />
          </TouchableOpacity>
        ),
      }}
    >
      {/* La pantalla principal del admin */}
      <Stack.Screen
        name="index"
        options={{
          title: 'PANEL DE CONTROL',
        }}
      />

      {/* Si añades más pantallas dentro de (admin), aparecerán aquí con el mismo estilo */}
      <Stack.Screen
        name="usuarios"
        options={{
          title: 'Gestión de Usuarios',
        }}
      />
    </Stack>
  );
}
