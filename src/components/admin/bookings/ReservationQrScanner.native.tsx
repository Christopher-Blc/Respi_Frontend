import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { reservationQrScannerNativeStyles as styles } from '../../../style/admin/reservationQrScanner.styles';
import { Camera, CameraView, BarcodeScanningResult } from 'expo-camera';

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
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const loadPermission = async () => {
      try {
        const current = await Camera.getCameraPermissionsAsync();
        setPermissionGranted(current.granted);
      } catch {
        setPermissionGranted(false);
      }
    };

    loadPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const next = await Camera.requestCameraPermissionsAsync();
      setPermissionGranted(next.granted);
    } catch {
      setPermissionGranted(false);
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    onCodeScanned(data || '');
  };

  if (permissionGranted === null) {
    return <ActivityIndicator color={primaryColor} />;
  }

  if (!permissionGranted) {
    return (
      <TouchableOpacity
        style={[styles.permissionBtn, { backgroundColor: primaryButtonColor }]}
        onPress={() => {
          requestPermission();
        }}
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

