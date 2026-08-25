// src/hooks/queries/useOrganizations.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationsApi } from "@/lib/api/organizations";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";

export function useBrowseOrganizations(params?: {
  page?: number;
  limit?: number;
  institutionId?: string;
  departmentId?: string;
  status?: string;
  type?: string;
  search?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.organizations.all(params),
    queryFn: async () => {
      const result = await organizationsApi.getOrganizations({
        status: "ACTIVE",
        limit: 50,
        ...params,
      });
      return {
        organizations: result?.data || [],
        meta: result?.meta || { page: 1, limit: 50, total: 0, totalPages: 0 },
      };
    },
    enabled: isAuthenticated && !!params?.institutionId,
    staleTime: 3 * 60 * 1000,
  });
}

export function useJoinOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      sessionId,
    }: {
      organizationId: string;
      sessionId?: string;
    }) => organizationsApi.joinOrganization(organizationId, "STUDENT", sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.organizations(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.all(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
    onError: (error: any) => {
      console.error("Failed to join organization:", error);
      throw error;
    },
  });
}