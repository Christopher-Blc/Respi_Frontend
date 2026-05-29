import { StyleSheet } from 'react-native';
import { lightModeSemanticTokens } from '../../theme';

export const glassTextButtonStyles = StyleSheet.create({
  glass: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(221, 151, 0, 0.3)',
    borderWidth: 0.9,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pressable: {
    width: '100%',
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export const glassTextInputStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
});

export const glassTextInputPasswordStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
});

export const passwordStrengthStyles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
    marginBottom: 12,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkmark: {
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 12,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  successMessage: {
    marginTop: 4,
    paddingVertical: 6,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export const animatedSportTextStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '8%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export const languagePickerModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: 300,
    maxHeight: 420,
    borderRadius: 22,
    borderWidth: 0.8,
    overflow: 'hidden',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  list: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderBottomWidth: 0.3,
    gap: 10,
  },
  languageName: {
    flex: 1,
    fontSize: 14,
  },
  code: {
    fontSize: 13,
  },
});

export const countryPickerModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: 300,
    maxHeight: 420,
    borderRadius: 22,
    borderWidth: 0.8,
    overflow: 'hidden',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  searchWrapper: {
    paddingHorizontal: 14,
    paddingBottom: 4,
  },
  list: {
    maxHeight: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderBottomWidth: 0.3,
    gap: 10,
  },
  flag: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  countryName: {
    flex: 1,
    fontSize: 14,
  },
  code: {
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
  },
});

export const liquidGlassStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glass: {
    width: 280,
    height: 160,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: lightModeSemanticTokens.borderGlass,
  },
});
