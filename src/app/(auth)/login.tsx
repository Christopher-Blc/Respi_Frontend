import React, { useState, useMemo, useEffect } from 'react';
import {
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import createLoginStyles from '../../style/login.styles';
import RespiLogo from '../../components/login/respiLogo';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  //const [pepeEnabled, setPepeEnabled] = useState(false);
  const [showResend, setShowResend] = useState(false);

  // Estados para el temporizador
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode, theme } = useAppTheme();
  const styles = useMemo(() => createLoginStyles(theme), [theme]);
  const loginTextColor = theme.textBody;

  const { signIn } = useAuth();

  // Manejador del contador
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendEmail = async () => {
    if (isResendDisabled) return;

    try {
      await api.post('/auth/resend-verification', {
        email: email.toLowerCase(),
      });
      setError(t('authLoginEmailSent'));
      // Iniciar bloqueo y contador
      setIsResendDisabled(true);
      setTimer(30);
    } catch (err) {
      setError(t('authResendError'));
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setError(t('authLoginEmptyFields'));
      return;
    }

    try {
      setError('');
      setShowResend(false);
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password: password,
      });

      if (response.data.access_token) {
        const token = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        signIn(token, refreshToken);
      }
    } catch (err: any) {
      let message = err.response?.data?.message || t('authConnectionError');
      if (message.includes('Email not verified')) {
        message = t('authEmailNotVerified');
        setShowResend(true);
      }
      setError(Array.isArray(message) ? message[0] : message);
    }
  };

  function renderForm() {
    return (
      <BlurViewCompat
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.glass}
        intensity={20}
      >
        <RespiLogo />

        <Text style={[styles.title, { color: theme.textTitle }]}>
          {t('authLoginTitle')}
        </Text>

        <Text style={[styles.label, { color: loginTextColor }]}>
          {t('authLoginEmail')}:
        </Text>
        <GlassTextInput
          autoComplete="email"
          keyboardType="email-address"
          placeholder={t('exampleEmail')}
          placeholderTextColor={loginTextColor}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { color: loginTextColor }]}>
          {t('authLoginPassword')}:
        </Text>
        <GlassTextInputPassword
          autoComplete="current-password"
          placeholder={t('examplePassword')}
          placeholderTextColor={loginTextColor}
          value={password}
          onChangeText={setPassword}
        />

        <Text
          style={{
            color: '#1F2937',
            textAlign: 'left',
            fontSize: 12,
            alignSelf: 'flex-start',
            marginBottom: 15,
            textDecorationLine: 'underline',
            textShadowColor: 'rgba(255, 255, 255, 0.72)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 7,
          }}
          onPress={() =>
            router.push({
              pathname: '/forgot-password',
              params: { email },
            })
          }
        >
          {t('authLoginForgotPassword')}
        </Text>

        <GlassTextButton
          text={t('authLoginButton')}
          textColor={theme.onPrimary}
          onPress={handleSubmit}
          color={theme.primaryButton}
        />

        <View style={{ height: 20 }} />

        {/* Registro */}
        <Text
          style={{
            color: '#1F2937',
            textAlign: 'center',
            fontSize: 14,
            textShadowColor: 'rgba(255, 255, 255, 0.68)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 6,
          }}
        >
          {t('authLoginNoAccount')}{' '}
          <Text
            style={{ color: theme.primary, fontWeight: 'bold' }}
            onPress={() => router.replace('register')}
          >
            {t('authLoginRegister')}
          </Text>
        </Text>

        <View style={{ height: 5 }} />

        {!!error && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text style={[styles.error, { textAlign: 'center' }]}>
              {error}{' '}
              {showResend && (
                <Pressable
                  onPress={handleResendEmail}
                  disabled={isResendDisabled}
                >
                  <Text
                    style={{
                      color: isResendDisabled ? '#999' : theme.inputFocus,
                      textDecorationLine: isResendDisabled
                        ? 'none'
                        : 'underline',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}
                  >
                    {isResendDisabled
                      ? t('authResendDisabled', { timer })
                      : t('authResend')}
                  </Text>
                </Pressable>
              )}
            </Text>
          </View>
        )}
      </BlurViewCompat>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {Platform.OS === 'web' ? (
        <View style={{ width: '100%', alignItems: 'center' }}>
          {renderForm()}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            {renderForm()}
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

export default Login;
