'use client';

import React, { useState } from 'react';
import { Bell, BookOpen, Users, Megaphone, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type Category = 'Dept' | 'Faculty' | 'Union' | 'General';

interface Announcement {
  id: string;
  title: string;
  body: string;
  source: string;
  category: Category;
  date: string;
  unread: boolean;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Mid-Semester Test Schedule — CSC 400',
    body: 'Mid-semester tests for all 400-level Computer Science courses are scheduled for November 25–28, 2025. All students must be present. Venue: Faculty of Science complex.',
    source: 'Comp. Sci. Dept',
    category: 'Dept',
    date: 'Nov 14, 2025',
    unread: true,
  },
  {
    id: 'a2',
    title: 'Faculty Week 2025 — Save the Date',
    body: 'The annual Faculty of Science Week is scheduled for November 30 – December 5, 2025. Expect exhibitions, inter-departmental competitions, a gala night, and more.',
    source: 'Faculty of Science',
    category: 'Faculty',
    date: 'Nov 10, 2025',
    unread: true,
  },
  {
    id: 'a3',
    title: 'SUG Presidential Election — Timetable',
    body: 'The Student Union Government has released the timetable for the 2025/26 session presidential elections. Campaigns begin December 1. Voting day is December 10, 2025.',
    source: 'Student Union Govt',
    category: 'Union',
    date: 'Nov 8, 2025',
    unread: false,
  },
  {
    id: 'a4',
    title: 'Clearance Deadline for Graduating Students',
    body: 'All graduating students (final year) must complete their academic clearance on or before December 20, 2025. The Academic Registry will close after this date.',
    source: 'Academic Registry',
    category: 'General',
    date: 'Nov 5, 2025',
    unread: false,
  },
  {
    id: 'a5',
    title: 'NACOSS Tech Expo — Call for Papers',
    body: 'The Nigeria Association of Computing Students is inviting papers, projects, and presentations for the 2025 Tech Expo, holding November 22 at the ICT Centre.',
    source: 'NACOSS',
    category: 'Dept',
    date: 'Oct 30, 2025',
    unread: false,
  },
  {
    id: 'a6',
    title: 'First-Semester Examination Timetable',
    body: 'The first-semester examination timetable for the 2025/26 session has been released. Students should check the school portal for their individual schedules.',
    source: 'Exams & Records',
    category: 'General',
    date: 'Oct 25, 2025',
    unread: false,
  },
];

const CAT_CONFIG: Record<Category, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  Dept:    { label: 'Department', icon: <BookOpen className="w-3.5 h-3.5" />,  color: 'text-[#1a5cff]',  bg: 'bg-[#eef3ff]' },
  Faculty: { label: 'Faculty',    icon: <Users className="w-3.5 h-3.5" />,     color: 'text-violet-600', bg: 'bg-violet-50' },
  Union:   { label: 'Union',      icon: <Megaphone className="w-3.5 h-3.5" />, color: 'text-amber-600',  bg: 'bg-amber-50'  },
  General: { label: 'General',    icon: <Bell className="w-3.5 h-3.5" />,      color: 'text-[#0f7b4a]',  bg: 'bg-[#e6f7f0]' },
};

const TABS = ['All', 'Dept', 'Faculty', 'Union', 'General'];

export function AnnouncementsPage() {
  const [tab, setTab] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  const filtered = ANNOUNCEMENTS.filter(
    (a) => tab === 'All' || a.category === tab
  );

  const unreadCount = ANNOUNCEMENTS.filter((a) => a.unread && !readSet.has(a.id)).length;

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
    setReadSet((prev) => new Set([...prev, id]));
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[20px] px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-[8px] bg-white/15 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-white/70">Announcements</span>
        </div>
        <p className="text-[1.5rem] font-extrabold">{ANNOUNCEMENTS.length} <span className="text-[1rem] font-medium text-white/60">total</span></p>
        <p className="text-[0.72rem] text-white/60 mt-0.5">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'} · 4 departments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-shrink-0 text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all',
              tab === t
                ? 'bg-[#1a5cff] text-white'
                : 'bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Announcement List */}
      <div className="space-y-2.5">
        {filtered.map((ann) => {
          const cfg = CAT_CONFIG[ann.category];
          const isUnread = ann.unread && !readSet.has(ann.id);
          const isExpanded = expanded === ann.id;

          return (
            <div
              key={ann.id}
              className={cn(
                'bg-white border rounded-[16px] overflow-hidden cursor-pointer transition-all',
                isUnread ? 'border-[#1a5cff]/30' : 'border-[#e8ecf1]'
              )}
              onClick={() => toggleExpand(ann.id)}
            >
              <div className="px-4 py-4 hover:bg-[#fafbff] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5', cfg.bg, cfg.color)}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-[0.82rem] font-semibold text-[#1a1a2e] leading-snug', isUnread && 'font-bold')}>
                        {ann.title}
                      </p>
                      {isUnread && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#1a5cff] mt-1.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={cn('text-[0.58rem] font-semibold px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
                        {cfg.label}
                      </span>
                      <span className="text-[0.58rem] text-[#7a8ba3]">{ann.source}</span>
                    </div>
                  </div>
                  <ChevronRight className={cn('w-4 h-4 text-[#c8d0db] flex-shrink-0 mt-0.5 transition-transform', isExpanded && 'rotate-90')} />
                </div>

                <div className="flex items-center gap-1 mt-2 ml-11">
                  <Clock className="w-3 h-3 text-[#b0bac8]" />
                  <span className="text-[0.58rem] text-[#7a8ba3]">{ann.date}</span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-[#f0f2f5] px-4 py-4 bg-[#fafbff]">
                  <p className="text-[0.8rem] text-[#4a5568] leading-relaxed">{ann.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
