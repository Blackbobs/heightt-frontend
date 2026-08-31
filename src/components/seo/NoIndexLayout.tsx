import type { Metadata } from "next";

export const noIndexMetadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export function NoIndexLayout({ children }: { children: React.ReactNode }) {
  return children;
}
