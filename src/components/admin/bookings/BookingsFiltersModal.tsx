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

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
  const todayDate = getTodayDateString();
  const todaySelected =
    dateFromFilter.trim() === todayDate && dateToFilter.trim() === todayDate;

  const toggleTodayRange = () => {
    if (todaySelected) {
      setDateFromFilter('');
      setDateToFilter('');
      return;
    }
    setDateFromFilter(todayDate);
    setDateToFilter(todayDate);
  };

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
              <TouchableOpacity
                onPress={toggleTodayRange}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Ionicons
                  name={todaySelected ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={todaySelected ? theme.primary : theme.textBody}
                />
                <Text
                  style={{
                    color: theme.textTitle,
                    fontSize: 13,
                    fontWeight: '600',
                  }}
                >
                  Hoy
                </Text>
              </TouchableOpacity>

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
                  marginBottom: 18,
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
                    text="Limpiar"
                    onPress={clearFilters}
                    textColor={theme.textBody}
                    color={theme.backgroundAlt}
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
