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
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { PasswordStrengthIndicator } from '../../components/login/passwordStrengthIndicator';
import { resetPasswordStyles as styles } from '../../style/auth/auth.styles';

const RESET_PASSWORD_ENDPOINT = '/auth/reset-password';

const getResetPasswordErrorMessage = (error: unknown): string => {
  if ((error as { isAxiosError?: boolean })?.isAxiosError) {
    const data = (
      error as { response?: { data?: { message?: string | string[] } } }
    )?.response?.data;

    if (Array.isArray(data?.message)) {
      return data.message[0] || 'No se pudo restablecer tu contraseña.';
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }
  }

  return 'Ocurrió un error. Por favor, intenta de nuevo.';
};

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { token: rawToken } = useLocalSearchParams<{
    token?: string | string[];
  }>();
  const { theme, isDarkMode } = useAppTheme();

  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const isPasswordValid = useMemo(
    () => password.length >= 8 && password === confirmPassword,
    [password, confirmPassword],
  );

  const passwordsMatch = useMemo(
    () => confirmPassword === '' || password === confirmPassword,
    [password, confirmPassword],
  );

  const handleResetPassword = async () => {
    if (!token || !isPasswordValid || isSending) return;

    Keyboard.dismiss();
    setIsSending(true);
    setFeedback('');
    setFeedbackType(null);

    try {
      await api.post(RESET_PASSWORD_ENDPOINT, {
        token,
        new_password: password,
      });
      setFeedback(
        'Contraseña restablecida correctamente. Redirigiendo al login...',
      );
      setFeedbackType('success');
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error) {
      setFeedback(getResetPasswordErrorMessage(error));
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
          Cambiar contraseña
        </Text>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: riseAnim }],
            width: '100%',
          }}
        >
          <Text style={[styles.message, { color: theme.textBody }]}>
            Ingresa tu nueva contraseña para restablecer tu cuenta.
          </Text>
        </Animated.View>

        <GlassTextInputPassword
          value={password}
          onChangeText={setPassword}
          placeholder={t('examplePassword') || 'Nueva contraseña'}
        />
        <PasswordStrengthIndicator password={password} />

        <GlassTextInputPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirmar contraseña"
        />
        {confirmPassword && !passwordsMatch && (
          <Text style={[styles.feedback, { color: '#ff4757' }]}>
            Las contraseñas no coinciden
          </Text>
        )}

        {feedback && (
          <Text style={[styles.feedback, { color: feedbackColor }]}>
            {feedback}
          </Text>
        )}

        {isSending && (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loaderText, { color: theme.textBody }]}>
              Restableciendo contraseña...
            </Text>
          </View>
        )}

        <GlassTextButton
          text="Confirmar"
          textColor={theme.onPrimary}
          color={
            isPasswordValid && !isSending ? theme.primary : theme.textSubtle
          }
          onPress={handleResetPassword}
          disabled={!isPasswordValid || isSending}
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

