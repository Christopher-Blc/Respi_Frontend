import React, { useState } from 'react';
import {
  ImageBackground, 
  Image,          
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconButton } from 'react-native-paper';
import { RectangularButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import { saveToken } from '../../services/authStorage';
import { useAuth } from '../../context/AuthContext';


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

  // Cosas para el date,  añade las "/" solo y pilladas raras del chat
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
  // En Web o Android, cerramos tras elegir
  if (Platform.OS !== 'ios') {
    setShowPicker(false);
  }

  if (selectedDate) {
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    
    setBirthDate(`${day}/${month}/${year}`);
    setDate(selectedDate); // Este es el que mandas a la API con .toISOString()
  }
};

  //Accion cuando se pulsa registrar
  const { signIn } = useAuth();
  const handleSubmit = async () => {
    //comprobar campos vacios
      if (!email || !password || !name || !surname || !phone || !birthDate || !location) {
        setError('Por favor, rellena todos los campos.');
        return;
      }

      //tr catch dnd haremos la llamada a api
      try {
      setError(''); 
      
      //hacemos la llamada pasando los datos
      const response = await api.post('/auth/register', {
        email: email.toLowerCase(),
        password: password,
        name: name,
        surname: surname,
        phone: phone,
        fecha_nacimiento: date.toISOString(), 
        direccion: location,
      });

      //si ha cinseguido una respuesta valida , lo avisamos y guardamos el token en securestorage
      if (response.status === 201 || response.data.access_token) {
        const token = response.data.access_token;
        alert('¡Cuenta creada con éxito! Bienvenido.');
        signIn(token);
      }

    } catch (err: any) {
      //si ha habido un error lo enseñamos 
      const message = err.response?.data?.message || 'Error de conexión';
      console.log('Error en registro:', err);
      setError(Array.isArray(message) ? message[0] : message);
    }

  };


  //dependiendo del modo se pilla un fondo u otro
  const bgImage = isDarkMode 
    ? require('../../../assets/login-bg-dark.png') 
    : require('../../../assets/login-bg-light.png');


  //Igual que en el login , hacemos una funcion de renderform para que devuelva el formulario principal
  //y en el return normal , tenemos el control si es web o mobil    
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
        {Platform.OS === 'web' ? (
          // WEB: Directo al contenido, sin interferencias táctiles
          <View style={{ width: '100%', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            {renderForm()}
          </View>
        ) : (
          // MÓVIL: Con Touchable para cerrar teclado al tocar fuera del scroll
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ width: '100%', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
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
    </ImageBackground>
  );

  function renderForm(){
    return (
  <BlurView tint={isDarkMode ? "dark" : "light"} style={styles.glass} intensity={20}>
    <ScrollView 
      style={{ width: '100%' }} 
      contentContainerStyle={{ 
        flexGrow: 1, 
        alignItems: 'center',
        paddingBottom: 40, // Un poco más de aire abajo
      }}
      showsVerticalScrollIndicator={false}
    >
      <Image source={require('../../../assets/RespiLogo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>Create an account</Text>

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Name:</Text>
      <GlassTextInput placeholder="Name" value={name} onChangeText={setName} isDarkMode={isDarkMode} />

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Surname:</Text>
      <GlassTextInput placeholder="Surname" value={surname} onChangeText={setSurname} isDarkMode={isDarkMode} />

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Email:</Text>
      <GlassTextInput keyboardType='email-address' placeholder="Enter email" value={email} onChangeText={setEmail} isDarkMode={isDarkMode} />

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Phone:</Text>
      <GlassTextInput keyboardType='phone-pad' placeholder="Enter phone" value={phone} onChangeText={setPhone} isDarkMode={isDarkMode} />

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Password:</Text>
      <GlassTextInputPassword placeholder="Enter password" value={password} onChangeText={setPassword} isDarkMode={isDarkMode} />

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Birth Date:</Text>


      <View style={styles.inputWrapper}>
  <GlassTextInput 
    placeholder="DD/MM/YYYY" 
    value={birthDate} 
    onChangeText={handleTextChange} 
    isDarkMode={isDarkMode} 
  />
  <IconButton
    icon="calendar-edit"
    style={styles.calendarIcon}
    iconColor='#CA8E0E'
    size={24}
    onPress={() => {
    if (Platform.OS === 'web') {
      // Casteamos el elemento a HTMLInputElement
      const inputElement = document.getElementById('webDatePicker') as HTMLInputElement;
      inputElement?.showPicker?.(); 
    } else {
      setShowPicker(!showPicker);
    }
  }}
  />
  
  {/* Input invisible solo para Web */}
  {Platform.OS === 'web' && (
    <input
      id="webDatePicker"
      type="date"
      style={{
        position: 'absolute',
        opacity: 0,
        width: 1,
        height: 1,
        right: 20,
        top: 20,
      }}
      onChange={(e) => {
        const val = e.target.value; // Formato YYYY-MM-DD
        if (val) {
          const [y, m, d] = val.split('-');
          const selected = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
          onDateChange({}, selected);
        }
      }}
    />
  )}
</View>

{/* El Picker nativo solo para Móvil */}
{Platform.OS !== 'web' && showPicker && (
  <RNDateTimePicker
    value={date}
    mode="date"
    display="spinner" 
    onChange={onDateChange}
    maximumDate={new Date()}
    textColor={isDarkMode ? 'white' : 'black'}
  />
)}

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Location:</Text>
      <GlassTextInput placeholder="Location" value={location} onChangeText={setLocation} isDarkMode={isDarkMode} />

      <RectangularButton text="Register" textColor="#fff" onPress={handleSubmit} color={isDarkMode ? 'rgba(202, 142, 14, 0.17)' : 'rgba(191, 132, 4, 0.51)'} />
      
      <View style={{ height: 16 }} />
      <Text style={{ color: isDarkMode ? '#ccc' : '#667', textAlign: 'center' }}>
        Already have an account?{' '}
        <Text style={{ color: '#CA8E0E', fontWeight: 'bold' }} onPress={() => router.replace('Login')}>
          Login
        </Text>
      </Text>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  </BlurView>
    );
  }
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

export default Register;