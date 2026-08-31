import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  communicationApi,
  Announcement,
  Notification,
} from "@/lib/api/communication";
import { queryKeys } from "@/lib/api/keys";
import { useAuthStore } from "@/store/auth-store";

// ============ Announcement Hooks ============
export function useAnnouncements(params?: {
  organizationId?: string;
  page?: number;
  limit?: number;
  isPublished?: boolean;
  type?: string;
  priority?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["announcements", params],
    queryFn: async () => {
      const result = await communicationApi.getAnnouncements(params);
      return result?.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMarkAnnouncementAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communicationApi.markAnnouncementAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

// ============ Notification Hooks ============
export function useNotifications(params?: {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      const result = await communicationApi.getNotifications(params);
      return result?.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: false,
  });
}

export function useUnreadNotificationCount() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const result = await communicationApi.getUnreadCount();
      return result?.count || 0;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communicationApi.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => communicationApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}

export function useNotificationPreferences() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: () => communicationApi.getNotificationPreferences(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
