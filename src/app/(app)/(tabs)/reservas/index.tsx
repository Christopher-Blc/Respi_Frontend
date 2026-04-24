import { router } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';
import createReservationsStyles from '../../../../style/reservations.styles';
import { GlassTextButton } from '../../../../components/login/glassTextButton';
import { useAppTheme } from '../../../../context/ThemeContext';
import { useHeaderHeight } from '@react-navigation/elements';

export default function PistaTypeIndex() {
  const { theme } = useAppTheme();
  const styles = React.useMemo(() => createReservationsStyles(theme), [theme]);
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.backgroundMain,
        paddingTop: headerHeight + 10,
        paddingBottom: Platform.OS === 'web' ? 88 : 120,
      }}
    >
      <GlassTextButton
        text="Nueva reserva"
        onPress={() => router.push('/reservas/createBooking')}
        style={[styles.pillButtonPrimary]}
        color={theme.primaryButton}
      />
      <GlassTextButton
        text="Ver tipo pistas"
        onPress={() => router.push('/reservas/pistaTypes')}
        style={styles.pillButtonPrimary}
        color={theme.primaryButton}
      />
    </View>
  );
}
