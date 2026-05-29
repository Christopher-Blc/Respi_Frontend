import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { lightModeSemanticTokens } from '../../theme';
import { liquidGlassStyles as styles } from '../../style/auth/loginComponents.styles';

export default function LiquidGlass() {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={90} tint="light" style={styles.glass}>
        <LinearGradient
          colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']}
          style={StyleSheet.absoluteFill}
        />
      </BlurView>
    </View>
  );
}

