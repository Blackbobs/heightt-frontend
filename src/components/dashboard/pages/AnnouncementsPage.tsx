'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, Bell, ChevronRight, Clock } from 'lucide-react';
import { HeighttLoader } from '@/components/ui/HeighttLoader';
import { useAnnouncements, useMarkAnnouncementAsRead } from '@/hooks/queries/useCommunication';
import type { Announcement } from '@/lib/api/communication';
import { cn } from '@/lib/utils';

const FILTERS = ['All', 'GENERAL', 'IMPORTANT', 'URGENT', 'FINANCIAL', 'ACADEMIC', 'EVENT'];

const labelFor = (type: string) => type.charAt(0) + type.slice(1).toLowerCase();

const toneFor = (type: string) => {
  if (type === 'URGENT') return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300';
  if (type === 'IMPORTANT') return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300';
  if (type === 'FINANCIAL') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300';
  return 'bg-slate-100 text-slate-600 dark:bg-[#292C31] dark:text-slate-300';
};

function sourceFor(announcement: Announcement) {
  if (announcement.organization?.name) return announcement.organization.name;
  const profile = announcement.author?.profile;
  if (profile) return `${profile.firstName} ${profile.lastName}`.trim() || announcement.author?.username;
  return 'Heightt';
}

function dateFor(announcement: Announcement) {
  const value = announcement.publishedAt || announcement.createdAt;
  return value ? new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date unavailable';
}

export function AnnouncementsPage() {
  const { data: announcements = [], isLoading, isError, refetch } = useAnnouncements({ limit: 50, isPublished: true });
  const markAsRead = useMarkAnnouncementAsRead();
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => filter === 'All' ? announcements : announcements.filter((item: Announcement) => item.type === filter),
    [announcements, filter],
  );
  const unreadCount = announcements.filter((item: Announcement) => !readIds.has(item.id)).length;

  const toggle = (id: string) => {
    setExpandedId((current) => current === id ? null : id);
    if (readIds.has(id)) return;
    setReadIds((current) => new Set(current).add(id));
    markAsRead.mutate(id);
  };

  if (isLoading) {
    return <div className="flex min-h-[360px] items-center justify-center"><HeighttLoader label="Loading announcements" /></div>;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <AlertCircle className="mb-3 h-5 w-5" />
        <h2 className="font-bold">Unable to load announcements</h2>
        <p className="mt-1 text-sm">Please try again.</p>
        <button onClick={() => refetch()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#30343A] dark:bg-[#191B1E] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#0B1020] dark:text-white">Announcements</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread updates` : 'You are all caught up'}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300">
            <Bell className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-[#30343A] dark:text-slate-400">
          {announcements.length} total announcements
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn(
              'flex-shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition-colors',
              filter === item
                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-[#2563EB] dark:border-[#30343A] dark:bg-[#191B1E] dark:text-slate-300',
            )}
          >
            {item === 'All' ? item : labelFor(item)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-[#30343A] dark:bg-[#191B1E]">
            <Bell className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-500">No announcements found</p>
          </div>
        )}
        {filtered.map((announcement: Announcement) => {
          const expanded = expandedId === announcement.id;
          const unread = !readIds.has(announcement.id);
          return (
            <article key={announcement.id} className={cn('overflow-hidden rounded-xl border bg-white dark:bg-[#191B1E]', unread ? 'border-blue-300 dark:border-blue-800' : 'border-slate-200 dark:border-[#30343A]')}>
              <button onClick={() => toggle(announcement.id)} className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-[#202328]">
                <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg', toneFor(announcement.type))}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h2 className="flex-1 text-sm font-bold text-[#0B1020] dark:text-white">{announcement.title}</h2>
                    {unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-[#2563EB]" />}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className={cn('rounded px-2 py-1 font-semibold', toneFor(announcement.type))}>{labelFor(announcement.type)}</span>
                    <span>{sourceFor(announcement)}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{dateFor(announcement)}</span>
                  </div>
                </div>
                <ChevronRight className={cn('mt-1 h-4 w-4 flex-shrink-0 text-slate-400 transition-transform', expanded && 'rotate-90')} />
              </button>
              {expanded && <p className="border-t border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-[#30343A] dark:bg-[#202328] dark:text-slate-300">{announcement.content}</p>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
