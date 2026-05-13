import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CourtType } from '../../../../types/types';
import { useAdminCourtTypes } from '../../../../hooks/useAdminCourtTypes';
import { tiposPistaStyles as styles } from '../../../../style/admin/courtTypes.styles';
import { TipoCourtCard } from '../../../../components/admin/courtTypes/CourtTypeCard';
import { TipoCourtFormModal } from '../../../../components/admin/courtTypes/CourtTypeFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { useTranslation } from 'react-i18next';
import { API_PUBLIC_URL } from '../../../../constants';
import { addSoftBreaks } from '../../../../utils/addSoftBreaks';

const getImageUri = (
  imagePath: string | null | undefined,
): string | undefined => {
  if (!imagePath) return undefined;
  return `${API_PUBLIC_URL}/${imagePath}`;
};

export default function AdminTiposPista() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tableMinWidth = 680;
  const useHorizontalTableScroll = width < tableMinWidth + 32;
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;
  const [viewMode, setViewMode] = React.useState<'cards' | 'list'>('cards');

  const {
    filteredTiposPista,
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    closeModal,
    nombre,
    setNombre,
    imagen,
    setImagen,
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
  } = useAdminCourtTypes();

  const renderCard = ({ item }: { item: CourtType }) => {
    const cardWidthStyle =
      cardsColumns === 1
        ? { width: '100%' as const }
        : { maxWidth: cardsColumns === 2 ? 560 : 440 };

    return (
      <View style={[styles.cardColumn, cardWidthStyle]}>
        <TipoCourtCard
          item={item}
          theme={theme}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: 10, backgroundColor: theme.backgroundMain },
      ]}
    >
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
            styles.squareBtn,
            {
              backgroundColor: theme.primary + '18',
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={() => setViewMode(viewMode === 'cards' ? 'list' : 'cards')}
        >
          <Ionicons
            name={viewMode === 'cards' ? 'list-outline' : 'grid-outline'}
            size={22}
            color={theme.textBody}
          />
        </TouchableOpacity>
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
      ) : viewMode === 'cards' ? (
        <FlatList
          key={`court-types-cards-${cardsColumns}`}
          data={filteredTiposPista}
          renderItem={renderCard}
          numColumns={cardsColumns}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={cardsColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
        />
      ) : (
        <ScrollView
          horizontal={useHorizontalTableScroll}
          showsHorizontalScrollIndicator={useHorizontalTableScroll}
          bounces={false}
          contentContainerStyle={
            useHorizontalTableScroll ? { paddingHorizontal: 16 } : undefined
          }
        >
          <View
            style={[
              styles.tableWrap,
              {
                borderColor: theme.primarySoft,
                backgroundColor: theme.backgroundCard,
              },
              useHorizontalTableScroll
                ? { minWidth: tableMinWidth, marginHorizontal: 0 }
                : undefined,
            ]}
          >
            <View
              style={[
                styles.tableHeader,
                {
                  borderBottomColor: theme.primarySoft,
                  backgroundColor: theme.primary + '10',
                },
              ]}
            >
              <Text
                style={[
                  styles.colName,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Nombre
              </Text>
              <View style={styles.colImage}>
                <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
                  Imagen
                </Text>
              </View>
              <View style={styles.colCount}>
                <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
                  Pistas
                </Text>
              </View>
              <View style={styles.colActions}>
                <Text style={{ color: theme.textTitle, fontWeight: '700' }}>
                  Acciones
                </Text>
              </View>
            </View>
            <FlatList
              data={filteredTiposPista}
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled
              contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.tableRow,
                    { borderBottomColor: theme.primarySoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.colName,
                      { color: theme.textTitle, fontWeight: '600' },
                    ]}
                  >
                    {addSoftBreaks(item.name)}
                  </Text>
                  <View
                    style={[
                      styles.colImage,
                      { justifyContent: 'center', alignItems: 'center' },
                    ]}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: getImageUri(item.image) }}
                        style={{
                          width: 72,
                          height: 40,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: theme.primarySoft,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ color: theme.textBody }}>-</Text>
                    )}
                  </View>
                  <View style={styles.colCount}>
                    <Text style={{ color: theme.textBody }}>
                      {item.courts?.length ?? 0}
                    </Text>
                  </View>
                  <View style={styles.colActions}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity onPress={() => openEditModal(item)}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color={theme.textBody}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={theme.textBody}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}

      <TipoCourtFormModal
        visible={modalVisible}
        isEditing={Boolean(tipoPistaAEditar)}
        nombre={nombre}
        setNombre={setNombre}
        imagen={imagen}
        setImagen={setImagen}
        existingImageUri={tipoPistaAEditar?.image}
        onClose={closeModal}
        onSave={handleSave}
      />

      {/* Delete confirm / warning modal */}
      <SessionExpiredModal
        visible={deleteModal.visible}
        title={
          deleteModal.canDelete
            ? t('adminDeleteCourtTitle', { name: deleteModal.item?.name })
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
