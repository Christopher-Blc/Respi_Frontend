import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { router } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';
import { easterEggPepStyles as styles } from '../../style/auth/auth.styles';

const { width, height } = Dimensions.get('window');
const { theme } = useAppTheme();

const CONFETTI_COLORS = [
  '#FF4D6D',
  '#FF9F1C',
  '#FFD60A',
  '#2EC4B6',
  '#4CC9F0',
  '#4361EE',
  '#8338EC',
  '#F72585',
];

const CONFETTI_ITEMS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: ((i * 37) % 100) / 100,
  duration: 2200 + (i % 8) * 350,
  delay: (i % 12) * 180,
  size: 6 + (i % 6),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

const BROMAS_PEPE = [
  '¡Felicidades Pepe! 🎾',
  "Pepe: 'Chicos, esto se hace en 5 minutos' (Procede a estar 2 horas).",
  "Tu código no tiene Warnings, tiene 'personalidad'.",
  '¿En tu cumple el contador de edad hace un ++ o es inmutable?',
  'Pepe, eres el único Hook que siempre retorna buenas vibras.',
  'Stack Overflow te pide ayuda a ti, no nos mientas.',
  '¡Menos mal que nos diste clase tú y no un tutorial de YouTube de 2014!',
  'Un año más cerca de ser Legacy, Pepe. ¡Disfrútalo!',
];

function ConfettiPiece({ item }: { item: (typeof CONFETTI_ITEMS)[number] }) {
  const progress = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(item.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: item.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      progress.stopAnimation();
    };
  }, [item.delay, item.duration, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, height + 40],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, item.id % 2 === 0 ? 22 : -22],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', item.id % 2 === 0 ? '360deg' : '-360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          left: width * item.left,
          width: item.size,
          height: item.size * 1.8,
          backgroundColor: item.color,
          borderRadius: 2,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    />
  );
}

function FloatingBall({ index }: { index: number }) {
  const progress = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(index * 300),
        Animated.timing(progress, {
          toValue: 1,
          duration: 2500 + index * 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      progress.stopAnimation();
    };
  }, [index, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [height, -100],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0.4, 0.4],
  });

  return (
    <Animated.View
      style={[
        styles.floatingBall,
        {
          left: (width / 5) * index - 30,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={{ fontSize: 40 }}>🎾</Text>
    </Animated.View>
  );
}

function SignaturePulse() {
  const scale = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      scale.stopAnimation();
    };
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Text style={styles.signature}>Hecho con ❤️ por los respistas</Text>
    </Animated.View>
  );
}

const PepeBirthdayScreen = () => {
  const [index, setIndex] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % BROMAS_PEPE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Confeti infinito */}
      {CONFETTI_ITEMS.map((item) => (
        <ConfettiPiece key={`confetti-${item.id}`} item={item} />
      ))}

      {/* Pelotas flotando de fondo */}
      {[1, 2, 3, 4, 5].map((i) => (
        <FloatingBall key={i} index={i} />
      ))}

      <BlurViewCompat intensity={80} tint="light" style={[styles.glassCard, { width: width * 0.85 }]}>
        <View style={styles.photoFrame}>
          <Image
            source={
              photoFailed
                ? require('../../../assets/Image-not-found.png')
                : { uri: 'https://respi.es/api/public/pepe.jpeg' }
            }
            style={styles.profeImage}
            onError={() => setPhotoFailed(true)}
          />
        </View>

        <Text style={styles.congrats}>¡GRANDE PEPE!</Text>

        <View style={styles.phraseWrapper}>
          <View style={styles.innerPhrase}>
            <Text style={styles.jokeText}>{BROMAS_PEPE[index]}</Text>
          </View>
        </View>

        <SignaturePulse />
      </BlurViewCompat>
      <GlassTextButton
        text="Back"
        textColor={theme.onPrimary}
        onPress={() => router.replace('/login')}
        color={theme.primaryButton}
        style={{ marginTop: 20, width: 320 }}
      />
    </View>
  );
};


export default PepeBirthdayScreen;
