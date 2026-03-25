import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";

type Props = {
  text: string;
  textColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
};

export function RectangularButton({ text, onPress, disabled, color, textColor }: Props) {
  const buttonColor = color ? color : "rgba(175, 175, 175, 0.3)"; // Fallback a un color semitransparente
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
      {/*Hacia falta meterle eso pq en web no cogia bn el color ... */}
      {Platform.OS === 'web' ? (
        <View style={[styles.glass, { backgroundColor: buttonColor }]}>
          <Text style={[styles.text, { color: textColor || "#fff" }]}>
            {text}
          </Text>
        </View>
      ) : (
        <BlurView intensity={20} tint="light" style={[styles.glass, { backgroundColor: buttonColor }]}>
          <Text style={[styles.text, { color: textColor || "#fff" }]}>
            {text}
          </Text>
        </BlurView>
      )}
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