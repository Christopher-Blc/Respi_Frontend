import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
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

type NotificationKind = 'Aviso' | 'Recordatorio' | 'Alerta' | 'Promocion';

type NotificationListItem = {
  id: string;
  title: string;
  message: string;
  tipoNoti: string;
  createdAt?: string;
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
});

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
  const [notifications, setNotifications] = useState<NotificationListItem[]>(
    [],
  );

  const canSubmit = useMemo(
    () => title.trim().length > 0 && message.trim().length > 0 && !sending,
    [title, message, sending],
  );

  const fetchNotifications = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await api.get('/Notification');
      const rawItems = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
      setNotifications(rawItems.map(parseNotification));
    } catch {
      setNotifications([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const handleConfirmSend = async () => {
    if (!canSubmit) return;

    setConfirmVisible(false);
    setSending(true);

    const body = {
      titulo: title.trim(),
      mensaje: message.trim(),
      tipoNoti,
    };

    try {
      const res = await api.post('/Notification/massive', body);

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

      setSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundMain }]}>
      <FlatList
        data={notifications}
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
              Listado de notificaciones
            </Text>
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
        renderItem={({ item }) => (
          <View
            style={[
              styles.notificationCard,
              {
                backgroundColor: theme.backgroundCard,
                borderColor: theme.primarySoft,
              },
            ]}
          >
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationType, { color: theme.primary }]}>
                #{item.tipoNoti}
              </Text>
              {item.createdAt ? (
                <Text style={{ color: theme.textBody, fontSize: 12 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              ) : null}
            </View>
            <Text
              style={[styles.notificationTitle, { color: theme.textTitle }]}
            >
              {item.title}
            </Text>
            <Text
              style={[styles.notificationMessage, { color: theme.textBody }]}
            >
              {item.message}
            </Text>
          </View>
        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  pageSubtitle: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  multiline: {
    minHeight: 120,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyWrap: {
    paddingVertical: 22,
    alignItems: 'center',
  },
  notificationCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationType: {
    fontSize: 12,
    fontWeight: '800',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  notificationMessage: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
});
