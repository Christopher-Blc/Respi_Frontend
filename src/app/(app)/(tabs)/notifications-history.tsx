import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { ROUTES } from '../../../utils/routes';
import api from '../../../services/api';
import { Notification as AppNotification } from '../../../types/types';
import { useFocusEffect } from '@react-navigation/native';

const extractRows = (payload: unknown): AppNotification[] => {
  if (Array.isArray(payload)) return payload as AppNotification[];
  if (payload && typeof payload === 'object') {
    const rows = (payload as { rows?: unknown }).rows;
    if (Array.isArray(rows)) return rows as AppNotification[];
  }
  return [];
};

export default function NotificationsHistory() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showOnlyToday, setShowOnlyToday] = useState(false);

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      const rows = extractRows(res?.data);
      setNotifications(rows);
    } catch (error) {
      console.error('Error loading notifications from backend:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const parseDateValue = (value?: string | number) => {
    if (!value) return 0;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();

    if (typeof value === 'string') {
      const normalized = value.includes('T') ? value : value.replace(' ', 'T');
      const fallback = new Date(normalized);
      return Number.isNaN(fallback.getTime()) ? 0 : fallback.getTime();
    }

    return 0;
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
  useFocusEffect(
    React.useCallback(() => {
      void loadNotifications();
    }, [loadNotifications]),
  );

  const refresh = React.useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  const isToday = React.useCallback((value?: string | number) => {
    const date = new Date(value || 0);
    if (Number.isNaN(date.getTime())) return false;
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }, []);

  const filteredNotifications = React.useMemo(() => {
    if (!showOnlyToday) return notifications;
    return notifications.filter((item) => isToday(item.created_at));
  }, [notifications, showOnlyToday, isToday]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNotifications.length, showOnlyToday]);

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(filteredNotifications.length / PAGE_SIZE) || 1;
  const pagedNotifications = filteredNotifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const formatDate = (value?: string | number) => {
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
  };

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
            {item.title ||
              t('profileNotifications', { defaultValue: 'Notificaciones' })}
          </Text>
          <Text style={[styles.notificationBody, { color: theme.textBody }]}>
            {item.message}
          </Text>
          <Text
            style={[
              styles.notificationDate,
              {
                color: typeStyles.color,
                backgroundColor: typeStyles.backgroundColor,
                borderColor: typeStyles.borderColor,
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 999,
                overflow: 'hidden',
                alignSelf: 'flex-start',
                marginBottom: 6,
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
        size={64}
        color={theme.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: theme.textTitle }]}>
        {t('noNotifications', { defaultValue: 'Sin notificaciones' })}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textBody }]}>
        {showOnlyToday
          ? 'No hay notificaciones de hoy.'
          : t('noNotificationsDescription', {
              defaultValue: 'No hay notificaciones para mostrar',
            })}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View style={styles.listHeaderWrap}>
      {Platform.OS === 'web' && (
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.backgroundCard,
              borderColor: theme.primarySoft,
            },
          ]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={theme.primaryButton}
          />
          <Text style={[styles.infoText, { color: theme.textBody }]}>
            En web estas notificaciones no se muestran como popup; aqui solo se
            listan.
          </Text>
        </View>
      )}

      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setShowOnlyToday((prev) => !prev)}
          style={[
            styles.todayFilterButton,
            {
              borderColor: showOnlyToday
                ? theme.primaryButton
                : theme.primarySoft,
              backgroundColor: showOnlyToday
                ? theme.primaryButton + '25'
                : theme.backgroundCard,
            },
          ]}
        >
          <Ionicons
            name={showOnlyToday ? 'calendar' : 'calendar-outline'}
            size={16}
            color={showOnlyToday ? theme.primaryButton : theme.textBody}
          />
          <Text
            style={{
              color: showOnlyToday ? theme.primaryButton : theme.textBody,
              fontWeight: '700',
              fontSize: 13,
            }}
          >
            {showOnlyToday ? 'Solo hoy' : 'Ver solo hoy'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[
        theme.profileGradientStart,
        theme.profileGradientMiddle,
        theme.profileGradientEnd,
      ]}
      style={StyleSheet.absoluteFill}
    >
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        {/* Header custom */}
        <View
          style={[
            styles.customHeader,
            {
              paddingTop: insets.top,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.replace(ROUTES.userTabs.profile)}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color={theme.textTitle} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textTitle }]}>
            {t('profileNotifications', { defaultValue: 'Notificaciones' })}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {loading && notifications.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={36} color={theme.primaryButton} />
          </View>
        ) : (
          <>
            <FlatList
              data={pagedNotifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => String(item.id)}
              ListHeaderComponent={renderListHeader}
              contentContainerStyle={[
                styles.listContent,
                {
                  paddingBottom:
                    insets.bottom + (Platform.OS === 'web' ? 100 : 80),
                },
              ]}
              ListEmptyComponent={!loading ? renderEmptyState : null}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refresh}
                  tintColor={theme.primaryButton}
                />
              }
              scrollEnabled={filteredNotifications.length > 0}
            />
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
                    fontSize: 14,
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
                    size={22}
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
    </LinearGradient>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    customHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    listContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    listHeaderWrap: {
      marginBottom: 12,
      gap: 10,
    },
    infoCard: {
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
    filterRow: {
      flexDirection: 'row',
    },
    todayFilterButton: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
    },
    notificationCard: {
      flexDirection: 'row',
      borderRadius: 12,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderLeftWidth: 4,
      alignItems: 'center',
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      marginBottom: 6,
    },
    notificationBody: {
      fontSize: 14,
      marginBottom: 6,
      lineHeight: 20,
    },
    notificationDate: {
      fontSize: 12,
    },
    unreadBadge: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginLeft: 12,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
