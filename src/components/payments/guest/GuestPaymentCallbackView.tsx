"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Clock3, ShieldCheck, XCircle } from "lucide-react";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import {
  getGuestPendingStatus,
  getGuestAccessToken,
  getGuestPendingPaymentId,
  clearGuestPaymentStorage,
  GuestPaymentStatusResult,
  getGuestPaymentError,
} from "@/lib/api/guest-payments";

type CallbackState =
  | { status: "checking" }
  | { status: "polling" }
  | { status: "completed"; payment: GuestPaymentStatusResult }
  | {
      status: "finished";
      kind: "failed" | "expired" | "cancelled";
      payment: GuestPaymentStatusResult;
      message: string;
    }
  | { status: "error"; message: string };

const POLL_INTERVAL_MS = 5_000;
const FINAL_NON_COMPLETE_STATUSES = ["FAILED", "EXPIRED", "CANCELLED"] as const;

function getPendingPaymentId(searchParams: URLSearchParams): string | null {
  return (
    searchParams.get("payment") ||
    searchParams.get("pendingPaymentId") ||
    searchParams.get("pendingPayment") ||
    searchParams.get("id") ||
    getGuestPendingPaymentId()
  );
}

function describeFinalState(payment: GuestPaymentStatusResult): {
  kind: "failed" | "expired" | "cancelled";
  message: string;
} {
  if (payment.status === "CANCELLED") {
    return {
      kind: "cancelled",
      message:
        payment.failureReason ||
        "The checkout was cancelled. You can safely start a new payment attempt.",
    };
  }
  if (payment.status === "EXPIRED") {
    return {
      kind: "expired",
      message:
        payment.failureReason ||
        "The checkout expired. You can safely start a new payment attempt.",
    };
  }
  return {
    kind: "failed",
    message:
      payment.failureReason ||
      "Payment failed. No successful payment was recorded.",
  };
}

export function GuestPaymentCallbackView() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>({ status: "checking" });
  const pollTimer = useRef<number | null>(null);

  const pendingPaymentId = useMemo(
    () => getPendingPaymentId(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const poll = useCallback(async () => {
    if (!pendingPaymentId) return;
    const accessToken = getGuestAccessToken(pendingPaymentId);
    if (!accessToken) {
      setState({
        status: "error",
        message:
          "We could not find the access token for this payment in this browser. If you used another browser or device, your receipt was still emailed to the payment email address.",
      });
      return;
    }

    try {
      const payment = await getGuestPendingStatus(pendingPaymentId, accessToken);

      if (payment.status === "COMPLETED") {
        clearGuestPaymentStorage(pendingPaymentId);
        if (pollTimer.current) window.clearInterval(pollTimer.current);
        pollTimer.current = null;
        setState({ status: "completed", payment });
        return;
      }

      if (
        (FINAL_NON_COMPLETE_STATUSES as readonly string[]).includes(payment.status)
      ) {
        clearGuestPaymentStorage(pendingPaymentId);
        if (pollTimer.current) window.clearInterval(pollTimer.current);
        pollTimer.current = null;
        setState({
          status: "finished",
          ...describeFinalState(payment),
          payment,
        });
        return;
      }

      setState({ status: "polling" });
    } catch (err) {
      setState({
        status: "error",
        message: getGuestPaymentError(
          err,
          "We could not confirm this payment. Your receipt was still emailed to you if the payment was successful.",
        ),
      });
    }
  }, [pendingPaymentId]);

  useEffect(() => {
    if (!pendingPaymentId) return;

    let cancelled = false;

    async function start() {
      await poll();
      if (cancelled) return;
      pollTimer.current = window.setInterval(() => {
        void poll();
      }, POLL_INTERVAL_MS);
    }

    void start();

    return () => {
      cancelled = true;
      if (pollTimer.current) window.clearInterval(pollTimer.current);
      pollTimer.current = null;
    };
  }, [poll, pendingPaymentId]);

  const isBusy = state.status === "checking" || state.status === "polling";

  if (!pendingPaymentId) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 py-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-xl">
          <div className="bg-gradient-to-b from-[#0B1020] via-[#122c66] to-[#0b1f49] p-8 text-white sm:p-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563EB] to-[#56a0ff] shadow-lg shadow-blue-950/60 sm:h-24 sm:w-24">
              <AlertCircle className="h-9 w-9 text-white sm:h-10 sm:w-10" />
            </div>
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Payment reference missing
            </h1>
            <p className="mx-auto max-w-md text-sm leading-6 text-blue-100/75">
              Return to the guest checkout and start a new payment attempt.
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <Link
              href="/payments/guest"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[#2563EB] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 no-underline transition-colors hover:bg-[#1D4ED8]"
            >
              Back to guest checkout
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-xl">
        <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1020] via-[#122c66] to-[#0b1f49] p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />

          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
            <div className="absolute inset-0 animate-pulse rounded-full bg-blue-400/15" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563EB] to-[#56a0ff] shadow-lg shadow-blue-950/60 sm:h-20 sm:w-20">
              {state.status === "completed" ? (
                <CheckCircle2 className="h-9 w-9 text-white sm:h-10 sm:w-10" />
              ) : state.status === "error" ? (
                <XCircle className="h-9 w-9 text-white sm:h-10 sm:w-10" />
              ) : (
                <HeighttLoader className="[&_svg]:h-9 sm:[&_svg]:h-10" />
              )}
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {state.status === "completed"
              ? "Payment successful"
              : state.status === "error"
                ? "We could not confirm the payment"
                : "Confirming your payment"}
          </h1>
          <p className="mx-auto max-w-md text-sm leading-6 text-blue-100/75">
            {state.status === "completed"
              ? "Your guest payment went through and the receipt was sent to your email."
              : state.status === "error"
                ? "Check the payment provider for the status, or start a new checkout."
                : "Please wait while we check your payment status. This can take a few moments."}
          </p>
        </div>

        <div className="space-y-5 p-6 text-left sm:p-8">
          {state.status === "completed" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Your receipt is on its way
                  </p>
                  <p className="text-xs leading-5 text-emerald-800/80 dark:text-emerald-300/80">
                    Register or sign in with the same email you used for this
                    payment to claim your payment history and receipts at any
                    time.
                  </p>
                  {state.payment.receiptNumber && (
                    <p className="pt-1 font-mono text-xs text-emerald-800 dark:text-emerald-300">
                      Receipt no.: {state.payment.receiptNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {state.status === "finished" && (
            <div
              className={[
                "flex items-start gap-3 rounded-2xl border p-4",
                state.kind === "cancelled"
                  ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40"
                  : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40",
              ].join(" ")}
            >
              {state.kind === "cancelled" ? (
                <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              )}
              <div className="text-sm">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {state.kind === "cancelled"
                    ? "Checkout cancelled"
                    : "Payment not completed"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {state.message}
                </p>
              </div>
            </div>
          )}

          {state.status === "error" && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {state.message}
              </p>
            </div>
          )}

          {isBusy && (
            <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2563EB]" />
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Please don&apos;t close this page. We&apos;ll update it as soon
                as the provider confirms the payment.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/payments/guest"
              className="flex-1 rounded-2xl bg-[#2563EB] px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 no-underline transition-colors hover:bg-[#1D4ED8]"
            >
              Make another payment
            </Link>
            <Link
              href="/signup"
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-center text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Create an account to claim it
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}