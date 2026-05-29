import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
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
import { Installation } from '../../../../types/types';
import { useAdminInstallations } from '../../../../hooks/admin/useAdminInstallations';
import { InstallationCard } from '../../../../components/admin/installations/InstallationCard';
import { InstallationFormModal } from '../../../../components/admin/installations/InstallationFormModal';
import { SessionExpiredModal } from '../../../../components/general/alert.modal';
import { addSoftBreaks } from '../../../../utils/addSoftBreaks';
import { usePullToRefresh } from '../../../../hooks/usePullToRefresh';

export default function AdminInstallations() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tableMinWidth = 700;
  const useHorizontalTableScroll = width < tableMinWidth + 32;
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;
  const [cardsContainerWidth, setCardsContainerWidth] = React.useState(0);
  const gridHorizontalPadding = 32;
  const gridGap = 12;
  const availableGridWidth = cardsContainerWidth || width;
  const computedCardWidth =
    cardsColumns === 1
      ? availableGridWidth - gridHorizontalPadding
      : (availableGridWidth -
          gridHorizontalPadding -
          gridGap * (cardsColumns - 1)) /
        cardsColumns;
  const [viewMode, setViewMode] = React.useState<'cards' | 'list'>('cards');

  const {
    filteredInstallations,
    loading,
    refresh,
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
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  const [currentPage, setCurrentPage] = React.useState(1);
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredInstallations.length / PAGE_SIZE) || 1;
  const pagedInstallations = filteredInstallations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const renderCard = ({ item }: { item: Installation }) => {
    const normalizedCardWidth = Math.max(280, Math.floor(computedCardWidth));
    const cardWidthStyle = {
      width: normalizedCardWidth,
      maxWidth: normalizedCardWidth,
    };

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
        <View style={{ flex: 1, position: 'relative' }}>
          <Ionicons
            name="search"
            size={20}
            color={theme.textBody}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: [{ translateY: -10 }],
              zIndex: 1,
            }}
          />
          <TextInput
            placeholder="Buscar instalacion..."
            placeholderTextColor={theme.textBody + '80'}
            style={[
              styles.searchInput,
              {
                flex: 1,
                height: 48,
                borderRadius: 12,
                borderWidth: 1,
                backgroundColor: theme.backgroundCard,
                borderColor: theme.primarySoft,
                paddingLeft: 40,
                paddingRight: searchQuery.length > 0 ? 40 : 12,
                color: theme.textTitle,
                outlineWidth: 0,
              },
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: [{ translateY: -9 }],
                zIndex: 1,
              }}
            >
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
        <View
          style={{ flex: 1 }}
          onLayout={(event) => {
            const nextWidth = Math.floor(event.nativeEvent.layout.width);
            if (nextWidth > 0 && nextWidth !== cardsContainerWidth) {
              setCardsContainerWidth(nextWidth);
            }
          }}
        >
          <FlatList
            key={`installations-cards-${cardsColumns}`}
            data={pagedInstallations}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary}
              />
            }
            renderItem={renderCard}
            numColumns={cardsColumns}
            keyExtractor={(item) => String(item.id)}
            columnWrapperStyle={cardsColumns > 1 ? styles.gridRow : undefined}
            contentContainerStyle={[
              styles.gridContent,
              { paddingBottom: insets.bottom + 100 },
            ]}
          />
        </View>
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
              data={pagedInstallations}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.primary}
                />
              }
              keyExtractor={(item) => String(item.id)}
              nestedScrollEnabled
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
                      {addSoftBreaks(item.name)}
                    </Text>
                    <Text style={{ color: theme.textBody, fontSize: 12 }}>
                      {addSoftBreaks(item.address || '-')}
                    </Text>
                  </View>
                  <Text style={[styles.colBookings, { color: theme.textBody }]}>
                    {addSoftBreaks(item.phone || '-')}
                  </Text>
                  <Text style={[styles.colDiscount, { color: theme.textBody }]}>
                    {item.status || 'activa'}
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
        </ScrollView>
      )}

      {!loading && totalPages > 1 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            gap: 16,
            backgroundColor: theme.backgroundCard,
            borderTopWidth: 1,
            borderTopColor: theme.primarySoft,
          }}
        >
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={currentPage === 1 ? theme.textBody + '40' : theme.primary}
            />
          </TouchableOpacity>
          <Text
            style={{ color: theme.textTitle, fontWeight: '700', fontSize: 14 }}
          >
            {currentPage} / {totalPages}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                currentPage === totalPages
                  ? theme.textBody + '40'
                  : theme.primary
              }
            />
          </TouchableOpacity>
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
