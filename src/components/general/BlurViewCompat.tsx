import React from 'react';
import { Platform, View } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';

type BlurViewCompatProps = BlurViewProps & {
  /** Override the Android fallback background color (default: auto from tint + intensity) */
  androidBackgroundColor?: string;
};

/**
 * Cross-platform BlurView wrapper.
 * - iOS / Web → native BlurView
 * - Android   → plain View with a semi-transparent background derived from
 *               `tint` and `intensity`, because expo-blur renders poorly on Android.
 */
export function BlurViewCompat({
  tint,
  intensity = 50,
  style,
  children,
  androidBackgroundColor,
  ...rest
}: BlurViewCompatProps) {
  if (Platform.OS === 'android') {
    // Map intensity (0-100) to an alpha between 0.3 and 0.92
    const alpha = Math.round(((intensity ?? 50) / 100) * 0.92 * 255)
      .toString(16)
      .padStart(2, '0');

    const bgColor =
      androidBackgroundColor ??
      (tint === 'dark' ? `#000000${alpha}` : `#FFFFFF${alpha}`);

    return (
      <View style={[{ backgroundColor: bgColor }, style]}>{children}</View>
    );
  }

  return (
    <BlurView tint={tint} intensity={intensity} style={style} {...rest}>
      {children}
    </BlurView>
  );
}
