import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = 'notification_history';

export const addNotificationToHistory = async (
  title: string,
  body: string,
): Promise<void> => {
  try {
    const storedNotifications = await getNotificationHistory();
    
    const newNotification: StoredNotification = {
      id: `${Date.now()}_${Math.random()}`,
      title,
      body,
      timestamp: Date.now(),
      read: false,
    };

    const updatedNotifications = [newNotification, ...storedNotifications].slice(0, 100);
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(updatedNotifications),
    );
  } catch (error) {
    console.error('Error adding notification to history:', error);
  }
};

export const getNotificationHistory = async (): Promise<StoredNotification[]> => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving notification history:', error);
    return [];
  }
};

export const getNotificationsFromLastDays = async (
  days: number = 30,
): Promise<StoredNotification[]> => {
  try {
    const allNotifications = await getNotificationHistory();
    const thirtyDaysAgo = Date.now() - days * 24 * 60 * 60 * 1000;
    
    return allNotifications.filter(
      (notification) => notification.timestamp >= thirtyDaysAgo,
    );
  } catch (error) {
    console.error('Error getting recent notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    const allNotifications = await getNotificationHistory();
    const updated = allNotifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification,
    );
    await AsyncStorage.setItem(
      NOTIFICATIONS_STORAGE_KEY,
      JSON.stringify(updated),
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

export const clearNotificationHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing notification history:', error);
  }
};
