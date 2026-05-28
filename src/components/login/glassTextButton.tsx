import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurViewCompat } from '../general/BlurViewCompat';
import { useAppTheme } from '../../context/ThemeContext';

type Props = {
  text: string;
  textColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  borderColor?: string;
  style?: object;
  borderWidth?: number;
  height?: number;
};

export function GlassTextButton({
  text,
  onPress,
  disabled,
  color,
  textColor,
  style,
  borderColor,
  borderWidth,
  height,
}: Props) {
  const { isDarkMode, theme } = useAppTheme();
  const buttonColor = color ? color : 'rgba(175, 175, 175, 0.3)';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={text}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {/*Hacia falta meterle eso pq en web no cogia bn el color ... */}
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.glass,
            {
              backgroundColor: buttonColor,
              borderColor: borderColor || theme.borderGlass,
              borderWidth: borderWidth || 0.9,
              height: height || 50,
            },
          ]}
        >
          <Text style={[styles.text, { color: textColor || theme.onPrimary }]}>
            {text}
          </Text>
        </View>
      ) : (
        <BlurViewCompat
          intensity={20}
          tint={isDarkMode ? 'dark' : 'light'}
          style={[
            styles.glass,
            {
              backgroundColor: buttonColor,
              borderColor: borderColor || theme.borderGlass,
              borderWidth: borderWidth || 0.9,
              height: height || 50,
            },
          ]}
        >
          <Text style={[styles.text, { color: textColor || theme.onPrimary }]}>
            {text}
          </Text>
        </BlurViewCompat>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glass: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(221, 151, 0, 0.3)',
    borderWidth: 0.9,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pressable: {
    width: '100%',
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
