import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../context/ThemeContext';
import { membershipsStyles as styles } from '../../../../style/admin/memberships.styles';
import { Instalacion } from '../../../../types/types';
import { useAdminInstallations } from '../../../../hooks/useAdminInstallations';
import { InstallationCard } from '../../../../components/admin/installations/InstallationCard';
import { InstallationFormModal } from '../../../../components/admin/installations/InstallationFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';

export default function AdminInstallations() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;
  const [viewMode, setViewMode] = React.useState<'cards' | 'list'>('cards');

  const {
    filteredInstallations,
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    installationToEdit,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
    confirmDelete,
    cancelDelete,
    deleteModal,
    errorModal,
    setErrorModal,
  } = useAdminInstallations();

  const renderCard = ({ item }: { item: Instalacion }) => {
    const cardWidthStyle =
      cardsColumns === 1
        ? { width: '100%' as const }
        : { maxWidth: cardsColumns === 2 ? 560 : 440 };

    return (
      <View style={[styles.cardColumn, cardWidthStyle]}>
        <InstallationCard
          item={item}
          theme={theme}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </View>
    );
  };

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
            placeholder="Buscar instalacion..."
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
          onPress={openCreateModal}
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
          key={`installations-cards-${cardsColumns}`}
          data={filteredInstallations}
          renderItem={renderCard}
          numColumns={cardsColumns}
          keyExtractor={(item, index) =>
            String((item as any)?.instalacion_id ?? (item as any)?.id ?? index)
          }
          columnWrapperStyle={cardsColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
        />
      ) : (
        <View
          style={[
            styles.tableWrap,
            {
              borderColor: theme.primarySoft,
              backgroundColor: theme.backgroundCard,
            },
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
                styles.colType,
                { color: theme.textTitle, fontWeight: '700' },
              ]}
            >
              Nombre
            </Text>
            <Text
              style={[
                styles.colBookings,
                { color: theme.textTitle, fontWeight: '700' },
              ]}
            >
              Telefono
            </Text>
            <Text
              style={[
                styles.colDiscount,
                { color: theme.textTitle, fontWeight: '700' },
              ]}
            >
              Estado
            </Text>
            <Text
              style={[
                styles.colActions,
                { color: theme.textTitle, fontWeight: '700' },
              ]}
            >
              Acciones
            </Text>
          </View>
          <FlatList
            data={filteredInstallations}
            keyExtractor={(item, index) =>
              String(
                (item as any)?.instalacion_id ?? (item as any)?.id ?? index,
              )
            }
            contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.tableRow,
                  { borderBottomColor: theme.primarySoft },
                ]}
              >
                <View style={styles.colType}>
                  <Text style={{ color: theme.textTitle, fontWeight: '600' }}>
                    {item.nombre}
                  </Text>
                  <Text style={{ color: theme.textBody, fontSize: 12 }}>
                    {item.direccion || '-'}
                  </Text>
                </View>
                <Text style={[styles.colBookings, { color: theme.textBody }]}>
                  {item.telefono || '-'}
                </Text>
                <Text style={[styles.colDiscount, { color: theme.textBody }]}>
                  {item.estado || 'activa'}
                </Text>
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
      )}

      <InstallationFormModal
        visible={modalVisible}
        isEditing={Boolean(installationToEdit)}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />

      <SessionExpiredModal
        visible={deleteModal.visible}
        title="Eliminar instalacion"
        message={deleteModal.message}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <SessionExpiredModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        confirmText="Entendido"
        onConfirm={() =>
          setErrorModal({ visible: false, title: '', message: '' })
        }
      />
    </View>
  );
}
