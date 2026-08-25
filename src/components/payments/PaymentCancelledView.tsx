"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentCancelledViewProps {
  isEmbeddedInDashboard?: boolean;
}

export function PaymentCancelledView({
  isEmbeddedInDashboard = false,
}: PaymentCancelledViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const handleCopyReference = () => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const retryUrl = dueId
    ? `/dashboard/payments?dueId=${dueId}`
    : "/dashboard/payments";

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
            href="mailto:support@heightt.edu"
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
