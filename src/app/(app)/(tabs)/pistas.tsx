import { View, Text, Platform } from 'react-native';
import { useAppTheme } from '../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';

export default function PistasClientes() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
        paddingTop: headerHeight + 10,
        paddingBottom: Platform.OS === 'web' ? 88 : 120,
      }}
    >
      <Text style={{ fontSize: 20, color: theme.textTitle }}>
        Pantalla de PISTAS de clientes
      </Text>
    </View>
  );
}
