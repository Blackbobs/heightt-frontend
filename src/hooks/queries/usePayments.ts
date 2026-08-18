import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeApi, DueItem, PaymentRequest } from "@/lib/api/finance";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";
import { invalidateFinanceCache, invalidateDashboardCache } from "@/lib/api/invalidation";

export function useMyDues() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.myDues,
    queryFn: () => financeApi.getMyDues(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
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

export function useMakePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PaymentRequest) => {
      const { idempotencyKey } = await financeApi.generateIdempotencyKey();
      return financeApi.makePayment(data, idempotencyKey);
    },
    onSuccess: () => {
      invalidateFinanceCache(queryClient);
      invalidateDashboardCache(queryClient);
    },
  });
}

export type { DueItem };
