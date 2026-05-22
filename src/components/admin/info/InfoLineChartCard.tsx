import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTranslation } from 'react-i18next';
import { AppTheme } from '../../../theme';
import {
  LineChartRange,
  RangeOption,
  BarChartData,
} from '../../../hooks/admin/useAdminInfo';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';

type Props = {
  theme: AppTheme;
  isWide: boolean;
  cardWidth: number;
  loadingChart: boolean;
  lineChartTitle: string;
  lineChartTotal: number;
  lineChartRange: LineChartRange;
  rangeOptions: RangeOption[];
  onRangeChange: (range: LineChartRange) => void;
  barChartData: BarChartData;
};

export function InfoLineChartCard({
  theme,
  isWide,
  cardWidth,
  loadingChart,
  lineChartTitle,
  lineChartTotal,
  lineChartRange,
  rangeOptions,
  onRangeChange,
  barChartData,
}: Props) {
  const { t } = useTranslation();
  const chartScrollRef = useRef<ScrollView>(null);
  const chartScrollX = useRef(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleChartScroll = (event: any) => {
    chartScrollX.current = event.nativeEvent.contentOffset.x;
  };

  const maxValue = Math.max(...barChartData.map((d) => d.value), 1);

  // compute number of horizontal sections to avoid duplicated labels when maxValue is small
  const computedNoOfSections = (() => {
    const mv = Math.ceil(maxValue);
    if (mv <= 1) return 1;
    if (mv === 2) return 2;
    return 4;
  })();

  // DATOS CON COLORES (añadimos onPress para seleccionar el item sin usar renderTooltip)
  const barData = barChartData.map((item) => ({
    ...item,
    frontColor: '#60A5FA',
    onPress: () => setSelectedItem(item),
  }));

  const chartInnerWidth = Math.max(cardWidth - 28, 300);
  // base sizing per range
  let barWidth =
    lineChartRange === 'ytd'
      ? 10
      : lineChartRange === 'last30'
        ? 10
        : lineChartRange === 'next3m'
          ? 10
          : lineChartRange === 'next30'
            ? 10
            : 12;
  let barSpacing =
    lineChartRange === 'ytd'
      ? 12
      : lineChartRange === 'last30'
        ? 8
        : lineChartRange === 'next30'
          ? 8
          : lineChartRange === 'next3m'
            ? 6
            : 8;
  const rotateLabel = lineChartRange === 'next3m';
  const isYtd = lineChartRange === 'ytd';

  // ytd should always be horizontally scrollable.
  if (isYtd) {
    barWidth = 50;
  }

  const barsNaturalWidth =
    barData.length * barWidth +
    Math.max(barData.length - 1, 0) * barSpacing +
    24;
  const targetWidthByRange =
    lineChartRange === 'last30'
      ? 660
      : lineChartRange === 'next30'
        ? 660
        : lineChartRange === 'next3m'
          ? 900
          : lineChartRange === 'ytd'
            ? Math.max(chartInnerWidth + 220, 560)
            : 620;
  const chartMaxWidth = 820;
  const desiredChartWidth = Math.min(
    chartMaxWidth,
    Math.max(targetWidthByRange, barsNaturalWidth),
  );
  const enableHorizontalScroll =
    isYtd || desiredChartWidth > chartInnerWidth + 4;
  const chartWidth = enableHorizontalScroll
    ? desiredChartWidth
    : chartInnerWidth;

  const handleWebWheelScroll = (event: any) => {
    if (Platform.OS !== 'web') return;

    const deltaY = Number(event?.nativeEvent?.deltaY || 0);
    const deltaX = Number(event?.nativeEvent?.deltaX || 0);
    const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
    if (!delta) return;

    chartScrollX.current = Math.max(0, chartScrollX.current + delta);
    chartScrollRef.current?.scrollTo({
      x: chartScrollX.current,
      animated: false,
    });

    event?.preventDefault?.();
  };
  // we don't use renderTooltip (it can be invoked during render and cause loops)

  return (
    <View
      style={[
        styles.chartCard,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderAccentSoft,
          width: isWide ? cardWidth : '100%',
        },
      ]}
    >
      <Text style={[styles.chartHeading, { color: theme.textTitle }]}>
        {lineChartTitle}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rangePillsContent}
        style={styles.rangePills}
      >
        {rangeOptions.map((opt) => {
          const active = lineChartRange === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onRangeChange(opt.key)}
              style={[
                styles.rangePill,
                {
                  backgroundColor: active ? theme.primary : theme.primarySoft,
                  borderColor: active ? theme.primary : theme.borderAccentSoft,
                },
              ]}
            >
              <Text
                style={[
                  styles.rangePillText,
                  { color: active ? '#fff' : theme.primary },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loadingChart ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <>
          <Text
            style={[styles.lineChartSubtext, { color: theme.textSubtitle }]}
          >
            {t('adminInfoTotalInPeriod', { count: lineChartTotal })}
          </Text>

          {enableHorizontalScroll ? (
            <ScrollView
              ref={chartScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[
                styles.lineChartScroll,
                { width: '100%', overflow: 'hidden' },
              ]}
              onScroll={handleChartScroll}
              scrollEventThrottle={16}
              {...(Platform.OS === 'web'
                ? ({ onWheel: handleWebWheelScroll } as any)
                : {})}
            >
              <View
                style={{
                  paddingBottom: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <BarChart
                  barWidth={barWidth}
                  spacing={barSpacing}
                  width={chartWidth}
                  noOfSections={computedNoOfSections}
                  noOfSectionsBelowXAxis={0}
                  barBorderRadius={4}
                  frontColor="#60A5FA"
                  data={barData}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  yAxisColor={theme.borderAccentSoft}
                  xAxisColor={theme.borderAccentSoft}
                  hideRules={false}
                  rulesType="dash"
                  rulesColor={`${theme.borderAccentSoft}66`}
                  yAxisTextStyle={{
                    color: theme.textSubtitle,
                    fontSize: 10,
                  }}
                  xAxisLabelTextStyle={{
                    color: theme.textSubtitle,
                    fontSize: 9,
                  }}
                  labelsDistanceFromXaxis={6}
                  labelWidth={barWidth + barSpacing}
                  rotateLabel={rotateLabel}
                  showFractionalValues={false}
                  initialSpacing={10}
                  endSpacing={10}
                  maxValue={maxValue}
                />
                {selectedItem && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: [{ translateY: -40 }],
                      width: 220,
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.borderAccentSoft,
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 6,
                      zIndex: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedItem(null)}
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: 6,
                        width: 28,
                        height: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      accessibilityLabel={t('close')}
                    >
                      <Text style={{ color: theme.textSubtitle, fontSize: 14 }}>
                        ✕
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: theme.textTitle,
                        fontSize: 12,
                        fontWeight: 'bold',
                        marginBottom: 6,
                      }}
                    >
                      {t('adminInfoReservations')}
                    </Text>
                    <View
                      style={{
                        borderTopColor: theme.borderAccentSoft,
                        borderTopWidth: 1,
                        paddingTop: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.success,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {t('adminInfoCompleted')}:{' '}
                        {selectedItem.states?.finalizadas || 0}
                      </Text>
                      <Text
                        style={{
                          color: theme.primary,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {t('adminInfoConfirmed')}:{' '}
                        {selectedItem.states?.confirmadas || 0}
                      </Text>
                      <Text
                        style={{
                          color: theme.warning,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {t('adminInfoPending')}:{' '}
                        {selectedItem.states?.pendientes || 0}
                      </Text>
                      <Text style={{ color: theme.danger, fontSize: 11 }}>
                        {t('adminInfoCancelled')}:{' '}
                        {selectedItem.states?.canceladas || 0}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : (
            <View
              style={[
                styles.lineChartScroll,
                { width: '100%', overflow: 'hidden' },
              ]}
            >
              <View
                style={{
                  paddingBottom: 20,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <BarChart
                  barWidth={barWidth}
                  spacing={barSpacing}
                  width={chartWidth}
                  noOfSections={computedNoOfSections}
                  noOfSectionsBelowXAxis={0}
                  barBorderRadius={4}
                  frontColor="#60A5FA"
                  data={barData}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  yAxisColor={theme.borderAccentSoft}
                  xAxisColor={theme.borderAccentSoft}
                  hideRules={false}
                  rulesType="dash"
                  rulesColor={`${theme.borderAccentSoft}66`}
                  yAxisTextStyle={{
                    color: theme.textSubtitle,
                    fontSize: 10,
                  }}
                  xAxisLabelTextStyle={{
                    color: theme.textSubtitle,
                    fontSize: 9,
                  }}
                  labelsDistanceFromXaxis={6}
                  labelWidth={barWidth + barSpacing}
                  rotateLabel={rotateLabel}
                  showFractionalValues={false}
                  initialSpacing={10}
                  endSpacing={10}
                  maxValue={maxValue}
                />
                {selectedItem && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 12,
                      top: '50%',
                      transform: [{ translateY: -40 }],
                      width: 200,
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.borderAccentSoft,
                      borderWidth: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 6,
                      zIndex: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedItem(null)}
                      style={{
                        position: 'absolute',
                        right: 6,
                        top: 6,
                        width: 28,
                        height: 28,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      accessibilityLabel={t('close')}
                    >
                      <Text style={{ color: theme.textSubtitle, fontSize: 14 }}>
                        ✕
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: theme.textTitle,
                        fontSize: 12,
                        fontWeight: 'bold',
                        marginBottom: 6,
                      }}
                    >
                      {t('adminInfoReservations')}
                    </Text>
                    <View
                      style={{
                        borderTopColor: theme.borderAccentSoft,
                        borderTopWidth: 1,
                        paddingTop: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.success,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {t('adminInfoCompleted')}:{' '}
                        {selectedItem.states?.finalizadas || 0}
                      </Text>
                      <Text
                        style={{
                          color: theme.primary,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {t('adminInfoConfirmed')}:{' '}
                        {selectedItem.states?.confirmadas || 0}
                      </Text>
                      <Text
                        style={{
                          color: theme.warning,
                          fontSize: 11,
                          marginBottom: 4,
                        }}
                      >
                        {t('adminInfoPending')}:{' '}
                        {selectedItem.states?.pendientes || 0}
                      </Text>
                      <Text style={{ color: theme.danger, fontSize: 11 }}>
                        {t('adminInfoCancelled')}:{' '}
                        {selectedItem.states?.canceladas || 0}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}
