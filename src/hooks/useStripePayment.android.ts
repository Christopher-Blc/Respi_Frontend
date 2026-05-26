import React, { useRef, useState } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import api from '../services/api';
import MockPaymentSheet from '../components/MockPaymentSheet';
import type { UseStripePaymentResult } from './useStripePayment';

export type { UseStripePaymentResult };

const isExpoGo = Constants.appOwnership === 'expo';

function useMockStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [modalAmount, setModalAmount] = useState('0.00');
  const [modalMerchant, setModalMerchant] = useState('ResPi');
  const resolveRef = useRef<((paid: boolean) => void) | null>(null);
  const reservationIdRef = useRef<number>(0);

  const initAndPay = (
    reservationId: number,
    merchantName = 'ResPi',
    amount = '0.00',
  ): Promise<boolean> => {
    reservationIdRef.current = reservationId;
    setModalMerchant(merchantName);
    setModalAmount(amount);
    setVisible(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handlePay = async () => {
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1200));
    setLoading(false);
    setVisible(false);
    try {
      await api.post('/stripe/manual-confirm', { reservationId: reservationIdRef.current });
    } catch (e) {
      console.warn('[DEV] manual-confirm failed', e);
    }
    resolveRef.current?.(true);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setVisible(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  };

  const PaymentModal = React.createElement(MockPaymentSheet, {
    visible,
    amount: modalAmount,
    merchantName: modalMerchant,
    loading,
    onPay: handlePay,
    onCancel: handleCancel,
  });

  return { initAndPay, loading, error, PaymentModal };
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

      if (!clientSecret) throw new Error('No se recibió clientSecret del servidor');

      const paymentIntentId = clientSecret.split('_secret_')[0];

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

      try {
        await api.post('/stripe/manual-confirm', { reservationId, paymentIntentId });
      } catch (e) {
        console.warn('[Stripe] manual-confirm failed, webhook may handle it', e);
      }

      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error procesando el pago');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { initAndPay, loading, error, PaymentModal: null };
}

export const useStripePayment = isExpoGo ? useMockStripePayment : useRealStripePayment;
