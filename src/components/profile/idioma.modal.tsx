import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '../../i18n';

interface Props {
  visible: boolean;
  onClose: () => void; //funcion para avisar al padre
}

export default function IdiomaModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === 'en' ? 'en' : 'es';

  return (
    <Modal
      visible={visible} // Usa directamente la prop del padre
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: theme.backgroundMain,
        }}
      >
        <View
          style={{
            width: '86%',
            maxWidth: 380,
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: theme.surfaceMuted,
            borderRadius: 20,
            borderColor: theme.surface,
            borderWidth: 1,
          }}
        >
          <Text
            style={{ fontSize: 18, marginBottom: 8, color: theme.textTitle }}
          >
            {t('languageTitle')}
          </Text>
          <Text
            style={{ fontSize: 13, marginBottom: 16, color: theme.textBody }}
          >
            {t('languageDescription')}
          </Text>

          <TouchableOpacity
            onPress={() => setAppLanguage('es')}
            style={{
              borderWidth: 1,
              borderColor:
                currentLanguage === 'es' ? theme.primary : theme.borderMain,
              backgroundColor:
                currentLanguage === 'es'
                  ? theme.primary + '20'
                  : theme.backgroundCard,
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
              {t('languageSpanish')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setAppLanguage('en')}
            style={{
              borderWidth: 1,
              borderColor:
                currentLanguage === 'en' ? theme.primary : theme.borderMain,
              backgroundColor:
                currentLanguage === 'en'
                  ? theme.primary + '20'
                  : theme.backgroundCard,
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
              {t('languageEnglish')}
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={onClose} // Llama a la función del padre
          >
            {t('commonClose')}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
