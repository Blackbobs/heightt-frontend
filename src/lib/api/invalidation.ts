import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export function invalidateUserCache(queryClient: QueryClient, userId?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
  queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
  queryClient.invalidateQueries({
    queryKey: queryKeys.user.organizations(userId),
  });
}

export function invalidateFinanceCache(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.finance.myDues });
  queryClient.invalidateQueries({ queryKey: queryKeys.finance.transactions() });
  queryClient.invalidateQueries({ queryKey: queryKeys.finance.receipts() });
}

export function invalidateDashboardCache(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
}
