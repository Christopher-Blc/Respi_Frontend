import { useState, useEffect, useCallback } from 'react';
import {
  getNotificationsFromLastDays,
  StoredNotification,
  markNotificationAsRead,
} from '../../services/notifications/notificationHistoryService';
import { useFocusEffect } from '@react-navigation/native';

export const useNotificationHistory = () => {
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const recent = await getNotificationsFromLastDays(30);
      setNotifications(recent);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      await markNotificationAsRead(notificationId);
      await loadNotifications();
    },
    [loadNotifications],
  );

  const refresh = useCallback(async () => {
    await loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    markAsRead: handleMarkAsRead,
    refresh,
  };
};
