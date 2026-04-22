import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';
import styles from '../../style/profile.styles';

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
  return (
    <TouchableOpacity
      style={[styles.optionRow, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#B89B5E" />
        </View>
        <Text style={styles.optionTitle}>{title}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && <Text style={styles.optionValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );
}
