'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/hooks/queries/useTransactions';
import { Transaction } from '@/lib/api/finance';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

function formatAmount(amount: number, type: string) {
  const prefix = type === 'CREDIT' || type === 'REFUND' ? '+' : '-';
  return `${prefix}₦${Math.abs(amount).toLocaleString()}`;
}

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const { data, isLoading, isError, refetch } = useTransactions({
    page,
    limit: 20,
  });

  const transactions = data?.transactions || [];
  const meta = data?.meta;

  const filtered = useMemo(() => {
    if (!debouncedSearch) return transactions;
    const q = debouncedSearch.toLowerCase();
    return transactions.filter(
      (tx: Transaction) =>
        tx.reference?.toLowerCase().includes(q) ||
        tx.description?.toLowerCase().includes(q)
    );
  }, [transactions, debouncedSearch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <HeighttLoader label="Loading transaction history..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-600 dark:text-red-300">
        <p className="font-bold text-sm">Error loading transactions</p>
        <button type="button" onClick={() => refetch()} className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl font-bold text-[#0B1020] dark:text-white">Transaction History</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Banking-style log of all completed and pending payment activities
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by reference or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-[#0B1020] dark:text-white placeholder:text-slate-400 outline-none focus:border-[#2563EB]"
        />
      </div>

      {/* Transaction List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          No transactions found.
        </div>
      ) : (
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {filtered.map((tx: Transaction) => {
            const date = tx.completedAt || tx.createdAt;
            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0B1020] dark:text-white">
                      {tx.description || 'Campus Due Payment'}
                    </span>
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded border',
                        tx.status === 'COMPLETED'
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    Ref: {tx.reference} • {date ? new Date(date).toLocaleString() : 'Recent'}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">
                    {formatAmount(tx.netAmount, tx.type)}
                  </span>
                  <span className="text-xs font-semibold text-[#2563EB]">View details</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Banking-style Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#131B2E] rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm font-bold text-[#0B1020] dark:text-white">Transaction Detail</span>
              <button type="button" onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <div className="text-center py-3 bg-[#F8FAFC] dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Amount</span>
              <span className="text-3xl font-extrabold text-[#0B1020] dark:text-white font-mono">
                {formatAmount(selectedTx.netAmount, selectedTx.type)}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-emerald-600">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Reference</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTx.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Description</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTx.description || 'Due Payment'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
