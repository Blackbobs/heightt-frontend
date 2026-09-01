import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";

export function invalidateUserCache(queryClient: QueryClient, userId?: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
  queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
  queryClient.invalidateQueries({
    queryKey: queryKeys.user.organizations(userId),
  });
}

export async function invalidateFinanceCache(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["student-dues"] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.finance.transactions() }),
    queryClient.invalidateQueries({ queryKey: ["payments"] }),
    queryClient.invalidateQueries({ queryKey: ["receipts"] }),
  ]);
}

export async function invalidateDashboardCache(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
}
