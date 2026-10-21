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
  accentColor: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Clipboard;
}[] = [
  {
    id: "Priorización",
    step: 1,
    title: "Priorización",
    subtitle: "Evaluación y score",
    accentColor: "#b52670",
    bgColor: "#fdf5f9",
    borderColor: "#f3c5de",
    icon: Clipboard,
  },
  {
    id: "Estimación",
    step: 2,
    title: "Estimación",
    subtitle: "Sizing y VoBo TI",
    accentColor: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    icon: Timeline,
  },
  {
    id: "Autorización",
    step: 3,
    title: "Autorización",
    subtitle: "Dictamen y presupuesto",
    accentColor: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    icon: Security,
  },
  {
    id: "Formalización",
    step: 4,
    title: "Formalización",
    subtitle: "Contratos y planeación",
    accentColor: "#0284c7",
    bgColor: "#f0f9ff",
    borderColor: "#bae6fd",
    icon: FileIcon,
  },
  {
    id: "Ejecución",
    step: 5,
    title: "Ejecución",
    subtitle: "Desarrollo y entrega",
    accentColor: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    icon: Play,
  },
  {
    id: "Cierre",
    step: 6,
    title: "Cierre",
    subtitle: "Valor capturado",
    accentColor: "#1e293b",
    bgColor: "#f1f5f9",
    borderColor: "#cbd5e1",
    icon: Check,
  },
];

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

  const pendingTiCount = useMemo(
    () => initiatives.filter((i) => i.enCarteraPendientes || !i.impactoTIConfirmado).length,
    [initiatives]
  );

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
    () => initiatives.find((item) => item.id === selectedId) || initiatives[0],
    [initiatives, selectedId]
  );

  const selectedIndex = useMemo(
    () => initiatives.findIndex((item) => item.id === selectedId),
    [initiatives, selectedId]
  );

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedId(initiatives[selectedIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedIndex < initiatives.length - 1) {
      setSelectedId(initiatives[selectedIndex + 1].id);
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
        return <span className="prio-status-pill prio-status-pill--pink">Nueva</span>;
      case "En revisión":
        return <span className="prio-status-pill prio-status-pill--amber">En revisión</span>;
      case "Lista":
        return <span className="prio-status-pill prio-status-pill--cyan">Lista</span>;
      case "Con comentarios":
        return <span className="prio-status-pill prio-status-pill--purple">Con comentarios</span>;
      case "En priorización":
        return <span className="prio-status-pill prio-status-pill--blue">En priorización</span>;
      case "Descartada":
        return <span className="prio-status-pill prio-status-pill--gray">Descartada</span>;
    }
  };

  const getPriorityBadge = (priority: InitiativeItem["priority"]) => {
    if (!priority) return <span style={{ color: "#9ca3af" }}>-</span>;
    if (priority === "Alta") {
      return <span className="prio-priority-pill prio-priority-pill--high">Alta</span>;
    }
    return <span className="prio-priority-pill prio-priority-pill--med">Media</span>;
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <span style={{ color: "#9ca3af" }}>-</span>;
    if (score >= 80) return <span className="prio-score-badge prio-score-badge--green">{score}</span>;
    if (score >= 70) return <span className="prio-score-badge prio-score-badge--teal">{score}</span>;
    return <span className="prio-score-badge prio-score-badge--amber">{score}</span>;
  };

  return (
    <div className="prio-page-container">
      {/* Toast Notification */}
      {notification && (
        <div className="prio-toast">
          <Icon icon={Check} size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. ENCABEZADO DE VISTA (Sin Breadcrumb y sin botones de Formalizar/Exportar) */}
      <div className="prio-header">
        <div>
          <h1 className="prio-header__title">Iniciativas del Portafolio</h1>
          <p className="prio-header__subtitle">
            Visualiza y da seguimiento a todas las iniciativas del portafolio a través de sus 6 etapas.
          </p>
        </div>
      </div>

      {/* Banner de Alerta si hay iniciativas pendientes en Cartera de Pendientes TI */}
      {pendingTiCount > 0 && (
        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #fde68a",
            color: "#92400e",
            borderRadius: 8,
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            fontSize: 12.5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon icon={Alert} size={16} />
            <span>
              Hay <strong>{pendingTiCount}</strong> iniciativas pendientes de validación tecnológica en la Cartera de Pendientes.
            </span>
          </div>
          <Link href="/backlog" style={{ color: "#b45309", fontWeight: 700, textDecoration: "underline" }}>
            Validar en Backlog TI →
          </Link>
        </div>
      )}

      {/* Selector de Cartera de Negocio Independiente */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid var(--color-border)",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
            Cartera de Negocio:
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {CARTERAS.map((c) => (
              <button
                key={c}
                type="button"
                className={`tag-pill ${selectedCartera === c ? "tag-pill--purple" : "tag-pill--gray"}`}
                style={{ cursor: "pointer", fontWeight: selectedCartera === c ? 700 : 500 }}
                onClick={() => setSelectedCartera(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: "#64748b" }}>
          Mostrando <strong>{filteredInitiatives.length}</strong> iniciativas en etapa{" "}
          <strong>{selectedStage}</strong> ({selectedCartera})
        </div>
      </div>

      {/* 2. FILTROS POR LOS 6 STAGES DE UNA INICIATIVA */}
      <div className="prio-stage-grid">
        {STAGES_CONFIG.map((stage) => {
          const isActive = selectedStage === stage.id;
          const count = stageCounts[stage.id] ?? 0;
          return (
            <button
              key={stage.id}
              type="button"
              className={`prio-kpi-card ${isActive ? "prio-kpi-card--stage-active" : ""}`}
              style={
                isActive
                  ? {
                      borderColor: stage.accentColor,
                      backgroundColor: stage.bgColor,
                      boxShadow: `0 6px 18px ${stage.accentColor}22`,
                      textAlign: "left",
                    }
                  : { textAlign: "left" }
              }
              onClick={() => setSelectedStage(stage.id)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div
                  className="prio-kpi-card__badge-icon"
                  style={{
                    background: isActive ? stage.accentColor : stage.bgColor,
                    color: isActive ? "#ffffff" : stage.accentColor,
                    border: `1px solid ${stage.borderColor}`,
                  }}
                >
                  <Icon icon={stage.icon} size={16} />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: stage.accentColor,
                    background: "#ffffff",
                    border: `1px solid ${stage.borderColor}`,
                    borderRadius: 999,
                    padding: "2px 8px",
                  }}
                >
                  Etapa {stage.step}
                </span>
              </div>

              <div className="prio-kpi-card__big-value" style={{ marginTop: 10, fontSize: 30 }}>
                {count}
              </div>

              <div>
                <div
                  className="prio-kpi-card__title-normal"
                  style={{ color: isActive ? stage.accentColor : "#1e293b" }}
                >
                  {stage.title}
                </div>
                <div className="prio-kpi-card__sub-normal">{stage.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. BANDEJA CENTRAL (Tabla izquierda + Detalle derecho) */}
      <div className="prio-main-split">
        {/* COLUMNA IZQUIERDA: TABLA DE INICIATIVAS (Sin columna orden, sin reordenamiento, sin tabs ni buscador) */}
        <div className="prio-table-panel">
          <div className="prio-table-wrapper">
            <table className="prio-table">
              <thead>
                <tr>
                  <th style={{ width: "34%" }}>Iniciativa</th>
                  <th style={{ width: "20%" }}>Área</th>
                  <th style={{ width: "14%" }}>Estado</th>
                  <th style={{ width: "9%" }}>Score</th>
                  <th style={{ width: "10%" }}>Prioridad</th>
                  <th style={{ width: "13%", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredInitiatives.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "48px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                          }}
                        >
                          <Icon icon={FileIcon} size={22} />
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
                          No hay iniciativas en la etapa {selectedStage}
                        </div>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0, maxWidth: 360, lineHeight: 1.4 }}>
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
                        className={`prio-row ${isSelected ? "prio-row--selected" : ""}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td>
                          <div className="prio-initiative-name">{item.name}</div>
                        </td>
                        <td>
                          <div className="prio-initiative-area">{item.cartera || item.area}</div>
                        </td>
                        <td>{getStatusBadge(item.status)}</td>
                        <td>{getScoreBadge(item.score)}</td>
                        <td>{getPriorityBadge(item.priority)}</td>
                        <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <button
                              type="button"
                              className="prio-btn-ver"
                              onClick={() => setSelectedId(item.id)}
                            >
                              Previsualizar
                            </button>
                            <Link
                              href={`/iniciativas/evaluacion?id=${item.id}`}
                              className="prio-btn-dots"
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

        {/* COLUMNA DERECHA: RESUMEN DE DISCOVERY Y EVALUACIÓN */}
        <div className="prio-detail-panel">
          {/* Header del detalle con paginador */}
          <div className="prio-detail-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {getStatusBadge(selectedInitiative.status)}
            </div>
            <div className="prio-detail-nav">
              <button
                type="button"
                className="prio-detail-nav-btn"
                disabled={selectedIndex === 0}
                onClick={handlePrev}
                aria-label="Iniciativa anterior"
              >
                <Icon icon={NavigationChevronLeft} size={14} />
              </button>
              <button
                type="button"
                className="prio-detail-nav-btn"
                disabled={selectedIndex === initiatives.length - 1}
                onClick={handleNext}
                aria-label="Siguiente iniciativa"
              >
                <Icon icon={NavigationChevronRight} size={14} />
              </button>
            </div>
          </div>

          <h2 className="prio-detail-title">{selectedInitiative.name}</h2>
          <div className="prio-detail-area">
            <Icon icon={Person} size={14} />
            <span>{selectedInitiative.area}</span>
          </div>

          {/* Tabs del detalle */}
          <div className="prio-detail-tabs">
            <button
              type="button"
              className={`prio-detail-tab ${activeDetailTab === "resumen" ? "prio-detail-tab--active" : ""}`}
              onClick={() => setActiveDetailTab("resumen")}
            >
              Resumen
            </button>
            <button
              type="button"
              className={`prio-detail-tab ${activeDetailTab === "discovery" ? "prio-detail-tab--active" : ""}`}
              onClick={() => setActiveDetailTab("discovery")}
            >
              Discovery
            </button>
            <button
              type="button"
              className={`prio-detail-tab ${activeDetailTab === "evaluacion" ? "prio-detail-tab--active" : ""}`}
              onClick={() => setActiveDetailTab("evaluacion")}
            >
              Evaluación
            </button>
            <button
              type="button"
              className={`prio-detail-tab ${activeDetailTab === "comentarios" ? "prio-detail-tab--active" : ""}`}
              onClick={() => setActiveDetailTab("comentarios")}
            >
              Comentarios
            </button>
          </div>

          {/* Contenido del Tab seleccionado */}
          <div className="prio-detail-body">
            {activeDetailTab === "resumen" && (
              <>
                <div className="prio-section-label">Descripción</div>
                <p className="prio-detail-desc">{selectedInitiative.description}</p>

                {/* Grid de 2x2 metadatos */}
                <div className="prio-meta-grid">
                  <div className="prio-meta-item">
                    <div className="prio-meta-label">
                      <Icon icon={Person} size={14} />
                      <span>Solicitante</span>
                    </div>
                    <div className="prio-meta-val">{selectedInitiative.solicitante}</div>
                  </div>

                  <div className="prio-meta-item">
                    <div className="prio-meta-label">
                      <Icon icon={Timeline} size={14} />
                      <span>Fecha de creación</span>
                    </div>
                    <div className="prio-meta-val">{selectedInitiative.creationDate}</div>
                  </div>

                  <div className="prio-meta-item">
                    <div className="prio-meta-label">
                      <Icon icon={Settings} size={14} />
                      <span>Impacto TI</span>
                    </div>
                    <div className="prio-meta-val">{selectedInitiative.impactoTI}</div>
                  </div>

                  <div className="prio-meta-item">
                    <div className="prio-meta-label">
                      <span style={{ fontWeight: 800 }}>$</span>
                      <span>Beneficio estimado</span>
                    </div>
                    <div className="prio-meta-val prio-meta-val--highlight">
                      {selectedInitiative.beneficioEstimado}
                    </div>
                  </div>
                </div>

                {/* Estado y Madurez */}
                <div className="prio-meta-grid" style={{ marginTop: 14 }}>
                  <div>
                    <div className="prio-meta-label">Estado actual</div>
                    <div style={{ marginTop: 4 }}>{getStatusBadge(selectedInitiative.status)}</div>
                  </div>

                  <div>
                    <div className="prio-meta-label">
                      <span>Madurez</span>
                      <span style={{ marginLeft: "auto", fontWeight: 700, color: "#1e2022" }}>
                        {selectedInitiative.madurez}%
                      </span>
                    </div>
                    <div className="prio-progress-track">
                      <div
                        className="prio-progress-fill"
                        style={{ width: `${selectedInitiative.madurez}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Botón CTA: Iniciar evaluación */}
                <div style={{ marginTop: 20 }}>
                  <Link
                    href={`/iniciativas/evaluacion?id=${selectedInitiative.id}`}
                    className="prio-btn-eval-cta"
                    style={{ textDecoration: "none" }}
                  >
                    <span>
                      {selectedInitiative.score === null
                        ? "Iniciar evaluación"
                        : "Re-evaluar iniciativa"}
                    </span>
                    <Icon icon={NavigationChevronRight} size={16} />
                  </Link>
                </div>
              </>
            )}

            {activeDetailTab === "discovery" && (
              <div className="prio-discovery-tab">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div className="prio-section-label" style={{ margin: 0 }}>Ficha Canvas de Discovery</div>
                  <span className="disc-status-pill disc-status-pill--complete" style={{ fontSize: 10.5 }}>
                    ✓ Discovery completo
                  </span>
                </div>

                <div className="prio-discovery-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Gobierno / Dirección:</span>
                    <span className="prio-discovery-val">
                      {selectedInitiative.direccionNegocio || selectedInitiative.area} ·{" "}
                      {selectedInitiative.oficinaArea || "Oficina Central"}
                    </span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">PMO / Portfolio Mgr:</span>
                    <span className="prio-discovery-val">
                      {selectedInitiative.pmoResponsable || "EPL"} ·{" "}
                      {selectedInitiative.portafolioManager ||
                        selectedInitiative.sponsor ||
                        "AL UBAMARI MALINALLI MORENO MERAZ"}
                    </span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Alineación piramidal:</span>
                    <span className="prio-discovery-val" style={{ color: "#db2777", fontWeight: 700 }}>
                      {selectedInitiative.alineacionEstrategicaNivel || "(N2) Habilitadores/Regulatorios"}
                    </span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Impacto Tecnología:</span>
                    <span className="prio-discovery-val">{selectedInitiative.impactoTI}</span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Dimensiones:</span>
                    <span className="prio-discovery-val">
                      {selectedInitiative.dimensionesImpacto?.length
                        ? selectedInitiative.dimensionesImpacto.join(", ")
                        : "Tecnología, Procesos"}
                    </span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Sistemas involucrados:</span>
                    <span className="prio-discovery-val">
                      {selectedInitiative.sistemasInvolucrados?.join(", ") || "SAP ERP, BigQuery"}
                    </span>
                  </div>
                  {selectedInitiative.okrs && selectedInitiative.okrs.length > 0 && (
                    <div className="prio-discovery-row" style={{ alignItems: "flex-start" }}>
                      <span className="prio-discovery-key">OKRs Clave:</span>
                      <span className="prio-discovery-val" style={{ fontSize: 11.5 }}>
                        {selectedInitiative.okrs[0].objetivo} → {selectedInitiative.okrs[0].resultadoClave}
                      </span>
                    </div>
                  )}
                  {selectedInitiative.roiData && (
                    <div className="prio-discovery-row">
                      <span className="prio-discovery-key">ROI Estimado:</span>
                      <span className="prio-discovery-val" style={{ color: "#15803d", fontWeight: 700 }}>
                        +{selectedInitiative.roiData.roiPorcentaje || 210}% (Payback ~
                        {selectedInitiative.roiData.paybackMeses || 3.8} meses)
                      </span>
                    </div>
                  )}
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Asistente IA:</span>
                    <span className="prio-discovery-val">DataSwat Copilot (Fase 1 Discovery Completada)</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <Link
                    href="/discovery"
                    className="prio-btn-link"
                    style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                  >
                    <span>Abrir nuevo Discovery asistido por IA →</span>
                  </Link>
                </div>
              </div>
            )}

            {activeDetailTab === "evaluacion" && (
              <div className="prio-eval-tab">
                {selectedInitiative.score ? (
                  <div>
                    <div className="prio-score-summary-box">
                      <div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Score obtenido</div>
                        <div style={{ fontSize: 32, fontWeight: 800, color: "var(--brand-primary)" }}>
                          {selectedInitiative.score}
                          <span style={{ fontSize: 16, color: "#9ca3af", fontWeight: 500 }}>/100</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>Prioridad preliminar</div>
                        <div style={{ marginTop: 4 }}>
                          {getPriorityBadge(selectedInitiative.priority)}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <div className="prio-section-label">Desglose de calificaciones</div>
                      <div className="prio-breakdown-list">
                        <div className="prio-breakdown-row">
                          <span>Impacto al negocio (30%)</span>
                          <b>{selectedInitiative.evaluacion?.impactoNegocio ?? 8}/10</b>
                        </div>
                        <div className="prio-breakdown-row">
                          <span>Alineación estratégica (25%)</span>
                          <b>{selectedInitiative.evaluacion?.alineacionEstrategica ?? 8}/10</b>
                        </div>
                        <div className="prio-breakdown-row">
                          <span>Urgencia / oportunidad (15%)</span>
                          <b>{selectedInitiative.evaluacion?.urgencia ?? 7}/10</b>
                        </div>
                        <div className="prio-breakdown-row">
                          <span>Esfuerzo estimado (15%)</span>
                          <b>{selectedInitiative.evaluacion?.esfuerzoEstimado ?? 7}/10</b>
                        </div>
                        <div className="prio-breakdown-row">
                          <span>Riesgos y dependencias (15%)</span>
                          <b>{selectedInitiative.evaluacion?.riesgos ?? 8}/10</b>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "30px 10px" }}>
                    <div style={{ color: "#9ca3af", marginBottom: 10 }}>
                      <Icon icon={CheckList} size={36} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                      Esta iniciativa aún no ha sido evaluada
                    </div>
                    <p style={{ fontSize: 12.5, color: "#6b7280", margin: "6px 0 16px 0" }}>
                      Evalúa los criterios de impacto, alineación y complejidad para asignarle score y prioridad.
                    </p>
                    <Link
                      href={`/iniciativas/evaluacion?id=${selectedInitiative.id}`}
                      className="prio-btn-eval-cta"
                      style={{ textDecoration: "none" }}
                    >
                      <span>Iniciar evaluación ahora</span>
                      <Icon icon={NavigationChevronRight} size={16} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeDetailTab === "comentarios" && (
              <div className="prio-comments-tab">
                <div className="prio-comment-box">
                  <div className="prio-comment-author">
                    <b>Mariana Solís</b> (Portfolio Manager) · Hace 2 días
                  </div>
                  <div className="prio-comment-text">
                    Iniciativa registrada con caso de negocio inicial. Falta afinar la estimación de licencias de pasarelas de pago.
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <textarea
                    className="prio-comment-input"
                    placeholder="Escribe un comentario o solicitud de ajuste..."
                    rows={3}
                  />
                  <button
                    type="button"
                    className="prio-btn-export"
                    style={{ marginTop: 8 }}
                    onClick={() => showNotification("Comentario registrado")}
                  >
                    <Icon icon={Comment} size={14} />
                    <span>Agregar comentario</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. SECCIÓN INFERIOR: TOMA DE DECISIONES DEL PORTAFOLIO */}
      <div className="prio-bottom-grid">
        {/* BLOQUE 1: MATRIZ DE PRIORIDAD (2x2 Cuadrantes) */}
        <div className="prio-bottom-card">
          <div className="prio-bottom-card__header">
            <div className="prio-bottom-card__title">
              <Icon icon={CheckList} size={17} />
              <span>Matriz de Prioridad</span>
            </div>
            <span style={{ fontSize: 11.5, color: "#6b7280" }}>
              Haz clic en cualquier punto para seleccionarla
            </span>
          </div>

          <div className="prio-matrix-wrapper">
            {/* Eje Y Label */}
            <div className="prio-matrix-y-label">
              <span>Alto</span>
              <span className="prio-matrix-y-axis-title">Impacto a negocio</span>
              <span>Bajo</span>
            </div>

            <div className="prio-matrix-grid-container">
              {/* 4 Cuadrantes */}
              <div className="prio-matrix-quadrant prio-matrix-quadrant--quickwins">
                <div className="prio-quadrant-tag">
                  <b>Quick wins</b> (Hacer ahora)
                </div>
              </div>

              <div className="prio-matrix-quadrant prio-matrix-quadrant--strategic">
                <div className="prio-quadrant-tag">
                  <b>Estratégicas</b> (Planear)
                </div>
              </div>

              <div className="prio-matrix-quadrant prio-matrix-quadrant--lowval">
                <div className="prio-quadrant-tag">
                  <b>Bajo valor</b> (Evaluar)
                </div>
              </div>

              <div className="prio-matrix-quadrant prio-matrix-quadrant--tactical">
                <div className="prio-quadrant-tag">
                  <b>Tácticas</b> (Revisar)
                </div>
              </div>

              {/* Puntos de iniciativas sobre la matriz */}
              {initiatives.map((item) => {
                const isSelected = item.id === selectedId;
                const leftPos = 10 + (item.esfuerzo / 100) * 78;
                const bottomPos = 10 + (item.impacto / 100) * 78;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`prio-matrix-point ${isSelected ? "prio-matrix-point--selected" : ""}`}
                    style={{
                      left: `${leftPos}%`,
                      bottom: `${bottomPos}%`,
                      backgroundColor: item.color,
                    }}
                    onClick={() => setSelectedId(item.id)}
                    title={`${item.name} (${item.area}) - Score: ${item.score ?? "Sin evaluar"}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Eje X Label */}
          <div className="prio-matrix-x-label">
            <span>Bajo</span>
            <span className="prio-matrix-x-axis-title">Esfuerzo estimado</span>
            <span>Alto</span>
          </div>
        </div>

        {/* BLOQUE 2: CRITERIOS DE EVALUACIÓN (PESOS) */}
        <div className="prio-bottom-card">
          <div className="prio-bottom-card__header">
            <div className="prio-bottom-card__title">
              <Icon icon={Settings} size={17} />
              <span>Criterios de evaluación (pesos)</span>
            </div>
            <button
              type="button"
              className="prio-btn-link"
              onClick={() => showNotification("Metodología: ponderación multicriterio homologada")}
            >
              Ver metodología →
            </button>
          </div>

          <div className="prio-criteria-list">
            <div className="prio-criteria-item">
              <span className="prio-criteria-num">1</span>
              <span className="prio-criteria-name">Impacto al negocio</span>
              <div className="prio-criteria-bar-track">
                <div className="prio-criteria-bar-fill" style={{ width: "30%" }} />
              </div>
              <span className="prio-criteria-pct">30%</span>
            </div>

            <div className="prio-criteria-item">
              <span className="prio-criteria-num">2</span>
              <span className="prio-criteria-name">Alineación estratégica</span>
              <div className="prio-criteria-bar-track">
                <div className="prio-criteria-bar-fill" style={{ width: "25%" }} />
              </div>
              <span className="prio-criteria-pct">25%</span>
            </div>

            <div className="prio-criteria-item">
              <span className="prio-criteria-num">3</span>
              <span className="prio-criteria-name">Urgencia / oportunidad</span>
              <div className="prio-criteria-bar-track">
                <div className="prio-criteria-bar-fill" style={{ width: "15%" }} />
              </div>
              <span className="prio-criteria-pct">15%</span>
            </div>

            <div className="prio-criteria-item">
              <span className="prio-criteria-num">4</span>
              <span className="prio-criteria-name">Esfuerzo estimado</span>
              <div className="prio-criteria-bar-track">
                <div className="prio-criteria-bar-fill" style={{ width: "15%" }} />
              </div>
              <span className="prio-criteria-pct">15%</span>
            </div>

            <div className="prio-criteria-item">
              <span className="prio-criteria-num">5</span>
              <span className="prio-criteria-name">Riesgos y dependencias</span>
              <div className="prio-criteria-bar-track">
                <div className="prio-criteria-bar-fill" style={{ width: "15%" }} />
              </div>
              <span className="prio-criteria-pct">15%</span>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: ACCIONES RÁPIDAS Y BANNER LIVERPOOL */}
        <div className="prio-bottom-card prio-bottom-card--actions">
          <div className="prio-quick-actions-col">
            <div className="prio-bottom-card__title" style={{ marginBottom: 10 }}>
              Acciones rápidas
            </div>
            <button
              type="button"
              className="prio-quick-btn prio-quick-btn--primary"
              onClick={handleSendToCommittee}
            >
              <Icon icon={Send} size={15} />
              <span>Enviar a comité</span>
            </button>
            <button
              type="button"
              className="prio-quick-btn"
              onClick={handleRequestAdjustments}
            >
              <Icon icon={Comment} size={15} />
              <span>Solicitar ajustes</span>
            </button>
            <button
              type="button"
              className="prio-quick-btn prio-quick-btn--danger"
              onClick={handleDiscard}
            >
              <Icon icon={Delete} size={15} />
              <span>Descartar</span>
            </button>
          </div>

          <div className="prio-liverpool-banner">
            <div className="prio-liverpool-tip">
              <span className="prio-liverpool-bulb">💡</span>
              <span>
                Evalúa la información disponible y asigna un score para incluir la iniciativa en la priorización.
              </span>
            </div>

            <div className="prio-liverpool-quote">
              &quot;Priorizar ideas hoy, para los resultados de mañana.&quot;
            </div>

            <div className="prio-liverpool-brand">
              <img
                src="/icon.png"
                alt="Liverpool"
                width={26}
                height={26}
                style={{ borderRadius: 4, display: "inline-block" }}
              />
              <span style={{ fontSize: 18, fontWeight: 800, color: "#e6007e", letterSpacing: -0.5 }}>
                Liverpool
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL INTERACTIVO DE EVALUACIÓN MULTICRITERIO */}
      {isEvalModalOpen && (
        <div className="prio-modal-overlay">
          <div className="prio-modal-card" role="dialog" aria-modal="true">
            <div className="prio-modal-header">
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--brand-primary)", textTransform: "uppercase" }}>
                  Evaluación de Portfolio Manager
                </div>
                <h3 style={{ margin: "2px 0 0 0", fontSize: 18, fontWeight: 700, color: "#1e2022" }}>
                  {selectedInitiative.name}
                </h3>
              </div>
              <button
                type="button"
                className="main-menu-panel__close-btn"
                onClick={() => setIsEvalModalOpen(false)}
                aria-label="Cerrar modal"
              >
                <Icon icon={Close} size={18} />
              </button>
            </div>

            <div className="prio-modal-body">
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px 0" }}>
                Califica cada uno de los 5 criterios de la metodología en una escala de 1 a 10. El score ponderado y la prioridad preliminar se calcularán en tiempo real.
              </p>

              {/* Sliders de evaluación */}
              <div className="prio-slider-group">
                <div className="prio-slider-row">
                  <div className="prio-slider-label">
                    <span>1. Impacto al negocio (Peso 30%)</span>
                    <b>{evalC1}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC1}
                    onChange={(e) => setEvalC1(Number(e.target.value))}
                    className="prio-range"
                  />
                </div>

                <div className="prio-slider-row">
                  <div className="prio-slider-label">
                    <span>2. Alineación estratégica (Peso 25%)</span>
                    <b>{evalC2}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC2}
                    onChange={(e) => setEvalC2(Number(e.target.value))}
                    className="prio-range"
                  />
                </div>

                <div className="prio-slider-row">
                  <div className="prio-slider-label">
                    <span>3. Urgencia / oportunidad (Peso 15%)</span>
                    <b>{evalC3}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC3}
                    onChange={(e) => setEvalC3(Number(e.target.value))}
                    className="prio-range"
                  />
                </div>

                <div className="prio-slider-row">
                  <div className="prio-slider-label">
                    <span>4. Esfuerzo estimado / Factibilidad (Peso 15%)</span>
                    <b>{evalC4}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC4}
                    onChange={(e) => setEvalC4(Number(e.target.value))}
                    className="prio-range"
                  />
                </div>

                <div className="prio-slider-row">
                  <div className="prio-slider-label">
                    <span>5. Riesgos y dependencias (Peso 15%)</span>
                    <b>{evalC5}/10</b>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={evalC5}
                    onChange={(e) => setEvalC5(Number(e.target.value))}
                    className="prio-range"
                  />
                </div>
              </div>

              {/* Preview de Score y Prioridad Calculada */}
              <div className="prio-live-score-card">
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Score Ponderado Calculado</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: "var(--brand-primary)", lineHeight: 1.1 }}>
                    {liveScore}
                    <span style={{ fontSize: 18, color: "#9ca3af", fontWeight: 500 }}>/100</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
                    Prioridad Resultante
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {getPriorityBadge(livePriority)}
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      ({liveScore >= 80 ? "Sugerida para comité" : "Requiere refinamiento"})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prio-modal-footer">
              <button
                type="button"
                className="btn-purple-outline"
                onClick={() => setIsEvalModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-purple-solid"
                style={{ background: "#e6007e", borderColor: "#e6007e" }}
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
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Cargando iniciativas...</div>}>
      <IniciativasContent />
    </Suspense>
  );
}
