import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';

type BlurViewCompatProps = BlurViewProps & {
  androidBackgroundColor?: string;
};

export function BlurViewCompat({
  tint = 'light', // 1. Cambiado a 'light' por defecto para tu fondo claro
  intensity = 50,
  style,
  children,
  androidBackgroundColor,
  ...rest
}: BlurViewCompatProps) {
  const resolvedIntensity =
    Platform.OS === 'android' ? Math.min(intensity ?? 50, 30) : intensity;

  if (Platform.OS === 'android') {
    return (
      <View
        style={[
          style,
          {
            // 2. Forzamos un fondo blanco semi-transparente de respaldo
            backgroundColor:
              androidBackgroundColor || 'rgba(255, 255, 255, 0.85)',
            // 3. Quitamos cualquier borde extraño si lo hubiera
            overflow: 'hidden',
          },
        ]}
      >
        <BlurView
          tint="light" // Asegura el tint claro en Android
          intensity={resolvedIntensity}
          style={StyleSheet.absoluteFill}
          {...rest}
        />
        {children}
      </View>
    );
  }

  return (
    <BlurView tint={tint} intensity={resolvedIntensity} style={style} {...rest}>
      {children}
    </BlurView>
  );
}
