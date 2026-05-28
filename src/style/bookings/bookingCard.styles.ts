import { StyleSheet } from 'react-native';
import { lightModeSemanticTokens } from '../../theme';

export const bookingCardStyles = StyleSheet.create({
  card: {
    backgroundColor: lightModeSemanticTokens.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: lightModeSemanticTokens.borderSoft,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  code: { fontWeight: '700' },
  status: { color: '#374151' },
  meta: { color: '#6b7280', marginTop: 4 },
  note: { marginTop: 8, color: '#374151' },
  actions: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#06b6d4',
  },
  cancel: {
    backgroundColor: lightModeSemanticTokens.danger,
    borderColor: lightModeSemanticTokens.danger,
  },
  btnText: { color: '#06b6d4', fontWeight: '600' },
});
