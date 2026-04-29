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
import { useAdminPistas } from '../../../../hooks/useAdminPistas';
import { pistasStyles as styles } from '../../../../style/admin/pistas.styles';
import { PistaFormModal } from '../../../../components/admin/pista/PistaFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { PistasFiltersModal } from '../../../../components/admin/pista/PistasFiltersModal';
import { MaintenanceDateModal } from '../../../../components/admin/pista/MaintenanceDateModal';
import { PistaCard } from '../../../../components/admin/pista/PistaCard';
import { Tabs } from 'expo-router';

export default function AdminPistas() {
  <Tabs.Screen
    name="(management)/pistas"
    options={{ title: 'Gestión de pistas' }}
  />;

  const { theme } = useAppTheme();
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
  } = useAdminPistas();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const renderPistaCard = ({ item }: { item: Pista }) => {
    return (
      <PistaCard
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
            placeholder="Buscar por nombre..."
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
          renderItem={renderPistaCard}
          keyExtractor={(item) => item.pista_id.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
        />
      )}

      <PistaFormModal
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

      <PistasFiltersModal
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
            ? `Eliminar "${deleteModal.nombre}"`
            : `Mantenimiento "${deleteModal.nombre}"`
        }
        message={
          deleteModal.loadingCount
            ? 'Calculando reservas afectadas...'
            : `${
                deleteModal.accion === 'mantenimiento' &&
                deleteModal.mantenimientoDesde &&
                deleteModal.mantenimientoHasta
                  ? `Mantenimiento del ${deleteModal.mantenimientoDesde} al ${deleteModal.mantenimientoHasta}.\n\n`
                  : ''
              }¿Estás seguro? Se cancelarán ${deleteModal.reservasCount} reserva${
                deleteModal.reservasCount !== 1 ? 's' : ''
              }.`
        }
        confirmText={
          deleteModal.accion === 'eliminar'
            ? 'Eliminar todo'
            : 'Poner en mantenimiento'
        }
        cancelText="Cancelar"
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
