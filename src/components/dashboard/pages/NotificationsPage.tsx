'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Bell,
  Check,
  Loader2,
  CheckCheck,
  CreditCard,
  Shield,
  Calendar,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/queries/useCommunication';
import { Notification } from '@/lib/api/communication';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

const TABS = ['All', 'Unread'];

export function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications({ limit: 50 });
  const { data: unreadCount, refetch: refetchUnread } = useUnreadNotificationCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const [tab, setTab] = useState('All');

  const filtered = useMemo(() => {
    if (!notifications) return [];
    if (tab === 'Unread') return notifications.filter((n: Notification) => !n.read);
    return notifications;
  }, [notifications, tab]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsReadMutation.mutateAsync(id);
        await refetchUnread();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },
    [markAsReadMutation, refetchUnread]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      await refetchUnread();
      await refetch();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [markAllAsReadMutation, refetchUnread, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <HeighttLoader label="Loading notifications..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-600 dark:text-red-300">
        <p className="font-bold text-sm">Error loading notifications</p>
        <button type="button" onClick={() => refetch()} className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0B1020] dark:text-white">Notifications</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Important updates regarding your student dues and receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(unreadCount ?? 0) > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCheck className="w-3.5 h-3.5" />
              )}
              <span>Mark all as read</span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#131B2E] p-1 border border-slate-200 dark:border-slate-800 rounded-lg">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  'text-xs font-semibold px-3 py-1 rounded transition-colors',
                  tab === t
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-400'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center text-xs text-slate-500 dark:text-slate-400">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((n: Notification) => (
            <div
              key={n.id}
              className={cn(
                'bg-white dark:bg-[#131B2E] border rounded-lg p-4 transition-colors flex items-start justify-between gap-3',
                n.read
                  ? 'border-slate-200 dark:border-slate-800'
                  : 'border-[#2563EB] bg-blue-50/20 dark:bg-blue-950/20'
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0B1020] dark:text-white">
                    {n.title}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {n.body}
                </p>
                <p className="text-[10px] text-slate-400 font-mono pt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {!n.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(n.id)}
                  className="p-1.5 text-slate-400 hover:text-[#2563EB]"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
