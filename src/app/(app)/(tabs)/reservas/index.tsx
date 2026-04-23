import { router } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import createReservationsStyles from '../../../../style/reservations.styles';
import { GlassTextButton } from '../../../../components/login/glassTextButton';
import { useAppTheme } from '../../../../context/ThemeContext';

export default function PistaTypeIndex() {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createReservationsStyles(theme), [theme]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.backgroundMain,
      }}
    >
      <Text style={{ fontSize: 20 }}>Pantalla de Reservas</Text>
      <GlassTextButton
        text="Nueva reserva"
        onPress={() => router.push('/reservas/createBooking')}
        style={[styles.pillButtonPrimary]}
        color={theme.primarySoft}
      />

      <GlassTextButton
        text="Ver tipo pistas"
        onPress={() => router.push('/reservas/pistaTypes')}
        style={styles.pillButtonPrimary}
        color={theme.primarySoft}
      />
    </View>
  );
}
