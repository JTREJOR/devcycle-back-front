"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/uiStore";
import { RoleSwitcher } from "./RoleSwitcher";
import { CopilotChat } from "./CopilotChat";

const NAV_LINKS = [
  { href: "/", label: "Portafolio" },
  { href: "/team", label: "Usuarios y Perfiles" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const isChatOpen = useUiStore((s) => s.isChatOpen);
  const pathname = usePathname();

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__brand-dot" aria-hidden />
          <span>DevCycle Portfolio</span>
        </div>
        <nav className="app-header__nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`app-header__nav-link ${pathname === link.href ? "active" : ""}`}
            >
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <RoleSwitcher />
      </header>
      <main className={`app-main ${isChatOpen ? "app-main--chat-open" : ""}`}>{children}</main>
      <CopilotChat />
    </>
  );
}
