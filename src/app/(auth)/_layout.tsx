import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  View,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Slot } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { getAppLanguage, setAppLanguage } from '../../i18n';
import { LanguagePickerModal } from '../../components/login/languagePickerModal';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { authLayoutStyles as styles } from '../../style/auth/auth.styles';

const SMALL_WEB_BREAKPOINT = 900;

export default function AuthLayout() {
  const { isDarkMode, toggleTheme, theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const isMobile = Platform.OS !== 'web';
  const isSmallWeb = Platform.OS === 'web' && width <= SMALL_WEB_BREAKPOINT;
  const isLargeWeb = Platform.OS === 'web' && width > SMALL_WEB_BREAKPOINT;
  const isCornerHorizontalControls = isMobile || isSmallWeb;
  const isCompactControls = isMobile || isSmallWeb;

  const currentLanguage = getAppLanguage(
    i18n.resolvedLanguage || i18n.language,
  );

  const handleSelectLanguage = async (
    language: ReturnType<typeof getAppLanguage>,
  ) => {
    await setAppLanguage(language);
    setShowLanguagePicker(false);
  };

  const bgDark = require('../../../assets/login-bg-dark.png');
  const bgLight = require('../../../assets/login-bg-light.png');

  // Precarrega ambdues imatges i fa crossfade animat entre elles
  // evita el flash/delay quan canvia el tema o s'arrenca l'app
  const darkOpacity = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(darkOpacity, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  return (
    <View style={styles.background}>
      {/* Ambdues imatges sempre en memòria — crossfade animat entre elles */}
      <Image
        source={bgLight}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode="cover"
      />
      <Animated.Image
        source={bgDark}
        style={[
          StyleSheet.absoluteFill,
          { width: '100%', height: '100%', opacity: darkOpacity },
        ]}
        resizeMode="cover"
      />

      <View style={styles.container}>
        <Slot />
      </View>

      <BlurViewCompat
        tint={isDarkMode ? 'dark' : 'light'}
        intensity={35}
        style={[
          styles.controlsWrap,
          isCompactControls && styles.controlsWrapCompact,
          isCornerHorizontalControls && styles.controlsWrapSmallWeb,
          isLargeWeb && styles.controlsWrapLargeWeb,
          isMobile && { top: Math.max(insets.top + 8, 12) },
          { borderColor: theme.textSubtle },
        ]}
      >
        <Pressable
          onPress={toggleTheme}
          style={[
            styles.controlButton,
            isCompactControls && styles.controlButtonCompact,
            isCornerHorizontalControls && styles.controlButtonSmallWeb,
            {
              borderColor: theme.borderInput,
              backgroundColor: theme.inputBackground,
            },
          ]}
        >
          <IconButton
            icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
            iconColor={theme.textTitle}
            size={18}
            style={styles.controlIcon}
          />
          {!isCompactControls && (
            <Text style={[styles.controlText, { color: theme.textTitle }]}>
              {t('profileDarkMode')}
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => setShowLanguagePicker(true)}
          style={[
            styles.controlButton,
            isCompactControls && styles.controlButtonCompact,
            isCornerHorizontalControls && styles.controlButtonSmallWeb,
            {
              borderColor: theme.borderInput,
              backgroundColor: theme.inputBackground,
            },
          ]}
        >
          <IconButton
            icon="translate"
            iconColor={theme.textTitle}
            size={18}
            style={styles.controlIcon}
          />
          {!isCompactControls && (
            <Text style={[styles.controlText, { color: theme.textTitle }]}>
              {t('languageTitle')} ({currentLanguage.toUpperCase()})
            </Text>
          )}
        </Pressable>
      </BlurViewCompat>

      <LanguagePickerModal
        visible={showLanguagePicker}
        selectedLanguage={currentLanguage}
        onSelect={handleSelectLanguage}
        onClose={() => setShowLanguagePicker(false)}
      />
    </View>
  );
}

