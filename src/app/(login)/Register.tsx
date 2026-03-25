import React, { useState } from 'react';
import {
  ImageBackground, 
  Image,          
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconButton } from 'react-native-paper';
import { RectangularButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';


const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Formato visual DD/MM/YYYY
  const [date, setDate] = useState(new Date(2000, 0, 1)); // Fecha objeto para el picker
  const [location, setLocation] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const [error, setError] = useState('');
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  // MÁSCARA DE ENTRADA MANUAL: Añade las "/" automáticamente
  const handleTextChange = (text: string) => {
    let cleaned = text.replace(/\D/g, ''); // Solo números
    let formatted = cleaned;

    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${formatted.slice(0, 5)}/${cleaned.slice(4, 8)}`;
    }
    
    setBirthDate(formatted.slice(0, 10)); // Límite de 10 caracteres
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    // En Android, 'set' es cuando aceptan. 'dismissed' cuando cancelan.
    if (event.type === 'set' && selectedDate) {
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      
      setBirthDate(`${day}/${month}/${year}`);
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

 const handleSubmit = async () => {
    if (!email || !password || !name || !surname || !phone || !birthDate || !location) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

     try {
    setError(''); 
    
    const response = await api.post('/auth/register', {
      email: email.toLowerCase(),
      password: password,
      name: name,
      surname: surname,
      phone: phone,
      fecha_nacimiento: date.toISOString(), 
      direccion: location,
    });

    // Si el registro es exitoso (usualmente NestJS devuelve un 201)
    if (response.status === 201 || response.data.access_token) {
      
      // Mensaje de éxito
      alert('¡Cuenta creada con éxito! Bienvenido.');

      // Redirigir
      // Si recibes token, podrías guardarlo aquí antes de redirigir
      router.replace('/(app)/home'); 
    }

  } catch (err: any) {
    const message = err.response?.data?.message || 'Error de conexión';
    console.log('Error en registro:', err);
    setError(Array.isArray(message) ? message[0] : message);
  }

};


  // 2. Define dynamic assets based on mode
  const bgImage = isDarkMode 
    ? require('../../../assets/login-bg-dark.png') 
    : require('../../../assets/login-bg-light.png');


  return (
    
        <ImageBackground 
        //Implementar cuando este el dark mode, por ahora dejo la imagen clara para que se vea bien el diseño
        source={bgImage} 
        style={styles.background}
        imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
        <BlurView  tint={isDarkMode ? "dark" : "light"} style={styles.glass} intensity={70}>
            <ScrollView 
        style={{ width: '100%' , height: '100%' }} 
        contentContainerStyle={{ 
            flexGrow: 1, 
            alignItems: 'center',
            paddingBottom: 20, // Espacio extra al final para que no corte el último botón
        }}
        showsVerticalScrollIndicator={false}
    >
            {/* Logo centered at the top of the card */}
            <Image 
            source={require('../../../assets/RespiLogo.png')} 
            style={styles.logo}
            resizeMode="contain"
            />   

            <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>Create an account</Text>


            
            <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
            Name:
            </Text>

            <GlassTextInput
            placeholder="name"
            value={name}
            onChangeText={setName}
            isDarkMode={isDarkMode}
            />

            <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
            Surname:
            </Text>

            <GlassTextInput
            placeholder="surname"
            value={surname}
            onChangeText={setSurname}
            isDarkMode={isDarkMode}
            />


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
            Phone:
            </Text>

            <GlassTextInput
            placeholder="Enter phone"
            value={phone}
            onChangeText={setPhone}
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


            {/* --- CAMPO FECHA DE NACIMIENTO (HÍBRIDO) --- */}
          <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Birth Date:</Text>
          <View style={styles.inputWrapper}>
            <GlassTextInput
              placeholder="DD/MM/YYYY"
              value={birthDate}
              onChangeText={handleTextChange} // Aplica la máscara al escribir
              isDarkMode={isDarkMode}
            />
            <IconButton
              icon="calendar-edit"
              style={styles.calendarIcon}
              iconColor={isDarkMode ? '#CA8E0E' : '#CA8E0E'}
              size={24}
              onPress={() => setShowPicker(true)}
            />
          </View>

          {showPicker && (
            <RNDateTimePicker
              value={date}
              mode="date"
              display="spinner" // <--- RUEDAS EN AMBOS SISTEMAS
              onChange={onDateChange}
              maximumDate={new Date()}
              textColor={isDarkMode ? 'white' : 'black'}
            />
          )}

            <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>
            Location:
            </Text>

            <GlassTextInput
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            isDarkMode={isDarkMode}
            />
            

            <RectangularButton text="Register" textColor="#fff" onPress={handleSubmit} color={isDarkMode ? 'rgba(202, 142, 14, 0.17)' : 'rgba(191, 132, 4, 0.51)'} />
            <View style={{ height: 12 }} />
            <Text style={{ color: isDarkMode ? '#ccc' : '#667', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <Text 
                        style={{ color: '#CA8E0E', fontWeight: 'bold' }} 
                        onPress={() => router.replace('Login')}
                    >
                        Login
                    </Text>
                    </Text>

            {!!error && <Text style={styles.error}>{error}</Text>}
             </ScrollView>
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

export default Register;