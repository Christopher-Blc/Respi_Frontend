import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, Platform } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { animatedSportTextStyles as styles } from '../../style/auth/loginComponents.styles';

const sportSentences = [
  'Train like a pro, play like a champion.',
  'Your only limit is you.',
  'Focus. Discipline. Results.',
  'Success starts with self-belief.',
  'The harder the battle, the sweeter the victory.',
  "Don't stop when you're tired, stop when you're done.",
];

const AnimatedSportText = () => {
  const { theme } = useAppTheme();
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
            color: theme.primary,
          },
        ]}
      >
        {sportSentences[index]}
      </Text>
    </Animated.View>
  );
};


export default AnimatedSportText;
