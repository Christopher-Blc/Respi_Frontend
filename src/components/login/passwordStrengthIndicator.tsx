import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { passwordStrengthStyles as styles } from '../../style/auth/loginComponents.styles';

type PasswordRequirement = {
  id: string;
  labelKey: string;
  validate: (password: string) => boolean;
};

const REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    labelKey: 'authRegisterPasswordLength',
    validate: (pwd) => pwd.length >= 8 && pwd.length <= 128,
  },
  {
    id: 'lowercase',
    labelKey: 'authRegisterPasswordLowercase',
    validate: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: 'uppercase',
    labelKey: 'authRegisterPasswordUppercase',
    validate: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: 'number',
    labelKey: 'authRegisterPasswordNumber',
    validate: (pwd) => /\d/.test(pwd),
  },
  {
    id: 'symbol',
    labelKey: 'authRegisterPasswordSpecial',
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
            {t(req.labelKey)}
          </Text>
        </View>
      ))}

      {allMet && password.length > 0 && (
        <View style={styles.successMessage}>
          <Text style={[styles.successText, { color: theme.primaryButton }]}>
            ✓ {t('authRegisterPasswordValid')}
          </Text>
        </View>
      )}
    </View>
  );
};
