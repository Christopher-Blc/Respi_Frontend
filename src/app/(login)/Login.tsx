import React, { useState } from 'react';
import {

  Alert,
  ImageBackground, 
  Image,          
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RectangularButton } from '../../components/login/rectangularButton';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconButton } from 'react-native-paper';

// Nota: este es un login de ejemplo. Reemplazar con autenticación real luego.
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSubmit = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Simular login exitoso: redirigir a Home
    router.replace('/(app)/home');
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
      <BlurView intensity={15} tint={isDarkMode ? "dark" : "light"} style={styles.glass}>
        {/* Logo centered at the top of the card */}
        <Image 
          source={require('../../../assets/RespiLogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />   

        <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>Login</Text>

        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
          Email:
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
          style={[styles.input, { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            color: isDarkMode ? '#FFF' : '#000'
          }]}
          placeholder='Enter email'
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
        />

        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
          Password:
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            color: isDarkMode ? '#FFF' : '#000'
          }]}
          placeholder='Enter password'
          placeholderTextColor={isDarkMode ? "#888" : "#666"}
        />
        <RectangularButton text="Login" onPress={handleSubmit} />
        <View style={{ height: 12 }} />
        <RectangularButton text="Register" />

        {!!error && <Text style={styles.error}>{error}</Text>}
      </BlurView>
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
    borderWidth: 0.5,
    borderColor: '#616161',
    //backgroundColor: 'rgba(255, 170, 0, 0.12)',
    overflow: 'hidden',
    alignItems: 'center', 
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