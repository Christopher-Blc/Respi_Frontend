/**
 * reportsService.ts
 *
 * RA2 — Informes avaluant i utilitzant eines gràfiques
 * Genera informes en PDF (reservas, usuaris, ingressos) usant expo-print.
 * expo-print converteix un document HTML a un fitxer PDF natiu.
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import i18next from 'i18next';
import { Platform } from 'react-native';
import api from '../api';
import { Reservation, User } from '../../types/types';

const t = (key: string) => i18next.t(key);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? '—' : `${num.toFixed(2)} €`;
}

function extractRows<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  const p = payload as { data?: unknown } | null;
  if (p && Array.isArray(p.data)) return p.data as T[];
  return [];
}

// ─── Theme ───────────────────────────────────────────────────────────────────

const ORANGE = '#CA8E0E';
const ORANGE_SOFT = 'rgba(202, 142, 14, 0.12)';
const ORANGE_BORDER = 'rgba(202, 142, 14, 0.35)';

// ─── HTML base styles ─────────────────────────────────────────────────────────

const BASE_CSS = `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; border-bottom: 3px solid ${ORANGE}; padding-bottom: 18px; }
    .header-left { display: flex; align-items: center; gap: 14px; }
    .header-logo { width: 52px; height: 52px; border-radius: 12px; object-fit: contain; }
    .header h1 { font-size: 24px; font-weight: 900; color: ${ORANGE}; }
    .header .meta { text-align: right; font-size: 11px; color: #666; line-height: 1.6; }
    .badge { display: inline-block; background: ${ORANGE_SOFT}; color: ${ORANGE}; border: 1px solid ${ORANGE_BORDER}; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
    .summary { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .summary-card { flex: 1; min-width: 130px; background: ${ORANGE_SOFT}; border: 1px solid ${ORANGE_BORDER}; border-radius: 12px; padding: 14px 18px; }
    .summary-card .value { font-size: 24px; font-weight: 900; color: ${ORANGE}; }
    .summary-card .label { font-size: 11px; color: #666; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    thead tr { background: ${ORANGE}; color: #fff; }
    thead th { padding: 10px 12px; text-align: left; font-weight: 700; font-size: 11px; letter-spacing: 0.3px; }
    tbody tr:nth-child(even) { background: ${ORANGE_SOFT}; }
    tbody tr:nth-child(odd) { background: #fff; }
    tbody td { padding: 9px 12px; border-bottom: 1px solid ${ORANGE_BORDER}; vertical-align: middle; }
    .status { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
    .status-CONFIRMADA, .status-active { background: #E8F5E9; color: #2E7D32; }
    .status-PENDIENTE { background: #FFF8E1; color: #E65100; }
    .status-CANCELADA, .status-inactive { background: #FFEBEE; color: #C62828; }
    .status-FINALIZADA { background: ${ORANGE_SOFT}; color: ${ORANGE}; }
    h3 { color: ${ORANGE}; }
    .footer { margin-top: 28px; border-top: 1px solid ${ORANGE_BORDER}; padding-top: 12px; font-size: 10px; color: #999; text-align: center; }
  </style>
`;

function pageWrapper(title: string, badge: string, body: string): string {
  const now = new Date().toLocaleString('es-ES');
  const logoUri = Platform.OS === 'web'
    ? `${window.location.origin}/assets/icon.png`
    : 'https://respi.es/icon.png';

  return `<!DOCTYPE html><html><head><meta charset="utf-8">${BASE_CSS}</head><body>
    <div class="header">
      <div class="header-left">
        <img class="header-logo" src="${logoUri}" alt="ResPi" onerror="this.style.display='none'" />
        <div>
          <div class="badge">${badge}</div>
          <h1>${title}</h1>
        </div>
      </div>
      <div class="meta">
        <div><strong>${t('adminReportsPdfAdminLabel')}</strong></div>
        <div>${t('adminReportsPdfGenerated')}: ${now}</div>
      </div>
    </div>
    ${body}
    <div class="footer">${t('adminReportsPdfFooter')} · ${now}</div>
  </body></html>`;
}

// ─── Report: Reservas ─────────────────────────────────────────────────────────

async function buildReservationsHtml(): Promise<string> {
  const res = await api.get('/reservations');
  const reservations: Reservation[] = extractRows(res.data);

  const total = reservations.length;
  const confirmed = reservations.filter((r) => r.status === 'CONFIRMADA').length;
  const pending = reservations.filter((r) => r.status === 'PENDIENTE').length;
  const cancelled = reservations.filter((r) => r.status === 'CANCELADA').length;
  const revenue = reservations
    .filter((r) => r.status !== 'CANCELADA')
    .reduce((acc, r) => acc + parseFloat(r.total_price || '0'), 0);

  const summary = `
    <div class="summary">
      <div class="summary-card"><div class="value">${total}</div><div class="label">${t('adminReportsPdfTotal')}</div></div>
      <div class="summary-card"><div class="value">${confirmed}</div><div class="label">${t('adminReportsPdfConfirmed')}</div></div>
      <div class="summary-card"><div class="value">${pending}</div><div class="label">${t('adminReportsPdfPending')}</div></div>
      <div class="summary-card"><div class="value">${cancelled}</div><div class="label">${t('adminReportsPdfCancelled')}</div></div>
      <div class="summary-card"><div class="value">${formatCurrency(revenue)}</div><div class="label">${t('adminReportsPdfRevenue')}</div></div>
    </div>`;

  const rows = reservations
    .map(
      (r) => `<tr>
        <td>${r.id}</td>
        <td>${r.user?.username ?? r.user_id}</td>
        <td>${r.court?.name ?? r.court_id}</td>
        <td>${formatDate(r.reservation_date)}</td>
        <td>${r.start_time?.slice(0, 5)} – ${r.end_time?.slice(0, 5)}</td>
        <td><span class="status status-${r.status}">${r.status}</span></td>
        <td>${formatCurrency(r.total_price)}</td>
      </tr>`,
    )
    .join('');

  const table = `<table>
    <thead><tr>
      <th>${t('adminReportsPdfColId')}</th>
      <th>${t('adminReportsPdfColUser')}</th>
      <th>${t('adminReportsPdfColCourt')}</th>
      <th>${t('adminReportsPdfColDate')}</th>
      <th>${t('adminReportsPdfColSchedule')}</th>
      <th>${t('adminReportsPdfColStatus')}</th>
      <th>${t('adminReportsPdfColAmount')}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;

  return pageWrapper(t('adminReportsBookingsLabel'), t('adminReportsBadgeBookings'), summary + table);
}

// ─── Report: Usuarios ─────────────────────────────────────────────────────────

async function buildUsersHtml(): Promise<string> {
  const res = await api.get('/users');
  const users: User[] = extractRows(res.data);

  const total = users.length;
  const active = users.filter((u) => u.is_active).length;
  const withMembership = users.filter((u) => u.membership_id).length;

  const summary = `
    <div class="summary">
      <div class="summary-card"><div class="value">${total}</div><div class="label">${t('adminReportsPdfTotalUsers')}</div></div>
      <div class="summary-card"><div class="value">${active}</div><div class="label">${t('adminReportsPdfActiveUsers')}</div></div>
      <div class="summary-card"><div class="value">${total - active}</div><div class="label">${t('adminReportsPdfInactiveUsers')}</div></div>
      <div class="summary-card"><div class="value">${withMembership}</div><div class="label">${t('adminReportsPdfWithMembership')}</div></div>
    </div>`;

  const rows = users
    .map(
      (u) => `<tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.name} ${u.surname}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td><span class="status ${u.is_active ? 'status-active' : 'status-inactive'}">${u.is_active ? t('adminReportsPdfActiveUser') : t('adminReportsPdfInactiveUser')}</span></td>
        <td>${u.membership?.name ?? '—'}</td>
        <td>${u.registration_date ? formatDate(u.registration_date) : '—'}</td>
      </tr>`,
    )
    .join('');

  const table = `<table>
    <thead><tr>
      <th>${t('adminReportsPdfColId')}</th>
      <th>${t('adminReportsPdfColUser')}</th>
      <th>${t('adminReportsPdfColName')}</th>
      <th>${t('adminReportsPdfColEmail')}</th>
      <th>${t('adminReportsPdfColRole')}</th>
      <th>${t('adminReportsPdfColActive')}</th>
      <th>${t('adminReportsPdfColMembership')}</th>
      <th>${t('adminReportsPdfColRegistration')}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;

  return pageWrapper(t('adminReportsUsersLabel'), t('adminReportsBadgeUsers'), summary + table);
}

// ─── Report: Ingressos ────────────────────────────────────────────────────────

async function buildRevenueHtml(): Promise<string> {
  const res = await api.get('/reservations');
  const reservations: Reservation[] = extractRows(res.data);

  const paid = reservations.filter((r) => r.status !== 'CANCELADA');
  const totalRevenue = paid.reduce((acc, r) => acc + parseFloat(r.total_price || '0'), 0);
  const avgRevenue = paid.length > 0 ? totalRevenue / paid.length : 0;

  const byMonth: Record<string, number> = {};
  paid.forEach((r) => {
    const month = r.reservation_date?.slice(0, 7) ?? t('adminReportsPdfUnknown');
    byMonth[month] = (byMonth[month] ?? 0) + parseFloat(r.total_price || '0');
  });

  const summary = `
    <div class="summary">
      <div class="summary-card"><div class="value">${formatCurrency(totalRevenue)}</div><div class="label">${t('adminReportsPdfTotalRevenue')}</div></div>
      <div class="summary-card"><div class="value">${paid.length}</div><div class="label">${t('adminReportsPdfPaidBookings')}</div></div>
      <div class="summary-card"><div class="value">${formatCurrency(avgRevenue)}</div><div class="label">${t('adminReportsPdfAvgTicket')}</div></div>
    </div>`;

  const monthRows = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([month, total]) => `<tr>
        <td>${month}</td>
        <td>${paid.filter((r) => r.reservation_date?.startsWith(month)).length}</td>
        <td>${formatCurrency(total)}</td>
      </tr>`,
    )
    .join('');

  const monthTable = `
    <h3 style="font-size:14px;font-weight:800;margin-bottom:12px;">${t('adminReportsPdfByMonth')}</h3>
    <table>
      <thead><tr>
        <th>${t('adminReportsPdfColMonth')}</th>
        <th>${t('adminReportsPdfColBookings')}</th>
        <th>${t('adminReportsPdfColTotal')}</th>
      </tr></thead>
      <tbody>${monthRows}</tbody>
    </table>`;

  const detailRows = paid
    .map(
      (r) => `<tr>
        <td>${r.id}</td>
        <td>${r.user?.username ?? r.user_id}</td>
        <td>${r.court?.name ?? r.court_id}</td>
        <td>${formatDate(r.reservation_date)}</td>
        <td><span class="status status-${r.status}">${r.status}</span></td>
        <td>${formatCurrency(r.total_price)}</td>
      </tr>`,
    )
    .join('');

  const detailTable = `
    <h3 style="font-size:14px;font-weight:800;margin:20px 0 12px;">${t('adminReportsPdfDetail')}</h3>
    <table>
      <thead><tr>
        <th>${t('adminReportsPdfColId')}</th>
        <th>${t('adminReportsPdfColUser')}</th>
        <th>${t('adminReportsPdfColCourt')}</th>
        <th>${t('adminReportsPdfColDate')}</th>
        <th>${t('adminReportsPdfColStatus')}</th>
        <th>${t('adminReportsPdfColAmount')}</th>
      </tr></thead>
      <tbody>${detailRows}</tbody>
    </table>`;

  return pageWrapper(t('adminReportsRevenueLabel'), t('adminReportsBadgeRevenue'), summary + monthTable + detailTable);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export type ReportType = 'reservations' | 'users' | 'revenue';

async function generateAndShare(html: string, filename: string): Promise<void> {
  // Web: abre una ventana nueva con el HTML del informe y dispara el print sobre ella
  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // fallback si el navegador bloquea popups
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace('.pdf', '.html');
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Espera a que el documento esté completamente renderizado antes de imprimir
    let printed = false;
    printWindow.onload = () => {
      printed = true;
      printWindow.print();
    };
    // Fallback por si onload no dispara (algunos browsers)
    setTimeout(() => {
      if (!printed && printWindow && !printWindow.closed) {
        printWindow.print();
      }
    }, 800);
    return;
  }

  // Mobile: genera fitxer PDF temporal i obre el diàleg natiu de compartir/descarregar
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `Descarregar ${filename}`,
    UTI: 'com.adobe.pdf',
  });
}

export async function generateReport(type: ReportType): Promise<void> {
  switch (type) {
    case 'reservations': {
      const html = await buildReservationsHtml();
      await generateAndShare(html, 'informe-reserves.pdf');
      break;
    }
    case 'users': {
      const html = await buildUsersHtml();
      await generateAndShare(html, 'informe-usuaris.pdf');
      break;
    }
    case 'revenue': {
      const html = await buildRevenueHtml();
      await generateAndShare(html, 'informe-ingressos.pdf');
      break;
    }
  }
}
