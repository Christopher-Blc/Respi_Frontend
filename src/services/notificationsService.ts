import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { addNotificationToHistory } from './notificationHistoryService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  } as any),
});

export type PushRegistrationResult = {
  granted: boolean;
  token?: string;
  error?: string;
};

export const setupNotificationChannelAndroid = async () => {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    
  });
};

export const requestPushPermissionsAndToken = async (): Promise<PushRegistrationResult> => {
  if (!Device.isDevice) {
    return {
      granted: false,
      error: 'Las notificaciones push requieren un dispositivo fisico.',
    };
  }

  const { status: currentStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = currentStatus;

  if (currentStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return {
      granted: false,
      error: 'Permiso de notificaciones no concedido.',
    };
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  try {
    const pushToken = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );

    return {
      granted: true,
      token: pushToken.data,
    };
  } catch {
    return {
      granted: false,
      error: 'No se pudo obtener el token de notificaciones.',
    };
  }
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  seconds: number = 2,
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
};

export const addNotificationReceivedListener = (
  listener: (event: Notifications.Notification) => void,
) => {
  return Notifications.addNotificationReceivedListener((event) => {
    // Save to history
    if (event.request.content.title || event.request.content.body) {
      addNotificationToHistory(
        event.request.content.title || 'ResPi',
        event.request.content.body || '',
      ).catch(console.error);
    }
    // Call the provided listener
    listener(event);
  });
};

export const addNotificationResponseListener = (
  listener: (event: Notifications.NotificationResponse) => void,
) => Notifications.addNotificationResponseReceivedListener(listener);

export const removeNotificationSubscription = (
  subscription?: Notifications.EventSubscription | null,
) => {
  if (!subscription) return;
  subscription.remove();
};
