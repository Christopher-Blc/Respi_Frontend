import { Link, Stack } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { RectangularButton } from '../components/login/glassTextButton'; // Usamos tu componente de botón

export default function NotFoundScreen() {
  // Usamos el mismo fondo que tienes en el login para coherencia visual
  const bgImage = require('../../assets/login-bg-light.png'); 

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      
      <ImageBackground 
        source={bgImage} 
        style={styles.background}
        imageStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <BlurView 
        tint={"light"} 
        intensity={Platform.OS === 'web' ? 40 : 20} 
        style={[
            styles.glass,
            {
            backgroundColor: 'rgba(255,255,255,0.2)',
            }
        ]}
        >
          <Text style={styles.errorCode}>404</Text>
          
          <Text style={styles.title}>¡Te has perdido!</Text>
          
          <Text style={styles.message}>
            Parece que esta página no existe o ha sido movida a otra dimensión.
          </Text>

          <View style={{ height: 30 }} />

          {/* Usamos un Link de expo-router envolviendo tu botón o un estilo similar */}
          <Link href="/" asChild>
            <RectangularButton 
              text="Volver al inicio" 
              textColor="#fff" 
              color='rgba(191, 132, 4, 0.51)' 
            />
          </Link>
        </BlurView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glass: {
    width: '85%',
    maxWidth: 400,
    padding: 40,
    borderRadius: 30,
    borderWidth: 0.8,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  errorCode: {
    fontSize: 80,
    fontWeight: '900',
    color: '#CA8E0E',
    opacity: 0.8,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
 message: {
    fontSize: 16,
    color: '#444', // Un pelín más oscuro para contraste
    textAlign: 'center',
    lineHeight: 22,
    // Sombra de texto (funciona en iOS, Android y Web)
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});