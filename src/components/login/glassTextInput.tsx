import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput as RNTextInput, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isDarkMode: boolean;
  label?: string;
  keyboardType?: React.ComponentProps<typeof RNTextInput>['keyboardType'];
}

export const GlassTextInput: React.FC<Props> = ({ 
  value, 
  onChangeText, 
  placeholder = "Enter email", 
  isDarkMode,
  label,
  keyboardType = "default",
}) => {

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
        mode="flat" // Usamos flat para que no choque con el diseño personalizado
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        keyboardType={keyboardType}
        style={[
          styles.input,
          { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            color: isDarkMode ? '#FFF' : '#000'
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
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50, 
    borderRadius: 12,
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
});