// apps/web/app/dashboard/payments/page.tsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  X,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMyDues, useMakePayment } from "@/hooks/queries/usePayments";
import { DueAssignment, PaymentResponse } from "@/lib/api/finance";

type Tab = "all" | "unpaid" | "paid";
type PaymentBreakdown = {
  organizationAmount: number;
  platformFee: number;
  subtotal: number;
};

const PAYMENT_BREAKDOWN_STORAGE_KEY = "heightt.paymentBreakdown";

// Helper function to safely check if a value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

function getCheckoutUrl(response: PaymentResponse): string | null {
  // Check if response has a data wrapper with checkoutUrl
  if (isObject(response.data)) {
    // Check for checkoutUrl in the data object
    if (typeof response.data.checkoutUrl === "string") {
      return response.data.checkoutUrl;
    }
    if (typeof response.data.url === "string") {
      return response.data.url;
    }
    if (typeof response.data.paymentUrl === "string") {
      return response.data.paymentUrl;
    }
  }

  // Direct response properties (fallback)
  if (typeof response.checkoutUrl === "string") return response.checkoutUrl;
  if (typeof response.url === "string") return response.url;
  if (typeof response.paymentUrl === "string") return response.paymentUrl;

  return null;
}

function getPendingPaymentId(response: PaymentResponse): string | null {
  if (isObject(response.data)) {
    if (typeof response.data.pendingPaymentId === "string") {
      return response.data.pendingPaymentId;
    }
    if (typeof response.data.id === "string") {
      return response.data.id;
    }
  }

  if (typeof response.pendingPaymentId === "string") {
    return response.pendingPaymentId;
  }

  return null;
}

function getPaymentBreakdown(response: PaymentResponse): PaymentBreakdown | null {
  const source = isObject(response.data) ? response.data : response;
  const baseAmount = source.baseAmount;
  const platformFee = source.platformFee;
  const totalBeforeGatewayFee = source.totalBeforeGatewayFee;

  if (
    typeof baseAmount !== "number" ||
    typeof platformFee !== "number" ||
    typeof totalBeforeGatewayFee !== "number"
  ) {
    return null;
  }

  return {
    organizationAmount: baseAmount / 100,
    platformFee: platformFee / 100,
    subtotal: totalBeforeGatewayFee / 100,
  };
}

export function PaymentsPage() {
  const searchParams = useSearchParams();
  const highlightDueId = searchParams.get("dueId");
  const paymentStatus = searchParams.get("status");

  const { data: dues, isLoading, isError, error, refetch } = useMyDues();
  const makePayment = useMakePayment();

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selectedDue, setSelectedDue] = useState<DueAssignment | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    if (paymentStatus === "success") {
      setStatusBanner(
        "Payment initiated successfully. Your receipt will appear shortly.",
      );
    } else if (paymentStatus === "cancelled") {
      setStatusBanner("Payment was cancelled.");
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (highlightDueId && dues?.length) {
      const due = dues.find(
        (d) => d.id === highlightDueId || d.dueId === highlightDueId,
      );
      if (due && !due.isPaid) setSelectedDue(due);
    }
  }, [highlightDueId, dues]);

  const filtered = useMemo(() => {
    if (!dues) return [];
    return dues.filter((d) => {
      const tabMatch =
        tab === "all" ||
        (tab === "unpaid" && !d.isPaid) ||
        (tab === "paid" && d.isPaid);
      const q = search.toLowerCase();
      const searchMatch =
        !q ||
        d.due?.name?.toLowerCase().includes(q) ||
        d.due?.organization?.name?.toLowerCase().includes(q);
      return tabMatch && searchMatch;
    });
  }, [dues, tab, search]);

  const stats = useMemo(() => {
    const unpaid = dues?.filter((d) => !d.isPaid) || [];
    const paid = dues?.filter((d) => d.isPaid) || [];
    return {
      unpaidCount: unpaid.length,
      paidCount: paid.length,
      unpaidTotal: unpaid.reduce((s, d) => s + d.amount, 0),
      paidTotal: paid.reduce((s, d) => s + d.amount, 0),
    };
  }, [dues]);

  const handlePay = async (due: DueAssignment) => {
    if (!due.due?.organizationId) {
      setPaymentError("Organization information is missing for this due.");
      return;
    }

    setPayingId(due.id);
    setPaymentError(null);

    try {
      const origin = window.location.origin;
      const encodedDueName = encodeURIComponent(due.due?.name || "Due payment");
      const encodedOrg = encodeURIComponent(due.due?.organization?.name || "");
      const amountParam = due.amount;
      const dueIdParam = due.dueId || due.id;
      const callbackParams = new URLSearchParams({
        dueId: dueIdParam,
        dueName: due.due?.name || "Due payment",
        amount: String(amountParam),
        org: due.due?.organization?.name || "",
      });

      const result = await makePayment.mutateAsync({
        amount: due.amount,
        organizationId: due.due.organizationId,
        paymentMethod: "CARD",
        dueAssignmentId: due.isAutoAssigned ? undefined : due.id,
        dueId: due.dueId,
        description: due.due.name || "Due payment",
        successUrl: `${origin}/payment/callback?${callbackParams.toString()}`,
        cancelUrl: `${origin}/payment/cancelled?dueId=${dueIdParam}&dueName=${encodedDueName}&amount=${amountParam}&org=${encodedOrg}`,
      });

      console.log("Payment response:", result); // Debug log to see the response structure

      const checkoutUrl = getCheckoutUrl(result);
      console.log("Extracted checkout URL:", checkoutUrl); // Debug log
      const pendingPaymentId = getPendingPaymentId(result);
      const paymentBreakdown = getPaymentBreakdown(result);

      if (pendingPaymentId) {
        sessionStorage.setItem(
          "heightt.pendingPayment",
          JSON.stringify({
            pendingPaymentId,
            startedAt: Date.now(),
          }),
        );
      }

      if (paymentBreakdown) {
        sessionStorage.setItem(
          PAYMENT_BREAKDOWN_STORAGE_KEY,
          JSON.stringify(paymentBreakdown),
        );
      } else {
        sessionStorage.removeItem(PAYMENT_BREAKDOWN_STORAGE_KEY);
      }

      if (checkoutUrl) {
        // Redirect to the checkout URL
        window.location.href = checkoutUrl;
      } else {
        setPaymentError("Payment initiated but no checkout URL was returned.");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to initiate payment. Please try again.";
      setPaymentError(message);
    } finally {
      setPayingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">
            Loading your dues...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
        <p className="font-semibold">Error loading dues</p>
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

  const unpaidDues = dues?.filter((d) => !d.isPaid) || [];

  return (
    <div className="space-y-5 pb-6">
      {/* Status Banner */}
      {statusBanner && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-medium flex items-start justify-between gap-3">
          <span>{statusBanner}</span>
          <button
            onClick={() => setStatusBanner(null)}
            className="text-emerald-600 hover:text-emerald-800 border-none bg-transparent cursor-pointer p-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium flex items-start justify-between gap-3">
          <span>{paymentError}</span>
          <button
            onClick={() => setPaymentError(null)}
            className="text-red-600 hover:text-red-800 border-none bg-transparent cursor-pointer p-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unpaid Alert */}
      {stats.unpaidCount > 0 && (
        <div className="bg-[#fff8ec] border border-[#f5d08a] rounded-[16px] px-4 py-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[0.82rem] font-semibold text-[#7a4a00]">
              You have {stats.unpaidCount} unpaid due
              {stats.unpaidCount !== 1 ? "s" : ""}
            </p>
            <p className="text-[0.7rem] text-[#a06020] mt-0.5">
              ₦{stats.unpaidTotal.toLocaleString()} total outstanding
            </p>
          </div>
        </div>
      )}

      {dues && dues.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-[16px] px-4 py-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-[8px] bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[0.82rem] font-semibold text-[#1a3a7a]">
              No dues assigned
            </p>
            <p className="text-[0.7rem] text-[#4a6a9a] mt-0.5">
              You don't have any active dues. Join an organization to see
              assigned dues.
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search dues…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8ecf1] rounded-[12px] pl-10 pr-4 py-3 text-[0.82rem] text-[#1a1a2e] placeholder-[#b0bac8] outline-none focus:border-[#1a5cff] transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {(
          [
            { key: "all", label: "All" },
            { key: "unpaid", label: "Unpaid" },
            { key: "paid", label: "Paid" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all",
              tab === key
                ? "bg-[#1a5cff] text-white"
                : "bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Due list */}
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CreditCard className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">
              No dues found
            </p>
            <p className="text-[0.65rem] text-[#7a8ba3] mt-1">
              {search
                ? "No matching dues found. Try adjusting your search."
                : "Join an organization to see assigned dues"}
            </p>
          </div>
        )}
        {filtered.map((due) => {
          const isOverdue =
            !due.isPaid &&
            due.due?.dueDate &&
            new Date(due.due.dueDate) < new Date();
          const isPaying = payingId === due.id;
          const isAutoAssigned = due.isAutoAssigned;

          return (
            <div
              key={due.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors",
                highlightDueId === due.id && "bg-[#eef4ff]",
              )}
            >
              <div className="w-9 h-9 rounded-[10px] bg-[#eef3ff] flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-[#1a5cff]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">
                  {due.due?.name || "Due Payment"}
                </p>
                <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 flex items-center gap-1 flex-wrap">
                  <Building2 className="w-3 h-3 flex-shrink-0" />
                  {due.due?.organization?.name || "Unknown"}
                  {isAutoAssigned && (
                    <span className="ml-1 text-[0.55rem] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                      Available
                    </span>
                  )}
                  <span className="text-[#b0bac8]">·</span>
                  {due.due?.dueDate
                    ? new Date(due.due.dueDate).toLocaleDateString()
                    : "No deadline"}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-[0.82rem] font-bold text-[#1a1a2e]">
                  ₦{due.amount.toLocaleString()}
                </span>
                {due.isPaid ? (
                  <span className="inline-flex items-center gap-1 text-[0.58rem] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid
                  </span>
                ) : (
                  <>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[0.58rem] font-semibold px-2 py-0.5 rounded-full",
                        isOverdue
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {isOverdue ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {isOverdue ? "Overdue" : "Pending"}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDue(due);
                      }}
                      disabled={isPaying}
                      className={cn(
                        "py-1.5 px-4 rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors flex items-center gap-1.5",
                        isPaying
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#1a5cff] hover:bg-[#0f4ad0] text-white",
                      )}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Pay"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay confirmation modal */}
      {selectedDue && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0b1a33]">
                Confirm Payment
              </h3>
              <button
                onClick={() => setSelectedDue(null)}
                className="text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#f8faff] p-4 rounded-2xl border border-slate-200/80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Due</span>
                <span className="font-bold text-[#0b1a33]">
                  {selectedDue.due?.name || "Due Payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organization</span>
                <span className="font-semibold text-[#1a5cff]">
                  {selectedDue.due?.organization?.name || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organization payment</span>
                <span className="font-extrabold text-[#0b1a33]">
                  {formatNaira(selectedDue.amount)}
                </span>
              </div>
              <div className="rounded-xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                Heightt platform fee and subtotal will be shown after checkout
                starts. Bachs may add a separate payment-processing fee.
              </div>
              {selectedDue.isAutoAssigned && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <p className="font-semibold">
                    This due is available for you to pay. No prior assignment
                    needed.
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-[#5b6d89]">
              You will be redirected to a secure checkout page to complete your
              payment.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedDue(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePay(selectedDue);
                  setSelectedDue(null);
                }}
                disabled={payingId === selectedDue.id}
                className="flex-1 py-2.5 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm transition-colors cursor-pointer border-none disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {payingId === selectedDue.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Pay"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsPage;
