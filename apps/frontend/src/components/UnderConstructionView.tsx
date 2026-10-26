"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@vibe/core";
import {
  NavigationChevronLeft,
  NavigationChevronRight,
  CheckList,
  Dashboard,
  Labs,
  Time,
  Info,
  Bolt,
} from "@vibe/icons";
import { usePriorizacionStore } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";
import { BackButton } from "./BackButton";

const SLUG_LABELS: Record<string, string> = {
  autorizacion: "Autorización",
  formalizacion: "Formalización",
  ejecucion: "Ejecución",
  cierre: "Cierre",
  comite: "Comité",
  auditoria: "Auditoría",
  calendario: "Calendario de Hitos",
  "estimacion-costos": "Estimación de Costos",
  costos: "Estimación de Costos",
};

function formatSlugToTitle(pathname: string): string | null {
  if (!pathname || pathname === "/" || pathname === "/en-construccion") {
    return null;
  }
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const lastSegment = clean.split("/").pop() || "";
  if (!lastSegment) return null;

  const lower = decodeURIComponent(lastSegment).toLowerCase();
  if (SLUG_LABELS[lower]) {
    return SLUG_LABELS[lower];
  }

  return decodeURIComponent(lastSegment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function UnderConstructionView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduloParam = searchParams.get("modulo") || searchParams.get("pagina");
  const initiativeId = searchParams.get("id");

  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  const moduleTitle = useMemo(() => {
    if (moduloParam && moduloParam.trim().length > 0) {
      return moduloParam.trim();
    }
    return formatSlugToTitle(pathname);
  }, [moduloParam, pathname]);

  const relatedInitiative = useMemo(() => {
    if (!initiativeId) return null;
    return initiatives.find((item) => item.id === initiativeId) || null;
  }, [initiatives, initiativeId]);

  useEffect(() => {
    if (moduleTitle) {
      setActiveMenuTitle(moduleTitle);
    } else {
      setActiveMenuTitle("Página en construcción");
    }
  }, [moduleTitle, setActiveMenuTitle]);

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/iniciativas");
    }
  };

  return (
    <div className="px-1 pb-10">
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-1.5 text-xs">
        <Link href="/" className="font-semibold text-brand-primary no-underline hover:underline">
          Portafolio
        </Link>
        <span className="text-gray-400">&gt;</span>
        <Link
          href="/iniciativas"
          className="font-semibold text-brand-primary no-underline hover:underline"
        >
          Iniciativas
        </Link>
        <span className="text-gray-400">&gt;</span>
        <span className="font-bold text-brand-primary">
          {moduleTitle ? `${moduleTitle} (En construcción)` : "Página en construcción"}
        </span>
      </div>

      {/* Card principal de Página en Construcción */}
      <section className="mx-auto mt-3 mb-10 max-w-[780px] overflow-hidden rounded-2xl border border-border-default bg-bg-card shadow-[0_8px_28px_rgba(131,49,119,0.06),0_2px_6px_rgba(0,0,0,0.03)]">
        <div className="h-1.5 w-full bg-linear-to-r from-brand-primary to-brand-accent" />

        <div className="flex flex-col items-center px-5 py-7 text-center sm:px-9 sm:pt-10 sm:pb-9">
          {/* Badge de estado */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#f5d0e6] bg-[#fdf2f8] px-3.5 py-[5px] text-[11px] font-extrabold tracking-[0.6px] text-brand-primary uppercase">
            <Icon icon={Time} size={14} />
            <span>PÁGINA EN CONSTRUCCIÓN · PRÓXIMAMENTE</span>
          </div>

          {/* Ícono central ilustrativo */}
          <div className="mb-4.5" aria-hidden="true">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[22px] border-[1.5px] border-[#f2d8ec] bg-linear-to-br from-[#fdf2f8] to-brand-primary-light text-brand-accent shadow-[0_6px_18px_rgba(230,0,126,0.12)]">
              <Icon icon={Labs} size={34} />
            </div>
          </div>

          {/* Título y mensaje genérico */}
          <h1 className="m-0 mb-2.5 text-xl leading-[1.25] font-extrabold tracking-[-0.3px] text-text-heading sm:text-2xl">
            {moduleTitle
              ? `La sección de "${moduleTitle}" está en construcción`
              : "Esta página aún no está disponible"}
          </h1>

          <p className="m-0 mb-6 max-w-[580px] text-sm leading-[1.55] text-text-secondary">
            La vista o funcionalidad a la que intentas acceder aún no existe o se encuentra
            actualmente en desarrollo como parte de las siguientes entregas de{" "}
            <strong>DevCycle</strong>. Pronto podrás gestionar este módulo directamente desde el
            portafolio.
          </p>

          {/* Si viene desde una iniciativa específica, mostrar su contexto */}
          {relatedInitiative && (
            <div className="mb-5.5 w-full max-w-[640px] rounded-xl border border-[#f2d8ec] bg-[#fdf8fb] px-4.5 py-3.5 text-left">
              <div className="mb-1 inline-block text-[10.5px] font-extrabold tracking-[0.5px] text-brand-accent uppercase">
                Iniciativa seleccionada
              </div>
              <div className="mb-1 text-[14.5px] font-bold text-text-heading">
                {relatedInitiative.name}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
                <span>Área: {relatedInitiative.cartera || relatedInitiative.area}</span>
                <span>•</span>
                <span>Solicitante: {relatedInitiative.solicitante}</span>
                {relatedInitiative.etapaCiclo && (
                  <>
                    <span>•</span>
                    <span>Etapa actual: {relatedInitiative.etapaCiclo}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Bloques informativos de guía */}
          <div className="mb-7 grid w-full max-w-[640px] grid-cols-1 gap-3.5 text-left sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-bg-card text-brand-primary">
                <Icon icon={Bolt} size={18} />
              </div>
              <div>
                <div className="mb-[3px] text-[13px] font-bold text-text-heading">
                  En desarrollo activo
                </div>
                <div className="text-xs leading-[1.45] text-text-secondary">
                  Estamos construyendo e integrando los flujos y tableros correspondientes a esta
                  etapa del ciclo de vida.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-bg-card text-brand-primary">
                <Icon icon={Info} size={18} />
              </div>
              <div>
                <div className="mb-[3px] text-[13px] font-bold text-text-heading">
                  ¿Qué puedes hacer mientras tanto?
                </div>
                <div className="text-xs leading-[1.45] text-text-secondary">
                  Puedes consultar el resumen en la bandeja de Iniciativas, registrar nuevas ideas
                  en Discovery o revisar el Portafolio general.
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-[7px] rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-4 py-[9px] text-[13px] font-bold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
              onClick={handleGoBack}
            >
              <Icon icon={NavigationChevronLeft} size={16} />
              <span>Volver a la página anterior</span>
            </button>

            <Link
              href="/iniciativas"
              className="inline-flex cursor-pointer items-center gap-[7px] rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-4 py-[9px] text-[13px] font-bold text-brand-primary no-underline transition-all duration-150 hover:bg-brand-primary-light"
            >
              <Icon icon={CheckList} size={16} />
              <span>Ir a Iniciativas</span>
            </Link>

            <Link
              href="/"
              className="inline-flex cursor-pointer items-center gap-[7px] rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[9px] text-[13px] font-bold text-white no-underline transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
            >
              <Icon icon={Dashboard} size={16} />
              <span>Ir al Portafolio</span>
              <Icon icon={NavigationChevronRight} size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
