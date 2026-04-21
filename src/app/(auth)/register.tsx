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
import { GlassTextButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import { saveToken } from '../../services/authStorage';
import { useAuth } from '../../context/AuthContext';
import styles from '../../style/register.styles';


const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
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

  const createLocalDate = (year: number, month: number, day: number) => {
    return new Date(year, month, day, 12, 0, 0, 0);
  };

  const formatLocalDateForApi = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Cosas para el date,  añade las "/" solo cuando el user escribe la fecha en vez de seleccionarla 
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
  // En Web o Android, cerramos despues de haber eligido la fecha  
  if (Platform.OS !== 'ios') {
    setShowPicker(false);
  }

  if (selectedDate) {
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    const normalizedDate = createLocalDate(year, selectedDate.getMonth(), selectedDate.getDate());
    
    setBirthDate(`${day}/${month}/${year}`);
    setDate(normalizedDate);
  }
};

  //Accion cuando se pulsa registrar
  const { signIn } = useAuth();
  const handleSubmit = async () => {
    //comprobar campos vacios
      if (!email || !password || !name || !surname || !username || !phone || !birthDate || !location) {
        setError('Por favor, rellena todos los campos.');
        return;
      }

      //tr catch dnd haremos la llamada a api
      try {
        setError(''); 
        
        //hacemos la llamada pasando los datos
        const response = await api.post('/auth/register', {
          username: username,
          name: name,
          surname: surname,
          email: email.toLowerCase(),
          phone: phone,
          password: password,
          fecha_nacimiento: formatLocalDateForApi(date), 
          direccion: location,
        });

        //si ha cinseguido una respuesta valida , lo avisamos y guardamos el token en securestorage
        if (response.status === 201 || response.data.access_token) {
          const token = response.data.access_token;
          //deleteme
          console.log('Registro exitoso:', response.data);
          console.log('Token recibido:', response.data.access_token);
          alert('¡Cuenta creada correctamente! Bienvenido.');
          signIn(token);//el signin ya se encarga de guardar el token y todo 
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

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Username:</Text>
      <GlassTextInput placeholder="Username" value={username} onChangeText={setUsername} isDarkMode={isDarkMode} />

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
        minimumDate={createLocalDate(1900, 0, 1)}
        maximumDate={new Date()}
        textColor={isDarkMode ? 'white' : 'black'}
      />
    )}

      <Text style={[styles.label, { color: isDarkMode ? '#BBB' : '#444' }]}>Location:</Text>
      <GlassTextInput placeholder="Location" value={location} onChangeText={setLocation} isDarkMode={isDarkMode} />

      <GlassTextButton text="Register" textColor="#fff" onPress={handleSubmit} color={isDarkMode ? 'rgba(202, 142, 14, 0.17)' : 'rgba(191, 132, 4, 0.51)'} />
      
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


export default Register;
