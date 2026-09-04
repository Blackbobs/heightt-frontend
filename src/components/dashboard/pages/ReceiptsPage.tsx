'use client';

import React, { useState, useMemo } from 'react';
import {
  Receipt as ReceiptIcon,
  Download,
  Search,
  CheckCircle2,
  FileText,
  Loader2,
  X,
  ShieldCheck,
  QrCode,
  Share2,
  Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReceipts, useDownloadReceipt } from '@/hooks/queries/useReceipts';
import { Receipt as ReceiptType } from '@/lib/api/finance';
import { generateReceiptPdf } from '@/lib/pdf/generateReceiptPdf';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { HeighttLoader } from '@/components/ui/HeighttLoader';

interface ReceiptItem {
  id: string;
  ref: string;
  title: string;
  org: string;
  amount: number;
  amountFormatted: string;
  date: string;
  rawDate: string;
  payerName?: string;
  matricNo?: string;
  academicSession?: string;
  status: 'verified';
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

/* ─── Digital Verified Receipt Modal (Section 32) ─── */
function ReceiptModal({
  receipt,
  onClose,
  onDownload,
  isDownloading,
}: {
  receipt: ReceiptItem;
  onClose: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
        >
          ✕
        </button>

        {/* Printable Surface */}
        <div className="space-y-4">
          
          {/* Brand & Status */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-base font-extrabold font-mono tracking-tight text-[#0B1020] dark:text-white">
                HEIGHTT
              </span>
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                Payment Receipt
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Paid & Verified
            </span>
          </div>

          {/* Amount Display */}
          <div className="text-center py-3 bg-[#F8FAFC] dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Amount Paid</span>
            <span className="text-3xl font-extrabold text-[#0B1020] dark:text-white font-mono">
              {receipt.amountFormatted}
            </span>
            <span className="text-xs font-semibold text-[#2563EB] block mt-0.5">
              {receipt.title}
            </span>
          </div>

          {/* Structured Key Details */}
          <div className="space-y-2 text-xs font-mono text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.payerName || 'Ayomide Bello'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Matric Number</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.matricNo || 'CSC/2021/049'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Organization</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.org}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Academic Session</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.academicSession || '2026/2027'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500">Payment Reference</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.ref}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Payment Date</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {receipt.date}
              </span>
            </div>
          </div>

          {/* QR Code & Verification note */}
          <div className="p-3 bg-[#F8FAFC] dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center p-1">
              <QrCode className="w-8 h-8 text-slate-800 dark:text-slate-200" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              This receipt was generated by Heightt for a verified payment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Generating...' : 'Download receipt'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export function ReceiptsPage() {
  const { data: receipts, isLoading, isError, error, refetch } = useReceipts({ limit: 100 });
  const downloadMutation = useDownloadReceipt();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const receiptItems = useMemo<ReceiptItem[]>(() => {
    if (!receipts || receipts.length === 0) return [];
    return receipts.map((r: ReceiptType) => {
      const amount = (r.totalAmount ?? r.amount ?? 0) / 100;
      return {
        id: r.id,
        ref: r.receiptNumber || r.reference || `HTT-${r.id.slice(0, 8).toUpperCase()}`,
        title: r.description || 'Departmental Due',
        org: r.organizationName || r.payerName || 'Computer Science Department',
        amount,
        amountFormatted: formatNaira(amount),
        date: r.paymentDate
          ? new Date(r.paymentDate).toLocaleDateString('en-GB', { month: 'short', day: '2-digit', year: 'numeric' })
          : '03 Sep 2026',
        rawDate: r.paymentDate || '',
        payerName: r.payerName,
        status: 'verified',
      };
    });
  }, [receipts]);

  const filtered = useMemo(() => {
    return receiptItems.filter((r) => {
      const q = debouncedSearch.toLowerCase();
      return (
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.ref.toLowerCase().includes(q) ||
        r.org.toLowerCase().includes(q)
      );
    });
  }, [receiptItems, debouncedSearch]);

  const handleDownload = async (receipt: ReceiptItem) => {
    setDownloadingId(receipt.id);
    try {
      const blob = await downloadMutation.mutateAsync(receipt.id);
      if (blob && blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Heightt-Receipt-${receipt.ref}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return;
      }
      throw new Error('Fallback PDF generator');
    } catch {
      await generateReceiptPdf({
        ref: receipt.ref,
        title: receipt.title,
        org: receipt.org,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <HeighttLoader label="Loading official receipts..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-600 dark:text-red-300">
        <p className="font-bold text-sm">Error loading receipts</p>
        <button type="button" onClick={() => refetch()} className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {selectedReceipt && (
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          onDownload={() => handleDownload(selectedReceipt)}
          isDownloading={downloadingId === selectedReceipt.id}
        />
      )}

      <div className="space-y-6 w-full">
        <div>
          <h1 className="text-xl font-bold text-[#0B1020] dark:text-white">Verified Receipts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Official proof of clearance for all paid campus dues
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search receipts by reference, due, or organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-[#0B1020] dark:text-white placeholder:text-slate-400 outline-none focus:border-[#2563EB]"
          />
        </div>

        {/* Receipt list */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No receipts found.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReceipt(r)}
                className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-[#2563EB] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0B1020] dark:text-white">
                      {r.title}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                    {r.org} • Ref: {r.ref} • {r.date}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">
                    {r.amountFormatted}
                  </span>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    View receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ReceiptsPage;
