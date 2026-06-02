import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import createModalDarkModeStyles from '../../style/profile/modalDarkMode.styles';
import { useTranslation } from 'react-i18next';
import { ThemePalette } from '../../theme';

const lightModeExample = require('../../../assets/exampleLightMode.jpeg');
const darkModeExample = require('../../../assets/exampleDarkMode.jpeg');

interface Props {
  visible: boolean;
  isDarkMode: boolean;
  isSystemTheme: boolean;
  themePalette: ThemePalette;
  onPreview: (nextValue: boolean) => void;
  onSystemPreview: (enabled: boolean) => void;
  onThemePalettePreview: (palette: ThemePalette) => void;
  onSave: (
    nextDarkModeValue: boolean,
    nextSystemThemeValue: boolean,
    nextThemePalette: ThemePalette,
  ) => void;
  onClose: () => void;
}

export default function DarkModeModal({
  visible,
  isDarkMode,
  isSystemTheme,
  themePalette,
  onPreview,
  onSystemPreview,
  onThemePalettePreview,
  onSave,
  onClose,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const themeColorLabel = t('profileThemeColor', {
    defaultValue: 'Theme color',
  });
  const themeOrangeLabel = t('profileThemeOrange', { defaultValue: 'ResPi' });
  const themeBlueLabel = t('profileThemeBlue', { defaultValue: 'Blue' });
  const themeGreenLabel = t('profileThemeGreen', { defaultValue: 'Green' });
  const themeRedLabel = t('profileThemeRed', { defaultValue: 'Red' });
  const themeCyanLabel = t('profileThemeCyan', { defaultValue: 'Cyan' });
  const themePastelPinkLabel = t('profileThemePastelPink', {
    defaultValue: 'Pastel Pink',
  });
  const themeSkyBlueLabel = t('profileThemeSkyBlue', {
    defaultValue: 'Sky Blue',
  });
  const isWeb = Platform.OS === 'web';
  const styles = React.useMemo(
    () => createModalDarkModeStyles(theme, isWeb),
    [theme, isWeb],
  );
  const [localValue, setLocalValue] = useState(isDarkMode);
  const [localSystemValue, setLocalSystemValue] = useState(isSystemTheme);
  const [localThemePalette, setLocalThemePalette] =
    useState<ThemePalette>(themePalette);
  // Capture the values when the modal opens, ignoring live preview prop changes
  const initialRef = useRef({ isDarkMode, isSystemTheme, themePalette });
  const isLightSelected = !localValue;
  const isDarkSelected = localValue;
  const switchTrackOff = theme.borderAccentSoft;
  const switchTrackOn = theme.primary;
  const switchThumbOn = theme.onPrimary;
  const switchThumbOff = theme.surfaceMuted;

  const handlePreviewChange = (nextValue: boolean) => {
    setLocalValue(nextValue);
    onPreview(nextValue);
  };

  const handleSystemChange = (enabled: boolean) => {
    setLocalSystemValue(enabled);
    onSystemPreview(enabled);
  };

  const handlePaletteChange = (palette: ThemePalette) => {
    setLocalThemePalette(palette);
    onThemePalettePreview(palette);
  };

  const paletteOptions: Array<{
    value: ThemePalette;
    label: string;
    color: string;
  }> = [
    {
      value: 'orange',
      label: themeOrangeLabel,
      color: '#CA8E0E',
    },
    {
      value: 'blue',
      label: themeBlueLabel,
      color: '#2563EB',
    },
    {
      value: 'green',
      label: themeGreenLabel,
      color: '#2E7D32',
    },
    {
      value: 'red',
      label: themeRedLabel,
      color: '#C62828',
    },
    {
      value: 'cyan',
      label: themeCyanLabel,
      color: '#00838F',
    },
    {
      value: 'pastelPink',
      label: themePastelPinkLabel,
      color: '#F0A8D8',
    },
    {
      value: 'skyBlue',
      label: themeSkyBlueLabel,
      color: '#87CEEB',
    },
  ];

  useEffect(() => {
    if (visible) {
      initialRef.current = { isDarkMode, isSystemTheme, themePalette };
      setLocalValue(isDarkMode);
      setLocalSystemValue(isSystemTheme);
      setLocalThemePalette(themePalette);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const hasChanged =
    localValue !== initialRef.current.isDarkMode ||
    localSystemValue !== initialRef.current.isSystemTheme ||
    localThemePalette !== initialRef.current.themePalette;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.headerContainer, { paddingTop: 20 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerText}>{t('commonCancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              onSave(localValue, localSystemValue, localThemePalette)
            }
            disabled={!hasChanged}
          >
            <Text
              style={[
                styles.headerText,
                hasChanged ? styles.saveText : undefined,
              ]}
            >
              {t('commonSave')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.previewSection}>
        <View style={styles.previewSection}>
          <View style={styles.previewRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handlePreviewChange(false)}
              disabled={localSystemValue}
              style={[
                styles.previewCard,
                isLightSelected ? styles.previewCardSelected : null,
                localSystemValue ? styles.disabledPreview : null,
              ]}
            >
              <Image
                source={lightModeExample}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <Text style={styles.previewLabel}>{t('profileThemeLight')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handlePreviewChange(true)}
              disabled={localSystemValue}
              style={[
                styles.previewCard,
                isDarkSelected ? styles.previewCardSelected : null,
                localSystemValue ? styles.disabledPreview : null,
              ]}
            >
              <Image
                source={darkModeExample}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <Text style={styles.previewLabel}>{t('profileThemeDark')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingsCard}>
            <Text style={styles.title}>{t('profileDarkMode')}</Text>

            <Text style={styles.description}>
              {t('profileDarkModeDescription')}
            </Text>

            <View style={styles.toggleGroup}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>{t('profileSystem')}</Text>
                <Switch
                  value={localSystemValue}
                  onValueChange={handleSystemChange}
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={localSystemValue ? switchThumbOn : switchThumbOff}
                  trackColor={{
                    false: switchTrackOff,
                    true: switchTrackOn,
                  }}
                />
              </View>

              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>
                  {localValue ? t('profileEnabled') : t('profileDisabled')}
                </Text>
                <Switch
                  value={localValue}
                  onValueChange={handlePreviewChange}
                  disabled={localSystemValue}
                  ios_backgroundColor={switchTrackOff}
                  thumbColor={localValue ? switchThumbOn : switchThumbOff}
                  trackColor={{
                    false: switchTrackOff,
                    true: switchTrackOn,
                  }}
                />
              </View>
            </View>

            <View style={styles.paletteSection}>
              <Text style={styles.paletteTitle}>{themeColorLabel}</Text>
              <View style={styles.paletteRow}>
                {paletteOptions.map((palette) => {
                  const isSelected = localThemePalette === palette.value;

                  return (
                    <TouchableOpacity
                      key={palette.value}
                      style={[
                        styles.paletteChip,
                        isSelected ? styles.paletteChipSelected : null,
                      ]}
                      onPress={() => handlePaletteChange(palette.value)}
                    >
                      <View
                        style={[
                          styles.paletteDot,
                          { backgroundColor: palette.color },
                        ]}
                      />
                      <Text style={styles.paletteChipLabel}>
                        {palette.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}
