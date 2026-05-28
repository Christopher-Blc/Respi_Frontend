import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { passwordStrengthStyles as styles } from '../../style/auth/loginComponents.styles';

type PasswordRequirement = {
  id: string;
  label: string;
  validate: (password: string) => boolean;
};

const REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'Longitud: Entre 8 y 128 caracteres',
    validate: (pwd) => pwd.length >= 8 && pwd.length <= 128,
  },
  {
    id: 'lowercase',
    label: 'Minúscula: (a-z)',
    validate: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'uppercase',
    label: 'Mayúscula: (A-Z)',
    validate: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'number',
    label: 'Número: min 1 - (0-9)',
    validate: (pwd) => /\d/.test(pwd),
  },
  {
    id: 'symbol',
    label: 'Símbolo: (!@#$%&*)',
    validate: (pwd) => /[!@#$%&*_\-+=\[\]{};:'",.<>?/\\|`~^()]/.test(pwd),
  },
];

type Props = {
  password: string;
};

export const PasswordStrengthIndicator: React.FC<Props> = ({ password }) => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const requirements = useMemo(() => {
    return REQUIREMENTS.map((req) => ({
      ...req,
      isMet: req.validate(password),
    }));
  }, [password]);

  const allMet = requirements.every((r) => r.isMet);

  return (
    <View style={styles.container}>
      {requirements.map((req) => (
        <View key={req.id} style={styles.row}>
          <View
            style={[
              styles.circle,
              {
                borderColor: req.isMet
                  ? theme.primaryButton
                  : theme.grayLabelText,
                backgroundColor: req.isMet
                  ? theme.primaryButton
                  : 'transparent',
              },
            ]}
          ></View>
          <Text
            style={[
              styles.label,
              {
                color: req.isMet ? theme.inputFocus : theme.grayLabelText,
              },
            ]}
          >
            {req.label}
          </Text>
        </View>
      ))}

      {allMet && password.length > 0 && (
        <View style={styles.successMessage}>
          <Text style={[styles.successText, { color: theme.primaryButton }]}>
            ✓ Contraseña válida
          </Text>
        </View>
      )}
    </View>
  );
};

