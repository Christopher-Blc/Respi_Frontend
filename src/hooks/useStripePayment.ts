import { useState } from 'react';
// ¡OJO! No importamos nada de @stripe/stripe-react-native aquí para evitar que rompa la web

interface UseStripePaymentResult {
  initAndPay: (reservationId: number, merchantName?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initAndPay = async (
    reservationId: number,
    merchantName = 'ResPi',
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Opción A: Puedes redirigir a una pasarela web de Stripe si la tienes programada.
      // Opción B (La más común si los pagos solo se hacen en la App): Mostrar un aviso amigable.
      alert('Para realizar pagos de forma segura en las pistas, descarga nuestra App Oficial de Respi.');
      
      return false;
    } catch (err: unknown) {
      setError('No disponible en versión Web');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initAndPay, loading, error };
}