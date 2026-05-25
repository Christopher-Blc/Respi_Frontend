import React, { useRef, useState } from 'react';
import WebPaymentSheet from '../components/WebPaymentSheet';
import api from '../services/api';

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
      console.warn('[Stripe] manual-confirm failed, webhook may handle it', e);
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
