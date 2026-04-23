import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from '../../style/profile.styles';
import { lightModeSemanticTokens, mainThemeColorsDark } from '../../theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  isLast?: boolean;
  isDarkMode?: boolean;
  onPress?: () => void;
};

export default function MenuOption({
  icon,
  title,
  value,
  isLast,
  isDarkMode,
  onPress,
}: Props) {
  const iconColor = isDarkMode
    ? mainThemeColorsDark.primaryButton
    : lightModeSemanticTokens.primary;
  const chevronColor = isDarkMode
    ? mainThemeColorsDark.grayLabelText
    : lightModeSemanticTokens.iconMuted;
  const rowBorderColor = isDarkMode
    ? mainThemeColorsDark.borderLight
    : lightModeSemanticTokens.borderDefault;
  const titleColor = isDarkMode
    ? mainThemeColorsDark.textTitle
    : lightModeSemanticTokens.textPrimary;
  const valueColor = isDarkMode
    ? mainThemeColorsDark.grayPlaceholder
    : lightModeSemanticTokens.textPlaceholder;
  const iconContainerColor = isDarkMode
    ? mainThemeColorsDark.backgroundInput
    : lightModeSemanticTokens.iconCardBg;

  return (
    <TouchableOpacity
      style={[
        styles.optionRow,
        { borderBottomColor: rowBorderColor },
        isLast && { borderBottomWidth: 0 },
      ]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconContainerColor },
          ]}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[styles.optionTitle, { color: titleColor }]}>{title}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && (
          <Text style={[styles.optionValue, { color: valueColor }]}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={chevronColor} />
      </View>
    </TouchableOpacity>
  );
}
