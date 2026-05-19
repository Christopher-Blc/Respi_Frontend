import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { Court, CourtType, Reservation } from '../../../types/types';
import { GlassTextButton } from '../../login/glassTextButton';
import { GlassTextInput } from '../../login/glassTextInput';

type Props = {
  visible: boolean;
  onClose: () => void;
  courts: Court[];
  courtTypes: CourtType[];
  dateFromFilter: string;
  setDateFromFilter: (value: string) => void;
  dateToFilter: string;
  setDateToFilter: (value: string) => void;
  statusFilter: 'ALL' | Reservation['status'];
  setStatusFilter: (value: 'ALL' | Reservation['status']) => void;
  courtFilter: string;
  setCourtFilter: (value: string) => void;
  courtTypeFilter: string;
  setCourtTypeFilter: (value: string) => void;
  clearFilters: () => void;
};

const STATUS_OPTIONS: Array<'ALL' | Reservation['status']> = [
  'ALL',
  'PENDIENTE',
  'CONFIRMADA',
  'FINALIZADA',
  'CANCELADA',
];

export function BookingsFiltersModal({
  visible,
  onClose,
  courts,
  courtTypes,
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
  statusFilter,
  setStatusFilter,
  courtFilter,
  setCourtFilter,
  courtTypeFilter,
  setCourtTypeFilter,
  clearFilters,
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
            maxHeight: '82%',
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
                Rango de fechas
              </Text>
              <View style={{ marginBottom: 2 }}>
                <GlassTextInput
                  value={dateFromFilter}
                  onChangeText={setDateFromFilter}
                  placeholder="Desde (YYYY-MM-DD)"
                />
              </View>
              <View style={{ marginBottom: 14 }}>
                <GlassTextInput
                  value={dateToFilter}
                  onChangeText={setDateToFilter}
                  placeholder="Hasta (YYYY-MM-DD)"
                />
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
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {STATUS_OPTIONS.map((status) => {
                  const selected = statusFilter === status;
                  return (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setStatusFilter(status)}
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
                        {status === 'ALL' ? 'Todos' : status}
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
                Pista
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
                  onPress={() => setCourtFilter('ALL')}
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      courtFilter === 'ALL'
                        ? pillActiveBorder
                        : pillInactiveBorder,
                    backgroundColor:
                      courtFilter === 'ALL' ? pillActiveBg : pillInactiveBg,
                  }}
                >
                  <Text
                    style={{
                      color:
                        courtFilter === 'ALL'
                          ? pillActiveText
                          : pillInactiveText,
                      fontWeight: courtFilter === 'ALL' ? '700' : '500',
                      fontSize: 13,
                    }}
                  >
                    Todas
                  </Text>
                </TouchableOpacity>
                {Array.from(new Set(courts.map((c) => c.name))).map(
                  (uniqueName) => {
                    const courtsWithName = courts.filter(
                      (c) => c.name === uniqueName,
                    );
                    const courtIds = courtsWithName
                      .map((c) => String(c.id))
                      .join(',');
                    const selected = courtFilter === courtIds;
                    return (
                      <TouchableOpacity
                        key={courtIds}
                        onPress={() =>
                          setCourtFilter(selected ? 'ALL' : courtIds)
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
                          {uniqueName}
                        </Text>
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>

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
                  marginBottom: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setCourtTypeFilter('ALL')}
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      courtTypeFilter === 'ALL'
                        ? pillActiveBorder
                        : pillInactiveBorder,
                    backgroundColor:
                      courtTypeFilter === 'ALL' ? pillActiveBg : pillInactiveBg,
                  }}
                >
                  <Text
                    style={{
                      color:
                        courtTypeFilter === 'ALL'
                          ? pillActiveText
                          : pillInactiveText,
                      fontWeight: courtTypeFilter === 'ALL' ? '700' : '500',
                      fontSize: 13,
                    }}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>
                {courtTypes.map((courtType) => {
                  const selected = courtTypeFilter === String(courtType.id);
                  return (
                    <TouchableOpacity
                      key={courtType.id}
                      onPress={() =>
                        setCourtTypeFilter(
                          selected ? 'ALL' : String(courtType.id),
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
                        {courtType.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
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
                  onPress={clearFilters}
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
