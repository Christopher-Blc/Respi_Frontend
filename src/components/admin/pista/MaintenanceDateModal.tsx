import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../../context/ThemeContext';
import { GlassTextButton } from '../../login/glassTextButton';
import { GlassTextInput } from '../../login/glassTextInput';

type Props = {
  visible: boolean;
  nombre: string;
  desde: string;
  hasta: string;
  error?: string;
  onChangeDesde: (value: string) => void;
  onChangeHasta: (value: string) => void;
  onCancel: () => void;
  onContinue: () => void;
};

export function MaintenanceDateModal({
  visible,
  nombre,
  desde,
  hasta,
  error,
  onChangeDesde,
  onChangeHasta,
  onCancel,
  onContinue,
}: Props) {
  const { theme, isDarkMode } = useAppTheme();

  const overlayColor = isDarkMode ? theme.overlayDark : 'rgba(0,0,0,0.42)';
  const cardBackground = isDarkMode
    ? 'rgba(18,18,18,0.82)'
    : 'rgba(255,255,255,0.84)';
  const borderColor = isDarkMode
    ? theme.borderAccentSoft
    : 'rgba(255, 255, 255, 0.55)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCancel}
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'center',
          paddingHorizontal: 18,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{
            width: '100%',
            maxWidth: 560,
            alignSelf: 'center',
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          <BlurView
            intensity={30}
            tint={isDarkMode ? 'dark' : 'light'}
            style={{
              backgroundColor: cardBackground,
              borderWidth: 1,
              borderColor,
              borderRadius: 22,
              paddingHorizontal: 18,
              paddingVertical: 16,
            }}
          >
            <Text
              style={{
                color: theme.textTitle,
                fontSize: 20,
                fontWeight: '700',
                marginBottom: 6,
              }}
            >
              Fechas de mantenimiento
            </Text>
            <Text
              style={{
                color: theme.textBody,
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              Define el rango para "{nombre}" en formato AAAA-MM-DD.
            </Text>

            <Text
              style={{
                color: theme.textTitle,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Inicio
            </Text>
            <GlassTextInput
              value={desde}
              onChangeText={onChangeDesde}
              placeholder="2026-06-01"
            />

            <View style={{ height: 10 }} />

            <Text
              style={{
                color: theme.textTitle,
                fontSize: 13,
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Fin
            </Text>
            <GlassTextInput
              value={hasta}
              onChangeText={onChangeHasta}
              placeholder="2026-06-10"
            />

            {error ? (
              <Text
                style={{
                  color: '#F44336',
                  marginTop: 10,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                {error}
              </Text>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <View style={{ flex: 1 }}>
                <GlassTextButton
                  text="Cancelar"
                  onPress={onCancel}
                  textColor={theme.textBody}
                  color={theme.inputBackground}
                  borderColor={theme.borderInput}
                  borderWidth={1}
                  height={46}
                />
              </View>
              <View style={{ flex: 1 }}>
                <GlassTextButton
                  text="Continuar"
                  onPress={onContinue}
                  textColor={theme.onPrimary}
                  color={theme.primaryButton}
                  borderColor={theme.primary}
                  borderWidth={1}
                  height={46}
                />
              </View>
            </View>
          </BlurView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
