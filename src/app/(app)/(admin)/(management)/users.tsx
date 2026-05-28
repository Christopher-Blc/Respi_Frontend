import React, { useState, useEffect } from 'react';
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
import { Membership, User } from '../../../../types/types';
import { usersAdminStyles as styles } from '../../../../style/admin/users.styles';
import { UserCard } from '../../../../components/admin/users/UserCard';
import { UserFormModal } from '../../../../components/admin/users/UserFormModal';
import { UsersFiltersModal } from '../../../../components/admin/users/UsersFiltersModal';
import { SessionExpiredModal } from '../../../../components/general/alert.modal';
import { useAdminUsers } from '../../../../hooks/admin/useAdminUsers';
import { addSoftBreaks } from '../../../../utils/addSoftBreaks';
import { usePullToRefresh } from '../../../../hooks/usePullToRefresh';

type AdminUser = User & {
  membership?: Membership | null;
};

export default function AdminUsuarios() {
  const { theme } = useAppTheme();
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
  const [searchReadOnly, setSearchReadOnly] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    filteredUsers,
    memberships,
    loading,
    refresh,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    registrationFromFilter,
    setRegistrationFromFilter,
    registrationToFilter,
    setRegistrationToFilter,
    roleFilter,
    setRoleFilter,
    activeFilter,
    setActiveFilter,
    userFilter,
    setUserFilter,
    clearFilters,
    modalVisible,
    setModalVisible,
    userToEdit,
    formData,
    setFormData,
    openCreateModal,
    openEditModal,
    handleSave,
    handleToggleActive,
    confirmModal,
    confirmAction,
    cancelConfirm,
    errorModal,
    setErrorModal,
  } = useAdminUsers();
  const { refreshing, onRefresh } = usePullToRefresh(refresh);

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;
  const pagedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const renderCard = ({ item }: { item: AdminUser }) => {
    const normalizedCardWidth = Math.max(280, Math.floor(computedCardWidth));
    const cardWidthStyle = {
      width: normalizedCardWidth,
      maxWidth: normalizedCardWidth,
    };

    return (
      <View style={[styles.cardColumn, cardWidthStyle]}>
        <UserCard
          item={item}
          theme={theme}
          onEdit={openEditModal}
          onToggleActive={handleToggleActive}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundMain }]}>
      <UsersFiltersModal
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        registrationFromFilter={registrationFromFilter}
        setRegistrationFromFilter={setRegistrationFromFilter}
        registrationToFilter={registrationToFilter}
        setRegistrationToFilter={setRegistrationToFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        clearFilters={clearFilters}
      />
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
            placeholder="Buscar usuario..."
            placeholderTextColor={theme.textBody + '80'}
            style={[styles.searchInput, { color: theme.textTitle }]}
            value={searchQuery}
            readOnly={searchReadOnly}
            onFocus={() => setSearchReadOnly(false)}
            onBlur={() => setSearchReadOnly(true)}
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
                registrationFromFilter.trim().length > 0 ||
                registrationToFilter.trim().length > 0 ||
                userFilter.trim().length > 0 ||
                roleFilter !== 'ALL' ||
                activeFilter !== 'ALL'
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
            key={`users-cards-${cardsColumns}`}
            data={pagedUsers}
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
                Usuario
              </Text>
              <Text
                style={[
                  styles.colRole,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Rol
              </Text>
              <Text
                style={[
                  styles.colMembership,
                  { color: theme.textTitle, fontWeight: '700' },
                ]}
              >
                Membresia
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
              data={pagedUsers}
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
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.tableRow,
                    { borderBottomColor: theme.primarySoft },
                  ]}
                >
                  <View style={styles.colName}>
                    <Text style={{ color: theme.textTitle, fontWeight: '600' }}>
                      {addSoftBreaks(item.username)}
                    </Text>
                    <Text style={{ color: theme.textBody, fontSize: 12 }}>
                      {addSoftBreaks(item.email)}
                    </Text>
                  </View>
                  <Text style={[styles.colRole, { color: theme.textBody }]}>
                    {item.role}
                  </Text>
                  <Text
                    style={[styles.colMembership, { color: theme.textBody }]}
                  >
                    {addSoftBreaks(item.membership?.name || 'Sin membresia')}
                  </Text>
                  <Text
                    style={[
                      styles.colStatus,
                      {
                        color: item.is_active ? '#4CAF50' : '#F44336',
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {item.is_active ? 'Activa' : 'Inactiva'}
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
                      <TouchableOpacity
                        onPress={() => handleToggleActive(item)}
                      >
                        <Ionicons
                          name={
                            item.is_active
                              ? 'pause-circle-outline'
                              : 'checkmark-circle-outline'
                          }
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

      <UserFormModal
        visible={modalVisible}
        isEditing={Boolean(userToEdit)}
        formData={formData}
        setFormData={setFormData}
        memberships={memberships}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
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
