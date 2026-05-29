import React from 'react';
import { FlatList, Modal, Pressable, Text } from 'react-native';
import { BlurViewCompat } from '../general/BlurViewCompat';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';
import { languagePickerModalStyles as styles } from '../../style/auth/loginComponents.styles';
import { AppLanguage, LANGUAGE_OPTIONS } from '../../i18n';

type Props = {
  visible: boolean;
  selectedLanguage: AppLanguage;
  onSelect: (language: AppLanguage) => void;
  onClose: () => void;
};

export const LanguagePickerModal: React.FC<Props> = ({
  visible,
  selectedLanguage,
  onSelect,
  onClose,
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const { t } = useTranslation();
  const options = LANGUAGE_OPTIONS.map((option) => ({
    ...option,
    label: t(option.labelKey),
  }));

  const handleClose = () => {
    onClose();
  };

  const handleSelect = (language: AppLanguage) => {
    onSelect(language);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable onPress={() => {}}>
          <BlurViewCompat
            tint={isDarkMode ? 'dark' : 'light'}
            intensity={50}
            style={[styles.card, { borderColor: theme.textSubtle }]}
          >
            <Text style={[styles.title, { color: theme.textTitle }]}>
              {t('languageTitle')}
            </Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isActive = item.code === selectedLanguage;

                return (
                  <Pressable
                    onPress={() => handleSelect(item.code)}
                    style={[
                      styles.row,
                      {
                        borderBottomColor: theme.borderInput,
                        backgroundColor: isActive
                          ? `${theme.primaryButton}28`
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.languageName,
                        {
                          color: isActive ? theme.inputFocus : theme.textBody,
                          fontWeight: isActive ? '700' : '400',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.code,
                        {
                          color: isActive
                            ? theme.inputFocus
                            : theme.grayLabelText,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                    >
                      {item.code.toUpperCase()}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </BlurViewCompat>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

