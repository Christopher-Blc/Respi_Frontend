import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';

export default function AuthLayout() {
  const { isDarkMode, toggleTheme, theme } = useAppTheme();

  const bgImage = isDarkMode
    ? require('../../../assets/login-bg-dark.png')
    : require('../../../assets/login-bg-light.png');

  return (
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
        iconColor={theme.textTitle}
        onPress={toggleTheme}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  darkModeButton: { position: 'absolute', top: 50, right: 20 },
});
