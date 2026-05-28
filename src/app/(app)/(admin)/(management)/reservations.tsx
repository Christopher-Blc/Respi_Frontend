import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../../context/ThemeContext';
import { Reservation } from '../../../../types/types';
import { bookingsAdminStyles as styles } from '../../../../style/admin/bookings.styles';
import { BookingCard } from '../../../../components/admin/bookings/BookingCard';
import { BookingFormModal } from '../../../../components/admin/bookings/BookingFormModal';
import { BookingsFiltersModal } from '../../../../components/admin/bookings/BookingsFiltersModal';
import { SessionExpiredModal } from '../../../../components/general/alert.modal';
import { useAdminBookings } from '../../../../hooks/admin/useAdminBookings';
import { usePullToRefresh } from '../../../../hooks/usePullToRefresh';

const statusColorMap: Record<string, string> = {
  CONFIRMADA: '#1E88E5',
  PENDIENTE: '#FB8C00',
  CANCELADA: '#E53935',
  FINALIZADA: '#43A047',
};

const addSoftBreaks = (value: string, chunkSize = 12) => {
  if (!value || value.length <= chunkSize || /\s/.test(value)) {
    return value;
  }

  return (
    value.match(new RegExp(`.{1,${chunkSize}}`, 'g'))?.join('\u200B') ?? value
  );
};

export default function AdminReservasGlobal() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const gridGap = 12;
  const tableMinWidth = 760;
  const [gridWidth, setGridWidth] = useState(0);
  const gridHorizontalPadding = 32;
  const minCardWidth = width >= 1440 ? 360 : width >= 1100 ? 320 : 280;
  const measuredWidth = gridWidth > 0 ? gridWidth : width;
  const availableGridWidth = Math.max(
    measuredWidth - gridHorizontalPadding,
    minCardWidth,
  );
  const cardsColumns = Math.max(
    1,
    Math.min(
      3,
      Math.floor((availableGridWidth + gridGap) / (minCardWidth + gridGap)),
    ),
  );
  const cardWidth =
    cardsColumns === 1
      ? availableGridWidth
      : (availableGridWidth - gridGap * (cardsColumns - 1)) / cardsColumns;
  const useHorizontalTableScroll = width < tableMinWidth + 32;
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    users,
    courts,
    courtTypes,
    filteredReservations,
    loading,
    refresh,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    dateFromFilter,
    setDateFromFilter,
    dateToFilter,
    setDateToFilter,
    statusFilter,
    setStatusFilter,
    courtFilter,
    setCourtFilter,
    courtTypeFilter,
    setCourtTypeFilter,
    clearFilters,
    modalVisible,
    setModalVisible,
    reservationToEdit,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    handleSave,
    handleCancelReservation,
    handleDeleteReservation,
    confirmModal,
    confirmAction,
    cancelConfirm,
    errorModal,
    setErrorModal,
  } = useAdminBookings();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    dateFromFilter,
    dateToFilter,
    statusFilter,
    courtFilter,
    courtTypeFilter,
  ]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredReservations.length / PAGE_SIZE) || 1;
  const pagedReservations = filteredReservations.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const renderCard = ({ item }: { item: Reservation }) => {
    const cardWidthStyle = { width: cardWidth };

    return (
      <View style={[styles.cardColumn, cardWidthStyle]}>
        <BookingCard
          item={item}
          theme={theme}
          onEdit={openEditModal}
          onCancel={handleCancelReservation}
          onDelete={handleDeleteReservation}
        />
      </View>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundMain }]}
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;
        if (Math.abs(nextWidth - gridWidth) > 2) {
          setGridWidth(nextWidth);
        }
      }}
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
            placeholder="Buscar reserva..."
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
              backgroundColor:
                filtersOpen ||
                dateFromFilter.trim().length > 0 ||
                dateToFilter.trim().length > 0 ||
                statusFilter !== 'ALL' ||
                courtFilter !== 'ALL' ||
                courtTypeFilter !== 'ALL'
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
            styles.squareBtn,
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
      ) : filteredReservations.length === 0 ? (
        <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
          <Text style={{ color: theme.textBody, textAlign: 'center' }}>
            No hay reservas.
          </Text>
        </View>
      ) : viewMode === 'cards' ? (
        <FlatList
          key={`bookings-cards-${cardsColumns}`}
          data={pagedReservations}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
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
                  styles.colId,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                ID
              </Text>
              <Text
                style={[
                  styles.colUser,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Usuario
              </Text>
              <Text
                style={[
                  styles.colCourt,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Pista
              </Text>
              <Text
                style={[
                  styles.colDate,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Fecha
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
              data={pagedReservations}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.primary}
                />
              }
              keyExtractor={(item) => item.id.toString()}
              nestedScrollEnabled
              contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
              renderItem={({ item }) => {
                const statusColor =
                  statusColorMap[item.status] || theme.textBody;
                const canCancel =
                  item.status !== 'FINALIZADA' && item.status !== 'CANCELADA';

                return (
                  <View
                    style={[
                      styles.tableRow,
                      { borderBottomColor: theme.primarySoft },
                    ]}
                  >
                    <Text
                      style={[
                        styles.colId,
                        { color: theme.textBody, fontWeight: '600' },
                      ]}
                      numberOfLines={1}
                    >
                      {item.id}
                    </Text>
                    <Text style={[styles.colUser, { color: theme.textBody }]}>
                      {addSoftBreaks(
                        String(item.user?.username || item.user_id),
                      )}
                    </Text>
                    <Text
                      style={[styles.colCourt, { color: theme.textBody }]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.court?.name || item.court_id}
                    </Text>
                    <Text
                      style={[styles.colDate, { color: theme.textBody }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.reservation_date}
                    </Text>
                    <Text
                      style={[
                        styles.colStatus,
                        {
                          color: statusColor,
                          fontWeight: '700',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {item.status}
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
                        {canCancel && (
                          <TouchableOpacity
                            onPress={() => handleCancelReservation(item)}
                          >
                            <Ionicons
                              name="close-circle-outline"
                              size={18}
                              color={theme.textBody}
                            />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => handleDeleteReservation(item)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color={theme.textBody}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      )}

      <BookingFormModal
        visible={modalVisible}
        isEditing={Boolean(reservationToEdit)}
        formData={formData}
        setFormData={setFormData}
        users={users}
        courts={courts}
        reservationStatus={reservationToEdit?.status ?? null}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />

      {!loading && filteredReservations.length > 0 && totalPages > 1 && (
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

      <BookingsFiltersModal
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        courts={courts}
        courtTypes={courtTypes}
        dateFromFilter={dateFromFilter}
        setDateFromFilter={setDateFromFilter}
        dateToFilter={dateToFilter}
        setDateToFilter={setDateToFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        courtFilter={courtFilter}
        setCourtFilter={setCourtFilter}
        courtTypeFilter={courtTypeFilter}
        setCourtTypeFilter={setCourtTypeFilter}
        clearFilters={clearFilters}
      />

      <SessionExpiredModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={confirmAction}
        onCancel={cancelConfirm}
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
