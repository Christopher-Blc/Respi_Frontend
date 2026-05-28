import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { BlurViewCompat } from '../../general/BlurViewCompat';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { CourtType } from '../../../types/types';
import { GlassTextButton } from '../../login/glassTextButton';
import { GlassTextInput } from '../../login/glassTextInput';
import { useTranslation } from 'react-i18next';

type FilterEstado = 'DISPONIBLE' | 'MANTENIMIENTO' | 'INACTIVA' | null;

type Props = {
  visible: boolean;
  onClose: () => void;
  tiposPista: CourtType[];
  filterTipoPistaId: number | null;
  setFilterTipoPistaId: (value: number | null) => void;
  filterEstado: FilterEstado;
  setFilterEstado: (value: FilterEstado) => void;
  filterPrecioMax: string;
  setFilterPrecioMax: (value: string) => void;
};

export function CourtsFiltersModal({
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
  const { t } = useTranslation();

  const overlayColor = 'rgba(0,0,0,0.5)';
  const cardBackground = isDarkMode
    ? 'rgba(16,20,32,0.78)'
    : 'rgba(255,255,255,0.8)';
  const borderColor = theme.primarySoft;
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
      <View
        style={{
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
      >
        <Pressable
          onPress={onClose}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <View
          style={{
            width: '100%',
            maxWidth: 520,
            borderRadius: 18,
            maxHeight: '84%',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.28,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 14,
          }}
        >
          <BlurViewCompat
            intensity={30}
            tint={isDarkMode ? 'dark' : 'light'}
            style={{
              backgroundColor: cardBackground,
              borderWidth: 1,
              borderColor,
              borderRadius: 18,
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
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
                  fontSize: 18,
                  fontWeight: '800',
                }}
              >
                Filtros
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.inputBackground,
                  borderWidth: 1,
                  borderColor: theme.borderInput,
                }}
              >
                <Ionicons name="close" size={22} color={theme.textBody} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 14,
                paddingBottom: 16,
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
                {t('adminCourtTypeLabel')}
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
                    {t('adminAll')}
                  </Text>
                </TouchableOpacity>
                {tiposPista.map((tipo) => {
                  const selected = filterTipoPistaId === tipo.id;
                  return (
                    <TouchableOpacity
                      key={tipo.id}
                      onPress={() =>
                        setFilterTipoPistaId(selected ? null : tipo.id)
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
                        {tipo.name}
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
                {t('adminStatus')}
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
                    {t('adminAll')}
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
                          ? t('pistasStatusAvailable')
                          : t('adminSetMaintenance')}
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
                {t('adminMaxPrice')}
              </Text>
              <View style={{ marginBottom: 8 }}>
                <GlassTextInput
                  value={filterPrecioMax}
                  onChangeText={setFilterPrecioMax}
                  placeholder={t('adminExamplePrice')}
                  keyboardType="decimal-pad"
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: theme.primarySoft,
                }}
              >
                <View style={{ flex: 1 }}>
                  <GlassTextButton
                    text={t('adminClear')}
                    onPress={() => {
                      setFilterTipoPistaId(null);
                      setFilterEstado(null);
                      setFilterPrecioMax('');
                    }}
                    textColor={theme.textBody}
                    color={theme.backgroundAlt}
                    borderColor={theme.borderInput}
                    borderWidth={1}
                    height={46}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <GlassTextButton
                    text={t('adminApply')}
                    onPress={onClose}
                    textColor={theme.onPrimary}
                    color={theme.primary}
                    borderColor={theme.primary}
                    borderWidth={1}
                    height={46}
                  />
                </View>
              </View>
            </ScrollView>
          </BlurViewCompat>
        </View>
      </View>
    </Modal>
  );
}
