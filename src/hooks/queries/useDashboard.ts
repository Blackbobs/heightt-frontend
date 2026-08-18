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
    queryKey: queryKeys.dashboard.all,
    queryFn: async () => {
      try {
        // Fetch all data in parallel
        const [userData, dues, transactions, receipts, organizations] =
          await Promise.all([
            // If we already have user data, use it, otherwise fetch
            user ? Promise.resolve(user) : usersApi.getCurrentUser(),
            financeApi.getMyDues().catch((error) => {
              console.error("Failed to fetch dues:", error);
              return [];
            }),
            financeApi
              .getTransactions({ page: 1, limit: 10 })
              .catch((error) => {
                console.error("Failed to fetch transactions:", error);
                return { data: [] };
              }),
            financeApi.getReceipts({ page: 1, limit: 10 }).catch((error) => {
              console.error("Failed to fetch receipts:", error);
              return { data: [] };
            }),
            organizationsApi.getUserOrganizations().catch((error) => {
              console.error("Failed to fetch organizations:", error);
              return [];
            }),
          ]);

        return {
          user: userData,
          dues: dues || [],
          transactions: transactions?.data || [],
          receipts: receipts?.data || [],
          organizations: organizations || [],
        };
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
