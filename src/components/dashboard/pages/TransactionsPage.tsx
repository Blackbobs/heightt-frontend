"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Loader2,
  RefreshCw,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { Transaction } from "@/lib/api/finance";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const TYPE_TABS = ["All", "CREDIT", "DEBIT", "TRANSFER", "FEE", "REFUND"];
const STATUS_TABS = ["All", "COMPLETED", "PENDING", "PROCESSING", "FAILED"];

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  CREDIT: {
    label: "Credit",
    icon: <ArrowDownLeft className="w-3.5 h-3.5" />,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
  },
  DEBIT: {
    label: "Debit",
    icon: <ArrowUpRight className="w-3.5 h-3.5" />,
    color: "text-red-600 bg-red-50 border-red-200/60",
  },
  TRANSFER: {
    label: "Transfer",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: "text-blue-600 bg-blue-50 border-blue-200/60",
  },
  FEE: {
    label: "Fee",
    icon: <ArrowUpRight className="w-3.5 h-3.5" />,
    color: "text-amber-600 bg-amber-50 border-amber-200/60",
  },
  REFUND: {
    label: "Refund",
    icon: <ArrowDownLeft className="w-3.5 h-3.5" />,
    color: "text-purple-600 bg-purple-50 border-purple-200/60",
  },
  REVERSAL: {
    label: "Reversal",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    color: "text-slate-600 bg-slate-50 border-slate-200/60",
  },
};

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: "text-emerald-700 bg-emerald-50",
  PENDING: "text-amber-700 bg-amber-50",
  PROCESSING: "text-blue-700 bg-blue-50",
  FAILED: "text-red-700 bg-red-50",
  CANCELLED: "text-slate-600 bg-slate-100",
};

function formatAmount(amount: number, type: string) {
  const prefix = type === "CREDIT" || type === "REFUND" ? "+" : "-";
  return `${prefix}₦${Math.abs(amount).toLocaleString()}`;
}

export function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useTransactions({
      page,
      limit: 20,
      type: typeFilter !== "All" ? typeFilter : undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    });

  const transactions = data?.transactions || [];
  const meta = data?.meta;

  const filtered = useMemo(() => {
    if (!debouncedSearch) return transactions;
    const q = debouncedSearch.toLowerCase();
    return transactions.filter(
      (tx: Transaction) =>
        tx.reference?.toLowerCase().includes(q) ||
        tx.description?.toLowerCase().includes(q),
    );
  }, [transactions, debouncedSearch]);

  const stats = useMemo(() => {
    const completed = transactions.filter((t) => t.status === "COMPLETED");
    const credits = completed
      .filter((t) => t.type === "CREDIT" || t.type === "REFUND")
      .reduce((sum, t) => sum + t.netAmount, 0);
    const debits = completed
      .filter((t) => t.type === "DEBIT" || t.type === "FEE")
      .reduce((sum, t) => sum + t.netAmount, 0);
    return { credits, debits, count: transactions.length };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">
            Loading transactions...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
        <p className="font-semibold">Error loading transactions</p>
        <p className="text-sm">Something went wrong. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#e8ecf1] rounded-[14px] p-3.5 text-center">
          <p className="text-[1.1rem] font-extrabold text-emerald-600">
            ₦{stats.credits.toLocaleString()}
          </p>
          <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 font-medium">
            Inflow
          </p>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[14px] p-3.5 text-center">
          <p className="text-[1.1rem] font-extrabold text-red-600">
            ₦{stats.debits.toLocaleString()}
          </p>
          <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 font-medium">
            Outflow
          </p>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[14px] p-3.5 text-center">
          <p className="text-[1.1rem] font-extrabold text-[#1a1a2e]">
            {meta?.total ?? stats.count}
          </p>
          <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 font-medium">
            Total
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search by reference or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8ecf1] rounded-[12px] pl-10 pr-4 py-3 text-[0.82rem] text-[#1a1a2e] placeholder-[#b0bac8] outline-none focus:border-[#1a5cff] transition-colors"
        />
      </div>

      {/* Type filters */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Filter className="w-3.5 h-3.5 text-[#7a8ba3]" />
          <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">
            Type
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {TYPE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTypeFilter(t);
                setPage(1);
              }}
              className={cn(
                "flex-shrink-0 text-[0.68rem] font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer transition-all",
                typeFilter === t
                  ? "bg-[#1a5cff] text-white"
                  : "bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]",
              )}
            >
              {t === "All" ? "All" : TYPE_CONFIG[t]?.label || t}
            </button>
          ))}
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={cn(
              "flex-shrink-0 text-[0.68rem] font-semibold px-3 py-1.5 rounded-full border-none cursor-pointer transition-all capitalize",
              statusFilter === s
                ? "bg-[#0b1a33] text-white"
                : "bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#0b1a33] hover:text-[#0b1a33]",
            )}
          >
            {s.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <RefreshCw className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">
              No transactions found
            </p>
            <p className="text-[0.65rem] text-[#7a8ba3] mt-1">
              Your payment history will appear here
            </p>
          </div>
        )}
        {filtered.map((tx: Transaction) => {
          const typeCfg = TYPE_CONFIG[tx.type] || TYPE_CONFIG.DEBIT;
          const statusColor =
            STATUS_COLOR[tx.status] || "text-slate-600 bg-slate-100";
          const date = tx.completedAt || tx.createdAt;

          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors"
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 border",
                  typeCfg.color,
                )}
              >
                {typeCfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">
                  {tx.description || typeCfg.label}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-[0.58rem] text-[#7a8ba3] font-mono">
                    {tx.reference}
                  </span>
                  <span className="text-[#c8d0db]">·</span>
                  <span className="text-[0.58rem] text-[#7a8ba3]">
                    {date
                      ? new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span
                  className={cn(
                    "text-[0.82rem] font-bold",
                    tx.type === "CREDIT" || tx.type === "REFUND"
                      ? "text-emerald-600"
                      : "text-[#1a1a2e]",
                  )}
                >
                  {formatAmount(tx.netAmount, tx.type)}
                </span>
                <span
                  className={cn(
                    "text-[0.55rem] font-semibold px-2 py-0.5 rounded-full capitalize",
                    statusColor,
                  )}
                >
                  {tx.status.toLowerCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isFetching}
            className="px-4 py-2 text-[0.78rem] font-semibold rounded-xl border border-[#e8ecf1] bg-white text-[#6b7a8f] disabled:opacity-40 cursor-pointer hover:border-[#1a5cff] hover:text-[#1a5cff] transition-colors"
          >
            Previous
          </button>
          <span className="text-[0.72rem] text-[#7a8ba3] font-medium">
            Page {page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= meta.totalPages || isFetching}
            className="px-4 py-2 text-[0.78rem] font-semibold rounded-xl border border-[#e8ecf1] bg-white text-[#6b7a8f] disabled:opacity-40 cursor-pointer hover:border-[#1a5cff] hover:text-[#1a5cff] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
