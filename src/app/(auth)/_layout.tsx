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
import { useAppTheme } from '../../context/ThemeContext';
import { getAppLanguage, setAppLanguage } from '../../i18n';
import { LanguagePickerModal } from '../../components/login/languagePickerModal';

export default function AuthLayout() {
  const { isDarkMode, toggleTheme, theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const isCompactControls =
    Platform.OS !== 'web' || width <= 520 || height <= 820;

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
          { borderColor: theme.textSubtle },
        ]}
      >
        <Pressable
          onPress={toggleTheme}
          style={[
            styles.controlButton,
            isCompactControls && styles.controlButtonCompact,
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
