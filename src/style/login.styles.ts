import { StyleSheet } from 'react-native';
import { lightModeSemanticTokens } from '../theme';

const styles = StyleSheet.create({
  testErrorButton: {
    position: 'absolute',
    bottom: 40,
    right: 80,
    zIndex: 10,
    backgroundColor: lightModeSemanticTokens.debugButton,
  },
  darkModeButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: lightModeSemanticTokens.debugButton,
  },
  background: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  glass: {
    width: '85%',
    maxWidth: 340,
    padding: 25,
    borderRadius: 30, 
    borderWidth: 0.8,
    borderColor: lightModeSemanticTokens.textSubtle,
    //borderWidth: 0.5,
    //borderColor: '#616161',
    //backgroundColor: 'rgba(255, 170, 0, 0.12)',
    overflow: 'hidden',
    alignItems: 'center', 
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500',
    fontSize: 16,
    color: lightModeSemanticTokens.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    // Sombra de texto (funciona en iOS, Android y Web)
    textShadowColor: lightModeSemanticTokens.surfaceGlass,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    width: '100%',
    backgroundColor: lightModeSemanticTokens.inputBgSoft,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: lightModeSemanticTokens.borderInput,
    color: '#000000',
  },
  error: {
    color: lightModeSemanticTokens.errorText,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default styles;              