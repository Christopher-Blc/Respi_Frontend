import { StyleSheet } from 'react-native';

export const pagosStyles = StyleSheet.create({
  page: { flex: 1 },
  hero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
    gap: 6,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  heroTagText:   { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6 },
  heroTitle:     { fontSize: 26, fontWeight: '900' },
  heroSub:       { fontSize: 13, lineHeight: 18 },
  kpiGrid:       { flexDirection: 'column', gap: 10, marginBottom: 16 },
  kpiGridWide:   { flexDirection: 'row', flexWrap: 'wrap' },
  methodCard:    { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16, gap: 10 },
  methodTitle:   { fontSize: 14, fontWeight: '800' },
  methodRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  methodChip:    { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  methodChipText:  { fontSize: 13, fontWeight: '700' },
  methodChipCount: { fontSize: 12, fontWeight: '800' },
  toolbar: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14 },
  viewToggle: { flexDirection: 'row', gap: 6 },
  toggleBtn: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  filterScroll: { marginBottom: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, marginRight: 8 },
  filterChipText: { fontSize: 13, fontWeight: '700' },
  resultCount: { fontSize: 12, marginBottom: 10 },
  emptyBox: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, fontWeight: '600' },
  retryBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, marginTop: 4 },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20, paddingBottom: 8 },
  pageBtn: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  pageInfo: { fontSize: 14, fontWeight: '700', minWidth: 60, textAlign: 'center' },
});

export const pagosKpiStyles = StyleSheet.create({
  card:    { flex: 1, minWidth: 140, borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  iconBox: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  value:   { fontSize: 22, fontWeight: '900' },
  label:   { fontSize: 12, color: '#6b7280', fontWeight: '700' },
  sub:     { fontSize: 11, color: '#9ca3af' },
});

export const pagosBadgeStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '800' },
});

export const pagosCardStyles = StyleSheet.create({
  card:     { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10, gap: 10 },
  row:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: { width: 38, height: 38, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  name:     { fontSize: 14, fontWeight: '700' },
  sub:      { fontSize: 12, marginTop: 1 },
  amount:   { fontSize: 16, fontWeight: '900' },
  footer:   { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  method:   { fontSize: 12, fontWeight: '600' },
  pi:       { fontSize: 11, flex: 1 },
});

export const pagosChartStyles = StyleSheet.create({
  row:         { gap: 12, marginBottom: 16 },
  rowWide:     { flexDirection: 'row' },
  card:        { flex: 1, borderRadius: 16, borderWidth: 1, padding: 16, overflow: 'hidden' },
  title:       { fontSize: 15, fontWeight: '800' },
  sub:         { fontSize: 12, marginTop: 2 },
  empty:       { fontSize: 13, fontWeight: '600', textAlign: 'center', paddingVertical: 28 },
  pieWrap:     { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' },
  legend:      { flex: 1, gap: 10, minWidth: 100 },
  legendItem:  { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendDot:   { width: 10, height: 10, borderRadius: 5 },
  legendText:  { fontSize: 12, fontWeight: '600', flex: 1 },
  legendCount: { fontSize: 12, fontWeight: '800' },
});

export const pagosTableStyles = StyleSheet.create({
  header:     { flexDirection: 'row', borderRadius: 10, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 8, marginBottom: 4 },
  headerCell: { flex: 1, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 4 },
  row:        { flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' },
  cell:       { flex: 1, paddingHorizontal: 4 },
  cellId:     { maxWidth: 50,  fontSize: 12 },
  cellDate:   { maxWidth: 100, fontSize: 12 },
  cellAmount: { maxWidth: 90,  fontSize: 14 },
  cellMethod: { maxWidth: 90,  fontSize: 12 },
  cellStatus: { maxWidth: 120 },
  cellPi:     { maxWidth: 160, fontSize: 11 },
  cellMain:   { fontSize: 13, fontWeight: '700' },
  cellSub:    { fontSize: 11, marginTop: 1 },
});
