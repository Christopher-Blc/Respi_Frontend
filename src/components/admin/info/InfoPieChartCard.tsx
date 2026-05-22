import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../../theme';
import { PieSliceData } from '../../../hooks/admin/useAdminInfo';
import { adminInfoStyles as styles } from '../../../style/admin/info.styles';

type Props = {
  theme: AppTheme;
  isWide: boolean;
  cardWidth: number;
  title: string;
  loadingChart: boolean;
  totalReservas: number;
  emptyLabel: string;
  chartSize: number;
  visiblePieData: PieSliceData[];
  selectedSliceIndex: number;
  onSelectSlice: (index: number) => void;
  activeSlice: PieSliceData;
  activePercentage: number;
};

const renderDot = (color: string) => (
  <View style={[styles.legendDot, { backgroundColor: color }]} />
);

export function InfoPieChartCard({
  theme,
  isWide,
  cardWidth,
  title,
  loadingChart,
  totalReservas,
  emptyLabel,
  chartSize,
  visiblePieData,
  selectedSliceIndex,
  onSelectSlice,
  activeSlice,
  activePercentage,
}: Props) {
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
        {title}
      </Text>

      {loadingChart ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : totalReservas === 0 ? (
        <Text style={[styles.emptyChartText, { color: theme.textSubtitle }]}>
          {emptyLabel}
        </Text>
      ) : (
        <>
          <View style={styles.chartInnerWrap}>
            <PieChart
              data={visiblePieData.map((item, index) => ({
                ...item,
                focused: index === selectedSliceIndex,
              }))}
              donut
              showGradient
              focusOnPress
              onPress={(_: any, index?: number) => {
                if (typeof index === 'number') {
                  onSelectSlice(index);
                }
              }}
              radius={Math.min(90, chartSize / 2)}
              innerRadius={Math.min(62, chartSize / 3)}
              innerCircleColor={theme.cardBackground}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text
                    style={[
                      styles.centerLabelValue,
                      { color: theme.textTitle },
                    ]}
                  >
                    {activePercentage}%
                  </Text>
                  <Text
                    style={[
                      styles.centerLabelTitle,
                      { color: theme.textSubtitle },
                    ]}
                  >
                    {activeSlice.label}
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={styles.legendRowsWrap}>
            <View style={styles.legendRowLine}>
              {visiblePieData.slice(0, 2).map((item) => (
                <View key={item.label} style={styles.legendTwoColItem}>
                  {renderDot(item.gradientCenterColor || item.color)}
                  <Text
                    style={[styles.legendValueText, { color: theme.textBody }]}
                  >
                    {item.label}:{' '}
                    {totalReservas
                      ? Math.round((item.value / totalReservas) * 100)
                      : 0}
                    %
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.legendRowLine}>
              {visiblePieData.slice(2, 4).map((item) => (
                <View key={item.label} style={styles.legendTwoColItem}>
                  {renderDot(item.gradientCenterColor || item.color)}
                  <Text
                    style={[styles.legendValueText, { color: theme.textBody }]}
                  >
                    {item.label}:{' '}
                    {totalReservas
                      ? Math.round((item.value / totalReservas) * 100)
                      : 0}
                    %
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
