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
import { API_PUBLIC_URL } from '../../../constants';

const getImageUri = (imagePath: string | null | undefined) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_PUBLIC_URL}/${imagePath.replace(/^\//, '')}`;
};

type Props = {
  visible: boolean;
  isEditing?: boolean;
  nombre: string;
  setNombre: (value: string) => void;
  imagen: ImagePicker.ImagePickerAsset | null;
  setImagen: (value: ImagePicker.ImagePickerAsset | null) => void;
  removeExistingImage: boolean;
  setRemoveExistingImage: (value: boolean) => void;
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
  removeExistingImage,
  setRemoveExistingImage,
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
      setRemoveExistingImage(false);
    }
  };

  const previewUri =
    imagen?.uri || (removeExistingImage ? null : getImageUri(existingImageUri));

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
              style={{
                flex: 1,
                minHeight: 52,
                borderRadius: 12,
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: theme.primarySoft,
                backgroundColor: theme.primary + '10',
                paddingHorizontal: 14,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={pickImage}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <Ionicons
                  name={previewUri ? 'sync-outline' : 'image-outline'}
                  size={17}
                  color={theme.primary}
                />
                <Text style={{ color: theme.textTitle, fontWeight: '600' }}>
                  {previewUri ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textSubtitle}
              />
            </TouchableOpacity>

            {previewUri ? (
              <Image
                source={{ uri: previewUri }}
                style={{
                  width: 78,
                  height: 44,
                  borderRadius: 8,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: theme.primarySoft,
                }}
                resizeMode="cover"
              />
            ) : null}
          </View>

          {previewUri && isEditing ? (
            <TouchableOpacity
              style={{ marginBottom: 14, alignSelf: 'flex-start' }}
              onPress={() => {
                setImagen(null);
                setRemoveExistingImage(true);
              }}
            >
              <Text
                style={{ color: theme.danger ?? '#d32f2f', fontWeight: '700' }}
              >
                Eliminar imagen
              </Text>
            </TouchableOpacity>
          ) : null}

          <Text
            style={{ color: theme.textBody, fontSize: 11, marginBottom: 10 }}
          >
            Recomendado 16:9, maximo 5MB
          </Text>

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
