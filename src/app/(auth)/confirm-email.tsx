import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '../../context/ThemeContext';
import RespiLogo from '../../components/login/respiLogo';
import { GlassTextButton } from '../../components/login/glassTextButton';
import api from '../../services/api';

const RESEND_VERIFICATION_ENDPOINT = '/auth/resend-verification';

const normalizeEmail = (value?: string | string[]): string => {
  if (Array.isArray(value)) {
    return (value[0] || '').trim();
  }

  return (value || '').trim();
};

const getResendMessage = (error: unknown) => {
  if ((error as { isAxiosError?: boolean })?.isAxiosError) {
    const data = (
      error as { response?: { data?: { message?: string | string[] } } }
    )?.response?.data;

    if (Array.isArray(data?.message)) {
      return data.message[0] || 'No se pudo reenviar el email.';
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }
  }

  return 'No se pudo reenviar el email. Intenta de nuevo en unos minutos.';
};

export default function ConfirmEmailScreen() {
  const router = useRouter();
  const { email: rawEmail } = useLocalSearchParams<{
    email?: string | string[];
  }>();
  const { theme, isDarkMode } = useAppTheme();

  const email = useMemo(() => normalizeEmail(rawEmail), [rawEmail]);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(
    null,
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const riseAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(riseAnim, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, riseAnim]);

  const feedbackColor = useMemo(() => {
    if (feedbackType === 'success') return '#2ed573';
    if (feedbackType === 'error') return '#ff4757';
    return theme.textBody;
  }, [feedbackType, theme.textBody]);

  const handleResend = async () => {
    if (!email || isResending) return;

    setIsResending(true);
    setFeedback('');
    setFeedbackType(null);

    try {
      await api.post(RESEND_VERIFICATION_ENDPOINT, { email });
      setFeedback('Email enviado de nuevo. Revisa tu bandeja de entrada.');
      setFeedbackType('success');
    } catch (error) {
      setFeedback(getResendMessage(error));
      setFeedbackType('error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.backgroundMain }]}>
      <View
        style={[styles.glow, { backgroundColor: `${theme.primaryButton}22` }]}
      />

      <BlurViewCompat
        tint={isDarkMode ? 'dark' : 'light'}
        intensity={20}
        style={[
          styles.card,
          {
            borderColor: theme.textSubtle,
          },
        ]}
      >
        <RespiLogo />

        <Text style={[styles.title, { color: theme.textTitle }]}>Respi</Text>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: riseAnim }],
            width: '100%',
          }}
        >
          <Text style={[styles.message, { color: theme.textBody }]}>
            !Casi listo! Hemos enviado un enlace a{'\n'}
            <Text style={[styles.emailText, { color: theme.textTitle }]}>
              {email || 'tu correo'}
            </Text>
          </Text>
        </Animated.View>

        {isResending && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color={theme.primaryButton} />
            <Text style={[styles.loaderText, { color: theme.textBody }]}>
              Reenviando email...
            </Text>
          </View>
        )}

        {!!feedback && (
          <Text style={[styles.feedback, { color: feedbackColor }]}>
            {feedback}
          </Text>
        )}

        <GlassTextButton
          text={isResending ? 'Reenviando...' : 'Reenviar email'}
          textColor={theme.onPrimary}
          color={theme.primaryButton}
          onPress={handleResend}
          disabled={isResending || !email}
          style={styles.actionButton}
        />

        <GlassTextButton
          text="Ya lo he verificado"
          textColor={theme.onPrimary}
          color={theme.primary}
          onPress={() => router.replace('/(auth)/login')}
          style={styles.actionButton}
        />
      </BlurViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: '20%',
    opacity: 0.9,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 30,
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderWidth: 0.8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  emailText: {
    fontWeight: '700',
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  loaderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  feedback: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginTop: 6,
  },
  actionButton: {
    width: '100%',
    marginTop: 12,
  },
});
