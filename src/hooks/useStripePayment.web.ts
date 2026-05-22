import React, { useRef, useState } from 'react';
import MockPaymentSheet from '../components/MockPaymentSheet';
import type { UseStripePaymentResult } from './useStripePayment';

export type { UseStripePaymentResult };

export function useStripePayment(): UseStripePaymentResult {
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [modalAmount, setModalAmount] = useState('0.00');
  const [modalMerchant, setModalMerchant] = useState('ResPi');
  const resolveRef = useRef<((paid: boolean) => void) | null>(null);

  const initAndPay = (
    _reservationId: number,
    merchantName = 'ResPi',
    amount = '0.00',
  ): Promise<boolean> => {
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
    resolveRef.current?.(true);
    resolveRef.current = null;
    console.log('[WEB] Pago simulado completado');
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
