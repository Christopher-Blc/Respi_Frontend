import React, { useState, createContext, useContext } from 'react';
import { ImageBackground, View, StyleSheet, Platform } from 'react-native';
import { Slot } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { mainThemeColorsDark } from '../../theme';

// 1. Creamos el contexto
const AuthShellContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// 2. Hook personalizado para usarlo fácilmente
export const useAuthShell = () => useContext(AuthShellContext);
const LOGO_CACHE = require('../../../assets/RespiLogo.png');

export default function AuthLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const bgImage = isDarkMode
    ? require('../../../assets/login-bg-dark.png')
    : require('../../../assets/login-bg-light.png');

  return (
    // 3. Proveemos el estado a los hijos
    <AuthShellContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <View style={styles.container}>
          <Slot />
        </View>

        <IconButton
          icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
          style={styles.darkModeButton}
          iconColor={mainThemeColorsDark.textTitle}
          onPress={toggleDarkMode}
        />
      </ImageBackground>
    </AuthShellContext.Provider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  darkModeButton: { position: 'absolute', top: 50, right: 20 },
});
