import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockPaymentSheetStyles as styles } from '../../style/payment/mockPaymentSheet.styles';

interface Props {
  visible: boolean;
  amount: string;
  merchantName?: string;
  loading: boolean;
  onPay: () => void;
  onCancel: () => void;
}

function fmtCard(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 16);
  return d.replace(/(.{4})(?=.)/g, '$1 ');
}

function fmtExpiry(text: string): string {
  const d = text.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}

function validateFields(
  card: string,
  expiry: string,
  cvc: string,
  name: string,
): string | null {
  const cardDigits = card.replace(/\D/g, '');
  if (cardDigits.length < 16) {
    return 'Introduce un número de tarjeta válido (16 dígitos).';
  }

  const expiryDigits = expiry.replace(/\D/g, '');
  if (expiryDigits.length < 4) {
    return 'Introduce la fecha de expiración en formato MM/AA.';
  }

  const month = Number(expiryDigits.slice(0, 2));
  if (month < 1 || month > 12) {
    return 'El mes de expiración no es válido.';
  }

  if (cvc.length < 3) {
    return 'Introduce un CVC válido (3-4 dígitos).';
  }

  if (!name.trim()) {
    return 'Introduce el nombre que aparece en la tarjeta.';
  }

  return null;
}

export default function MockPaymentSheet({
  visible,
  amount,
  merchantName = 'ResPi',
  loading,
  onPay,
  onCancel,
}: Props) {
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePay = () => {
    const error = validateFields(card, expiry, cvc, name);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    onPay();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onCancel}
          activeOpacity={1}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          {/* Cabecera */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.merchantName}>{merchantName}</Text>
              <Text style={styles.amountText}>€{amount}</Text>
            </View>
            <View style={{ width: 70 }} />
          </View>

          <ScrollView
            style={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Número de tarjeta */}
            <Text style={styles.sectionLabel}>Información de la tarjeta</Text>
            <View style={styles.cardGroup}>
              <View style={[styles.inputWrap, styles.borderBottom]}>
                <TextInput
                  style={styles.input}
                  placeholder="Número de tarjeta"
                  placeholderTextColor="#9CA3AF"
                  value={card}
                  onChangeText={(t) => {
                    setCard(fmtCard(t));
                    setValidationError(null);
                  }}
                  keyboardType="number-pad"
                  returnKeyType="next"
                />
                <Ionicons name="card-outline" size={20} color="#9CA3AF" />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputWrap, styles.halfLeft]}>
                  <TextInput
                    style={styles.input}
                    placeholder="MM / AA"
                    placeholderTextColor="#9CA3AF"
                    value={expiry}
                    onChangeText={(t) => {
                      setExpiry(fmtExpiry(t));
                      setValidationError(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={7}
                    returnKeyType="next"
                  />
                </View>
                <View style={[styles.inputWrap, styles.halfRight]}>
                  <TextInput
                    style={styles.input}
                    placeholder="CVC"
                    placeholderTextColor="#9CA3AF"
                    value={cvc}
                    onChangeText={(t) => {
                      setCvc(t.replace(/\D/g, '').slice(0, 4));
                      setValidationError(null);
                    }}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="next"
                  />
                  <Ionicons name="help-circle-outline" size={18} color="#9CA3AF" />
                </View>
              </View>
            </View>

            {/* Nombre */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
              Nombre en la tarjeta
            </Text>
            <View style={styles.cardGroup}>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre Apellido"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    setValidationError(null);
                  }}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Mensaje de error de validación */}
            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}

            {/* Botón pagar */}
            <TouchableOpacity
              style={[styles.payBtn, loading && { opacity: 0.7 }]}
              onPress={handlePay}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payBtnText}>Pagar</Text>
              )}
            </TouchableOpacity>

            {/* Powered by */}
            <View style={styles.poweredBy}>
              <Ionicons name="lock-closed" size={11} color="#9CA3AF" />
              <Text style={styles.poweredByText}> Powered by </Text>
              <Text style={styles.stripeText}>stripe</Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

<<<<<<< HEAD:src/components/payment/MockPaymentSheet.tsx
=======
const STRIPE = '#625BF6';

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cancelBtn: { width: 70 },
  cancelBtnText: { color: STRIPE, fontSize: 15 },
  headerCenter: { alignItems: 'center' },
  merchantName: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  amountText: { fontSize: 26, fontWeight: '700', color: '#111827', marginTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  sectionLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  cardGroup: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row' },
  halfLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  halfRight: { flex: 1 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  payBtn: {
    backgroundColor: STRIPE,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  payBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 4,
  },
  poweredByText: { fontSize: 12, color: '#9CA3AF' },
  stripeText: { fontSize: 12, color: '#635BFF', fontWeight: '700' },
});
>>>>>>> 45064c4666ee7aca8c60e8eb4c2e15eb645486a0:src/components/MockPaymentSheet.tsx
