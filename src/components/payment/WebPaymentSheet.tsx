import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { webPaymentSheetStyles as styles } from '../../style/payment/webPaymentSheet.styles';

const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_KEY ?? '';
const stripePromise =
  typeof window !== 'undefined' && STRIPE_KEY ? loadStripe(STRIPE_KEY) : null;

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

  const stripeReady = !!stripe && !!elements;

  const handlePay = async () => {
    if (!stripeReady) {
      setErrorMsg('La pasarela de pago no está disponible. Recarga la página.');
      return;
    }
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
      {!stripeReady ? (
        <View style={{ alignItems: 'center', paddingVertical: 24, gap: 8 }}>
          <ActivityIndicator size="small" color="#0ea5e9" />
          <Text style={{ color: '#6b7280', fontSize: 13, textAlign: 'center' }}>
            Cargando pasarela de pago...
          </Text>
        </View>
      ) : (
        <PaymentElement />
      )}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <TouchableOpacity
        style={[
          styles.btn,
          styles.payBtn,
          (!stripeReady || loading) && { opacity: 0.6 },
        ]}
        onPress={handlePay}
        disabled={!stripeReady || loading}
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
  if (!stripePromise) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.backdrop}>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator
          >
            <View style={styles.card}>
              <Text style={styles.title}>Error de configuración</Text>
              <Text
                style={{
                  color: '#ef4444',
                  textAlign: 'center',
                  marginBottom: 16,
                  fontSize: 14,
                }}
              >
                La clave pública de Stripe no está configurada
                (EXPO_PUBLIC_STRIPE_KEY).
              </Text>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onCancel}
              >
                <Text style={styles.cancelBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  if (!clientSecret) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator
        >
          <View style={styles.card}>
            <Text style={styles.title}>{merchantName}</Text>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                amount={amount}
                onSuccess={onSuccess}
                onCancel={onCancel}
              />
            </Elements>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
