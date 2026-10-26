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
    <div className="prio-page-container">
      <div className="app-back-bar">
        <BackButton />
      </div>

      {/* Breadcrumb */}
      <div className="prio-breadcrumb" style={{ marginBottom: 16 }}>
        <Link href="/" className="prio-breadcrumb__link">
          Portafolio
        </Link>
        <span className="prio-breadcrumb__sep">&gt;</span>
        <Link href="/iniciativas" className="prio-breadcrumb__link">
          Iniciativas
        </Link>
        <span className="prio-breadcrumb__sep">&gt;</span>
        <span className="prio-breadcrumb__current">
          {moduleTitle ? `${moduleTitle} (En construcción)` : "Página en construcción"}
        </span>
      </div>

      {/* Card principal de Página en Construcción */}
      <section className="uc-card">
        <div className="uc-card__top-accent" />

        <div className="uc-card__body">
          {/* Badge de estado */}
          <div className="uc-status-pill">
            <Icon icon={Time} size={14} />
            <span>PÁGINA EN CONSTRUCCIÓN · PRÓXIMAMENTE</span>
          </div>

          {/* Ícono central ilustrativo */}
          <div className="uc-icon-Hero" aria-hidden="true">
            <div className="uc-icon-ring">
              <Icon icon={Labs} size={34} />
            </div>
          </div>

          {/* Título y mensaje genérico */}
          <h1 className="uc-title">
            {moduleTitle
              ? `La sección de "${moduleTitle}" está en construcción`
              : "Esta página aún no está disponible"}
          </h1>

          <p className="uc-description">
            La vista o funcionalidad a la que intentas acceder aún no existe o se encuentra
            actualmente en desarrollo como parte de las siguientes entregas de{" "}
            <strong>DevCycle</strong>. Pronto podrás gestionar este módulo directamente desde el
            portafolio.
          </p>

          {/* Si viene desde una iniciativa específica, mostrar su contexto */}
          {relatedInitiative && (
            <div className="uc-initiative-context">
              <div className="uc-initiative-context__badge">Iniciativa seleccionada</div>
              <div className="uc-initiative-context__title">{relatedInitiative.name}</div>
              <div className="uc-initiative-context__meta">
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
          <div className="uc-info-grid">
            <div className="uc-info-item">
              <div className="uc-info-item__icon">
                <Icon icon={Bolt} size={18} />
              </div>
              <div>
                <div className="uc-info-item__title">En desarrollo activo</div>
                <div className="uc-info-item__text">
                  Estamos construyendo e integrando los flujos y tableros correspondientes a esta
                  etapa del ciclo de vida.
                </div>
              </div>
            </div>

            <div className="uc-info-item">
              <div className="uc-info-item__icon">
                <Icon icon={Info} size={18} />
              </div>
              <div>
                <div className="uc-info-item__title">¿Qué puedes hacer mientras tanto?</div>
                <div className="uc-info-item__text">
                  Puedes consultar el resumen en la bandeja de Iniciativas, registrar nuevas ideas
                  en Discovery o revisar el Portafolio general.
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="uc-actions">
            <button type="button" className="btn-purple-outline uc-btn" onClick={handleGoBack}>
              <Icon icon={NavigationChevronLeft} size={16} />
              <span>Volver a la página anterior</span>
            </button>

            <Link href="/iniciativas" className="btn-purple-outline uc-btn">
              <Icon icon={CheckList} size={16} />
              <span>Ir a Iniciativas</span>
            </Link>

            <Link href="/" className="btn-purple-solid uc-btn uc-btn--primary">
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
