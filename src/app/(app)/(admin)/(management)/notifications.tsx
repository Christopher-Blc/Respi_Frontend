import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../../context/ThemeContext';
import api from '../../../../services/api';
import { SessionExpiredModal } from '../../../../components/alert.modal';
import { notificationsAdminStyles as styles } from '../../../../style/admin/notifications.styles';
import { usePullToRefresh } from '../../../../hooks/usePullToRefresh';

type NotificationKind = 'Aviso' | 'Recordatorio' | 'Alerta' | 'Promocion';

type NotificationListItem = {
  id: string;
  title: string;
  message: string;
  tipoNoti: string;
  createdAt?: string;
  userId?: string | null;
};

const NOTIFICATION_TYPES: NotificationKind[] = [
  'Aviso',
  'Recordatorio',
  'Alerta',
  'Promocion',
];

const parseNotification = (item: any, index: number): NotificationListItem => ({
  id: String(item?.id ?? item?.noti_id ?? item?.notification_id ?? index),
  title: String(item?.title ?? item?.titulo ?? 'Sin titulo'),
  message: String(item?.message ?? item?.mensaje ?? 'Sin mensaje'),
  tipoNoti: String(item?.tipoNoti ?? item?.tipo_noti ?? item?.tipo ?? 'Aviso'),
  createdAt: item?.createdAt ?? item?.created_at,
  userId: item?.user_id ?? item?.userId ?? null,
});

const getNotificationTypeStyle = (tipoNoti: string, theme: any) => {
  const normalized = tipoNoti.trim().toLowerCase();

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
    color: theme.primary,
    backgroundColor: theme.primary + '18',
    borderColor: theme.primary,
  };
};

const parseDateValue = (value?: string) => {
  if (!value) return 0;
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

export default function AdminNotificationsScreen() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [tipoNoti, setTipoNoti] = useState<NotificationKind>('Aviso');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const sendingLockRef = useRef(false);
  const [notifications, setNotifications] = useState<NotificationListItem[]>(
    [],
  );
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && message.trim().length > 0 && !sending,
    [title, message, sending],
  );

  const fetchNotifications = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await api.get('/notifications');
      const rawItems = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      const sorted = rawItems
        .map(parseNotification)
        .filter((n: NotificationListItem) => n.userId == null)
        .sort(
          (left: NotificationListItem, right: NotificationListItem) =>
            parseDateValue(right.createdAt) - parseDateValue(left.createdAt),
        );
      setNotifications(sorted);
    } catch {
      setNotifications([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const { refreshing, onRefresh } = usePullToRefresh(fetchNotifications);

  const handleConfirmSend = async () => {
    if (!canSubmit || sendingLockRef.current) return;

    sendingLockRef.current = true;
    setConfirmVisible(false);
    setSending(true);

    const body = {
      title: title.trim(),
      message: message.trim(),
      notification_type: tipoNoti,
    };

    try {
      const res = await api.post('/notifications/massive', body);

      setTitle('');
      setMessage('');
      setTipoNoti('Aviso');
      await fetchNotifications();

      console.log('Test log success:', res.status, res.data);
      Alert.alert('Exito', 'Notificacion enviada a todos los usuarios.');
    } catch {
      Alert.alert('Error', 'No se pudo enviar la notificacion masiva.');
    } finally {
      console.log('Test log body:', body);

      sendingLockRef.current = false;
      setSending(false);
    }
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(notifications.map((n) => n.tipoNoti).filter(Boolean));
    return Array.from(cats);
  }, [notifications]);

  const isInDateRange = useCallback(
    (value?: string): boolean => {
      if (dateFilter === 'all') return true;
      if (!value) return false;
      const date = new Date(value);
      const now = new Date();
      if (dateFilter === 'today') {
        return (
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        );
      }
      if (dateFilter === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return date >= weekAgo;
      }
      return true;
    },
    [dateFilter],
  );

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => isInDateRange(n.createdAt))
      .filter((n) =>
        categoryFilter
          ? n.tipoNoti?.toLowerCase() === categoryFilter.toLowerCase()
          : true,
      );
  }, [notifications, isInDateRange, categoryFilter]);

  const renderNotificationItem = ({ item }: { item: NotificationListItem }) => {
    const typeStyles = getNotificationTypeStyle(item.tipoNoti, theme);

    return (
      <View
        style={[
          styles.notificationCard,
          {
            backgroundColor: theme.backgroundCard,
            borderColor: typeStyles.borderColor,
          },
        ]}
      >
        <View style={styles.notificationHeader}>
          <Text
            style={[
              styles.notificationType,
              {
                color: typeStyles.color,
                backgroundColor: typeStyles.backgroundColor,
                borderColor: typeStyles.borderColor,
                borderWidth: 1,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 999,
                overflow: 'hidden',
              },
            ]}
          >
            {item.tipoNoti}
          </Text>
          {item.createdAt ? (
            <Text style={{ color: theme.textBody, fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.notificationTitle, { color: theme.textTitle }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.textBody }]}>
          {item.message}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundMain }]}>
      <FlatList
        data={filteredNotifications}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ paddingTop: headerHeight + 12 }}>
            <Text style={[styles.pageTitle, { color: theme.textTitle }]}>
              Administracion de notificaciones
            </Text>
            <Text style={[styles.pageSubtitle, { color: theme.textBody }]}>
              Crea y envia notificaciones masivas a todos los usuarios.
            </Text>

            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: theme.backgroundCard,
                  borderColor: theme.primarySoft,
                },
              ]}
            >
              <Text style={[styles.inputLabel, { color: theme.textBody }]}>
                Titulo
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Escribe el titulo"
                placeholderTextColor={theme.textBody + '80'}
                style={[
                  styles.input,
                  {
                    color: theme.textTitle,
                    borderColor: theme.primarySoft,
                    backgroundColor: theme.backgroundMain,
                  },
                ]}
              />

              <Text style={[styles.inputLabel, { color: theme.textBody }]}>
                Mensaje
              </Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                textAlignVertical="top"
                placeholder="Escribe el mensaje"
                placeholderTextColor={theme.textBody + '80'}
                style={[
                  styles.input,
                  styles.multiline,
                  {
                    color: theme.textTitle,
                    borderColor: theme.primarySoft,
                    backgroundColor: theme.backgroundMain,
                  },
                ]}
              />

              <Text style={[styles.inputLabel, { color: theme.textBody }]}>
                Tipo
              </Text>
              <View style={styles.typeRow}>
                {NOTIFICATION_TYPES.map((type) => {
                  const selected = tipoNoti === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeChip,
                        {
                          borderColor: selected
                            ? theme.primary
                            : theme.primarySoft,
                          backgroundColor: selected
                            ? theme.primary + '22'
                            : theme.backgroundMain,
                        },
                      ]}
                      onPress={() => setTipoNoti(type)}
                    >
                      <Ionicons
                        name={selected ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={selected ? theme.primary : theme.textBody}
                      />
                      <Text
                        style={{
                          color: selected ? theme.primary : theme.textBody,
                          fontWeight: selected ? '700' : '500',
                        }}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                disabled={!canSubmit}
                onPress={() => setConfirmVisible(true)}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: canSubmit
                      ? theme.primary
                      : theme.primarySoft,
                    opacity: canSubmit ? 1 : 0.7,
                  },
                ]}
              >
                {sending ? (
                  <ActivityIndicator color={theme.onPrimary} />
                ) : (
                  <Text
                    style={[styles.sendButtonText, { color: theme.onPrimary }]}
                  >
                    Enviar a todos los usuarios
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.listTitle, { color: theme.textTitle }]}>
              Notificaciones masivas
            </Text>

            {/* Filtros lista */}
            <View style={styles.filterRow}>
              {(['all', 'today', 'week'] as const).map((df) => {
                const labels = {
                  all: 'Todas',
                  today: 'Hoy',
                  week: 'Esta semana',
                };
                const active = dateFilter === df;
                return (
                  <TouchableOpacity
                    key={df}
                    onPress={() => setDateFilter(df)}
                    style={[
                      styles.filterChip,
                      {
                        borderColor: active ? theme.primary : theme.primarySoft,
                        backgroundColor: active
                          ? theme.primary + '22'
                          : theme.backgroundMain,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active ? theme.primary : theme.textBody,
                        fontWeight: active ? '700' : '500',
                        fontSize: 11,
                      }}
                    >
                      {labels[df]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {uniqueCategories.length > 0 && (
              <View style={styles.filterRow}>
                {uniqueCategories.map((cat) => {
                  const active = categoryFilter === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategoryFilter(active ? null : cat)}
                      style={[
                        styles.filterChip,
                        {
                          borderColor: active
                            ? theme.primary
                            : theme.primarySoft,
                          backgroundColor: active
                            ? theme.primary + '22'
                            : theme.backgroundMain,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: active ? theme.primary : theme.textBody,
                          fontWeight: active ? '700' : '500',
                          fontSize: 11,
                        }}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          loadingList ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={{ color: theme.textBody }}>
                No hay notificaciones para mostrar.
              </Text>
            </View>
          )
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 60 : 120),
          gap: 10,
        }}
        renderItem={renderNotificationItem}
      />

      <SessionExpiredModal
        visible={confirmVisible}
        title="Confirmar envio"
        message="Se enviara esta notificacion a todos los usuarios. Quieres continuar?"
        confirmText="Enviar"
        cancelText="Cancelar"
        onConfirm={handleConfirmSend}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}
