import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    inputWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    right: 5,
    top: 0,
    zIndex: 1,
  },
  darkModeButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    zIndex: 10,
    backgroundColor:"#5100ff"
  },
  background: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  glass: {
    width: '85%',
    height: '60%',
    maxWidth: 340,
    padding: 25,
    borderRadius: 30, 
    borderWidth: 0.8,
    borderColor: "#ccc",
    //borderWidth: 0.5,
    //borderColor: '#616161',
    //backgroundColor: 'rgba(255, 170, 0, 0.12)',
    overflow: 'hidden',
    alignItems: 'center', 
    alignSelf: 'center',
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
    color: '#444', // Un pelín más oscuro para contraste
    textAlign: 'center',
    lineHeight: 22,
    // Sombra de texto (funciona en iOS, Android y Web)
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    color: '#000000', 
  },
  error: {
    color: '#D32F2F',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
export default styles;              