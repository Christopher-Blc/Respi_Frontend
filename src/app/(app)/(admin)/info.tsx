import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../context/ThemeContext';
import { useAdminInfo } from '../../../hooks/admin/useAdminInfo';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';
import { InfoHeroCard } from '../../../components/admin/info/InfoHeroCard';
import { InfoPieChartCard } from '../../../components/admin/info/InfoPieChartCard';
import { InfoLineChartCard } from '../../../components/admin/info/InfoLineChartCard';
import { useAdminReviews } from '../../../hooks/admin/useAdminReviews';
import { CourtsAverageRatingChart } from '../../../components/admin/info/CourtsAverageRatingChart';
import { useAdminReports } from '../../../hooks/admin/useAdminReports';
import { ReportType } from '../../../services/reportsService';

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
  const {
    loading: reportLoading,
    error: reportError,
    handleGenerate,
  } = useAdminReports();

  const ORANGE = theme.primary;

  const reportOptions: {
    type: ReportType;
    labelKey: string;
    descKey: string;
    icon: string;
  }[] = [
    {
      type: 'reservations',
      labelKey: 'adminReportsBookingsLabel',
      descKey: 'adminReportsBookingsDesc',
      icon: 'calendar-text',
    },
    {
      type: 'users',
      labelKey: 'adminReportsUsersLabel',
      descKey: 'adminReportsUsersDesc',
      icon: 'account-group',
    },
    {
      type: 'revenue',
      labelKey: 'adminReportsRevenueLabel',
      descKey: 'adminReportsRevenueDesc',
      icon: 'chart-bar',
    },
  ];

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

        {/* ─── Informes PDF ──────────────────────────────────────────────── */}
        <View
          style={{
            marginTop: 28,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: ORANGE + '40',
            backgroundColor: ORANGE + '08',
            padding: 20,
          }}
        >
          {/* Capçalera amb logo */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
              gap: 14,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: ORANGE }}>
                {t('adminReportsSectionTitle')}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSubtitle,
                  marginTop: 2,
                  lineHeight: 17,
                }}
              >
                {t('adminReportsSectionSubtitle')}
              </Text>
            </View>
          </View>

          {reportOptions.map((item) => {
            const isLoading = reportLoading[item.type];
            return (
              <TouchableOpacity
                key={item.type}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.cardBackground,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: ORANGE + '30',
                  padding: 14,
                  marginBottom: 10,
                  opacity: isLoading ? 0.7 : 1,
                }}
                activeOpacity={0.85}
                disabled={isLoading}
                onPress={() => handleGenerate(item.type)}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: ORANGE + '18',
                    borderWidth: 1,
                    borderColor: ORANGE + '35',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={ORANGE} />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={22}
                      color={ORANGE}
                    />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '800',
                      color: theme.textTitle,
                    }}
                  >
                    {t(item.labelKey)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.textSubtitle,
                      marginTop: 2,
                    }}
                  >
                    {t(item.descKey)}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name="file-download-outline"
                  size={22}
                  color={ORANGE}
                />
              </TouchableOpacity>
            );
          })}

          {!!reportError && (
            <Text
              style={{
                color: theme.danger,
                fontSize: 12,
                marginTop: 4,
                textAlign: 'center',
              }}
            >
              {t('adminReportsError')}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
