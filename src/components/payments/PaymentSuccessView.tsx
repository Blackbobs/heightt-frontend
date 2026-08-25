"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ArrowLeft,
  Copy,
  Check,
  Receipt as ReceiptIcon,
  CreditCard,
  Building2,
  Calendar,
  Share2,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReceipts, useDownloadReceipt } from "@/hooks/queries/useReceipts";

interface PaymentSuccessViewProps {
  isEmbeddedInDashboard?: boolean;
}

type PaymentBreakdown = {
  organizationAmount: number;
  platformFee: number;
  subtotal: number;
};

const PAYMENT_BREAKDOWN_STORAGE_KEY = "heightt.paymentBreakdown";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function readPaymentBreakdown(): PaymentBreakdown | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(PAYMENT_BREAKDOWN_STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    if (
      typeof parsed.organizationAmount !== "number" ||
      typeof parsed.platformFee !== "number" ||
      typeof parsed.subtotal !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function PaymentSuccessView({
  isEmbeddedInDashboard = false,
}: PaymentSuccessViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract params from URL
  const reference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("tx_ref") ||
    "HT-" + Math.floor(10000000 + Math.random() * 90000000);
  
  const rawAmount = searchParams.get("amount");
  const parsedAmount = rawAmount ? parseFloat(rawAmount) : null;

  const dueName =
    searchParams.get("dueName") ||
    searchParams.get("due") ||
    searchParams.get("description") ||
    "Annual Departmental & Faculty Dues";

  const orgName =
    searchParams.get("org") ||
    searchParams.get("organization") ||
    "Student Union Executive Committee";

  const paymentMethod = searchParams.get("method") || "Debit Card (Paystack)";
  const receiptId = searchParams.get("receiptId");

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [paymentBreakdown, setPaymentBreakdown] =
    useState<PaymentBreakdown | null>(null);

  const downloadMutation = useDownloadReceipt();
  const { data: receipts } = useReceipts({ limit: 5 });

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setPaymentBreakdown(readPaymentBreakdown());
  }, []);

  // Try to find matching receipt from recent receipts if amount/ref match
  const matchedReceipt = receipts?.find(
    (r) =>
      r.id === receiptId ||
      r.reference === reference ||
      r.receiptNumber === reference
  );

  const displayAmount =
    parsedAmount !== null
      ? parsedAmount
      : matchedReceipt
      ? matchedReceipt.totalAmount || matchedReceipt.amount
      : 5000;

  const displayOrg = matchedReceipt?.organizationName || orgName;
  const displayTitle = matchedReceipt?.description || dueName;

  const handleCopyReference = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = async () => {
    const idToDownload = receiptId || matchedReceipt?.id;
    if (!idToDownload) {
      // Fallback: navigate to receipts list
      router.push("/dashboard/receipts");
      return;
    }

    setDownloading(true);
    try {
      const blob = await downloadMutation.mutateAsync(idToDownload);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download receipt:", err);
      // Fallback to receipts page
      router.push("/dashboard/receipts");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 sm:px-4 space-y-6 animate-fade-slide-up">
      {/* Success Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900/90 via-[#0a2f1d] to-[#081f14] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/20 text-center">
        {/* Decorative background glow orbs */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Sparkles Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
          <span>Payment Verified & Confirmed</span>
        </div>

        {/* Animated Checkmark Circle */}
        <div className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
          <div className="absolute inset-2 rounded-full bg-emerald-500/30 animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/50">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[2.5]" />
          </div>
        </div>

        {/* Title & Amount */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-emerald-200/80 text-sm max-w-md mx-auto mb-6">
          Your transaction was processed successfully. A payment confirmation
          has been generated for your record.
        </p>

        {/* Big Amount Highlight */}
        <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 max-w-xs mx-auto backdrop-blur-sm shadow-inner">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block mb-1">
            Total Amount Paid
          </span>
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-300">
            ₦{displayAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {paymentBreakdown && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/70">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Payment Breakdown
            </h2>
          </div>

          <div className="p-6 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 font-medium">
                Organization payment
              </span>
              <span className="font-bold text-slate-900">
                {formatNaira(paymentBreakdown.organizationAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 font-medium">
                Heightt platform fee
              </span>
              <span className="font-bold text-slate-900">
                {formatNaira(paymentBreakdown.platformFee)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-700">Subtotal</span>
              <span className="font-extrabold text-[#0b1a33]">
                {formatNaira(paymentBreakdown.subtotal)}
              </span>
            </div>
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700">
              A separate payment-processing fee may be added by Bachs.
            </p>
          </div>
        </div>
      )}

      {/* Payment Details Breakdown Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden divide-y divide-slate-100">
        <div className="px-6 py-4 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Transaction Details
            </h2>
          </div>
          <span className="text-[0.7rem] bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            COMPLETED
          </span>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {/* Reference Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium text-xs sm:text-sm">
              Transaction Reference
            </span>
            <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors">
              <span className="font-mono font-bold text-slate-800 text-xs sm:text-sm">
                {reference}
              </span>
              <button
                onClick={handleCopyReference}
                className="text-slate-500 hover:text-[#1a5cff] transition-colors border-none bg-transparent cursor-pointer p-0.5"
                title="Copy reference code"
                aria-label="Copy reference code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Dues Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5">
              <ReceiptIcon className="w-4 h-4 text-slate-400" />
              Purpose / Dues
            </span>
            <span className="font-semibold text-slate-900 text-right">
              {displayTitle}
            </span>
          </div>

          {/* Organization */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              Organization
            </span>
            <span className="font-semibold text-[#1a5cff] text-right">
              {displayOrg}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-slate-400" />
              Payment Channel
            </span>
            <span className="font-medium text-slate-800 text-right">
              {paymentMethod}
            </span>
          </div>

          {/* Timestamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Date & Time
            </span>
            <span className="font-medium text-slate-700 text-xs sm:text-sm text-right">
              {currentDate || "Just now"}
            </span>
          </div>
        </div>

        {/* Printable/Export footer links */}
        <div className="px-6 py-3 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Official Heightt Payment Receipt</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#1a5cff] font-medium border-none bg-transparent cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Summary
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2 print:hidden">
        <button
          onClick={handleDownloadReceipt}
          disabled={downloading}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-75 active:scale-[0.99]"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Preparing PDF Receipt...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Official Receipt (PDF)
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/receipts"
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-colors text-center no-underline flex items-center justify-center gap-2"
          >
            <ReceiptIcon className="w-4 h-4 text-[#1a5cff]" />
            View All Receipts
          </Link>

          <Link
            href="/dashboard/payments"
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-colors text-center no-underline flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Back to Dues
          </Link>
        </div>

        {!isEmbeddedInDashboard && (
          <div className="text-center pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1a5cff] font-medium no-underline"
            >
              <Home className="w-3.5 h-3.5" />
              Return to main dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
