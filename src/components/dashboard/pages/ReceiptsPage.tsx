'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, ChevronRight, Download, Loader2, ReceiptText, Search, X } from 'lucide-react';
import { HeighttLoader } from '@/components/ui/HeighttLoader';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDownloadReceipt, useReceipts } from '@/hooks/queries/useReceipts';
import type { Receipt } from '@/lib/api/finance';
import { generateReceiptPdf } from '@/lib/pdf/generateReceiptPdf';

interface ReceiptItem {
  id: string;
  ref: string;
  title: string;
  organization: string;
  amount: number;
  amountFormatted: string;
  date: string;
  payerName?: string;
}

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 });

function ReceiptModal({ receipt, downloading, onClose, onDownload }: {
  receipt: ReceiptItem;
  downloading: boolean;
  onClose: () => void;
  onDownload: () => void;
}) {
  const details = [
    ['Student', receipt.payerName || 'Not provided'],
    ['Organization', receipt.organization],
    ['Reference', receipt.ref],
    ['Payment date', receipt.date],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-xl border border-slate-200 bg-white p-5 dark:border-[#30343A] dark:bg-[#191B1E] sm:rounded-xl sm:p-6" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close receipt" className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 pr-8">
          <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300">
            <ReceiptText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#0B1020] dark:text-white">Payment receipt</h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" /> Paid and verified
            </p>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-[#202328]">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Amount paid</p>
          <p className="mt-1 text-2xl font-black tracking-tight text-[#0B1020] dark:text-white">{receipt.amountFormatted}</p>
          <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">{receipt.title}</p>
        </div>
        <dl className="mt-5 divide-y divide-slate-100 border-y border-slate-100 text-xs dark:divide-[#30343A] dark:border-[#30343A]">
          {details.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-3">
              <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="text-right font-semibold text-slate-900 dark:text-white">{value}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={onDownload} disabled={downloading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8] disabled:opacity-60">
          {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {downloading ? 'Generating receipt' : 'Download receipt'}
        </button>
      </div>
    </div>
  );
}

export function ReceiptsPage() {
  const { data: receipts = [], isLoading, isError, refetch } = useReceipts({ limit: 100 });
  const downloadReceipt = useDownloadReceipt();
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ReceiptItem | null>(null);
  const query = useDebouncedValue(search, 300).toLowerCase();

  const items = useMemo<ReceiptItem[]>(() => receipts.map((receipt: Receipt) => {
    const amount = (receipt.totalAmount ?? receipt.amount ?? 0) / 100;
    return {
      id: receipt.id,
      ref: receipt.receiptNumber || receipt.reference || `HTT-${receipt.id.slice(0, 8).toUpperCase()}`,
      title: receipt.description || 'Campus payment',
      organization: receipt.organizationName || 'Organization not provided',
      amount,
      amountFormatted: naira.format(amount),
      date: receipt.paymentDate
        ? new Date(receipt.paymentDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Date not provided',
      payerName: receipt.payerName,
    };
  }), [receipts]);

  const filtered = items.filter((item) => !query || [item.title, item.ref, item.organization].some((value) => value.toLowerCase().includes(query)));

  const download = async (receipt: ReceiptItem) => {
    setDownloadingId(receipt.id);
    try {
      const blob = await downloadReceipt.mutateAsync(receipt.id);
      if (!blob?.size) throw new Error('Receipt file unavailable');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Heightt-Receipt-${receipt.ref}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      await generateReceiptPdf({
        ref: receipt.ref,
        title: receipt.title,
        org: receipt.organization,
        amount: receipt.amount,
        amountFormatted: receipt.amountFormatted,
        date: receipt.date,
        payerName: receipt.payerName,
        status: 'VERIFIED',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) return <div className="flex min-h-[360px] items-center justify-center"><HeighttLoader label="Loading receipts" /></div>;
  if (isError) return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">Unable to load receipts.<button onClick={() => refetch()} className="ml-2 font-semibold underline">Retry</button></div>;

  return (
    <div className="space-y-5 pb-6">
      {selected && <ReceiptModal receipt={selected} downloading={downloadingId === selected.id} onClose={() => setSelected(null)} onDownload={() => download(selected)} />}
      <section className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#0B1020] dark:text-white">Payment records</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Verified proof for completed campus payments.</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <strong className="block text-lg font-semibold text-[#0B1020] dark:text-white">{items.length}</strong>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">receipts</span>
        </div>
      </section>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search receipts" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#2563EB] dark:border-[#30343A] dark:bg-[#191B1E] dark:text-white" />
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-[#30343A] dark:bg-[#191B1E]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 dark:border-[#30343A] sm:px-5">
          <h2 className="text-sm font-semibold text-[#0B1020] dark:text-white">Receipt history</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{filtered.length} shown</span>
        </div>
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <ReceiptText className="mx-auto h-7 w-7 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">{query ? 'No receipts match your search.' : 'No receipts available yet.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#30343A]">
            {filtered.map((receipt) => (
              <button key={receipt.id} onClick={() => setSelected(receipt)} className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-[#202328] sm:px-5">
                <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-300"><ReceiptText className="h-[18px] w-[18px]" /></span>
                <span className="min-w-0"><strong className="block truncate text-sm font-semibold text-[#0B1020] dark:text-white">{receipt.title}</strong><span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{receipt.organization} · {receipt.date}</span><span className="mt-1 block truncate font-mono text-[10px] text-slate-400 dark:text-slate-500">{receipt.ref}</span></span>
                <span className="flex items-center gap-2"><span className="text-right"><strong className="block text-sm font-semibold text-[#0B1020] dark:text-white">{receipt.amountFormatted}</strong><span className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="h-3 w-3" /> Verified</span></span><ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" /></span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ReceiptsPage;
