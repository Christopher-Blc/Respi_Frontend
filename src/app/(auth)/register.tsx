import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { IconButton } from 'react-native-paper';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import createRegisterStyles from '../../style/register.styles';
import RespiLogo from '../../components/login/respiLogo';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const { isDarkMode, theme } = useAppTheme();
  const styles = React.useMemo(() => createRegisterStyles(theme), [theme]);

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
      const normalizedDate = createLocalDate(
        year,
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );

      setBirthDate(`${day}/${month}/${year}`);
      setDate(normalizedDate);
    }
  };

  //Accion cuando se pulsa registrar
  const { signIn } = useAuth();
  const handleSubmit = async () => {
    //comprobar campos vacios
    if (
      !email ||
      !password ||
      !name ||
      !surname ||
      !username ||
      !phone ||
      !birthDate ||
      !location
    ) {
      setError(t('authLoginEmptyFields'));
      return;
    }

    //tr catch dnd haremos la llamada a api
    try {
      setError('');

      const response = await api.post('/auth/register', {
        username: username,
        name: name,
        surname: surname,
        email: email.toLowerCase(),
        phone: phone,
        password: password,
        date_of_birth: formatLocalDateForApi(date),
        address: location,
      });

      // 1. Verificamos que el registro ha ido bien (Status 201)
      if (response.status === 201) {
        // 2. EXTRA: Si estamos en desarrollo, el back nos pasa la 'verification_url'
        const devVerificationUrl = response.data.verification_url;

        if (devVerificationUrl) {
          console.log(
            'Abriendo verificación automática (Modo Desarrollo):',
            devVerificationUrl,
          );

          // Abrimos el navegador automáticamente con el link de verificación
          await Linking.openURL(devVerificationUrl);

          // Avisamos al usuario que verifique y luego haga login
          alert(
            'Registro casi listo. Se ha abierto el navegador para verificar tu email. Después, inicia sesión.',
          );
        } else {
          // Flujo normal de producción (ir al correo)
          alert(t('authRegisterSuccess'));
        }

        // 3. MANDATORIO: Enviamos al usuario al Login
        // No llamamos a signIn() porque no tenemos tokens todavía
        router.replace('/(auth)/login');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || t('authConnectionError');
      console.log('Error en registro:', err.response?.data || err.message);
      setError(Array.isArray(message) ? message[0] : message);
    }
  };

  //Igual que en el login , hacemos una funcion de renderform para que devuelva el formulario principal
  //y en el return normal , tenemos el control si es web o mobil
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {Platform.OS === 'web' ? (
        // WEB: Directo al contenido, sin interferencias táctiles
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {renderForm()}
        </View>
      ) : (
        // MÓVIL: Con Touchable para cerrar teclado al tocar fuera del scroll
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {renderForm()}
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );

  function renderForm() {
    return (
      <BlurView
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.glass}
        intensity={20}
      >
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            paddingBottom: 40, // Un poco más de aire abajo
          }}
          showsVerticalScrollIndicator={false}
        >
          <RespiLogo />
          <Text
            style={[
              styles.title,
              {
                color: theme.textTitle,
              },
            ]}
          >
            {t('authRegisterTitle')}
          </Text>

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authRegisterName')}:
          </Text>
          <GlassTextInput
            autoComplete="name"
            placeholder={t('authRegisterName')}
            value={name}
            onChangeText={setName}
          />

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authRegisterSurname')}:
          </Text>
          <GlassTextInput
            autoComplete="family-name"
            placeholder={t('authRegisterSurname')}
            value={surname}
            onChangeText={setSurname}
          />

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authRegisterUsername')}:
          </Text>
          <GlassTextInput
            autoComplete="username"
            placeholder={t('authRegisterUsername')}
            value={username}
            onChangeText={setUsername}
          />

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authLoginEmail')}:
          </Text>
          <GlassTextInput
            autoComplete="email"
            keyboardType="email-address"
            placeholder={t('exampleEmail')}
            value={email}
            onChangeText={setEmail}
          />

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authRegisterPhone')}:
          </Text>
          <GlassTextInput
            autoComplete="tel"
            keyboardType="phone-pad"
            placeholder={t('authRegisterPhone')}
            value={phone}
            onChangeText={setPhone}
          />

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authLoginPassword')}:
          </Text>
          <GlassTextInputPassword
            autoComplete="new-password"
            placeholder={t('examplePassword')}
            value={password}
            onChangeText={setPassword}
          />

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authRegisterBirthDate')}:
          </Text>

          <View style={styles.inputWrapper}>
            <GlassTextInput
              placeholder="DD/MM/YYYY"
              value={birthDate}
              onChangeText={handleTextChange}
            />
            <IconButton
              icon="calendar-edit"
              style={styles.calendarIcon}
              iconColor={theme.primary}
              size={24}
              onPress={() => {
                if (Platform.OS === 'web') {
                  // Casteamos el elemento a HTMLInputElement
                  const inputElement = document.getElementById(
                    'webDatePicker',
                  ) as HTMLInputElement;
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
                    const selected = new Date(
                      parseInt(y),
                      parseInt(m) - 1,
                      parseInt(d),
                    );
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
              textColor={theme.textPrimary}
            />
          )}

          <Text
            style={[
              styles.label,
              {
                color: theme.grayLabelText,
              },
            ]}
          >
            {t('authRegisterLocation')}:
          </Text>
          <GlassTextInput
            autoComplete="off"
            placeholder={t('authRegisterLocation')}
            value={location}
            onChangeText={setLocation}
          />

          <GlassTextButton
            text={t('authRegisterButton')}
            textColor={theme.onPrimary}
            onPress={handleSubmit}
            color={theme.primaryButton}
            //isDarkMode={isDarkMode}
          />

          <View style={{ height: 16 }} />
          <Text
            style={{
              color: theme.textBody,
              textAlign: 'center',
            }}
          >
            {t('authRegisterHasAccount')}{' '}
            <Text
              style={{ color: theme.primary, fontWeight: 'bold' }}
              onPress={() => router.replace('login')}
            >
              {t('authLoginButton')}
            </Text>
          </Text>

          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
      </BlurView>
    );
  }
};

export default Register;
