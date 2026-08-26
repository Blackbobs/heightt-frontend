"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Bell,
  AlertCircle,
  CreditCard,
  Calendar,
  Megaphone,
  Shield,
  Clock,
  Check,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/queries/useCommunication";
import { Notification } from "@/lib/api/communication";

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  SYSTEM: <Shield className="w-4 h-4 text-[#1a5cff]" />,
  FINANCIAL: <CreditCard className="w-4 h-4 text-emerald-600" />,
  ACADEMIC: <Calendar className="w-4 h-4 text-violet-600" />,
  EVENT: <Megaphone className="w-4 h-4 text-amber-600" />,
  REMINDER: <Clock className="w-4 h-4 text-blue-600" />,
  SECURITY: <Shield className="w-4 h-4 text-red-600" />,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  SYSTEM: "bg-[#eef3ff] border-[#1a5cff]/20",
  FINANCIAL: "bg-emerald-50 border-emerald-200/50",
  ACADEMIC: "bg-violet-50 border-violet-200/50",
  EVENT: "bg-amber-50 border-amber-200/50",
  REMINDER: "bg-blue-50 border-blue-200/50",
  SECURITY: "bg-red-50 border-red-200/50",
};

const NOTIFICATION_LABELS: Record<string, string> = {
  SYSTEM: "System",
  FINANCIAL: "Financial",
  ACADEMIC: "Academic",
  EVENT: "Event",
  REMINDER: "Reminder",
  SECURITY: "Security",
};

const TABS = ["All", "Unread", "Financial", "Academic", "Event", "System"];

// Extracted Notification Item Component
const NotificationItem = React.memo(
  ({
    notification,
    isRead,
    onMarkAsRead,
    isPending,
  }: {
    notification: Notification;
    isRead: boolean;
    onMarkAsRead: (id: string) => void;
    isPending: boolean;
  }) => {
    const icon =
      NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.SYSTEM;
    const colorClass =
      NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.SYSTEM;
    const label = NOTIFICATION_LABELS[notification.type] || notification.type;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    return (
      <div
        className={cn(
          "bg-white border rounded-[16px] p-4 transition-all",
          isRead ? "border-[#e8ecf1]" : "border-[#1a5cff]/30 shadow-sm",
          colorClass,
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0",
              isRead ? "bg-[#f8faff]" : "bg-white/80",
            )}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-[0.82rem] font-semibold text-[#1a1a2e] leading-snug",
                      isRead ? "font-normal" : "font-bold",
                    )}
                  >
                    {notification.title}
                  </p>
                  {!isRead && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#1a5cff]" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[0.58rem] font-medium text-[#7a8ba3]">
                    {label}
                  </span>
                  <span className="text-[0.58rem] text-[#b0bac8]">•</span>
                  <span className="text-[0.58rem] text-[#b0bac8]">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
              {!isRead && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  disabled={isPending}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1a5cff]/10 hover:bg-[#1a5cff]/20 flex items-center justify-center border-none cursor-pointer transition-colors disabled:opacity-50"
                  aria-label="Mark as read"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#1a5cff] animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-[#1a5cff]" />
                  )}
                </button>
              )}
            </div>
            <p className="text-[0.75rem] text-[#4a5568] leading-relaxed mt-2">
              {notification.body}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

NotificationItem.displayName = "NotificationItem";

export function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotifications({ limit: 50 });
  const { data: unreadCount, refetch: refetchUnread } =
    useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const [tab, setTab] = useState("All");

  // Filter notifications - memoized
  const filtered = useMemo(() => {
    if (!notifications) return [];
    let filtered = notifications;

    if (tab === "Unread") {
      filtered = filtered.filter((n: Notification) => !n.read);
    } else if (tab !== "All") {
      filtered = filtered.filter(
        (n: Notification) => n.type === tab.toUpperCase(),
      );
    }

    return filtered;
  }, [notifications, tab]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsReadMutation.mutateAsync(id);
        await refetchUnread();
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [markAsReadMutation, refetchUnread],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      await refetchUnread();
      await refetch();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  }, [markAllAsReadMutation, refetchUnread, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#1a5cff] animate-spin" />
          <span className="text-sm text-[#5b6d89] font-medium">
            Loading notifications...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
        <p className="font-semibold">Error loading notifications</p>
        <p className="text-sm">{error?.message || "Something went wrong"}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {(unreadCount ?? 0) > 0 ? (
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eef4ff] hover:bg-[#1a5cff] text-[#1a5cff] hover:text-white border border-[#1a5cff]/25 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {markAllAsReadMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            <span>Mark all as read</span>
          </button>
        ) : (
          <div className="text-xs font-semibold text-slate-400 bg-white/70 border border-slate-200/60 px-3 py-1.5 rounded-xl">
            All caught up
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map((t) => {
          const count =
            t === "Unread"
              ? (unreadCount ?? 0)
              : t === "All"
                ? (notifications?.length ?? 0)
                : (notifications?.filter(
                    (n: Notification) => n.type === t.toUpperCase(),
                  ).length ?? 0);

          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-shrink-0 text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all flex items-center gap-1.5",
                tab === t
                  ? "bg-[#1a5cff] text-white"
                  : "bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]",
              )}
            >
              {t}
              {count > 0 && (
                <span
                  className={cn(
                    "text-[0.55rem] px-1.5 py-0.5 rounded-full",
                    tab === t
                      ? "bg-white/20 text-white"
                      : "bg-[#f0f2f5] text-[#6b7a8f]",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#e8ecf1] rounded-[16px] p-10 text-center">
            <Bell className="w-8 h-8 text-[#c8d0db] mx-auto mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">
              No notifications found
            </p>
            <p className="text-[0.7rem] text-[#b0bac8] mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          filtered.map((notification: Notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isRead={notification.read}
              onMarkAsRead={handleMarkAsRead}
              isPending={markAsReadMutation.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
}
