import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAppTheme } from '../../../../context/ThemeContext';

export default function PistaTypeIndex() {
  const { theme } = useAppTheme();

  useEffect(() => {
    router.replace('/reservas');
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.backgroundMain,
      }}
    >
      <ActivityIndicator color={theme.primary} />
    </View>
  );
}
