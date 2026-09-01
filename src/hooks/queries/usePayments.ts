// src/hooks/queries/usePayments.ts

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  financeApi,
  DueItem,
  PaymentHistoryParams,
  PaymentRequest,
} from "@/lib/api/finance";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";

export function useMyDues() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: [...queryKeys.finance.myDues, user?.id],
    queryFn: async () => (await financeApi.getMyDues()) || [],
    enabled: isAuthenticated && !!user?.id,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useDues(params?: {
  organizationId?: string;
  page?: number;
  limit?: number;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...queryKeys.finance.dues, params],
    queryFn: async () => {
      try {
        const result = await financeApi.getDues(params);
        return result?.data || [];
      } catch (error) {
        console.error("Error fetching dues:", error);
        return [];
      }
    },
    enabled: isAuthenticated,
    staleTime: 3 * 60 * 1000,
  });
}

export function usePaymentHistory(params?: PaymentHistoryParams) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.paymentHistory(params),
    queryFn: () => financeApi.getPaymentHistory(params),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });
}

export function useMakePayment() {
  return useMutation({
    mutationFn: async (data: PaymentRequest) => {
      const { idempotencyKey } = await financeApi.generateIdempotencyKey();
      return financeApi.makePayment(data, idempotencyKey);
    },
    onError: (error) => {
      console.error("Payment error:", error);
    },
  });
}

export type { DueItem };
