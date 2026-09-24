"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@vibe/core";
import {
  Dashboard,
  Robot,
  CheckList,
  Check,
  Calendar,
  File as FileIcon,
  Person,
  Security,
  Settings,
  Timeline,
  Close,
} from "@vibe/icons";
import { useUiStore } from "@/store/uiStore";

export interface MenuItemDef {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Dashboard;
  href: string;
  color?: string;
}

export const MAIN_MENU_ITEMS: MenuItemDef[] = [
  // Fila 1 (Inspirada en Imagen 2)
  {
    id: "portfolio",
    title: "Portafolio",
    subtitle: "Resumen de mis iniciativas",
    icon: Dashboard,
    href: "/",
  },
  {
    id: "discovery",
    title: "Discovery",
    subtitle: "Formulación asistida por IA",
    icon: Robot,
    href: "/discovery",
  },
  {
    id: "priorizacion",
    title: "Priorización",
    subtitle: "Matriz y backlog de cartera",
    icon: CheckList,
    href: "/priorizacion",
  },
  {
    id: "aprobaciones",
    title: "Aprobaciones",
    subtitle: "Pendientes por revisar",
    icon: Check,
    href: "/#aprobaciones",
  },
  {
    id: "comite",
    title: "Comité",
    subtitle: "Sesiones y dictamen",
    icon: Calendar,
    href: "/#comite",
  },

  // Fila 2 (Inspirada en Imagen 2)
  {
    id: "project-detail",
    title: "Ficha de Proyecto",
    subtitle: "Detalle técnico y seguimiento",
    icon: FileIcon,
    href: "/project/proj-01",
  },
  {
    id: "usuarios",
    title: "Usuarios",
    subtitle: "Administración de personas",
    icon: Person,
    href: "/team?tab=users",
  },
  {
    id: "roles",
    title: "Roles",
    subtitle: "Permisos de la aplicación",
    icon: Security,
    href: "/team?tab=users#roles",
  },
  {
    id: "configuracion",
    title: "Configuración",
    subtitle: "Parámetros del sistema",
    icon: Settings,
    href: "/team?tab=config",
  },
  {
    id: "auditoria",
    title: "Auditoría",
    subtitle: "Historial de operaciones",
    icon: Timeline,
    href: "/#auditoria",
  },
];

export function MainMenuOverlay() {
  const router = useRouter();
  const isOpen = useUiStore((s) => s.isMainMenuOpen);
  const setOpen = useUiStore((s) => s.setMainMenuOpen);
  const activeTitle = useUiStore((s) => s.activeMenuTitle);
  const setActiveTitle = useUiStore((s) => s.setActiveMenuTitle);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleSelect = (item: MenuItemDef) => {
    // 1. Al dar clic a una opción del menú, en el título de la página (Imagen 3) se pone el nombre del menú
    setActiveTitle(item.title);
    handleClose();

    // 2. Navegar a la ruta seleccionada
    router.push(item.href);

    // 3. Si tiene hash en la misma página, hacer scroll suave al elemento
    if (item.href.includes("#")) {
      const hash = item.href.split("#")[1];
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Backdrop transparente para cerrar al hacer clic afuera */}
      <div
        className="main-menu-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel del Mega Menú inspirado en Imagen 2 */}
      <div className="main-menu-panel" role="dialog" aria-modal="true" aria-label="Menú de opciones">
        <div className="main-menu-panel__inner">
          <div className="main-menu-panel__header">
            <div className="main-menu-panel__title-box">
              <span className="main-menu-panel__badge">•</span>
              <span className="main-menu-panel__title">Módulos del Sistema</span>
              <span className="main-menu-panel__hint">
                Selecciona un módulo para navegar y actualizar el título de la vista
              </span>
            </div>
            <button
              type="button"
              className="main-menu-panel__close-btn"
              onClick={handleClose}
              aria-label="Cerrar menú"
            >
              <Icon icon={Close} size={18} />
            </button>
          </div>

          <div className="main-menu-grid">
            {MAIN_MENU_ITEMS.map((item) => {
              const isActive =
                activeTitle === item.title ||
                (activeTitle === "Configuración de usuarios" &&
                  (item.title === "Usuarios" || item.title === "Configuración"));

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`main-menu-card ${isActive ? "main-menu-card--active" : ""}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="main-menu-card__icon-box">
                    <Icon icon={item.icon} size={20} />
                  </div>
                  <div className="main-menu-card__content">
                    <div className="main-menu-card__title">{item.title}</div>
                    <div className="main-menu-card__subtitle">{item.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
