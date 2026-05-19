import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import api from '../services/api';

interface UseStripePaymentResult {
  initAndPay: (reservationId: number, merchantName?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useStripePayment(): UseStripePaymentResult {
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
      // 1. Pedir el clientSecret al backend
      const response = await api.post<{ clientSecret: string }>(
        '/stripe/create-payment-intent',
        { reservationId },
      );
      const { clientSecret } = response.data;

      if (!clientSecret) {
        throw new Error('No se recibió clientSecret del servidor');
      }

      // 2. Inicializar el PaymentSheet de Stripe con el clientSecret
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: merchantName,
        defaultBillingDetails: { name: '' },
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // 3. Presentar el PaymentSheet al usuario
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        // El usuario canceló (Canceled) no es un error crítico
        if (presentError.code === 'Canceled') {
          return false;
        }
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
