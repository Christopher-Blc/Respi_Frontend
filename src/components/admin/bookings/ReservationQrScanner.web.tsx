import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

const styles = StyleSheet.create({
  webNote: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});
