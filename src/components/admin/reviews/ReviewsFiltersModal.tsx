import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { BlurViewCompat } from '../../general/BlurViewCompat';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { GlassTextButton } from '../../login/glassTextButton';
import { ReplyFilter } from '../../../hooks/admin/useAdminReviews';

type RatingFilter = number | 'all';

type Props = {
  visible: boolean;
  onClose: () => void;
  courtNames: string[];
  filterRating: RatingFilter;
  setFilterRating: (value: RatingFilter) => void;
  replyFilter: ReplyFilter;
  setReplyFilter: (value: ReplyFilter) => void;
  filterCourtName: string | 'all';
  setFilterCourtName: (value: string | 'all') => void;
  onClear: () => void;
};

const RATING_FILTERS: RatingFilter[] = ['all', 1, 2, 3, 4, 5];
const REPLY_FILTERS: ReplyFilter[] = ['all', 'pending', 'answered'];

const getReplyLabel = (value: ReplyFilter) => {
  if (value === 'pending') return 'Pendientes';
  if (value === 'answered') return 'Contestadas';
  return 'Todas';
};

export function ReviewsFiltersModal({
  visible,
  onClose,
  courtNames,
  filterRating,
  setFilterRating,
  replyFilter,
  setReplyFilter,
  filterCourtName,
  setFilterCourtName,
  onClear,
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
          <BlurViewCompat
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
                paddingBottom: 18,
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
                Valoracion
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {RATING_FILTERS.map((value) => {
                  const selected = filterRating === value;
                  return (
                    <TouchableOpacity
                      key={`rating-${value}`}
                      onPress={() => setFilterRating(value)}
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
                        {value === 'all' ? 'Todas' : `${value} estrellas`}
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
                Estado de respuesta
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                {REPLY_FILTERS.map((value) => {
                  const selected = replyFilter === value;
                  return (
                    <TouchableOpacity
                      key={`reply-${value}`}
                      onPress={() => setReplyFilter(value)}
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
                        {getReplyLabel(value)}
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
                  marginBottom: 18,
                }}
              >
                <TouchableOpacity
                  onPress={() => setFilterCourtName('all')}
                  style={{
                    paddingHorizontal: 13,
                    paddingVertical: 7,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor:
                      filterCourtName === 'all'
                        ? pillActiveBorder
                        : pillInactiveBorder,
                    backgroundColor:
                      filterCourtName === 'all' ? pillActiveBg : pillInactiveBg,
                  }}
                >
                  <Text
                    style={{
                      color:
                        filterCourtName === 'all'
                          ? pillActiveText
                          : pillInactiveText,
                      fontWeight: filterCourtName === 'all' ? '700' : '500',
                      fontSize: 13,
                    }}
                  >
                    Todas las pistas
                  </Text>
                </TouchableOpacity>
                {courtNames.map((courtName) => {
                  const selected = courtName === filterCourtName;
                  return (
                    <TouchableOpacity
                      key={courtName}
                      onPress={() => setFilterCourtName(courtName)}
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
                        {courtName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  paddingTop: 14,
                  borderTopWidth: 1,
                  borderTopColor: theme.primarySoft,
                }}
              >
                <View style={{ flex: 1 }}>
                  <GlassTextButton
                    text="Limpiar"
                    onPress={onClear}
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
            </ScrollView>
          </BlurViewCompat>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
