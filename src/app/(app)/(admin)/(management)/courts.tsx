import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pista } from '../../../../types/types';
import { useAdminCourts } from '../../../../hooks/useAdminCourts';
import { pistasStyles as styles } from '../../../../style/admin/courts.styles';
import { CourtFormModal } from '../../../../components/admin/courts/CourtFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { CourtsFiltersModal } from '../../../../components/admin/courts/CourtsFiltersModal';
import { MaintenanceDateModal } from '../../../../components/admin/courts/MaintenanceDateModal';
import { CourtCard } from '../../../../components/admin/courts/CourtCard';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AdminPistas() {
  <Tabs.Screen
    name="(management)/pistas"
    options={{ title: 'Gestión de pistas' }}
  />;

  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;

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
    filterTipoPistaId,
    setFilterTipoPistaId,
    filterPrecioMax,
    setFilterPrecioMax,
    filterEstado,
    setFilterEstado,
  } = useAdminCourts();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const renderCourtCard = ({ item }: { item: Pista }) => {
    const cardWidthStyle =
      cardsColumns === 1
        ? { width: '100%' as const }
        : { maxWidth: cardsColumns === 2 ? 560 : 440 };

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
        <FlatList
          key={`courts-cards-${cardsColumns}`}
          data={filteredPistas}
          renderItem={renderCourtCard}
          numColumns={cardsColumns}
          keyExtractor={(item) => item.pista_id.toString()}
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
            <Text style={[styles.colName, { color: theme.textTitle, fontWeight: '700' }]}>Pista</Text>
            <Text style={[styles.colType, { color: theme.textTitle, fontWeight: '700' }]}>Tipo</Text>
            <Text style={[styles.colPrice, { color: theme.textTitle, fontWeight: '700' }]}>Precio</Text>
            <Text style={[styles.colStatus, { color: theme.textTitle, fontWeight: '700' }]}>Estado</Text>
            <Text style={[styles.colActions, { color: theme.textTitle, fontWeight: '700' }]}>Acciones</Text>
          </View>
          <FlatList
            data={filteredPistas}
            keyExtractor={(item) => item.pista_id.toString()}
            contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            renderItem={({ item }) => (
              <View style={[styles.tableRow, { borderBottomColor: theme.primarySoft }]}>
                <View style={styles.colName}>
                  <Text style={{ color: theme.textTitle, fontWeight: '600' }}>{item.nombre}</Text>
                  <Text style={{ color: theme.textBody, fontSize: 12 }}>{item.instalacion?.nombre || '-'}</Text>
                </View>
                <Text style={[styles.colType, { color: theme.textBody }]}>{tiposPista.find((tipo) => String(tipo.tipo_pista_id) === String(item.tipo_pista_id))?.nombre || '-'}</Text>
                <Text style={[styles.colPrice, { color: theme.textBody }]}>{item.precio_hora}€/h</Text>
                <Text style={[styles.colStatus, { color: item.estado === 'DISPONIBLE' ? '#4CAF50' : '#F44336', fontWeight: '700' }]}>{item.estado}</Text>
                <View style={styles.colActions}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => openModal(item)}>
                      <Ionicons name="create-outline" size={18} color={theme.textBody} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleMantenimiento(item)}>
                      <Ionicons name="construct-outline" size={18} color={theme.textBody} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)}>
                      <Ionicons name="trash-outline" size={18} color={theme.textBody} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
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
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        updateWeeklySchedule={updateWeeklySchedule}
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        samePriceMode={samePriceMode}
        globalPrice={globalPrice}
        setGlobalPrice={setGlobalPrice}
        toggleSamePrice={toggleSamePrice}
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
