import { StyleSheet } from 'react-native';

export const adminInfoStyles = StyleSheet.create({
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
