import { useState } from 'react';

export interface UseStripePaymentResult {
  initAndPay: (reservationId: number, merchantName?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

function useMockStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const initAndPay = async (_reservationId: number): Promise<boolean> => {
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 800));
    setLoading(false);
    console.log('[DEV] Pago simulado en iOS Expo Go — reservationId:', _reservationId);
    return true;
  };

  return { initAndPay, loading, error };
}

export const useStripePayment = useMockStripePayment;
