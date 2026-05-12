import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../context/ThemeContext';
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
          <BlurView
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
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: 300,
    maxHeight: 420,
    borderRadius: 22,
    borderWidth: 0.8,
    overflow: 'hidden',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  list: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderBottomWidth: 0.3,
    gap: 10,
  },
  languageName: {
    flex: 1,
    fontSize: 14,
  },
  code: {
    fontSize: 13,
  },
});
