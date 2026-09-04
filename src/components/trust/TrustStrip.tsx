export function TrustStrip() {
  const items = [
    'Verified payments',
    'Digital receipts',
    'Clear payment history',
    'Secure transactions',
  ];

  return (
    <section className="border-b border-slate-200/80 bg-white py-5 dark:border-slate-800 dark:bg-[#0B1020]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
          <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#0B1020] dark:text-white lg:text-left">
            Built for how campus payments actually work.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[9px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 sm:text-[10px]">
            {items.map((item, idx) => (
              <span key={item} className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-[#2563EB]/40'}`} aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
