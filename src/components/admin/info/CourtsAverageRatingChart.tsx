import React, { useMemo, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Court } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { AdminReview } from '../../../hooks/admin/useAdminReviews';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';

type Props = {
  courts: Court[];
  reviews: AdminReview[];
  theme: AppTheme;
  cardWidth?: number;
};

export function CourtsAverageRatingChart({
  courts,
  reviews,
  theme,
  cardWidth,
}: Props) {
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);

  // Estado para controlar el Popup (Modal)
  const [modalVisible, setModalVisible] = useState(false);
  const [popupData, setPopupData] = useState<{
    name: string;
    rating: number;
  } | null>(null);

  const chartInternalWidth = (cardWidth || 300) - 70;
  const BAR_WIDTH = 32;
  const BAR_SPACING = 45;
  const INITIAL_SPACING = 25;
  const END_SPACING = 25;

  const barData = useMemo(() => {
    const reviewedCourtIds = new Set(reviews.map((r) => r.court_id));

    return courts
      .filter((court) => reviewedCourtIds.has(court.id))
      .map((court) => {
        const avgRating = parseFloat(String(court.average_rating || '0'));
        const isSelected = selectedCourtId === court.id;

        return {
          value: avgRating,
          frontColor: theme.primary,

          // --- TEXTO RECTO ABAJO (Se corta limpio con "...") ---
          labelComponent: () => (
            <View style={{ width: 65, marginTop: 10, alignItems: 'center' }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: theme.textSubtitle,
                  fontSize: 10,
                  textAlign: 'center',
                  fontWeight: isSelected ? 'bold' : 'normal',
                }}
              >
                {court.name}
              </Text>
            </View>
          ),

          // --- NOTA FIJA ARRIBA DE LA BARRA ---
          topLabelComponent: () => (
            <Text
              style={{
                color: isSelected ? '#FFFFFF' : theme.textTitle,
                fontSize: 11,
                fontWeight: 'bold',
                marginBottom: 4,
              }}
            >
              {avgRating.toFixed(1)}
            </Text>
          ),

          strokeWidth: isSelected ? 2 : 0,
          strokeColor: '#FFFFFF',

          onPress: () => {
            setSelectedCourtId(court.id);
            // Guardamos los datos completos y abrimos el Popup
            setPopupData({
              name: court.name,
              rating: avgRating,
            });
            setModalVisible(true);
          },
        };
      });
  }, [courts, reviews, theme, selectedCourtId]);

  if (barData.length === 0) return null;

  const chartContentWidth = Math.max(
    chartInternalWidth,
    barData.length * (BAR_WIDTH + BAR_SPACING) + INITIAL_SPACING + END_SPACING,
  );

  return (
    <View
      style={[
        styles.chartCard,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderAccentSoft,
          width: cardWidth || '100%',
        },
      ]}
    >
      <Text style={[styles.chartHeading, { color: theme.textTitle }]}>
        Valoraciones por Pista
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        persistentScrollbar
        style={{ marginTop: 25 }}
        contentContainerStyle={{ paddingBottom: 6 }}
      >
        <BarChart
          data={barData}
          width={chartContentWidth}
          height={140}
          barWidth={BAR_WIDTH}
          spacing={BAR_SPACING}
          yAxisLabelWidth={35}
          noOfSections={5}
          maxValue={5.6}
          initialSpacing={INITIAL_SPACING}
          endSpacing={END_SPACING}
          hideRules={false}
          rulesType="dash"
          rulesColor={`${theme.borderAccentSoft}44`}
          yAxisTextStyle={{ color: theme.textSubtitle, fontSize: 10 }}
          xAxisColor={theme.borderAccentSoft}
          yAxisColor={theme.borderAccentSoft}
          xAxisLabelsHeight={35} // Altura limpia, estándar y sin bugs abajo
        />
      </ScrollView>

      {/* --- POPUP / MODAL PARA EL NOMBRE ENTERO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscurecido
            justifyContent: 'center',
            alignItems: 'center',
          }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)} // Cierra el popup al tocar fuera
        >
          {/* Contenedor del Popup */}
          <View
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.borderAccentSoft,
              borderWidth: 1,
              borderRadius: 12,
              padding: 20,
              width: '80%',
              maxWidth: 320,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: theme.textTitle,
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {popupData?.name}
            </Text>
            <Text
              style={{
                color: theme.primary,
                fontSize: 14,
                fontWeight: '600',
                marginTop: 8,
              }}
            >
              Puntuación: {popupData?.rating.toFixed(1)} ⭐
            </Text>

            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: theme.primary,
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 6,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' }}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
