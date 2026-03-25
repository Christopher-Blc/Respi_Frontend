import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
  label?: string;
}

export const GlassTextInputPassword: React.FC<Props> = ({ 
  value, 
  onChangeText, 
  placeholder = "Enter password", 
  isDarkMode,
  label 
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  // 1. Estado para detectar el foco
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        // 2. Placeholder dinámico: desaparece al hacer click
        placeholder={isFocused ? "" : placeholder}
        placeholderTextColor={isDarkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
        secureTextEntry={!passwordVisible}
        mode="flat"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        
        // 3. Control de foco
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        
        // 4. Cursor dorado
        selectionColor="#CA8E0E" 
        
        style={[
          styles.input,
          { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
            // 5. Borde dinámico
            borderColor: isFocused ? '#CA8E0E' : 'rgba(0, 0, 0, 0.1)',
            borderWidth: isFocused ? 1.5 : 1,
          }
        ]}
        textColor={isDarkMode ? '#FFF' : '#000'}
        right={
          <TextInput.Icon 
            icon={passwordVisible ? "eye-off" : "eye"} 
            // El icono también puede cambiar de color al enfocar si quieres
            color={isFocused ? "#CA8E0E" : (isDarkMode ? "#AAA" : "#666")}
            onPress={() => setPasswordVisible(!passwordVisible)}
            forceTextInputFocus={false}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12, // Un poco menos de margen para que quepa mejor con el teclado
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