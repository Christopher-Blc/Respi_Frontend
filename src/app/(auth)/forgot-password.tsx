import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Text,
  View,
  Keyboard,
} from 'react-native';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';
import RespiLogo from '../../components/login/respiLogo';
import { GlassTextButton } from '../../components/login/glassTextButton';
import api from '../../services/api';
import { GlassTextInput } from '../../components/login/glassTextInput';
import { forgotPasswordStyles as styles } from '../../style/auth/auth.styles';

const FORGOT_PASSWORD_ENDPOINT = '/auth/forgot-password';

const normalizeEmail = (value?: string | string[]): string => {
  if (Array.isArray(value)) {
    return (value[0] || '').trim();
  }

  return (value || '').trim();
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getForgotPasswordErrorMessage = (error: unknown): string => {
  if ((error as { isAxiosError?: boolean })?.isAxiosError) {
    const data = (
      error as { response?: { data?: { message?: string | string[] } } }
    )?.response?.data;

    if (Array.isArray(data?.message)) {
      return data.message[0] || 'No se pudo procesar tu solicitud.';
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }
  }

  return 'Ocurrió un error. Por favor, intenta de nuevo.';
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { email: rawEmail } = useLocalSearchParams<{
    email?: string | string[];
  }>();
  const { theme, isDarkMode } = useAppTheme();

  const [email, setEmail] = useState<string>(normalizeEmail(rawEmail));
  const [isSending, setIsSending] = useState(false);
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

  const isEmailValid = useMemo(() => validateEmail(email), [email]);

  const handleSendReset = async () => {
    if (!isEmailValid || isSending) return;

    Keyboard.dismiss();
    setIsSending(true);
    setFeedback('');
    setFeedbackType(null);

    try {
      await api.post(FORGOT_PASSWORD_ENDPOINT, { email });
      setFeedback(
        `Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada.`,
      );
      setFeedbackType('success');
    } catch (error) {
      setFeedback(getForgotPasswordErrorMessage(error));
      setFeedbackType('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(auth)/login');
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

        <Text style={[styles.title, { color: theme.textTitle }]}>
          Recuperar contraseña
        </Text>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: riseAnim }],
            width: '100%',
          }}
        >
          <Text style={[styles.message, { color: theme.textBody }]}>
            Ingresa tu correo electrónico para recibir un enlace de
            recuperación.
          </Text>
        </Animated.View>

        <GlassTextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t('exampleEmail') || 'Correo electrónico'}
        />

        {feedback && (
          <Text style={[styles.feedback, { color: feedbackColor }]}>
            {feedback}
          </Text>
        )}

        {isSending && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loaderText, { color: theme.textBody }]}>
              Enviando...
            </Text>
          </View>
        )}

        <GlassTextButton
          text="Enviar enlace"
          textColor={theme.onPrimary}
          color={isEmailValid && !isSending ? theme.primary : theme.textSubtle}
          onPress={handleSendReset}
          disabled={!isEmailValid || isSending}
          style={styles.actionButton}
        />

        <GlassTextButton
          text="Volver al login"
          textColor={theme.textBody}
          color="transparent"
          onPress={handleBackToLogin}
          style={styles.backButton}
        />
      </BlurViewCompat>
    </View>
  );
}

