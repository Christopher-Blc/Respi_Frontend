import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { glassTextInputPasswordStyles as styles } from '../../style/auth/loginComponents.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  label?: string;
  autoComplete?: 'password' | 'current-password' | 'new-password' | 'off';
  onFocus?: () => void;
  onBlur?: () => void;
}

export const GlassTextInputPassword: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  label,
  autoComplete = 'off',
  onFocus, // <--- FALTABA EXTRAER ESTO
  onBlur, // <--- FALTABA EXTRAER ESTO
}) => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
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
        autoComplete={autoComplete}
        value={value}
        onChangeText={onChangeText}
        placeholder={isFocused ? '' : placeholder || t('examplePassword')}
        placeholderTextColor={placeholderTextColor || theme.inputPlaceholder}
        secureTextEntry={!passwordVisible}
        mode="flat"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        onFocus={() => {
          setIsFocused(true);
          onFocus && onFocus(); // Ahora funcionará perfectamente de forma opcional
        }}
        onBlur={() => {
          setIsFocused(false);
          onBlur && onBlur(); // Ahora funcionará perfectamente de forma opcional
        }}
        selectionColor={theme.inputFocus}
        accessibilityLabel={placeholder || t('examplePassword')}
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
            color={isFocused ? theme.inputFocus : theme.grayPlaceholder}
            onPress={() => setPasswordVisible(!passwordVisible)}
            forceTextInputFocus={false}
            accessibilityLabel={
              passwordVisible ? t('passwordHide') : t('passwordShow')
            }
          />
        }
      />
    </View>
  );
};
