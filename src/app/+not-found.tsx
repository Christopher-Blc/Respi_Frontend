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

  // Si la ruta es /public/*, /api/*, o un archivo estático, manéjalo según corresponda
  useEffect(() => {
    if (Platform.OS === 'web') {
      const pathname = window.location.pathname;

      // Si es /public/algo.html, reescribe a /public/algo para que Expo Router la procese
      if (pathname.match(/^\/public\/.*\.html$/)) {
        const pathWithoutHtml = pathname.replace(/\.html$/, '');
        window.location.href = pathWithoutHtml;
        return;
      }

      // Si es /public/* o /api/*, o archivos estáticos (.png, .jpg, .css, .js, .json, etc)
      // redirige al backend
      const isPublicPath = pathname.startsWith('/public/');
      const isApiPath = pathname.startsWith('/api/');
      const isStaticFile =
        /\.(png|jpg|jpeg|gif|css|js|json|svg|woff|woff2|ttf|eot)$/.test(
          pathname,
        );

      if (
        (isPublicPath && isStaticFile) ||
        isApiPath ||
        (isStaticFile && !pathname.startsWith('/public/'))
      ) {
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
