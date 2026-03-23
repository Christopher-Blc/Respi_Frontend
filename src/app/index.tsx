import { Redirect } from "expo-router";

// simulado — luego lo conectarás a tu auth real
const isLoggedIn = false;

export default function Index() {
  if (isLoggedIn) {
    return <Redirect href="/(app)" />;
  } else {
    return <Redirect href="/(login)/Login" />;
  }
}