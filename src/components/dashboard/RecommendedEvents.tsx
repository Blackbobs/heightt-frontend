'use client';

import React from 'react';
import { SectionTitle } from './SectionTitle';

interface Event {
  day: string;
  month: string;
  title: string;
  venue: string;
  price: string;
  free?: boolean;
}

const EVENTS: Event[] = [
  { day: '5',  month: 'Dec', title: 'Faculty Science Gala Night',  venue: 'Main Hall',       price: '₦5,000' },
  { day: '22', month: 'Nov', title: 'NACOSS Tech Expo',            venue: 'ICT Centre',      price: '₦2,000' },
  { day: '28', month: 'Nov', title: 'Inter-Hall Sports Finale',    venue: 'Sports Complex',  price: '₦1,000' },
  { day: '1',  month: 'Dec', title: 'Career Fair 2025',            venue: 'Online',          price: 'Free', free: true },
];

export function RecommendedEvents() {
  return (
    <div className="mb-2">
      <SectionTitle title="Recommended events" linkLabel="Browse all" />
      <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F1F5F9] overflow-hidden">
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 px-4 py-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div className="bg-[#EFF6FF] rounded-[8px] px-2.5 py-1 text-center min-w-[40px] flex-shrink-0">
              <span className="block text-[0.88rem] font-bold text-[#2563EB] leading-none">{ev.day}</span>
              <span className="block text-[0.5rem] font-semibold text-[#2563EB] uppercase tracking-wide mt-0.5">{ev.month}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.78rem] font-medium text-[#0B1020] truncate">{ev.title}</p>
              <p className="text-[0.58rem] text-[#64748B] mt-0.5">{ev.venue}</p>
            </div>
            <span
              className={`text-[0.72rem] font-semibold flex-shrink-0 ${ev.free ? 'text-[#0f7b4a]' : 'text-[#0B1020]'}`}
            >
              {ev.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
