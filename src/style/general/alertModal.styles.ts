import { StyleSheet } from 'react-native';

export const alertModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    width: '80%',
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  contentContainer: {
    width: '100%',
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
});
