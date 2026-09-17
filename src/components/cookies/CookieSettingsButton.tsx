"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "./CookieNotice";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="hover:text-white transition-colors"
    >
      Cookie Settings
    </button>
  );
}
