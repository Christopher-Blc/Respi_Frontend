import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput as RNTextInput, Platform } from 'react-native';
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
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#888" : "#666"}
        secureTextEntry={!passwordVisible}
        mode="flat" // Usamos flat para que no choque con tu diseño personalizado
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        style={[
          styles.input,
          { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            color: isDarkMode ? '#FFF' : '#000'
          }
        ]}
        textColor={isDarkMode ? '#FFF' : '#000'}
        right={
          <TextInput.Icon 
            icon={passwordVisible ? "eye-off" : "eye"} 
            color={isDarkMode ? "#AAA" : "#666"}
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
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50, // Ajustado para que se vea similar a tu padding anterior
    borderRadius: 12,
    borderTopLeftRadius: 12, // React Native Paper requiere resetear estos radios
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
});