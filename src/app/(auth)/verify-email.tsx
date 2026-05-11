import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import axios from 'axios';
import { useAppTheme } from '../../context/ThemeContext';

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
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;

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
  return await axios.post(`${VERIFY_EMAIL_ENDPOINT}`, { token });
};

export default function VerificationScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { token: tokenParam } = useLocalSearchParams<{
    token?: string | string[];
  }>();

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('Validando tu email...');
  const [token, setToken] = useState<string | null>(null);

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
  }, [token]);

  const statusColor = useMemo(() => {
    if (status === 'success') return '#2ed573';
    if (status === 'error') return '#ff4757';
    return theme.primaryButton;
  }, [status, theme.primaryButton]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.backgroundMain }]}>
      <View style={[styles.glow, { backgroundColor: `${statusColor}22` }]} />

      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.title, { color: theme.textTitle }]}>
          Verificacion
        </Text>

        {status === 'loading' ? (
          <View style={styles.centeredBlock}>
            <ActivityIndicator size="large" color={statusColor} />
            <Text style={[styles.message, { color: theme.textBody }]}>
              {message}
            </Text>
          </View>
        ) : (
          <View style={styles.centeredBlock}>
            <Text style={[styles.statusBadge, { color: statusColor }]}>
              {status === 'success'
                ? 'Verificacion completada'
                : 'Error de verificacion'}
            </Text>
            <Text style={[styles.message, { color: theme.textBody }]}>
              {message}
            </Text>
          </View>
        )}

        {status !== 'loading' && (
          <Pressable
            style={[styles.button, { backgroundColor: statusColor }]}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.buttonText}>Ir al Login</Text>
          </Pressable>
        )}
      </View>
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
    maxWidth: 460,
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  centeredBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    minHeight: 140,
  },
  statusBadge: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
