import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';

type BlurViewCompatProps = BlurViewProps & {
  androidBackgroundColor?: string;
};

export function BlurViewCompat({
  tint = 'light',
  intensity = 50,
  style,
  children,
  androidBackgroundColor,
  ...rest
}: BlurViewCompatProps) {
  if (Platform.OS !== 'android') {
    return (
      <BlurView tint={tint} intensity={intensity} style={style} {...rest}>
        {children}
      </BlurView>
    );
  }
  const defaultBg =
    tint === 'dark' ? 'rgba(18, 18, 18, 0.82)' : 'rgba(255, 255, 255, 0.84)';

  const baseBg = androidBackgroundColor ?? defaultBg;

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      {/* Real blur in dev build (SDK 31+). Falls back gracefully in Expo Go. */}
      <BlurView
        tint={tint}
        intensity={intensity}
        // Use the faster SDK-31+ path on modern Android,
        // full dimezis on older versions
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
        {...rest}
      />

      {children}
    </View>
  );
}
