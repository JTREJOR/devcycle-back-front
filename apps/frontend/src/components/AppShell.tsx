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
    if (pathname === "/priorizacion") {
      setActiveMenuTitle("Priorización");
    } else if (pathname === "/discovery") {
      setActiveMenuTitle("Discovery");
    } else if (pathname === "/team") {
      setActiveMenuTitle("Configuración de usuarios");
    } else if (pathname.startsWith("/project/")) {
      setActiveMenuTitle("Ficha de Proyecto");
    } else if (pathname === "/") {
      const homeOptions = ["Portafolio", "Priorización", "Aprobaciones", "Comité", "Auditoría"];
      if (!homeOptions.includes(activeMenuTitle)) {
        setActiveMenuTitle("Portafolio");
      }
    }
  }, [pathname, setActiveMenuTitle]);

  return (
    <>
      <header className="app-header">
        <div className="app-header__left">
          {/* Botón de menú de opciones (Imagen 3) */}
          <button
            className={`app-header__icon-btn ${isMainMenuOpen ? "app-header__icon-btn--active" : ""}`}
            aria-label="Abrir menú de opciones"
            title="Abrir menú con todas las opciones"
            type="button"
            onClick={toggleMainMenu}
          >
            <Icon icon={MoreActions} size={20} />
          </button>

          {/* Título de la página con punto morado (Imagen 3) */}
          <div className="app-header__brand">
            <span className="app-header__dot" aria-hidden>•</span>
            <span className="app-header__title">{activeMenuTitle}</span>
          </div>
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

      {/* Menú desplegable con todas las opciones inspirado en Imagen 2 */}
      <MainMenuOverlay />

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
