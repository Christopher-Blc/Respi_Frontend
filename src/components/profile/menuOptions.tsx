import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import { useMemo } from 'react';
import createProfileStyles from '../../style/profile.styles';
import { useAppTheme } from '../../context/ThemeContext';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
};

export default function MenuOption({
  icon,
  title,
  value,
  isLast,
  onPress,
}: Props) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createProfileStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[
        styles.optionRow,
        { borderBottomColor: theme.borderDefault },
        isLast && { borderBottomWidth: 0 },
      ]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.iconCardBg },
          ]}
        >
          <Ionicons name={icon} size={20} color={theme.primary} />
        </View>
        <Text style={[styles.optionTitle, { color: theme.textTitle }]}>
          {title}
        </Text>
      </View>
      <View style={styles.optionRight}>
        {value && (
          <Text style={[styles.optionValue, { color: theme.textPlaceholder }]}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={theme.iconMuted} />
      </View>
    </TouchableOpacity>
  );
}
