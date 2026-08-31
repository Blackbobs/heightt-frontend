import { axiosConfig } from "@/utils/axios-config";

export interface Announcement {
  id: string;
  organizationId: string;
  authorId?: string;
  title: string;
  content: string;
  type: "GENERAL" | "IMPORTANT" | "URGENT" | "FINANCIAL" | "ACADEMIC" | "EVENT";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  isPublished: boolean;
  publishedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    username: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface AnnouncementRead {
  id: string;
  announcementId: string;
  userId: string;
  readAt: string;
}

export interface StudentPromotionNotification {
  event: "STUDENT_PROMOTED" | "STUDENT_GRADUATED";
  studentId: string;
  institutionId: string;
  institutionName: string;
  previousLevelId: string;
  previousLevel: string;
  currentLevelId: string | null;
  currentLevel: string | null;
  previousSessionId: string;
  previousSession: string;
  currentSessionId: string;
  currentSession: string;
  promotionId: string | null;
  promotedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "SYSTEM" | "FINANCIAL" | "ACADEMIC" | "EVENT" | "REMINDER" | "SECURITY";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  read: boolean;
  readAt?: string;
  deliveredAt?: string;
  data?: StudentPromotionNotification | Record<string, unknown>;
  metadata?: any;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  type: "SYSTEM" | "FINANCIAL" | "ACADEMIC" | "EVENT" | "REMINDER" | "SECURITY";
  email: boolean;
  push: boolean;
  inApp: boolean;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const communicationApi = {
  // ============ Announcements ============
  getAnnouncements: async (params?: {
    organizationId?: string;
    page?: number;
    limit?: number;
    isPublished?: boolean;
    type?: string;
    priority?: string;
  }): Promise<PaginatedResponse<Announcement>> => {
    try {
      const response = await axiosConfig.get(
        "/communication/announcements",
        { params },
      );
      return (
        response.data || {
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }
      );
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      return {
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
  },

  getAnnouncement: async (id: string): Promise<Announcement | null> => {
    try {
      const response = await axiosConfig.get(
        `/communication/announcements/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch announcement:", error);
      return null;
    }
  },

  markAnnouncementAsRead: async (id: string): Promise<void> => {
    await axiosConfig.post(`/communication/announcements/${id}/read`);
  },

  // ============ Notifications ============
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
  }): Promise<PaginatedResponse<Notification>> => {
    try {
      const response = await axiosConfig.get(
        "/communication/notifications",
        { params },
      );
      return (
        response.data || {
          data: [],
          meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return {
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    }
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      const response = await axiosConfig.get(
        "/communication/notifications/unread-count",
      );
      return response.data || { count: 0 };
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return { count: 0 };
    }
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await axiosConfig.patch(`/communication/notifications/${id}/read`);
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await axiosConfig.patch("/communication/notifications/read-all");
  },

  getNotificationPreferences: async (): Promise<NotificationPreference[]> => {
    try {
      const response = await axiosConfig.get(
        "/communication/notifications/preferences",
      );
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
      return [];
    }
  },

  updateNotificationPreferences: async (
    preferences: Array<{
      type: string;
      email: boolean;
      push: boolean;
      inApp: boolean;
    }>,
  ): Promise<NotificationPreference[]> => {
    const response = await axiosConfig.patch(
      "/communication/notifications/preferences",
      preferences,
    );
    return response.data;
  },
};
