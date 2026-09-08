"use client";

import dynamic from "next/dynamic";

// Vibe's Dropdown/Dialog/Tooltip components render through portals whose
// markup differs between server and client, so the whole interactive shell
// (this is an authenticated, iframe-embedded app with no SEO need) is
// rendered client-only to avoid hydration mismatches.
const Providers = dynamic(() => import("./providers").then((m) => m.Providers), { ssr: false });

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
