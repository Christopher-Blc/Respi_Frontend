import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import api from '../services/api';
import type { UseStripePaymentResult } from './useStripePayment';

export function useStripePayment(): UseStripePaymentResult {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initAndPay = async (
    reservationId: number,
    merchantName = 'ResPi',
    _amount = '0.00',
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await api.post<{ clientSecret: string }>(
        '/stripe/create-payment-intent',
        { reservationId },
      );

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: merchantName,
        style: 'automatic',
      });

      if (initError) {
        setError(initError.message);
        return false;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code === 'Canceled') {
          return false;
        }
        setError(presentError.message);
        return false;
      }

      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Error al procesar el pago';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initAndPay, loading, error, PaymentModal: null };
}
