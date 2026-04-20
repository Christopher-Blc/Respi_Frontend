import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { userToken, role, isLoading } = useAuth();

  if (isLoading) return null; // Esperamos a que el Layout decida

  // El Layout ya se encarga de redirigir, pero si queremos ser redundantes:
  if (!userToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return role === 'SUPER_ADMIN' 
    ? <Redirect href="/(app)/(admin)" /> 
    : <Redirect href="/(app)/(tabs)" />;
}