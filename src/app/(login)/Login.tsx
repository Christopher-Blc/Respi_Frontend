import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RectangularButton } from '../../components/login/rectangularButton';
import { useRouter } from 'expo-router';

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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        style={styles.input}
        placeholder='Enter email'
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholder='Enter password'
      />

      <RectangularButton text="Login" onPress={handleSubmit} />
      <View style={{height: 10}} />
      <RectangularButton text="Register" />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 320,
    width: '100%',
    alignSelf: 'center',
    marginTop: 80,
    padding: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});

export default Login;