import React, { useMemo } from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';
import createModalCommonStyles from '../../style/general/modalCommon.styles';
import { useTranslation } from 'react-i18next';
import createLegalModalStyles from './legalRights.modal.styles';

interface ProfileLegalModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
}

export default function ProfileLegalModal({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
}: ProfileLegalModalProps) {
  const { theme, isDarkMode } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Estilos compartidos de la app basados en el tema
  const commonStyles = useMemo(() => createModalCommonStyles(theme), [theme]);

  // Estilos locales e interactivos calculados dinámicamente según el tema (Dark/Light)
  const styles = useMemo(
    () => createLegalModalStyles(theme, isDarkMode, insets),
    [theme, isDarkMode, insets],
  );

  return (
    <Modal
      visible={visible}
      onRequestClose={onConfirm}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View style={styles.container}>
        {/* Cabecera idéntica a tu MembresiaModal */}
        <View style={[commonStyles.headerContainer, { paddingTop: 20 }]}>
          <View style={commonStyles.headerRow}>
            {/* Espaciador invisible a la izquierda para centrar o emular la estructura de navegación */}
            <View style={{ width: 60 }} />

            <Text style={[commonStyles.titleText, { color: theme.textTitle }]}>
              {title}
            </Text>

            <TouchableOpacity onPress={onConfirm}>
              <Text style={commonStyles.headerText}>{t('commonClose')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cuerpo del documento legal con Scroll */}
        <ScrollView
          contentContainerStyle={[styles.body, { paddingTop: 70 }]}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.textCard}>
            <Text style={styles.legalText}>{message}</Text>
          </View>
        </ScrollView>

        {/* Botón inferior destacado y adaptativo para aceptar/entender */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
