'use client';

import React, { useState } from 'react';
import { CalendarDays, MapPin, Tag, Ticket, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface Event {
  id: string;
  title: string;
  organizer: string;
  venue: string;
  date: string;
  day: string;
  month: string;
  price: string;
  free: boolean;
  category: string;
  ticketAvail: number;
  color: string;
  registered: boolean;
}

const EVENTS: Event[] = [
  {
    id: 'e1', title: 'Faculty Science Gala Night', organizer: 'Faculty of Science',
    venue: 'Main Auditorium', date: 'December 5, 2025', day: '5', month: 'Dec',
    price: '₦5,000', free: false, category: 'Social', ticketAvail: 47, color: 'from-violet-500 to-purple-600', registered: false,
  },
  {
    id: 'e2', title: 'NACOSS Tech Expo 2025', organizer: 'NACOSS',
    venue: 'ICT Centre', date: 'November 22, 2025', day: '22', month: 'Nov',
    price: '₦2,000', free: false, category: 'Tech', ticketAvail: 120, color: 'from-[#2563EB] to-[#1D4ED8]', registered: true,
  },
  {
    id: 'e3', title: 'Inter-Hall Sports Finale', organizer: 'Sports Directorate',
    venue: 'Sports Complex', date: 'November 28, 2025', day: '28', month: 'Nov',
    price: '₦1,000', free: false, category: 'Sports', ticketAvail: 200, color: 'from-emerald-500 to-teal-600', registered: false,
  },
  {
    id: 'e4', title: 'Career Fair 2025', organizer: 'Career Services',
    venue: 'Online / Zoom', date: 'December 1, 2025', day: '1', month: 'Dec',
    price: 'Free', free: true, category: 'Career', ticketAvail: 500, color: 'from-amber-500 to-orange-500', registered: false,
  },
  {
    id: 'e5', title: 'Post-UTME Mentorship Day', organizer: 'Student Union',
    venue: 'Senate Building', date: 'December 8, 2025', day: '8', month: 'Dec',
    price: 'Free', free: true, category: 'Academic', ticketAvail: 300, color: 'from-rose-500 to-pink-600', registered: true,
  },
];

const CATEGORIES = ['All', 'Tech', 'Social', 'Sports', 'Career', 'Academic'];

export function EventsPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [registered, setRegistered] = useState<Set<string>>(
    new Set(EVENTS.filter(e => e.registered).map(e => e.id))
  );

  const filtered = EVENTS.filter((e) => {
    const catMatch = category === 'All' || e.category === category;
    const searchMatch = !debouncedSearch ||
      e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      e.organizer.toLowerCase().includes(debouncedSearch.toLowerCase());
    return catMatch && searchMatch;
  });

  const toggleRegister = (id: string) => {
    setRegistered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Featured event banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0B1020] p-6 text-white">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden="true" />
        <span className="inline-block text-[0.62rem] font-bold bg-white/20 px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          Featured Event
        </span>
        <h2 className="text-[1.2rem] font-extrabold leading-tight mb-1">{EVENTS[0].title}</h2>
        <div className="flex items-center gap-1.5 text-[0.68rem] text-white/70 mb-4">
          <CalendarDays className="w-3 h-3" />
          <span>{EVENTS[0].date}</span>
          <span>·</span>
          <MapPin className="w-3 h-3" />
          <span>{EVENTS[0].venue}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] text-white/60">Ticket Price</p>
            <p className="text-[1.1rem] font-bold">{EVENTS[0].price}</p>
          </div>
          <button
            onClick={() => toggleRegister(EVENTS[0].id)}
            className={cn(
              'flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[0.75rem] font-bold border-none cursor-pointer transition-all active:scale-95',
              registered.has(EVENTS[0].id)
                ? 'border border-white/30 bg-white/15 text-white'
                : 'bg-[#2563EB] text-white'
            )}
          >
            <Ticket className="w-3.5 h-3.5" />
            {registered.has(EVENTS[0].id) ? 'Registered ✓' : 'Get Ticket'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm text-[#0B1020] outline-none transition-colors placeholder:text-slate-400 focus:border-[#2563EB] dark:border-slate-800 dark:bg-[#131B2E] dark:text-white"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'flex-shrink-0 text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all',
              category === cat
                ? 'bg-[#2563EB] text-white'
                : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] dark:border-slate-800 dark:bg-[#131B2E] dark:text-slate-300'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white py-12 dark:border-slate-800 dark:bg-[#131B2E]">
            <CalendarDays className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#64748B]">No events found</p>
          </div>
        )}
        {filtered.map((ev) => {
          const isReg = registered.has(ev.id);
          return (
            <div key={ev.id} className="group cursor-pointer rounded-2xl border border-[#E2E8F0] bg-white px-4 py-4 transition-colors hover:bg-[#F8FAFC] dark:border-slate-800 dark:bg-[#131B2E] dark:hover:bg-slate-900">
              <div className="flex items-start gap-3">
                <div className="min-w-[46px] flex-shrink-0 rounded-xl bg-[#2563EB]/10 px-3 py-2 text-center text-[#2563EB]">
                  <span className="block text-[1rem] font-extrabold leading-none">{ev.day}</span>
                  <span className="block text-[0.52rem] font-bold uppercase tracking-wide mt-0.5">{ev.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold leading-snug text-[#0B1020] dark:text-white">{ev.title}</p>
                      <p className="text-[0.62rem] text-[#64748B] mt-0.5">{ev.organizer}</p>
                    </div>
                    {isReg && (
                      <span className="flex-shrink-0 text-[0.58rem] font-bold bg-[#e6f7f0] text-[#0f7b4a] px-2 py-0.5 rounded-full">Registered</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center gap-1 text-[0.6rem] text-[#64748B]">
                      <MapPin className="w-3 h-3" />
                      <span>{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[0.6rem] text-[#64748B]">
                      <Tag className="w-3 h-3" />
                      <span>{ev.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className={cn('text-[0.82rem] font-bold', ev.free ? 'text-[#0f7b4a]' : 'text-[#0B1020]')}>{ev.price}</p>
                      <p className="text-[0.58rem] text-[#b0bac8]">{ev.ticketAvail} tickets left</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRegister(ev.id); }}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.7rem] font-bold border cursor-pointer transition-all active:scale-95',
                        isReg
                          ? 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                          : 'bg-[#2563EB] text-white border-transparent hover:bg-[#1D4ED8]'
                      )}
                    >
                      <Ticket className="w-3 h-3" />
                      {isReg ? 'Cancel' : (ev.free ? 'Register' : 'Buy Ticket')}
                    </button>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#c8d0db] group-hover:text-[#64748B] transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
