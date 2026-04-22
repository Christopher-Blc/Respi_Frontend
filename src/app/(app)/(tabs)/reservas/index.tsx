import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import styles from '../../../../style/reservations.styles';
import { GlassTextButton } from '../../../../components/login/glassTextButton';

export default function PistaTypeIndex() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Pantalla de Reservas</Text>
      <GlassTextButton
        text="Nueva reserva"
        onPress={() => router.push('/reservas/createBooking')}
        style={[styles.pillButtonPrimary]}
        color="rgba(191, 132, 4, 0.51)"
      />

      <GlassTextButton
        text="Ver tipo pistas"
        onPress={() => router.push('/reservas/pistaTypes')}
        style={styles.pillButtonPrimary}
        color="rgba(191, 132, 4, 0.51)"
      />
    </View>
  );
}
