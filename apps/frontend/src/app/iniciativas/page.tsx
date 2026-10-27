"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@vibe/core";
import {
  File as FileIcon,
  CheckList,
  Person,
  Check,
  Clipboard,
  NavigationChevronRight,
  NavigationChevronLeft,
  Send,
  Comment,
  Delete,
  Close,
  Timeline,
  Settings,
  MoreActions,
  Security,
  Play,
  Alert,
} from "@vibe/icons";
import { usePriorizacionStore, InitiativeItem } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";
import { BackButton } from "@/components/BackButton";

type StageFilter =
  | "Priorización"
  | "Estimación"
  | "Autorización"
  | "Formalización"
  | "Ejecución"
  | "Cierre";

const STAGES_CONFIG: {
  id: StageFilter;
  step: number;
  title: string;
  subtitle: string;
  activeCardClass: string;
  activeBadgeIconClass: string;
  inactiveBadgeIconClass: string;
  stepPillClass: string;
  activeTitleClass: string;
  icon: typeof Clipboard;
}[] = [
  {
    id: "Priorización",
    step: 1,
    title: "Priorización",
    subtitle: "Evaluación y score",
    activeCardClass: "border-[#b52670] bg-[#fdf5f9] shadow-[0_6px_18px_rgba(181,38,112,0.13)]",
    activeBadgeIconClass: "border-[#f3c5de] bg-[#b52670] text-white",
    inactiveBadgeIconClass: "border-[#f3c5de] bg-[#fdf5f9] text-[#b52670]",
    stepPillClass: "border-[#f3c5de] bg-bg-card text-[#b52670]",
    activeTitleClass: "text-[#b52670]",
    icon: Clipboard,
  },
  {
    id: "Estimación",
    step: 2,
    title: "Estimación",
    subtitle: "Sizing y VoBo TI",
    activeCardClass: "border-violet-600 bg-violet-50 shadow-[0_6px_18px_rgba(124,58,237,0.13)]",
    activeBadgeIconClass: "border-violet-200 bg-violet-600 text-white",
    inactiveBadgeIconClass: "border-violet-200 bg-violet-50 text-violet-600",
    stepPillClass: "border-violet-200 bg-bg-card text-violet-600",
    activeTitleClass: "text-violet-600",
    icon: Timeline,
  },
  {
    id: "Autorización",
    step: 3,
    title: "Autorización",
    subtitle: "Dictamen y presupuesto",
    activeCardClass: "border-warning-500 bg-amber-50 shadow-[0_6px_18px_rgba(217,119,6,0.13)]",
    activeBadgeIconClass: "border-amber-200 bg-warning-500 text-white",
    inactiveBadgeIconClass: "border-amber-200 bg-amber-50 text-warning-500",
    stepPillClass: "border-amber-200 bg-bg-card text-warning-500",
    activeTitleClass: "text-warning-500",
    icon: Security,
  },
  {
    id: "Formalización",
    step: 4,
    title: "Formalización",
    subtitle: "Contratos y planeación",
    activeCardClass: "border-info-500 bg-sky-50 shadow-[0_6px_18px_rgba(2,132,199,0.13)]",
    activeBadgeIconClass: "border-sky-200 bg-info-500 text-white",
    inactiveBadgeIconClass: "border-sky-200 bg-sky-50 text-info-500",
    stepPillClass: "border-sky-200 bg-bg-card text-info-500",
    activeTitleClass: "text-info-500",
    icon: FileIcon,
  },
  {
    id: "Ejecución",
    step: 5,
    title: "Ejecución",
    subtitle: "Desarrollo y entrega",
    activeCardClass: "border-success-500 bg-emerald-50 shadow-[0_6px_18px_rgba(5,150,105,0.13)]",
    activeBadgeIconClass: "border-status-green-border bg-success-500 text-white",
    inactiveBadgeIconClass: "border-status-green-border bg-emerald-50 text-success-500",
    stepPillClass: "border-status-green-border bg-bg-card text-success-500",
    activeTitleClass: "text-success-500",
    icon: Play,
  },
  {
    id: "Cierre",
    step: 6,
    title: "Cierre",
    subtitle: "Valor capturado",
    activeCardClass: "border-slate-800 bg-slate-100 shadow-[0_6px_18px_rgba(30,41,59,0.13)]",
    activeBadgeIconClass: "border-slate-300 bg-slate-800 text-white",
    inactiveBadgeIconClass: "border-slate-300 bg-slate-100 text-slate-800",
    stepPillClass: "border-slate-300 bg-bg-card text-slate-800",
    activeTitleClass: "text-slate-800",
    icon: Check,
  },
];

const PROGRESS_WIDTH_CLASSES: Record<number, string> = {
  0: "w-0",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-[20%]",
  25: "w-[25%]",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-[40%]",
  45: "w-[45%]",
  50: "w-[50%]",
  55: "w-[55%]",
  60: "w-[60%]",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-[75%]",
  80: "w-[80%]",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-full",
};

function getProgressWidthClass(value: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(value / 5) * 5));
  return PROGRESS_WIDTH_CLASSES[clamped] || "w-1/2";
}

const MATRIX_LEFT_CLASSES: Record<number, string> = {
  10: "left-[10%]",
  15: "left-[15%]",
  20: "left-[20%]",
  25: "left-[25%]",
  30: "left-[30%]",
  35: "left-[35%]",
  40: "left-[40%]",
  45: "left-[45%]",
  50: "left-[50%]",
  55: "left-[55%]",
  60: "left-[60%]",
  65: "left-[65%]",
  70: "left-[70%]",
  75: "left-[75%]",
  80: "left-[80%]",
  85: "left-[85%]",
  90: "left-[90%]",
};

const MATRIX_BOTTOM_CLASSES: Record<number, string> = {
  10: "bottom-[10%]",
  15: "bottom-[15%]",
  20: "bottom-[20%]",
  25: "bottom-[25%]",
  30: "bottom-[30%]",
  35: "bottom-[35%]",
  40: "bottom-[40%]",
  45: "bottom-[45%]",
  50: "bottom-[50%]",
  55: "bottom-[55%]",
  60: "bottom-[60%]",
  65: "bottom-[65%]",
  70: "bottom-[70%]",
  75: "bottom-[75%]",
  80: "bottom-[80%]",
  85: "bottom-[85%]",
  90: "bottom-[90%]",
};

function getMatrixPointPositionClasses(esfuerzo: number, impacto: number): string {
  const leftVal = Math.max(10, Math.min(90, Math.round((10 + (esfuerzo / 100) * 78) / 5) * 5));
  const bottomVal = Math.max(10, Math.min(90, Math.round((10 + (impacto / 100) * 78) / 5) * 5));
  return `${MATRIX_LEFT_CLASSES[leftVal] || "left-[50%]"} ${MATRIX_BOTTOM_CLASSES[bottomVal] || "bottom-[50%]"}`;
}

function getMatrixPointBgClass(color?: string): string {
  const map: Record<string, string> = {
    "#e6007e": "bg-brand-accent",
    "#833177": "bg-brand-primary",
    "#8b5cf6": "bg-violet-500",
    "#7c3aed": "bg-violet-600",
    "#f59e0b": "bg-amber-500",
    "#d97706": "bg-warning-500",
    "#ea580c": "bg-orange-600",
    "#ec4899": "bg-pink-500",
    "#db2777": "bg-pink-600",
    "#e11d48": "bg-rose-600",
    "#10b981": "bg-emerald-500",
    "#059669": "bg-success-500",
    "#3b82f6": "bg-blue-500",
    "#2563eb": "bg-blue-600",
    "#0284c7": "bg-info-500",
  };
  return map[color || ""] || "bg-brand-primary";
}

function getNormalizedStage(etapa?: InitiativeItem["etapaCiclo"]): StageFilter {
  if (!etapa || etapa === "Definición" || etapa === "Priorización") return "Priorización";
  if (etapa === "Estimación") return "Estimación";
  if (etapa === "Autorización") return "Autorización";
  if (etapa === "Formalización") return "Formalización";
  if (etapa === "Ejecución") return "Ejecución";
  if (etapa === "Cierre") return "Cierre";
  return "Priorización";
}

function IniciativasContent() {
  const searchParams = useSearchParams();
  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const selectedId = usePriorizacionStore((s) => s.selectedInitiativeId);
  const setSelectedId = usePriorizacionStore((s) => s.setSelectedInitiativeId);
  const saveEvaluationStore = usePriorizacionStore((s) => s.saveEvaluation);
  const requestAdjustmentsStore = usePriorizacionStore((s) => s.requestAdjustments);
  const discardInitiativeStore = usePriorizacionStore((s) => s.discardInitiative);
  const sendToCommitteeStore = usePriorizacionStore((s) => s.sendToCommittee);
  const selectedCartera = usePriorizacionStore((s) => s.selectedCartera);
  const setSelectedCartera = usePriorizacionStore((s) => s.setSelectedCartera);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Iniciativas");
  }, [setActiveMenuTitle]);

  // Filtro activo de los 6 stages (por defecto: "Priorización")
  const [selectedStage, setSelectedStage] = useState<StageFilter>("Priorización");

  // Si viene con query param ?id=..., sincronizar selección y su stage correspondiente
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      const target = initiatives.find((i) => i.id === idFromUrl);
      if (target) {
        setSelectedId(idFromUrl);
        setSelectedStage(getNormalizedStage(target.etapaCiclo));
      }
    }
  }, [searchParams, initiatives, setSelectedId]);

  const [activeDetailTab, setActiveDetailTab] = useState<
    "resumen" | "discovery" | "evaluacion" | "comentarios"
  >("resumen");
  const [notification, setNotification] = useState<string | null>(null);

  const CARTERAS = [
    "Todas",
    "Digital",
    "Negocios Financieros",
    "EPL / Logística",
    "Operaciones TI",
    "Comercial / Tiendas",
  ];

  // Iniciativas filtradas por Cartera de Negocio
  const initiativesInCartera = useMemo(() => {
    if (selectedCartera === "Todas") return initiatives;
    return initiatives.filter((i) => i.cartera === selectedCartera);
  }, [initiatives, selectedCartera]);

  // Conteos reactivos por cada uno de los 6 stages
  const stageCounts = useMemo(() => {
    const counts: Record<StageFilter, number> = {
      Priorización: 0,
      Estimación: 0,
      Autorización: 0,
      Formalización: 0,
      Ejecución: 0,
      Cierre: 0,
    };
    initiativesInCartera.forEach((item) => {
      const st = getNormalizedStage(item.etapaCiclo);
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [initiativesInCartera]);

  // Estado del modal interactivo de evaluación rápida
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [evalC1, setEvalC1] = useState(4); // Impacto
  const [evalC2, setEvalC2] = useState(5); // Alineación
  const [evalC3, setEvalC3] = useState(4); // Urgencia
  const [evalC4, setEvalC4] = useState(3); // Complejidad
  const [evalC5, setEvalC5] = useState(3); // Riesgos

  // Filtrado de tabla por Cartera y Stage seleccionado
  const filteredInitiatives = useMemo(() => {
    return initiativesInCartera.filter(
      (item) => getNormalizedStage(item.etapaCiclo) === selectedStage
    );
  }, [initiativesInCartera, selectedStage]);

  // Sincronizar selección de iniciativa si la lista filtrada cambia
  useEffect(() => {
    if (filteredInitiatives.length > 0 && !filteredInitiatives.some((i) => i.id === selectedId)) {
      setSelectedId(filteredInitiatives[0].id);
    }
  }, [filteredInitiatives, selectedId, setSelectedId]);

  const selectedInitiative = useMemo(
    () =>
      filteredInitiatives.find((item) => item.id === selectedId) ||
      initiatives.find((item) => item.id === selectedId) ||
      initiatives[0],
    [filteredInitiatives, initiatives, selectedId]
  );

  const selectedIndex = useMemo(
    () => filteredInitiatives.findIndex((item) => item.id === selectedId),
    [filteredInitiatives, selectedId]
  );

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedId(filteredInitiatives[selectedIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedIndex >= 0 && selectedIndex < filteredInitiatives.length - 1) {
      setSelectedId(filteredInitiatives[selectedIndex + 1].id);
    }
  };

  // Cálculos de score en tiempo real en modal
  const liveScore = Math.round(
    (evalC1 * 0.3 + evalC2 * 0.25 + evalC3 * 0.15 + evalC4 * 0.15 + evalC5 * 0.15) * 10
  );
  const livePriority = liveScore >= 80 ? "Alta" : liveScore >= 65 ? "Media" : "Baja";

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Guardar evaluación desde el modal
  const handleSaveEvaluation = () => {
    saveEvaluationStore(
      selectedId,
      {
        impactoNegocio: evalC1,
        alineacionEstrategica: evalC2,
        urgencia: evalC3,
        complejidad: evalC4,
        riesgos: evalC5,
      },
      liveScore,
      livePriority,
      "Lista"
    );
    setIsEvalModalOpen(false);
    showNotification(`Evaluación guardada exitosamente. Score asignado: ${liveScore} (${livePriority})`);
  };

  // Acciones rápidas
  const handleSendToCommittee = () => {
    sendToCommitteeStore(selectedId);
    showNotification(`Iniciativa "${selectedInitiative.name}" enviada a dictamen de comité`);
  };

  const handleRequestAdjustments = () => {
    requestAdjustmentsStore(selectedId);
    showNotification(`Se solicitaron ajustes al solicitante (${selectedInitiative.solicitante})`);
  };

  const handleDiscard = () => {
    discardInitiativeStore(selectedId);
    showNotification(`Iniciativa "${selectedInitiative.name}" archivada / descartada`);
  };

  const getStatusBadge = (status: InitiativeItem["status"]) => {
    switch (status) {
      case "Nueva":
        return (
          <span className="inline-flex items-center rounded-xl border border-pink-200 bg-pink-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-pink-600">
            Nueva
          </span>
        );
      case "En revisión":
        return (
          <span className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-warning-500">
            En revisión
          </span>
        );
      case "Lista":
        return (
          <span className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-blue-600">
            Lista
          </span>
        );
      case "Con comentarios":
        return (
          <span className="inline-flex items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-brand-primary">
            Con comentarios
          </span>
        );
      case "En priorización":
        return (
          <span className="inline-flex items-center rounded-xl border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-info-500">
            En priorización
          </span>
        );
      case "Descartada":
        return (
          <span className="inline-flex items-center rounded-xl border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-gray-500">
            Descartada
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: InitiativeItem["priority"]) => {
    if (!priority) return <span className="text-gray-400">-</span>;
    if (priority === "Alta") {
      return (
        <span className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-500">
          Alta
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-warning-500">
        Media
      </span>
    );
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <span className="text-gray-400">-</span>;
    if (score >= 80) {
      return (
        <span className="inline-flex min-w-[28px] items-center justify-center rounded-md border border-status-green-border bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-bold text-success-500">
          {score}
        </span>
      );
    }
    if (score >= 70) {
      return (
        <span className="inline-flex min-w-[28px] items-center justify-center rounded-md border border-teal-200 bg-teal-50 px-1.5 py-0.5 text-[11.5px] font-bold text-teal-600">
          {score}
        </span>
      );
    }
    return (
      <span className="inline-flex min-w-[28px] items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11.5px] font-bold text-warning-500">
        {score}
      </span>
    );
  };

  return (
    <div className="px-1 pb-10">
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-[calc(var(--app-header-height)+16px)] right-6 z-100 flex items-center gap-2.5 rounded-lg bg-text-heading px-4.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-opacity duration-150">
          <Icon icon={Check} size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. ENCABEZADO DE VISTA (Sin Breadcrumb y sin botones de Formalizar/Exportar) */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 mb-1.5 text-2xl font-extrabold tracking-[-0.3px] text-text-heading">
            Iniciativas del Portafolio
          </h1>
          <p className="m-0 text-[13.5px] text-text-secondary">
            Visualiza y da seguimiento a todas las iniciativas del portafolio a través de sus 6 etapas.
          </p>
        </div>
      </div>

      {/* Selector de Cartera de Negocio Independiente */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-card px-4 py-2.5">
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
          Mostrando <strong>{filteredInitiatives.length}</strong> iniciativas en etapa{" "}
          <strong>{selectedStage}</strong> ({selectedCartera})
        </div>
      </div>

      {/* 2. FILTROS POR LOS 6 STAGES DE UNA INICIATIVA */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {STAGES_CONFIG.map((stage) => {
          const isActive = selectedStage === stage.id;
          const count = stageCounts[stage.id] ?? 0;
          return (
            <button
              key={stage.id}
              type="button"
              className={`relative flex min-h-[142px] cursor-pointer flex-col justify-between rounded-2xl border px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                isActive
                  ? stage.activeCardClass
                  : "border-slate-200 bg-bg-card shadow-2xs hover:border-[#d9bfd5] hover:shadow-[0_6px_18px_rgba(131,49,119,0.08)]"
              }`}
              onClick={() => setSelectedStage(stage.id)}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                    isActive ? stage.activeBadgeIconClass : stage.inactiveBadgeIconClass
                  }`}
                >
                  <Icon icon={stage.icon} size={16} />
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${stage.stepPillClass}`}
                >
                  Etapa {stage.step}
                </span>
              </div>

              <div className="mt-2.5 text-[30px] leading-none font-extrabold text-text-heading">
                {count}
              </div>

              <div>
                <div
                  className={`mt-1 text-[14.5px] font-bold ${
                    isActive ? stage.activeTitleClass : "text-slate-800"
                  }`}
                >
                  {stage.title}
                </div>
                <div className="mt-0.5 text-xs leading-[1.3] font-medium text-slate-500">
                  {stage.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. BANDEJA CENTRAL (Tabla izquierda + Detalle derecho) */}
      <div className="mb-6 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(360px,1fr)]">
        {/* COLUMNA IZQUIERDA: TABLA DE INICIATIVAS */}
        <div className="flex flex-col overflow-hidden rounded-[14px] border border-border-default bg-bg-card shadow-2xs">
          <div className="flex-1 overflow-x-auto">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr className="border-b border-border-default bg-[#fafbfc] text-left text-[11.5px] font-semibold whitespace-nowrap text-text-secondary">
                  <th className="w-[34%] px-3 py-2.5">Iniciativa</th>
                  <th className="w-[20%] px-3 py-2.5">Área</th>
                  <th className="w-[14%] px-3 py-2.5">Estado</th>
                  <th className="w-[9%] px-3 py-2.5">Score</th>
                  <th className="w-[10%] px-3 py-2.5">Prioridad</th>
                  <th className="w-[13%] px-3 py-2.5 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredInitiatives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <Icon icon={FileIcon} size={22} />
                        </div>
                        <div className="text-[15px] font-bold text-slate-800">
                          No hay iniciativas en la etapa {selectedStage}
                        </div>
                        <p className="m-0 max-w-[360px] text-[13px] leading-[1.4] text-slate-500">
                          No se encontraron solicitudes registradas en esta etapa para la cartera seleccionada.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInitiatives.map((item) => {
                    const isSelected = item.id === selectedId;
                    return (
                      <tr
                        key={item.id}
                        className={`cursor-pointer border-b border-[#f1f3f7] transition-colors ${
                          isSelected ? "bg-[#fdf5fa]" : "hover:bg-[#fafbfe]"
                        }`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td
                          className={`border-l-[3px] p-3 align-middle transition-colors ${
                            isSelected ? "border-l-brand-primary" : "border-l-transparent"
                          }`}
                        >
                          <div className="text-[13px] leading-[1.3] font-bold text-text-heading">
                            {item.name}
                          </div>
                        </td>
                        <td className="p-3 align-middle">
                          <div className="text-xs text-text-secondary">
                            {item.cartera || item.area}
                          </div>
                        </td>
                        <td className="p-3 align-middle">{getStatusBadge(item.status)}</td>
                        <td className="p-3 align-middle">{getScoreBadge(item.score)}</td>
                        <td className="p-3 align-middle">{getPriorityBadge(item.priority)}</td>
                        <td
                          className="p-3 text-center align-middle"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              className="cursor-pointer rounded-md border border-[#d0d4e4] bg-bg-card px-2.5 py-[3px] text-[11.5px] font-semibold whitespace-nowrap text-text-heading transition-all duration-150 hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary"
                              onClick={() => setSelectedId(item.id)}
                            >
                              Previsualizar
                            </button>
                            <Link
                              href={`/iniciativas/evaluacion?id=${item.id}`}
                              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm border-none bg-transparent text-gray-500 transition-colors hover:bg-gray-100 hover:text-text-heading"
                              aria-label="Evaluar iniciativa"
                              title="Evaluar iniciativa"
                            >
                              <Icon icon={MoreActions} size={15} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLUMNA DERECHA: CARD CONTEXTUAL SEGÚN LA ETAPA SELECCIONADA */}
        <div className="flex flex-col rounded-[14px] border border-border-default bg-bg-card px-5 py-4.5 shadow-2xs">
          {/* Header del detalle con paginador */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusBadge(selectedInitiative.status)}
              <span className="rounded-full bg-brand-primary-light px-[9px] py-0.5 text-[11px] font-bold text-brand-primary">
                Etapa: {selectedStage}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-bg-card text-gray-600 transition-all duration-150 hover:enabled:border-brand-primary hover:enabled:text-brand-primary disabled:cursor-not-allowed disabled:opacity-35"
                disabled={selectedIndex <= 0}
                onClick={handlePrev}
                aria-label="Iniciativa anterior"
              >
                <Icon icon={NavigationChevronLeft} size={14} />
              </button>
              <button
                type="button"
                className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-bg-card text-gray-600 transition-all duration-150 hover:enabled:border-brand-primary hover:enabled:text-brand-primary disabled:cursor-not-allowed disabled:opacity-35"
                disabled={selectedIndex === -1 || selectedIndex >= filteredInitiatives.length - 1}
                onClick={handleNext}
                aria-label="Siguiente iniciativa"
              >
                <Icon icon={NavigationChevronRight} size={14} />
              </button>
            </div>
          </div>

          <h2 className="m-0 mb-1.5 text-[17px] leading-[1.3] font-extrabold text-text-heading">
            {selectedInitiative.name}
          </h2>
          <div className="mb-3.5 flex items-center gap-1.5 text-[12.5px] text-text-secondary">
            <Icon icon={Person} size={14} />
            <span>{selectedInitiative.area}</span>
          </div>

          {/* CONTENIDO SEGÚN STAGE SELECCIONADO */}
          {selectedStage === "Priorización" && (
            <>
              {/* Tabs del detalle de Priorización */}
              <div className="mb-3.5 flex gap-4 border-b border-border-default">
                <button
                  type="button"
                  className={`relative cursor-pointer border-none bg-transparent pt-1.5 pb-2 text-[13px] transition-colors duration-150 ${
                    activeDetailTab === "resumen"
                      ? "font-bold text-brand-accent after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-brand-accent"
                      : "font-semibold text-text-secondary hover:text-brand-primary"
                  }`}
                  onClick={() => setActiveDetailTab("resumen")}
                >
                  Resumen
                </button>
                <button
                  type="button"
                  className={`relative cursor-pointer border-none bg-transparent pt-1.5 pb-2 text-[13px] transition-colors duration-150 ${
                    activeDetailTab === "discovery"
                      ? "font-bold text-brand-accent after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-brand-accent"
                      : "font-semibold text-text-secondary hover:text-brand-primary"
                  }`}
                  onClick={() => setActiveDetailTab("discovery")}
                >
                  Discovery
                </button>
                <button
                  type="button"
                  className={`relative cursor-pointer border-none bg-transparent pt-1.5 pb-2 text-[13px] transition-colors duration-150 ${
                    activeDetailTab === "evaluacion"
                      ? "font-bold text-brand-accent after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-brand-accent"
                      : "font-semibold text-text-secondary hover:text-brand-primary"
                  }`}
                  onClick={() => setActiveDetailTab("evaluacion")}
                >
                  Evaluación
                </button>
                <button
                  type="button"
                  className={`relative cursor-pointer border-none bg-transparent pt-1.5 pb-2 text-[13px] transition-colors duration-150 ${
                    activeDetailTab === "comentarios"
                      ? "font-bold text-brand-accent after:absolute after:right-0 after:bottom-[-1px] after:left-0 after:h-0.5 after:bg-brand-accent"
                      : "font-semibold text-text-secondary hover:text-brand-primary"
                  }`}
                  onClick={() => setActiveDetailTab("comentarios")}
                >
                  Comentarios
                </button>
              </div>

              <div className="flex flex-1 flex-col">
                {activeDetailTab === "resumen" && (
                  <>
                    <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                      Descripción
                    </div>
                    <p className="m-0 mb-3.5 text-[12.5px] leading-[1.45] text-gray-600">
                      {selectedInitiative.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                        <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                          <Icon icon={Person} size={14} />
                          <span>Solicitante</span>
                        </div>
                        <div className="text-[12.5px] font-semibold break-words text-text-heading">
                          {selectedInitiative.solicitante}
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                        <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                          <Icon icon={Timeline} size={14} />
                          <span>Fecha de creación</span>
                        </div>
                        <div className="text-[12.5px] font-semibold break-words text-text-heading">
                          {selectedInitiative.creationDate}
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                        <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                          <Icon icon={Settings} size={14} />
                          <span>Impacto TI</span>
                        </div>
                        <div className="text-[12.5px] font-semibold break-words text-text-heading">
                          {selectedInitiative.impactoTI}
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                        <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                          <span className="font-extrabold">$</span>
                          <span>Beneficio estimado</span>
                        </div>
                        <div className="text-[12.5px] font-bold break-words text-success-500">
                          {selectedInitiative.beneficioEstimado}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                      <div>
                        <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                          Estado actual
                        </div>
                        <div className="mt-1">{getStatusBadge(selectedInitiative.status)}</div>
                      </div>

                      <div>
                        <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                          <span>Madurez</span>
                          <span className="ml-auto font-bold text-text-heading">
                            {selectedInitiative.madurez}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-[3px] bg-gray-200">
                          <div
                            className={`h-full rounded-[3px] bg-brand-accent transition-all duration-300 ${getProgressWidthClass(selectedInitiative.madurez)}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Botón CTA: Evaluar iniciativa */}
                    <div className="mt-5">
                      <Link
                        href={`/iniciativas/evaluacion?id=${selectedInitiative.id}`}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                      >
                        <span>Evaluar iniciativa</span>
                        <Icon icon={NavigationChevronRight} size={16} />
                      </Link>
                    </div>
                  </>
                )}

                {activeDetailTab === "discovery" && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="m-0 text-[11.5px] font-bold text-text-heading">
                        Ficha Canvas de Discovery
                      </div>
                      <span className="inline-flex items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[10.5px] font-semibold text-green-700">
                        ✓ Discovery completo
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3.5 py-3">
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">Gobierno / Dirección:</span>
                        <span className="font-semibold text-text-heading">
                          {selectedInitiative.direccionNegocio || selectedInitiative.area} ·{" "}
                          {selectedInitiative.oficinaArea || "Oficina Central"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">PMO / Portfolio Mgr:</span>
                        <span className="font-semibold text-text-heading">
                          {selectedInitiative.pmoResponsable || "EPL"} ·{" "}
                          {selectedInitiative.portafolioManager ||
                            selectedInitiative.sponsor ||
                            "AL UBAMARI MALINALLI MORENO MERAZ"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">Alineación piramidal:</span>
                        <span className="font-bold text-pink-600">
                          {selectedInitiative.alineacionEstrategicaNivel || "(N2) Habilitadores/Regulatorios"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">Impacto Tecnología:</span>
                        <span className="font-semibold text-text-heading">
                          {selectedInitiative.impactoTI}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">Dimensiones:</span>
                        <span className="font-semibold text-text-heading">
                          {selectedInitiative.dimensionesImpacto?.length
                            ? selectedInitiative.dimensionesImpacto.join(", ")
                            : "Tecnología, Procesos"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">Sistemas involucrados:</span>
                        <span className="font-semibold text-text-heading">
                          {selectedInitiative.sistemasInvolucrados?.join(", ") || "SAP ERP, BigQuery"}
                        </span>
                      </div>
                      {selectedInitiative.okrs && selectedInitiative.okrs.length > 0 && (
                        <div className="flex items-start justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                          <span className="font-medium text-gray-500">OKRs Clave:</span>
                          <span className="text-[11.5px] font-semibold text-text-heading">
                            {selectedInitiative.okrs[0].objetivo} → {selectedInitiative.okrs[0].resultadoClave}
                          </span>
                        </div>
                      )}
                      {selectedInitiative.roiData && (
                        <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                          <span className="font-medium text-gray-500">ROI Estimado:</span>
                          <span className="font-bold text-green-700">
                            +{selectedInitiative.roiData.roiPorcentaje || 210}% (Payback ~
                            {selectedInitiative.roiData.paybackMeses || 3.8} meses)
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                        <span className="font-medium text-gray-500">Asistente IA:</span>
                        <span className="font-semibold text-text-heading">
                          DataSwat Copilot (Fase 1 Discovery Completada)
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 flex gap-2.5">
                      <Link
                        href="/discovery"
                        className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent text-xs font-semibold text-brand-primary no-underline hover:underline"
                      >
                        <span>Abrir nuevo Discovery asistido por IA →</span>
                      </Link>
                    </div>
                  </div>
                )}

                {activeDetailTab === "evaluacion" && (
                  <div>
                    {selectedInitiative.score ? (
                      <div>
                        <div className="flex items-center justify-between rounded-xl border border-[#f2d8ec] bg-[#fdf5fa] px-4.5 py-3.5">
                          <div>
                            <div className="text-xs text-gray-500">Score obtenido</div>
                            <div className="text-[32px] font-extrabold text-brand-primary">
                              {selectedInitiative.score}
                              <span className="text-base font-medium text-gray-400">/100</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Prioridad preliminar</div>
                            <div className="mt-1">
                              {getPriorityBadge(selectedInitiative.priority)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                            Desglose de calificaciones (100 pts)
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>🔺 Pirámide ({selectedInitiative.evaluacion?.piramideNivel || "N2 Habilitadores/Regulatorios"})</span>
                              <b className="text-brand-accent">
                                {selectedInitiative.evaluacion?.piramidePuntos ?? 20}/30 pts
                              </b>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>🍕 OKR&apos;s Pizza (Comercio Unificado)</span>
                              <b className="text-brand-accent">
                                {selectedInitiative.evaluacion?.pizzaPuntos ?? 30}/30 pts
                              </b>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>1. Impacto al negocio (12%)</span>
                              <b>{selectedInitiative.evaluacion?.impactoNegocio ?? 4}/5</b>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>2. Alineación estratégica (10%)</span>
                              <b>{selectedInitiative.evaluacion?.alineacionEstrategica ?? 5}/5</b>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>3. Urgencia / oportunidad (6%)</span>
                              <b>{selectedInitiative.evaluacion?.urgencia ?? 4}/5</b>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>4. Complejidad preliminar (6%)</span>
                              <b>{selectedInitiative.evaluacion?.complejidad ?? 3}/5</b>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 py-[5px] text-xs text-gray-600">
                              <span>5. Riesgos y dependencias (6%)</span>
                              <b>{selectedInitiative.evaluacion?.riesgos ?? 3}/5</b>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4.5">
                          <Link
                            href={`/iniciativas/evaluacion?id=${selectedInitiative.id}`}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                          >
                            <span>Evaluar iniciativa</span>
                            <Icon icon={NavigationChevronRight} size={16} />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="px-2.5 py-[30px] text-center">
                        <div className="mb-2.5 text-gray-400">
                          <Icon icon={CheckList} size={36} />
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          Esta iniciativa aún no ha sido evaluada
                        </div>
                        <p className="mt-1.5 mb-4 text-[12.5px] text-gray-500">
                          Evalúa los criterios de impacto, alineación y complejidad para asignarle score y prioridad.
                        </p>
                        <Link
                          href={`/iniciativas/evaluacion?id=${selectedInitiative.id}`}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                        >
                          <span>Evaluar iniciativa</span>
                          <Icon icon={NavigationChevronRight} size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeDetailTab === "comentarios" && (
                  <div>
                    <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                      <div className="mb-1 text-[11.5px] text-gray-500">
                        <b>Mariana Solís</b> (Portfolio Manager) · Hace 2 días
                      </div>
                      <div className="text-[12.5px] leading-[1.4] text-text-heading">
                        Iniciativa registrada con caso de negocio inicial. Falta afinar la estimación de licencias de pasarelas de pago.
                      </div>
                    </div>
                    <div className="mt-3.5">
                      <textarea
                        className="w-full resize-y rounded-lg border border-[#d0d4e4] px-3 py-2 text-xs outline-none focus:border-brand-primary"
                        placeholder="Escribe un comentario o solicitud de ajuste..."
                        rows={3}
                      />
                      <button
                        type="button"
                        className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d0d4e4] bg-bg-card px-3.5 py-1.5 text-[12.5px] font-semibold text-brand-primary transition-all duration-150 hover:border-brand-primary hover:bg-brand-primary-light"
                        onClick={() => showNotification("Comentario registrado")}
                      >
                        <Icon icon={Comment} size={14} />
                        <span>Agregar comentario</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedStage === "Estimación" && (
            <div className="flex flex-1 flex-col pt-3.5">
              <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                Resumen de Estimación Técnica y Sizing IA
              </div>
              <p className="m-0 mb-3.5 text-[12.5px] leading-[1.45] text-gray-600">
                {selectedInitiative.description}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Settings} size={14} />
                    <span>Arquitectura propuesta</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {selectedInitiative.estimacionTecnica?.tipoArquitectura ||
                      "Microservicios en Google Cloud Platform"}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Timeline} size={14} />
                    <span>Esfuerzo de desarrollo</span>
                  </div>
                  <div className="text-[12.5px] font-bold break-words text-success-500">
                    {selectedInitiative.estimacionTecnica?.horasDesarrolloEstimadas ?? 480} hrs estimadas
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <span className="font-extrabold">$</span>
                    <span>Costo Cloud (FinOps)</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {selectedInitiative.estimacionTecnica?.costoNubeMensualEstimado || "$3,200 USD/mes"}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Person} size={14} />
                    <span>Volumen / Concurrencia</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {selectedInitiative.estimacionTecnica?.tps ?? 350} TPS ·{" "}
                    {selectedInitiative.estimacionTecnica?.usuariosMensuales || "2.4M"} usuarios/mes
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col gap-2 rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3.5 py-3">
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Servicios Nube (GCP):</span>
                  <span className="font-semibold text-text-heading">
                    {(selectedInitiative.estimacionTecnica?.serviciosNube || [
                      "Cloud Run",
                      "Cloud SQL",
                      "Pub/Sub",
                      "BigQuery",
                    ]).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">VoBo Líder Técnico:</span>
                  <span
                    className={`font-bold ${
                      selectedInitiative.estimacionTecnica?.voboLiderTecnico === "aprobado"
                        ? "text-success-500"
                        : "text-warning-500"
                    }`}
                  >
                    {selectedInitiative.estimacionTecnica?.voboLiderTecnico === "aprobado"
                      ? "✓ Aprobado"
                      : "⏳ Pendiente de revisión"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">VoBo Arquitectura:</span>
                  <span
                    className={`font-bold ${
                      selectedInitiative.estimacionTecnica?.voboLiderArquitectura === "aprobado"
                        ? "text-success-500"
                        : "text-warning-500"
                    }`}
                  >
                    {selectedInitiative.estimacionTecnica?.voboLiderArquitectura === "aprobado"
                      ? "✓ Aprobado"
                      : "⏳ Pendiente de revisión"}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/estimacion?id=${selectedInitiative.id}`}
                  onClick={() => setSelectedId(selectedInitiative.id)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                >
                  <span>Ir a estimación</span>
                  <Icon icon={NavigationChevronRight} size={16} />
                </Link>
              </div>
            </div>
          )}

          {selectedStage === "Autorización" && (
            <div className="flex flex-1 flex-col pt-3.5">
              <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                Dictamen Financiero y Comité de Autorización
              </div>
              <p className="m-0 mb-3.5 text-[12.5px] leading-[1.45] text-gray-600">
                {selectedInitiative.description}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Person} size={14} />
                    <span>Sponsor Ejecutivo</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {selectedInitiative.sponsor || "Carlos Méndez"} ({selectedInitiative.sponsorRole || "CFO"})
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <span className="font-extrabold">$</span>
                    <span>Beneficio anual esperado</span>
                  </div>
                  <div className="text-[12.5px] font-bold break-words text-success-500">
                    {selectedInitiative.beneficioEstimado}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Timeline} size={14} />
                    <span>ROI / Payback estimado</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    +{selectedInitiative.roiData?.roiPorcentaje ?? 210}% (~
                    {selectedInitiative.roiData?.paybackMeses ?? 3.8} meses)
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Security} size={14} />
                    <span>Presupuesto CapEx / OpEx</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    $4.2M MXN (70% CapEx / 30% OpEx)
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col gap-2 rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3.5 py-3">
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Folio de Comité:</span>
                  <span className="font-semibold text-text-heading">
                    COM-2026-{selectedInitiative.id.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Estatus de Firmas:</span>
                  <span className="font-bold text-warning-500">
                    En validación por Comité de Inversiones y Finanzas
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/en-construccion?modulo=${encodeURIComponent("Autorización")}&id=${selectedInitiative.id}`}
                  onClick={() => setSelectedId(selectedInitiative.id)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                >
                  <span>Ir a autorización</span>
                  <Icon icon={NavigationChevronRight} size={16} />
                </Link>
              </div>
            </div>
          )}

          {selectedStage === "Formalización" && (
            <div className="flex flex-1 flex-col pt-3.5">
              <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                Formalización Contractual y Alta en Monday
              </div>
              <p className="m-0 mb-3.5 text-[12.5px] leading-[1.45] text-gray-600">
                {selectedInitiative.description}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Person} size={14} />
                    <span>PMO Responsable</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {selectedInitiative.pmoResponsable || "PMO Corporativa · Alexis Labrada"}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Clipboard} size={14} />
                    <span>Tablero Monday</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    Tablero Maestro · {selectedInitiative.cartera || selectedInitiative.area}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={FileIcon} size={14} />
                    <span>Anexos y Contratos</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    Validados por Jurídico y Compras TI
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Timeline} size={14} />
                    <span>Ventana de Arranque</span>
                  </div>
                  <div className="text-[12.5px] font-bold break-words text-success-500">
                    Q4 2026 · Célula Asignada
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col gap-2 rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3.5 py-3">
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Sincronización Monday:</span>
                  <span className="font-bold text-info-500">
                    ✓ Workspace y cronograma base generados
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Orden de Compra:</span>
                  <span className="font-semibold text-text-heading">
                    OC-88412 liberada en SAP FI
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/en-construccion?modulo=${encodeURIComponent("Formalización")}&id=${selectedInitiative.id}`}
                  onClick={() => setSelectedId(selectedInitiative.id)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                >
                  <span>Ir a formalización</span>
                  <Icon icon={NavigationChevronRight} size={16} />
                </Link>
              </div>
            </div>
          )}

          {selectedStage === "Ejecución" && (
            <div className="flex flex-1 flex-col pt-3.5">
              <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                Seguimiento Operativo de Ejecución
              </div>
              <p className="m-0 mb-3.5 text-[12.5px] leading-[1.45] text-gray-600">
                {selectedInitiative.description}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Play} size={14} />
                    <span>Sprint Actual</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    Sprint 6 de 8 · En tiempo (On Track)
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Check} size={14} />
                    <span>Semáforo PMO</span>
                  </div>
                  <div className="text-[12.5px] font-bold break-words text-success-500">
                    ● Verde (Sin bloqueos críticos)
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Settings} size={14} />
                    <span>Sistemas en intervención</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {(selectedInitiative.sistemasInvolucrados || ["SAP ERP", "Cloud Run"]).join(", ")}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Timeline} size={14} />
                    <span>Próximo Hito</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    Pruebas integrales UAT y salida a producción
                  </div>
                </div>
              </div>

              <div className="mt-3.5">
                <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                  <span>Avance físico de ejecución</span>
                  <span className="ml-auto font-bold text-text-heading">
                    {selectedInitiative.madurez || 85}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-[3px] bg-gray-200">
                  <div
                    className={`h-full rounded-[3px] bg-brand-accent transition-all duration-300 ${getProgressWidthClass(selectedInitiative.madurez || 85)}`}
                  />
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/en-construccion?modulo=${encodeURIComponent("Ejecución")}&id=${selectedInitiative.id}`}
                  onClick={() => setSelectedId(selectedInitiative.id)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                >
                  <span>Ir a ejecución</span>
                  <Icon icon={NavigationChevronRight} size={16} />
                </Link>
              </div>
            </div>
          )}

          {selectedStage === "Cierre" && (
            <div className="flex flex-1 flex-col pt-3.5">
              <div className="mb-1.5 text-[11.5px] font-bold text-text-heading">
                Acta de Cierre y Captura de Valor
              </div>
              <p className="m-0 mb-3.5 text-[12.5px] leading-[1.45] text-gray-600">
                {selectedInitiative.description}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Check} size={14} />
                    <span>Estado de Entrega</span>
                  </div>
                  <div className="text-[12.5px] font-bold break-words text-success-500">
                    100% Finalizado en Producción
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <span className="font-extrabold">$</span>
                    <span>Beneficio Capturado</span>
                  </div>
                  <div className="text-[12.5px] font-bold break-words text-success-500">
                    {selectedInitiative.beneficioEstimado}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={Timeline} size={14} />
                    <span>KPI Alcanzado</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    {selectedInitiative.kpiEsperado || "100% de meta operativa cumplida"}
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f3f7] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-[3px] flex items-center gap-[5px] text-[11px] text-gray-500">
                    <Icon icon={FileIcon} size={14} />
                    <span>Acta de Cierre</span>
                  </div>
                  <div className="text-[12.5px] font-semibold break-words text-text-heading">
                    Firmada por {selectedInitiative.sponsor || "Sponsor"} y PMO
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-col gap-2 rounded-[10px] border border-border-subtle bg-[#fafbfc] px-3.5 py-3">
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Transición a Soporte:</span>
                  <span className="font-semibold text-text-heading">
                    Handover completado con Operaciones TI
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#f1f3f7] py-1.5 text-xs last:border-b-0">
                  <span className="font-medium text-gray-500">Lecciones aprendidas:</span>
                  <span className="font-semibold text-text-heading">
                    Documentadas en repositorio de gobernanza
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/en-construccion?modulo=${encodeURIComponent("Cierre")}&id=${selectedInitiative.id}`}
                  onClick={() => setSelectedId(selectedInitiative.id)}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-brand-accent px-4.5 py-2.5 text-[13.5px] font-bold text-white no-underline shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
                >
                  <span>Ir a cierre</span>
                  <Icon icon={NavigationChevronRight} size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. SECCIÓN INFERIOR: TOMA DE DECISIONES DEL PORTAFOLIO */}
      <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[1.25fr_1fr_1.15fr]">
        {/* BLOQUE 1: MATRIZ DE PRIORIDAD (2x2 Cuadrantes) */}
        <div className="flex flex-col rounded-[14px] border border-border-default bg-bg-card px-5 py-4.5 shadow-2xs">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-text-heading">
              <Icon icon={CheckList} size={17} />
              <span>Matriz de Prioridad</span>
            </div>
            <span className="text-[11.5px] text-gray-500">
              Haz clic en cualquier punto para seleccionarla
            </span>
          </div>

          <div className="flex flex-1 items-center gap-2">
            {/* Eje Y Label */}
            <div className="flex h-[180px] flex-col justify-between text-right text-[10px] text-gray-400">
              <span>Alto</span>
              <span className="m-auto rotate-180 text-[10.5px] font-semibold text-gray-500 [writing-mode:vertical-lr]">
                Impacto a negocio
              </span>
              <span>Bajo</span>
            </div>

            <div className="relative grid h-[180px] flex-1 grid-cols-2 grid-rows-2 gap-1 rounded-md border border-gray-300 bg-bg-card p-1">
              {/* 4 Cuadrantes */}
              <div className="relative rounded-sm border border-dashed border-status-green-border bg-emerald-50 p-1.5">
                <div className="text-[10.5px] leading-[1.2] text-gray-700">
                  <b>Quick wins</b> (Hacer ahora)
                </div>
              </div>

              <div className="relative rounded-sm border border-dashed border-pink-200 bg-pink-50 p-1.5">
                <div className="text-[10.5px] leading-[1.2] text-gray-700">
                  <b>Estratégicas</b> (Planear)
                </div>
              </div>

              <div className="relative rounded-sm border border-dashed border-slate-200 bg-slate-50 p-1.5">
                <div className="text-[10.5px] leading-[1.2] text-gray-700">
                  <b>Bajo valor</b> (Evaluar)
                </div>
              </div>

              <div className="relative rounded-sm border border-dashed border-status-orange-border bg-status-orange-bg p-1.5">
                <div className="text-[10.5px] leading-[1.2] text-gray-700">
                  <b>Tácticas</b> (Revisar)
                </div>
              </div>

              {/* Puntos de iniciativas sobre la matriz */}
              {initiatives.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`absolute h-3.5 w-3.5 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform duration-150 hover:z-10 hover:scale-140 ${getMatrixPointPositionClasses(item.esfuerzo, item.impacto)} ${getMatrixPointBgClass(item.color)} ${
                      isSelected ? "z-9 scale-130 ring-3 ring-brand-accent" : ""
                    }`}
                    onClick={() => setSelectedId(item.id)}
                    title={`${item.name} (${item.area}) - Score: ${item.score ?? "Sin evaluar"}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Eje X Label */}
          <div className="mt-2 flex items-center justify-between pr-1 pl-6 text-[11px] text-gray-400">
            <span>Bajo</span>
            <span className="text-center text-[11.5px] font-semibold text-gray-500">
              Esfuerzo estimado
            </span>
            <span>Alto</span>
          </div>
        </div>

        {/* BLOQUE 2: CRITERIOS DE EVALUACIÓN (PESOS) */}
        <div className="flex flex-col rounded-[14px] border border-border-default bg-bg-card px-5 py-4.5 shadow-2xs">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-text-heading">
              <Icon icon={Settings} size={17} />
              <span>Metodología y Criterios (100 pts)</span>
            </div>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent text-xs font-semibold text-brand-primary hover:underline"
              onClick={() => showNotification("Metodología: Pirámide (30%) + Pizza OKR's (30%) + 5 Criterios (40%) = 100 pts")}
            >
              Ver metodología →
            </button>
          </div>

          <div className="mt-1 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10.5px] font-bold text-gray-600">
                P1
              </span>
              <span className="w-[150px] text-xs font-medium text-gray-700">
                Alineación Estratégica (&quot;Pirámide&quot; N1-N3)
              </span>
              <div className="h-[7px] flex-1 overflow-hidden rounded-sm bg-[#f1f3f5]">
                <div className="h-full w-[30%] rounded-sm bg-brand-accent" />
              </div>
              <span className="w-8 text-right text-[11.5px] font-bold text-gray-500">30%</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10.5px] font-bold text-gray-600">
                P2
              </span>
              <span className="w-[150px] text-xs font-medium text-gray-700">
                OKR&apos;s Comercio Unificado (&quot;Pizza&quot;)
              </span>
              <div className="h-[7px] flex-1 overflow-hidden rounded-sm bg-[#f1f3f5]">
                <div className="h-full w-[30%] rounded-sm bg-brand-accent" />
              </div>
              <span className="w-8 text-right text-[11.5px] font-bold text-gray-500">30%</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10.5px] font-bold text-gray-600">
                1
              </span>
              <span className="w-[150px] text-xs font-medium text-gray-700">
                Impacto al negocio
              </span>
              <div className="h-[7px] flex-1 overflow-hidden rounded-sm bg-[#f1f3f5]">
                <div className="h-full w-[12%] rounded-sm bg-brand-accent" />
              </div>
              <span className="w-8 text-right text-[11.5px] font-bold text-gray-500">12%</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10.5px] font-bold text-gray-600">
                2
              </span>
              <span className="w-[150px] text-xs font-medium text-gray-700">
                Alineación estratégica
              </span>
              <div className="h-[7px] flex-1 overflow-hidden rounded-sm bg-[#f1f3f5]">
                <div className="h-full w-[10%] rounded-sm bg-brand-accent" />
              </div>
              <span className="w-8 text-right text-[11.5px] font-bold text-gray-500">10%</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10.5px] font-bold text-gray-600">
                3
              </span>
              <span className="w-[150px] text-xs font-medium text-gray-700">
                Urgencia, Complejidad y Riesgos (6% c/u)
              </span>
              <div className="h-[7px] flex-1 overflow-hidden rounded-sm bg-[#f1f3f5]">
                <div className="h-full w-[18%] rounded-sm bg-brand-accent" />
              </div>
              <span className="w-8 text-right text-[11.5px] font-bold text-gray-500">18%</span>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: ACCIONES RÁPIDAS Y BANNER LIVERPOOL */}
        <div className="flex flex-col gap-4 rounded-[14px] border border-border-default bg-bg-card p-4 shadow-2xs sm:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-[140px]">
            <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-text-heading">
              Acciones rápidas
            </div>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#f2d8ec] bg-bg-card px-2.5 py-[7px] text-xs font-semibold text-brand-primary transition-all duration-150 hover:border-brand-primary hover:bg-brand-primary-light"
              onClick={handleSendToCommittee}
            >
              <Icon icon={Send} size={15} />
              <span>Enviar a comité</span>
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#d0d4e4] bg-bg-card px-2.5 py-[7px] text-xs font-semibold text-gray-700 transition-all duration-150 hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary"
              onClick={handleRequestAdjustments}
            >
              <Icon icon={Comment} size={15} />
              <span>Solicitar ajustes</span>
            </button>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-100 bg-bg-card px-2.5 py-[7px] text-xs font-semibold text-danger-500 transition-all duration-150 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={handleDiscard}
            >
              <Icon icon={Delete} size={15} />
              <span>Descartar</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-2 rounded-[10px] border border-[#f2d8ec] bg-[#faf5f9] px-3.5 py-3">
            <div className="flex gap-1.5 text-[11px] leading-[1.35] text-gray-600">
              <span className="shrink-0 text-[13px]">💡</span>
              <span>
                Evalúa la información disponible y asigna un score para incluir la iniciativa en la priorización.
              </span>
            </div>

            <div className="text-[11.5px] font-medium text-brand-primary italic">
              &quot;Priorizar ideas hoy, para los resultados de mañana.&quot;
            </div>

            <div className="mt-0.5 flex items-center justify-end gap-1.5">
              <img
                src="/icon.png"
                alt="Liverpool"
                width={26}
                height={26}
                className="inline-block rounded-sm"
              />
              <span className="text-lg font-extrabold tracking-[-0.5px] text-brand-accent">
                Liverpool
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL INTERACTIVO DE EVALUACIÓN MULTICRITERIO */}
      {isEvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/45 p-4 backdrop-blur-[3px] transition-opacity duration-150">
          <div
            className="flex max-h-[90vh] w-full max-w-[580px] flex-col overflow-y-auto rounded-2xl border border-border-default bg-bg-card shadow-2xl transition-all duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between border-b border-[#f1f3f5] px-6 pt-5 pb-3.5">
              <div>
                <div className="text-xs font-semibold text-brand-primary uppercase">
                  Evaluación de Portfolio Manager
                </div>
                <h3 className="m-0 mt-0.5 text-lg font-bold text-text-heading">
                  {selectedInitiative.name}
                </h3>
              </div>
              <button
                type="button"
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-text-secondary transition-all duration-150 hover:border-[#f2d8ec] hover:bg-brand-primary-light hover:text-brand-primary"
                onClick={() => setIsEvalModalOpen(false)}
                aria-label="Cerrar modal"
              >
                <Icon icon={Close} size={18} />
              </button>
            </div>

            <div className="flex-1 px-6 py-5">
              <p className="m-0 mb-4 text-[13px] text-gray-500">
                Califica cada uno de los 5 criterios de la metodología en una escala de 1 a 10. El score ponderado y la prioridad preliminar se calcularán en tiempo real.
              </p>

              {/* Sliders de evaluación */}
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[12.5px] font-semibold text-gray-700">
                    <span>1. Impacto al negocio (Peso 30%)</span>
                    <b>{evalC1}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC1}
                    onChange={(e) => setEvalC1(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand-accent"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[12.5px] font-semibold text-gray-700">
                    <span>2. Alineación estratégica (Peso 25%)</span>
                    <b>{evalC2}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC2}
                    onChange={(e) => setEvalC2(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand-accent"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[12.5px] font-semibold text-gray-700">
                    <span>3. Urgencia / oportunidad (Peso 15%)</span>
                    <b>{evalC3}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC3}
                    onChange={(e) => setEvalC3(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand-accent"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[12.5px] font-semibold text-gray-700">
                    <span>4. Esfuerzo estimado / Factibilidad (Peso 15%)</span>
                    <b>{evalC4}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC4}
                    onChange={(e) => setEvalC4(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand-accent"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[12.5px] font-semibold text-gray-700">
                    <span>5. Riesgos y dependencias (Peso 15%)</span>
                    <b>{evalC5}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC5}
                    onChange={(e) => setEvalC5(Number(e.target.value))}
                    className="w-full cursor-pointer accent-brand-accent"
                  />
                </div>
              </div>

              {/* Preview de Score y Prioridad Calculada */}
              <div className="mt-4.5 flex items-center justify-between rounded-xl border border-[#f2d8ec] bg-[#fdf5fa] px-4.5 py-3.5">
                <div>
                  <div className="text-xs text-gray-500">Score Ponderado Calculado</div>
                  <div className="text-4xl leading-[1.1] font-extrabold text-brand-primary">
                    {liveScore}
                    <span className="text-lg font-medium text-gray-400">/100</span>
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-xs text-gray-500">
                    Prioridad Resultante
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(livePriority)}
                    <span className="text-xs text-gray-500">
                      ({liveScore >= 80 ? "Sugerida para comité" : "Requiere refinamiento"})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#f1f3f5] px-6 pt-3.5 pb-5">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                onClick={() => setIsEvalModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-accent bg-brand-accent px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-accent-dark hover:bg-brand-accent-dark"
                onClick={handleSaveEvaluation}
              >
                <span>Guardar evaluación y actualizar prioridad</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IniciativasPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-text-secondary">
          Cargando iniciativas...
        </div>
      }
    >
      <IniciativasContent />
    </Suspense>
  );
}
