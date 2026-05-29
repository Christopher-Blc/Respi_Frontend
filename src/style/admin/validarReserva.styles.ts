import { StyleSheet } from 'react-native';

export const validarReservaStyles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  manualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  searchBtn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultCard: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 10,
  },
  resultData: {
    gap: 6,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultValue: {
    flex: 1,
    fontSize: 13,
    textAlign: 'right',
    fontWeight: '500',
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '600',
  },
});
