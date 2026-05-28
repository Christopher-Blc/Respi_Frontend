import { StyleSheet } from 'react-native';

export const reservationQrScannerWebStyles = StyleSheet.create({
  webNote: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});

export const reservationQrScannerNativeStyles = StyleSheet.create({
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
