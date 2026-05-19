import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import api from '../services/api';

export interface UseStripePaymentResult {
  initAndPay: (reservationId: number, merchantName?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const isExpoGo = Constants.appOwnership === 'expo';

function useMockStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const initAndPay = async (_reservationId: number): Promise<boolean> => {
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 800));
    setLoading(false);
    console.log('[DEV] Pago simulado en Expo Go Android — reservationId:', _reservationId);
    return true;
  };

  return { initAndPay, loading, error };
}

function useRealStripePayment(): UseStripePaymentResult {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initAndPay = async (
    reservationId: number,
    merchantName = 'ResPi',
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<{ clientSecret: string }>(
        '/stripe/create-payment-intent',
        { reservationId },
      );
      const { clientSecret } = response.data;

      if (!clientSecret) {
        throw new Error('No se recibió clientSecret del servidor');
      }

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: merchantName,
        defaultBillingDetails: { name: '' },
        allowsDelayedPaymentMethods: false,
      });

      if (initError) throw new Error(initError.message);

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') return false;
        throw new Error(presentError.message);
      }

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error procesando el pago';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initAndPay, loading, error };
}

export const useStripePayment = isExpoGo ? useMockStripePayment : useRealStripePayment;
