'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Receipt,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { koboToNaira } from '@/lib/utils';
import { useDashboardData } from '@/hooks/queries/useDashboard';
import { DueAssignment } from '@/lib/api/finance';
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
    if (!user) return 'Stephen';
    const firstName = user.profile?.firstName;
    return firstName || user.username || user.email?.split('@')[0] || 'Stephen';
  }, [data?.user]);

  const academicInfo = useMemo(() => {
    const student = data?.user?.studentProfile;
    const level = student?.currentAcademicLevel?.name || '300 Level';
    return `Computer Science • ${level} • 2026/2027 Session`;
  }, [data?.user]);

  const dues = useMemo(() => data?.dues || [], [data?.dues]);

  const pendingDues = useMemo(() => dues.filter((d: DueAssignment) => !d.isPaid), [dues]);
  const paidDues = useMemo(() => dues.filter((d: DueAssignment) => d.isPaid), [dues]);

  const totalPending = useMemo(
    () => pendingDues.reduce((sum: number, item: DueAssignment) => sum + item.amount, 0),
    [pendingDues]
  );

  const totalPaid = useMemo(
    () => paidDues.reduce((sum: number, item: DueAssignment) => sum + item.amount, 0),
    [paidDues]
  );

  const urgentDue = pendingDues[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <HeighttLoader label="Loading student dashboard..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-600 dark:text-red-300">
        <p className="font-semibold text-sm">Unable to load dashboard</p>
        <p className="text-xs mt-1">{error?.message || 'Check connection and try again'}</p>
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
      
      {/* ── GREETING & ACADEMIC SUBTEXT ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-[#131B2E] sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#0B1020] dark:text-white tracking-tight">
          {greeting}, <span className="text-[#2563EB]">{studentName}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">
          {academicInfo}
        </p>
      </div>

      {/* ── FINANCIAL OVERVIEW CARDS (3-Grid, Clean, Minimalist) ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Outstanding Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#131B2E] sm:p-5">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span>Outstanding</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B1020] dark:text-white font-mono">
              ₦{koboToNaira(totalPending).toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {pendingDues.length} {pendingDues.length === 1 ? 'due remaining' : 'dues remaining'}
          </div>
        </div>

        {/* Paid This Session Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#131B2E] sm:p-5">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span>Paid this session</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B1020] dark:text-white font-mono">
              ₦{koboToNaira(totalPaid).toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {paidDues.length} completed payments
          </div>
        </div>

        {/* Receipts Available Card */}
        <div className="col-span-2 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#131B2E] sm:col-span-1 sm:p-5">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span>Verified Receipts</span>
              <Receipt className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="text-2xl font-extrabold text-[#0B1020] dark:text-white font-mono">
              {paidDues.length}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Official proof</span>
            <Link href="/dashboard/receipts" className="text-[#2563EB] font-semibold hover:underline">
              View receipts →
            </Link>
          </div>
        </div>
      </div>

      {/* ── NEEDS YOUR ATTENTION SECTION ── */}
      {urgentDue && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                Needs your attention
              </span>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                {urgentDue.due?.name || 'Departmental Due'}
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-400">
                Amount: ₦{koboToNaira(urgentDue.amount).toLocaleString()} • {urgentDue.due?.organization?.name || 'Department'}
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/payments?dueId=${urgentDue.id}`}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-md text-xs transition-colors self-start sm:self-center whitespace-nowrap"
          >
            Pay now
          </Link>
        </div>
      )}

      {/* ── YOUR DUES (COMPACT STRUCTURED ROWS) ── */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <h2 className="text-base font-bold text-[#0B1020] dark:text-white">Your Dues</h2>
          <Link href="/dashboard/payments" className="text-xs font-semibold text-[#2563EB] hover:underline">
            View all dues →
          </Link>
        </div>

        <div className="space-y-3">
          {dues.length > 0 ? (
            dues.map((due: DueAssignment) => (
              <div
                key={due.id}
                className="bg-[#F8FAFC] dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0B1020] dark:text-white">
                      {due.due?.name || 'Due Item'}
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
                    {due.due?.organization?.name || 'Organization'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                  <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">
                    ₦{koboToNaira(due.amount).toLocaleString()}
                  </span>
                  {due.isPaid ? (
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(due)}
                      className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      View receipt
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/payments?dueId=${due.id}`}
                      className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded transition-colors"
                    >
                      Pay now
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No dues assigned for this academic session yet.
            </div>
          )}
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-[#0B1020] dark:text-white mb-3">Recent Activity</h2>
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          {paidDues.length > 0 ? (
            paidDues.slice(0, 3).map((item: DueAssignment) => (
              <div key={item.id} className="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 flex justify-between">
                <span>Payment successful for {item.due?.name || 'Due'}</span>
                <span className="font-mono text-slate-400">{item.paidAt ? new Date(item.paidAt).toLocaleDateString() : 'Recent'}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-400 text-xs py-2">No recent payment activity recorded.</div>
          )}
        </div>
      </div>

      {/* ── RECEIPT MODAL ── */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131B2E] rounded-xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="font-bold text-sm text-[#0B1020] dark:text-white">Receipt Details</span>
              <button type="button" onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300 font-mono">
              <div className="flex justify-between"><span>Due:</span><span className="font-bold text-slate-900 dark:text-white">{selectedReceipt.due?.name}</span></div>
              <div className="flex justify-between"><span>Amount:</span><span className="font-bold text-slate-900 dark:text-white">₦{koboToNaira(selectedReceipt.amount).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-bold text-emerald-600">✓ Verified Paid</span></div>
            </div>
            <div className="pt-2 flex gap-2">
              <button type="button" onClick={() => setSelectedReceipt(null)} className="flex-1 py-2 border border-slate-200 dark:border-slate-800 text-xs font-semibold rounded">Close</button>
              <Link href="/dashboard/receipts" className="flex-1 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded text-center">Full Receipt</Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
