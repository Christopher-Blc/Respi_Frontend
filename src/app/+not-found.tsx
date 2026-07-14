import { Link, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground, Text, View, Platform } from 'react-native';
import { BlurViewCompat } from '../components/general/BlurViewCompat';
import { GlassTextButton } from '../components/login/glassTextButton';
import { useAppTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import createNotFoundStyles from '../style/general/notFound.styles';

export default function NotFoundScreen() {
  const { isDarkMode, theme } = useAppTheme();
  const { t } = useTranslation();
  const styles = React.useMemo(() => createNotFoundStyles(theme), [theme]);
  const bgImage = isDarkMode
    ? require('../../assets/login-bg-dark.png')
    : require('../../assets/login-bg-light.png');

  // Si la ruta es /public/* o /api/*, redirige al servidor backend (redirección HTTP real)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/public/') || pathname.startsWith('/api/')) {
        // Redirección HTTP real para que el servidor backend la procese
        window.location.href = pathname;
      }
    }
  }, []);

  return (
    <>
      <Stack.Screen
        options={{ title: t('notFoundTitle'), headerShown: false }}
      />

      <ImageBackground
        source={bgImage}
        style={styles.background}
        imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <BlurViewCompat
          tint={isDarkMode ? 'dark' : 'light'}
          intensity={Platform.OS === 'web' ? 40 : 20}
          style={[
            styles.glass,
            {
              backgroundColor: isDarkMode
                ? 'rgba(22,22,22,0.5)'
                : 'rgba(255,255,255,0.2)',
            },
          ]}
        >
          <Text style={styles.errorCode}>404</Text>

          <Text style={styles.title}>{t('notFoundHeading')}</Text>

          <Text style={styles.message}>{t('notFoundMessage')}</Text>

          <View style={{ height: 30 }} />

          {/* Usamos un Link de expo-router envolviendo tu botón o un estilo similar */}
          <Link href="/" asChild>
            <GlassTextButton
              text={t('notFoundBackHome')}
              textColor={theme.onPrimary}
              color={theme.primarySoft}
            />
          </Link>
        </BlurViewCompat>
      </ImageBackground>
    </>
  );
}
