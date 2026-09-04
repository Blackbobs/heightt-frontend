'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  X,
  Building2,
  ShieldCheck,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { cn, koboToNaira } from '@/lib/utils';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  useMyDues,
  useMakePayment,
  usePaymentHistory,
} from '@/hooks/queries/usePayments';
import {
  DueAssignment,
  PaymentHistoryRecord,
  groupStudentDues,
  normalisePaymentConflict,
} from '@/lib/api/finance';
import { HeighttLoader } from '@/components/ui/HeighttLoader';
import { toast } from 'sonner';

type Tab = 'all' | 'unpaid' | 'paid';

function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function PaymentsPage() {
  const searchParams = useSearchParams();
  const highlightDueId = searchParams.get('dueId');
  const paymentStatus = searchParams.get('status');

  const { data: dues, isLoading, isError, error, refetch } = useMyDues();
  const makePayment = useMakePayment();
  const { data: paymentHistory, refetch: refetchPaymentHistory } =
    usePaymentHistory({ page: 1, limit: 20 });

  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selectedDue, setSelectedDue] = useState<DueAssignment | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const paymentInitiationLock = useRef(false);

  useEffect(() => {
    if (paymentStatus === 'success') {
      setStatusBanner(
        'Payment initiated successfully. Your official receipt will appear shortly.'
      );
    } else if (paymentStatus === 'cancelled') {
      setStatusBanner('Payment was cancelled.');
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (highlightDueId && dues?.length) {
      const due = dues.find(
        (d) => d.id === highlightDueId || d.dueId === highlightDueId
      );
      if (due && !due.isPaid && due.canPay) setSelectedDue(due);
    }
  }, [highlightDueId, dues]);

  const filtered = useMemo(() => {
    if (!dues) return [];
    return dues.filter((d) => {
      const tabMatch =
        tab === 'all' ||
        (tab === 'unpaid' && !d.isPaid) ||
        (tab === 'paid' && d.isPaid);
      const q = debouncedSearch.toLowerCase();
      const searchMatch =
        !q ||
        d.due?.name?.toLowerCase().includes(q) ||
        d.due?.organization?.name?.toLowerCase().includes(q);
      return tabMatch && searchMatch;
    });
  }, [dues, tab, debouncedSearch]);

  const groupedDues = useMemo(() => groupStudentDues(filtered), [filtered]);

  const stats = useMemo(() => {
    if (!dues) return { unpaidCount: 0, unpaidTotal: 0, paidTotal: 0 };
    const unpaid = dues.filter((d) => !d.isPaid);
    const paid = dues.filter((d) => d.isPaid);
    return {
      unpaidCount: unpaid.length,
      unpaidTotal: unpaid.reduce((sum, d) => sum + (d.amount || 0), 0),
      paidTotal: paid.reduce((sum, d) => sum + (d.amount || 0), 0),
    };
  }, [dues]);

  const handlePay = async (due: DueAssignment) => {
    if (
      due.isPaid ||
      !due.canPay ||
      paymentInitiationLock.current ||
      payingId
    ) {
      return;
    }

    if (!due.due?.organizationId) {
      toast.error('Organization information is missing for this due.');
      return;
    }

    paymentInitiationLock.current = true;
    setPayingId(due.id);
    const dueIdParam = due.due?.id || due.dueId || due.id;

    try {
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://www.heightt.app';

      const paymentInput = due.isAutoAssigned
        ? { dueId: due.dueId }
        : { dueAssignmentId: due.id };
      const payload = {
        amount: due.amount,
        organizationId: due.due.organization.id,
        paymentMethod: 'CARD' as const,
        ...paymentInput,
        description: `Payment for ${due.due?.name || 'Student Due'}`,
        successUrl: `${origin}/payment/callback`,
        cancelUrl: `${origin}/payment/cancelled`,
      };

      const response = await makePayment.mutateAsync(payload);
      const { checkoutUrl, pendingPaymentId } = response.data;

      sessionStorage.setItem(
        'heightt.pendingPayment',
        JSON.stringify({ pendingPaymentId, dueId: dueIdParam, dueAssignmentId: due.id, startedAt: Date.now() })
      );
      sessionStorage.setItem(
        `heightt:due-payment:${due.id}`,
        pendingPaymentId
      );
      window.location.assign(checkoutUrl);
    } catch (err: unknown) {
      const response = (err as {
        response?: { status?: number; data?: Record<string, unknown> };
      })?.response;
      const responseData = response?.data;
      const message =
        (typeof responseData?.message === 'string' && responseData.message) ||
        'Failed to initiate payment. Please try again.';

      if (response?.status === 400 && message === 'This due has already been paid') {
        setSelectedDue(null);
        setStatusBanner('This due has already been paid. Your records have been refreshed.');
        await Promise.all([refetch(), refetchPaymentHistory()]);
      } else {
        const conflict = normalisePaymentConflict(err);
        if (conflict?.pendingPaymentId) {
          sessionStorage.setItem(
            'heightt.pendingPayment',
            JSON.stringify({ pendingPaymentId: conflict.pendingPaymentId, dueId: dueIdParam, dueAssignmentId: due.id, startedAt: Date.now() })
          );
          window.location.assign(`/payment/callback?payment=${encodeURIComponent(conflict.pendingPaymentId)}`);
          return;
        }
        if (conflict) {
          setSelectedDue(null);
          setStatusBanner('The previous payment attempt has been refreshed. You can try again.');
          await refetch();
        } else {
          toast.error('Payment failed. Please try again.');
        }
      }
    } finally {
      paymentInitiationLock.current = false;
      setPayingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <HeighttLoader label="Loading your assigned dues..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-600 dark:text-red-300">
        <p className="font-bold text-sm">Error loading dues</p>
        <p className="text-xs mt-1">Check your connection and try again.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Banner */}
      {statusBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between">
          <span>{statusBanner}</span>
          <button type="button" onClick={() => setStatusBanner(null)} className="text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1020] dark:text-white">Your Dues</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage assigned departmental, faculty, and level dues
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#131B2E] p-1 border border-slate-200 dark:border-slate-800 rounded-lg">
          {(
            [
              { key: 'all', label: 'All Dues' },
              { key: 'unpaid', label: 'Unpaid' },
              { key: 'paid', label: 'Paid' },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded transition-colors',
                tab === key
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B1020] dark:hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search dues by title or organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-[#0B1020] dark:text-white placeholder:text-slate-400 outline-none focus:border-[#2563EB]"
        />
      </div>

      {/* Dues List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          No dues found matching your selection.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((due) => {
            const isPaying = payingId === due.id;
            return (
              <div
                key={due.id}
                className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0B1020] dark:text-white">
                      {due.due.name}
                    </span>
                    {due.isPaid ? (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        ✓ Paid
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Payment Due
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {due.due.organization.name}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">
                    {formatNaira(koboToNaira(due.amount))}
                  </span>

                  {due.isPaid ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                    </span>
                  ) : due.canPay ? (
                    <button
                      type="button"
                      onClick={() => setSelectedDue(due)}
                      disabled={isPaying}
                      className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded transition-colors"
                    >
                      {isPaying ? 'Processing...' : 'Pay now'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold">
                      Payment closed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pay Confirmation Modal */}
      {selectedDue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131B2E] rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#0B1020] dark:text-white">
                Payment Breakdown
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDue(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono bg-[#F8FAFC] dark:bg-[#0B1020] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Due Item</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedDue.due?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Organization</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedDue.due?.organization?.name}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Due Amount</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatNaira(koboToNaira(selectedDue.amount))}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDue(null)}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePay(selectedDue);
                  setSelectedDue(null);
                }}
                className="flex-1 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded text-center"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
