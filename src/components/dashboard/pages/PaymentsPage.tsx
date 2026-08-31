// apps/web/app/dashboard/payments/page.tsx

"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
  X,
  Building2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn, koboToNaira } from "@/lib/utils";
import {
  useMyDues,
  useMakePayment,
  usePaymentHistory,
} from "@/hooks/queries/usePayments";
import {
  DueAssignment,
  PaymentHistoryRecord,
  PaymentResponse,
} from "@/lib/api/finance";
import { queryKeys } from "@/lib/api/keys";

type Tab = "all" | "unpaid" | "paid";

// Helper function to safely check if a value is an object
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getPendingPaymentId(response: PaymentResponse): string | null {
  if (isObject(response.data)) {
    const id = response.data.pendingPaymentId ?? response.data.paymentId;
    if (typeof id === "string") return id;
  }

  return typeof response.pendingPaymentId === "string"
    ? response.pendingPaymentId
    : null;
}

function getCheckoutUrl(response: PaymentResponse): string | null {
  if (isObject(response.data)) {
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

  if (typeof response.checkoutUrl === "string") return response.checkoutUrl;
  if (typeof response.url === "string") return response.url;
  if (typeof response.paymentUrl === "string") return response.paymentUrl;

  return null;
}

export function PaymentsPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const highlightDueId = searchParams.get("dueId");
  const paymentStatus = searchParams.get("status");

  const { data: dues, isLoading, isError, error, refetch } = useMyDues();
  const makePayment = useMakePayment();
  const { data: paymentHistory, refetch: refetchPaymentHistory } =
    usePaymentHistory({ page: 1, limit: 20 });

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [selectedDue, setSelectedDue] = useState<DueAssignment | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [pendingDueIds, setPendingDueIds] = useState<Set<string>>(new Set());
  const paymentInitiationLock = useRef(false);

  useEffect(() => {
    if (paymentStatus === "success") {
      setStatusBanner(
        "Payment initiated successfully. Your official receipt will appear shortly.",
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
    if (!dues) return { unpaidCount: 0, unpaidTotal: 0, paidTotal: 0 };
    const unpaid = dues.filter((d) => !d.isPaid);
    const paid = dues.filter((d) => d.isPaid);
    return {
      unpaidCount: unpaid.length,
      unpaidTotal: unpaid.reduce((sum, d) => sum + (d.amount || 0), 0),
      paidTotal: paid.reduce((sum, d) => sum + (d.amount || 0), 0),
    };
  }, [dues]);

  const handlePay = async (due: DueAssignment) => {
    if (
      due.isPaid ||
      paymentInitiationLock.current ||
      payingId ||
      pendingDueIds.has(due.id)
    ) {
      return;
    }

    if (!due.due?.organizationId) {
      setPaymentError("Organization information is missing for this due.");
      return;
    }

    paymentInitiationLock.current = true;
    setPayingId(due.id);
    setPaymentError(null);
    setPayingId(due.id);

    try {
      const dueIdParam = due.due?.id || due.dueId || due.id;
      const amountParam = koboToNaira(due.amount);
      const encodedDueName = encodeURIComponent(due.due?.name || "Due Payment");
      const encodedOrg = encodeURIComponent(
        due.due?.organization?.name || "Organization",
      );

      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://www.heightt.app";

      const payload = {
        amount: due.amount,
        organizationId: due.due?.organizationId || due.due?.organization?.id || "",
        paymentMethod: "CARD" as const,
        dueId: dueIdParam,
        dueAssignmentId: due.id,
        description: `Payment for ${due.due?.name || "Student Due"}`,
        successUrl: `${origin}/dashboard/payments/success?dueId=${dueIdParam}&dueName=${encodedDueName}&amount=${amountParam}&org=${encodedOrg}`,
        cancelUrl: `${origin}/dashboard/payments/cancelled?dueId=${dueIdParam}&dueName=${encodedDueName}&amount=${amountParam}&org=${encodedOrg}`,
      };

      const response = await makePayment.mutateAsync(payload);
      const checkoutUrl = getCheckoutUrl(response);

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error(
          "Payment initialized, but no checkout URL was returned. Please try again.",
        );
      }
    } catch (err: unknown) {
      const response = (err as {
        response?: { status?: number; data?: Record<string, unknown> };
      })?.response;
      const responseData = response?.data;
      const message =
        (typeof responseData?.message === "string" && responseData.message) ||
        "Failed to initiate payment. Please try again.";

      if (response?.status === 400 && message === "This due has already been paid") {
        queryClient.setQueryData<DueAssignment[]>(
          queryKeys.finance.myDues,
          (current) =>
            current?.map((item) =>
              item.id === due.id ? { ...item, isPaid: true } : item,
            ) ?? current,
        );
        setSelectedDue(null);
        setStatusBanner("This due has already been paid. Your records have been refreshed.");
        await Promise.all([refetch(), refetchPaymentHistory()]);
      } else if (
        response?.status === 409 &&
        message === "A payment for this due is already in progress"
      ) {
        setPendingDueIds((current) => new Set(current).add(due.id));
        const pendingResponse = responseData as PaymentResponse;
        const pendingPaymentId = getPendingPaymentId(pendingResponse);
        const checkoutUrl = getCheckoutUrl(pendingResponse);

        if (pendingPaymentId) {
          sessionStorage.setItem(
            "heightt.pendingPayment",
            JSON.stringify({ pendingPaymentId, startedAt: Date.now() }),
          );
        }

        setSelectedDue(null);
        setStatusBanner("A payment for this due is already in progress.");
        await Promise.all([refetch(), refetchPaymentHistory()]);

        if (checkoutUrl) window.location.href = checkoutUrl;
      } else {
        setPaymentError(message);
      }
    } finally {
      paymentInitiationLock.current = false;
      setPayingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground font-medium">
            Loading your dues...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-destructive">
        <p className="font-bold">Error loading dues</p>
        <p className="text-xs mt-1">{error?.message || "Something went wrong"}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-destructive text-white rounded-xl text-xs font-bold hover:opacity-90 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Status Banner */}
      {statusBanner && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-800 text-xs font-semibold flex items-start justify-between gap-3 shadow-xs">
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
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl px-4 py-3 text-destructive text-xs font-semibold flex items-start justify-between gap-3 shadow-xs">
          <span>{paymentError}</span>
          <button
            onClick={() => setPaymentError(null)}
            className="text-destructive hover:opacity-80 border-none bg-transparent cursor-pointer p-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unpaid Alert Banner */}
      {stats.unpaidCount > 0 && (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-900">
              You have {stats.unpaidCount} unpaid due{stats.unpaidCount !== 1 ? "s" : ""}
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5 font-medium">
              {formatNaira(koboToNaira(stats.unpaidTotal))} total outstanding for your registered organisations.
            </p>
          </div>
        </div>
      )}

      {dues && dues.length === 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">
              No dues assigned yet
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              You don't have any active dues. Join an organisation to see assigned dues and levies.
            </p>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search dues by name or organisation…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors shadow-xs"
        />
      </div>

      {/* Dues Status Filter Tabs */}
      <div className="flex gap-1.5">
        {(
          [
            { key: "all", label: "All Dues" },
            { key: "unpaid", label: "Unpaid" },
            { key: "paid", label: "Paid" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer",
              tab === key
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white border-border text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dues List Card */}
      <div className="bg-white border border-border rounded-2xl divide-y divide-border overflow-hidden shadow-sm">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground">
              No dues found
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search
                ? "No matching dues found. Try adjusting your search."
                : "Join an organisation to see assigned dues."}
            </p>
          </div>
        )}

        {filtered.map((due) => {
          const isOverdue =
            !due.isPaid &&
            due.due?.dueDate &&
            new Date(due.due.dueDate) < new Date();
          const isPaying = payingId === due.id;
          const hasPendingPayment = pendingDueIds.has(due.id);
          const isAutoAssigned = due.isAutoAssigned;

          return (
            <div
              key={due.id}
              className={cn(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/40 transition-colors",
                highlightDueId === due.id && "bg-primary/5 border-l-4 border-l-primary",
              )}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">
                    {due.due?.name || "Due Payment"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{due.due?.organization?.name || "Unknown"}</span>
                    {isAutoAssigned && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.2 rounded-full font-bold">
                        Available
                      </span>
                    )}
                    <span>·</span>
                    <span>
                      {due.due?.dueDate
                        ? `Due ${new Date(due.due.dueDate).toLocaleDateString()}`
                        : "No deadline"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <span className="text-sm font-extrabold text-foreground font-display">
                  {formatNaira(koboToNaira(due.amount))}
                </span>

                {due.isPaid ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paid
                  </span>
                ) : (
                  <>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                        isOverdue
                          ? "bg-red-50 text-destructive border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200",
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
                      disabled={due.isPaid || isPaying || hasPendingPayment || makePayment.isPending}
                      className={cn(
                        "py-1.5 px-4 rounded-lg text-xs font-semibold border-none cursor-pointer transition-colors flex items-center gap-1.5",
                        isPaying || hasPendingPayment || makePayment.isPending
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#1a5cff] hover:bg-[#0f4ad0] text-white",
                      )}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : hasPendingPayment ? (
                        "In progress"
                      ) : (
                        <>
                          Pay Due <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pay Confirmation Modal */}
      {selectedDue && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                Confirm Due Payment
              </h3>
              <button
                onClick={() => setSelectedDue(null)}
                className="text-muted-foreground hover:text-foreground border-none bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-muted/40 p-4 rounded-2xl border border-border space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Name</span>
                <span className="font-bold text-foreground">
                  {selectedDue.due?.name || "Due Payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organisation</span>
                <span className="font-semibold text-primary">
                  {selectedDue.due?.organization?.name || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border/80">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-extrabold text-foreground text-sm font-display">
                  {formatNaira(koboToNaira(selectedDue.amount))}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>You will be redirected to the secure payment portal to complete this transaction.</span>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => setSelectedDue(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-bold text-xs hover:bg-muted transition-colors cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePay(selectedDue);
                  setSelectedDue(null);
                }}
                disabled={
                  selectedDue.isPaid ||
                  payingId !== null ||
                  pendingDueIds.has(selectedDue.id) ||
                  makePayment.isPending
                }
                className="flex-1 py-2.5 rounded-xl bg-[#1a5cff] hover:bg-[#0f4ad0] text-white font-semibold text-sm transition-colors cursor-pointer border-none disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {payingId === selectedDue.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  "Proceed to Pay"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[#1a1a2e]">Payment history</h2>
          <span className="text-xs text-[#7a8ba3]">
            {paymentHistory?.meta.total ?? paymentHistory?.data.length ?? 0} payments
          </span>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
          {paymentHistory?.data.length ? (
            paymentHistory.data.map((payment: PaymentHistoryRecord) => {
              const due = payment.duePayment?.assignment?.due;
              const transaction = payment.transaction;
              const status = transaction?.status ?? payment.status;
              const amount = transaction?.amount ?? payment.amount;
              const organization =
                payment.organization?.name ?? due?.organization?.name ?? "Organization";

              return (
                <div key={payment.id} className="flex items-center gap-3 px-4 py-4">
                  <div className="w-9 h-9 rounded-[8px] bg-[#eef3ff] flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-[#1a5cff]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.82rem] font-semibold text-[#1a1a2e]">
                      {due?.name ?? transaction?.description ?? "Due payment"}
                    </p>
                    <p className="mt-0.5 truncate text-[0.62rem] text-[#7a8ba3]">
                      {organization} · {payment.reference ?? transaction?.reference ?? "No reference"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[0.8rem] font-bold text-[#1a1a2e]">
                      {formatNaira(amount / 100)}
                    </p>
                    <p className={cn(
                      "mt-1 text-[0.58rem] font-semibold",
                      status === "COMPLETED" ? "text-emerald-700" :
                      status === "FAILED" ? "text-red-600" : "text-amber-700",
                    )}>
                      {status}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-10 text-center text-sm text-[#7a8ba3]">
              Your payment history will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PaymentsPage;
