import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthNavigation />
    </AuthProvider>
  );
}

function AuthNavigation() {
  const { userToken, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAppGroup = segments[0] === '(app)';

    if (!userToken && inAppGroup) {
      router.replace('/(login)/Login');
    } else if (userToken && !inAppGroup) {
      router.replace('/(app)/home');
    }
  }, [userToken, isLoading, segments]);

  if (isLoading) {
    return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator /></View>;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}