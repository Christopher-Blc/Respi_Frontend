import { StyleSheet } from 'react-native';

export const webPaymentSheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalScroll: {
    width: '100%',
    maxHeight: '92%',
  },
  modalScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 480,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },
  form: {
    gap: 12,
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
    textAlign: 'center',
  },
  btn: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  payBtn: {
    backgroundColor: '#0ea5e9',
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelBtnText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
});
