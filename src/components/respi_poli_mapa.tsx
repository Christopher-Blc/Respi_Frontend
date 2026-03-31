import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export const MapaPoliRespi = () => {
  // Tu URL de Spline
  const splineUrl = "https://my.spline.design/untitled-o8FhbQhvF8XmEF9SVboAdTmE/";

  // Código para detectar cuando tocas una pista
  const onMessage = (event: any) => {
    const data = event.nativeEvent.data;
    if (data.includes('tenis')) {
      alert("Seleccionada Pista de Tenis. Mirando en respi.es...");
    } else if (data.includes('basket')) {
      alert("Seleccionada Pista de Basket. Abriendo calendario...");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecciona tu pista</Text>
      </View>
      
      <WebView 
        source={{ uri: splineUrl }}
        style={styles.mapa}
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#111' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  mapa: { flex: 1 }
});