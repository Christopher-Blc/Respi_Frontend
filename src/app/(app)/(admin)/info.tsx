import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

type LineChartRange = 'last30' | 'next30' | 'ytd' | 'next3m' | 'all';

const RANGE_OPTIONS: { key: LineChartRange; label: string }[] = [
  { key: 'last30', label: 'Últ. 30d' },
  { key: 'next30', label: 'Próx. 30d' },
  { key: 'ytd', label: 'Este año' },
  { key: 'next3m', label: 'Próx. 3m' },
  { key: 'all', label: 'Últ. 3m' },
];
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';
import { Reserva } from '../../../types/types';

const extractReservas = (payload: any): Reserva[] => {
  if (Array.isArray(payload)) return payload as Reserva[];
  if (Array.isArray(payload?.data)) return payload.data as Reserva[];
  if (Array.isArray(payload?.items)) return payload.items as Reserva[];
  if (Array.isArray(payload?.rows)) return payload.rows as Reserva[];
  if (Array.isArray(payload?.reservas)) return payload.reservas as Reserva[];
  return [];
};

const formatDateToYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatShortEs = (date: Date) => {
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'short' });
  return `${day}\n${month}`;
};

const getReservaDateKey = (fechaReserva: string) => {
  const raw = String(fechaReserva || '');
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDateToYmd(parsed);
};

export default function InfoAdmin() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(0);
  const [lineChartRange, setLineChartRange] =
    useState<LineChartRange>('last30');

  const horizontalPadding = width >= 1280 ? 40 : width >= 768 ? 28 : 20;
  const maxPaddingWidth = 1400;
  const contentWidth = width > maxPaddingWidth ? maxPaddingWidth : width;
  const availableGridWidth = Math.max(contentWidth - horizontalPadding * 2, 0);
  const isWide = width >= 768;
  const cardWidth = isWide
    ? Math.floor((availableGridWidth - 16) / 2)
    : availableGridWidth;

  // Dynamic spacing based on range
  const lineChartItemSpacing =
    lineChartRange === 'last30' || lineChartRange === 'next30'
      ? 20
      : lineChartRange === 'ytd'
        ? 6
        : 8; // 'next3m' and 'all'

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoadingChart(true);
        const response = await api.get('/reserva');
        setReservas(extractReservas(response?.data));
      } catch {
        setReservas([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchReservas();
  }, []);

  const statusSummary = useMemo(() => {
    const counters = {
      finalizadas: 0,
      confirmadas: 0,
      pendientes: 0,
      canceladas: 0,
    };

    reservas.forEach((reserva) => {
      const normalized = String(reserva.estado || '')
        .trim()
        .toLowerCase();

      if (normalized === 'finalizada') {
        counters.finalizadas += 1;
        return;
      }

      if (normalized === 'confirmada' || normalized === 'confirmado') {
        counters.confirmadas += 1;
        return;
      }

      if (normalized === 'pendiente') {
        counters.pendientes += 1;
        return;
      }

      if (normalized === 'cancelada' || normalized === 'cancelado') {
        counters.canceladas += 1;
      }
    });

    return counters;
  }, [reservas]);

  const chartData = [
    {
      label: 'Finalizadas',
      value: statusSummary.finalizadas,
      color: theme.success,
      gradientCenterColor: '#A87408',
    },
    {
      label: 'Confirmadas',
      value: statusSummary.confirmadas,
      color: '#E6BD6A',
      gradientCenterColor: '#C89636',
    },
    {
      label: 'Pendientes',
      value: statusSummary.pendientes,
      color: theme.warning,
      gradientCenterColor: '#D89B2F',
    },
    {
      label: 'Canceladas',
      value: statusSummary.canceladas,
      color: theme.danger,
      gradientCenterColor: '#C93535',
    },
  ];

  const chartSize = Math.min(availableGridWidth - 24, 280);
  const totalReservas =
    statusSummary.finalizadas +
    statusSummary.confirmadas +
    statusSummary.pendientes +
    statusSummary.canceladas;

  const visiblePieData = chartData.filter((item) => item.value > 0);
  const topSlice = visiblePieData.reduce(
    (best, item) => (item.value > best.value ? item : best),
    visiblePieData[0] || { label: 'Sin datos', value: 0 },
  );
  const topSliceIndex = Math.max(
    0,
    visiblePieData.findIndex((item) => item.label === topSlice.label),
  );

  useEffect(() => {
    if (!visiblePieData.length) {
      setSelectedSliceIndex(0);
      return;
    }

    if (selectedSliceIndex >= visiblePieData.length) {
      setSelectedSliceIndex(topSliceIndex);
    }
  }, [visiblePieData.length, selectedSliceIndex, topSliceIndex]);

  const activeSlice = visiblePieData[selectedSliceIndex] || topSlice;
  const activePercentage = totalReservas
    ? Math.round((activeSlice.value / totalReservas) * 100)
    : 0;

  const lineChartDatasets = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build per-estado counters keyed by date
    const counters = {
      confirmadas: new Map<string, number>(),
      finalizadas: new Map<string, number>(),
      pendientes: new Map<string, number>(),
      canceladas: new Map<string, number>(),
    };

    reservas.forEach((reserva) => {
      const key = getReservaDateKey(reserva.fecha_reserva);
      if (!key) return;
      const normalized = String(reserva.estado || '')
        .trim()
        .toLowerCase();
      let map: Map<string, number> | null = null;
      if (normalized === 'confirmada' || normalized === 'confirmado')
        map = counters.confirmadas;
      else if (normalized === 'finalizada') map = counters.finalizadas;
      else if (normalized === 'pendiente') map = counters.pendientes;
      else if (normalized === 'cancelada' || normalized === 'cancelado')
        map = counters.canceladas;
      if (map) map.set(key, (map.get(key) || 0) + 1);
    });

    // Build date key list based on range
    let dateKeys: string[] = [];

    if (lineChartRange === 'last30') {
      for (let i = 29; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'next30') {
      for (let i = 0; i < 30; i += 1) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'next3m') {
      for (let i = 0; i < 90; i += 1) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dateKeys.push(formatDateToYmd(d));
      }
    } else if (lineChartRange === 'ytd') {
      const start = new Date(today.getFullYear(), 0, 1);
      const d = new Date(start);
      while (d <= today) {
        dateKeys.push(formatDateToYmd(d));
        d.setDate(d.getDate() + 1);
      }
    } else if (lineChartRange === 'all') {
      // For 'all', show last 90 days (max 3 months back)
      for (let i = 89; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dateKeys.push(formatDateToYmd(d));
      }
    }

    const total = dateKeys.length;
    const labelEvery = total <= 30 ? 5 : total <= 90 ? 10 : 30;

    const buildDaySeries = (map: Map<string, number>) =>
      dateKeys.map((key, idx) => {
        const parts = key.split('-');
        const date = new Date(
          Number(parts[0]),
          Number(parts[1]) - 1,
          Number(parts[2]),
        );
        const isLast = idx === total - 1;
        return {
          value: map.get(key) || 0,
          label: idx % labelEvery === 0 || isLast ? formatShortEs(date) : '',
        };
      });

    return {
      confirmadas: buildDaySeries(counters.confirmadas),
      finalizadas: buildDaySeries(counters.finalizadas),
      pendientes: buildDaySeries(counters.pendientes),
      canceladas: buildDaySeries(counters.canceladas),
      count: total,
    };
  }, [reservas, lineChartRange]);

  const lineChartTotalWidth =
    lineChartDatasets.count * lineChartItemSpacing + 50;

  const lineChartTotal =
    lineChartDatasets.confirmadas.reduce((a, i) => a + i.value, 0) +
    lineChartDatasets.finalizadas.reduce((a, i) => a + i.value, 0) +
    lineChartDatasets.pendientes.reduce((a, i) => a + i.value, 0) +
    lineChartDatasets.canceladas.reduce((a, i) => a + i.value, 0);

  const lineChartTitle = {
    last30: 'Últimos 30 días',
    next30: 'Próximos 30 días',
    ytd: 'Este año',
    next3m: 'Próximos 3 meses',
    all: 'Últimos 3 meses',
  }[lineChartRange];

  const renderDot = (color: string) => (
    <View style={[localStyles.legendDot, { backgroundColor: color }]} />
  );

  return (
    <View style={[localStyles.page, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight + 20,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: horizontalPadding,
        }}
      >
        <View
          style={[
            localStyles.heroCard,
            {
              backgroundColor: theme.primarySoft,
              borderColor: theme.borderAccentSoft,
            },
          ]}
        >
          <Text style={[localStyles.eyebrow, { color: theme.primary }]}>
            Analítica admin
          </Text>
          <Text style={[localStyles.title, { color: theme.textTitle }]}>
            Estado de reservas
          </Text>
          <Text style={[localStyles.subtitle, { color: theme.textSubtitle }]}>
            Vista rápida de cuántas reservas están finalizadas, confirmadas,
            pendientes y canceladas.
          </Text>
        </View>

        <View style={localStyles.chartsRow}>
          {/* ── Pie chart card ── */}
          <View
            style={[
              localStyles.chartCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderAccentSoft,
                width: isWide ? cardWidth : '100%',
              },
            ]}
          >
            <Text
              style={[localStyles.chartHeading, { color: theme.textTitle }]}
            >
              Reservas por estado
            </Text>

            {loadingChart ? (
              <ActivityIndicator size="large" color={theme.primary} />
            ) : totalReservas === 0 ? (
              <Text
                style={[
                  localStyles.emptyChartText,
                  { color: theme.textSubtitle },
                ]}
              >
                Aún no hay reservas para mostrar en el gráfico.
              </Text>
            ) : (
              <>
                <View style={localStyles.chartInnerWrap}>
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
                        setSelectedSliceIndex(index);
                      }
                    }}
                    radius={Math.min(90, chartSize / 2)}
                    innerRadius={Math.min(62, chartSize / 3)}
                    innerCircleColor={theme.cardBackground}
                    centerLabelComponent={() => (
                      <View style={localStyles.centerLabel}>
                        <Text
                          style={[
                            localStyles.centerLabelValue,
                            { color: theme.textTitle },
                          ]}
                        >
                          {activePercentage}%
                        </Text>
                        <Text
                          style={[
                            localStyles.centerLabelTitle,
                            { color: theme.textSubtitle },
                          ]}
                        >
                          {activeSlice.label}
                        </Text>
                      </View>
                    )}
                  />
                </View>

                <View style={localStyles.legendRowsWrap}>
                  <View style={localStyles.legendRowLine}>
                    {visiblePieData.slice(0, 2).map((item) => (
                      <View
                        key={item.label}
                        style={localStyles.legendTwoColItem}
                      >
                        {renderDot(item.gradientCenterColor || item.color)}
                        <Text
                          style={[
                            localStyles.legendValueText,
                            { color: theme.textBody },
                          ]}
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
                  <View style={localStyles.legendRowLine}>
                    {visiblePieData.slice(2, 4).map((item) => (
                      <View
                        key={item.label}
                        style={localStyles.legendTwoColItem}
                      >
                        {renderDot(item.gradientCenterColor || item.color)}
                        <Text
                          style={[
                            localStyles.legendValueText,
                            { color: theme.textBody },
                          ]}
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

          {/* ── Line chart card ── */}
          <View
            style={[
              localStyles.chartCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderAccentSoft,
                width: isWide ? cardWidth : '100%',
              },
            ]}
          >
            <Text
              style={[localStyles.chartHeading, { color: theme.textTitle }]}
            >
              {lineChartTitle}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={localStyles.rangePillsContent}
              style={localStyles.rangePills}
            >
              {RANGE_OPTIONS.map((opt) => {
                const active = lineChartRange === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setLineChartRange(opt.key)}
                    style={[
                      localStyles.rangePill,
                      {
                        backgroundColor: active
                          ? theme.primary
                          : theme.primarySoft,
                        borderColor: active
                          ? theme.primary
                          : theme.borderAccentSoft,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        localStyles.rangePillText,
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
                  style={[
                    localStyles.lineChartSubtext,
                    { color: theme.textSubtitle },
                  ]}
                >
                  Total en periodo: {lineChartTotal}
                </Text>
                {/* Legend */}
                <View style={localStyles.lineChartLegend}>
                  {(
                    [
                      { label: 'Confirmadas', color: '#60A5FA' },
                      { label: 'Finalizadas', color: theme.success },
                      { label: 'Pendientes', color: theme.warning },
                      { label: 'Canceladas', color: theme.danger },
                    ] as const
                  ).map((item) => (
                    <View
                      key={item.label}
                      style={localStyles.lineChartLegendItem}
                    >
                      <View
                        style={[
                          localStyles.legendDot,
                          { backgroundColor: item.color },
                        ]}
                      />
                      <Text
                        style={[
                          localStyles.legendValueText,
                          { color: theme.textSubtitle },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  ))}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={localStyles.lineChartScroll}
                >
                  <LineChart
                    areaChart
                    curved
                    data={lineChartDatasets.confirmadas}
                    data2={lineChartDatasets.finalizadas}
                    data3={lineChartDatasets.pendientes}
                    data4={lineChartDatasets.canceladas}
                    height={280}
                    width={lineChartTotalWidth}
                    spacing={lineChartItemSpacing}
                    initialSpacing={0}
                    endSpacing={16}
                    hideDataPoints
                    thickness={2}
                    color1="#60A5FA"
                    color2={theme.success}
                    color3={theme.warning}
                    color4={theme.danger}
                    startFillColor1="#60A5FA"
                    startFillColor2={theme.success}
                    startFillColor3={theme.warning}
                    startFillColor4={theme.danger}
                    startOpacity={0.4}
                    endOpacity={0.05}
                    xAxisColor={theme.borderSoft}
                    yAxisColor={theme.borderSoft}
                    yAxisTextStyle={{
                      color: theme.textSubtitle,
                      fontSize: 9,
                    }}
                    showVerticalLines
                    verticalLinesColor={theme.borderSoft}
                    xAxisLabelTextStyle={{
                      color: theme.textSubtitle,
                      fontSize: 9,
                    }}
                    rotateLabel
                    noOfSections={4}
                    maxValue={Math.max(
                      ...lineChartDatasets.confirmadas.map((d) => d.value),
                      ...lineChartDatasets.finalizadas.map((d) => d.value),
                      ...lineChartDatasets.pendientes.map((d) => d.value),
                      ...lineChartDatasets.canceladas.map((d) => d.value),
                      4,
                    )}
                    isAnimated
                    pointerConfig={{
                      pointerStripUptoDataPoint: true,
                      pointerStripColor: theme.textSubtitle,
                      pointerStripWidth: 1,
                      pointerColor: theme.primary,
                      radius: 4,
                      pointerLabelWidth: 100,
                      pointerLabelHeight: 90,
                      autoAdjustPointerLabelPosition: true,
                      pointerLabelComponent: (items: any[]) => {
                        const labels = [
                          { label: 'Conf', color: '#60A5FA' },
                          { label: 'Final', color: theme.success },
                          { label: 'Pend', color: theme.warning },
                          { label: 'Canc', color: theme.danger },
                        ];
                        return (
                          <View
                            style={[
                              localStyles.tooltipBox,
                              {
                                backgroundColor: theme.cardBackground,
                                borderColor: theme.borderAccentSoft,
                                minWidth: 90,
                              },
                            ]}
                          >
                            {items.map((item, i) => (
                              <View key={i} style={localStyles.tooltipRow}>
                                <View
                                  style={[
                                    localStyles.tooltipDot,
                                    { backgroundColor: labels[i]?.color },
                                  ]}
                                />
                                <Text
                                  style={[
                                    localStyles.tooltipLabel,
                                    { color: theme.textSubtitle },
                                  ]}
                                >
                                  {labels[i]?.label}:
                                </Text>
                                <Text
                                  style={[
                                    localStyles.tooltipValue,
                                    { color: labels[i]?.color, fontSize: 12 },
                                  ]}
                                >
                                  {' '}
                                  {item?.value ?? 0}
                                </Text>
                              </View>
                            ))}
                          </View>
                        );
                      },
                    }}
                  />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  page: {
    flex: 1,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  chartHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  lineChartSubtext: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  rangePills: {
    marginBottom: 10,
  },
  rangePillsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  rangePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  rangePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  lineChartScroll: {
    marginTop: 4,
  },
  tooltipBox: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tooltipDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: 4,
  },
  tooltipValue: {
    fontSize: 12,
    fontWeight: '800',
  },
  tooltipLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  lineChartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  lineChartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartInnerWrap: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  centerLabelValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  emptyChartText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  legendRowsWrap: {
    width: '100%',
    marginTop: 10,
    gap: 10,
  },
  legendRowLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 10,
  },
  legendTwoColItem: {
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendValueText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
