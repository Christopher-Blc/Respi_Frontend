import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '../../context/ThemeContext';
import createRespiPoliMapaStyles from '../../style/general/respiPoliMapa.styles';

export const MapaPoliRespi = () => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createRespiPoliMapaStyles(theme), [theme]);

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

