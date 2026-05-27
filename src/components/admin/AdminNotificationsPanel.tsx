import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';
import { JWTPayload, Notification as AppNotification } from '../../types/types';
import { useTranslation } from 'react-i18next';

const extractRows = (payload: unknown): AppNotification[] => {
  if (Array.isArray(payload)) return payload as AppNotification[];
  if (payload && typeof payload === 'object') {
    const rows = (payload as { rows?: unknown }).rows;
    if (Array.isArray(rows)) return rows as AppNotification[];
  }
  return [];
};

const getNotificationTypeStyle = (tipoNoti?: string, theme?: any) => {
  const normalized = (tipoNoti || '').trim().toLowerCase();

  if (normalized.includes('alert')) {
    return {
      color: '#D32F2F',
      backgroundColor: '#D32F2F18',
      borderColor: '#D32F2F',
    };
  }
  if (normalized.includes('promo')) {
    return {
      color: '#2E7D32',
      backgroundColor: '#2E7D3218',
      borderColor: '#2E7D32',
    };
  }
  if (normalized.includes('record')) {
    return {
      color: '#F57C00',
      backgroundColor: '#F57C0018',
      borderColor: '#F57C00',
    };
  }

  return {
    color: theme?.primaryButton ?? '#1976D2',
    backgroundColor: (theme?.primaryButton ?? '#1976D2') + '18',
    borderColor: theme?.primaryButton ?? '#1976D2',
  };
};

interface AdminNotificationsPanelProps {
  theme: any;
}

export default function AdminNotificationsPanel({
  theme,
}: AdminNotificationsPanelProps) {
  const { t } = useTranslation();
  const { userToken } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyToday, setShowOnlyToday] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const currentUserId = useMemo(() => {
    if (!userToken) return null;
    try {
      const decoded = jwtDecode(userToken) as JWTPayload;
      return Number(decoded?.sub) || null;
    } catch {
      return null;
    }
  }, [userToken]);

  const loadNotifications = useCallback(async () => {
    if (!currentUserId) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/notifications');
      const rows = extractRows(res?.data);
      const onlyMine = rows
        .filter((item) => Number(item.user_id) === currentUserId)
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() -
            new Date(left.created_at).getTime(),
        );
      setNotifications(onlyMine);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const isToday = useCallback((value?: string | number) => {
    const date = new Date(value || 0);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }, []);

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    if (showOnlyToday) {
      result = result.filter((item) => isToday(item.created_at));
    }

    if (selectedType) {
      result = result.filter(
        (item) =>
          item.notification_type?.toLowerCase() === selectedType.toLowerCase(),
      );
    }

    return result;
  }, [notifications, showOnlyToday, selectedType, isToday]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNotifications.length, showOnlyToday, selectedType]);

  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(filteredNotifications.length / PAGE_SIZE) || 1;
  const pagedNotifications = filteredNotifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const uniqueTypes = useMemo(() => {
    const types = new Set(
      notifications.map((n) => n.notification_type).filter(Boolean),
    );
    return Array.from(types);
  }, [notifications]);

  const formatDate = useCallback(
    (value?: string | number) => {
      const date = new Date(value || 0);
      if (Number.isNaN(date.getTime())) return '—';
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return `${t('today', { defaultValue: 'Hoy' })} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (date.toDateString() === yesterday.toDateString()) {
        return `${t('yesterday', { defaultValue: 'Ayer' })} ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }
    },
    [t],
  );

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderNotificationItem = ({ item }: { item: AppNotification }) => {
    const typeStyles = getNotificationTypeStyle(item.notification_type, theme);

    return (
      <View
        style={[
          styles.notificationCard,
          {
            backgroundColor: item.is_read
              ? theme.backgroundCard
              : theme.primaryButton + '15',
            borderLeftColor: item.is_read
              ? theme.borderSoft
              : typeStyles.borderColor,
          },
        ]}
      >
        <View style={styles.notificationContent}>
          <Text
            style={[
              styles.notificationTitle,
              {
                color: theme.textTitle,
                fontWeight: item.is_read ? '500' : '700',
              },
            ]}
          >
            {item.title || 'Notificación'}
          </Text>
          <Text style={[styles.notificationBody, { color: theme.textBody }]}>
            {item.message}
          </Text>
          <View style={styles.notificationFooter}>
            <Text
              style={[
                styles.notificationType,
                {
                  color: typeStyles.color,
                  backgroundColor: typeStyles.backgroundColor,
                  borderColor: typeStyles.borderColor,
                },
              ]}
            >
              {item.notification_type || 'General'}
            </Text>
            <Text
              style={[styles.notificationDate, { color: theme.textSecondary }]}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
        {!item.is_read && (
          <View
            style={[
              styles.unreadBadge,
              { backgroundColor: typeStyles.borderColor },
            ]}
          />
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="notifications-off-outline"
        size={40}
        color={theme.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: theme.textTitle }]}>
        Sin notificaciones
      </Text>
      {(showOnlyToday || selectedType) && (
        <Text style={[styles.emptySubtitle, { color: theme.textBody }]}>
          Sin resultados con estos filtros.
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundCard }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textTitle }]}>
          {t('profileNotifications', { defaultValue: 'Notificaciones' })}
        </Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          onPress={() => setShowOnlyToday((prev) => !prev)}
          style={[
            styles.filterButton,
            {
              borderColor: showOnlyToday
                ? theme.primaryButton
                : theme.primarySoft,
              backgroundColor: showOnlyToday
                ? theme.primaryButton + '25'
                : theme.backgroundMain,
            },
          ]}
        >
          <Ionicons
            name={showOnlyToday ? 'calendar' : 'calendar-outline'}
            size={12}
            color={showOnlyToday ? theme.primaryButton : theme.textBody}
          />
          <Text
            style={{
              color: showOnlyToday ? theme.primaryButton : theme.textBody,
              fontWeight: '700',
              fontSize: 11,
            }}
          >
            {showOnlyToday ? 'Hoy' : 'Ver hoy'}
          </Text>
        </TouchableOpacity>

        {uniqueTypes.length > 0 && (
          <FlatList
            data={uniqueTypes}
            renderItem={({ item: type }) => (
              <TouchableOpacity
                onPress={() =>
                  setSelectedType(selectedType === type ? null : type)
                }
                style={[
                  styles.typeChip,
                  {
                    borderColor:
                      selectedType === type
                        ? theme.primaryButton
                        : theme.primarySoft,
                    backgroundColor:
                      selectedType === type
                        ? theme.primaryButton + '25'
                        : theme.backgroundMain,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      selectedType === type
                        ? theme.primaryButton
                        : theme.textBody,
                    fontWeight: '700',
                    fontSize: 10,
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            scrollEnabled={uniqueTypes.length > 3}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeChipsContainer}
          />
        )}
      </View>

      {/* Lista de notificaciones */}
      {loading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primaryButton} />
        </View>
      ) : (
        <>
          <FlatList
            data={pagedNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={!loading ? renderEmptyState : null}
            scrollEnabled={false}
          />

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <View
              style={[
                styles.paginationContainer,
                { borderTopColor: theme.primarySoft },
              ]}
            >
              <TouchableOpacity
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <Ionicons
                  name="chevron-back"
                  size={18}
                  color={
                    currentPage === 1
                      ? theme.textBody + '40'
                      : theme.primaryButton
                  }
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: theme.textTitle,
                  fontWeight: '700',
                  fontSize: 12,
                }}
              >
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    currentPage === totalPages
                      ? theme.textBody + '40'
                      : theme.primaryButton
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      borderRadius: 12,
      marginVertical: 12,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.primarySoft,
    },
    headerTitle: {
      fontSize: 14,
      fontWeight: '700',
    },
    filtersContainer: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.primarySoft,
      gap: 8,
    },
    filterButton: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-start',
    },
    typeChipsContainer: {
      gap: 6,
    },
    typeChip: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 5,
      alignSelf: 'flex-start',
    },
    listContent: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 8,
      minHeight: 60,
    },
    notificationCard: {
      flexDirection: 'row',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderLeftWidth: 4,
      alignItems: 'center',
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 13,
      marginBottom: 4,
    },
    notificationBody: {
      fontSize: 12,
      marginBottom: 6,
      lineHeight: 16,
    },
    notificationFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    notificationType: {
      fontSize: 10,
      fontWeight: '700',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      borderWidth: 1,
      overflow: 'hidden',
    },
    notificationDate: {
      fontSize: 10,
    },
    unreadBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 8,
    },
    loadingContainer: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: '600',
    },
    emptySubtitle: {
      fontSize: 12,
      marginTop: 4,
    },
    paginationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      gap: 12,
      borderTopWidth: 1,
    },
  });
