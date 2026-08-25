"use client";

import React, { useState, useMemo } from "react";
import {
  Receipt,
  Download,
  Search,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReceipts, useDownloadReceipt } from "@/hooks/queries/useReceipts";
import { Receipt as ReceiptType } from "@/lib/api/finance";

interface ReceiptItem {
  id: string;
  ref: string;
  title: string;
  org: string;
  amount: string;
  date: string;
  type: "payment" | "funding" | "ticket";
}

const TYPE_COLOR: Record<string, string> = {
  payment: "bg-[#fde8e8] text-[#c05a5a]",
  funding: "bg-[#e6f7f0] text-[#0f7b4a]",
  ticket: "bg-[#eef3ff] text-[#1a5cff]",
  default: "bg-[#f0f2f5] text-[#6b7a8f]",
};

const TYPE_LABELS: Record<string, string> = {
  payment: "Payment",
  funding: "Funding",
  ticket: "Ticket",
  default: "Receipt",
};

const TABS = ["All", "Payments", "Funding", "Tickets"];

export function ReceiptsPage() {
  const {
    data: receipts,
    isLoading,
    isError,
    error,
    refetch,
  } = useReceipts({ limit: 100 });
  const downloadMutation = useDownloadReceipt();
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Transform API data to receipt format
  const receiptItems = useMemo(() => {
    if (!receipts || receipts.length === 0) return [];

    return receipts.map((receipt: ReceiptType) => {
      // Determine type based on payment method or description
      let type: "payment" | "funding" | "ticket" = "payment";

      if (
        receipt.paymentMethod === "WALLET" ||
        receipt.description?.toLowerCase().includes("funding")
      ) {
        type = "funding";
      } else if (
        receipt.description?.toLowerCase().includes("ticket") ||
        receipt.description?.toLowerCase().includes("event")
      ) {
        type = "ticket";
      } else {
        type = "payment";
      }

      return {
        id: receipt.id,
        ref: receipt.receiptNumber || receipt.reference || "N/A",
        title: receipt.description || "Payment Receipt",
        org: receipt.organizationName || receipt.payerName || "Unknown",
        amount: `₦${(receipt.totalAmount || receipt.amount || 0).toLocaleString()}`,
        date: receipt.paymentDate
          ? new Date(receipt.paymentDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "N/A",
        type,
      };
    });
  }, [receipts]);

  // Calculate total paid
  const totalPaid = useMemo(() => {
    return (
      receipts?.reduce((sum, r) => sum + (r.totalAmount || r.amount || 0), 0) ||
      0
    );
  }, [receipts]);

  const filtered = useMemo(() => {
    return receiptItems.filter((r) => {
      const tabMap: Record<string, string> = {
        Payments: "payment",
        Funding: "funding",
        Tickets: "ticket",
      };
      const tabMatch = tab === "All" || r.type === tabMap[tab];
      const searchMatch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.ref.toLowerCase().includes(search.toLowerCase()) ||
        r.org.toLowerCase().includes(search.toLowerCase());
      return tabMatch && searchMatch;
    });
  }, [receiptItems, tab, search]);

  const handleDownload = async (id: string, ref: string) => {
    setDownloadingId(id);
    try {
      const blob = await downloadMutation.mutateAsync(id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${ref}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download receipt:", error);
      // You could show a toast notification here
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">
            Loading receipts...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
        <p className="font-semibold">Error loading receipts</p>
        <p className="text-sm">{error?.message || "Something went wrong"}</p>
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
      {/* Header stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-[#1a5cff]" />
            <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">
              Total Receipts
            </span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#1a1a2e]">
            {receiptItems.length}
          </p>
          <p className="text-[0.62rem] text-[#7a8ba3]">All time</p>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#0f7b4a]" />
            <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">
              Total Paid
            </span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#1a1a2e]">
            ₦{totalPaid.toLocaleString()}
          </p>
          <p className="text-[0.62rem] text-[#7a8ba3]">All time</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search receipts or reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8ecf1] rounded-[12px] pl-10 pr-4 py-3 text-[0.82rem] text-[#1a1a2e] placeholder-[#b0bac8] outline-none focus:border-[#1a5cff] transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-shrink-0 text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all",
              tab === t
                ? "bg-[#1a5cff] text-white"
                : "bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Receipt list */}
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">
              No receipts found
            </p>
          </div>
        )}
        {filtered.map((r) => {
          const isDownloading = downloadingId === r.id;
          const typeColor = TYPE_COLOR[r.type] || TYPE_COLOR.default;
          const typeLabel = TYPE_LABELS[r.type] || TYPE_LABELS.default;

          return (
            <div
              key={r.id}
              className="flex items-center gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-[10px] bg-[#eef3ff] flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#1a5cff]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">
                  {r.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "text-[0.55rem] font-semibold px-2 py-0.5 rounded-full",
                      typeColor,
                    )}
                  >
                    {typeLabel}
                  </span>
                  <span className="text-[0.58rem] text-[#7a8ba3]">
                    {r.ref} · {r.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[0.82rem] font-bold text-[#1a1a2e] flex-shrink-0">
                  {r.amount}
                </span>
                <button
                  className={cn(
                    "w-7 h-7 rounded-full bg-[#f0f2f5] flex items-center justify-center border-none transition-colors",
                    isDownloading
                      ? "cursor-wait opacity-50"
                      : "hover:bg-[#eef3ff] hover:text-[#1a5cff] cursor-pointer",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDownloading) {
                      handleDownload(r.id, r.ref);
                    }
                  }}
                  disabled={isDownloading}
                  aria-label={`Download receipt ${r.ref}`}
                >
                  {isDownloading ? (
                    <Loader2 className="w-3 h-3 text-[#1a5cff] animate-spin" />
                  ) : (
                    <Download className="w-3 h-3 text-[#6b7a8f]" />
                  )}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-[#c8d0db] group-hover:text-[#6b7a8f] transition-colors flex-shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
