import { useState } from 'react';
import { Platform } from 'react-native';

// No se importa nada de @stripe/stripe-react-native aqui para evitar que rompa la web
export interface UseStripePaymentResult {
  initAndPay: (reservationId: number, merchantName?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

function useMockStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initAndPay = async (_reservationId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (Platform.OS === 'web') {
        alert('Para realizar pagos de forma segura en las pistas, descarga nuestra App Oficial de Respi.');
        return false;
      }

      await new Promise<void>((r) => setTimeout(r, 800));
      console.log('[DEV] Pago simulado en iOS Expo Go — reservationId:', _reservationId);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error procesando el pago');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initAndPay, loading, error };
}

export const useStripePayment = useMockStripePayment;
