import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../../../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useNotificationHistory } from '../../../hooks/useNotificationHistory';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import { StoredNotification } from '../../../services/notificationHistoryService';
import { requestPushPermissionsAndToken } from '../../../services/notificationsService';
import { ROUTES } from '../../../utils/routes';

export default function NotificationsHistory() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { notifications, loading, refresh } = useNotificationHistory();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [notifications.length]);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE) || 1;
  const pagedNotifications = notifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [togglingNotifications, setTogglingNotifications] = useState(false);

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Load notifications state on mount
  useEffect(() => {
    const loadNotificationsState = async () => {
      try {
        const stored = await AsyncStorage.getItem('notificationsEnabled');
        if (stored) {
          setNotificationsEnabled(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading notifications state:', error);
      }
    };
    loadNotificationsState();
  }, []);

  // Save notifications state to storage
  const saveNotificationsState = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(
        'notificationsEnabled',
        JSON.stringify(enabled),
      );
    } catch (error) {
      console.error('Error saving notifications state:', error);
    }
  };

  const handleToggleNotifications = async () => {
    setTogglingNotifications(true);
    try {
      // If already enabled, just disable
      if (notificationsEnabled) {
        setNotificationsEnabled(false);
        await saveNotificationsState(false);
        Alert.alert(
          t('profileNotifications', { defaultValue: 'Notificaciones' }),
          t('notificationsDisabledMessage', {
            defaultValue: 'Notificaciones desactivadas.',
          }),
        );
        return;
      }

      // If disabled, request permissions to enable
      const result = await requestPushPermissionsAndToken();

      if (result.granted) {
        setNotificationsEnabled(true);
        await saveNotificationsState(true);
        Alert.alert(
          t('profileNotifications', { defaultValue: 'Notificaciones' }),
          t('notificationsEnabledMessage', {
            defaultValue: 'Notificaciones activadas correctamente.',
          }),
        );
      } else {
        setNotificationsEnabled(false);
        await saveNotificationsState(false);
        Alert.alert(
          t('profileNotifications', { defaultValue: 'Notificaciones' }),
          result.error || t('authConnectionError', { defaultValue: 'Error' }),
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert(
        t('profileNotifications', { defaultValue: 'Notificaciones' }),
        t('authConnectionError', { defaultValue: 'Error' }),
      );
    } finally {
      setTogglingNotifications(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
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
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const renderNotificationItem = ({ item }: { item: StoredNotification }) => (
    <View
      style={[
        styles.notificationCard,
        {
          backgroundColor: item.read
            ? theme.backgroundCard
            : theme.primaryButton + '15',
          borderLeftColor: item.read ? theme.borderSoft : theme.primaryButton,
        },
      ]}
    >
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationTitle,
            { color: theme.textTitle, fontWeight: item.read ? '500' : '700' },
          ]}
        >
          {item.title}
        </Text>
        <Text style={[styles.notificationBody, { color: theme.textBody }]}>
          {item.body}
        </Text>
        <Text style={[styles.notificationDate, { color: theme.textSecondary }]}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
      {!item.read && (
        <View
          style={[styles.unreadBadge, { backgroundColor: theme.primaryButton }]}
        />
      )}
    </View>
  );

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
        {t('noNotificationsDescription', {
          defaultValue: 'No hay notificaciones de los últimos 30 días',
        })}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <View
      style={[styles.toggleCard, { backgroundColor: theme.backgroundCard }]}
    >
      <View style={styles.toggleContent}>
        <Ionicons
          name={notificationsEnabled ? 'notifications' : 'notifications-off'}
          size={24}
          color={theme.primaryButton}
        />
        <View style={styles.toggleTextContainer}>
          <Text style={[styles.toggleTitle, { color: theme.textTitle }]}>
            {t('profileNotifications', { defaultValue: 'Notificaciones' })}
          </Text>
          <Text style={[styles.toggleSubtitle, { color: theme.textBody }]}>
            {notificationsEnabled
              ? t('profileEnabled', { defaultValue: 'Activado' })
              : t('profileDisabled', { defaultValue: 'Desactivado' })}
          </Text>
        </View>
      </View>
      <Switch
        value={notificationsEnabled}
        onValueChange={handleToggleNotifications}
        disabled={togglingNotifications}
        trackColor={{
          false: theme.borderSoft,
          true: theme.primaryButton + '50',
        }}
        thumbColor={
          notificationsEnabled ? theme.primaryButton : theme.textSecondary
        }
      />
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
              keyExtractor={(item) => item.id}
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
              scrollEnabled={notifications.length > 0}
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
    toggleCard: {
      flexDirection: 'row',
      borderRadius: 12,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toggleContent: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    toggleTextContainer: {
      marginLeft: 12,
      flex: 1,
    },
    toggleTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    toggleSubtitle: {
      fontSize: 12,
      marginTop: 2,
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
