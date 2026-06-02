import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { getAppLanguage, LANGUAGE_OPTIONS, setAppLanguage } from '../../i18n';
import { Ionicons } from '@expo/vector-icons';
import createModalCommonStyles from '../../style/general/modalCommon.styles';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function IdiomaModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createModalCommonStyles(theme), [theme]);
  const currentLanguage = getAppLanguage(
    i18n.resolvedLanguage || i18n.language,
  );
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  useEffect(() => {
    if (visible) {
      setSelectedLanguage(currentLanguage);
    }
  }, [visible, currentLanguage]);

  const saveActive = useMemo(
    () => selectedLanguage !== currentLanguage,
    [selectedLanguage, currentLanguage],
  );

  const handleSave = async () => {
    if (!saveActive) {
      onClose();
      return;
    }

    await setAppLanguage(selectedLanguage);
    onClose();
  };

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

          <TouchableOpacity onPress={handleSave}>
            <Text
              style={[
                styles.headerText,
                saveActive ? styles.saveText : undefined,
              ]}
            >
              {/* BUG-UX-013: Use selected language for the save button label */}
              {saveActive
                ? i18next.t('commonSave', { lng: selectedLanguage })
                : t('commonClose')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingsCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.titleIcon,
                { backgroundColor: `${theme.primaryButton}22` },
              ]}
            >
              <Ionicons
                name="language-outline"
                size={22}
                color={theme.primaryButton}
              />
            </View>
            <Text style={styles.titleText}>{t('languageTitle')}</Text>
          </View>

          <Text style={styles.description}>{t('languageDescription')}</Text>

          {LANGUAGE_OPTIONS.map((language, index) => {
            const isSelected = selectedLanguage === language.code;
            const isLastOption = index === LANGUAGE_OPTIONS.length - 1;

            return (
              <TouchableOpacity
                key={language.code}
                onPress={() => setSelectedLanguage(language.code)}
                style={[
                  styles.optionRow,
                  isSelected ? styles.optionRowSelected : null,
                  isLastOption ? { marginBottom: 16 } : undefined,
                ]}
              >
                <Text style={styles.optionText}>{t(language.labelKey)}</Text>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={theme.primaryButton}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
