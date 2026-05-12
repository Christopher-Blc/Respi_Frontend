import React, { useState } from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
  Pressable,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Slot } from 'expo-router';
import { IconButton } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { getAppLanguage, setAppLanguage } from '../../i18n';
import { LanguagePickerModal } from '../../components/login/languagePickerModal';
import { GlassTextButton } from '../../components/login/glassTextButton';

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

  const bgImage = isDarkMode
    ? require('../../../assets/login-bg-dark.png')
    : require('../../../assets/login-bg-light.png');

  return (
    <ImageBackground
      source={bgImage}
      style={styles.background}
      imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
    >
      <View style={styles.container}>
        <Slot />
      </View>

      <BlurView
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
      </BlurView>

      <LanguagePickerModal
        visible={showLanguagePicker}
        selectedLanguage={currentLanguage}
        onSelect={handleSelectLanguage}
        onClose={() => setShowLanguagePicker(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  controlsWrap: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 170,
    borderRadius: 16,
    borderWidth: 0.8,
    padding: 8,
    gap: 8,
    overflow: 'hidden',
  },
  controlsWrapCompact: {
    width: 64,
    alignItems: 'center',
  },
  controlsWrapSmallWeb: {
    top: 12,
    right: 12,
    left: 'auto',
    flexDirection: 'row',
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 4,
  },
  controlsWrapLargeWeb: {
    width: 230,
    padding: 10,
    gap: 10,
  },
  controlButtonSmallWeb: {
    width: 44,
    height: 44,
    minHeight: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 0,
  },
  controlButton: {
    width: '100%',
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  controlButtonCompact: {
    width: 48,
    height: 48,
    minHeight: 48,
    borderRadius: 24,
    justifyContent: 'center',
    paddingRight: 0,
  },
  controlIcon: {
    margin: 0,
  },
  controlText: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
});
