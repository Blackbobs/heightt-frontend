// src/hooks/queries/useUser.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, User, UpdateProfilePayload } from "@/lib/api/users";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";

export function useCurrentUser() {
  const { isAuthenticated, user: authUser, fetchCurrentUser, setUser } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: async () => {
      try {
        // Always fetch fresh from API to get the latest data including studentProfile
        console.log("useCurrentUser - Fetching from API...");
        const user = await fetchCurrentUser();
        console.log("useCurrentUser - User fetched:", user);
        return user;
      } catch (error) {
        console.error("useCurrentUser - Error:", error);
        // If we have user in store as fallback, return it
        if (authUser) {
          console.log("useCurrentUser - Falling back to authUser");
          return authUser;
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 60 * 1000, // 1 minute - refresh more frequently
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useUserOrganizations() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.user.organizations(),
    queryFn: () => usersApi.getUserOrganizations(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => usersApi.updateProfile(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(queryKeys.user.current, user);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.current });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}