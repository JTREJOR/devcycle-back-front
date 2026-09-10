"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@vibe/core";
import { Menu, Security, Labs, LogOut } from "@vibe/icons";
import { useUiStore } from "@/store/uiStore";
import { useRoles, useUsers } from "@/lib/queries";
import { RoleSwitcher } from "./RoleSwitcher";
import { CopilotChat } from "./CopilotChat";

const NAV_LINKS = [
  { href: "/", label: "Portafolio" },
  { href: "/discovery", label: "Discovery IA (Paso 1)" },
  { href: "/team", label: "Configuración y Usuarios" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const isChatOpen = useUiStore((s) => s.isChatOpen);
  const activeUserId = useUiStore((s) => s.activeUserId);
  const setActiveUserId = useUiStore((s) => s.setActiveUserId);
  const pathname = usePathname();

  const { data: users = [] } = useUsers();
  const { data: roles = [] } = useRoles();

  const activeUser = users.find((u) => u.id === activeUserId);
  const activeRole = roles.find((r) => r.id === activeUser?.roleId);

  // Consideramos modo simulación cuando no es el usuario base (u-01)
  const isSimulating = activeUserId !== "u-01";

  return (
    <>
      <header className="app-header">
        <div className="app-header__left">
          <button className="app-header__icon-btn" aria-label="Menú principal" type="button">
            <Icon icon={Menu} size={20} />
          </button>
          <div className="app-header__brand">
            <span className="app-header__brand-shield" aria-hidden>
              <Icon icon={Security} size={20} />
            </span>
            <span>Gestión de Iniciativas</span>
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
        </div>

        <div className="app-header__right">
          <RoleSwitcher />
          <span className="app-header__role-pill">
            {activeRole ? activeRole.name.toUpperCase().replace(/\s+/g, "_") : "ADMIN_ROOT"}
          </span>
          <span className="app-header__user-email">
            {activeUser ? activeUser.email : "aemartinezz@liverpool.com.mx"}
          </span>
        </div>
      </header>

      {isSimulating && (
        <div className="simulation-banner">
          <div className="simulation-banner__left">
            <div className="simulation-banner__badge">
              <Icon icon={Labs} size={15} />
            </div>
            <div>
              <div className="simulation-banner__title">
                MODO PRUEBAS &nbsp; Simulando: {activeUser?.name} · {activeRole?.name.toUpperCase()}
              </div>
              <div className="simulation-banner__subtitle">
                Usuario real: Argos Eyra Martinez Zeferino · aemartinezz@liverpool.com.mx
              </div>
            </div>
          </div>
          <button
            type="button"
            className="simulation-banner__btn"
            onClick={() => setActiveUserId("u-01")}
          >
            <Icon icon={LogOut} size={14} />
            <span>Salir de simulación</span>
          </button>
        </div>
      )}

      <main className={`app-main ${isChatOpen ? "app-main--chat-open" : ""}`}>{children}</main>
      <CopilotChat />
    </>
  );
}
