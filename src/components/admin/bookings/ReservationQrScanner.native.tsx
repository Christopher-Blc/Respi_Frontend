import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';

type Props = {
  loading: boolean;
  scanEnabled: boolean;
  onCodeScanned: (code: string) => void;
  onEnableScan: () => void;
  primaryButtonColor: string;
  onPrimaryColor: string;
  primaryColor: string;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
};

export default function ReservationQrScanner({
  loading,
  scanEnabled,
  onCodeScanned,
  onEnableScan,
  primaryButtonColor,
  onPrimaryColor,
  primaryColor,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    onCodeScanned(data || '');
  };

  if (!permission) {
    return <ActivityIndicator color={primaryColor} />;
  }

  if (!permission.granted) {
    return (
      <TouchableOpacity
        style={[styles.permissionBtn, { backgroundColor: primaryButtonColor }]}
        onPress={requestPermission}
      >
        <Text style={[styles.permissionBtnText, { color: onPrimaryColor }]}>
          Permitir camara
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.cameraWrap}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={
          !scanEnabled || loading ? undefined : handleBarcodeScanned
        }
      />
      {!scanEnabled && (
        <TouchableOpacity
          style={[styles.reScanBtn, { backgroundColor: primaryButtonColor }]}
          onPress={onEnableScan}
        >
          <Text style={[styles.reScanText, { color: onPrimaryColor }]}>
            Reactivar escaner
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  permissionBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  permissionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cameraWrap: {
    width: '100%',
    height: 260,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  reScanBtn: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  reScanText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
