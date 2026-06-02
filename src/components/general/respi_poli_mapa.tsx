import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAppTheme } from '../../context/ThemeContext';
import createRespiPoliMapaStyles from '../../style/general/respiPoliMapa.styles';

type MapaPoliRespiProps = {
  onClose?: () => void;
};

export const MapaPoliRespi = ({ onClose }: MapaPoliRespiProps) => {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createRespiPoliMapaStyles(theme), [theme]);

  // Tu URL de Spline
  const splineUrl =
    'https://my.spline.design/untitled-o8FhbQhvF8XmEF9SVboAdTmE/';

  // Código para detectar cuando tocas una pista (sólo WebView native)
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
        {onClose && (
          <TouchableOpacity
            onPress={onClose}
            style={{ position: 'absolute', right: 12, top: 12 }}
          >
            <Text style={{ color: theme.primary }}>Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>

      {Platform.OS === 'web' ? (
        // En web usamos un iframe directo
        <View style={{ flex: 1 }}>
          <iframe
            src={splineUrl}
            style={{ width: '100%', height: '100%', border: 0 }}
            title="Mapa 3D Respi"
          />
        </View>
      ) : (
        // En mobile/nativo usamos WebView
        <WebView
          source={{ uri: splineUrl }}
          style={styles.mapa}
          onMessage={onMessage}
        />
      )}
    </SafeAreaView>
  );
};
