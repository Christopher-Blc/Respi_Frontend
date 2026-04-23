import { View, Text } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';

export default function PistasClientes() {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}
    >
      <Text style={{ fontSize: 20, color: theme.textTitle }}>
        Pantalla de PISTAS de clientes
      </Text>
    </View>
  );
}
