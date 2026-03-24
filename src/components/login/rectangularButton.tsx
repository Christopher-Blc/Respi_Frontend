import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { mainThemeColors } from "../../theme";
import { BlurView } from "expo-blur";

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
      <BlurView intensity={20} tint="light" style={styles.glass}>
      
          <Text style={[styles.text, { color: textTitle }]}>
        {text}
          </Text>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glass: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(221, 151, 0, 0.3)',
    borderWidth: 0.9,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pressable: {
    width: "100%",
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