import React, { useState, useEffect } from 'react';
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
import { Court } from '../../../../types/types';
import { useAdminCourts } from '../../../../hooks/admin/useAdminCourts';
import { pistasStyles as styles } from '../../../../style/admin/courts.styles';
import { CourtFormModal } from '../../../../components/admin/courts/CourtFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { CourtsFiltersModal } from '../../../../components/admin/courts/CourtsFiltersModal';
import { MaintenanceDateModal } from '../../../../components/admin/courts/MaintenanceDateModal';
import { CourtCard } from '../../../../components/admin/courts/CourtCard';
import { useTranslation } from 'react-i18next';
import { addSoftBreaks } from '../../../../utils/addSoftBreaks';
import { API_PUBLIC_URL } from '../../../../constants';

export default function AdminPistas() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tableMinWidth = 760;
  const useHorizontalTableScroll = width < tableMinWidth + 32;
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;
  const [cardsContainerWidth, setCardsContainerWidth] = useState(0);
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

  const {
    loading,
    searchQuery,
    setSearchQuery,
    modalVisible,
    setModalVisible,
    pistaAEditar,
    formData,
    setFormData,
    weeklySchedule,
    weeklyCardWidth,
    tiposPista,
    instalaciones,
    deleteModal,
    filteredPistas,
    openModal,
    handleSave,
    handleDelete,
    handleMantenimiento,
    maintenanceDateModal,
    updateMaintenanceRange,
    confirmMaintenanceDates,
    cancelMaintenanceDates,
    confirmDelete,
    cancelDelete,
    updateWeeklySchedule,
    errorModal,
    setErrorModal,
    samePriceMode,
    globalPrice,
    setGlobalPrice,
    toggleSamePrice,
    imagen,
    setImagen,
    removeExistingImage,
    setRemoveExistingImage,
    filterTipoPistaId,
    setFilterTipoPistaId,
    filterPrecioMax,
    setFilterPrecioMax,
    filterEstado,
    setFilterEstado,
  } = useAdminCourts();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTipoPistaId, filterPrecioMax, filterEstado]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredPistas.length / PAGE_SIZE) || 1;
  const pagedPistas = filteredPistas.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const renderCourtCard = ({ item }: { item: Court }) => {
    const normalizedCardWidth = Math.max(280, Math.floor(computedCardWidth));
    const cardWidthStyle = {
      width: normalizedCardWidth,
      maxWidth: normalizedCardWidth,
    };

    return (
      <View style={[styles.cardColumn, cardWidthStyle]}>
        <CourtCard
          item={item}
          theme={theme}
          onEdit={openModal}
          onMaintenance={handleMantenimiento}
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
              backgroundColor:
                filtersOpen ||
                filterTipoPistaId !== null ||
                filterPrecioMax.trim().length > 0 ||
                filterEstado !== null
                  ? theme.primary + '18'
                  : theme.inputBackground,
              borderWidth: 1,
              borderColor: theme.primarySoft,
            },
          ]}
          onPress={() => setFiltersOpen(true)}
        >
          <Ionicons name="options-outline" size={22} color={theme.textBody} />
        </TouchableOpacity>
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
          onPress={() => openModal()}
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
            key={`courts-cards-${cardsColumns}`}
            data={pagedPistas}
            renderItem={renderCourtCard}
            numColumns={cardsColumns}
            keyExtractor={(item) => item.id.toString()}
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
                  styles.colName,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Pista
              </Text>
              <Text
                style={[
                  styles.colType,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Tipo
              </Text>
              <Text
                style={[
                  styles.colImage,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Imagen
              </Text>
              <Text
                style={[
                  styles.colPrice,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Precio
              </Text>
              <Text
                style={[
                  styles.colStatus,
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
              data={pagedPistas}
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
                  <View style={styles.colName}>
                    <Text style={{ color: theme.textTitle, fontWeight: '600' }}>
                      {addSoftBreaks(item.name)}
                    </Text>
                    <Text style={{ color: theme.textBody, fontSize: 12 }}>
                      {addSoftBreaks(item.installation?.name || '-')}
                    </Text>
                  </View>
                  <Text style={[styles.colType, { color: theme.textBody }]}>
                    {addSoftBreaks(
                      tiposPista.find(
                        (tipo) =>
                          String(tipo.id) === String(item.court_type_id),
                      )?.name || '-',
                    )}
                  </Text>
                  <View style={styles.colImage}>
                    {item.image ? (
                      <Image
                        source={{
                          uri: item.image.startsWith('http')
                            ? item.image
                            : `${API_PUBLIC_URL}/${String(item.image).replace(/^\//, '')}`,
                        }}
                        style={{
                          width: 68,
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
                  <Text style={[styles.colPrice, { color: theme.textBody }]}>
                    {item.price_per_hour}€/h
                  </Text>
                  <Text
                    style={[
                      styles.colStatus,
                      {
                        color:
                          item.status === 'DISPONIBLE' ? '#4CAF50' : '#F44336',
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                  <View style={styles.colActions}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity onPress={() => openModal(item)}>
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color={theme.textBody}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleMantenimiento(item)}
                      >
                        <Ionicons
                          name="construct-outline"
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

      <CourtFormModal
        visible={modalVisible}
        pistaAEditar={pistaAEditar}
        formData={formData}
        setFormData={setFormData}
        weeklySchedule={weeklySchedule}
        weeklyCardWidth={weeklyCardWidth}
        tiposPista={tiposPista}
        instalaciones={instalaciones}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        updateWeeklySchedule={updateWeeklySchedule}
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        samePriceMode={samePriceMode}
        globalPrice={globalPrice}
        setGlobalPrice={setGlobalPrice}
        toggleSamePrice={toggleSamePrice}
        imagen={imagen}
        setImagen={setImagen}
        removeExistingImage={removeExistingImage}
        setRemoveExistingImage={setRemoveExistingImage}
        existingImageUri={pistaAEditar?.image}
      />

      <CourtsFiltersModal
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        tiposPista={tiposPista}
        filterTipoPistaId={filterTipoPistaId}
        setFilterTipoPistaId={setFilterTipoPistaId}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        filterPrecioMax={filterPrecioMax}
        setFilterPrecioMax={setFilterPrecioMax}
      />

      <SessionExpiredModal
        visible={deleteModal.visible}
        title={
          deleteModal.accion === 'eliminar'
            ? t('adminDeleteCourtTitle', { name: deleteModal.nombre })
            : t('adminMaintenanceCourtTitle', { name: deleteModal.nombre })
        }
        message={
          deleteModal.loadingCount
            ? t('adminDeleteModalLoading')
            : `${
                (deleteModal.accion as string) === 'mantenimiento' &&
                deleteModal.mantenimientoDesde &&
                deleteModal.mantenimientoHasta
                  ? t('adminDeleteModalRange', {
                      from: deleteModal.mantenimientoDesde,
                      to: deleteModal.mantenimientoHasta,
                    })
                  : ''
              }${t('adminDeleteModalMessage', {
                count: deleteModal.reservasCount,
              })}`
        }
        confirmText={
          deleteModal.accion === 'eliminar'
            ? t('adminDeleteAll')
            : t('adminSetMaintenance')
        }
        cancelText={t('commonCancel')}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <MaintenanceDateModal
        visible={maintenanceDateModal.visible}
        nombre={maintenanceDateModal.nombre}
        desde={maintenanceDateModal.desde}
        hasta={maintenanceDateModal.hasta}
        error={maintenanceDateModal.error}
        onChangeDesde={(value) => updateMaintenanceRange('desde', value)}
        onChangeHasta={(value) => updateMaintenanceRange('hasta', value)}
        onCancel={cancelMaintenanceDates}
        onContinue={confirmMaintenanceDates}
      />
    </View>
  );
}
