import { Redirect } from "expo-router";

export default function Index() {
  // Simplemente redirigimos al grupo (auth). 
  // Si el usuario ya tiene token, el Layout lo interceptará 
  // y lo mandará a (admin) o (tabs) automáticamente.
  return <Redirect href="/(auth)/login" />;
}