"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Receipt,
  Download,
  Search,
  CheckCircle2,
  FileText,
  Loader2,
  X,
  Shield,
  Building2,
  CreditCard,
  Printer,
  ArrowDownToLine,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HEIGHTT_LOGO_URL } from "@/lib/assets";
import { useReceipts, useDownloadReceipt } from "@/hooks/queries/useReceipts";
import { Receipt as ReceiptType } from "@/lib/api/finance";
import { generateReceiptPdf } from "@/lib/pdf/generateReceiptPdf";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

interface ReceiptItem {
  id: string;
  ref: string;
  title: string;
  org: string;
  amount: number;
  amountFormatted: string;
  date: string;
  rawDate: string;
  type: "payment" | "funding" | "ticket";
  payerName?: string;
  payerEmail?: string;
  paymentMethod?: string;
  status: "verified";
}

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  payment: { label: "Payment", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  funding:  { label: "Funding", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  ticket:   { label: "Ticket",  bg: "bg-violet-50",  text: "text-violet-700",  dot: "bg-violet-500"  },
};

const TABS = ["All", "Dues", "Funding", "Tickets"];

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

/* ─── Realistic Paper Receipt Modal ──────────────────────────── */
function ReceiptModal({
  receipt,
  onClose,
  onDownload,
  isDownloading,
}: {
  receipt: ReceiptItem;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Paper Receipt Container */}
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-200/80">
          {/* Top Perforation Pattern */}
          <div
            className="w-full h-3.5 bg-[#F8FAFC]"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 0%, #F8FAFC 7px, white 7px)",
              backgroundSize: "18px 14px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center top",
            }}
          />

          {/* Receipt Body */}
          <div className="px-7 pt-1 pb-0">
            {/* Header: Heightt Logo + Verified Status */}
            <div className="flex items-start justify-between mb-4 pt-1">
              <div>
                <Image
                  src={HEIGHTT_LOGO_URL}
                  alt="Heightt"
                  width={110}
                  height={32}
                  className="h-8 w-auto object-contain"
                  priority
                />
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                  Official Payment Receipt
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  VERIFIED
                </div>
              </div>
            </div>

            {/* Dashed Divider */}
            <div className="border-t-2 border-dashed border-slate-200 my-3.5" />

            {/* Receipt number & date */}
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Receipt No.
                </p>
                <p className="text-xs font-mono font-bold text-foreground">
                  {receipt.ref}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                  Date
                </p>
                <p className="text-xs font-semibold text-foreground">
                  {receipt.date}
                </p>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-3.5">
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">
                Payment For
              </p>
              <p className="text-sm font-bold text-foreground leading-snug">
                {receipt.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-primary" />
                {receipt.org}
              </p>
            </div>

            {/* 4-Cell Detail Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">
                  Payer
                </p>
                <p className="text-[11px] font-semibold text-foreground truncate">
                  {receipt.payerName || "Student Account"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">
                  Method
                </p>
                <p className="text-[11px] font-semibold text-foreground capitalize flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-primary" />
                  {receipt.paymentMethod || "Online Transfer"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">
                  Category
                </p>
                <p className="text-[11px] font-semibold text-foreground capitalize">
                  {receipt.type}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">
                  Clearance
                </p>
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Cleared
                </p>
              </div>
            </div>

            {/* Total Amount & Official Stamp */}
            <div className="border-t-2 border-dashed border-slate-200 pt-3.5 mb-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                    Total Amount Paid
                  </p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-0.5 font-display">
                    {receipt.amountFormatted}
                  </p>
                </div>
                {/* Official PAID Stamp */}
                <div className="w-14 h-14 rounded-full border-2 border-emerald-500/70 flex items-center justify-center rotate-[-12deg] bg-emerald-50/50 shadow-sm">
                  <div className="text-center">
                    <p className="text-[8px] font-extrabold text-emerald-700 uppercase leading-none">
                      PAID
                    </p>
                    <Shield className="w-3.5 h-3.5 text-emerald-600 mx-auto mt-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Official Digital Clearance Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-emerald-900 leading-tight">
                  Official Departmental &amp; Faculty Clearance
                </p>
                <p className="text-[9px] text-emerald-700/80 leading-tight mt-0.5">
                  Recorded directly to the organisation's verified ledger.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Perforation Pattern */}
          <div
            className="w-full h-3.5 bg-[#F8FAFC]"
            style={{
              backgroundImage: "radial-gradient(circle at 50% 100%, #F8FAFC 7px, white 7px)",
              backgroundSize: "18px 14px",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center bottom",
            }}
          />

          {/* Action Buttons */}
          <div className="px-7 pt-2 pb-5 flex gap-2.5">
            <button
              onClick={onDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-primary/25"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowDownToLine className="w-3.5 h-3.5" />
              )}
              {isDownloading ? "Generating PDF..." : "Download Official PDF"}
            </button>
            <button
              onClick={() => window.print()}
              title="Print Receipt"
              className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-muted-foreground hover:bg-slate-200 hover:text-foreground transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */
export function ReceiptsPage() {
  const { data: receipts, isLoading, isError, error, refetch } = useReceipts({ limit: 100 });
  const downloadMutation = useDownloadReceipt();

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const receiptItems = useMemo<ReceiptItem[]>(() => {
    if (!receipts || receipts.length === 0) return [];
    return receipts.map((r: ReceiptType) => {
      let type: "payment" | "funding" | "ticket" = "payment";
      if (r.paymentMethod === "WALLET" || r.description?.toLowerCase().includes("funding")) type = "funding";
      else if (r.description?.toLowerCase().includes("ticket") || r.description?.toLowerCase().includes("event")) type = "ticket";

      const amount = (r.totalAmount ?? r.amount ?? 0) / 100;

      return {
        id: r.id,
        ref: r.receiptNumber || r.reference || `HT-${r.id.slice(0, 6).toUpperCase()}`,
        title: r.description || "Payment Receipt",
        org: r.organizationName || r.payerName || "Student Organisation",
        amount,
        amountFormatted: formatNaira(amount),
        date: r.paymentDate
          ? new Date(r.paymentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "N/A",
        rawDate: r.paymentDate || "",
        type,
        payerName: r.payerName,
        payerEmail: r.payerEmail,
        paymentMethod: r.paymentMethod,
        status: "verified",
      };
    });
  }, [receipts]);

  const totalPaid = useMemo(() =>
    (receipts?.reduce(
      (sum: number, r: ReceiptType) => sum + (r.totalAmount ?? r.amount ?? 0),
      0
    ) ?? 0) / 100,
    [receipts]
  );

  const filtered = useMemo(() => {
    const tabMap: Record<string, string> = { Dues: "payment", Funding: "funding", Tickets: "ticket" };
    return receiptItems.filter((r) => {
      const tabMatch = tab === "All" || r.type === tabMap[tab];
      const searchMatch =
        !debouncedSearch ||
        r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.ref.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.org.toLowerCase().includes(debouncedSearch.toLowerCase());
      return tabMatch && searchMatch;
    });
  }, [receiptItems, tab, debouncedSearch]);

  const handleDownload = async (receipt: ReceiptItem) => {
    setDownloadingId(receipt.id);
    try {
      // First attempt: Try backend-generated PDF
      const blob = await downloadMutation.mutateAsync(receipt.id);
      if (blob && blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Heightt-Receipt-${receipt.ref}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return;
      }
      throw new Error("Fallback to client PDF generator");
    } catch {
      // High-resolution client-side redesigned PDF generator
      await generateReceiptPdf({
        ref: receipt.ref,
        title: receipt.title,
        org: receipt.org,
        amount: receipt.amount,
        amountFormatted: receipt.amountFormatted,
        date: receipt.date,
        payerName: receipt.payerName,
        payerEmail: receipt.payerEmail,
        paymentMethod: receipt.paymentMethod,
        status: "VERIFIED",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <HeighttLoader label="Loading receipts" />
          <span className="text-sm text-muted-foreground font-medium">Loading receipts...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
        <p className="font-semibold">Error loading receipts</p>
        <p className="text-sm">Something went wrong. Please try again.</p>
        <button onClick={() => refetch()} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onDownload={() => handleDownload(selectedReceipt)}
          isDownloading={downloadingId === selectedReceipt.id}
        />
      )}

      <div className="space-y-5 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-border rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wide">Total Receipts</span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{receiptItems.length}</p>
            <p className="text-[0.62rem] text-muted-foreground mt-0.5">All time</p>
          </div>
          <div className="bg-white border border-border rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-[0.65rem] font-semibold text-muted-foreground uppercase tracking-wide">Total Paid</span>
            </div>
            <p className="text-2xl font-extrabold text-foreground">{formatNaira(totalPaid)}</p>
            <p className="text-[0.62rem] text-muted-foreground mt-0.5">All time</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search receipts or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all cursor-pointer",
                tab === t
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-border text-muted-foreground hover:border-primary hover:text-primary"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Receipt list */}
        <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No receipts found</p>
              <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your search or filter</p>
            </div>
          )}
          {filtered.map((r) => {
            const cfg = TYPE_CONFIG[r.type] || TYPE_CONFIG.payment;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedReceipt(r)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer group"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4.5 h-4.5 text-primary" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1", cfg.bg, cfg.text)}>
                      <span className={cn("w-1 h-1 rounded-full", cfg.dot)} />
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{r.ref} · {r.date}</span>
                  </div>
                </div>

                {/* Amount + chevron */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-foreground">{r.amountFormatted}</span>
                  <button
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(r);
                    }}
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
