import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
  label?: string;
  keyboardType?: React.ComponentProps<typeof RNTextInput>['keyboardType'];
  readonly?: boolean;
}

export const GlassTextInput: React.FC<Props> = ({ 
  value, 
  onChangeText, 
  placeholder = "Enter text", 
  isDarkMode,
  label,
  keyboardType = "default",
  readonly = false,
}) => {
  // 1. Estado para saber si el usuario está dentro del input
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
          {label}
        </Text>
      )}
      <TextInput
        readOnly={readonly}
        value={value}
        onChangeText={onChangeText}
        // 2. Si está focused, quitamos el placeholder para que no moleste
        placeholder={isFocused ? "" : placeholder}
        placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
        mode="flat"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        keyboardType={keyboardType}
        // 3. Eventos de foco
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // 4. Color del cursor (palito)
        selectionColor="#CA8E0E" 
        style={[
          styles.input,
          { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
            // 5. Cambio dinámico de borde
            borderColor: isFocused ? '#CA8E0E' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: isFocused ? 1.5 : 1,
            // Sombra suave cuando está enfocado para el efecto Glass
            elevation: isFocused ? 2 : 0,
          }
        ]}
        textColor={isDarkMode ? '#FFF' : '#000'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50, 
    borderRadius: 12,
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12,
    overflow: 'hidden', 
  },
});