"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@vibe/core";
import {
  File as FileIcon,
  Chart,
  Person,
  Check,
  Info,
  NavigationChevronRight,
  Show,
  Edit,
  Delete,
} from "@vibe/icons";
import {
  usePriorizacionStore,
  normalizePiramideNivel,
  getPiramidePoints,
  getPizzaPoints,
  getCriteriosPoints,
  PIZZA_OBJETIVOS_CLAVE,
  PIZZA_BATALLAS,
  PIZZA_HABILITADORES,
} from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";
import { BackButton } from "@/components/BackButton";

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initiativeId = searchParams.get("id") || "prio-01";

  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const confirmDecisionStore = usePriorizacionStore((s) => s.confirmDecision);
  const saveEvaluationStore = usePriorizacionStore((s) => s.saveEvaluation);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Iniciativas");
  }, [setActiveMenuTitle]);

  const initiative = useMemo(() => {
    return initiatives.find((i) => i.id === initiativeId) || initiatives[0];
  }, [initiatives, initiativeId]);

  // Datos provenientes del Paso 1 (Evaluación preliminar: Pirámide + Pizza + 5 Criterios)
  const evalData = initiative.evaluacion;
  const c1 = evalData?.impactoNegocio ?? 4;
  const c2 = evalData?.alineacionEstrategica ?? 5;
  const c3 = evalData?.urgencia ?? 4;
  const c4 = evalData?.complejidad ?? 3;
  const c5 = evalData?.riesgos ?? 3;

  const piramideNivel =
    evalData?.piramideNivel ||
    normalizePiramideNivel(initiative.alineacionEstrategicaNivel);
  const piramidePuntos = evalData?.piramidePuntos ?? getPiramidePoints(piramideNivel);

  const pizzaObjetivoClave = evalData?.pizzaObjetivoClave || PIZZA_OBJETIVOS_CLAVE[2];
  const pizzaBatalla = evalData?.pizzaBatalla || PIZZA_BATALLAS[6];
  const pizzaHabilitador = evalData?.pizzaHabilitador || PIZZA_HABILITADORES[1];
  const pizzaPuntos =
    evalData?.pizzaPuntos ?? getPizzaPoints(pizzaObjetivoClave, pizzaBatalla, pizzaHabilitador);

  const criteriosPuntos = evalData?.criteriosPuntos ?? getCriteriosPoints(c1, c2, c3, c4, c5);

  // Score y prioridad sugerida (calculados o preexistentes, máximo 100 pts)
  const score = useMemo(() => {
    if (initiative.score && initiative.score > 0) return initiative.score;
    return Math.min(100, Math.max(0, piramidePuntos + pizzaPuntos + criteriosPuntos));
  }, [initiative.score, piramidePuntos, pizzaPuntos, criteriosPuntos]);

  const suggestedPriority = useMemo(() => {
    if (initiative.priority) return initiative.priority;
    if (score >= 80) return "Alta";
    if (score >= 65) return "Media";
    return "Baja";
  }, [initiative.priority, score]);

  const confianza = evalData?.confianza || (score >= 80 ? "Media" : "Media");

  // Estado del Paso 2 (Decisión del Portfolio Manager)
  const [decision, setDecision] = useState<"priorizar" | "observacion" | "ajustes" | "descartar">(
    initiative.decision || "priorizar"
  );
  const [prioridadFinal, setPrioridadFinal] = useState<"Alta" | "Media" | "Baja">(
    initiative.prioridadFinal || (suggestedPriority === "Media-Alta" ? "Alta" : (suggestedPriority as "Alta" | "Media" | "Baja")) || "Alta"
  );
  const [justificacion, setJustificacion] = useState<string>(
    initiative.justificacionDecision ||
      "La iniciativa muestra un alto potencial de generación de valor, está alineada con la estrategia de omnicanalidad y su urgencia la hace relevante para el corto plazo."
  );
  const [destino, setDestino] = useState<string>(
    initiative.destinoDecision || "Bandeja de priorización"
  );

  // Sincronizar campos si cambia la iniciativa seleccionada
  useEffect(() => {
    setDecision(initiative.decision || "priorizar");
    setPrioridadFinal(
      initiative.prioridadFinal ||
        (suggestedPriority === "Media-Alta"
          ? "Alta"
          : (suggestedPriority as "Alta" | "Media" | "Baja")) ||
        "Alta"
    );
    setJustificacion(
      initiative.justificacionDecision ||
        "La iniciativa muestra un alto potencial de generación de valor, está alineada con la estrategia de omnicanalidad y su urgencia la hace relevante para el corto plazo."
    );
    setDestino(initiative.destinoDecision || "Bandeja de priorización");
  }, [initiative.id, suggestedPriority]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Actualizar destino por defecto al cambiar la decisión
  const handleSelectDecision = (d: "priorizar" | "observacion" | "ajustes" | "descartar") => {
    setDecision(d);
    if (d === "priorizar") {
      setDestino("Bandeja de priorización");
    } else if (d === "observacion") {
      setDestino("Bandeja de observación");
    } else if (d === "ajustes") {
      setDestino("Bandeja de solicitante / ajustes");
    } else if (d === "descartar") {
      setDestino("Archivo de iniciativas descartadas");
    }
  };

  // Criterios formateados para tabla de resumen del análisis (40% restante)
  const criteriosList = [
    { id: 1, name: "Impacto al negocio", val: c1, max: 5, peso: "12%" },
    { id: 2, name: "Alineación estratégica", val: c2, max: 5, peso: "10%" },
    { id: 3, name: "Urgencia / oportunidad", val: c3, max: 5, peso: "6%" },
    { id: 4, name: "Complejidad preliminar", val: c4, max: 5, peso: "6%" },
    { id: 5, name: "Riesgos / dependencias", val: c5, max: 5, peso: "6%" },
  ];

  // Lectura ejecutiva dinámica
  const lecturaBullets = useMemo(() => {
    return [
      `Pirámide estratégica: ${piramideNivel} (${piramidePuntos} / 30 pts).`,
      `OKR's Comercio Unificado ("Pizza"): ${pizzaPuntos / 10} de 3 dimensiones (${pizzaPuntos} / 30 pts).`,
      `Criterios multicriterio (1-5): ${criteriosPuntos} / 40 pts.`,
      c1 >= 4 ? "Alto impacto al negocio y alineación confirmada." : "Impacto moderado al negocio.",
    ];
  }, [piramideNivel, piramidePuntos, pizzaPuntos, criteriosPuntos, c1]);

  // Impactos dinámicos según la decisión
  const impactoBullets = useMemo(() => {
    if (decision === "priorizar") {
      return [
        "La iniciativa pasará a Priorización.",
        "Será comparable contra otras iniciativas.",
        "Se notificará al solicitante.",
      ];
    }
    if (decision === "observacion") {
      return [
        "La iniciativa permanecerá en estado de observación.",
        "Se programará un recordatorio para el siguiente ciclo.",
        "Se notificará al solicitante sobre la pausa temporal.",
      ];
    }
    if (decision === "ajustes") {
      return [
        "La iniciativa regresará a la bandeja del solicitante.",
        "Se enviará la justificación con los requerimientos a subsanar.",
        "El estado cambiará a 'Con comentarios'.",
      ];
    }
    return [
      "La iniciativa saldrá del embudo activo de proyectos.",
      "Quedará registrada en histórico con su justificación.",
      "Se notificará al sponsor la resolución final.",
    ];
  }, [decision]);

  // Acciones finales
  const handleConfirm = () => {
    confirmDecisionStore(initiative.id, decision, prioridadFinal, justificacion, destino);
    showToast(`Decisión guardada: ${decision.toUpperCase()} → ${destino}`);
    setTimeout(() => {
      router.push("/iniciativas");
    }, 800);
  };

  const handleSaveDraft = () => {
    confirmDecisionStore(initiative.id, decision, prioridadFinal, justificacion, destino);
    showToast("Borrador de decisión guardado exitosamente");
  };

  const getMeterWidthClass = (val: number) => {
    if (val <= 1) return "w-1/5";
    if (val === 2) return "w-2/5";
    if (val === 3) return "w-3/5";
    if (val === 4) return "w-4/5";
    return "w-full";
  };

  return (
    <div className="px-1 pb-12">
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Toast de confirmación */}
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
            Confirmación de prioridad
          </h1>
          <p className="m-0 text-[13.5px] text-text-secondary">
            Revisa el resultado de la evaluación y define la decisión final de la iniciativa.
          </p>
        </div>

        {/* Paso 2 de 2 + Aviso de Evaluación */}
        <div className="flex flex-col items-end gap-2.5">
          <div className="flex flex-col items-end gap-1.5">
            <div className="text-xs font-semibold text-gray-700">
              Paso 2 de 2 · Confirmación de decisión
            </div>
            <div className="h-1.5 w-[190px] overflow-hidden rounded-[3px] bg-gray-200">
              <div className="h-full w-full rounded-[3px] bg-brand-accent" />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#cce3fd] bg-[#f0f7ff] px-3 py-1.5 text-[11.5px] font-medium text-sky-700">
            <Icon icon={Info} size={16} />
            <span>
              La iniciativa ya cuenta con una evaluación preliminar. Confirma su prioridad y define su siguiente paso dentro del portafolio.
            </span>
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
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(420px,1.25fr)_minmax(360px,1fr)]">
        {/* ============================================================== */}
        {/* COLUMNA IZQUIERDA: RESULTADO Y ANÁLISIS DE EVALUACIÓN          */}
        {/* ============================================================== */}
        <div className="flex flex-col">
          {/* Card: Resultado de la evaluación */}
          <div className="mb-5 rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
            <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
              <span className="inline-flex items-center text-brand-accent">
                <Icon icon={Chart} size={18} />
              </span>
              <h3 className="m-0 text-base font-bold text-text-heading">
                Resultado de la evaluación
              </h3>
            </div>

            {/* 3 Métricas KPI side-by-side */}
            <div className="grid grid-cols-1 gap-4 border-b border-[#f1f3f7] bg-bg-card px-5 py-4 sm:grid-cols-3">
              {/* Score preliminar */}
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-pink-50 text-pink-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" fill="#db2777" />
                  </svg>
                </div>
                <div className="text-[11.5px] font-medium text-gray-500">Score preliminar</div>
                <div className="text-[22px] leading-[1.1] font-extrabold text-text-heading">
                  {score}/100
                </div>
              </div>

              {/* Prioridad sugerida */}
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-pink-50 text-pink-600">
                  <Icon icon={Chart} size={16} />
                </div>
                <div className="text-[11.5px] font-medium text-gray-500">Prioridad sugerida</div>
                <div>
                  <span className="inline-flex items-center rounded-[14px] border border-pink-200 bg-pink-50 px-3.5 py-[3px] text-xs font-bold text-pink-600">
                    {suggestedPriority}
                  </span>
                </div>
              </div>

              {/* Confianza de evaluación */}
              <div className="flex flex-col items-start gap-1.5">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-amber-50 text-warning-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="text-[11.5px] font-medium text-gray-500">
                  Confianza de evaluación
                </div>
                <div>
                  <span className="inline-flex items-center rounded-[14px] border border-amber-200 bg-amber-50 px-3.5 py-[3px] text-xs font-bold text-warning-500">
                    {confianza}
                  </span>
                </div>
              </div>
            </div>

            {/* Lectura ejecutiva */}
            <div className="bg-bg-card px-5 py-4">
              <div className="mb-3 flex items-center gap-2 text-text-heading">
                <Icon icon={FileIcon} size={16} />
                <span className="text-[13.5px] font-bold text-text-heading">
                  Lectura ejecutiva
                </span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
                {lecturaBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-[12.5px] text-gray-700">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pink-600" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card: Resumen del análisis */}
          <div className="mb-5 rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
            <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
              <span className="inline-flex items-center text-brand-accent">
                <Icon icon={Chart} size={18} />
              </span>
              <div>
                <h3 className="m-0 text-base font-bold text-text-heading">Resumen del análisis</h3>
                <p className="mt-0.5 mb-0 text-xs text-text-secondary">
                  Calificación final por criterio con base en la evaluación realizada.
                </p>
              </div>
            </div>

            <div className="px-4 pt-1 pb-4">
              {/* Resumen de Pirámide (30 pts) y Pizza (30 pts) */}
              <div className="mb-3.5 flex flex-col gap-2 rounded-[10px] border border-[#efd6e7] bg-[#fdf4f9] px-3.5 py-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-primary">
                    🔺 Alineación Estratégica (&quot;Pirámide&quot; · Máx. 30%)
                  </span>
                  <span className="font-extrabold text-brand-accent">
                    {piramideNivel} · {piramidePuntos} / 30 pts
                  </span>
                </div>
                <div className="border-t border-[#f2d8ec] pt-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-bold text-brand-primary">
                      🍕 OKR&apos;s Estratégicos (&quot;Pizza&quot; · Máx. 30%)
                    </span>
                    <span className="font-extrabold text-brand-accent">
                      {pizzaPuntos} / 30 pts
                    </span>
                  </div>
                  <div className="flex flex-col gap-[3px] text-[11.5px] text-gray-600">
                    <div>• <b>Objetivo Clave:</b> {pizzaObjetivoClave}</div>
                    <div>• <b>Batalla / Iniciativa Clave:</b> {pizzaBatalla}</div>
                    <div>• <b>Habilitador:</b> {pizzaHabilitador}</div>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-[#f1f3f7] bg-bg-card text-left text-[11.5px] font-semibold text-gray-500">
                    <th className="w-[42%] px-2.5 py-2">Criterio</th>
                    <th className="w-[18%] px-2.5 py-2">Calificación</th>
                    <th className="w-[15%] px-2.5 py-2">Peso</th>
                    <th className="w-[25%] px-2.5 py-2">Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {criteriosList.map((crit) => {
                    return (
                      <tr key={crit.id} className="border-b border-slate-50">
                        <td className="p-2.5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-50 text-[11px] font-bold text-pink-600">
                              {crit.id}
                            </span>
                            <span className="text-[12.5px] font-semibold text-text-heading">
                              {crit.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2.5 align-middle">
                          <span className="text-[12.5px] font-semibold text-text-heading">
                            {crit.val} / {crit.max}
                          </span>
                        </td>
                        <td className="p-2.5 align-middle">
                          <span className="text-xs text-gray-500">{crit.peso}</span>
                        </td>
                        <td className="p-2.5 align-middle">
                          <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-200">
                            <div
                              className={`h-full rounded-sm bg-pink-600 transition-all duration-300 ${getMeterWidthClass(crit.val)}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Siguiente paso sugerido */}
          <div className="flex items-start gap-3.5 rounded-[14px] border border-border-default bg-bg-card px-5 py-4 shadow-2xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v1h8v-1c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
              </svg>
            </div>
            <div>
              <div className="mb-1 text-[13.5px] font-bold text-text-heading">
                Siguiente paso sugerido
              </div>
              <div className="text-[12.5px] leading-[1.45] text-gray-600">
                Integrar la iniciativa a la bandeja de priorización del portafolio para compararla contra el resto de iniciativas activas.
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMNA DERECHA: DECISIÓN DEL PORTFOLIO MANAGER               */}
        {/* ============================================================== */}
        <div className="flex flex-col">
          <div className="rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
            <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#f1f3f5] pb-3.5 text-brand-primary">
              <span className="inline-flex items-center text-brand-accent">
                <Icon icon={Person} size={18} />
              </span>
              <div>
                <h3 className="m-0 text-base font-bold text-text-heading">
                  Decisión del Portfolio Manager
                </h3>
                <p className="mt-0.5 mb-0 text-xs text-text-secondary">
                  Selecciona la decisión final para esta iniciativa.
                </p>
              </div>
            </div>

            {/* Opciones de decisión (Radio cards) */}
            <div className="flex flex-col gap-2.5 px-5 pt-2.5 pb-5">
              {/* Opción 1: Priorizar */}
              <div
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-all duration-150 ${
                  decision === "priorizar"
                    ? "border-pink-600 bg-[#fdf8fb] ring-1 ring-pink-600"
                    : "border-gray-200 bg-bg-card hover:border-slate-300 hover:bg-[#fafbfe]"
                }`}
                onClick={() => handleSelectDecision("priorizar")}
              >
                <div
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    decision === "priorizar" ? "border-pink-600" : "border-gray-300"
                  }`}
                >
                  {decision === "priorizar" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                  )}
                </div>
                <div className="flex shrink-0 items-center justify-center text-pink-600">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4.5c1.26-1.28 3-1.5 3-1.5" />
                    <path d="M15 9V4s3.03.55 4.5 2c1.28 1.26 1.5 3 1.5 3" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-text-heading">Priorizar</div>
                  <div className="mt-0.5 text-[11.5px] text-gray-500">
                    Incluir la iniciativa en el portafolio y pasar a la siguiente etapa.
                  </div>
                </div>
              </div>

              {/* Opción 2: Mantener en observación */}
              <div
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-all duration-150 ${
                  decision === "observacion"
                    ? "border-pink-600 bg-[#fdf8fb] ring-1 ring-pink-600"
                    : "border-gray-200 bg-bg-card hover:border-slate-300 hover:bg-[#fafbfe]"
                }`}
                onClick={() => handleSelectDecision("observacion")}
              >
                <div
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    decision === "observacion" ? "border-pink-600" : "border-gray-300"
                  }`}
                >
                  {decision === "observacion" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                  )}
                </div>
                <div className="flex shrink-0 items-center justify-center text-gray-600">
                  <Icon icon={Show} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-text-heading">
                    Mantener en observación
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-gray-500">
                    Conservar la iniciativa para una futura revisión.
                  </div>
                </div>
              </div>

              {/* Opción 3: Solicitar ajustes */}
              <div
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-all duration-150 ${
                  decision === "ajustes"
                    ? "border-pink-600 bg-[#fdf8fb] ring-1 ring-pink-600"
                    : "border-gray-200 bg-bg-card hover:border-slate-300 hover:bg-[#fafbfe]"
                }`}
                onClick={() => handleSelectDecision("ajustes")}
              >
                <div
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    decision === "ajustes" ? "border-pink-600" : "border-gray-300"
                  }`}
                >
                  {decision === "ajustes" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                  )}
                </div>
                <div className="flex shrink-0 items-center justify-center text-gray-600">
                  <Icon icon={Edit} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-text-heading">
                    Solicitar ajustes
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-gray-500">
                    Regresar la iniciativa al solicitante para mayor información.
                  </div>
                </div>
              </div>

              {/* Opción 4: Descartar */}
              <div
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-all duration-150 ${
                  decision === "descartar"
                    ? "border-pink-600 bg-[#fdf8fb] ring-1 ring-pink-600"
                    : "border-gray-200 bg-bg-card hover:border-slate-300 hover:bg-[#fafbfe]"
                }`}
                onClick={() => handleSelectDecision("descartar")}
              >
                <div
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    decision === "descartar" ? "border-pink-600" : "border-gray-300"
                  }`}
                >
                  {decision === "descartar" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                  )}
                </div>
                <div className="flex shrink-0 items-center justify-center text-pink-600">
                  <Icon icon={Delete} size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold text-text-heading">Descartar</div>
                  <div className="mt-0.5 text-[11.5px] text-gray-500">
                    No continuar con la iniciativa en el portafolio actual.
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Prioridad Final y Justificación */}
            <div className="flex flex-col gap-4 px-5 pb-4.5">
              {/* Prioridad final (Segmented control) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Prioridad final</label>
                <div className="flex gap-2">
                  {(["Alta", "Media", "Baja"] as const).map((p) => {
                    const isSelected = prioridadFinal === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`flex-1 cursor-pointer rounded-md border px-3 py-2 text-[12.5px] transition-all duration-150 ${
                          isSelected
                            ? "border-pink-600 bg-pink-600 font-bold text-white"
                            : "border-gray-200 bg-slate-50 font-semibold text-gray-600 hover:bg-slate-100"
                        }`}
                        onClick={() => setPrioridadFinal(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Justificación de decisión */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">
                  Justificación de decisión
                </label>
                <textarea
                  className="w-full resize-y rounded-md border border-[#d0d4e4] px-3 py-2.5 text-[12.5px] leading-[1.4] text-text-heading transition-all duration-150 outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/15"
                  value={justificacion}
                  maxLength={500}
                  onChange={(e) => setJustificacion(e.target.value)}
                  rows={3}
                  placeholder="Explica el motivo de la decisión y consideraciones clave..."
                />
                <div className="mt-0.5 text-right text-[11px] text-gray-400">
                  {justificacion.length}/500
                </div>
              </div>

              {/* Destino */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Destino</label>
                <div className="relative">
                  <select
                    className="w-full cursor-pointer rounded-md border border-[#d0d4e4] bg-bg-card px-3 py-[9px] text-[12.5px] text-text-heading outline-none focus:border-pink-600"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                  >
                    {decision === "priorizar" && (
                      <>
                        <option value="Bandeja de priorización">Bandeja de priorización</option>
                        <option value="Bandeja de comités directivos">Bandeja de comités directivos</option>
                      </>
                    )}
                    {decision === "observacion" && (
                      <>
                        <option value="Bandeja de observación">Bandeja de observación</option>
                        <option value="Bandeja de análisis futuro">Bandeja de análisis futuro</option>
                      </>
                    )}
                    {decision === "ajustes" && (
                      <>
                        <option value="Bandeja de solicitante / ajustes">Bandeja de solicitante / ajustes</option>
                      </>
                    )}
                    {decision === "descartar" && (
                      <>
                        <option value="Archivo de iniciativas descartadas">Archivo de iniciativas descartadas</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Impacto de la decisión */}
            <div className="border-t border-[#f1f3f7] px-5 py-4">
              <div className="mb-3 flex items-center gap-2 text-pink-600">
                <Icon icon={Chart} size={16} />
                <span className="text-[13.5px] font-bold text-text-heading">
                  Impacto de la decisión
                </span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {impactoBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-[12.5px] text-gray-700">
                    <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Icon icon={Check} size={12} />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BARRA INFERIOR FIJA DE ACCIONES */}
      <div className="relative mt-6 mb-8 flex w-full flex-wrap items-center justify-between gap-5 rounded-[14px] border border-border-default bg-bg-card px-6 py-5 shadow-xs">
        <div />

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/iniciativas/evaluacion?id=${initiative.id}`}
            className="cursor-pointer rounded-lg border border-pink-200 bg-bg-card px-4 py-2 text-[12.5px] font-bold text-pink-600 no-underline transition-all duration-150 hover:border-pink-600 hover:bg-pink-50"
          >
            Volver a evaluación
          </Link>
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
            onClick={handleConfirm}
          >
            <span>Confirmar y continuar</span>
            <Icon icon={NavigationChevronRight} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-text-secondary">
          Cargando confirmación de prioridad...
        </div>
      }
    >
      <ConfirmacionContent />
    </Suspense>
  );
}
