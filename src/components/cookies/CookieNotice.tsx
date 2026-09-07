"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export const COOKIE_NOTICE_STORAGE_KEY = "heightt.cookie-notice.v1";
export const OPEN_COOKIE_SETTINGS_EVENT = "heightt:open-cookie-settings";
const COOKIE_SETTINGS_CHANGED_EVENT = "heightt:cookie-settings-changed";
let forceCookieNoticeOpen = false;
let cookieNoticeDismissed = false;

function subscribeToCookieNotice(onStoreChange: () => void) {
  const openSettings = () => {
    forceCookieNoticeOpen = true;
    cookieNoticeDismissed = false;
    onStoreChange();
  };
  window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  window.addEventListener(COOKIE_SETTINGS_CHANGED_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    window.removeEventListener(COOKIE_SETTINGS_CHANGED_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getCookieNoticeSnapshot() {
  if (cookieNoticeDismissed) return false;
  try {
    return (
      forceCookieNoticeOpen ||
      !window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY)
    );
  } catch {
    return true;
  }
}

export function CookieNotice() {
  const isVisible = useSyncExternalStore(
    subscribeToCookieNotice,
    getCookieNoticeSnapshot,
    () => false,
  );

  function acknowledge() {
    try {
      window.localStorage.setItem(
        COOKIE_NOTICE_STORAGE_KEY,
        JSON.stringify({ necessary: true, acknowledgedAt: Date.now() }),
      );
    } catch {
      // The notice can still be dismissed when browser storage is unavailable.
    }
    forceCookieNoticeOpen = false;
    cookieNoticeDismissed = true;
    window.dispatchEvent(new Event(COOKIE_SETTINGS_CHANGED_EVENT));
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[10000] p-3 sm:p-5">
      <section
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-notice-title"
        aria-describedby="cookie-notice-description"
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(11,16,32,0.22)] dark:border-slate-700 dark:bg-[#101728]"
      >
        <div className="h-1 bg-gradient-to-r from-[#2563EB] via-cyan-400 to-[#2563EB]" />
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <button
            type="button"
            onClick={acknowledge}
            className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white sm:hidden"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-4 w-4" />
          </button>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100 dark:bg-blue-950/50 dark:ring-blue-900">
            <Cookie className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1 pr-6 sm:pr-0">
            <div className="flex items-center gap-2">
              <h2
                id="cookie-notice-title"
                className="text-sm font-bold text-[#0B1020] dark:text-white sm:text-base"
              >
                Essential cookies keep Heightt working
              </h2>
              <ShieldCheck className="hidden h-4 w-4 text-emerald-500 sm:block" />
            </div>
            <p
              id="cookie-notice-description"
              className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-600 dark:text-slate-300 sm:text-sm sm:leading-6"
            >
              We use essential cookies and browser storage for secure sign-in,
              fraud protection, payment status, and your preferences. We do not
              currently use advertising cookies.
            </p>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <Link
              href="/privacy#cookies"
              className="rounded-xl px-4 py-2.5 text-center text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#0B1020] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Learn more
            </Link>
            <button
              type="button"
              onClick={acknowledge}
              className="rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-colors hover:bg-[#1D4ED8]"
            >
              Accept essential cookies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
