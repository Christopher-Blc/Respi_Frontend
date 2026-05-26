import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../services/api';

export interface AdminPayment {
  id: number;
  reservation_id: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  payment_status: string;
  stripe_payment_intent_id?: string;
  stripe_refund_id?: string;
  refund_amount?: number;
  refund_date?: string;
  note?: string;
  reservation?: {
    id: number;
    reservation_date: string;
    start_time: string;
    end_time: string;
    total_price: string;
    user?: { id: number; name: string; surname: string; email: string; username: string };
    court?: { id: number; name: string };
  };
}

export type PaymentStatusFilter = 'all' | 'Pagado' | 'Reembolsado' | 'No pagado' | 'En proceso';

const PAGE_SIZE = 15;

export function useAdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('all');
  const [page, setPage] = useState(1);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<AdminPayment[]>('/payments');
      setPayments(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error al cargar pagos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return payments.filter((p) => {
      if (statusFilter !== 'all' && p.payment_status !== statusFilter) return false;
      if (!q) return true;
      const user = p.reservation?.user;
      const court = p.reservation?.court;
      return (
        String(p.id).includes(q) ||
        String(p.reservation_id).includes(q) ||
        (user?.name?.toLowerCase().includes(q) ?? false) ||
        (user?.surname?.toLowerCase().includes(q) ?? false) ||
        (user?.email?.toLowerCase().includes(q) ?? false) ||
        (user?.username?.toLowerCase().includes(q) ?? false) ||
        (court?.name?.toLowerCase().includes(q) ?? false) ||
        (p.stripe_payment_intent_id?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [payments, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.payment_status === 'Pagado');
    const refunded = payments.filter((p) => p.payment_status === 'Reembolsado');
    const pending = payments.filter((p) => p.payment_status === 'No pagado' || p.payment_status === 'En proceso');

    const totalRevenue = paid.reduce((s, p) => s + Number(p.amount), 0);
    const totalRefunded = refunded.reduce((s, p) => s + Number(p.refund_amount ?? p.amount), 0);

    const revenueByMonth: Record<string, number> = {};
    paid.forEach((p) => {
      const d = new Date(p.payment_date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      revenueByMonth[key] = (revenueByMonth[key] ?? 0) + Number(p.amount);
    });

    const methodCounts: Record<string, number> = {};
    paid.forEach((p) => {
      methodCounts[p.payment_method] = (methodCounts[p.payment_method] ?? 0) + 1;
    });

    return {
      totalRevenue,
      totalRefunded,
      countPaid: paid.length,
      countRefunded: refunded.length,
      countPending: pending.length,
      revenueByMonth,
      methodCounts,
    };
  }, [payments]);

  return {
    payments: paginated,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter: (f: PaymentStatusFilter) => { setStatusFilter(f); setPage(1); },
    page: safePage,
    totalPages,
    setPage,
    stats,
    refresh: fetchPayments,
    totalFiltered: filtered.length,
  };
}
