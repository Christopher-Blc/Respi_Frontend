import React from 'react';
import { Text, View } from 'react-native';
import { reservationQrScannerWebStyles as styles } from '../../../style/admin/reservationQrScanner.styles';

type Props = {
  loading?: boolean;
  scanEnabled?: boolean;
  onCodeScanned?: (code: string) => void;
  onEnableScan?: () => void;
  primaryButtonColor?: string;
  onPrimaryColor?: string;
  primaryColor?: string;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
};

export default function ReservationQrScanner({
  borderColor,
  backgroundColor,
  textColor,
}: Props) {
  return (
    <View
      style={[
        styles.webNote,
        {
          borderColor,
          backgroundColor,
        },
      ]}
    >
      <Text style={{ color: textColor }}>
        La camara no esta disponible en web para este flujo. Usa el campo
        manual.
      </Text>
    </View>
  );
}

