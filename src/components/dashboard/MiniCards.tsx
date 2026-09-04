import React from 'react';



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
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[0.78rem] font-semibold text-[#0B1020]">Announcements</h4>
        <button className="text-[0.62rem] text-[#2563EB] border-none bg-transparent cursor-pointer hover:underline">All</button>
      </div>
      <div className="flex flex-col divide-y divide-[#F1F5F9]">
        {ANNOUNCEMENTS.map((a) => (
          <div key={a.title} className="py-2 first:pt-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity">
            <p className="text-[0.76rem] font-semibold text-[#0B1020] leading-snug">{a.title}</p>
            <p className="text-[0.58rem] text-[#64748B] mt-0.5">{a.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
