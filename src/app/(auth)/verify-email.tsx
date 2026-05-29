import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { useAppTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import RespiLogo from '../../components/login/respiLogo';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { verifyEmailStyles as styles } from '../../style/auth/auth.styles';

type VerificationStatus = 'loading' | 'success' | 'error';

const VERIFY_EMAIL_ENDPOINT = '/auth/verify-email';

const normalizeToken = (value?: string | null) => {
  if (!value) return null;
  const parsed = decodeURIComponent(value).trim();
  return parsed.length > 0 ? parsed : null;
};

const getTokenFromParam = (
  tokenParam?: string | string[] | undefined,
): string | null => {
  if (Array.isArray(tokenParam)) {
    return normalizeToken(tokenParam[0]);
  }
  return normalizeToken(tokenParam);
};

const getTokenFromUrl = (url?: string | null): string | null => {
  if (!url) return null;
  const parsed = Linking.parse(url);
  const queryToken = parsed.queryParams?.token;

  if (Array.isArray(queryToken)) {
    return normalizeToken(String(queryToken[0]));
  }

  if (typeof queryToken === 'string') {
    return normalizeToken(queryToken);
  }

  return null;
};

const extractApiErrorMessage = (error: unknown) => {
  if ((error as { isAxiosError?: boolean })?.isAxiosError) {
    const data = (
      error as { response?: { data?: { message?: string | string[] } } }
    )?.response?.data;

    if (Array.isArray(data?.message)) {
      return data.message[0] || 'No se pudo verificar el email.';
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }
  }

  return 'No se pudo verificar el email. Intenta de nuevo en unos minutos.';
};

const verifyEmailToken = async (token: string) => {
  console.log('ruta:', VERIFY_EMAIL_ENDPOINT);
  return await api.post(VERIFY_EMAIL_ENDPOINT, { token });
};

export default function VerificationScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useAppTheme();
  const { token: tokenParam } = useLocalSearchParams<{
    token?: string | string[];
  }>();

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('Validando tu email...');
  const [token, setToken] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const resolveToken = async () => {
      const fromParams = getTokenFromParam(tokenParam);
      if (fromParams) {
        if (isMounted) setToken(fromParams);
        return;
      }

      const initialUrl = await Linking.getInitialURL();
      const fromUrl = getTokenFromUrl(initialUrl);

      if (!isMounted) return;

      if (!fromUrl) {
        setStatus('error');
        setMessage('Enlace invalido: falta el token de verificacion.');
        return;
      }

      setToken(fromUrl);
    };

    void resolveToken();

    return () => {
      isMounted = false;
    };
  }, [tokenParam]);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const runVerification = async () => {
      setStatus('loading');
      setMessage('Verificando tu cuenta...');

      try {
        await verifyEmailToken(token);

        if (!isMounted) return;

        setStatus('success');
        setMessage('Email verificado correctamente. Ya puedes iniciar sesion.');
      } catch (error) {
        if (!isMounted) return;

        setStatus('error');
        setMessage(extractApiErrorMessage(error));
      }
    };

    void runVerification();

    return () => {
      isMounted = false;
    };
  }, [token, retryCount]);

  const statusColor = useMemo(() => {
    if (status === 'success') return '#2ed573';
    if (status === 'error') return '#ff4757';
    return theme.primaryButton;
  }, [status, theme.primaryButton]);

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
        <Text style={[styles.subtitle, { color: theme.textBody }]}>
          Verificacion de email
        </Text>

        <View style={styles.centeredBlock}>
          {status === 'loading' && (
            <ActivityIndicator size="large" color={statusColor} />
          )}

          <Text style={[styles.statusBadge, { color: statusColor }]}>
            {status === 'loading'
              ? 'Validando enlace'
              : status === 'success'
                ? 'Cuenta activada'
                : 'No se pudo verificar'}
          </Text>

          <Text style={[styles.message, { color: theme.textBody }]}>
            {message}
          </Text>
        </View>

        {status === 'error' && token && (
          <GlassTextButton
            text="Reintentar"
            textColor={theme.onPrimary}
            color={theme.primaryButton}
            onPress={() => setRetryCount((value) => value + 1)}
            style={styles.actionButton}
          />
        )}

        {status !== 'loading' && (
          <GlassTextButton
            text="Ir al Login"
            textColor={theme.onPrimary}
            color={status === 'success' ? theme.primaryButton : theme.primary}
            onPress={() => router.replace('/(auth)/login')}
            style={styles.actionButton}
          />
        )}
      </BlurViewCompat>
    </View>
  );
}

