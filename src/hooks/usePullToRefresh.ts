import { useCallback, useState } from 'react';

export function usePullToRefresh(refreshAction: () => Promise<unknown> | unknown) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAction();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAction]);

  return {
    refreshing,
    onRefresh,
  };
}