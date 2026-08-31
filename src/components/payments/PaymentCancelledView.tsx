"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  HelpCircle,
  ShieldAlert,
  Building2,
  CreditCard,
  ChevronRight,
  Home,
  MessageCircle,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { financeApi, PaymentStatusResult } from "@/lib/api/finance";
import { useAuthStore } from "@/store/auth-store";
import { SUPPORT_EMAIL } from "@/lib/seo";

interface PaymentCancelledViewProps {
  isEmbeddedInDashboard?: boolean;
}

const PENDING_PAYMENT_STORAGE_KEY = "heightt.pendingPayment";

function getStoredPendingPaymentId(): string | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(PENDING_PAYMENT_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored).pendingPaymentId ?? null;
  } catch {
    return null;
  }
}

function buildSuccessUrl(payment: PaymentStatusResult, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);
  params.set("reference", payment.reference);

  if (!params.has("amount")) {
    params.set("amount", String(payment.amount / 100));
  }
  if (payment.receiptId) {
    params.set("receiptId", payment.receiptId);
  }
  if (payment.receiptNumber) {
    params.set("receiptNumber", payment.receiptNumber);
  }

  return `/payment/success?${params.toString()}`;
}

export function PaymentCancelledView({
  isEmbeddedInDashboard = false,
}: PaymentCancelledViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const restoreSession = useAuthStore((state) => state.restoreSession);

  const dueId = searchParams.get("dueId");
  const dueName =
    searchParams.get("dueName") ||
    searchParams.get("due") ||
    searchParams.get("description") ||
    "Selected Due Payment";
  const orgName =
    searchParams.get("org") || searchParams.get("organization") || null;

  const rawAmount = searchParams.get("amount");
  const parsedAmount = rawAmount ? parseFloat(rawAmount) : null;
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || null;
  const reason =
    searchParams.get("reason") ||
    "Payment was cancelled or aborted before completion.";

  const [copied, setCopied] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    const pendingPaymentId =
      searchParams.get("payment") ||
      searchParams.get("pendingPaymentId") ||
      searchParams.get("pendingPayment") ||
      getStoredPendingPaymentId();

    if (!pendingPaymentId) return;
    const paymentId = pendingPaymentId;

    let cancelled = false;

    async function checkStatus() {
      setIsCheckingStatus(true);
      const authenticated = await restoreSession();

      if (!authenticated) {
        const returnTo = encodeURIComponent(
          `/payment/cancelled?${new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            payment: paymentId,
          }).toString()}`,
        );
        window.location.replace(`/signin?returnTo=${returnTo}`);
        return;
      }

      try {
        const payment =
          await financeApi.getPendingPaymentStatus(paymentId);

        if (cancelled) return;

        if (payment.status === "COMPLETED") {
          sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
          window.location.replace(
            buildSuccessUrl(
              payment,
              new URLSearchParams(searchParams.toString()),
            ),
          );
          return;
        }

        if (payment.status === "PROCESSING") {
          window.location.replace(
            `/payment/callback?payment=${encodeURIComponent(paymentId)}`,
          );
          return;
        }
      } catch (error) {
        console.warn("Could not verify cancelled payment status:", error);
      } finally {
        if (!cancelled) {
          setIsCheckingStatus(false);
        }
      }
    }

    void checkStatus();

    return () => {
      cancelled = true;
    };
  }, [restoreSession, searchParams]);

  const handleCopyReference = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const retryUrl = dueId
    ? `/dashboard/payments?dueId=${dueId}`
    : "/dashboard/payments";

  if (isCheckingStatus) {
    return (
      <div className="w-full max-w-md mx-auto py-16 px-4 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
          <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-[#0b1a33]">
          Checking payment status
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Please wait while we confirm whether this payment was completed.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 sm:px-4 space-y-6 animate-fade-slide-up">
      {/* Cancellation Hero Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-b from-amber-950/90 via-[#26180f] to-[#1a110a] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-500/20 text-center">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-md">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
          <span>Transaction Incomplete</span>
        </div>

        {/* Animated Cancel Icon */}
        <div className="relative mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse opacity-75" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white stroke-[2.2]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
          Payment Cancelled
        </h1>
        <p className="text-amber-200/80 text-sm max-w-md mx-auto">
          {reason}
        </p>

        {/* Reassurance Banner */}
        <div className="mt-6 bg-amber-950/60 border border-amber-500/20 rounded-2xl p-3.5 text-xs text-amber-200/90 flex items-center justify-center gap-2 max-w-md mx-auto">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>No charges were made to your bank account or card.</span>
        </div>
      </div>

      {/* Attempted Payment Info Card (if available) */}
      {(dueName || parsedAmount || reference) && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden divide-y divide-slate-100">
          <div className="px-6 py-3.5 bg-slate-50/70 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Attempted Transaction
            </h2>
            <span className="text-[0.7rem] bg-amber-100 text-amber-800 font-semibold px-2.5 py-0.5 rounded-full">
              CANCELLED
            </span>
          </div>

          <div className="p-6 space-y-3.5 text-sm">
            {dueName && (
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Due Item</span>
                <span className="font-semibold text-slate-800 text-right">
                  {dueName}
                </span>
              </div>
            )}

            {orgName && (
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Organization</span>
                <span className="font-medium text-[#1a5cff] text-right">
                  {orgName}
                </span>
              </div>
            )}

            {parsedAmount && (
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="font-extrabold text-slate-900">
                  ₦{parsedAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {reference && (
              <div className="flex justify-between items-center text-xs sm:text-sm pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Ref Code</span>
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <span className="font-mono text-xs font-semibold text-slate-700">
                    {reference}
                  </span>
                  <button
                    onClick={handleCopyReference}
                    className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Why might this happen? Troubleshooting Guide */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#1a5cff]" />
          Common reasons for cancelled payments
        </h3>

        <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
          <li>You clicked the back or exit button during checkout.</li>
          <li>The payment gateway window timed out due to inactivity.</li>
          <li>Your card authorization was declined by your bank issuer.</li>
          <li>Network connectivity was interrupted during processing.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Link
          href={retryUrl}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 no-underline cursor-pointer active:scale-[0.99]"
        >
          <RotateCcw className="w-4 h-4" />
          Try Payment Again
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard/payments"
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors text-center no-underline flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            All Dues
          </Link>

          <Link
            href={`mailto:${SUPPORT_EMAIL}`}
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors text-center no-underline flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-amber-600" />
            Get Help
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
