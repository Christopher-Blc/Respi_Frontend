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
import { useAppTheme } from '../../../context/ThemeContext';
import { User } from '../../../types/types';
import { usersAdminStyles as styles } from '../../../style/admin/users.styles';
import { UserCard } from '../../../components/admin/users/UserCard';
import { UserFormModal } from '../../../components/admin/users/UserFormModal';
import { SessionExpiredModal } from '../../../components/alert.modal';
import { useAdminUsers } from '../../../hooks/useAdminUsers';

type AdminUser = User & {
  membresia?: { tipo?: string; rango?: string } | null;
};

export default function AdminUsuarios() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardsColumns = width >= 1280 ? 3 : width >= 780 ? 2 : 1;
  const {
    filteredUsers,
    memberships,
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
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

  const renderCard = ({ item }: { item: AdminUser }) => {
    const cardWidthStyle =
      cardsColumns === 1
        ? { width: '100%' as const }
        : { maxWidth: cardsColumns === 2 ? 560 : 440 };

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
        <FlatList
          key={`users-cards-${cardsColumns}`}
          data={filteredUsers}
          renderItem={renderCard}
          numColumns={cardsColumns}
          keyExtractor={(item) => item.usuario_id.toString()}
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
            data={filteredUsers}
            keyExtractor={(item) => item.usuario_id.toString()}
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
                    {item.username}
                  </Text>
                  <Text style={{ color: theme.textBody, fontSize: 12 }}>
                    {item.email}
                  </Text>
                </View>
                <Text style={[styles.colRole, { color: theme.textBody }]}>
                  {item.role}
                </Text>
                <Text style={[styles.colMembership, { color: theme.textBody }]}>
                  {item.membresia?.tipo || 'Sin membresia'}
                </Text>
                <Text
                  style={[
                    styles.colStatus,
                    {
                      color: item.isActive ? '#4CAF50' : '#F44336',
                      fontWeight: '700',
                    },
                  ]}
                >
                  {item.isActive ? 'Activa' : 'Inactiva'}
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
                    <TouchableOpacity onPress={() => handleToggleActive(item)}>
                      <Ionicons
                        name={
                          item.isActive
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
