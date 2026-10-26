'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle2, Receipt, WalletCards, X } from 'lucide-react';
import { koboToNaira } from '@/lib/utils';
import { useDashboardData } from '@/hooks/queries/useDashboard';
import type { DueAssignment } from '@/lib/api/finance';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

export function MainDashboardView() {
  const { data, isLoading, isError, error, refetch } = useDashboardData();
  const [selectedReceipt, setSelectedReceipt] = useState<DueAssignment | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const studentName = useMemo(() => {
    const user = data?.user;
    return user?.profile?.firstName || user?.username || user?.email?.split('@')[0] || 'there';
  }, [data?.user]);

  const academicInfo = useMemo(() => {
    const level = data?.user?.studentProfile?.currentAcademicLevel?.name;
    return level || 'Complete your academic profile';
  }, [data?.user]);

  const dues = useMemo(() => data?.dues || [], [data?.dues]);
  const pendingDues = useMemo(() => dues.filter((due: DueAssignment) => !due.isPaid), [dues]);
  const paidDues = useMemo(() => dues.filter((due: DueAssignment) => due.isPaid), [dues]);
  const totalPending = useMemo(() => pendingDues.reduce((sum, due) => sum + due.amount, 0), [pendingDues]);
  const totalPaid = useMemo(() => paidDues.reduce((sum, due) => sum + due.amount, 0), [paidDues]);
  const urgentDue = pendingDues[0];

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center"><HeighttLoader label="Loading student dashboard" /></div>;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <p className="text-sm font-semibold">Unable to load dashboard</p>
        <p className="mt-1 text-xs">{error?.message || 'Check your connection and try again.'}</p>
        <button type="button" onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white">Retry</button>
      </div>
    );
  }

  const metrics = [
    { label: 'Outstanding', value: `₦${koboToNaira(totalPending).toLocaleString()}`, detail: `${pendingDues.length} dues remaining`, icon: AlertCircle, tone: 'text-amber-600' },
    { label: 'Paid this session', value: `₦${koboToNaira(totalPaid).toLocaleString()}`, detail: `${paidDues.length} completed payments`, icon: CheckCircle2, tone: 'text-emerald-600' },
    { label: 'Verified receipts', value: paidDues.length.toString(), detail: 'Available anytime', icon: Receipt, tone: 'text-[#2563EB]' },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h1 className="text-xl font-bold text-[#0B1020] dark:text-white sm:text-2xl">{greeting}, {studentName}</h1><p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{academicInfo} · Payment overview</p></div>
        <Link href="/dashboard/payments" aria-label="View payments" className="inline-flex h-10 flex-shrink-0 items-center gap-2 rounded-lg bg-[#2563EB] px-3 text-xs font-semibold text-white hover:bg-[#1D4ED8] sm:px-4"><WalletCards className="size-4 sm:hidden" /><span className="hidden sm:inline">View payments</span><ArrowRight className="hidden size-4 sm:block" /></Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {metrics.map(({ label, value, detail, icon: Icon, tone }, index) => (
          <article key={label} className={`rounded-xl border border-slate-200 bg-white p-4 dark:border-[#30343A] dark:bg-[#191B1E] sm:p-5 ${index === 0 ? 'col-span-2 sm:col-span-1' : ''}`}>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400"><span>{label}</span><Icon className={`size-4 ${tone}`} /></div>
            <strong className="mt-4 block text-xl font-bold tracking-[-0.04em] text-[#0B1020] dark:text-white sm:mt-5 sm:text-2xl">{value}</strong>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <section className="order-2 rounded-xl border border-slate-200 bg-white dark:border-[#30343A] dark:bg-[#191B1E] xl:order-none">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#30343A]"><div><h2 className="font-semibold text-[#0B1020] dark:text-white">Your dues</h2><p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Assigned for this academic session</p></div><Link href="/dashboard/payments" className="text-xs font-semibold text-[#2563EB]">View all</Link></div>
          <div className="divide-y divide-slate-100 dark:divide-[#30343A]">
            {dues.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No dues assigned yet.</p>}
            {dues.map((due: DueAssignment) => (
              <div key={due.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3"><span className="grid size-9 flex-none place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-[#23262B] dark:text-slate-300"><WalletCards className="size-4" /></span><span className="min-w-0"><strong className="block truncate text-sm text-[#0B1020] dark:text-white">{due.due?.name || 'Due item'}</strong><small className="mt-0.5 block truncate text-xs text-slate-500">{due.due?.organization?.name || 'Organization'}</small></span></div>
                <div className="flex items-center justify-between gap-3 sm:justify-end"><strong className="text-sm text-[#0B1020] dark:text-white">₦{koboToNaira(due.amount).toLocaleString()}</strong>{due.isPaid ? <button type="button" onClick={() => setSelectedReceipt(due)} className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">Paid · Receipt</button> : <Link href={`/dashboard/payments?dueId=${due.id}`} className="rounded-md bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">Pay now</Link>}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="contents xl:block xl:space-y-5">
          {urgentDue && (
            <section className="order-1 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#30343A] dark:bg-[#191B1E] xl:order-none xl:p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-9 flex-none place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                  <AlertCircle className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold text-[#0B1020] dark:text-white">Payment needs attention</h2>
                  <p className="mt-1 truncate text-xs text-slate-600 dark:text-slate-300">
                    {urgentDue.due?.name || 'Due'} · ₦{koboToNaira(urgentDue.amount).toLocaleString()}
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/payments?dueId=${urgentDue.id}`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8] dark:text-blue-300 dark:hover:text-blue-200"
              >
                Review payment
                <ArrowRight className="size-3.5" />
              </Link>
            </section>
          )}
          <section className="order-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-[#30343A] dark:bg-[#191B1E] xl:order-none"><h2 className="text-sm font-semibold text-[#0B1020] dark:text-white">Recent activity</h2><div className="mt-3 divide-y divide-slate-100 dark:divide-[#30343A]">{paidDues.length === 0 ? <p className="py-3 text-xs text-slate-500">No recent payments.</p> : paidDues.slice(0, 3).map((due) => <div key={due.id} className="py-3"><p className="text-xs font-medium text-[#0B1020] dark:text-white">{due.due?.name || 'Payment completed'}</p><p className="mt-1 text-[11px] text-slate-500">{due.paidAt ? new Date(due.paidAt).toLocaleDateString() : 'Recent'}</p></div>)}</div></section>
        </div>
      </div>

      {selectedReceipt && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 dark:border-[#30343A] dark:bg-[#191B1E]"><div className="flex items-center justify-between"><h2 className="font-semibold text-[#0B1020] dark:text-white">Receipt details</h2><button type="button" onClick={() => setSelectedReceipt(null)} aria-label="Close receipt"><X className="size-4 text-slate-500" /></button></div><dl className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><dt className="text-slate-500">Due</dt><dd className="font-semibold text-[#0B1020] dark:text-white">{selectedReceipt.due?.name}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Amount</dt><dd className="font-semibold text-[#0B1020] dark:text-white">₦{koboToNaira(selectedReceipt.amount).toLocaleString()}</dd></div><div className="flex justify-between"><dt className="text-slate-500">Status</dt><dd className="font-semibold text-emerald-600">Verified paid</dd></div></dl><Link href="/dashboard/receipts" className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#2563EB] py-2.5 text-xs font-semibold text-white">Open full receipt</Link></div></div>}
    </div>
  );
}
