import React, { useMemo, useState } from 'react';
import { Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Court } from '../../../types/types';
import { AppTheme } from '../../../theme';
import { AdminReview } from '../../../hooks/useAdminReviews';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';

type Props = {
  courts: Court[];
  reviews: AdminReview[];
  theme: AppTheme;
  cardWidth?: number; // Añade esto
};

export function CourtsAverageRatingChart({
  courts,
  reviews,
  theme,
  cardWidth,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  // Calculamos un ancho interno para el BarChart basado en el contenedor
  // Le restamos los paddings de la tarjeta (14 * 2 = 28) y un poco de margen para el eje Y (30)
  const chartInternalWidth = (cardWidth || 300) - 60;

  const barData = useMemo(() => {
    const reviewedCourtIds = new Set(reviews.map((r) => r.court_id));

    return courts
      .filter((court) => reviewedCourtIds.has(court.id))
      .map((court) => ({
        value: parseFloat(String(court.average_rating || '0')),
        label: court.name,
        frontColor: theme.primary,
        onPress: () =>
          setSelectedItem({
            name: court.name,
            rating: parseFloat(String(court.average_rating || '0')),
            total: reviews.filter((r) => r.court_id === court.id).length,
          }),
      }));
  }, [courts, reviews, theme]);

  if (barData.length === 0) return null;

  // Ajuste de dimensiones para que no se vea "recortado"
  const chartConfig = {
    height: 150, // Altura contenida para que no sea "largo"
    barWidth: 35,
    spacing: 25,
    yAxisLabelWidth: 30, // Espacio para que se vean los números 1, 2, 3...
    hideRules: false,
  };

  return (
    <View
      style={[
        styles.chartCard,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderAccentSoft,
          width: cardWidth || '100%', // Forzamos el ancho de la tarjeta
        },
      ]}
    >
      <Text style={[styles.chartHeading, { color: theme.textTitle }]}>
        Valoraciones por Pista
      </Text>

      <View style={{ marginTop: 20 }}>
        <BarChart
          data={barData}
          width={chartInternalWidth} // <--- ESTO es lo que arregla que no se vea nada
          height={150}
          barWidth={30}
          spacing={20}
          yAxisLabelWidth={35}
          noOfSections={5}
          maxValue={5}
          initialSpacing={10}
          hideRules={false}
          rulesType="dash"
          rulesColor={`${theme.borderAccentSoft}44`}
          yAxisTextStyle={{ color: theme.textSubtitle, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: theme.textSubtitle, fontSize: 10 }}
          yAxisColor={theme.borderAccentSoft}
          xAxisColor={theme.borderAccentSoft}
          frontColor={theme.primary}
        />
      </View>
    </View>
  );
}
