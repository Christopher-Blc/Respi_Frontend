import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, StyleSheet, Platform } from 'react-native';
import { lightModeSemanticTokens, mainThemeColorsDark } from '../../theme';

const sportSentences = [
  'Train like a pro, play like a champion.',
  'Your only limit is you.',
  'Focus. Discipline. Results.',
  'Success starts with self-belief.',
  'The harder the battle, the sweeter the victory.',
  "Don't stop when you're tired, stop when you're done.",
];

const AnimatedSportText = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade Out (Desaparece)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        // Cambio de frase sin las comillas
        setIndex((prevIndex) => (prevIndex + 1) % sportSentences.length);

        // Fade In (Aparece)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text
        style={[
          styles.text,
          {
            color: isDarkMode
              ? mainThemeColorsDark.primaryButton
              : lightModeSemanticTokens.primary,
          },
        ]}
      >
        {sportSentences[index]}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '8%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 28,
    fontWeight: '900', // Muy negrita para que destaque
    textAlign: 'center',
    textTransform: 'uppercase', // Estilo deportivo tipográfico
    letterSpacing: 1,
    // Sombra mínima para profundidad en web
    // textShadowColor: 'rgba(0, 0, 0, 0.3)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
});

export default AnimatedSportText;
