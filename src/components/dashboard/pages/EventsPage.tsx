'use client';

import React, { useState } from 'react';
import { CalendarDays, MapPin, Tag, Ticket, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    price: '₦2,000', free: false, category: 'Tech', ticketAvail: 120, color: 'from-[#1a5cff] to-[#0f4ad0]', registered: true,
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
  const [registered, setRegistered] = useState<Set<string>>(
    new Set(EVENTS.filter(e => e.registered).map(e => e.id))
  );

  const filtered = EVENTS.filter((e) => {
    const catMatch = category === 'All' || e.category === category;
    const searchMatch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer.toLowerCase().includes(search.toLowerCase());
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
      <div className={cn('rounded-[22px] p-6 text-white relative overflow-hidden bg-gradient-to-br', EVENTS[0].color)}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
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
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white text-violet-600'
            )}
          >
            <Ticket className="w-3.5 h-3.5" />
            {registered.has(EVENTS[0].id) ? 'Registered ✓' : 'Get Ticket'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search events…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8ecf1] rounded-[12px] pl-10 pr-4 py-3 text-[0.82rem] text-[#1a1a2e] placeholder-[#b0bac8] outline-none focus:border-[#1a5cff] transition-colors"
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
                ? 'bg-[#1a5cff] text-white'
                : 'bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-2.5">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 bg-white border border-[#e8ecf1] rounded-[16px]">
            <CalendarDays className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">No events found</p>
          </div>
        )}
        {filtered.map((ev) => {
          const isReg = registered.has(ev.id);
          return (
            <div key={ev.id} className="bg-white border border-[#e8ecf1] rounded-[16px] px-4 py-4 hover:bg-[#fafbff] transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className={cn('rounded-[10px] px-3 py-2 text-center min-w-[46px] flex-shrink-0 bg-gradient-to-br text-white', ev.color)}>
                  <span className="block text-[1rem] font-extrabold leading-none">{ev.day}</span>
                  <span className="block text-[0.52rem] font-bold uppercase tracking-wide mt-0.5">{ev.month}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-[#1a1a2e] leading-snug truncate">{ev.title}</p>
                      <p className="text-[0.62rem] text-[#7a8ba3] mt-0.5">{ev.organizer}</p>
                    </div>
                    {isReg && (
                      <span className="flex-shrink-0 text-[0.58rem] font-bold bg-[#e6f7f0] text-[#0f7b4a] px-2 py-0.5 rounded-full">Registered</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center gap-1 text-[0.6rem] text-[#7a8ba3]">
                      <MapPin className="w-3 h-3" />
                      <span>{ev.venue}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[0.6rem] text-[#7a8ba3]">
                      <Tag className="w-3 h-3" />
                      <span>{ev.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className={cn('text-[0.82rem] font-bold', ev.free ? 'text-[#0f7b4a]' : 'text-[#1a1a2e]')}>{ev.price}</p>
                      <p className="text-[0.58rem] text-[#b0bac8]">{ev.ticketAvail} tickets left</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRegister(ev.id); }}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.7rem] font-bold border cursor-pointer transition-all active:scale-95',
                        isReg
                          ? 'bg-[#f0f2f5] text-[#6b7a8f] border-[#e8ecf1]'
                          : 'bg-[#1a5cff] text-white border-transparent hover:bg-[#0f4ad0]'
                      )}
                    >
                      <Ticket className="w-3 h-3" />
                      {isReg ? 'Cancel' : (ev.free ? 'Register' : 'Buy Ticket')}
                    </button>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#c8d0db] group-hover:text-[#6b7a8f] transition-colors flex-shrink-0 mt-0.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
