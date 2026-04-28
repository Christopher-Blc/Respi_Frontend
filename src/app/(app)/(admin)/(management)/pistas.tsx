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
import { Pista } from '../../../../types/types';
import { useAdminPistas } from '../../../../hooks/useAdminPistas';
import { pistasStyles as styles } from '../../../../style/admin/pistas.styles';
import { PistaFormModal } from '../../../../components/admin/pista/PistaFormModal';
import { SessionExpiredModal } from '../../../../components/alert.modal';

export default function AdminPistas() {
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
    confirmDelete,
    cancelDelete,
    updateWeeklySchedule,
    errorModal,
    setErrorModal,
    samePriceMode,
    globalPrice,
    setGlobalPrice,
    toggleSamePrice,
  } = useAdminPistas();

  const renderPistaCard = ({ item }: { item: Pista }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundCard,
          borderColor: theme.primarySoft,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: theme.textTitle }]}>
            {item.nombre}
          </Text>
          <Text style={[styles.cardSubtitle, { color: theme.textBody }]}>
            {item.instalacion?.nombre || 'Instalación N/D'}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.estado === 'DISPONIBLE' ? '#4CAF5020' : '#F4433620',
            },
          ]}
        >
          <Text
            style={{
              color: item.estado === 'DISPONIBLE' ? '#4CAF50' : '#F44336',
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {item.estado}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <DetailItem
          icon="people-outline"
          text={`Cap: ${item.capacidad}`}
          theme={theme}
        />
        <DetailItem
          icon="cash-outline"
          text={`${item.precio_hora}€/h`}
          theme={theme}
        />
        <DetailItem
          icon={item.cubierta ? 'business-outline' : 'trail-sign-outline'}
          text={item.cubierta ? 'Cubierta' : 'Exterior'}
          theme={theme}
        />
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.btnAction, { backgroundColor: theme.primary + '15' }]}
          onPress={() => openModal(item)}
        >
          <Ionicons name="create-outline" size={18} color={theme.primary} />
          <Text
            style={{ color: theme.primary, marginLeft: 4, fontWeight: '600' }}
          >
            Editar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAction, { backgroundColor: '#FF980015' }]}
          onPress={() => handleMantenimiento(item)}
        >
          <Ionicons name="construct-outline" size={18} color="#FF9800" />
          <Text style={{ color: '#FF9800', marginLeft: 4, fontWeight: '600' }}>
            Mant.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAction, { backgroundColor: '#F4433615' }]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
          <Text style={{ color: '#F44336', marginLeft: 4, fontWeight: '600' }}>
            Borrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
            placeholder="Buscar por nombre o club..."
            placeholderTextColor={theme.textBody + '80'}
            style={[styles.searchInput, { color: theme.textTitle }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={30} color="white" />
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
            : `¿Estás seguro? Se cancelarán ${deleteModal.reservasCount} reserva${
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
    </View>
  );
}

const DetailItem = ({
  icon,
  text,
  theme,
}: {
  icon: any;
  text: string;
  theme: any;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name={icon} size={14} color={theme.primary} />
    <Text style={{ fontSize: 12, marginLeft: 4, color: theme.textBody }}>
      {text}
    </Text>
  </View>
);
