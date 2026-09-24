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
import { usePriorizacionStore } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";

function EvaluacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initiativeId = searchParams.get("id") || "prio-01";

  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const saveEvaluation = usePriorizacionStore((s) => s.saveEvaluation);
  const requestAdjustments = usePriorizacionStore((s) => s.requestAdjustments);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Priorización");
  }, [setActiveMenuTitle]);

  const initiative = useMemo(() => {
    return initiatives.find((i) => i.id === initiativeId) || initiatives[0];
  }, [initiatives, initiativeId]);

  // Criterios de evaluación (1 al 5)
  // Valores iniciales que coinciden exactamente con la Imagen 4:
  // 1: 4, 2: 5, 3: 4, 4: 3, 5: 3
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

  // Cálculo ponderado dinámico:
  // Con (4, 5, 4, 3, 3) resulta exactamente en 82/100 como en la Imagen 4
  const calculatedScore = useMemo(() => {
    const raw =
      c1 * 6 +
      c2 * 5 +
      c3 * 3 +
      c4 * 3 +
      c5 * 3 +
      (c1 >= 4 && c2 >= 4 ? 3 : 0);
    return Math.min(100, Math.max(10, Math.round(raw)));
  }, [c1, c2, c3, c4, c5]);

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
      router.push(`/priorizacion/confirmacion?id=${initiative.id}`);
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
      router.push("/priorizacion");
    }, 900);
  };

  const handleRequestAdjustments = () => {
    requestAdjustments(initiative.id);
    showToast(`Se solicitaron ajustes al solicitante (${initiative.solicitante})`);
    setTimeout(() => {
      router.push("/priorizacion");
    }, 900);
  };

  return (
    <div className="eval-page-container">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="prio-toast">
          <Icon icon={Check} size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ENCABEZADO Y BREADCRUMB */}
      <div className="eval-header-row">
        <div>
          <div className="prio-breadcrumb">
            <Link href="/" className="prio-breadcrumb__link">
              Portafolio
            </Link>
            <span className="prio-breadcrumb__sep">&gt;</span>
            <Link href="/priorizacion" className="prio-breadcrumb__link">
              Revisión y Priorización
            </Link>
            <span className="prio-breadcrumb__sep">&gt;</span>
            <span className="prio-breadcrumb__current">Evaluación</span>
          </div>
          <h1 className="eval-header__title">Evaluación de iniciativa</h1>
          <p className="eval-header__subtitle">
            Valida la información disponible y asigna una prioridad preliminar.
          </p>
        </div>

        {/* Paso 1 de 2 + Aviso de Discovery */}
        <div className="eval-header__right">
          <div className="eval-step-box">
            <div className="eval-step-label">Paso 1 de 2 • Evaluación preliminar</div>
            <div className="eval-step-track">
              <div className="eval-step-fill" style={{ width: "50%" }} />
            </div>
          </div>

          <div className="eval-info-callout">
            <Icon icon={Info} size={15} />
            <span>La evaluación es preliminar y se basa en el Discovery de alto nivel.</span>
          </div>
        </div>
      </div>

      {/* 2. CARD DE CABECERA DE LA INICIATIVA */}
      <div className="eval-initiative-banner">
        <div className="eval-initiative-banner__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e6007e" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h2 className="eval-initiative-banner__title">{initiative.name}</h2>
          <div className="eval-initiative-banner__meta">
            <span>Área: {initiative.area}</span>
            <span className="eval-initiative-banner__divider">|</span>
            <span>Madurez: {initiative.madurez}%</span>
            <span className="eval-initiative-banner__divider">|</span>
            <span className="eval-maturity-badge">
              {initiative.madurezTag || "Madurez inicial"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. LAYOUT PRINCIPAL A DOS COLUMNAS */}
      <div className="eval-main-grid">
        {/* COLUMNA IZQUIERDA: RESUMEN EJECUTIVO */}
        <div className="eval-summary-card">
          <div className="eval-card-header">
            <Icon icon={FileIcon} size={18} />
            <h3 className="eval-card-header__title">Resumen ejecutivo</h3>
          </div>

          <div className="eval-summary-list">
            {/* Problema / Oportunidad */}
            <div className="eval-summary-item">
              <div className="eval-summary-label">Problema / Oportunidad</div>
              <div className="eval-summary-text">{initiative.description}</div>
            </div>

            {/* Área de negocio */}
            <div className="eval-summary-item eval-summary-item--split">
              <div className="eval-summary-label">Área de negocio</div>
              <div className="eval-summary-val-row">
                <span className="eval-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="9" y1="22" x2="9" y2="2" />
                    <line x1="8" y1="6" x2="8" y2="6.01" />
                    <line x1="16" y1="6" x2="16" y2="6.01" />
                    <line x1="16" y1="10" x2="16" y2="10.01" />
                    <line x1="16" y1="14" x2="16" y2="14.01" />
                  </svg>
                </span>
                <span className="eval-summary-bold">{initiative.area}</span>
              </div>
            </div>

            {/* Sponsor */}
            <div className="eval-summary-item eval-summary-item--split">
              <div className="eval-summary-label">Sponsor</div>
              <div className="eval-summary-val-row">
                <span className="eval-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <div>
                  <div className="eval-summary-bold">{initiative.sponsor || "Carlos Méndez"}</div>
                  <div className="eval-summary-sub">{initiative.sponsorRole || "CFO"}</div>
                </div>
              </div>
            </div>

            {/* ¿Requiere TI? */}
            <div className="eval-summary-item eval-summary-item--split">
              <div className="eval-summary-label">¿Requiere TI?</div>
              <div className="eval-summary-val-row">
                <span className="eval-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <div>
                  <div className="eval-summary-bold">{initiative.impactoTI}</div>
                  <div className="eval-summary-sub">
                    {initiative.impactoTISub || "Involucra desarrollo e integración de sistemas."}
                  </div>
                </div>
              </div>
            </div>

            {/* Sistemas involucrados */}
            <div className="eval-summary-item eval-summary-item--split">
              <div className="eval-summary-label">Sistemas involucrados</div>
              <div className="eval-chips-container">
                {(initiative.sistemasInvolucrados || ["SAP", "Pasarela", "Core", "API"]).map(
                  (sys) => (
                    <span key={sys} className="eval-system-chip">
                      {sys}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Beneficio estimado */}
            <div className="eval-summary-item eval-summary-item--split">
              <div className="eval-summary-label">Beneficio estimado</div>
              <div className="eval-summary-val-row">
                <span className="eval-item-icon" style={{ color: "#e6007e" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <div>
                  <div className="eval-summary-bold" style={{ color: "#1e2022" }}>
                    {initiative.beneficioEstimado}
                  </div>
                  <div className="eval-summary-sub">
                    {initiative.beneficioDetalle || "Ahorro en costos operativos y reducción de incidencias."}
                  </div>
                </div>
              </div>
            </div>

            {/* KPI esperado */}
            <div className="eval-summary-item eval-summary-item--split">
              <div className="eval-summary-label">KPI esperado</div>
              <div className="eval-summary-val-row">
                <span className="eval-item-icon" style={{ color: "#e6007e" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                </span>
                <div>
                  <div className="eval-summary-bold">
                    {initiative.kpiEsperado || "Reducción de 70% en tiempo de conciliación"}
                  </div>
                  <div className="eval-summary-sub">
                    {initiative.kpiDetalle || "De 5 días a 1.5 días en promedio."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CRITERIOS DE EVALUACIÓN */}
        <div className="eval-criteria-card">
          <div className="eval-card-header">
            <span style={{ color: "#e6007e", display: "flex", alignItems: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </span>
            <div>
              <h3 className="eval-card-header__title">Criterios de evaluación</h3>
              <p className="eval-card-header__sub">
                Califica cada criterio del 1 al 5, donde 5 es el mayor impacto.
              </p>
            </div>
          </div>

          <div className="eval-criteria-rows">
            {/* Criterio 1: Impacto al negocio */}
            <div className="eval-criterion-row">
              <div className="eval-criterion-left">
                <div className="eval-criterion-badge">1</div>
                <div className="eval-criterion-info">
                  <div className="eval-criterion-title">Impacto al negocio</div>
                  <div className="eval-criterion-desc">
                    Magnitud del beneficio en ingresos, costos, experiencia del cliente o eficiencia operativa.
                  </div>
                </div>
              </div>

              <div className="eval-criterion-weight">
                <span className="eval-weight-label">Peso</span>
                <span className="eval-weight-val">30%</span>
              </div>

              <div className="eval-scale-buttons">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`eval-scale-btn ${c1 === val ? "eval-scale-btn--active" : ""}`}
                    onClick={() => setC1(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="eval-justification-box">
                <label className="eval-justification-label">Justificación breve (opcional)</label>
                <input
                  type="text"
                  value={j1}
                  onChange={(e) => setJ1(e.target.value)}
                  className="eval-justification-input"
                  placeholder="Justificación para impacto al negocio..."
                />
              </div>
            </div>

            {/* Criterio 2: Alineación estratégica */}
            <div className="eval-criterion-row">
              <div className="eval-criterion-left">
                <div className="eval-criterion-badge">2</div>
                <div className="eval-criterion-info">
                  <div className="eval-criterion-title">Alineación estratégica</div>
                  <div className="eval-criterion-desc">
                    Contribución a los objetivos estratégicos de la empresa.
                  </div>
                </div>
              </div>

              <div className="eval-criterion-weight">
                <span className="eval-weight-label">Peso</span>
                <span className="eval-weight-val">25%</span>
              </div>

              <div className="eval-scale-buttons">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`eval-scale-btn ${c2 === val ? "eval-scale-btn--active" : ""}`}
                    onClick={() => setC2(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="eval-justification-box">
                <label className="eval-justification-label">Justificación breve (opcional)</label>
                <input
                  type="text"
                  value={j2}
                  onChange={(e) => setJ2(e.target.value)}
                  className="eval-justification-input"
                  placeholder="Justificación para alineación estratégica..."
                />
              </div>
            </div>

            {/* Criterio 3: Urgencia / oportunidad */}
            <div className="eval-criterion-row">
              <div className="eval-criterion-left">
                <div className="eval-criterion-badge">3</div>
                <div className="eval-criterion-info">
                  <div className="eval-criterion-title">Urgencia / oportunidad</div>
                  <div className="eval-criterion-desc">
                    Sensibilidad del tiempo, ventanas de oportunidad y presión del negocio.
                  </div>
                </div>
              </div>

              <div className="eval-criterion-weight">
                <span className="eval-weight-label">Peso</span>
                <span className="eval-weight-val">15%</span>
              </div>

              <div className="eval-scale-buttons">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`eval-scale-btn ${c3 === val ? "eval-scale-btn--active" : ""}`}
                    onClick={() => setC3(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="eval-justification-box">
                <label className="eval-justification-label">Justificación breve (opcional)</label>
                <input
                  type="text"
                  value={j3}
                  onChange={(e) => setJ3(e.target.value)}
                  className="eval-justification-input"
                  placeholder="Justificación para urgencia y oportunidad..."
                />
              </div>
            </div>

            {/* Criterio 4: Complejidad preliminar */}
            <div className="eval-criterion-row">
              <div className="eval-criterion-left">
                <div className="eval-criterion-badge">4</div>
                <div className="eval-criterion-info">
                  <div className="eval-criterion-title">Complejidad preliminar</div>
                  <div className="eval-criterion-desc">
                    Nivel de complejidad estimado (técnica, operativa y de cambio organizacional).
                  </div>
                </div>
              </div>

              <div className="eval-criterion-weight">
                <span className="eval-weight-label">Peso</span>
                <span className="eval-weight-val">15%</span>
              </div>

              <div className="eval-scale-buttons">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`eval-scale-btn ${c4 === val ? "eval-scale-btn--active" : ""}`}
                    onClick={() => setC4(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="eval-justification-box">
                <label className="eval-justification-label">Justificación breve (opcional)</label>
                <input
                  type="text"
                  value={j4}
                  onChange={(e) => setJ4(e.target.value)}
                  className="eval-justification-input"
                  placeholder="Justificación para complejidad..."
                />
              </div>
            </div>

            {/* Criterio 5: Riesgos / dependencias */}
            <div className="eval-criterion-row">
              <div className="eval-criterion-left">
                <div className="eval-criterion-badge">5</div>
                <div className="eval-criterion-info">
                  <div className="eval-criterion-title">Riesgos / dependencias</div>
                  <div className="eval-criterion-desc">
                    Exposición a riesgos, dependencias de terceros o factores inciertos.
                  </div>
                </div>
              </div>

              <div className="eval-criterion-weight">
                <span className="eval-weight-label">Peso</span>
                <span className="eval-weight-val">15%</span>
              </div>

              <div className="eval-scale-buttons">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`eval-scale-btn ${c5 === val ? "eval-scale-btn--active" : ""}`}
                    onClick={() => setC5(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <div className="eval-justification-box">
                <label className="eval-justification-label">Justificación breve (opcional)</label>
                <input
                  type="text"
                  value={j5}
                  onChange={(e) => setJ5(e.target.value)}
                  className="eval-justification-input"
                  placeholder="Justificación para riesgos y dependencias..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BARRA INFERIOR FIJA / STICKY DE DECISIÓN Y SCORE */}
      <div className="eval-bottom-bar">
        <div className="eval-bottom-bar__left">
          {/* Score preliminar */}
          <div className="eval-score-metric">
            <span style={{ color: "#e6007e", display: "flex", alignItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
            </span>
            <div>
              <div className="eval-metric-small-label">Score preliminar</div>
              <div className="eval-score-value">{calculatedScore}/100</div>
            </div>
          </div>

          {/* Prioridad sugerida */}
          <div className="eval-metric-item">
            <Icon icon={Chart} size={18} />
            <div>
              <div className="eval-metric-small-label">Prioridad sugerida</div>
              <div className="eval-metric-badge">{prioritySugerida}</div>
            </div>
          </div>

          {/* Confianza de evaluación */}
          <div className="eval-metric-item">
            <Icon icon={Security} size={18} />
            <div>
              <div className="eval-metric-small-label">Confianza de evaluación</div>
              <div className="eval-metric-badge">{confianza}</div>
            </div>
          </div>

          {/* Lectura resumida / Feedback */}
          <div className="eval-feedback-box">
            <span style={{ color: "#6b7280", flexShrink: 0, display: "flex", alignItems: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="eval-feedback-text">{feedbackText}</span>
          </div>
        </div>

        {/* Acciones derecha */}
        <div className="eval-bottom-bar__right">
          <button
            type="button"
            className="eval-btn-outline-pink"
            onClick={handleRequestAdjustments}
          >
            Solicitar ajustes
          </button>

          <button
            type="button"
            className="eval-btn-outline-neutral"
            onClick={handleSaveDraft}
          >
            Guardar borrador
          </button>

          <button
            type="button"
            className="eval-btn-solid-pink"
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
    <Suspense fallback={<div style={{ padding: 30 }}>Cargando evaluación...</div>}>
      <EvaluacionContent />
    </Suspense>
  );
}
