import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TipoPista } from '../../../../types/types';
import { useAdminTiposPista } from '../../../../hooks/useAdminTiposPista';
import { tiposPistaStyles as styles } from '../../../../style/admin/tiposPista.styles';
import { TipoPistaCard } from '../../../../components/admin/tipoPista/TipoPistaCard';
import { TipoPistaFormModal } from '../../../../components/admin/tipoPista/TipoPistaFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { useTranslation } from 'react-i18next';

export default function AdminTiposPista() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const {
    filteredTiposPista,
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    nombre,
    setNombre,
    tipoPistaAEditar,
    openModal,
    openEditModal,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteModal,
    errorModal,
    setErrorModal,
  } = useAdminTiposPista();

  const renderCard = ({ item }: { item: TipoPista }) => (
    <TipoPistaCard
      item={item}
      theme={theme}
      onEdit={openEditModal}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundMain }]}>
      <View style={[styles.headerActions, { paddingTop: headerHeight + 10 }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.backgroundCard,
              borderColor: theme.primarySoft,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.textBody} />
          <TextInput
            placeholder={t('adminSearchByName')}
            placeholderTextColor={theme.textBody + '80'}
            style={[styles.searchInput, { color: theme.textTitle }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textBody} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.addBtn,
            {
              backgroundColor: theme.primary + '18',
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={openModal}
        >
          <Ionicons name="add" size={30} color={theme.textBody} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredTiposPista}
          renderItem={renderCard}
          keyExtractor={(item) => item.tipo_pista_id.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
        />
      )}

      <TipoPistaFormModal
        visible={modalVisible}
        isEditing={Boolean(tipoPistaAEditar)}
        nombre={nombre}
        setNombre={setNombre}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />

      {/* Delete confirm / warning modal */}
      <SessionExpiredModal
        visible={deleteModal.visible}
        title={
          deleteModal.canDelete
            ? t('adminDeleteCourtTitle', { name: deleteModal.item?.nombre })
            : t('adminCannotDeleteTitle')
        }
        message={deleteModal.message}
        confirmText={
          deleteModal.canDelete ? t('adminDelete') : t('commonUnderstood')
        }
        cancelText={t('commonCancel')}
        onConfirm={deleteModal.canDelete ? confirmDelete : cancelDelete}
        onCancel={deleteModal.canDelete ? cancelDelete : undefined}
      />

      {/* Error modal */}
      <SessionExpiredModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        confirmText={t('commonUnderstood')}
        onConfirm={() =>
          setErrorModal({ visible: false, title: '', message: '' })
        }
      />
    </View>
  );
}
