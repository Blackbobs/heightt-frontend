import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { PaymentCancelledView } from "@/components/payments/PaymentCancelledView";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

export const metadata: Metadata = {
  title: "Payment Cancelled — Heightt",
  description: "Your payment session was cancelled.",
};

function CancelledLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <HeighttLoader label="Loading payment status" />
      <span className="text-sm font-medium text-slate-500">
        Loading status...
      </span>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <DashboardPageShell pageTitle="Payment Status">
      <Suspense fallback={<CancelledLoadingFallback />}>
        <PaymentCancelledView isEmbeddedInDashboard={true} />
      </Suspense>
    </DashboardPageShell>
  );
}
