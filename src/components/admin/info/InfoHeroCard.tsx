import React from 'react';
import { Text, View } from 'react-native';
import { AppTheme } from '../../../theme';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';

type Props = {
  theme: AppTheme;
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function InfoHeroCard({ theme, eyebrow, title, subtitle }: Props) {
  return (
    <View
      style={[
        styles.heroCard,
        {
          backgroundColor: theme.primarySoft,
          borderColor: theme.borderAccentSoft,
        },
      ]}
    >
      <Text style={[styles.eyebrow, { color: theme.primary }]}>{eyebrow}</Text>
      <Text style={[styles.title, { color: theme.textTitle }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.textSubtitle }]}>
        {subtitle}
      </Text>
    </View>
  );
}
