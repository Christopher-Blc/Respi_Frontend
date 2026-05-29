import React, { useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import WebPaymentSheet from '../../components/payment/WebPaymentSheet';
import api from '../../services/api';

export interface UseStripePaymentResult {
  initAndPay: (reservationId: number, merchantName?: string, amount?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  PaymentModal: React.ReactElement | null;
}

export function useStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [merchantName, setMerchantName] = useState('ResPi');
  const [amount, setAmount] = useState('0.00');

  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const reservationIdRef = useRef<number>(0);

  const initAndPay = async (
    reservationId: number,
    name = 'ResPi',
    amountStr = '0.00',
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setMerchantName(name);
    setAmount(amountStr);
    reservationIdRef.current = reservationId;

    try {
      const { data } = await api.post('/stripe/create-payment-intent', { reservationId });
      setClientSecret(data.clientSecret);
      setModalVisible(true);
      setLoading(false);

      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
      });
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message ?? 'Error al iniciar el pago');
      return false;
    }
  };

  const handleSuccess = async (paymentIntentId: string) => {
    setModalVisible(false);
    try {
      await api.post('/stripe/manual-confirm', {
        reservationId: reservationIdRef.current,
        paymentIntentId,
      });
    } catch (e) {
      // BUG-EDGE-003: Stripe charged successfully but our backend confirm failed.
      // Do NOT retry automatically (risk of double-confirm). Inform the user so
      // they can contact support. The payment ID (pi_xxx) is non-sensitive.
      console.warn('[Stripe] manual-confirm failed. Payment ID:', paymentIntentId, 'Reservation ID:', reservationIdRef.current, e);
      const reservationId = reservationIdRef.current;
      const message =
        `Tu pago fue procesado correctamente pero hubo un error al confirmar la reserva. ` +
        `Por favor contacta con soporte indicando tu ID de reserva: ${reservationId} ` +
        `(referencia de pago: ${paymentIntentId}).`;
      if (Platform.OS === 'web') {
        // On web, Alert.alert is not always available; use window.alert as fallback.
        if (typeof window !== 'undefined' && window.alert) {
          window.alert(message);
        }
      } else {
        Alert.alert('Error al confirmar reserva', message);
      }
    }
    resolveRef.current?.(true);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setModalVisible(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  };

  const PaymentModal = React.createElement(WebPaymentSheet, {
    visible: modalVisible,
    clientSecret,
    merchantName,
    amount,
    onSuccess: handleSuccess,
    onCancel: handleCancel,
  });

  return { initAndPay, loading, error, PaymentModal };
}
