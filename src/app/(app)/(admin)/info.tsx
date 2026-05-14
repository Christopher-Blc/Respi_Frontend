import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../context/ThemeContext';
import { useAdminInfo } from '../../../hooks/useAdminInfo';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';
import { InfoHeroCard } from '../../../components/admin/info/InfoHeroCard';
import { InfoPieChartCard } from '../../../components/admin/info/InfoPieChartCard';
import { InfoLineChartCard } from '../../../components/admin/info/InfoLineChartCard';
import { useAdminReviews } from '../../../hooks/useAdminReviews';
import { CourtsAverageRatingChart } from '../../../components/admin/reviews/CourtsAverageRatingChart';

export default function InfoAdmin() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const {
    activePercentage,
    activeSlice,
    barChartData,
    lineChartRange,
    lineChartTitle,
    lineChartTotal,
    loadingChart,
    rangeOptions,
    selectedSliceIndex,
    setLineChartRange,
    setSelectedSliceIndex,
    totalReservas,
    visiblePieData,
  } = useAdminInfo(theme);

  const { courts, filteredReviews } = useAdminReviews();

  const horizontalPadding = width >= 1280 ? 40 : width >= 768 ? 28 : 20;
  const maxPaddingWidth = 1400;
  const contentWidth = width > maxPaddingWidth ? maxPaddingWidth : width;
  const availableGridWidth = Math.max(contentWidth - horizontalPadding * 2, 0);
  const isWide = width >= 768;
  const cardWidth = isWide
    ? Math.floor((availableGridWidth - 16) / 2)
    : availableGridWidth;
  const chartSize = Math.min(availableGridWidth - 24, 280);

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: horizontalPadding,
        }}
      >
        <InfoHeroCard
          theme={theme}
          eyebrow={t('adminInfoEyebrow')}
          title={t('adminInfoTitle')}
          subtitle={t('adminInfoSubtitle')}
        />

        <View style={styles.chartsRow}>
          <InfoPieChartCard
            theme={theme}
            isWide={isWide}
            cardWidth={cardWidth}
            loadingChart={loadingChart}
            title={t('adminInfoPieTitle')}
            emptyLabel={t('adminInfoEmptyChart')}
            totalReservas={totalReservas}
            visiblePieData={visiblePieData}
            selectedSliceIndex={selectedSliceIndex}
            onSelectSlice={setSelectedSliceIndex}
            activeSlice={activeSlice}
            activePercentage={activePercentage}
            chartSize={chartSize}
          />

          <InfoLineChartCard
            theme={theme}
            isWide={isWide}
            cardWidth={cardWidth}
            loadingChart={loadingChart}
            lineChartTitle={lineChartTitle}
            lineChartTotal={lineChartTotal}
            lineChartRange={lineChartRange}
            rangeOptions={rangeOptions}
            onRangeChange={setLineChartRange}
            barChartData={barChartData}
          />
        </View>

        <View style={[styles.chartsRow, { marginTop: 16 }]}>
          <CourtsAverageRatingChart
            courts={courts}
            reviews={filteredReviews}
            theme={theme}
            // IMPORTANTE: Pásale el ancho calculado para que el gráfico no se colapse
            cardWidth={isWide ? cardWidth : availableGridWidth}
          />
        </View>
      </ScrollView>
    </View>
  );
}
