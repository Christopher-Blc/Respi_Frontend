import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet } from 'react-native';
import { lightModeSemanticTokens } from '../../theme';

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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glass: {
    width: 280,
    height: 160,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightModeSemanticTokens.borderGlass,
  },
});
