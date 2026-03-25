import React, { useState } from 'react';
import {
  ImageBackground, 
  Image,          
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconButton } from 'react-native-paper';
import { RectangularButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import api from '../../services/api';

// Nota: este es un login de ejemplo. Reemplazar con autenticación real luego.
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

 const handleSubmit = async () => {
    if (!email || !password) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    try {
      setError(''); // Limpiamos errores previos
      
      // Llamada a tu endpoint de NestJS (ej: /auth/login)
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password: password,
      });


      if (response.data.access_token) {
        // AQUÍ: Guardar el token (ver paso 4)
        console.log('Login exitoso:', response.data.access_token);
        router.replace('/(app)/home');
      }
    } catch (err: any) {
      // Manejo de errores de NestJS
      const message = err.response?.data?.message || 'Error de conexión';
      console.log('Error en login:', err);
      setError(Array.isArray(message) ? message[0] : message);
    }
  };


  // 2. Define dynamic assets based on mode
  const bgImage = isDarkMode 
    ? require('../../../assets/login-bg-dark.png') 
    : require('../../../assets/login-bg-light.png');


  return (
    
    <ImageBackground 
    //si es dark mide , ruta de img: ../../../assets/login-bg-light.png
    //Implementar cuando este el dark mode, por ahora dejo la imagen clara para que se vea bien el diseño
      source={bgImage} 
      style={styles.background}
      
    >
      <BlurView  tint={isDarkMode ? "dark" : "light"} style={styles.glass} intensity={60}>
        {/* Logo centered at the top of the card */}
        <Image 
          source={require('../../../assets/RespiLogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />   

        <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>Welcome back {'Id.name'}!</Text>

        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
          Email:
        </Text>

        <GlassTextInput
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        isDarkMode={isDarkMode}
        />

        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
          Password:
        </Text>


        <GlassTextInputPassword 
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        isDarkMode={isDarkMode}
        />

        <RectangularButton text="Login" textColor="#fff" onPress={handleSubmit} color={isDarkMode ? 'rgba(202, 142, 14, 0.17)' : 'rgba(191, 132, 4, 0.3rgba(191, 132, 4, 0.51))'} />
        <View style={{ height: 12 }} />

        <View style={{ height: 16 }} />

        <Text style={{ color: isDarkMode ? '#ccc' : '#666', textAlign: 'center' }}>
          Don't have an account yet?{' '}
          <Text 
            style={{ color: '#CA8E0E', fontWeight: 'bold' }} 
            onPress={() => router.replace('Register')}
          >
            Register
          </Text>
        </Text>

        {/*<RectangularButton text="Register" textColor="#fff" color={isDarkMode ? 'rgba(202, 142, 14, 0.17)' : 'rgba(191, 132, 4, 0.51)'} />*/}
        

        {!!error && <Text style={styles.error}>{error}</Text>}
      </BlurView>


      {/* Boton para simular un darkmode */}
      <IconButton 
        icon={isDarkMode ? "weather-sunny" : "weather-night"}
        style={styles.darkModeButton}
        iconColor={"#fff"}
        size={25}
        onPress={toggleDarkMode}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    color: '#000000e8', 
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

export default Login;