import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  keyboardType?: React.ComponentProps<typeof RNTextInput>['keyboardType'];
  readonly?: boolean;
}

export const GlassTextInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Enter text',
  label,
  keyboardType = 'default',
  readonly = false,
}) => {
  const { theme } = useAppTheme();
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
        readOnly={readonly}
        value={value}
        onChangeText={onChangeText}
        // 2. Si está focused, quitamos el placeholder para que no moleste
        placeholder={isFocused ? '' : placeholder}
        placeholderTextColor={theme.inputPlaceholder}
        mode="flat"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        keyboardType={keyboardType}
        // 3. Eventos de foco
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // 4. Color del cursor (palito)
        selectionColor={theme.inputFocus}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            borderColor: isFocused ? theme.inputFocus : theme.borderInput,
            borderWidth: isFocused ? 1.5 : 1,
            elevation: isFocused ? 2 : 0,
          },
        ]}
        textColor={theme.textInput}
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
