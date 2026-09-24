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
import { usePriorizacionStore } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initiativeId = searchParams.get("id") || "prio-01";

  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const confirmDecisionStore = usePriorizacionStore((s) => s.confirmDecision);
  const saveEvaluationStore = usePriorizacionStore((s) => s.saveEvaluation);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Priorización");
  }, [setActiveMenuTitle]);

  const initiative = useMemo(() => {
    return initiatives.find((i) => i.id === initiativeId) || initiatives[0];
  }, [initiatives, initiativeId]);

  // Datos provenientes del Paso 1 (Evaluación preliminar)
  const evalData = initiative.evaluacion;
  const c1 = evalData?.impactoNegocio ?? 4;
  const c2 = evalData?.alineacionEstrategica ?? 5;
  const c3 = evalData?.urgencia ?? 4;
  const c4 = evalData?.complejidad ?? 3;
  const c5 = evalData?.riesgos ?? 3;

  // Score y prioridad sugerida (calculados o preexistentes)
  const score = useMemo(() => {
    if (initiative.score && initiative.score > 0) return initiative.score;
    const raw =
      c1 * 6 +
      c2 * 5 +
      c3 * 3 +
      c4 * 3 +
      c5 * 3 +
      (c1 >= 4 && c2 >= 4 ? 3 : 0);
    return Math.min(100, Math.max(10, Math.round(raw)));
  }, [initiative.score, c1, c2, c3, c4, c5]);

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

  // Criterios formateados para tabla de resumen del análisis
  const criteriosList = [
    { id: 1, name: "Impacto al negocio", val: c1, max: 5, peso: "30%" },
    { id: 2, name: "Alienación estratégica", val: c2, max: 5, peso: "25%" },
    { id: 3, name: "Urgencia / oportunidad", val: c3, max: 5, peso: "15%" },
    { id: 4, name: "Complejidad preliminar", val: c4, max: 5, peso: "15%" },
    { id: 5, name: "Riesgos / dependencias", val: c5, max: 5, peso: "15%" },
  ];

  // Lectura ejecutiva dinámica
  const lecturaBullets = useMemo(() => {
    return [
      c1 >= 4 ? "Alto impacto al negocio." : "Impacto moderado al negocio.",
      c2 >= 4 ? "Fuerte alineación estratégica." : "Alineación estratégica estándar.",
      c3 >= 4 ? "Urgencia relevante." : "Urgencia moderada / programable.",
      c4 <= 3 && c5 <= 3
        ? "Complejidad y dependencias en nivel medio."
        : "Alta complejidad técnica y dependencias críticas.",
    ];
  }, [c1, c2, c3, c4, c5]);

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
      router.push("/priorizacion");
    }, 800);
  };

  const handleSaveDraft = () => {
    confirmDecisionStore(initiative.id, decision, prioridadFinal, justificacion, destino);
    showToast("Borrador de decisión guardado exitosamente");
  };

  return (
    <div className="eval-page-container">
      {/* Toast de confirmación */}
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
          <h1 className="eval-header__title">Confirmación de prioridad</h1>
          <p className="eval-header__subtitle">
            Revisa el resultado de la evaluación y define la decisión final de la iniciativa.
          </p>
        </div>

        {/* Paso 2 de 2 + Aviso de Evaluación */}
        <div className="eval-header__right">
          <div className="eval-step-box">
            <div className="eval-step-label">Paso 2 de 2 · Confirmación de decisión</div>
            <div className="eval-step-track">
              <div className="eval-step-fill" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="eval-info-callout">
            <Icon icon={Info} size={16} />
            <span>
              La iniciativa ya cuenta con una evaluación preliminar. Confirma su prioridad y define su siguiente paso dentro del portafolio.
            </span>
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
      <div className="step2-main-grid">
        {/* ============================================================== */}
        {/* COLUMNA IZQUIERDA: RESULTADO Y ANÁLISIS DE EVALUACIÓN          */}
        {/* ============================================================== */}
        <div className="step2-col-left">
          {/* Card: Resultado de la evaluación */}
          <div className="eval-criteria-card" style={{ marginBottom: 20 }}>
            <div className="eval-card-header">
              <span className="step2-section-icon">
                <Icon icon={Chart} size={18} />
              </span>
              <h3 className="eval-card-header__title">Resultado de la evaluación</h3>
            </div>

            {/* 3 Métricas KPI side-by-side */}
            <div className="step2-kpi-grid">
              {/* Score preliminar */}
              <div className="step2-kpi-box">
                <div className="step2-kpi-icon-wrap step2-kpi-icon--pink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" fill="#db2777" />
                  </svg>
                </div>
                <div className="step2-kpi-label">Score preliminar</div>
                <div className="step2-kpi-value">{score}/100</div>
              </div>

              {/* Prioridad sugerida */}
              <div className="step2-kpi-box">
                <div className="step2-kpi-icon-wrap step2-kpi-icon--pink">
                  <Icon icon={Chart} size={16} />
                </div>
                <div className="step2-kpi-label">Prioridad sugerida</div>
                <div>
                  <span className="step2-pill step2-pill--pink">{suggestedPriority}</span>
                </div>
              </div>

              {/* Confianza de evaluación */}
              <div className="step2-kpi-box">
                <div className="step2-kpi-icon-wrap step2-kpi-icon--amber">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="step2-kpi-label">Confianza de evaluación</div>
                <div>
                  <span className="step2-pill step2-pill--amber">{confianza}</span>
                </div>
              </div>
            </div>

            {/* Lectura ejecutiva */}
            <div className="step2-lectura-box">
              <div className="step2-lectura-header">
                <Icon icon={FileIcon} size={16} />
                <span className="step2-lectura-title">Lectura ejecutiva</span>
              </div>
              <ul className="step2-lectura-list">
                {lecturaBullets.map((bullet, idx) => (
                  <li key={idx}>
                    <span className="step2-bullet-dot" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card: Resumen del análisis */}
          <div className="eval-criteria-card" style={{ marginBottom: 20 }}>
            <div className="eval-card-header">
              <span className="step2-section-icon">
                <Icon icon={Chart} size={18} />
              </span>
              <div>
                <h3 className="eval-card-header__title">Resumen del análisis</h3>
                <p className="eval-card-header__subtitle">
                  Calificación final por criterio con base en la evaluación realizada.
                </p>
              </div>
            </div>

            <div className="step2-table-wrapper">
              <table className="step2-analysis-table">
                <thead>
                  <tr>
                    <th style={{ width: "42%" }}>Criterio</th>
                    <th style={{ width: "18%" }}>Calificación</th>
                    <th style={{ width: "15%" }}>Peso</th>
                    <th style={{ width: "25%" }}>Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {criteriosList.map((crit) => {
                    const percent = (crit.val / crit.max) * 100;
                    return (
                      <tr key={crit.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className="step2-num-badge">{crit.id}</span>
                            <span className="step2-crit-name">{crit.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="step2-crit-score">{crit.val} / {crit.max}</span>
                        </td>
                        <td>
                          <span className="step2-crit-peso">{crit.peso}</span>
                        </td>
                        <td>
                          <div className="step2-meter-track">
                            <div
                              className="step2-meter-fill"
                              style={{ width: `${percent}%` }}
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
          <div className="step2-suggested-card">
            <div className="step2-suggested-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v1h8v-1c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
              </svg>
            </div>
            <div>
              <div className="step2-suggested-title">Siguiente paso sugerido</div>
              <div className="step2-suggested-text">
                Integrar la iniciativa a la bandeja de priorización del portafolio para compararla contra el resto de iniciativas activas.
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMNA DERECHA: DECISIÓN DEL PORTFOLIO MANAGER               */}
        {/* ============================================================== */}
        <div className="step2-col-right">
          <div className="eval-criteria-card">
            <div className="eval-card-header">
              <span className="step2-section-icon">
                <Icon icon={Person} size={18} />
              </span>
              <div>
                <h3 className="eval-card-header__title">Decisión del Portfolio Manager</h3>
                <p className="eval-card-header__subtitle">
                  Selecciona la decisión final para esta iniciativa.
                </p>
              </div>
            </div>

            {/* Opciones de decisión (Radio cards) */}
            <div className="step2-decision-list">
              {/* Opción 1: Priorizar */}
              <div
                className={`step2-decision-card ${decision === "priorizar" ? "step2-decision-card--active" : ""}`}
                onClick={() => handleSelectDecision("priorizar")}
              >
                <div className="step2-radio-circle">
                  {decision === "priorizar" && <div className="step2-radio-dot" />}
                </div>
                <div className="step2-decision-icon-wrap" style={{ color: "#db2777" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4.5c1.26-1.28 3-1.5 3-1.5" />
                    <path d="M15 9V4s3.03.55 4.5 2c1.28 1.26 1.5 3 1.5 3" />
                  </svg>
                </div>
                <div className="step2-decision-content">
                  <div className="step2-decision-title">Priorizar</div>
                  <div className="step2-decision-desc">
                    Incluir la iniciativa en el portafolio y pasar a la siguiente etapa.
                  </div>
                </div>
              </div>

              {/* Opción 2: Mantener en observación */}
              <div
                className={`step2-decision-card ${decision === "observacion" ? "step2-decision-card--active" : ""}`}
                onClick={() => handleSelectDecision("observacion")}
              >
                <div className="step2-radio-circle">
                  {decision === "observacion" && <div className="step2-radio-dot" />}
                </div>
                <div className="step2-decision-icon-wrap" style={{ color: "#4b5563" }}>
                  <Icon icon={Show} size={18} />
                </div>
                <div className="step2-decision-content">
                  <div className="step2-decision-title">Mantener en observación</div>
                  <div className="step2-decision-desc">
                    Conservar la iniciativa para una futura revisión.
                  </div>
                </div>
              </div>

              {/* Opción 3: Solicitar ajustes */}
              <div
                className={`step2-decision-card ${decision === "ajustes" ? "step2-decision-card--active" : ""}`}
                onClick={() => handleSelectDecision("ajustes")}
              >
                <div className="step2-radio-circle">
                  {decision === "ajustes" && <div className="step2-radio-dot" />}
                </div>
                <div className="step2-decision-icon-wrap" style={{ color: "#4b5563" }}>
                  <Icon icon={Edit} size={18} />
                </div>
                <div className="step2-decision-content">
                  <div className="step2-decision-title">Solicitar ajustes</div>
                  <div className="step2-decision-desc">
                    Regresar la iniciativa al solicitante para mayor información.
                  </div>
                </div>
              </div>

              {/* Opción 4: Descartar */}
              <div
                className={`step2-decision-card ${decision === "descartar" ? "step2-decision-card--active" : ""}`}
                onClick={() => handleSelectDecision("descartar")}
              >
                <div className="step2-radio-circle">
                  {decision === "descartar" && <div className="step2-radio-dot" />}
                </div>
                <div className="step2-decision-icon-wrap" style={{ color: "#db2777" }}>
                  <Icon icon={Delete} size={18} />
                </div>
                <div className="step2-decision-content">
                  <div className="step2-decision-title">Descartar</div>
                  <div className="step2-decision-desc">
                    No continuar con la iniciativa en el portafolio actual.
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de Prioridad Final y Justificación */}
            <div className="step2-form-fields">
              {/* Prioridad final (Segmented control) */}
              <div className="step2-field-group">
                <label className="step2-field-label">Prioridad final</label>
                <div className="step2-segment-control">
                  {(["Alta", "Media", "Baja"] as const).map((p) => {
                    const isSelected = prioridadFinal === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`step2-segment-btn ${isSelected ? "step2-segment-btn--active" : ""}`}
                        onClick={() => setPrioridadFinal(p)}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Justificación de decisión */}
              <div className="step2-field-group">
                <label className="step2-field-label">Justificación de decisión</label>
                <textarea
                  className="step2-textarea"
                  value={justificacion}
                  maxLength={500}
                  onChange={(e) => setJustificacion(e.target.value)}
                  rows={3}
                  placeholder="Explica el motivo de la decisión y consideraciones clave..."
                />
                <div className="step2-char-counter">{justificacion.length}/500</div>
              </div>

              {/* Destino */}
              <div className="step2-field-group">
                <label className="step2-field-label">Destino</label>
                <div className="step2-select-wrapper">
                  <select
                    className="step2-select"
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
            <div className="step2-impact-section">
              <div className="step2-impact-header">
                <Icon icon={Chart} size={16} />
                <span className="step2-impact-title">Impacto de la decisión</span>
              </div>
              <ul className="step2-impact-list">
                {impactoBullets.map((bullet, idx) => (
                  <li key={idx}>
                    <span className="step2-check-circle">
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
      <div className="eval-bottom-bar">
        <div />

        <div className="eval-bottom-bar__right">
          <Link
            href={`/priorizacion/evaluacion?id=${initiative.id}`}
            className="eval-btn-outline-pink"
            style={{ textDecoration: "none" }}
          >
            Volver a evaluación
          </Link>
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
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Cargando confirmación de prioridad...</div>}>
      <ConfirmacionContent />
    </Suspense>
  );
}
