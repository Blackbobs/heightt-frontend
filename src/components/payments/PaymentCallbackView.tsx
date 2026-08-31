"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
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
    return (
      <PaymentStatusMessage
        icon={<AlertCircle className="h-10 w-10 text-amber-500" />}
        title="Payment awaiting confirmation"
        description="The provider is still confirming this payment. Do not start another payment while we are checking."
      >
        <button type="button" onClick={() => window.location.reload()} className="rounded-2xl bg-[#1a5cff] px-5 py-3 text-sm font-semibold text-white">Check again</button>
      </PaymentStatusMessage>
    );
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
      icon={<Loader2 className="h-10 w-10 text-[#1a5cff] animate-spin" />}
      title="Confirming payment"
      description="Please wait while we confirm your payment status."
    />
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
