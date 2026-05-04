import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { tiposPistaStyles as styles } from '../../../style/admin/courtTypes.styles';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

const IMAGE_BASE_URL = 'https://respi.es/public';

const getImageUri = (imagePath: string | null | undefined) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${IMAGE_BASE_URL}/${imagePath}`;
};

type Props = {
  visible: boolean;
  isEditing?: boolean;
  nombre: string;
  setNombre: (value: string) => void;
  imagen: ImagePicker.ImagePickerAsset | null;
  setImagen: (value: ImagePicker.ImagePickerAsset | null) => void;
  existingImageUri?: string;
  onClose: () => void;
  onSave: () => void;
};

export function TipoCourtFormModal({
  visible,
  isEditing = false,
  nombre,
  setNombre,
  imagen,
  setImagen,
  existingImageUri,
  onClose,
  onSave,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.45,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagen(result.assets[0]);
    }
  };

  const previewUri = imagen?.uri || getImageUri(existingImageUri);

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

          <Text
            style={{
              color: theme.textBody,
              fontSize: 12,
              marginBottom: 8,
              fontWeight: '600',
            }}
          >
            Imagen
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity
              style={[
                styles.btnAction,
                {
                  backgroundColor: theme.primary + '18',
                  borderColor: theme.primarySoft,
                  borderWidth: 1,
                  marginBottom: 10,
                },
              ]}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={18} color={theme.textBody} />
              <Text
                style={{
                  color: theme.textBody,
                  fontWeight: '600',
                  marginLeft: 8,
                }}
              >
                {previewUri ? 'Cambiar imagen' : 'Seleccionar imagen'}
              </Text>
            </TouchableOpacity>

            {previewUri ? (
              <Image
                source={{ uri: previewUri }}
                style={{
                  width: 68,
                  height: 38,
                  borderRadius: 8,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: theme.primarySoft,
                }}
                resizeMode="cover"
              />
            ) : null}
          </View>

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
