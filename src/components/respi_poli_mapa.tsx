import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '../context/ThemeContext';
import { AppTheme } from '../theme';

export const MapaPoliRespi = () => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  // Tu URL de Spline
  const splineUrl =
    'https://my.spline.design/untitled-o8FhbQhvF8XmEF9SVboAdTmE/';

  // Código para detectar cuando tocas una pista
  const onMessage = (event: any) => {
    const data = event.nativeEvent.data;
    if (data.includes('tenis')) {
      alert('Seleccionada Pista de Tenis. Mirando en respi.es...');
    } else if (data.includes('basket')) {
      alert('Seleccionada Pista de Basket. Abriendo calendario...');
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.backgroundMain },
    header: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: theme.backgroundCard,
    },
    title: {
      color: theme.textTitle,
      fontSize: 18,
      fontWeight: 'bold',
    },
    mapa: { flex: 1 },
  });
