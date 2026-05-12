import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getAppLanguage, LANGUAGE_OPTIONS, setAppLanguage } from '../../i18n';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function IdiomaModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
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
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: 'row',
          paddingTop: 20,
          paddingBottom: 8,
          justifyContent: 'space-between',
          backgroundColor: theme.backgroundMain,
        }}
      >
        <View style={{ paddingLeft: 20 }}>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Segoe UI',
                fontWeight: '500',
                color: theme.textTitle,
              }}
            >
              {t('commonCancel')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingRight: 20 }}>
          <TouchableOpacity onPress={handleSave}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Segoe UI',
                fontWeight: '500',
                color: saveActive ? theme.textTitle : theme.grayPlaceholder,
              }}
            >
              {t('commonSave')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: theme.backgroundMain,
          paddingHorizontal: 18,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 420,
            minHeight: 320,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              borderRadius: 140,
              top: '20%',
              alignSelf: 'center',
              opacity: 0.9,
              backgroundColor: `${theme.primaryButton}22`,
            }}
          />

          <BlurView
            tint={theme.backgroundMain === '#FFFFFF' ? 'light' : 'dark'}
            intensity={20}
            style={{
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.surface,
              overflow: 'hidden',
              paddingHorizontal: 18,
              paddingVertical: 18,
              backgroundColor: `${theme.surfaceMuted}CC`,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: `${theme.primaryButton}22`,
                  marginRight: 10,
                }}
              >
                <Ionicons
                  name="language-outline"
                  size={22}
                  color={theme.primaryButton}
                />
              </View>
              <Text
                style={{
                  fontSize: 19,
                  color: theme.textTitle,
                  fontFamily: 'Segoe UI',
                  fontWeight: '700',
                }}
              >
                {t('languageTitle')}
              </Text>
            </View>

            <Text
              style={{
                color: theme.textBody,
                fontSize: 13,
                lineHeight: 19,
                marginBottom: 12,
              }}
            >
              {t('languageDescription')}
            </Text>

            {LANGUAGE_OPTIONS.map((language, index) => {
              const isSelected = selectedLanguage === language.code;
              const isLastOption = index === LANGUAGE_OPTIONS.length - 1;

              return (
                <TouchableOpacity
                  key={language.code}
                  onPress={() => setSelectedLanguage(language.code)}
                  style={{
                    borderWidth: 1,
                    borderColor: isSelected ? theme.primary : theme.borderMain,
                    backgroundColor: isSelected
                      ? `${theme.primary}20`
                      : theme.backgroundCard,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: isLastOption ? 16 : 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
                    {t(language.labelKey)}
                  </Text>
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

            <Button mode="contained" onPress={handleSave}>
              {saveActive ? t('commonSave') : t('commonClose')}
            </Button>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}
