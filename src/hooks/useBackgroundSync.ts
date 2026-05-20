/**
 * useBackgroundSync.ts
 *
 * RA4 — Fils d'execució (Threading)
 * Hook que gestiona el cicle de vida del fil de background des del component React.
 * Exposa l'estat del thread i permet activar/desactivar-lo manualment.
 */

import * as BackgroundTask from 'expo-background-task';
import { useCallback, useEffect, useState } from 'react';
import {
  getBackgroundSyncStatus,
  registerBackgroundSync,
  unregisterBackgroundSync,
} from '../services/backgroundSyncService';

export type BackgroundSyncState = {
  /** Indica si el fil de background està actiu */
  isActive: boolean;
  /** Estat retornat pel sistema operatiu del thread */
  status: BackgroundTask.BackgroundTaskStatus | null;
  /** Indica si s'està processant una operació (registre/aturada) */
  isLoading: boolean;
  /** Activa el fil de background */
  enableSync: () => Promise<void>;
  /** Desactiva el fil de background */
  disableSync: () => Promise<void>;
};

export function useBackgroundSync(): BackgroundSyncState {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<BackgroundTask.BackgroundTaskStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** Comprova l'estat inicial del fil en muntar el component */
  useEffect(() => {
    (async () => {
      const currentStatus = await getBackgroundSyncStatus();
      setStatus(currentStatus);
      setIsActive(
        currentStatus === BackgroundTask.BackgroundTaskStatus.Available,
      );
    })();
  }, []);

  const enableSync = useCallback(async () => {
    setIsLoading(true);
    try {
      await registerBackgroundSync();
      const currentStatus = await getBackgroundSyncStatus();
      setStatus(currentStatus);
      setIsActive(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableSync = useCallback(async () => {
    setIsLoading(true);
    try {
      await unregisterBackgroundSync();
      setIsActive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isActive, status, isLoading, enableSync, disableSync };
}
