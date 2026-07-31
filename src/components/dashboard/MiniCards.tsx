import React from 'react';

interface SavingGoal {
  name: string;
  pct: number;
}

const GOALS: SavingGoal[] = [
  { name: 'Dept. Dues',       pct: 74 },
  { name: 'Faculty Ticket',   pct: 64 },
  { name: 'Convocation Gown', pct: 36 },
];

export function SavingsMiniCard() {
  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[16px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[0.78rem] font-semibold text-[#1a1a2e]">Savings</h4>
        <button className="text-[0.62rem] text-[#1a5cff] border-none bg-transparent cursor-pointer hover:underline">Manage</button>
      </div>
      <div className="flex flex-col gap-3">
        {GOALS.map((g) => (
          <div key={g.name}>
            <div className="flex justify-between mb-1">
              <span className="text-[0.7rem] font-medium text-[#1a1a2e]">{g.name}</span>
              <span className="text-[0.7rem] font-semibold text-[#1a5cff]">{g.pct}%</span>
            </div>
            <div className="h-[4px] bg-[#e8ecf1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1a5cff] rounded-full"
                style={{ width: `${g.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Announcement {
  title: string;
  source: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  { title: 'Mid-semester Test Schedule',     source: 'Comp. Sci. Dept' },
  { title: 'Faculty Week 2025 — Save Date',  source: 'Faculty of Science' },
  { title: 'SUG Election Timetable',         source: 'Student Union' },
];

export function AnnouncementsMiniCard() {
  return (
    <div className="bg-white border border-[#e8ecf1] rounded-[16px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[0.78rem] font-semibold text-[#1a1a2e]">Announcements</h4>
        <button className="text-[0.62rem] text-[#1a5cff] border-none bg-transparent cursor-pointer hover:underline">All</button>
      </div>
      <div className="flex flex-col divide-y divide-[#f0f2f5]">
        {ANNOUNCEMENTS.map((a) => (
          <div key={a.title} className="py-2 first:pt-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity">
            <p className="text-[0.76rem] font-semibold text-[#1a1a2e] leading-snug">{a.title}</p>
            <p className="text-[0.58rem] text-[#7a8ba3] mt-0.5">{a.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
