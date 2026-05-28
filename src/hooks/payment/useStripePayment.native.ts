import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import api from '../../services/api';
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

      const paymentIntentId = data.clientSecret.split('_secret_')[0];

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
        if (presentError.code === 'Canceled') return false;
        setError(presentError.message);
        return false;
      }

      try {
        await api.post('/stripe/manual-confirm', { reservationId, paymentIntentId });
      } catch (e) {
        console.warn('[Stripe] manual-confirm failed, webhook may handle it', e);
      }

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Error al procesar el pago');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initAndPay, loading, error, PaymentModal: null };
}
