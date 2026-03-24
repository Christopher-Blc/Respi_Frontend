import React, { useState } from 'react';
import {

  Alert,
  ImageBackground, // Already here
  Image,           // Added this import
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RectangularButton } from '../../components/login/rectangularButton';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

// Nota: este es un login de ejemplo. Reemplazar con autenticación real luego.
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Simular login exitoso: redirigir a Home
    router.replace('/(app)/home');
  };

  return (
    <ImageBackground 
    //si es dark mide , ruta de img: ../../../assets/login-bg-light.png
    //Implementar cuando este el dark mode, por ahora dejo la imagen clara para que se vea bien el diseño
      source={require('../../../assets/login-bg-light.png')} 
      style={styles.background}
    >
      <BlurView intensity={15} tint="light" style={styles.glass}>
        {/* Logo centered at the top of the card */}
        <Image 
          source={require('../../../assets/RespiLogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />   

        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email:</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          style={styles.input}
          placeholder='Enter email'
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder='Enter password'
          placeholderTextColor="#666"
        />
        <RectangularButton text="Login" onPress={handleSubmit} />
        <View style={{ height: 12 }} />
        <RectangularButton text="Register" />

        {!!error && <Text style={styles.error}>{error}</Text>}
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Covers the whole screen
    justifyContent: 'center', 
    alignItems: 'center',
  },
  glass: {
    width: '85%',
    maxWidth: 340,
    padding: 25,
    borderRadius: 30, // Smoother corners for glass look
    borderWidth: 0.5,
    borderColor: '#616161',
    //backgroundColor: 'rgba(255, 170, 0, 0.12)',
    overflow: 'hidden',
    alignItems: 'center', // Centers the logo and title
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 28,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle dark input
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    color: '#000000', // Ensure typing text is white
  },
  error: {
    color: '#D32F2F',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default Login;