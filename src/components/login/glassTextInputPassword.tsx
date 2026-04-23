import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
}

export const GlassTextInputPassword: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Enter password',
  label,
}) => {
  const { theme } = useAppTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.grayLabelText,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={isFocused ? '' : placeholder}
        placeholderTextColor={theme.inputPlaceholder}
        secureTextEntry={!passwordVisible}
        mode="flat"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        selectionColor={theme.inputFocus}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: isFocused ? theme.inputFocus : theme.borderInput,
            borderWidth: isFocused ? 1.5 : 1,
          },
        ]}
        textColor={theme.textInput}
        right={
          <TextInput.Icon
            icon={passwordVisible ? 'eye-off' : 'eye'}
            color={
              isFocused
                ? theme.inputFocus
                : theme.grayPlaceholder
            }
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
