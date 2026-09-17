"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Gift, Loader2, Mail, ShieldCheck } from "lucide-react";
import {
  requestGuestClaimCode,
  verifyGuestClaimCode,
  getGuestPaymentError,
} from "@/lib/api/guest-payments";
import { invalidateFinanceCache } from "@/lib/api/invalidation";

export function GuestClaimCard() {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [claimed, setClaimed] = useState<{
    records: number;
    payments: number;
  } | null>(null);

  async function handleRequestCode() {
    if (sending) return;
    setSending(true);
    setMessage(null);
    try {
      const result = await requestGuestClaimCode();
      setCodeSent(true);
      setCode("");
      setMessage({
        type: "success",
        text:
          result?.message ||
          "If there are guest records for this email, a 6-digit claim code has been sent to your verified email.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: getGuestPaymentError(
          err,
          "We could not send a claim code. Please try again.",
        ),
      });
    } finally {
      setSending(false);
    }
  }

  async function handleVerify() {
    const cleanCode = code.replace(/\D/g, "");
    if (cleanCode.length !== 6) {
      setMessage({
        type: "error",
        text: "Enter the 6-digit code from your email.",
      });
      return;
    }
    if (verifying) return;

    setVerifying(true);
    setMessage(null);
    try {
      const result = await verifyGuestClaimCode(cleanCode);
      setClaimed({
        records: result.claimedGuestRecords,
        payments: result.claimedPayments,
      });
      setCode("");
      setCodeSent(false);
      // Refresh the student's payment history, receipts, and dues.
      await invalidateFinanceCache(queryClient);
      await queryClient.invalidateQueries();
    } catch (err) {
      setMessage({
        type: "error",
        text: getGuestPaymentError(
          err,
          "This claim code is invalid or has expired. Request a new one.",
        ),
      });
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/50 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start gap-3.5">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-lg shadow-blue-500/25">
          <Gift className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[#0B1020] dark:text-white">
            Claim guest payments
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Paid a due as a guest before creating this account? Use the same
            email to claim your payments, receipts, and due history.
          </p>
        </div>
      </div>

      {claimed ? (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              {claimed.payments > 0
                ? `${claimed.payments} payment${claimed.payments === 1 ? "" : "s"} claimed`
                : "No guest payments found"}
            </p>
            <p className="mt-0.5 text-xs leading-5 text-emerald-800/80 dark:text-emerald-300/80">
              {claimed.records > 0
                ? `${claimed.records} guest record${claimed.records === 1 ? "" : "s"} now belong to this account. Your payment history, receipts, and dues have been refreshed.`
                : "You can sign out and back in if you don’t see your history immediately."}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {message && (
            <div
              role={message.type === "error" ? "alert" : "status"}
              className={
                message.type === "error"
                  ? "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                  : "flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
              }
            >
              <Mail className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          {codeSent ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
                    setMessage(null);
                  }}
                  placeholder="6-digit code"
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2.5 text-center font-mono text-lg font-bold tracking-[0.3em] text-[#0B1020] outline-none transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying || code.length !== 6}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Claiming…
                    </>
                  ) : (
                    "Claim payments"
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={handleRequestCode}
                disabled={sending}
                className="text-xs font-semibold text-[#2563EB] hover:underline disabled:opacity-50"
              >
                {sending ? "Resending…" : "Resend claim code"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestCode}
              disabled={sending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" /> Send me a claim code
                </>
              )}
            </button>
          )}

          <p className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
            The code is sent to your verified account email and expires after
            10 minutes.
          </p>
        </div>
      )}
    </div>
  );
}