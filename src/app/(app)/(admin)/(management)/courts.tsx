import React, { useState } from 'react';
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

  const renderCourtCard = ({ item }: { item: Pista }) => {
    return (
      <CourtCard
        item={item}
        theme={theme}
        onEdit={openModal}
        onMaintenance={handleMantenimiento}
        onDelete={handleDelete}
      />
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
      ) : (
        <FlatList
          data={filteredPistas}
          renderItem={renderCourtCard}
          keyExtractor={(item) => item.pista_id.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
        />
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
                deleteModal.accion === 'mantenimiento' &&
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
