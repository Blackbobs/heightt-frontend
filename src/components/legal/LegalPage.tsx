import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowUpRight, FileText, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer/Footer";
import { Logo } from "@/components/ui/Logo";
import { SUPPORT_EMAIL } from "@/lib/seo";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  effectiveDate: string;
  icon: LucideIcon;
  highlights: string[];
  sections: LegalSection[];
  companion: { label: string; href: string };
}

export function LegalPage({
  eyebrow,
  title,
  description,
  effectiveDate,
  icon: Icon,
  highlights,
  sections,
  companion,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0B1020] dark:bg-[#080D1A] dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B1020]/90">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo className="[&_img]:h-12" />
          <div className="flex items-center gap-2">
            <Link
              href={companion.href}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0B1020] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:inline-flex"
            >
              {companion.label}
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8]"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0B1020]">
          <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl dark:bg-blue-900/20" />
          <div className="pointer-events-none absolute -bottom-36 left-1/4 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl dark:bg-cyan-900/10" />
          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#2563EB] dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Heightt
            </Link>
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100 dark:bg-blue-950/50 dark:ring-blue-900">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#2563EB]">
                  {eyebrow}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-[#0B1020] dark:text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                {description}
              </p>
              <p className="mt-6 text-sm font-medium text-slate-400">
                Effective {effectiveDate}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-12 lg:py-16">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#101728]">
              <p className="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                On this page
              </p>
              <nav aria-label={`${title} sections`}>
                <ol className="space-y-1">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex items-start gap-3 rounded-xl px-2.5 py-2 text-sm leading-5 text-slate-600 transition-colors hover:bg-blue-50 hover:text-[#2563EB] dark:text-slate-300 dark:hover:bg-blue-950/40"
                      >
                        <span className="mt-0.5 font-mono text-[10px] font-bold text-slate-400 group-hover:text-[#2563EB]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="mb-10 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-blue-900/50 dark:from-blue-950/40 dark:to-[#101728] sm:p-8">
              <div className="mb-5 flex items-center gap-2 text-sm font-bold text-[#2563EB]">
                <ShieldCheck className="h-5 w-5" /> At a glance
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white px-6 shadow-sm dark:border-slate-800 dark:bg-[#101728] sm:px-10">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 border-b border-slate-100 py-9 last:border-0 dark:border-slate-800 sm:py-11"
                >
                  <div className="mb-5 flex items-start gap-4">
                    <span className="mt-1 font-mono text-xs font-bold text-[#2563EB]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-[#0B1020] dark:text-white sm:text-2xl">
                      {section.title}
                    </h2>
                  </div>
                  <div className="legal-copy pl-0 text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:pl-10">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 flex flex-col justify-between gap-5 rounded-3xl bg-[#0B1020] p-7 text-white sm:flex-row sm:items-center sm:p-9">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-300">
                  <Mail className="h-4 w-4" /> Questions about this document?
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-300">
                  Contact us and include enough detail for us to understand and respond to your request.
                </p>
              </div>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#0B1020] transition-transform hover:-translate-y-0.5"
              >
                {SUPPORT_EMAIL} <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <FileText className="h-4 w-4" />
              Also read
              <Link href={companion.href} className="font-semibold text-[#2563EB] hover:underline">
                {companion.label}
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
