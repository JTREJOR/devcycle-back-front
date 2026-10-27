"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@vibe/core";
import {
  Sun,
  Calendar,
  CheckList,
  Bolt,
  Alert,
  Time,
  NavigationChevronRight,
  File as FileIcon,
  Timeline,
  Clipboard,
  Info,
} from "@vibe/icons";
import { usePriorizacionStore, getMacroStage } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";
import { BackButton } from "@/components/BackButton";

const CARTERAS = [
  "Todas",
  "Digital",
  "Negocios Financieros",
  "EPL / Logística",
  "Operaciones TI",
  "Comercial / Tiendas",
];

export default function PortfolioPage() {
  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const selectedCartera = usePriorizacionStore((s) => s.selectedCartera);
  const setSelectedCartera = usePriorizacionStore((s) => s.setSelectedCartera);
  const setSelectedInitiativeId = usePriorizacionStore((s) => s.setSelectedInitiativeId);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Filtro activo en el Home (por defecto: "Aprobadas en proceso")
  const [selectedKpiCard, setSelectedKpiCard] = useState<
    "aprobadas" | "backlog" | "sin_etapa" | "rechazadas"
  >("aprobadas");
  const [selectedBacklogPill, setSelectedBacklogPill] = useState<"registradas" | "revision">(
    "registradas"
  );

  useEffect(() => {
    setActiveMenuTitle("Portafolio");
  }, [setActiveMenuTitle]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      setCurrentTimeStr(
        now.toLocaleTimeString("es-MX", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filtrado de iniciativas por la cartera seleccionada
  const initiativesInCartera = useMemo(() => {
    if (selectedCartera === "Todas") return initiatives;
    return initiatives.filter((i) => i.cartera === selectedCartera);
  }, [initiatives, selectedCartera]);

  // Métricas reactivas de los 4 botones de filtro en Home
  const totalIdeas = initiativesInCartera.length;

  const countEjecucion = useMemo(
    () =>
      initiativesInCartera.filter(
        (i) => (i.etapaCiclo === "Ejecución" || i.etapaCiclo === "Cierre") && i.status !== "Descartada"
      ).length,
    [initiativesInCartera]
  );

  const countAutorizacion = useMemo(
    () =>
      initiativesInCartera.filter(
        (i) =>
          (i.etapaCiclo === "Autorización" || i.etapaCiclo === "Formalización") &&
          i.status !== "Descartada"
      ).length,
    [initiativesInCartera]
  );

  const countAprobadasEnProceso = useMemo(
    () => countEjecucion + countAutorizacion,
    [countEjecucion, countAutorizacion]
  );

  const countRegistradasPill = useMemo(
    () =>
      initiativesInCartera.filter(
        (i) =>
          (!i.etapaCiclo || i.etapaCiclo === "Priorización" || i.etapaCiclo === "Estimación") &&
          (i.status === "Nueva" || i.status === "En priorización" || i.status === "Lista") &&
          i.decision !== "descartar"
      ).length,
    [initiativesInCartera]
  );

  const countEnRevisionPill = useMemo(
    () =>
      initiativesInCartera.filter(
        (i) =>
          (!i.etapaCiclo || i.etapaCiclo === "Priorización" || i.etapaCiclo === "Estimación") &&
          (i.status === "En revisión" || i.status === "Con comentarios") &&
          i.decision !== "descartar"
      ).length,
    [initiativesInCartera]
  );

  const countBacklog = useMemo(
    () => countRegistradasPill + countEnRevisionPill,
    [countRegistradasPill, countEnRevisionPill]
  );

  const countSinEtapa = useMemo(
    () => initiativesInCartera.filter((i) => !i.etapaCiclo).length,
    [initiativesInCartera]
  );

  const countRechazadas = useMemo(
    () =>
      initiativesInCartera.filter((i) => i.status === "Descartada" || i.decision === "descartar")
        .length,
    [initiativesInCartera]
  );

  // Conteo de iniciativas en las 4 etapas macro acordadas (para el widget de dona)
  const countStage1_Definicion = useMemo(
    () => initiativesInCartera.filter((i) => getMacroStage(i.etapaCiclo) === "Definición").length,
    [initiativesInCartera]
  );
  const countStage2_Estimacion = useMemo(
    () => initiativesInCartera.filter((i) => getMacroStage(i.etapaCiclo) === "Estimación").length,
    [initiativesInCartera]
  );
  const countStage3_Ejecucion = useMemo(
    () => initiativesInCartera.filter((i) => getMacroStage(i.etapaCiclo) === "Ejecución").length,
    [initiativesInCartera]
  );
  const countStage4_Cierre = useMemo(
    () => initiativesInCartera.filter((i) => getMacroStage(i.etapaCiclo) === "Cierre").length,
    [initiativesInCartera]
  );

  const totalInitiatives = initiativesInCartera.length || 1;

  // Cálculo para los 4 segmentos de la gráfica de dona (Circunferencia r=40 es ~251.33)
  const c = 251.33;
  const arcDef = (countStage1_Definicion / totalInitiatives) * c;
  const arcEst = (countStage2_Estimacion / totalInitiatives) * c;
  const arcEje = (countStage3_Ejecucion / totalInitiatives) * c;
  const arcCie = (countStage4_Cierre / totalInitiatives) * c;

  const pctDef = Math.round((countStage1_Definicion / totalInitiatives) * 100);
  const pctEst = Math.round((countStage2_Estimacion / totalInitiatives) * 100);
  const pctEje = Math.round((countStage2_Estimacion ? countStage3_Ejecucion / totalInitiatives : countStage3_Ejecucion / totalInitiatives) * 100);
  const pctCie = Math.round((countStage4_Cierre / totalInitiatives) * 100);

  // Lista prioritaria filtrada según el botón seleccionado en los 4 KPIs
  const displayedInitiatives = useMemo(() => {
    return initiativesInCartera.filter((item) => {
      if (selectedKpiCard === "aprobadas") {
        return (
          ["Ejecución", "Autorización", "Formalización", "Cierre"].includes(item.etapaCiclo || "") &&
          item.status !== "Descartada" &&
          item.decision !== "descartar"
        );
      }
      if (selectedKpiCard === "rechazadas") {
        return item.status === "Descartada" || item.decision === "descartar";
      }
      if (selectedKpiCard === "sin_etapa") {
        return !item.etapaCiclo;
      }
      // "backlog"
      const isBacklogCandidate =
        (!item.etapaCiclo || item.etapaCiclo === "Priorización" || item.etapaCiclo === "Estimación") &&
        item.status !== "Descartada" &&
        item.decision !== "descartar";
      if (!isBacklogCandidate) return false;

      if (selectedBacklogPill === "revision") {
        return item.status === "En revisión" || item.status === "Con comentarios";
      }
      return item.status === "Nueva" || item.status === "En priorización" || item.status === "Lista";
    });
  }, [initiativesInCartera, selectedKpiCard, selectedBacklogPill]);

  const filterSubtitle = useMemo(() => {
    if (selectedKpiCard === "aprobadas") {
      return `Mostrando: Aprobadas en proceso (${displayedInitiatives.length})`;
    }
    if (selectedKpiCard === "backlog") {
      const subLabel = selectedBacklogPill === "revision" ? "En revisión" : "Registradas";
      return `Mostrando: Backlog por priorizar · ${subLabel} (${displayedInitiatives.length})`;
    }
    if (selectedKpiCard === "sin_etapa") {
      return `Mostrando: Sin etapa definida (${displayedInitiatives.length})`;
    }
    return `Mostrando: Rechazadas (${displayedInitiatives.length})`;
  }, [selectedKpiCard, selectedBacklogPill, displayedInitiatives.length]);

  const getEtapaPill = (etapa?: string) => {
    const macro = getMacroStage(etapa);
    switch (macro) {
      case "Definición":
        return (
          <span className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-blue-600">
            1. Definición
          </span>
        );
      case "Estimación":
        return (
          <span className="inline-flex items-center rounded-xl border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-violet-600">
            2. Estimación
          </span>
        );
      case "Ejecución":
        return (
          <span className="inline-flex items-center rounded-xl border border-status-green-border bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-success-500">
            3. Ejecución
          </span>
        );
      case "Cierre":
        return (
          <span className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-gray-700">
            4. Cierre
          </span>
        );
    }
  };

  const getEstadoPill = (estado?: string, statusFallback?: string) => {
    const st = estado || statusFallback || "Por iniciar";
    if (st === "Nueva" || st === "Por revisar" || st === "Por iniciar") {
      return (
        <span className="inline-flex items-center rounded-xl border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-pink-600">
          Por iniciar
        </span>
      );
    }
    if (st === "En priorización" || st === "En revisión" || st === "En ejecución" || st === "En proceso" || st === "En curso") {
      return (
        <span className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-blue-600">
          En curso
        </span>
      );
    }
    if (st === "Lista" || st === "Aprobada" || st === "Finalizado" || st === "Cerrada") {
      return (
        <span className="inline-flex items-center rounded-xl border border-green-200 bg-green-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-green-600">
          Finalizado
        </span>
      );
    }
    if (st === "Con comentarios" || st === "Atrasado" || st === "Ajustes solicitados") {
      return (
        <span className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-red-500">
          Atrasado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-gray-600">
        {st}
      </span>
    );
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <span className="text-gray-400">-</span>;
    if (score >= 80) {
      return (
        <span className="inline-flex min-w-[34px] items-center justify-center rounded-lg border border-status-green-border bg-emerald-50 px-2 py-[3px] text-xs font-bold text-success-500">
          {score}
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex min-w-[34px] items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-2 py-[3px] text-xs font-bold text-warning-500">
          {score}
        </span>
      );
    }
    return (
      <span className="inline-flex min-w-[34px] items-center justify-center rounded-lg border border-status-orange-border bg-status-orange-bg px-2 py-[3px] text-xs font-bold text-orange-600">
        {score}
      </span>
    );
  };

  const getRowBorderColor = (color?: string) => {
    const map: Record<string, string> = {
      "#e6007e": "border-l-brand-accent",
      "#833177": "border-l-brand-primary",
      "#8b5cf6": "border-l-violet-500",
      "#7c3aed": "border-l-violet-600",
      "#f59e0b": "border-l-amber-500",
      "#d97706": "border-l-warning-500",
      "#ea580c": "border-l-orange-600",
      "#ec4899": "border-l-pink-500",
      "#db2777": "border-l-pink-600",
      "#e11d48": "border-l-rose-600",
      "#10b981": "border-l-emerald-500",
      "#059669": "border-l-success-500",
      "#3b82f6": "border-l-blue-500",
      "#2563eb": "border-l-blue-600",
      "#0284c7": "border-l-info-500",
    };
    return map[color || ""] || "border-l-brand-primary";
  };

  return (
    <div>
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* 1. SECCIÓN HERO (Bienvenida ejecutiva) */}
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
        <div>
          <div className="mb-0.5 text-[11px] font-bold tracking-[1px] text-brand-primary uppercase">
            BIENVENIDA
          </div>
          <h1 className="m-0 mb-1 text-[26px] font-extrabold text-text-heading">
            Home • Portafolio
          </h1>
          <p className="m-0 text-[13.5px] text-text-secondary">
            Consulta el estado de tus iniciativas, aprobaciones y solicitudes del portafolio.
          </p>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="flex items-center text-amber-500">
            <Icon icon={Sun} size={32} />
          </div>
          <div>
            <div className="text-2xl leading-[1.1] font-bold text-text-heading">
              {currentTimeStr || "9:24 a.m."}
            </div>
            <div className="mt-0.5 text-[12.5px] text-text-secondary capitalize">
              {currentDateStr || "Jueves, 24 de Septiembre de 2026"}
            </div>
            <div className="mt-1.5 flex items-center justify-end gap-2">
              <span className="h-[3px] w-6 rounded-xs bg-brand-accent" />
              <span className="text-[11.5px] font-medium text-text-secondary">
                Grandes ideas, mayores resultados.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Selector de Cartera de Negocio Independiente */}
      <div className="my-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-card px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase">
            Cartera de Negocio:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CARTERAS.map((c) => {
              const isSelected = selectedCartera === c;
              return (
                <button
                  key={c}
                  type="button"
                  className={`inline-flex cursor-pointer items-center rounded-xl border px-2.5 py-[3px] text-[11.5px] tracking-[0.2px] whitespace-nowrap transition-colors ${
                    isSelected
                      ? "border-status-purple-border bg-status-purple-bg font-bold text-status-purple-text"
                      : "border-status-gray-border bg-status-gray-bg font-medium text-status-gray-text hover:bg-brand-primary-light hover:text-brand-primary"
                  }`}
                  onClick={() => setSelectedCartera(c)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
        <div className="text-[11.5px] text-slate-500">
          Portafolio activo: <strong>{initiativesInCartera.length}</strong> iniciativas en {selectedCartera}
        </div>
      </div>

      {/* 2. FILTROS DE PORTAFOLIO (4 BOTONES DE ESTADO) */}
      <div className="mt-4 mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Aprobadas en proceso */}
        <div
          className={`relative flex min-h-[142px] cursor-pointer flex-col justify-between rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 ${
            selectedKpiCard === "aprobadas"
              ? "border-success-500 bg-green-50 shadow-[0_6px_18px_rgba(5,150,105,0.12)]"
              : "border-slate-200 bg-bg-card shadow-2xs hover:border-[#d9bfd5] hover:shadow-[0_6px_18px_rgba(131,49,119,0.08)]"
          }`}
          onClick={() => setSelectedKpiCard("aprobadas")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-success-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#059669"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="8 12 11 15 16 9" />
            </svg>
          </div>

          <div className="mt-1.5 text-[34px] leading-none font-extrabold text-text-heading">
            {countAprobadasEnProceso}
          </div>

          <div>
            <div className="mt-1 text-[14.5px] font-bold text-slate-800">
              Aprobadas en proceso
            </div>
            <div className="mt-0.5 text-xs leading-[1.3] font-medium text-slate-500">
              Ejecución {countEjecucion} · Autorización {countAutorizacion}
            </div>
          </div>
        </div>

        {/* 2. Backlog por priorizar */}
        <div
          className={`relative flex min-h-[142px] cursor-pointer flex-col justify-between rounded-2xl border-[1.5px] bg-[#fdf5f9] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b52670] hover:shadow-[0_6px_18px_rgba(181,38,112,0.12)] ${
            selectedKpiCard === "backlog"
              ? "border-[#b52670] shadow-[0_6px_18px_rgba(181,38,112,0.12)]"
              : "border-[#f3c5de] shadow-2xs"
          }`}
          onClick={() => {
            setSelectedKpiCard("backlog");
            setSelectedBacklogPill("registradas");
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#b52670] text-white">
              <Icon icon={Clipboard} size={17} />
            </div>
            <span className="text-[14.5px] font-bold text-[#9d2469]">
              Backlog por priorizar
            </span>
          </div>

          <div className="mt-1.5 mb-0.5 flex items-baseline gap-2">
            <span className="text-[34px] leading-none font-extrabold text-text-heading">
              {countBacklog}
            </span>
            <span className="text-[13px] font-medium text-slate-500">
              de {totalIdeas} ideas asignadas
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              className={`cursor-pointer rounded-full bg-bg-card px-3 py-[3px] text-xs leading-[1.3] transition-all duration-150 ${
                selectedKpiCard === "backlog" && selectedBacklogPill === "registradas"
                  ? "border-[1.5px] border-[#b52670] font-bold text-[#b52670]"
                  : "border border-slate-300 font-semibold text-slate-600 hover:border-[#b52670] hover:text-[#b52670]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedKpiCard("backlog");
                setSelectedBacklogPill("registradas");
              }}
            >
              Registradas {countRegistradasPill}
            </button>
            <button
              type="button"
              className={`cursor-pointer rounded-full bg-bg-card px-3 py-[3px] text-xs leading-[1.3] transition-all duration-150 ${
                selectedKpiCard === "backlog" && selectedBacklogPill === "revision"
                  ? "border-[1.5px] border-[#b52670] font-bold text-[#b52670]"
                  : "border border-slate-300 font-semibold text-slate-600 hover:border-[#b52670] hover:text-[#b52670]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedKpiCard("backlog");
                setSelectedBacklogPill("revision");
              }}
            >
              En revisión {countEnRevisionPill}
            </button>
          </div>
        </div>

        {/* 3. Sin etapa definida */}
        <div
          className={`relative flex min-h-[142px] cursor-pointer flex-col justify-between rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 ${
            selectedKpiCard === "sin_etapa"
              ? "border-slate-500 bg-slate-50 shadow-[0_6px_18px_rgba(100,116,139,0.12)]"
              : "border-slate-200 bg-bg-card shadow-2xs hover:border-[#d9bfd5] hover:shadow-[0_6px_18px_rgba(131,49,119,0.08)]"
          }`}
          onClick={() => setSelectedKpiCard("sin_etapa")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>

          <div className="mt-1.5 text-[34px] leading-none font-extrabold text-text-heading">
            {countSinEtapa}
          </div>

          <div>
            <div className="mt-1 text-[14.5px] font-bold text-slate-800">
              Sin etapa definida
            </div>
            <div className="mt-0.5 text-xs leading-[1.3] font-medium text-slate-500">
              Aprobadas sin confirmar ruta ni iniciar proceso
            </div>
          </div>
        </div>

        {/* 4. Rechazadas */}
        <div
          className={`relative flex min-h-[142px] cursor-pointer flex-col justify-between rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 ${
            selectedKpiCard === "rechazadas"
              ? "border-danger-500 bg-red-50 shadow-[0_6px_18px_rgba(220,38,38,0.12)]"
              : "border-slate-200 bg-bg-card shadow-2xs hover:border-[#d9bfd5] hover:shadow-[0_6px_18px_rgba(131,49,119,0.08)]"
          }`}
          onClick={() => setSelectedKpiCard("rechazadas")}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-danger-500">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <div className="mt-1.5 text-[34px] leading-none font-extrabold text-text-heading">
            {countRechazadas}
          </div>

          <div>
            <div className="mt-1 text-[14.5px] font-bold text-slate-800">
              Rechazadas
            </div>
            <div className="mt-0.5 text-xs leading-[1.3] font-medium text-slate-500">
              Ideas no priorizadas
            </div>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE ACCIONES CLAVE */}
      <section className="mb-5.5 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-border-default bg-bg-card px-5 py-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
            <Icon icon={Bolt} size={20} />
          </div>
          <div>
            <div className="text-[14.5px] font-bold text-text-heading">Acciones clave</div>
            <div className="text-[12.5px] text-text-secondary">
              Accede a los módulos clave del ciclo automatizado de iniciativas.
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/discovery"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white no-underline transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
          >
            <span>+ Crear nueva iniciativa</span>
          </Link>
        </div>
      </section>

      {/* 4. LAYOUT A DOS COLUMNAS */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
        {/* COLUMNA IZQUIERDA: BANDEJA PRIORITARIA */}
        <section
          className="rounded-[14px] border border-border-default bg-bg-card px-5.5 py-5 shadow-2xs"
          id="priorizacion"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-brand-primary-light text-brand-primary">
                <Icon icon={CheckList} size={18} />
              </div>
              <div>
                <h2 className="m-0 text-[17px] font-bold text-text-heading">
                  Bandeja prioritaria
                </h2>
                <div className="mt-0.5 text-[12.5px] text-text-secondary">
                  {filterSubtitle}
                </div>
              </div>
            </div>

            <Link
              href="/iniciativas"
              className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-primary no-underline hover:underline"
            >
              <span>Ver todas</span>
              <span>→</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border-default bg-[#fafbfc] text-left text-xs font-semibold text-text-secondary">
                  <th className="w-[27%] px-3 py-2.5">Iniciativa</th>
                  <th className="w-[20%] px-3 py-2.5">Área</th>
                  <th className="w-[16%] px-3 py-2.5">Etapa actual</th>
                  <th className="w-[9%] px-3 py-2.5">Score</th>
                  <th className="w-[16%] px-3 py-2.5">Estado</th>
                  <th className="w-[12%] px-3 py-2.5 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {displayedInitiatives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-9 text-center">
                      <div className="mb-1 text-sm font-bold text-slate-800">
                        No hay iniciativas en este estado
                      </div>
                      <div className="text-[12.5px] text-slate-500">
                        Selecciona otro filtro en las tarjetas superiores para consultar las iniciativas.
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedInitiatives.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#f1f3f7] transition-colors hover:bg-[#fafbfe]"
                    >
                      <td className={`border-l-4 py-[13px] pr-3 pl-3.5 align-middle ${getRowBorderColor(item.color)}`}>
                        <Link
                          href={`/iniciativas?id=${item.id}`}
                          onClick={() => setSelectedInitiativeId(item.id)}
                          className="inline-block pl-2 text-[13.5px] font-bold text-text-heading no-underline hover:text-brand-primary"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-3 py-[13px] align-middle">
                        <span className="text-[13px] text-text-secondary">
                          {item.area}
                        </span>
                      </td>
                      <td className="px-3 py-[13px] align-middle">
                        {getEtapaPill(item.etapaCiclo)}
                      </td>
                      <td className="px-3 py-[13px] align-middle">
                        {getScoreBadge(item.score)}
                      </td>
                      <td className="px-3 py-[13px] align-middle">
                        {getEstadoPill(item.estadoOperativo, item.status)}
                      </td>
                      <td className="px-3 py-[13px] text-center align-middle">
                        <Link
                          href={`/iniciativas?id=${item.id}`}
                          onClick={() => setSelectedInitiativeId(item.id)}
                          className="inline-flex cursor-pointer items-center justify-center rounded-md border border-pink-600 bg-bg-card px-4.5 py-1 text-xs font-semibold text-brand-primary no-underline transition-all duration-150 hover:border-brand-primary hover:bg-[#fdf5fa]"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Banner Informativo explicativo de 4 etapas y 4 estados */}
          <div className="mt-3.5 flex items-center gap-2.5 rounded-lg border border-[#cce3fd] bg-[#f0f7ff] px-3.5 py-2.5 text-[11.5px] leading-[1.4] text-gray-700">
            <span className="flex shrink-0 items-center text-info-500">
              <Icon icon={Info} size={16} />
            </span>
            <span>
              La <strong>etapa</strong> indica el progreso macro (1. Definición → 2. Estimación → 3. Ejecución → 4. Cierre), mientras que el <strong>estado</strong> refleja la condición operativa estándar (Por iniciar, En curso, Finalizado, Atrasado).
            </span>
          </div>
        </section>

        {/* COLUMNA DERECHA: 3 WIDGETS (Imagen 2) */}
        <div className="flex flex-col gap-5">
          {/* Widget 1: Vista por etapa (Donut con 6 etapas) */}
          <section className="rounded-[14px] border border-border-default bg-bg-card p-5 shadow-2xs">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary-light text-brand-primary">
                <Icon icon={Timeline} size={18} />
              </div>
              <div>
                <h3 className="m-0 text-sm font-bold text-text-heading">Vista por etapa</h3>
                <div className="text-[11.5px] text-text-secondary">
                  Distribución de iniciativas en el portafolio.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              {/* Gráfica de dona SVG con 4 segmentos proporcionales homologados */}
              <div className="relative h-[120px] w-[120px] shrink-0">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {/* Segmento 1: Definición (Azul #2563eb) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="14"
                    strokeDasharray={`${arcDef} ${c}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 60 60)"
                  />
                  {/* Segmento 2: Estimación (Morado #8b5cf6) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="14"
                    strokeDasharray={`${arcEst} ${c}`}
                    strokeDashoffset={`-${arcDef}`}
                    transform="rotate(-90 60 60)"
                  />
                  {/* Segmento 3: Ejecución (Verde #10b981) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray={`${arcEje} ${c}`}
                    strokeDashoffset={`-${arcDef + arcEst}`}
                    transform="rotate(-90 60 60)"
                  />
                  {/* Segmento 4: Cierre (Slate Oscuro #1e293b) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="14"
                    strokeDasharray={`${arcCie} ${c}`}
                    strokeDashoffset={`-${arcDef + arcEst + arcEje}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className=" absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl leading-none font-extrabold text-text-heading">
                    {initiativesInCartera.length}
                  </span>
                  <span className="mt-0.5 text-[10px] text-text-secondary">iniciativas</span>
                </div>
              </div>

              {/* Leyenda con las 4 etapas macro, conteos y porcentajes exactos */}
              <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-blue-600" />
                    <span>Definición</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{countStage1_Definicion}</span>
                    <span className="font-medium text-text-secondary">{pctDef}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-violet-500" />
                    <span>Estimación</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{countStage2_Estimacion}</span>
                    <span className="font-medium text-text-secondary">{pctEst}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-emerald-500" />
                    <span>Ejecución</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{countStage3_Ejecucion}</span>
                    <span className="font-medium text-text-secondary">{pctEje}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-slate-800" />
                    <span>Cierre</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span>{countStage4_Cierre}</span>
                    <span className="font-medium text-text-secondary">{pctCie}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Widget 2: Pendientes clave (Imagen 2) */}
          <section
            className="rounded-[14px] border border-border-default bg-bg-card p-5 shadow-2xs"
            id="aprobaciones"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                <Icon icon={Alert} size={18} />
              </div>
              <div>
                <h3 className="m-0 text-sm font-bold text-text-heading">Pendientes clave</h3>
                <div className="text-[11.5px] text-text-secondary">
                  Temas que requieren tu atención
                </div>
              </div>
              <Link
                href="/iniciativas"
                className="ml-auto text-xs font-semibold text-brand-primary no-underline hover:underline"
              >
                Ver todas →
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/iniciativas"
                className="flex cursor-pointer items-center justify-between rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3 py-2.5 text-inherit no-underline transition-all duration-150 hover:translate-x-0.5 hover:border-[#e5d2e2] hover:bg-brand-primary-light"
              >
                <div className="flex items-center gap-2.5 text-[12.5px] font-semibold text-text-heading">
                  <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <Icon icon={Alert} size={14} />
                  </div>
                  <span>3 iniciativas por revisar</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>

              <Link
                href="/iniciativas"
                className="flex cursor-pointer items-center justify-between rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3 py-2.5 text-inherit no-underline transition-all duration-150 hover:translate-x-0.5 hover:border-[#e5d2e2] hover:bg-brand-primary-light"
              >
                <div className="flex items-center gap-2.5 text-[12.5px] font-semibold text-text-heading">
                  <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-amber-50 text-warning-500">
                    <Icon icon={Time} size={14} />
                  </div>
                  <span>5 en espera de comité</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>

              <Link
                href="/project/proj-01"
                className="flex cursor-pointer items-center justify-between rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3 py-2.5 text-inherit no-underline transition-all duration-150 hover:translate-x-0.5 hover:border-[#e5d2e2] hover:bg-brand-primary-light"
              >
                <div className="flex items-center gap-2.5 text-[12.5px] font-semibold text-text-heading">
                  <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary">
                    <Icon icon={FileIcon} size={14} />
                  </div>
                  <span>3 con documentos pendientes</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>
            </div>
          </section>

          {/* Widget 3: Próximos hitos (Imagen 2) */}
          <section
            className="rounded-[14px] border border-border-default bg-bg-card p-5 shadow-2xs"
            id="hitos"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                <Icon icon={Calendar} size={18} />
              </div>
              <div>
                <h3 className="m-0 text-sm font-bold text-text-heading">Próximos hitos</h3>
                <div className="text-[11.5px] text-text-secondary">
                  Fechas importantes del portafolio
                </div>
              </div>
              <Link
                href="/en-construccion?modulo=Calendario%20de%20Hitos"
                className="ml-auto text-xs font-semibold text-brand-primary no-underline hover:underline"
              >
                Ver calendario →
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/en-construccion?modulo=Comité%20de%20Portafolio"
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-[9px] text-gray-700 no-underline transition-colors duration-150 hover:bg-gray-50"
              >
                <div className="w-[95px] shrink-0 text-xs font-bold text-text-heading">
                  29 Sep 2026
                </div>
                <div className="flex flex-1 items-center gap-2 text-xs text-gray-600">
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-violet-500" />
                  <span>Comité de portafolio</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>

              <Link
                href="/en-construccion?modulo=Cierre%20de%20Estimaciones%20Q4"
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-[9px] text-gray-700 no-underline transition-colors duration-150 hover:bg-gray-50"
              >
                <div className="w-[95px] shrink-0 text-xs font-bold text-text-heading">
                  15 Oct 2026
                </div>
                <div className="flex flex-1 items-center gap-2 text-xs text-gray-600">
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-slate-500" />
                  <span>Cierre de estimaciones Q4</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

