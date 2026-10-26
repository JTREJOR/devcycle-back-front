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
  // Fila 1 (Inspirada en Imagen 2 y Acuerdos de Negocio)
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
    id: "iniciativas",
    title: "Iniciativas",
    subtitle: "Todas las iniciativas por etapa",
    icon: CheckList,
    href: "/iniciativas",
  },
  {
    id: "estimacion",
    title: "Estimación y VoBo",
    subtitle: "Sizing IA y VoBo técnico/arquitectura",
    icon: Timeline,
    href: "/estimacion",
  },
  {
    id: "comite",
    title: "Comité",
    subtitle: "Sesiones y dictamen",
    icon: Calendar,
    href: "/en-construccion?modulo=Comité",
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
    href: "/en-construccion?modulo=Auditoría",
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
        className="fixed inset-0 top-header z-25 bg-gray-900/28 backdrop-blur-[2px] animate-menu-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel del Mega Menú inspirado en Imagen 2 */}
      <div
        className="fixed top-header right-0 left-0 z-26 border-b border-border-default bg-bg-card shadow-[0_16px_36px_-4px_rgba(131,49,119,0.08),0_8px_16px_-4px_rgba(0,0,0,0.06)] animate-menu-slide-down"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de opciones"
      >
        <div className="mx-auto max-w-[1400px] px-6 pt-4 pb-5">
          <div className="mb-3.5 flex items-center justify-between border-b border-[#f1f3f5] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[22px] leading-none font-black text-brand-primary">•</span>
              <span className="text-[13.5px] font-bold tracking-[0.5px] text-text-main uppercase">
                Módulos del Sistema
              </span>
              <span className="ml-1.5 hidden text-xs text-text-secondary sm:inline">
                Selecciona un módulo para navegar y actualizar el título de la vista
              </span>
            </div>
            <button
              type="button"
              className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-text-secondary transition-all duration-150 hover:border-[#f2d8ec] hover:bg-brand-primary-light hover:text-brand-primary"
              onClick={handleClose}
              aria-label="Cerrar menú"
            >
              <Icon icon={Close} size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {MAIN_MENU_ITEMS.map((item) => {
              const isActive =
                activeTitle === item.title ||
                (activeTitle === "Configuración de usuarios" &&
                  (item.title === "Usuarios" || item.title === "Configuración"));

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`flex w-full cursor-pointer items-start gap-3 rounded-[10px] border px-3.5 py-3 text-left font-sans transition-all duration-150 ${
                    isActive
                      ? "border-brand-primary bg-[#f8eef6] shadow-[0_2px_8px_rgba(131,49,119,0.12)]"
                      : "border-[#f1f3f5] bg-bg-card hover:-translate-y-[1px] hover:border-[#f2d8ec] hover:bg-[#fdfafc] hover:shadow-[0_4px_12px_rgba(131,49,119,0.05)]"
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "bg-[#fdf2f8] text-brand-primary"
                    }`}
                  >
                    <Icon icon={item.icon} size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`mb-0.5 truncate text-[13.5px] font-bold ${
                        isActive ? "text-brand-primary" : "text-text-main"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="line-clamp-2 text-[11.5px] leading-[1.35] text-text-secondary">
                      {item.subtitle}
                    </div>
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
