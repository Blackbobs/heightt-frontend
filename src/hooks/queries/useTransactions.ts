import { useQuery } from "@tanstack/react-query";
import { financeApi } from "@/lib/api/finance";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";

export function useTransactions(params?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.finance.transactions(params),
    queryFn: async () => {
      const result = await financeApi.getTransactions(params);
      return {
        transactions: result?.data || [],
        meta: result?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}
