import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PaymentSuccessView } from "@/components/payments/PaymentSuccessView";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Payment Successful — Heightt",
  description: "Your payment was successfully processed and recorded.",
};

function SuccessLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      <span className="text-sm font-medium text-slate-500">
        Loading payment confirmation...
      </span>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <DashboardPageShell pageTitle="Payment Confirmation">
      <Suspense fallback={<SuccessLoadingFallback />}>
        <PaymentSuccessView isEmbeddedInDashboard={true} />
      </Suspense>
    </DashboardPageShell>
  );
}
