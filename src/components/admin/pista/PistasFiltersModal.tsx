import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { TipoPista } from '../../../types/types';
import { GlassTextButton } from '../../login/glassTextButton';
import { GlassTextInput } from '../../login/glassTextInput';

type FilterEstado = 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA' | null;

type Props = {
  visible: boolean;
  onClose: () => void;
  tiposPista: TipoPista[];
  filterTipoPistaId: number | null;
  setFilterTipoPistaId: (value: number | null) => void;
  filterEstado: FilterEstado;
  setFilterEstado: (value: FilterEstado) => void;
  filterPrecioMax: string;
  setFilterPrecioMax: (value: string) => void;
};

export function PistasFiltersModal({
  visible,
  onClose,
  tiposPista,
  filterTipoPistaId,
  setFilterTipoPistaId,
  filterEstado,
  setFilterEstado,
  filterPrecioMax,
  setFilterPrecioMax,
}: Props) {
  const { theme, isDarkMode } = useAppTheme();

  const overlayColor = isDarkMode ? theme.overlayDark : 'rgba(0,0,0,0.42)';
  const cardBackground = isDarkMode
    ? 'rgba(18,18,18,0.82)'
    : 'rgba(255,255,255,0.84)';
  const borderColor = isDarkMode
    ? theme.borderAccentSoft
    : 'rgba(255, 255, 255, 0.55)';
  const pillInactiveBg = theme.inputBackground;
  const pillInactiveBorder = theme.borderInput;
  const pillActiveBg = theme.primaryButton;
  const pillActiveBorder = theme.primary;
  const pillInactiveText = theme.textBody;
  const pillActiveText = theme.onPrimary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'center',
          paddingHorizontal: 18,
          paddingVertical: 24,
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
            maxHeight: '80%',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.22,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 8 },
            elevation: 12,
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
            }}
          >
            <View
              style={{
                paddingHorizontal: 18,
                paddingTop: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.primarySoft,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 20,
                  fontWeight: '700',
                }}
              >
                Filtros
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={theme.textBody} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 18,
                paddingTop: 14,
                paddingBottom: 12,
              }}
            >
              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Tipo de pista
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <TouchableOpacity
                  onPress={() => setFilterTipoPistaId(null)}
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      filterTipoPistaId === null
                        ? pillActiveBorder
                        : pillInactiveBorder,
                    backgroundColor:
                      filterTipoPistaId === null
                        ? pillActiveBg
                        : pillInactiveBg,
                  }}
                >
                  <Text
                    style={{
                      color:
                        filterTipoPistaId === null
                          ? pillActiveText
                          : pillInactiveText,
                      fontWeight: filterTipoPistaId === null ? '700' : '500',
                      fontSize: 13,
                    }}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>
                {tiposPista.map((tipo) => {
                  const selected = filterTipoPistaId === tipo.tipo_pista_id;
                  return (
                    <TouchableOpacity
                      key={tipo.tipo_pista_id}
                      onPress={() =>
                        setFilterTipoPistaId(
                          selected ? null : tipo.tipo_pista_id,
                        )
                      }
                      style={{
                        paddingHorizontal: 13,
                        paddingVertical: 7,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: selected
                          ? pillActiveBorder
                          : pillInactiveBorder,
                        backgroundColor: selected
                          ? pillActiveBg
                          : pillInactiveBg,
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? pillActiveText : pillInactiveText,
                          fontWeight: selected ? '700' : '500',
                          fontSize: 13,
                        }}
                      >
                        {tipo.nombre}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Estado
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <TouchableOpacity
                  onPress={() => setFilterEstado(null)}
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      filterEstado === null
                        ? pillActiveBorder
                        : pillInactiveBorder,
                    backgroundColor:
                      filterEstado === null ? pillActiveBg : pillInactiveBg,
                  }}
                >
                  <Text
                    style={{
                      color:
                        filterEstado === null
                          ? pillActiveText
                          : pillInactiveText,
                      fontWeight: filterEstado === null ? '700' : '500',
                      fontSize: 13,
                    }}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>
                {(['DISPONIBLE', 'MANTENIMIENTO'] as const).map((estado) => {
                  const selected = filterEstado === estado;
                  return (
                    <TouchableOpacity
                      key={estado}
                      onPress={() => setFilterEstado(selected ? null : estado)}
                      style={{
                        paddingHorizontal: 13,
                        paddingVertical: 7,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: selected
                          ? pillActiveBorder
                          : pillInactiveBorder,
                        backgroundColor: selected
                          ? pillActiveBg
                          : pillInactiveBg,
                      }}
                    >
                      <Text
                        style={{
                          color: selected ? pillActiveText : pillInactiveText,
                          fontWeight: selected ? '700' : '500',
                          fontSize: 13,
                        }}
                      >
                        {estado === 'DISPONIBLE'
                          ? 'Disponible'
                          : 'Mantenimiento'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={{
                  color: theme.textTitle,
                  fontSize: 13,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                Precio maximo (EUR/h)
              </Text>
              <View style={{ marginBottom: 8 }}>
                <GlassTextInput
                  value={filterPrecioMax}
                  onChangeText={setFilterPrecioMax}
                  placeholder="Ej: 15"
                  keyboardType="decimal-pad"
                />
              </View>
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingHorizontal: 18,
                paddingVertical: 14,
                borderTopWidth: 1,
                borderTopColor: theme.primarySoft,
              }}
            >
              <View style={{ flex: 1 }}>
                <GlassTextButton
                  text="Limpiar"
                  onPress={() => {
                    setFilterTipoPistaId(null);
                    setFilterEstado(null);
                    setFilterPrecioMax('');
                  }}
                  textColor={theme.textBody}
                  color={theme.inputBackground}
                  borderColor={theme.borderInput}
                  borderWidth={1}
                  height={46}
                />
              </View>
              <View style={{ flex: 1 }}>
                <GlassTextButton
                  text="Aplicar"
                  onPress={onClose}
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
