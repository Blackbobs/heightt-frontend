"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Bell,
  BookOpen,
  Users,
  Megaphone,
  ChevronRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAnnouncements,
  useMarkAnnouncementAsRead,
} from "@/hooks/queries/useCommunication";
import { Announcement } from "@/lib/api/communication";
import { HeighttLoader } from "@/components/ui/HeighttLoader";

const CAT_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  GENERAL: {
    label: "General",
    icon: <Bell className="w-3.5 h-3.5" />,
    color: "text-[#0f7b4a]",
    bg: "bg-[#e6f7f0]",
  },
  IMPORTANT: {
    label: "Important",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  URGENT: {
    label: "Urgent",
    icon: <Megaphone className="w-3.5 h-3.5" />,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  FINANCIAL: {
    label: "Financial",
    icon: <Bell className="w-3.5 h-3.5" />,
    color: "text-[#2563EB]",
    bg: "bg-[#EFF6FF]",
  },
  ACADEMIC: {
    label: "Academic",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  EVENT: {
    label: "Event",
    icon: <Users className="w-3.5 h-3.5" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

const TABS = [
  "All",
  "GENERAL",
  "IMPORTANT",
  "URGENT",
  "FINANCIAL",
  "ACADEMIC",
  "EVENT",
];
const TAB_LABELS: Record<string, string> = {
  All: "All",
  GENERAL: "General",
  IMPORTANT: "Important",
  URGENT: "Urgent",
  FINANCIAL: "Financial",
  ACADEMIC: "Academic",
  EVENT: "Event",
};

// Extracted Announcement Item Component for better performance
const AnnouncementItem = React.memo(
  ({
    announcement,
    isExpanded,
    isUnread,
    onToggle,
  }: {
    announcement: Announcement;
    isExpanded: boolean;
    isUnread: boolean;
    onToggle: (id: string) => void;
  }) => {
    const cfg = CAT_CONFIG[announcement.type] || CAT_CONFIG.GENERAL;

    const formatDate = (dateString?: string) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const getSourceName = () => {
      if (announcement.organization?.name) {
        return announcement.organization.name;
      }
      if (announcement.author?.profile) {
        const { firstName, lastName } = announcement.author.profile;
        return (
          `${firstName} ${lastName}`.trim() || announcement.author.username
        );
      }
      return "Unknown";
    };

    return (
      <div
        className={cn(
          "bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all",
          isUnread ? "border-[#2563EB]/30" : "border-[#E2E8F0]",
        )}
        onClick={() => onToggle(announcement.id)}
      >
        <div className="px-4 py-4 hover:bg-[#F8FAFC] transition-colors">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5",
                cfg.bg,
                cfg.color,
              )}
            >
              {cfg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-[0.82rem] font-semibold text-[#0B1020] leading-snug",
                    isUnread && "font-bold",
                  )}
                >
                  {announcement.title}
                </p>
                {isUnread && (
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#2563EB] mt-1.5" />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={cn(
                    "text-[0.58rem] font-semibold px-2 py-0.5 rounded-full",
                    cfg.bg,
                    cfg.color,
                  )}
                >
                  {cfg.label}
                </span>
                <span className="text-[0.58rem] text-[#64748B]">
                  {getSourceName()}
                </span>
              </div>
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 text-[#c8d0db] flex-shrink-0 mt-0.5 transition-transform",
                isExpanded && "rotate-90",
              )}
            />
          </div>

          <div className="flex items-center gap-1 mt-2 ml-11">
            <Clock className="w-3 h-3 text-[#b0bac8]" />
            <span className="text-[0.58rem] text-[#64748B]">
              {formatDate(announcement.publishedAt || announcement.createdAt)}
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-[#F1F5F9] px-4 py-4 bg-[#F8FAFC]">
            <p className="text-[0.8rem] text-[#4a5568] leading-relaxed whitespace-pre-wrap">
              {announcement.content}
            </p>
          </div>
        )}
      </div>
    );
  },
);

AnnouncementItem.displayName = "AnnouncementItem";

export function AnnouncementsPage() {
  const {
    data: announcements,
    isLoading,
    isError,
    error,
    refetch,
  } = useAnnouncements({
    limit: 50,
    isPublished: true,
  });
  const markAsReadMutation = useMarkAnnouncementAsRead();

  const [tab, setTab] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  // Filter announcements - memoized
  const filtered = useMemo(() => {
    if (!announcements) return [];
    if (tab === "All") return announcements;
    return announcements.filter((a: Announcement) => a.type === tab);
  }, [announcements, tab]);

  // Count unread - memoized
  const unreadCount = useMemo(() => {
    if (!announcements) return 0;
    return announcements.filter((a: Announcement) => !readSet.has(a.id)).length;
  }, [announcements, readSet]);

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));

      // Mark as read if not already
      if (!readSet.has(id)) {
        setReadSet((prev) => new Set([...prev, id]));
        markAsReadMutation.mutate(id);
      }
    },
    [readSet, markAsReadMutation],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <HeighttLoader label="Loading announcements" />
          <span className="text-sm text-[#64748B] font-medium">
            Loading announcements...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600">
        <p className="font-semibold">Error loading announcements</p>
        <p className="text-sm">Something went wrong. Please try again.</p>
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
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-3xl px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-[8px] bg-white/15 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-white/70">
            Announcements
          </span>
        </div>
        <p className="text-[1.5rem] font-extrabold">
          {announcements?.length || 0}{" "}
          <span className="text-[1rem] font-medium text-white/60">total</span>
        </p>
        <p className="text-[0.72rem] text-white/60 mt-0.5">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-shrink-0 text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all",
              tab === t
                ? "bg-[#2563EB] text-white"
                : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB]",
            )}
          >
            {TAB_LABELS[t] || t}
          </button>
        ))}
      </div>

      {/* Announcement List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
            <Bell className="w-8 h-8 text-[#c8d0db] mx-auto mb-2" />
            <p className="text-[0.82rem] font-medium text-[#64748B]">
              No announcements found
            </p>
          </div>
        ) : (
          filtered.map((ann: Announcement) => (
            <AnnouncementItem
              key={ann.id}
              announcement={ann}
              isExpanded={expandedId === ann.id}
              isUnread={!readSet.has(ann.id)}
              onToggle={toggleExpand}
            />
          ))
        )}
      </div>
    </div>
  );
}
