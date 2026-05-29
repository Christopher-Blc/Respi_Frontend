import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { BlurViewCompat } from '../general/BlurViewCompat';
import { useAppTheme } from '../../context/ThemeContext';
import { glassTextButtonStyles as styles } from '../../style/auth/loginComponents.styles';

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

