"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@vibe/core";
import {
  File as FileIcon,
  Chart,
  Security,
  NavigationChevronRight,
  Info,
  Check,
  Comment,
} from "@vibe/icons";
import {
  usePriorizacionStore,
  PIRAMIDE_OPTIONS,
  PIZZA_OBJETIVOS_CLAVE,
  PIZZA_BATALLAS,
  PIZZA_HABILITADORES,
  PiramideNivel,
  normalizePiramideNivel,
  getPiramidePoints,
  getPizzaPoints,
  getCriteriosPoints,
} from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";
import { BackButton } from "@/components/BackButton";

function EvaluacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initiativeId = searchParams.get("id") || "prio-01";

  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const saveEvaluation = usePriorizacionStore((s) => s.saveEvaluation);
  const requestAdjustments = usePriorizacionStore((s) => s.requestAdjustments);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Iniciativas");
  }, [setActiveMenuTitle]);

  const initiative = useMemo(() => {
    return initiatives.find((i) => i.id === initiativeId) || initiatives[0];
  }, [initiatives, initiativeId]);

  // ========================================================
  // SECCIÓN 1: ALINEACIÓN ESTRATÉGICA ("PIRÁMIDE") - Máx 30 pts
  // ========================================================
  const [piramideNivel, setPiramideNivel] = useState<PiramideNivel>(
    initiative.evaluacion?.piramideNivel ||
      normalizePiramideNivel(initiative.alineacionEstrategicaNivel)
  );

  // ========================================================
  // SECCIÓN 2: OKR'S ESTRATÉGICOS ("PIZZA" · COMERCIO UNIFICADO) - Máx 30 pts
  // ========================================================
  const [pizzaObjetivoClave, setPizzaObjetivoClave] = useState<string>(
    initiative.evaluacion?.pizzaObjetivoClave || PIZZA_OBJETIVOS_CLAVE[2]
  );
  const [pizzaBatalla, setPizzaBatalla] = useState<string>(
    initiative.evaluacion?.pizzaBatalla || PIZZA_BATALLAS[6]
  );
  const [pizzaHabilitador, setPizzaHabilitador] = useState<string>(
    initiative.evaluacion?.pizzaHabilitador || PIZZA_HABILITADORES[1]
  );

  // ========================================================
  // SECCIÓN 3: CRITERIOS DE EVALUACIÓN (1 al 5) - Máx 40 pts
  // Pesos: 12% + 10% + 6% + 6% + 6% = 40% (40 puntos restantes)
  // ========================================================
  const [c1, setC1] = useState<number>(initiative.evaluacion?.impactoNegocio ?? 4);
  const [c2, setC2] = useState<number>(initiative.evaluacion?.alineacionEstrategica ?? 5);
  const [c3, setC3] = useState<number>(initiative.evaluacion?.urgencia ?? 4);
  const [c4, setC4] = useState<number>(initiative.evaluacion?.complejidad ?? 3);
  const [c5, setC5] = useState<number>(initiative.evaluacion?.riesgos ?? 3);

  // Justificaciones breves
  const [j1, setJ1] = useState<string>(
    initiative.evaluacion?.justificaciones?.impactoNegocio ||
      "Alta reducción de costos operativos y mejora en la experiencia del cliente."
  );
  const [j2, setJ2] = useState<string>(
    initiative.evaluacion?.justificaciones?.alineacionEstrategica ||
      "Está alineada con la estrategia de omnicanalidad y eficiencia operativa."
  );
  const [j3, setJ3] = useState<string>(
    initiative.evaluacion?.justificaciones?.urgencia ||
      "Existen dolores actuales y una ventana de oportunidad en el corto plazo."
  );
  const [j4, setJ4] = useState<string>(
    initiative.evaluacion?.justificaciones?.complejidad ||
      "Requiere integraciones con sistemas críticos, pero es viable con el equipo actual."
  );
  const [j5, setJ5] = useState<string>(
    initiative.evaluacion?.justificaciones?.riesgos ||
      "Depende de proveedores externos, pero con bajo riesgo de ejecución."
  );

  // Sincronizar criterios si cambia la iniciativa seleccionada
  useEffect(() => {
    setPiramideNivel(
      initiative.evaluacion?.piramideNivel ||
        normalizePiramideNivel(initiative.alineacionEstrategicaNivel)
    );
    setPizzaObjetivoClave(
      initiative.evaluacion?.pizzaObjetivoClave || PIZZA_OBJETIVOS_CLAVE[2]
    );
    setPizzaBatalla(initiative.evaluacion?.pizzaBatalla || PIZZA_BATALLAS[6]);
    setPizzaHabilitador(
      initiative.evaluacion?.pizzaHabilitador || PIZZA_HABILITADORES[1]
    );
    setC1(initiative.evaluacion?.impactoNegocio ?? 4);
    setC2(initiative.evaluacion?.alineacionEstrategica ?? 5);
    setC3(initiative.evaluacion?.urgencia ?? 4);
    setC4(initiative.evaluacion?.complejidad ?? 3);
    setC5(initiative.evaluacion?.riesgos ?? 3);
    setJ1(
      initiative.evaluacion?.justificaciones?.impactoNegocio ||
        "Alta reducción de costos operativos y mejora en la experiencia del cliente."
    );
    setJ2(
      initiative.evaluacion?.justificaciones?.alineacionEstrategica ||
        "Está alineada con la estrategia de omnicanalidad y eficiencia operativa."
    );
    setJ3(
      initiative.evaluacion?.justificaciones?.urgencia ||
        "Existen dolores actuales y una ventana de oportunidad en el corto plazo."
    );
    setJ4(
      initiative.evaluacion?.justificaciones?.complejidad ||
        "Requiere integraciones con sistemas críticos, pero es viable con el equipo actual."
    );
    setJ5(
      initiative.evaluacion?.justificaciones?.riesgos ||
        "Depende de proveedores externos, pero con bajo riesgo de ejecución."
    );
  }, [initiative.id]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Cálculo de puntos por bloque (Total máximo = 100 puntos)
  // 1) Pirámide: N0=0, N1=30, N2=20, N3=10 (máx 30 pts)
  const piramidePuntos = useMemo(() => getPiramidePoints(piramideNivel), [piramideNivel]);

  // 2) Pizza OKR's: 10 pts por cada una de las 3 listas si != "Ninguna" (máx 30 pts)
  const pizzaPuntos = useMemo(
    () => getPizzaPoints(pizzaObjetivoClave, pizzaBatalla, pizzaHabilitador),
    [pizzaObjetivoClave, pizzaBatalla, pizzaHabilitador]
  );

  // 3) Criterios de evaluación (1..5): reparten los 40 puntos restantes (12% + 10% + 6% + 6% + 6% = 40 pts)
  const criteriosPuntos = useMemo(
    () => getCriteriosPoints(c1, c2, c3, c4, c5),
    [c1, c2, c3, c4, c5]
  );

  // Score total (nunca supera 100 puntos)
  const calculatedScore = useMemo(() => {
    return Math.min(100, Math.max(0, piramidePuntos + pizzaPuntos + criteriosPuntos));
  }, [piramidePuntos, pizzaPuntos, criteriosPuntos]);

  const { prioritySugerida, confianza, feedbackText } = useMemo(() => {
    if (calculatedScore >= 85) {
      return {
        prioritySugerida: "Alta" as const,
        confianza: "Alta" as const,
        feedbackText:
          "La iniciativa muestra un impacto sobresaliente y sólida factibilidad para avance directo a comité.",
      };
    }
    if (calculatedScore >= 75) {
      return {
        prioritySugerida: "Media-Alta" as const,
        confianza: "Media" as const,
        feedbackText:
          "La iniciativa muestra alto impacto y buena alineación, pero aún tiene incertidumbre técnica.",
      };
    }
    if (calculatedScore >= 60) {
      return {
        prioritySugerida: "Media" as const,
        confianza: "Media" as const,
        feedbackText:
          "Iniciativa con viabilidad moderada; se recomienda profundizar en la estimación de esfuerzo.",
      };
    }
    return {
      prioritySugerida: "Baja" as const,
      confianza: "Baja" as const,
      feedbackText:
        "Bajo retorno o alto riesgo detectado; evaluar alternativas o solicitar ajustes al solicitante.",
    };
  }, [calculatedScore]);

  const handleSaveAndContinue = () => {
    saveEvaluation(
      initiative.id,
      {
        impactoNegocio: c1,
        alineacionEstrategica: c2,
        urgencia: c3,
        complejidad: c4,
        riesgos: c5,
        piramideNivel,
        piramidePuntos,
        pizzaObjetivoClave,
        pizzaBatalla,
        pizzaHabilitador,
        pizzaPuntos,
        criteriosPuntos,
        justificaciones: {
          impactoNegocio: j1,
          alineacionEstrategica: j2,
          urgencia: j3,
          complejidad: j4,
          riesgos: j5,
        },
        confianza,
        feedback: feedbackText,
      },
      calculatedScore,
      prioritySugerida,
      "Lista"
    );
    showToast(`Evaluación guardada exitosamente: ${calculatedScore}/100 (${prioritySugerida})`);
    setTimeout(() => {
      router.push(`/iniciativas/confirmacion?id=${initiative.id}`);
    }, 600);
  };

  const handleSaveDraft = () => {
    saveEvaluation(
      initiative.id,
      {
        impactoNegocio: c1,
        alineacionEstrategica: c2,
        urgencia: c3,
        complejidad: c4,
        riesgos: c5,
        piramideNivel,
        piramidePuntos,
        pizzaObjetivoClave,
        pizzaBatalla,
        pizzaHabilitador,
        pizzaPuntos,
        criteriosPuntos,
        justificaciones: {
          impactoNegocio: j1,
          alineacionEstrategica: j2,
          urgencia: j3,
          complejidad: j4,
          riesgos: j5,
        },
        confianza,
        feedback: feedbackText,
      },
      calculatedScore,
      prioritySugerida,
      "En revisión"
    );
    showToast("Borrador guardado exitosamente");
    setTimeout(() => {
      router.push("/iniciativas");
    }, 900);
  };

  const handleRequestAdjustments = () => {
    requestAdjustments(initiative.id);
    showToast(`Se solicitaron ajustes al solicitante (${initiative.solicitante})`);
    setTimeout(() => {
      router.push("/iniciativas");
    }, 900);
  };

  return (
    <div className="px-1 pb-12">
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed top-[calc(var(--app-header-height)+16px)] right-6 z-100 flex items-center gap-2.5 rounded-lg bg-text-heading px-4.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-opacity duration-150">
          <Icon icon={Check} size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ENCABEZADO Y BREADCRUMB */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs">
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
            <span className="font-bold text-brand-primary">Evaluación</span>
          </div>
          <h1 className="m-0 mb-1.5 text-2xl font-extrabold tracking-[-0.3px] text-text-heading">
            Evaluación de iniciativa
          </h1>
          <p className="m-0 text-[13.5px] text-text-secondary">
            Valida la información disponible y asigna una prioridad preliminar.
          </p>
        </div>

        {/* Paso 1 de 2 + Aviso de Discovery */}
        <div className="flex flex-col items-end gap-2.5">
          <div className="flex flex-col items-end gap-1.5">
            <div className="text-xs font-semibold text-gray-700">
              Paso 1 de 2 • Evaluación preliminar
            </div>
            <div className="h-1.5 w-[190px] overflow-hidden rounded-[3px] bg-gray-200">
              <div className="h-full w-1/2 rounded-[3px] bg-brand-accent" />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#cce3fd] bg-[#f0f7ff] px-3 py-1.5 text-[11.5px] font-medium text-sky-700">
            <Icon icon={Info} size={15} />
            <span>La evaluación es preliminar y se basa en el Discovery de alto nivel.</span>
          </div>
        </div>
      </div>

      {/* 2. CARD DE CABECERA DE LA INICIATIVA */}
      <div className="mb-5 flex items-center gap-4 rounded-[14px] border border-border-default bg-bg-card px-5 py-4 shadow-2xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e6007e" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h2 className="m-0 mb-1 text-[17.5px] font-extrabold text-text-heading">
            {initiative.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-text-secondary">
            <span>Área: {initiative.area}</span>
            <span className="text-gray-300">|</span>
            <span>Madurez: {initiative.madurez}%</span>
            <span className="text-gray-300">|</span>
            <span className="inline-flex items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-0.5 text-[11.5px] font-bold text-brand-primary">
              {initiative.madurezTag || "Madurez inicial"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. LAYOUT PRINCIPAL A DOS COLUMNAS */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(320px,1fr)_minmax(500px,1.8fr)]">
        {/* COLUMNA IZQUIERDA: RESUMEN EJECUTIVO */}
        <div className="rounded-[14px] border border-border-default bg-bg-card px-5.5 py-5 shadow-2xs">
          <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
            <Icon icon={FileIcon} size={18} />
            <h3 className="m-0 text-base font-bold text-text-heading">Resumen ejecutivo</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Problema / Oportunidad */}
            <div className="flex flex-col gap-[5px]">
              <div className="text-[11.5px] font-bold text-gray-600">Problema / Oportunidad</div>
              <div className="text-[12.5px] leading-[1.45] text-gray-700">
                {initiative.description}
              </div>
            </div>

            {/* Área de negocio */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">Área de negocio</div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="9" y1="22" x2="9" y2="2" />
                    <line x1="8" y1="6" x2="8" y2="6.01" />
                    <line x1="16" y1="6" x2="16" y2="6.01" />
                    <line x1="16" y1="10" x2="16" y2="10.01" />
                    <line x1="16" y1="14" x2="16" y2="14.01" />
                  </svg>
                </span>
                <span className="text-[13px] font-bold text-text-heading">{initiative.area}</span>
              </div>
            </div>

            {/* Sponsor */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">Sponsor</div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <div>
                  <div className="text-[13px] font-bold text-text-heading">
                    {initiative.sponsor || "Carlos Méndez"}
                  </div>
                  <div className="mt-[1px] text-[11.5px] text-text-secondary">
                    {initiative.sponsorRole || "CFO"}
                  </div>
                </div>
              </div>
            </div>

            {/* ¿Requiere TI? */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">¿Requiere TI?</div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <div>
                  <div className="text-[13px] font-bold text-text-heading">
                    {initiative.impactoTI}
                  </div>
                  <div className="mt-[1px] text-[11.5px] text-text-secondary">
                    {initiative.impactoTISub || "Involucra desarrollo e integración de sistemas."}
                  </div>
                </div>
              </div>
            </div>

            {/* Sistemas involucrados */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">Sistemas involucrados</div>
              <div className="flex flex-wrap gap-1.5">
                {(initiative.sistemasInvolucrados || ["SAP", "Pasarela", "Core", "API"]).map(
                  (sys) => (
                    <span
                      key={sys}
                      className="rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-[3px] text-[11.5px] font-semibold text-slate-700"
                    >
                      {sys}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Beneficio estimado */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">Beneficio estimado</div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-brand-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <div>
                  <div className="text-[13px] font-bold text-text-heading">
                    {initiative.beneficioEstimado}
                  </div>
                  <div className="mt-[1px] text-[11.5px] text-text-secondary">
                    {initiative.beneficioDetalle || "Ahorro en costos operativos y reducción de incidencias."}
                  </div>
                </div>
              </div>
            </div>

            {/* KPI esperado */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">KPI esperado</div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-brand-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <div className="text-[13px] font-bold text-text-heading">
                    {initiative.kpiEsperado || "Reducción de 70% en tiempo de conciliación"}
                  </div>
                  <div className="mt-[1px] text-[11.5px] text-text-secondary">
                    {initiative.kpiDetalle || "De 5 días a 1.5 días en promedio."}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Alineación Estratégica activa */}
            <div className="flex flex-col gap-[5px] border-t border-gray-100 pt-3">
              <div className="text-[11.5px] font-bold text-gray-600">
                Alineación Estratégica (Pirámide & Pizza)
              </div>
              <div className="mt-0.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Pirámide:</span>
                  <span className="font-bold text-brand-primary">
                    {piramideNivel}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">OKR&apos;s Pizza:</span>
                  <span className="font-bold text-brand-accent">
                    {pizzaPuntos / 10} de 3 seleccionados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PIRÁMIDE + PIZZA + CRITERIOS DE EVALUACIÓN */}
        <div className="flex flex-col gap-5">
          {/* ============================================================== */}
          {/* SECCIÓN 1: ¿A QUÉ ALINEACIÓN ESTRATÉGICA PERTENECE? ("PIRÁMIDE") */}
          {/* ============================================================== */}
          <div className="rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
            <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border border-pink-200 bg-pink-50 text-brand-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 21 22 21 12 2" />
                  <line x1="6.5" y1="12.5" x2="17.5" y2="12.5" />
                  <line x1="4.2" y1="17" x2="19.8" y2="17" />
                </svg>
              </span>
              <div>
                <h3 className="m-0 text-base font-bold text-text-heading">
                  ¿A qué alineación estratégica pertenece? (&quot;Pirámide&quot;)
                </h3>
                <p className="mt-0.5 mb-0 text-xs text-text-secondary">
                  Selecciona 1 opción de la pirámide estratégica.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {PIRAMIDE_OPTIONS.map((opt) => {
                const isSelected = piramideNivel === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`relative flex cursor-pointer items-start gap-3 rounded-[10px] border-[1.5px] px-4 py-3.5 text-left transition-all duration-150 ${
                      isSelected
                        ? "border-brand-accent bg-pink-50 shadow-[0_3px_12px_rgba(230,0,126,0.1)]"
                        : "border-gray-200 bg-[#fafbfc] hover:border-pink-400 hover:bg-bg-card hover:shadow-[0_3px_10px_rgba(230,0,126,0.06)]"
                    }`}
                    onClick={() => setPiramideNivel(opt.id)}
                  >
                    <div
                      className={`mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] transition-all duration-150 ${
                        isSelected
                          ? "border-brand-accent bg-brand-accent text-white"
                          : "border-slate-300 bg-bg-card text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon icon={Check} size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span
                          className={`text-[13px] font-bold ${
                            isSelected ? "text-brand-primary" : "text-text-heading"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <div className="text-[11px] leading-[1.35] text-text-secondary">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 2: ¿A QUÉ OKR'S ESTRATÉGICOS PERTENECE? ("PIZZA")       */}
          {/* ============================================================== */}
          <div className="rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
            <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border border-status-purple-border bg-status-purple-bg text-brand-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v10l7 7" />
                  <path d="M12 12L4.93 4.93" />
                </svg>
              </span>
              <div>
                <h3 className="m-0 text-base font-bold text-text-heading">
                  ¿A qué OKR&apos;s estratégicos pertenece? (&quot;Pizza&quot;)
                </h3>
                <p className="mt-0.5 mb-0 text-xs text-text-secondary">
                  Selecciona hasta 1 elemento en cada una de las 3 listas desplegables.
                </p>
              </div>
            </div>

            {/* Banner Ambición Comercio Unificado 2025 (Imagen 2) */}
            <div className="mb-3.5 flex items-center gap-2 rounded-lg bg-linear-to-r from-brand-primary to-[#9b3b8c] px-3.5 py-2 text-[11.5px] leading-[1.35] font-semibold text-white">
              <span className="shrink-0 rounded-[5px] bg-white/20 px-[7px] py-0.5 text-[10px] font-extrabold tracking-[0.4px] uppercase">
                Ambición 2025
              </span>
              <span>
                &quot;EPDL es parte de tu vida&quot;, para todos los clientes, en todos los canales: convertirnos en la primera opción de compra para los mexicanos.
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Lista 1: Objetivo Clave */}
              <div
                className={`rounded-[10px] border px-3.5 py-3 transition-all duration-150 ${
                  pizzaObjetivoClave !== "Ninguna"
                    ? "border-[#f3c5de] bg-[#fdf8fb]"
                    : "border-gray-200 bg-[#fafbfc]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                      1
                    </span>
                    <span className="text-[12.5px] font-bold text-text-heading">
                      Objetivo Clave
                    </span>
                  </div>
                </div>
                <select
                  className="w-full cursor-pointer rounded-lg border border-[#d0d4e4] bg-bg-card px-3 py-[9px] text-[12.5px] font-medium text-text-heading transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/12"
                  value={pizzaObjetivoClave}
                  onChange={(e) => setPizzaObjetivoClave(e.target.value)}
                >
                  {PIZZA_OBJETIVOS_CLAVE.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista 2: ¿A qué batalla o a qué iniciativa clave pertenece? */}
              <div
                className={`rounded-[10px] border px-3.5 py-3 transition-all duration-150 ${
                  pizzaBatalla !== "Ninguna"
                    ? "border-[#f3c5de] bg-[#fdf8fb]"
                    : "border-gray-200 bg-[#fafbfc]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                      2
                    </span>
                    <span className="text-[12.5px] font-bold text-text-heading">
                      ¿A qué batalla o a qué iniciativa clave pertenece?
                    </span>
                  </div>
                </div>
                <select
                  className="w-full cursor-pointer rounded-lg border border-[#d0d4e4] bg-bg-card px-3 py-[9px] text-[12.5px] font-medium text-text-heading transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/12"
                  value={pizzaBatalla}
                  onChange={(e) => setPizzaBatalla(e.target.value)}
                >
                  {PIZZA_BATALLAS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista 3: Habilitadores */}
              <div
                className={`rounded-[10px] border px-3.5 py-3 transition-all duration-150 ${
                  pizzaHabilitador !== "Ninguna"
                    ? "border-[#f3c5de] bg-[#fdf8fb]"
                    : "border-gray-200 bg-[#fafbfc]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                      3
                    </span>
                    <span className="text-[12.5px] font-bold text-text-heading">
                      Habilitadores
                    </span>
                  </div>
                </div>
                <select
                  className="w-full cursor-pointer rounded-lg border border-[#d0d4e4] bg-bg-card px-3 py-[9px] text-[12.5px] font-medium text-text-heading transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/12"
                  value={pizzaHabilitador}
                  onChange={(e) => setPizzaHabilitador(e.target.value)}
                >
                  {PIZZA_HABILITADORES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECCIÓN 3: CRITERIOS DE EVALUACIÓN                             */}
          {/* ============================================================== */}
          <div className="rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
            <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] border border-pink-200 bg-pink-50 text-brand-accent">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </span>
              <div>
                <h3 className="m-0 text-base font-bold text-text-heading">
                  Criterios de evaluación
                </h3>
                <p className="mt-0.5 mb-0 text-xs text-text-secondary">
                  Califica cada criterio del 1 al 5, donde 5 es el mayor impacto.
                </p>
              </div>
            </div>

            <div className="mt-1.5 flex flex-col gap-4.5">
              {/* Criterio 1: Impacto al negocio */}
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-[10px] border border-[#f1f3f7] bg-[#fafbfc] px-3.5 py-3 transition-all duration-150 hover:border-[#f2d8ec] hover:bg-bg-card hover:shadow-xs xl:grid-cols-[minmax(200px,1.5fr)_180px_minmax(220px,1.5fr)] xl:gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-text-heading">
                      Impacto al negocio
                    </div>
                    <div className="mt-0.5 text-[11px] leading-[1.35] text-text-secondary">
                      Magnitud del beneficio en ingresos, costos, experiencia del cliente o eficiencia operativa.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[5px]">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border text-[12.5px] font-bold transition-all duration-150 ${
                        c1 === val
                          ? "border-brand-accent bg-brand-accent text-white shadow-[0_2px_6px_rgba(230,0,126,0.25)]"
                          : "border-[#d0d4e4] bg-bg-card text-gray-700 hover:border-brand-accent hover:bg-pink-50 hover:text-brand-accent"
                      }`}
                      onClick={() => setC1(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] text-gray-500">
                    Justificación breve (opcional)
                  </label>
                  <input
                    type="text"
                    value={j1}
                    onChange={(e) => setJ1(e.target.value)}
                    className="w-full rounded-md border border-[#d0d4e4] bg-bg-card px-2.5 py-1.5 text-[11.5px] text-text-heading transition-colors duration-150 outline-none focus:border-brand-primary"
                    placeholder="Justificación para impacto al negocio..."
                  />
                </div>
              </div>

              {/* Criterio 2: Alineación estratégica */}
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-[10px] border border-[#f1f3f7] bg-[#fafbfc] px-3.5 py-3 transition-all duration-150 hover:border-[#f2d8ec] hover:bg-bg-card hover:shadow-xs xl:grid-cols-[minmax(200px,1.5fr)_180px_minmax(220px,1.5fr)] xl:gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-text-heading">
                      Alineación estratégica
                    </div>
                    <div className="mt-0.5 text-[11px] leading-[1.35] text-text-secondary">
                      Contribución a los objetivos estratégicos de la empresa.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[5px]">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border text-[12.5px] font-bold transition-all duration-150 ${
                        c2 === val
                          ? "border-brand-accent bg-brand-accent text-white shadow-[0_2px_6px_rgba(230,0,126,0.25)]"
                          : "border-[#d0d4e4] bg-bg-card text-gray-700 hover:border-brand-accent hover:bg-pink-50 hover:text-brand-accent"
                      }`}
                      onClick={() => setC2(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] text-gray-500">
                    Justificación breve (opcional)
                  </label>
                  <input
                    type="text"
                    value={j2}
                    onChange={(e) => setJ2(e.target.value)}
                    className="w-full rounded-md border border-[#d0d4e4] bg-bg-card px-2.5 py-1.5 text-[11.5px] text-text-heading transition-colors duration-150 outline-none focus:border-brand-primary"
                    placeholder="Justificación para alineación estratégica..."
                  />
                </div>
              </div>

              {/* Criterio 3: Urgencia / oportunidad */}
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-[10px] border border-[#f1f3f7] bg-[#fafbfc] px-3.5 py-3 transition-all duration-150 hover:border-[#f2d8ec] hover:bg-bg-card hover:shadow-xs xl:grid-cols-[minmax(200px,1.5fr)_180px_minmax(220px,1.5fr)] xl:gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-text-heading">
                      Urgencia / oportunidad
                    </div>
                    <div className="mt-0.5 text-[11px] leading-[1.35] text-text-secondary">
                      Sensibilidad del tiempo, ventanas de oportunidad y presión del negocio.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[5px]">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border text-[12.5px] font-bold transition-all duration-150 ${
                        c3 === val
                          ? "border-brand-accent bg-brand-accent text-white shadow-[0_2px_6px_rgba(230,0,126,0.25)]"
                          : "border-[#d0d4e4] bg-bg-card text-gray-700 hover:border-brand-accent hover:bg-pink-50 hover:text-brand-accent"
                      }`}
                      onClick={() => setC3(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] text-gray-500">
                    Justificación breve (opcional)
                  </label>
                  <input
                    type="text"
                    value={j3}
                    onChange={(e) => setJ3(e.target.value)}
                    className="w-full rounded-md border border-[#d0d4e4] bg-bg-card px-2.5 py-1.5 text-[11.5px] text-text-heading transition-colors duration-150 outline-none focus:border-brand-primary"
                    placeholder="Justificación para urgencia y oportunidad..."
                  />
                </div>
              </div>

              {/* Criterio 4: Complejidad preliminar */}
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-[10px] border border-[#f1f3f7] bg-[#fafbfc] px-3.5 py-3 transition-all duration-150 hover:border-[#f2d8ec] hover:bg-bg-card hover:shadow-xs xl:grid-cols-[minmax(200px,1.5fr)_180px_minmax(220px,1.5fr)] xl:gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-text-heading">
                      Complejidad preliminar
                    </div>
                    <div className="mt-0.5 text-[11px] leading-[1.35] text-text-secondary">
                      Nivel de complejidad estimado (técnica, operativa y de cambio organizacional).
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[5px]">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border text-[12.5px] font-bold transition-all duration-150 ${
                        c4 === val
                          ? "border-brand-accent bg-brand-accent text-white shadow-[0_2px_6px_rgba(230,0,126,0.25)]"
                          : "border-[#d0d4e4] bg-bg-card text-gray-700 hover:border-brand-accent hover:bg-pink-50 hover:text-brand-accent"
                      }`}
                      onClick={() => setC4(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] text-gray-500">
                    Justificación breve (opcional)
                  </label>
                  <input
                    type="text"
                    value={j4}
                    onChange={(e) => setJ4(e.target.value)}
                    className="w-full rounded-md border border-[#d0d4e4] bg-bg-card px-2.5 py-1.5 text-[11.5px] text-text-heading transition-colors duration-150 outline-none focus:border-brand-primary"
                    placeholder="Justificación para complejidad..."
                  />
                </div>
              </div>

              {/* Criterio 5: Riesgos / dependencias */}
              <div className="grid grid-cols-1 items-center gap-2.5 rounded-[10px] border border-[#f1f3f7] bg-[#fafbfc] px-3.5 py-3 transition-all duration-150 hover:border-[#f2d8ec] hover:bg-bg-card hover:shadow-xs xl:grid-cols-[minmax(200px,1.5fr)_180px_minmax(220px,1.5fr)] xl:gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-extrabold text-pink-600">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-text-heading">
                      Riesgos / dependencias
                    </div>
                    <div className="mt-0.5 text-[11px] leading-[1.35] text-text-secondary">
                      Exposición a riesgos, dependencias de terceros o factores inciertos.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[5px]">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border text-[12.5px] font-bold transition-all duration-150 ${
                        c5 === val
                          ? "border-brand-accent bg-brand-accent text-white shadow-[0_2px_6px_rgba(230,0,126,0.25)]"
                          : "border-[#d0d4e4] bg-bg-card text-gray-700 hover:border-brand-accent hover:bg-pink-50 hover:text-brand-accent"
                      }`}
                      onClick={() => setC5(val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10.5px] text-gray-500">
                    Justificación breve (opcional)
                  </label>
                  <input
                    type="text"
                    value={j5}
                    onChange={(e) => setJ5(e.target.value)}
                    className="w-full rounded-md border border-[#d0d4e4] bg-bg-card px-2.5 py-1.5 text-[11.5px] text-text-heading transition-colors duration-150 outline-none focus:border-brand-primary"
                    placeholder="Justificación para riesgos y dependencias..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BARRA INFERIOR FIJA / STICKY DE DECISIÓN Y SCORE */}
      <div className="relative mt-6 mb-8 flex w-full flex-wrap items-center justify-between gap-5 rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-xs">
        <div className="flex flex-1 flex-wrap items-center gap-6">
          {/* Score preliminar */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center text-brand-accent">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
            </span>
            <div>
              <div className="text-[10.5px] font-medium text-gray-500">Score preliminar</div>
              <div className="text-2xl leading-[1.1] font-black text-text-heading">
                {calculatedScore}/100
              </div>
            </div>
          </div>

          {/* Prioridad sugerida */}
          <div className="flex items-center gap-2 text-warning-500">
            <Icon icon={Chart} size={18} />
            <div>
              <div className="text-[10.5px] font-medium text-gray-500">Prioridad sugerida</div>
              <div className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-[3px] text-[11.5px] font-bold text-warning-500">
                {prioritySugerida}
              </div>
            </div>
          </div>

          {/* Confianza de evaluación */}
          <div className="flex items-center gap-2 text-warning-500">
            <Icon icon={Security} size={18} />
            <div>
              <div className="text-[10.5px] font-medium text-gray-500">Confianza de evaluación</div>
              <div className="inline-flex items-center rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-[3px] text-[11.5px] font-bold text-warning-500">
                {confianza}
              </div>
            </div>
          </div>

          {/* Lectura resumida / Feedback */}
          <div className="flex max-w-[480px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
            <span className="flex shrink-0 items-center text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="text-xs leading-[1.35] text-gray-600">{feedbackText}</span>
          </div>
        </div>

        {/* Acciones derecha */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-pink-200 bg-bg-card px-4 py-2 text-[12.5px] font-bold text-pink-600 transition-all duration-150 hover:border-pink-600 hover:bg-pink-50"
            onClick={handleRequestAdjustments}
          >
            Solicitar ajustes
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-lg border border-[#d0d4e4] bg-bg-card px-4 py-2 text-[12.5px] font-semibold text-gray-700 transition-all duration-150 hover:border-gray-400 hover:bg-gray-100"
            onClick={handleSaveDraft}
          >
            Guardar borrador
          </button>

          <button
            type="button"
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border-none bg-brand-accent px-5 py-2 text-[13px] font-bold text-white shadow-[0_2px_6px_rgba(230,0,126,0.25)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-brand-accent-dark"
            onClick={handleSaveAndContinue}
          >
            <span>Guardar y continuar</span>
            <Icon icon={NavigationChevronRight} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EvaluacionPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-text-secondary">
          Cargando evaluación...
        </div>
      }
    >
      <EvaluacionContent />
    </Suspense>
  );
}
