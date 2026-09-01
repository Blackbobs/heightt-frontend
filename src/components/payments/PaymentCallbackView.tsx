"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Clock3, ShieldCheck } from "lucide-react";
import { HeighttLoader } from "@/components/ui/HeighttLoader";
import {
  financeApi,
  PaymentStatusResult,
} from "@/lib/api/finance";
import { useAuthStore } from "@/store/auth-store";
import { invalidateDashboardCache, invalidateFinanceCache } from "@/lib/api/invalidation";

type CallbackState =
  | { status: "confirming" }
  | { status: "delayed"; pendingPaymentId: string }
  | { status: "retry"; payment: PaymentStatusResult; message: string }
  | { status: "failed"; message: string };

const PENDING_PAYMENT_STORAGE_KEY = "heightt.pendingPayment";
const FINAL_STATUSES = ["FAILED", "CANCELLED", "EXPIRED"] as const;

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

function getPendingPaymentId(searchParams: URLSearchParams): string | null {
  return (
    searchParams.get("payment") ||
    searchParams.get("pendingPaymentId") ||
    searchParams.get("pendingPayment") ||
    searchParams.get("id") ||
    getStoredPendingPaymentId()
  );
}

function buildSuccessUrl(
  payment: PaymentStatusResult,
  searchParams: URLSearchParams,
) {
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

function buildCancelledUrl(
  payment: PaymentStatusResult,
  searchParams: URLSearchParams,
) {
  const params = new URLSearchParams(searchParams);
  params.set("payment", payment.id);
  params.set("reference", payment.reference);
  params.set("amount", String(payment.amount / 100));

  if (payment.failureReason) {
    params.set("reason", payment.failureReason);
  }

  return `/payment/cancelled?${params.toString()}`;
}

async function waitForPayment(
  pendingPaymentId: string,
  signal: AbortSignal,
  onProcessing: () => void,
): Promise<PaymentStatusResult> {
  const intervalMs = 5_000;

  while (!signal.aborted) {
    if (signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const payment = await financeApi.getPendingPaymentStatus(pendingPaymentId);

    if (payment.status === "COMPLETED") {
      return payment;
    }

    if (payment.status === "PENDING" || FINAL_STATUSES.includes(payment.status as (typeof FINAL_STATUSES)[number])) {
      return payment;
    }

    onProcessing();

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, intervalMs);
      signal.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true },
      );
    });
  }

  throw new DOMException("Aborted", "AbortError");
}

export function PaymentCallbackView() {
  const searchParams = useSearchParams();
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const queryClient = useQueryClient();
  const [state, setState] = useState<CallbackState>({ status: "confirming" });

  const pendingPaymentId = useMemo(
    () => getPendingPaymentId(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function confirmPayment() {
      if (!pendingPaymentId) {
        setState({
          status: "failed",
          message: "The payment reference is missing.",
        });
        return;
      }

      const authenticated = await restoreSession();
      if (!authenticated) {
        const returnTo = encodeURIComponent(
          `/payment/callback?${new URLSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            payment: pendingPaymentId,
          }).toString()}`,
        );
        window.location.replace(`/signin?returnTo=${returnTo}`);
        return;
      }

      try {
        const payment = await waitForPayment(
          pendingPaymentId,
          controller.signal,
          () => setState({ status: "delayed", pendingPaymentId }),
        );
        if (payment.status === "CANCELLED") {
          window.location.replace(
            buildCancelledUrl(
              payment,
              new URLSearchParams(searchParams.toString()),
            ),
          );
          return;
        }
        if (payment.status !== "COMPLETED") {
          const messages: Record<string, string> = {
            PENDING: "Checkout creation was interrupted. Return to your dues to start the payment again.",
            FAILED: "Payment failed. No successful payment was recorded.",
            CANCELLED: "The checkout was cancelled. You can safely start a new payment attempt.",
            EXPIRED: "The checkout expired. You can safely start a new payment attempt.",
          };
          setState({
            status: "retry",
            payment,
            message: payment.failureReason || messages[payment.status] || "This payment needs your attention.",
          });
          return;
        }
        await Promise.all([
          invalidateFinanceCache(queryClient),
          invalidateDashboardCache(queryClient),
        ]);
        sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
        window.location.replace(
          buildSuccessUrl(
            payment,
            new URLSearchParams(searchParams.toString()),
          ),
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        const code = error instanceof Error ? error.message : "UNKNOWN_ERROR";
        const messages: Record<string, string> = {
          FAILED: "The payment was not successful.",
          CANCELLED: "The payment was cancelled.",
          EXPIRED: "The payment session expired.",
        };

        setState({
          status: "failed",
          message:
            messages[code] ||
            "We could not confirm this payment. Please check your payment history.",
        });
      }
    }

    void confirmPayment();

    return () => controller.abort();
  }, [pendingPaymentId, queryClient, restoreSession, searchParams]);

  if (state.status === "delayed") {
    return <PaymentAwaitingConfirmation />;
  }

  if (state.status === "retry") {
    return (
      <PaymentStatusMessage
        icon={<AlertCircle className="h-10 w-10 text-amber-500" />}
        title={state.payment.status === "PENDING" ? "Checkout interrupted" : `Payment ${state.payment.status.toLowerCase()}`}
        description={state.message}
      >
        <Link href="/dashboard/payments" className="rounded-2xl bg-[#1a5cff] px-5 py-3 text-sm font-semibold text-white no-underline">Return to dues</Link>
      </PaymentStatusMessage>
    );
  }

  if (state.status === "failed") {
    return (
      <PaymentStatusMessage
        icon={<AlertCircle className="h-10 w-10 text-red-500" />}
        title="Payment could not be confirmed"
        description={state.message}
      />
    );
  }

  return (
    <PaymentStatusMessage
      icon={<HeighttLoader label="Confirming payment" />}
      title="Confirming payment"
      description="Please wait while we confirm your payment status."
    />
  );
}

function PaymentAwaitingConfirmation() {
  return (
    <div className="w-full max-w-xl mx-auto py-4 px-2 sm:px-4 space-y-6 animate-fade-slide-up">
      <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-b from-[#122c66] via-[#0b1f49] to-[#07152f] p-6 text-center text-white shadow-2xl sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-blue-300/25 bg-blue-400/15 px-3 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
          Confirmation in progress
        </div>

        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
          <div className="absolute inset-0 animate-pulse rounded-full bg-blue-400/15" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#1a5cff] to-[#56a0ff] shadow-lg shadow-blue-950/60 sm:h-20 sm:w-20">
            <Clock3 className="h-9 w-9 text-white sm:h-11 sm:w-11" strokeWidth={2.2} />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Payment awaiting confirmation
        </h1>
        <p className="mx-auto max-w-md text-sm leading-6 text-blue-100/75">
          Your payment provider is still confirming this transaction. This can
          take a few moments.
        </p>

        <div className="mx-auto mt-6 flex max-w-md items-start gap-2.5 rounded-2xl border border-blue-300/15 bg-blue-950/40 p-3.5 text-left text-xs leading-5 text-blue-100/85">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-300" />
          <span>
            Please don&apos;t start another payment. We&apos;ll update this page as
            soon as confirmation is received.
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <AlertCircle className="h-5 w-5 text-[#1a5cff]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0b1a33]">What happens next?</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              You can check again now or return to your payments. Your record
              will update automatically once the provider responds.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 rounded-2xl bg-[#1a5cff] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-[#0f4ad0]"
          >
            Check again
          </button>
          <Link
            href="/dashboard/payments"
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-center text-sm font-semibold text-slate-700 no-underline transition-colors hover:bg-slate-50"
          >
            View payments
          </Link>
        </div>
      </div>
    </div>
  );
}

function PaymentStatusMessage({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 text-center shadow-xl">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
        {icon}
      </div>
      <h1 className="text-xl font-bold text-[#0b1a33]">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-6 flex justify-center gap-3">
        {children || (
          <>
        <Link
          href="/dashboard/payments"
          className="rounded-2xl bg-[#1a5cff] px-5 py-3 text-sm font-semibold text-white no-underline"
        >
          View Payments
        </Link>
        <Link
          href="/dashboard/receipts"
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 no-underline"
        >
          Receipts
        </Link>
          </>
        )}
      </div>
    </div>
  );
}
