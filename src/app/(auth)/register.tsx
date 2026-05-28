import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput as RNTextInput,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurViewCompat } from '../../components/general/BlurViewCompat';
import { IconButton } from 'react-native-paper';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import { CountryPickerModal } from '../../components/login/countryPickerModal';
import { PasswordStrengthIndicator } from '../../components/login/passwordStrengthIndicator';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import createRegisterStyles from '../../style/register.styles';
import RespiLogo from '../../components/login/respiLogo';
import { useAppTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRegister } from '../../hooks/useRegister';

const sanitizeInput = (text: string) =>
  text.replace(/[<>'"&]/g, (c) => ({ '<': '', '>': '', "'": '', '"': '', '&': '' }[c] ?? c));

const Register: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    name,
    setName,
    username,
    setUsername,
    surname,
    setSurname,
    email,
    setEmail,
    phone,
    handlePhoneChange,
    password,
    setPassword,
    birthDate,
    date,
    showPicker,
    setShowPicker,
    isPhoneFocused,
    setIsPhoneFocused,
    showCountryPicker,
    setShowCountryPicker,
    selectedCountry,
    setSelectedCountry,
    minBirthDate,
    maxBirthDate,
    maxBirthDateForApi,
    parseWebDateInput,
    error,
    handleTextChange,
    onDateChange,
    handleSubmit,
  } = useRegister();

  const { isDarkMode, theme } = useAppTheme();
  const styles = React.useMemo(() => createRegisterStyles(theme), [theme]);
  const registerTextColor = theme.textBody;

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
      <BlurViewCompat
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
            accessibilityRole="header"
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
                color: registerTextColor,
              },
            ]}
          >
            {t('authRegisterName')}:
          </Text>
          <GlassTextInput
            autoComplete="name"
            placeholder={t('authRegisterName')}
            placeholderTextColor={registerTextColor}
            value={name}
            onChangeText={(v) => setName(sanitizeInput(v))}
          />

          <Text
            style={[
              styles.label,
              {
                color: registerTextColor,
              },
            ]}
          >
            {t('authRegisterSurname')}:
          </Text>
          <GlassTextInput
            autoComplete="family-name"
            placeholder={t('authRegisterSurname')}
            placeholderTextColor={registerTextColor}
            value={surname}
            onChangeText={(v) => setSurname(sanitizeInput(v))}
          />

          <Text
            style={[
              styles.label,
              {
                color: registerTextColor,
              },
            ]}
          >
            {t('authRegisterUsername')}:
          </Text>
          <GlassTextInput
            autoComplete="username"
            placeholder={t('authRegisterUsername')}
            placeholderTextColor={registerTextColor}
            value={username}
            onChangeText={(v) => setUsername(sanitizeInput(v))}
          />

          <Text
            style={[
              styles.label,
              {
                color: registerTextColor,
              },
            ]}
          >
            {t('authLoginEmail')}:
          </Text>
          <GlassTextInput
            autoComplete="email"
            keyboardType="email-address"
            placeholder={t('exampleEmail')}
            placeholderTextColor={registerTextColor}
            value={email}
            onChangeText={(v) => setEmail(sanitizeInput(v))}
          />

          <Text
            style={[
              styles.label,
              {
                color: registerTextColor,
              },
            ]}
          >
            {t('authRegisterPhone')}:
          </Text>
          <View style={{ width: '100%', marginBottom: 12 }}>
            <View
              style={{
                width: '100%',
                height: 50,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: theme.inputBackground,
                borderColor: isPhoneFocused
                  ? theme.inputFocus
                  : theme.borderInput,
                borderWidth: isPhoneFocused ? 1.5 : 1,
              }}
            >
              <Pressable
                onPress={() => setShowCountryPicker(true)}
                style={{
                  width: 50,
                  height: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  borderRightWidth: 1,
                  borderRightColor: theme.borderInput,
                  backgroundColor: theme.inputBackground,
                }}
              >
                <Text
                  style={{
                    color: isPhoneFocused
                      ? theme.inputFocus
                      : registerTextColor,
                    fontWeight: '700',
                    fontSize: 13,
                  }}
                >
                  {selectedCountry.code}
                </Text>
              </Pressable>

              <RNTextInput
                autoComplete="tel"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
                placeholder={isPhoneFocused ? '' : t('authRegisterPhone')}
                placeholderTextColor={registerTextColor}
                selectionColor={theme.inputFocus}
                style={{
                  flex: 1,
                  height: '100%',
                  paddingHorizontal: 12,
                  color: theme.textInput,
                  fontSize: 15,
                  borderWidth: 0,
                  ...(Platform.OS === 'web'
                    ? ({ outline: 'none' } as any)
                    : {}),
                }}
              />
            </View>

            <CountryPickerModal
              visible={showCountryPicker}
              selected={selectedCountry}
              onSelect={setSelectedCountry}
              onClose={() => setShowCountryPicker(false)}
            />
          </View>

          <Text
            style={[
              styles.label,
              {
                color: registerTextColor,
              },
            ]}
          >
            {t('authLoginPassword')}:
          </Text>
          <GlassTextInputPassword
            autoComplete="new-password"
            placeholder={t('examplePassword')}
            placeholderTextColor={registerTextColor}
            value={password}
            onChangeText={setPassword}
          />
          <PasswordStrengthIndicator password={password} />

          <Text
            style={[
              styles.label,
              {
                color: registerTextColor,
              },
            ]}
          >
            {t('authRegisterBirthDate')}:
          </Text>

          <View style={styles.inputWrapper}>
            <GlassTextInput
              placeholder="DD/MM/YYYY"
              placeholderTextColor={registerTextColor}
              value={birthDate}
              onChangeText={handleTextChange}
            />
            <IconButton
              icon="calendar-edit"
              accessibilityLabel="Seleccionar fecha de nacimiento"
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
                max={maxBirthDateForApi}
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
                  const selected = parseWebDateInput(val);
                  if (selected) {
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
              minimumDate={minBirthDate}
              maximumDate={maxBirthDate}
              textColor={theme.textPrimary}
            />
          )}

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
      </BlurViewCompat>
    );
  }
};

export default Register;
