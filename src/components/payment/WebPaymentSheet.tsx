import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { webPaymentSheetStyles as styles } from '../../style/payment/webPaymentSheet.styles';

const stripePromise =
  typeof window !== 'undefined'
    ? loadStripe(process.env.EXPO_PUBLIC_STRIPE_KEY ?? '')
    : null;

type Props = {
  visible: boolean;
  clientSecret: string;
  merchantName: string;
  amount: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
};

function CheckoutForm({
  amount,
  onSuccess,
  onCancel,
}: {
  amount: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message ?? 'Error al procesar el pago');
    } else {
      onSuccess(paymentIntent?.id ?? '');
    }
  };

  return (
    <View style={styles.form}>
      <PaymentElement />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <TouchableOpacity
        style={[styles.btn, styles.payBtn]}
        onPress={handlePay}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.payBtnText}>Pagar €{amount}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, styles.cancelBtn]}
        onPress={onCancel}
        disabled={loading}
      >
        <Text style={styles.cancelBtnText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function WebPaymentSheet({
  visible,
  clientSecret,
  merchantName,
  amount,
  onSuccess,
  onCancel,
}: Props) {
  if (!stripePromise || !clientSecret) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{merchantName}</Text>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        </View>
      </View>
    </Modal>
  );
}

