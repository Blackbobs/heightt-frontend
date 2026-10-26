'use client';

import Link from 'next/link';
import { ArrowRight, Bell, CalendarDays, MapPin, Ticket } from 'lucide-react';

const EVENT_FEATURES = [
  {
    icon: CalendarDays,
    title: 'Discover campus events',
    description: 'Find academic, social, career, and community events from verified organizers.',
  },
  {
    icon: Ticket,
    title: 'Keep tickets in one place',
    description: 'Register, pay, and access your tickets from your Heightt account.',
  },
  {
    icon: MapPin,
    title: 'Know where to be',
    description: 'See the date, venue, organizer, and event updates before you leave.',
  },
];

export function EventsPage() {
  return (
    <div className="space-y-5 pb-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#30343A] dark:bg-[#191B1E] sm:p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300">
          <CalendarDays className="h-5 w-5" />
        </div>
        <h1 className="mt-5 max-w-xl text-2xl font-black tracking-tight text-[#0B1020] dark:text-white sm:text-3xl">
          Campus events are coming to Heightt
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          We are building a reliable way to discover verified events, register, and keep your tickets together. Event registration is not available yet.
        </p>
        <Link
          href="/dashboard/announcements"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8]"
        >
          View announcements
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {EVENT_FEATURES.map(({ icon: Icon, title, description }) => (
          <article key={title} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-[#30343A] dark:bg-[#191B1E]">
            <Icon className="h-5 w-5 text-[#2563EB] dark:text-blue-300" />
            <h2 className="mt-4 text-sm font-extrabold text-[#0B1020] dark:text-white">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
          </article>
        ))}
      </section>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-[#30343A] dark:bg-[#202328]">
        <Bell className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
        <p className="text-slate-600 dark:text-slate-300">We will announce availability inside the platform when verified event publishing is ready.</p>
      </div>
    </div>
  );
}
