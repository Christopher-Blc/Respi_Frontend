import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { mainThemeColors } from "../../theme";

type Props = {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
};

export function RectangularButton({ text, onPress, disabled }: Props) {
  const { buttonGradient, textTitle } = mainThemeColors;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={buttonGradient}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, { color: textTitle }]}>
          {text}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  gradient: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "700",
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