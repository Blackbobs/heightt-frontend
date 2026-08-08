'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Receipt,
  Bell,
  ChevronDown,
  Building2,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DueItem {
  id: string;
  title: string;
  org: string;
  orgCategory: 'Computer Science' | 'Faculty of Computing' | 'Students Association' | 'Agriculture Students Association';
  amount: number;
  dueDate: string;
  status: 'outstanding' | 'pending' | 'paid';
  receiptNo?: string;
  paidDate?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  org: string;
  orgCategory: 'Computer Science' | 'Faculty of Computing' | 'Students Association' | 'Agriculture Students Association';
  date: string;
  unread: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'due' | 'announcement' | 'receipt';
  unread: boolean;
}

const ORG_OPTIONS = [
  { id: 'all', label: 'All Organizations' },
  { id: 'Computer Science', label: 'Computer Science' },
  { id: 'Faculty of Computing', label: 'Faculty of Computing' },
  { id: 'Students Association', label: 'Students Association' },
  { id: 'Agriculture Students Association', label: 'Agriculture Students Association' },
];

const INITIAL_DUES: DueItem[] = [
  {
    id: 'due-1',
    title: 'Departmental Dues',
    org: 'Computer Science Department',
    orgCategory: 'Computer Science',
    amount: 5000,
    dueDate: 'Dec 15, 2025',
    status: 'outstanding',
  },
  {
    id: 'due-2',
    title: 'Student Association Dues',
    org: 'Students Association',
    orgCategory: 'Students Association',
    amount: 2500,
    dueDate: 'Dec 20, 2025',
    status: 'outstanding',
  },
  {
    id: 'due-3',
    title: 'Faculty Technology Levy',
    org: 'Faculty of Computing',
    orgCategory: 'Faculty of Computing',
    amount: 3500,
    dueDate: 'Jan 10, 2026',
    status: 'pending',
  },
  {
    id: 'due-4',
    title: 'Annual Society Dues',
    org: 'Agriculture Students Association',
    orgCategory: 'Agriculture Students Association',
    amount: 1500,
    dueDate: 'Jan 15, 2026',
    status: 'pending',
  },
  {
    id: 'due-paid-1',
    title: 'Faculty Annual Dues 2024/25',
    org: 'Faculty of Computing',
    orgCategory: 'Faculty of Computing',
    amount: 15000,
    dueDate: 'Paid Oct 12, 2025',
    status: 'paid',
    receiptNo: 'HT-8920',
    paidDate: 'Oct 12, 2025',
  },
  {
    id: 'due-paid-2',
    title: 'SUG Election Registration Pass',
    org: 'Students Association',
    orgCategory: 'Students Association',
    amount: 2000,
    dueDate: 'Paid Nov 04, 2025',
    status: 'paid',
    receiptNo: 'HT-8919',
    paidDate: 'Nov 04, 2025',
  },
  {
    id: 'due-paid-3',
    title: 'Departmental Lab Access Fee',
    org: 'Computer Science Department',
    orgCategory: 'Computer Science',
    amount: 10000,
    dueDate: 'Paid Nov 18, 2025',
    status: 'paid',
    receiptNo: 'HT-8914',
    paidDate: 'Nov 18, 2025',
  },
];

const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Mid-semester Test Schedule Released',
    org: 'Computer Science Department',
    orgCategory: 'Computer Science',
    date: '2 hours ago',
    unread: true,
  },
  {
    id: 'ann-2',
    title: 'Annual Computing Exhibition & Hackathon Registration Open',
    org: 'Faculty of Computing',
    orgCategory: 'Faculty of Computing',
    date: 'Yesterday',
    unread: true,
  },
  {
    id: 'ann-3',
    title: 'Students Association General Congress & Welfare Update',
    org: 'Students Association',
    orgCategory: 'Students Association',
    date: '3 days ago',
    unread: false,
  },
  {
    id: 'ann-4',
    title: 'Agriculture Excursion & Practical Field Session Notice',
    org: 'Agriculture Students Association',
    orgCategory: 'Agriculture Students Association',
    date: '4 days ago',
    unread: false,
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Departmental Dues of ₦5,000 is due in 7 days',
    time: '10 mins ago',
    type: 'due',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Receipt #HT-8920 generated for Faculty Annual Dues',
    time: '1 hour ago',
    type: 'receipt',
    unread: true,
  },
  {
    id: 'notif-3',
    title: 'New Announcement: Mid-semester Test Schedule Released',
    time: '2 hours ago',
    type: 'announcement',
    unread: false,
  },
];

export function MainDashboardView() {
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<DueItem | null>(null);

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filtered dues based on selected org
  const filteredDues = useMemo(() => {
    if (selectedOrg === 'all') return INITIAL_DUES;
    return INITIAL_DUES.filter((d) => d.orgCategory === selectedOrg);
  }, [selectedOrg]);

  // Unpaid Dues (Outstanding & Pending)
  const pendingDues = useMemo(() => {
    return filteredDues.filter((d) => d.status === 'outstanding' || d.status === 'pending');
  }, [filteredDues]);

  // Paid Dues
  const paidDues = useMemo(() => {
    return filteredDues.filter((d) => d.status === 'paid');
  }, [filteredDues]);

  // Sums
  const totalPendingAmount = useMemo(() => {
    return pendingDues.reduce((sum, item) => sum + item.amount, 0);
  }, [pendingDues]);

  const totalPaidAmount = useMemo(() => {
    return paidDues.reduce((sum, item) => sum + item.amount, 0);
  }, [paidDues]);

  // Filtered announcements
  const filteredAnnouncements = useMemo(() => {
    if (selectedOrg === 'all') return INITIAL_ANNOUNCEMENTS;
    return INITIAL_ANNOUNCEMENTS.filter((a) => a.orgCategory === selectedOrg);
  }, [selectedOrg]);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* ===== TOP BAR: GREETING & ORG SELECTOR ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b1a33] tracking-tight truncate">
            {greeting}, <span className="text-[#1a5cff]">John</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6d89] mt-0.5 font-medium leading-normal">
            What do you need to pay or know right now?
          </p>
        </div>

        {/* Clean Organization Context Selector */}
        <div className="relative shrink-0 w-full md:w-auto min-w-[220px]">
          <label htmlFor="orgSelect" className="sr-only">
            Filter by Organization
          </label>
          <div className="relative flex items-center w-full">
            <Building2 className="w-4 h-4 text-[#1a5cff] absolute left-3.5 pointer-events-none shrink-0" />
            <select
              id="orgSelect"
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full appearance-none pl-9 pr-9 py-2.5 bg-[#f8faff] hover:bg-[#eef4ff] border border-slate-200 hover:border-[#1a5cff]/40 rounded-xl text-xs sm:text-sm font-semibold text-[#0b1a33] cursor-pointer transition-all outline-none focus:ring-4 focus:ring-[#1a5cff]/10 truncate"
            >
              {ORG_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none shrink-0" />
          </div>
        </div>
      </div>

      {/* ===== 3 KEY METRIC CARDS: DUES PAID, DUES PENDING, RECEIPTS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Dues Paid Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                Dues Paid
              </span>
              <span className="text-[0.68rem] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
                {paidDues.length} Paid
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1a33] tracking-tight mt-1 truncate">
              ₦{totalPaidAmount.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#5b6d89]">
            <span className="truncate">Completed dues</span>
            <Link href="/dashboard/receipts" className="text-[#1a5cff] font-semibold hover:underline no-underline shrink-0 ml-2">
              View receipts
            </Link>
          </div>
        </div>

        {/* Dues Pending Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                Dues Pending
              </span>
              <span className="text-[0.68rem] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full shrink-0">
                {pendingDues.length} Pending
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1a33] tracking-tight mt-1 truncate">
              ₦{totalPendingAmount.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#5b6d89]">
            <span className="truncate">Action required</span>
            <Link href="/dashboard/payments" className="text-[#1a5cff] font-semibold hover:underline no-underline shrink-0 ml-2">
              Pay now →
            </Link>
          </div>
        </div>

        {/* Receipts Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-w-0 sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 shrink-0">
                <Receipt className="w-4 h-4 text-[#1a5cff] shrink-0" />
                Receipts
              </span>
              <span className="text-[0.68rem] font-bold text-[#1a5cff] bg-[#eef4ff] border border-[#1a5cff]/20 px-2 py-0.5 rounded-full shrink-0">
                {paidDues.length} Generated
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b1a33] tracking-tight mt-1 truncate">
              {paidDues.length} Receipts
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#5b6d89]">
            <span className="truncate">Official proof</span>
            <Link href="/dashboard/receipts" className="text-[#1a5cff] font-semibold hover:underline no-underline shrink-0 ml-2">
              Download all
            </Link>
          </div>
        </div>
      </div>

      {/* ===== DUES PENDING / OUTSTANDING SECTION ===== */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-[#0b1a33] tracking-tight flex items-center gap-2 flex-wrap">
              <span>Dues Pending</span>
              {pendingDues.length > 0 && (
                <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  {pendingDues.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-[#5b6d89]">Payments required for your registered organizations</p>
          </div>
          <Link
            href="/dashboard/payments"
            className="text-xs font-semibold text-[#1a5cff] hover:underline no-underline shrink-0"
          >
            View all
          </Link>
        </div>

        <div className="space-y-2.5">
          {pendingDues.map((due) => (
            <div
              key={due.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#f8faff] hover:bg-[#eef4ff] border border-slate-200/70 transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#0b1a33] truncate max-w-full">{due.title}</span>
                  <span
                    className={cn(
                      'text-[0.65rem] font-semibold px-2 py-0.5 rounded-full shrink-0',
                      due.status === 'outstanding'
                        ? 'bg-red-50 text-red-600 border border-red-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    )}
                  >
                    {due.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#5b6d89] flex-wrap">
                  <span className="truncate">{due.org}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="shrink-0">Due {due.dueDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                <span className="text-sm font-extrabold text-[#0b1a33]">
                  ₦{due.amount.toLocaleString()}
                </span>
                <Link
                  href="/dashboard/payments"
                  className="py-1.5 px-4 rounded-lg bg-[#1a5cff] hover:bg-[#0f4ad0] text-white text-xs font-semibold no-underline transition-colors shadow-sm shrink-0"
                >
                  Pay Dues
                </Link>
              </div>
            </div>
          ))}

          {pendingDues.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <span>You have no pending dues for the selected organization!</span>
            </div>
          )}
        </div>

        {/* Total Summary Footer */}
        {pendingDues.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Total Pending ({pendingDues.length} items)
            </span>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-base font-extrabold text-[#0b1a33]">
                ₦{totalPendingAmount.toLocaleString()}
              </span>
              <Link
                href="/dashboard/payments"
                className="py-2 px-4 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white text-xs font-semibold no-underline transition-all shadow-sm flex items-center gap-1 shrink-0"
              >
                <span>Pay All Pending</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ===== DUES PAID & RECEIPTS SECTION ===== */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-[#0b1a33] tracking-tight flex items-center gap-2 flex-wrap">
              <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dues Paid & Receipts</span>
            </h2>
            <p className="text-xs text-[#5b6d89]">Verified payment records and official receipts</p>
          </div>
          <Link
            href="/dashboard/receipts"
            className="text-xs font-semibold text-[#1a5cff] hover:underline no-underline shrink-0"
          >
            View all receipts
          </Link>
        </div>

        <div className="space-y-2.5">
          {paidDues.map((due) => (
            <div
              key={due.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#f8faff] hover:bg-[#eef4ff] border border-slate-200/70 transition-all"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-[#0b1a33] truncate max-w-full">{due.title}</span>
                  <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    Paid
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#5b6d89] flex-wrap">
                  <span className="truncate">{due.org}</span>
                  <span>•</span>
                  <span className="shrink-0">{due.paidDate}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-600 shrink-0">Receipt #{due.receiptNo}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50">
                <span className="text-sm font-extrabold text-[#0b1a33]">
                  ₦{due.amount.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(due)}
                  className="py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1a5cff]" />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          ))}

          {paidDues.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No payment receipts found for this organization.
            </div>
          )}
        </div>
      </div>

      {/* ===== 2-COLUMN GRID: ANNOUNCEMENTS & NOTIFICATIONS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1a5cff] shrink-0" />
                <h2 className="text-base font-bold text-[#0b1a33] tracking-tight">Recent Announcements</h2>
              </div>
              <Link
                href="/dashboard/announcements"
                className="text-xs font-semibold text-[#1a5cff] hover:underline no-underline shrink-0"
              >
                All
              </Link>
            </div>

            <div className="space-y-3">
              {filteredAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-xl bg-[#f8faff] hover:bg-[#eef4ff] border border-slate-200/70 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#0b1a33] leading-snug">{ann.title}</span>
                    {ann.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#1a5cff] shrink-0 mt-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[0.72rem] text-[#5b6d89] mt-2">
                    <span className="font-medium text-[#1a5cff] truncate">{ann.org}</span>
                    <span className="shrink-0">{ann.date}</span>
                  </div>
                </div>
              ))}

              {filteredAnnouncements.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No announcements found for this organization.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1a5cff] shrink-0" />
                <h2 className="text-base font-bold text-[#0b1a33] tracking-tight">Recent Notifications</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                {INITIAL_NOTIFICATIONS.filter((n) => n.unread).length} unread
              </span>
            </div>

            <div className="space-y-3">
              {INITIAL_NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#f8faff] hover:bg-[#eef4ff] border border-slate-200/70 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {notif.type === 'due' && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                    {notif.type === 'announcement' && <Bell className="w-3.5 h-3.5 text-[#1a5cff]" />}
                    {notif.type === 'receipt' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0b1a33] leading-snug">{notif.title}</p>
                    <span className="text-[0.7rem] text-[#5b6d89]">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== RECEIPT DETAIL MODAL ===== */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#1a5cff]" />
                <h3 className="text-base font-bold text-[#0b1a33]">Payment Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#f8faff] p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold text-[#0b1a33]">#{selectedReceipt.receiptNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <span className="font-bold text-[#0b1a33]">{selectedReceipt.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organization:</span>
                <span className="font-semibold text-[#1a5cff]">{selectedReceipt.org}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-extrabold text-[#0b1a33]">₦{selectedReceipt.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date Paid:</span>
                <span className="font-medium text-slate-700">{selectedReceipt.paidDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">Verified Paid</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <Link
                href="/dashboard/receipts"
                className="flex-1 py-2.5 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-xs flex items-center justify-center gap-1.5 no-underline transition-colors shadow-sm"
              >
                <span>Full Receipt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
