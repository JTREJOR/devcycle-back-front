"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@vibe/core";
import { MoreActions, Labs, LogOut } from "@vibe/icons";
import { useUiStore } from "@/store/uiStore";
import { useRoles, useUsers } from "@/lib/queries";
import { RoleSwitcher } from "./RoleSwitcher";
import { CopilotChat } from "./CopilotChat";
import { MainMenuOverlay } from "./MainMenuOverlay";

export function AppShell({ children }: { children: React.ReactNode }) {
  const isChatOpen = useUiStore((s) => s.isChatOpen);
  const activeUserId = useUiStore((s) => s.activeUserId);
  const setActiveUserId = useUiStore((s) => s.setActiveUserId);
  const activeMenuTitle = useUiStore((s) => s.activeMenuTitle);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);
  const isMainMenuOpen = useUiStore((s) => s.isMainMenuOpen);
  const toggleMainMenu = useUiStore((s) => s.toggleMainMenu);
  const setMainMenuOpen = useUiStore((s) => s.setMainMenuOpen);
  const pathname = usePathname();

  const { data: users = [] } = useUsers();
  const { data: roles = [] } = useRoles();

  const activeUser = users.find((u) => u.id === activeUserId);
  const activeRole = roles.find((r) => r.id === activeUser?.roleId);

  // Consideramos modo simulación cuando no es el usuario base (u-01)
  const isSimulating = activeUserId !== "u-01";

  // Sincronizar el título de la página según la ruta cuando el usuario navega directamente
  useEffect(() => {
    if (pathname === "/iniciativas" || pathname.startsWith("/iniciativas/")) {
      setActiveMenuTitle("Iniciativas");
    } else if (pathname === "/estimacion") {
      setActiveMenuTitle("Estimación y VoBo");
    } else if (pathname === "/discovery") {
      setActiveMenuTitle("Discovery");
    } else if (pathname === "/team") {
      setActiveMenuTitle("Configuración de usuarios");
    } else if (pathname.startsWith("/project/")) {
      setActiveMenuTitle("Ficha de Proyecto");
    } else if (pathname === "/") {
      const homeOptions = ["Portafolio", "Iniciativas", "Aprobaciones", "Comité", "Auditoría"];
      if (!homeOptions.includes(activeMenuTitle)) {
        setActiveMenuTitle("Portafolio");
      }
    }
  }, [pathname, setActiveMenuTitle]);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-auto flex-wrap items-center justify-between gap-2 border-b border-border-default bg-bg-card px-3.5 py-2.5 sm:h-header sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0">
        <div className="flex items-center gap-3.5">
          {/* Botón de menú de opciones (Imagen 3) */}
          <button
            className={`flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-transparent transition-colors duration-150 hover:bg-brand-primary-light hover:text-brand-primary ${
              isMainMenuOpen
                ? "bg-brand-primary-light text-brand-primary"
                : "bg-transparent text-text-main"
            }`}
            aria-label="Abrir menú de opciones"
            title="Abrir menú con todas las opciones"
            type="button"
            onClick={toggleMainMenu}
          >
            <Icon icon={MoreActions} size={20} />
          </button>

          {/* Título de la página con punto morado (Imagen 3) */}
          <div className="flex items-center gap-1 text-base font-bold whitespace-nowrap text-text-main">
            <span
              className="inline-flex items-center justify-center text-[22px] leading-none font-black text-brand-primary"
              aria-hidden
            >
              •
            </span>
            <span className="text-[15.5px] font-bold tracking-[-0.2px] text-text-main">
              {activeMenuTitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />
          <span className="inline-flex items-center rounded-[20px] border border-status-purple-border bg-status-purple-bg px-2.5 py-1 text-[11.5px] font-bold tracking-[0.4px] text-brand-primary">
            {activeRole ? activeRole.name.toUpperCase().replace(/\s+/g, "_") : "ADMIN_ROOT"}
          </span>
          <span className="hidden text-[12.5px] text-text-secondary md:inline">
            {activeUser ? activeUser.email : "aemartinezz@liverpool.com.mx"}
          </span>
        </div>
      </header>

      {/* Menú desplegable con todas las opciones inspirado en Imagen 2 */}
      <MainMenuOverlay />

      {isSimulating && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f2d8ec] bg-[#faedf6] px-6 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
              <Icon icon={Labs} size={15} />
            </div>
            <div>
              <div className="text-xs font-bold text-brand-primary">
                MODO PRUEBAS &nbsp; Simulando: {activeUser?.name} · {activeRole?.name.toUpperCase()}
              </div>
              <div className="text-[11px] text-text-secondary">
                Usuario real: Argos Eyra Martinez Zeferino · aemartinezz@liverpool.com.mx
              </div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-brand-primary bg-bg-card px-3 py-[5px] text-[11.5px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
            onClick={() => setActiveUserId("u-01")}
          >
            <Icon icon={LogOut} size={14} />
            <span>Salir de simulación</span>
          </button>
        </div>
      )}

      <main
        className={`mx-auto w-full max-w-[1400px] flex-1 p-4 transition-[padding-right] duration-200 sm:px-8 sm:py-6 ${
          isChatOpen ? "lg:pr-[calc(var(--app-copilot-width)+32px)]" : ""
        }`}
      >
        {children}
      </main>
      <CopilotChat />
    </>
  );
}
