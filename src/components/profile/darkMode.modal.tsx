import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Platform } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import createModalDarkModeStyles from '../../style/modalDarkMode.styles';

const lightModeExample = require('../../../assets/exampleLightMode.jpeg');
const darkModeExample = require('../../../assets/exampleDarkMode.jpeg');

interface Props {
  visible: boolean;
  isDarkMode: boolean;
  isSystemTheme: boolean;
  onPreview: (nextValue: boolean) => void;
  onSystemPreview: (enabled: boolean) => void;
  onSave: (nextDarkModeValue: boolean, nextSystemThemeValue: boolean) => void;
  onClose: () => void;
}

export default function DarkModeModal({
  visible,
  isDarkMode,
  isSystemTheme,
  onPreview,
  onSystemPreview,
  onSave,
  onClose,
}: Props) {
  const { theme } = useAppTheme();
  const isWeb = Platform.OS === 'web';
  const styles = React.useMemo(
    () => createModalDarkModeStyles(theme, isWeb),
    [theme, isWeb],
  );
  const [localValue, setLocalValue] = useState(isDarkMode);
  const [localSystemValue, setLocalSystemValue] = useState(isSystemTheme);
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

  useEffect(() => {
    if (visible) {
      setLocalValue(isDarkMode);
      setLocalSystemValue(isSystemTheme);
    }
  }, [visible, isDarkMode, isSystemTheme]);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSave(localValue, localSystemValue)}
          >
            <Text style={[styles.headerText, styles.saveText]}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            <Text style={styles.previewLabel}>Claro</Text>
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
            <Text style={styles.previewLabel}>Oscuro</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingsCard}>
          <Text style={styles.title}>Modo oscuro</Text>

          <Text style={styles.description}>
            Activa o desactiva el modo oscuro para la pantalla de perfil.
          </Text>

          <View style={styles.toggleGroup}>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Sistema</Text>
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
                {localValue ? 'Activado' : 'Desactivado'}
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
        </View>
      </View>
    </Modal>
  );
}
