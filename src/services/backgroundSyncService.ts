/**
 * backgroundSyncService.ts
 *
 * RA4 — Fils d'execució (Threading)
 * Implementa una task de background que corre en un fil d'execució separat
 * del JS thread principal, usant expo-task-manager i expo-background-fetch.
 *
 * Flux:
 *  1. El sistema operatiu desperta l'app en background (cada ~15 min aprox)
 *  2. expo-task-manager executa BOOKING_SYNC_TASK en un context JS separat
 *  3. La task comprova si hi ha reserves noves o canvis d'estat
 *  4. Si detecta canvis, envia una notificació local a l'usuari
 */

import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { getToken } from './authStorage';

export const BOOKING_SYNC_TASK = 'BOOKING_SYNC_TASK';

const BASE_URL = 'https://respi.es/api';

/** Comprova reserves noves des del background thread */
async function fetchReservationsInBackground(): Promise<number> {
  const token = await getToken();
  if (!token) return 0;

  const response = await fetch(`${BASE_URL}/reservations/my-reservations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) return 0;

  const payload = await response.json();
  const reservations: Array<{ id: number; status: string }> = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return reservations.length;
}

/** Envia una notificació local quan el background thread detecta canvis */
async function sendSyncNotification(count: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'ResPi — Sincronització en background',
      body: `S'han trobat ${count} reserves actuals. (Thread de background)`,
      sound: true,
    },
    trigger: null, // envia immediatament
  });
}

/**
 * Definició del fil d'execució de background.
 * TaskManager crea un context JS independent del thread principal.
 */
TaskManager.defineTask(BOOKING_SYNC_TASK, async () => {
  try {
    const count = await fetchReservationsInBackground();

    if (count > 0) {
      await sendSyncNotification(count);
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/** Registra la task de background al sistema operatiu */
export async function registerBackgroundSync(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BOOKING_SYNC_TASK);
  if (isRegistered) return;

  await BackgroundFetch.registerTaskAsync(BOOKING_SYNC_TASK, {
    minimumInterval: 15 * 60, // mínim 15 minuts (limitació SO)
    stopOnTerminate: false,   // continua quan es tanca l'app
    startOnBoot: true,        // s'inicia en arrencar el dispositiu
  });
}

/** Atura i desregistra la task de background */
export async function unregisterBackgroundSync(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BOOKING_SYNC_TASK);
  if (isRegistered) {
    await BackgroundFetch.unregisterTaskAsync(BOOKING_SYNC_TASK);
  }
}

/** Retorna l'estat actual del fil de background */
export async function getBackgroundSyncStatus(): Promise<BackgroundFetch.BackgroundFetchStatus | null> {
  return BackgroundFetch.getStatusAsync();
}
