// src/hooks/queries/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";
import { usersApi } from "@/lib/api/users";
import { financeApi } from "@/lib/api/finance";
import { organizationsApi } from "@/lib/api/organizations";

export function useDashboardData() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    // Scope cached financial data to the signed-in user. This prevents a
    // previous session's empty or stale dashboard from being reused.
    queryKey: [...queryKeys.dashboard.all, user?.id],
    queryFn: async () => {
      // Do not turn request/auth failures into successful zero balances.
      // Throwing lets React Query retry and show the dashboard error state.
      const [userData, dues, transactions, receipts, organizations] =
        await Promise.all([
          user ? Promise.resolve(user) : usersApi.getCurrentUser(),
          financeApi.getMyDues(),
          financeApi.getTransactions({ page: 1, limit: 10 }),
          financeApi.getReceipts({ page: 1, limit: 10 }),
          organizationsApi.getUserOrganizations(),
        ]);

      return {
        user: userData,
        dues: dues || [],
        transactions: transactions?.data || [],
        receipts: receipts?.data || [],
        organizations: organizations || [],
      };
    },
    enabled: isAuthenticated && !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
