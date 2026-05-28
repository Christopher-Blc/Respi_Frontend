import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { glassTextInputStyles as styles } from '../../style/auth/loginComponents.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  label?: string;
  keyboardType?: React.ComponentProps<typeof RNTextInput>['keyboardType'];
  readonly?: boolean;
  autoComplete?:
    | 'username'
    | 'email'
    | 'name'
    | 'tel'
    | 'street-address'
    | 'postal-code'
    | 'country'
    | 'family-name'
    | 'off';
}

export const GlassTextInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  label,
  keyboardType = 'default',
  readonly = false,
  autoComplete = 'off',
}) => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
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
        autoComplete={autoComplete}
        readOnly={readonly}
        value={value}
        onChangeText={onChangeText}
        // 2. Si está focused, quitamos el placeholder para que no moleste
        placeholder={isFocused ? '' : placeholder || t('exampleText')}
        placeholderTextColor={placeholderTextColor || theme.inputPlaceholder}
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

