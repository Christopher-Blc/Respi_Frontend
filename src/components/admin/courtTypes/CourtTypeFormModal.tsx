import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { tiposPistaStyles as styles } from '../../../style/admin/courtTypes.styles';
import { useTranslation } from 'react-i18next';

type Props = {
  visible: boolean;
  isEditing?: boolean;
  nombre: string;
  setNombre: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export function TipoCourtFormModal({
  visible,
  isEditing = false,
  nombre,
  setNombre,
  onClose,
  onSave,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundCard },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textTitle }]}>
              {isEditing
                ? t('adminCourtTypeEditTitle')
                : t('adminCourtTypeNewTitle')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={26} color={theme.textTitle} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: theme.textBody,
              fontSize: 12,
              marginBottom: 4,
              fontWeight: '600',
            }}
          >
            {t('adminNameLabel')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.textTitle, borderColor: theme.primarySoft },
            ]}
            placeholder={t('adminCourtTypePlaceholder')}
            placeholderTextColor={theme.textBody + '80'}
            value={nombre}
            onChangeText={setNombre}
          />

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={onSave}
          >
            <Text style={styles.saveBtnText}>
              {isEditing ? t('adminSaveChanges') : t('adminCreateType')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
