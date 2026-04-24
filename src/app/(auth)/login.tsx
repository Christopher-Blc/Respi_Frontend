import React, { useState } from 'react';
import {
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { GlassTextButton } from '../../components/login/glassTextButton';
import { GlassTextInputPassword } from '../../components/login/glassTextInputPassword';
import { GlassTextInput } from '../../components/login/glassTextInput';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import createLoginStyles from '../../style/login.styles';
import RespiLogo from '../../components/login/respiLogo';
import { useAppTheme } from '../../context/ThemeContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { isDarkMode, theme } = useAppTheme();
  const styles = React.useMemo(() => createLoginStyles(theme), [theme]);

  const { signIn } = useAuth();
  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    try {
      setError('');
      const response = await api.post('/auth/login', {
        email: email.toLowerCase(),
        password: password,
      });

      if (response.data.access_token) {
        const token = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        console.log('Login successful:', response.data);
        signIn(token, refreshToken);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error de conexión';
      console.log('Login error:', err.response?.data || err.message);
      setError(Array.isArray(message) ? message[0] : message);
    }
  };

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
  );

  function renderForm() {
    return (
      <BlurView
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.glass}
        intensity={20}
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
          Welcome back!
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: theme.grayLabelText,
            },
          ]}
        >
          Email:
        </Text>
        <GlassTextInput
          keyboardType="email-address"
          placeholder="Enter email"
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
          Password:
        </Text>
        <GlassTextInputPassword
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          isDarkMode={isDarkMode}
        />

        <GlassTextButton
          text="Login"
          textColor={theme.onPrimary}
          onPress={handleSubmit}
          color={theme.primaryButton}
        />

        <View style={{ height: 28 }} />

        <Text
          style={{
            color: theme.textBody,
            textAlign: 'center',
          }}
        >
          Don't have an account yet?{' '}
          <Text
            style={{
              color: theme.primary,
              fontWeight: 'bold',
            }}
            onPress={() => router.replace('register')}
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
