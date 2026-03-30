import React, { useState } from 'react';
import {
  ImageBackground, 
  Image,          
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconButton } from 'react-native-paper';
import { RectangularButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import styles from '../../style/login.styles';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const { signIn } = useAuth();
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
        //console.log('Login exitoso:', response.data.access_token);
        const token = response.data.access_token;
        signIn(token);
      }
    } catch (err: any) {
      // Manejo de errores de NestJS
      const message = err.response?.data?.message || 'Error de conexión';
      console.log('Error en login:', err);
      setError(Array.isArray(message) ? message[0] : message);
    }
  };

  const bgImage = isDarkMode 
    ? require('../../../assets/login-bg-dark.png') 
    : require('../../../assets/login-bg-light.png');


  return (
  <ImageBackground 
    source={bgImage} 
    style={styles.background}
    imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
    >
      {/*si es web le metemos view normal y en caso de movil le ponemos lo de 
      touchable(renderform es simplemente la funcion que devuelve la vista del formulario) */}
      {Platform.OS === 'web' ? (
        <View style={{ width: '100%', alignItems: 'center' }}>
          {renderForm()}
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            {renderForm()}
          </View>
        </TouchableWithoutFeedback>
      )}

    </KeyboardAvoidingView>

    <IconButton 
      icon={isDarkMode ? "weather-sunny" : "weather-night"}
      style={styles.darkModeButton}
      iconColor={"#fff"}
      size={25}
      onPress={toggleDarkMode}
    />

    <IconButton 
      icon={"weather-sunny"}
      style={{position: 'absolute',
    bottom: 40,
    right: 80,
    zIndex: 10,
    backgroundColor:"#5100ff"}}
      iconColor={"#fff"}
      size={25}
      onPress={() => router.push('/test')}
    />
  </ImageBackground>
);

//codigo de vista del formulario que se llama dependiendo de lka plataforma
  function renderForm() {
    return (
      <BlurView tint={isDarkMode ? "dark" : "light"} style={styles.glass} intensity={20}>
        <Image 
          source={require('../../../assets/RespiLogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />   

        <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>Welcome back!</Text>

        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Email:</Text>
        <GlassTextInput
          keyboardType="email-address"
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          isDarkMode={isDarkMode}
        />

        <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Password:</Text>
        <GlassTextInputPassword 
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          isDarkMode={isDarkMode}
        />

        <RectangularButton text="Login" textColor="#fff" onPress={handleSubmit} color={isDarkMode ? 'rgba(202, 142, 14, 0.17)' : 'rgba(191, 132, 4, 0.51)'} />
        
        <View style={{ height: 28 }} />

        <Text style={{ color: isDarkMode ? '#ccc' : '#667', textAlign: 'center' }}>
          Don't have an account yet?{' '}
          <Text 
            style={{ color: '#CA8E0E', fontWeight: 'bold' }} 
            onPress={() => router.replace('Register')}
          >
            Register
          </Text>
        </Text>

        {!!error && <Text style={styles.error}>{error}</Text>}
      </BlurView>
    );
  }
};


export default Login;