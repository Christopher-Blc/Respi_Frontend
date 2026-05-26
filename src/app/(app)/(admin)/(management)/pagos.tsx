import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { useAppTheme } from '../../../../context/ThemeContext';
import { AppTheme } from '../../../../theme';
import {
  useAdminPayments,
  type AdminPayment,
  type PaymentStatusFilter,
} from '../../../../hooks/admin/useAdminPayments';

// Status semánticos fijos — independientes del tema
const STATUS_META: Record<string, { color: string; icon: string; label: string }> = {
  Pagado:      { color: '#22c55e', icon: 'checkmark-circle',  label: 'Pagado'     },
  Reembolsado: { color: '#0ea5e9', icon: 'refresh-circle',    label: 'Reembolsado'},
  'No pagado': { color: '#f59e0b', icon: 'time',              label: 'Pendiente'  },
  'En proceso':{ color: '#8b5cf6', icon: 'reload-circle',     label: 'En proceso' },
};

const FILTER_OPTIONS: { key: PaymentStatusFilter; label: string }[] = [
  { key: 'all',         label: 'Todos'      },
  { key: 'Pagado',      label: 'Pagados'    },
  { key: 'Reembolsado', label: 'Reembolsados'},
  { key: 'No pagado',   label: 'Pendientes' },
  { key: 'En proceso',  label: 'En proceso' },
];

/* ── KPI card ─────────────────────────────────────────────────────────────── */
function KpiCard({
  icon, label, value, color, sub,
}: { icon: string; label: string; value: string; color: string; sub?: string }) {
  return (
    <View style={[kpiStyles.card, { borderColor: color + '30', backgroundColor: color + '10' }]}>
      <View style={[kpiStyles.iconBox, { backgroundColor: color + '1A', borderColor: color + '35' }]}>
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>
      <Text style={[kpiStyles.value, { color }]}>{value}</Text>
      <Text style={kpiStyles.label}>{label}</Text>
      {!!sub && <Text style={kpiStyles.sub}>{sub}</Text>}
    </View>
  );
}

/* ── Badge de estado ──────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { color: '#6b7280', icon: 'help-circle', label: status };
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: meta.color + '18', borderColor: meta.color + '40' }]}>
      <Ionicons name={meta.icon as any} size={11} color={meta.color} />
      <Text style={[badgeStyles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

/* ── Fila de pago (tabla o card) ──────────────────────────────────────────── */
function PaymentRow({
  p, isTable, theme,
}: { p: AdminPayment; isTable: boolean; theme: AppTheme }) {
  const date = new Date(p.payment_date).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const user  = p.reservation?.user;
  const court = p.reservation?.court;
  const userName = user
    ? `${user.name} ${user.surname}`
    : `Reserva #${p.reservation_id}`;

  if (isTable) {
    return (
      <View style={[tableStyles.row, { borderBottomColor: theme.borderSoft }]}>
        <Text style={[tableStyles.cell, tableStyles.cellId,     { color: theme.textMuted }]}>#{p.id}</Text>
        <View style={tableStyles.cell}>
          <Text style={[tableStyles.cellMain, { color: theme.textTitle }]} numberOfLines={1}>{userName}</Text>
          {!!court && <Text style={[tableStyles.cellSub, { color: theme.textMuted }]} numberOfLines={1}>{court.name}</Text>}
        </View>
        <Text style={[tableStyles.cell, tableStyles.cellDate,   { color: theme.textMuted }]}>{date}</Text>
        <Text style={[tableStyles.cell, tableStyles.cellAmount, { color: '#22c55e', fontWeight: '800' }]}>
          {Number(p.amount).toFixed(2)} €
        </Text>
        <Text style={[tableStyles.cell, tableStyles.cellMethod, { color: theme.textBody }]}>{p.payment_method}</Text>
        <View style={[tableStyles.cell, tableStyles.cellStatus]}>
          <StatusBadge status={p.payment_status} />
        </View>
        <Text style={[tableStyles.cell, tableStyles.cellPi,     { color: theme.textMuted }]} numberOfLines={1}>
          {p.stripe_payment_intent_id ? `${p.stripe_payment_intent_id.slice(0, 18)}…` : '—'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[cardStyles.card, { backgroundColor: theme.cardBackground, borderColor: theme.borderSoft }]}>
      <View style={cardStyles.row}>
        <View style={[cardStyles.iconWrap, { backgroundColor: theme.primarySoft, borderColor: theme.borderAccentSoft }]}>
          <MaterialCommunityIcons name="credit-card-outline" size={20} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[cardStyles.name, { color: theme.textTitle }]} numberOfLines={1}>{userName}</Text>
          {!!court && (
            <Text style={[cardStyles.sub, { color: theme.textMuted }]} numberOfLines={1}>
              {court.name} · {date}
            </Text>
          )}
        </View>
        <Text style={[cardStyles.amount, { color: '#22c55e' }]}>{Number(p.amount).toFixed(2)} €</Text>
      </View>
      <View style={cardStyles.footer}>
        <StatusBadge status={p.payment_status} />
        <Text style={[cardStyles.method, { color: theme.textMuted }]}>{p.payment_method}</Text>
        {p.stripe_payment_intent_id && (
          <Text style={[cardStyles.pi, { color: theme.textSubtitle }]} numberOfLines={1}>
            {p.stripe_payment_intent_id.slice(0, 22)}…
          </Text>
        )}
      </View>
    </View>
  );
}

/* ── Pantalla principal ───────────────────────────────────────────────────── */
export default function PagosAdminScreen() {
  const { theme } = useAppTheme();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const isWide  = width >= 768;
  const isTable = viewMode === 'table' && isWide;
  const horizontalPadding = width >= 1280 ? 40 : width >= 768 ? 28 : 16;

  const {
    payments, loading, error,
    search, setSearch,
    statusFilter, setStatusFilter,
    page, totalPages, setPage,
    stats, refresh, totalFiltered,
  } = useAdminPayments();

  // ── Datos para gráficas ──────────────────────────────────────────────────
  const revenueBarData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return {
        value: stats.revenueByMonth[key] ?? 0,
        label: d.toLocaleString('es-ES', { month: 'short' }),
        frontColor: theme.primary,
      };
    });
  }, [stats.revenueByMonth, theme.primary]);

  const barMaxValue = useMemo(() => {
    const max = Math.max(...revenueBarData.map((d) => d.value), 0);
    if (max === 0) return 10;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / magnitude) * magnitude;
  }, [revenueBarData]);

  const pieData = useMemo(() => [
    { value: stats.countPaid,     color: '#22c55e', gradientCenterColor: '#16a34a', label: 'Pagados'       },
    { value: stats.countRefunded, color: '#0ea5e9', gradientCenterColor: '#0284c7', label: 'Reembolsados'  },
    { value: stats.countPending,  color: '#f59e0b', gradientCenterColor: '#d97706', label: 'Pendientes'    },
  ].filter((d) => d.value > 0), [stats.countPaid, stats.countRefunded, stats.countPending]);

  const pieTotal = stats.countPaid + stats.countRefunded + stats.countPending;

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.primary} />
        }
        contentContainerStyle={{
          paddingTop: headerHeight + 16,
          paddingBottom: insets.bottom + (Platform.OS === 'web' ? 100 : 120),
          paddingHorizontal: horizontalPadding,
        }}
      >
        {/* ── Hero ── */}
        <View style={[styles.hero, { backgroundColor: theme.primarySoft, borderColor: theme.borderAccentSoft }]}>
          <View style={[styles.heroTag, { borderColor: theme.borderAccentSoft }]}>
            <MaterialCommunityIcons name="credit-card-multiple-outline" size={13} color={theme.primary} />
            <Text style={[styles.heroTagText, { color: theme.primary }]}>Panel de Pagos</Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.textTitle }]}>Gestión de Pagos</Text>
          <Text style={[styles.heroSub, { color: theme.textSubtitle }]}>
            Estadísticas y registro completo de transacciones
          </Text>
        </View>

        {/* ── KPIs ── */}
        <View style={[styles.kpiGrid, isWide && styles.kpiGridWide]}>
          <KpiCard
            icon="cash-multiple"
            label="Ingresos totales"
            value={`${stats.totalRevenue.toFixed(2)} €`}
            color="#22c55e"
            sub={`${stats.countPaid} pagos completados`}
          />
          <KpiCard
            icon="credit-card-check-outline"
            label="Pagos confirmados"
            value={String(stats.countPaid)}
            color={theme.primary}
          />
          <KpiCard
            icon="cash-refund"
            label="Reembolsado"
            value={`${stats.totalRefunded.toFixed(2)} €`}
            color="#0ea5e9"
            sub={`${stats.countRefunded} reembolsos`}
          />
          <KpiCard
            icon="clock-alert-outline"
            label="Pendientes"
            value={String(stats.countPending)}
            color={theme.warning}
          />
        </View>

        {/* ── Gráficas ── */}
        <View style={[chartStyles.row, isWide && chartStyles.rowWide]}>

          {/* Bar: ingresos mensuales */}
          <View style={[chartStyles.card, { backgroundColor: theme.cardBackground, borderColor: theme.borderAccentSoft }]}>
            <Text style={[chartStyles.title, { color: theme.textTitle }]}>Ingresos mensuales</Text>
            <Text style={[chartStyles.sub,   { color: theme.textSubtitle }]}>Últimos 6 meses · €</Text>
            {stats.totalRevenue === 0 ? (
              <Text style={[chartStyles.empty, { color: theme.textMuted }]}>Sin ingresos aún</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                <BarChart
                  data={revenueBarData}
                  barWidth={38}
                  spacing={14}
                  barBorderRadius={6}
                  width={revenueBarData.length * 54}
                  noOfSections={4}
                  noOfSectionsBelowXAxis={0}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  yAxisColor={theme.borderAccentSoft}
                  xAxisColor={theme.borderAccentSoft}
                  rulesType="dash"
                  rulesColor={`${theme.borderAccentSoft}66`}
                  yAxisTextStyle={{ color: theme.textSubtitle, fontSize: 9 }}
                  xAxisLabelTextStyle={{ color: theme.textSubtitle, fontSize: 9 }}
                  initialSpacing={8}
                  endSpacing={8}
                  showFractionalValues={false}
                  maxValue={barMaxValue}
                />
              </ScrollView>
            )}
          </View>

          {/* Pie: distribución por estado */}
          <View style={[chartStyles.card, { backgroundColor: theme.cardBackground, borderColor: theme.borderAccentSoft }]}>
            <Text style={[chartStyles.title, { color: theme.textTitle }]}>Estado de pagos</Text>
            <Text style={[chartStyles.sub,   { color: theme.textSubtitle }]}>Distribución por estado</Text>
            {pieTotal === 0 ? (
              <Text style={[chartStyles.empty, { color: theme.textMuted }]}>Sin datos aún</Text>
            ) : (
              <View style={chartStyles.pieWrap}>
                <PieChart
                  data={pieData}
                  donut
                  showGradient
                  focusOnPress
                  radius={68}
                  innerRadius={46}
                  innerCircleColor={theme.cardBackground}
                  centerLabelComponent={() => (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ color: theme.textTitle, fontSize: 18, fontWeight: '900' }}>{pieTotal}</Text>
                      <Text style={{ color: theme.textSubtitle, fontSize: 9 }}>total</Text>
                    </View>
                  )}
                />
                <View style={chartStyles.legend}>
                  {pieData.map((s) => (
                    <View key={s.label} style={chartStyles.legendItem}>
                      <View style={[chartStyles.legendDot, { backgroundColor: s.color }]} />
                      <Text style={[chartStyles.legendText, { color: theme.textBody }]}>
                        {s.label} · {Math.round((s.value / pieTotal) * 100)}%
                      </Text>
                      <Text style={[chartStyles.legendCount, { color: theme.textMuted }]}>{s.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── Métodos de pago ── */}
        {Object.keys(stats.methodCounts).length > 0 && (
          <View style={[styles.methodCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderSoft }]}>
            <Text style={[styles.methodTitle, { color: theme.textTitle }]}>Métodos de pago</Text>
            <View style={styles.methodRow}>
              {Object.entries(stats.methodCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([method, count]) => (
                  <View key={method} style={[styles.methodChip, { backgroundColor: theme.primarySoft, borderColor: theme.borderAccentSoft }]}>
                    <MaterialCommunityIcons name="credit-card-outline" size={13} color={theme.primary} />
                    <Text style={[styles.methodChipText, { color: theme.textTitle }]}>{method}</Text>
                    <Text style={[styles.methodChipCount, { color: theme.primary }]}>{count}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* ── Barra de búsqueda + toggle vista ── */}
        <View style={styles.toolbar}>
          <View style={[styles.searchBox, { backgroundColor: theme.inputBackground, borderColor: theme.borderSoft }]}>
            <Ionicons name="search-outline" size={18} color={theme.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar usuario, pista, PI..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.textTitle }]}
            />
            {!!search && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          {isWide && (
            <View style={styles.viewToggle}>
              {(['cards', 'table'] as const).map((mode) => {
                const active = viewMode === mode;
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.toggleBtn,
                      { borderColor: active ? theme.primary : theme.borderSoft },
                      active && { backgroundColor: theme.primarySoft },
                    ]}
                    onPress={() => setViewMode(mode)}
                  >
                    <MaterialCommunityIcons
                      name={mode === 'cards' ? 'view-grid-outline' : 'table-large'}
                      size={18}
                      color={active ? theme.primary : theme.textMuted}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ── Chips de filtro por estado ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {FILTER_OPTIONS.map((f) => {
            const active = statusFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  { borderColor: active ? theme.primary : theme.borderSoft },
                  active && { backgroundColor: theme.primary },
                ]}
                onPress={() => setStatusFilter(f.key)}
              >
                <Text style={[styles.filterChipText, { color: active ? theme.onPrimary : theme.textMuted }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.resultCount, { color: theme.textMuted }]}>
          {totalFiltered} resultado{totalFiltered !== 1 ? 's' : ''}
        </Text>

        {/* ── Contenido ── */}
        {loading && payments.length === 0 ? (
          <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={40} color={theme.danger} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>{error}</Text>
            <TouchableOpacity
              onPress={refresh}
              style={[styles.retryBtn, { borderColor: theme.primary }]}
            >
              <Text style={{ color: theme.primary, fontWeight: '700' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : payments.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="credit-card-off-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No hay pagos que mostrar</Text>
          </View>
        ) : isTable ? (
          /* ── Vista tabla ── */
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={{ minWidth: 860 }}>
              <View style={[tableStyles.header, { backgroundColor: theme.primarySoft, borderColor: theme.borderAccentSoft }]}>
                {['#', 'Cliente / Pista', 'Fecha', 'Importe', 'Método', 'Estado', 'PaymentIntent'].map((h) => (
                  <Text key={h} style={[tableStyles.headerCell, { color: theme.primary }]}>{h}</Text>
                ))}
              </View>
              {payments.map((p) => (
                <PaymentRow key={p.id} p={p} isTable theme={theme} />
              ))}
            </View>
          </ScrollView>
        ) : (
          /* ── Vista cards ── */
          <View style={isWide ? styles.cardsGrid : undefined}>
            {payments.map((p) => (
              <View key={p.id} style={isWide ? { flex: 1, minWidth: 300, maxWidth: '50%' } : undefined}>
                <PaymentRow p={p} isTable={false} theme={theme} />
              </View>
            ))}
          </View>
        )}

        {/* ── Paginación ── */}
        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageBtn, { borderColor: page === 1 ? theme.borderSoft : theme.primary }]}
              onPress={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <Ionicons name="chevron-back" size={18} color={page === 1 ? theme.textMuted : theme.primary} />
            </TouchableOpacity>
            <Text style={[styles.pageInfo, { color: theme.textBody }]}>{page} / {totalPages}</Text>
            <TouchableOpacity
              style={[styles.pageBtn, { borderColor: page === totalPages ? theme.borderSoft : theme.primary }]}
              onPress={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <Ionicons name="chevron-forward" size={18} color={page === totalPages ? theme.textMuted : theme.primary} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ── Estilos estáticos (sin referencias al tema) ──────────────────────────── */
const styles = StyleSheet.create({
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

const kpiStyles = StyleSheet.create({
  card:    { flex: 1, minWidth: 140, borderRadius: 14, borderWidth: 1, padding: 14, gap: 6 },
  iconBox: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  value:   { fontSize: 22, fontWeight: '900' },
  label:   { fontSize: 12, color: '#6b7280', fontWeight: '700' },
  sub:     { fontSize: 11, color: '#9ca3af' },
});

const badgeStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '800' },
});

const cardStyles = StyleSheet.create({
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

const chartStyles = StyleSheet.create({
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

const tableStyles = StyleSheet.create({
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
