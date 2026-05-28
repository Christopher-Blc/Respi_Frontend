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
                  gap: 12,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: theme.primarySoft,
                }}
              >
                <View style={{ flex: 1 }}>
                  <GlassTextButton
                    text="Limpiar"
                    onPress={onClear}
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
