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

