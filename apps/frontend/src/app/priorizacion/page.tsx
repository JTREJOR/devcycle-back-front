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
  NavigationChevronRight,
  NavigationChevronLeft,
  Download,
  Search,
  Send,
  Comment,
  Delete,
  Close,
  Timeline,
  Settings,
  MoreActions,
} from "@vibe/icons";
import { usePriorizacionStore, InitiativeItem } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";

function PriorizacionContent() {
  const searchParams = useSearchParams();
  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const selectedId = usePriorizacionStore((s) => s.selectedInitiativeId);
  const setSelectedId = usePriorizacionStore((s) => s.setSelectedInitiativeId);
  const saveEvaluationStore = usePriorizacionStore((s) => s.saveEvaluation);
  const requestAdjustmentsStore = usePriorizacionStore((s) => s.requestAdjustments);
  const discardInitiativeStore = usePriorizacionStore((s) => s.discardInitiative);
  const sendToCommitteeStore = usePriorizacionStore((s) => s.sendToCommittee);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Priorización");
  }, [setActiveMenuTitle]);

  // Si viene con query param ?id=..., sincronizar selección
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && initiatives.some((i) => i.id === idFromUrl)) {
      setSelectedId(idFromUrl);
    }
  }, [searchParams, initiatives, setSelectedId]);

  const [activeTableTab, setActiveTableTab] = useState<"revision" | "priorizacion" | "comite" | "todas">("revision");
  const [activeDetailTab, setActiveDetailTab] = useState<"resumen" | "discovery" | "evaluacion" | "comentarios">("resumen");
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Contadores dinámicos calculados a partir de los datos activos del store
  const countRevision = useMemo(
    () => initiatives.filter((i) => i.status === "Nueva" || i.status === "En revisión" || i.status === "Con comentarios").length,
    [initiatives]
  );
  const countPriorizacion = useMemo(
    () => initiatives.filter((i) => i.status === "En priorización").length,
    [initiatives]
  );
  const countComite = useMemo(
    () => initiatives.filter((i) => i.status === "Lista").length,
    [initiatives]
  );
  const countAprobadas = useMemo(
    () => initiatives.filter((i) => (i.score ?? 0) >= 80).length,
    [initiatives]
  );

  // Estado del modal interactivo de evaluación rápida
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [evalC1, setEvalC1] = useState(4); // Impacto
  const [evalC2, setEvalC2] = useState(5); // Alineación
  const [evalC3, setEvalC3] = useState(4); // Urgencia
  const [evalC4, setEvalC4] = useState(3); // Complejidad
  const [evalC5, setEvalC5] = useState(3); // Riesgos

  const selectedInitiative = useMemo(
    () => initiatives.find((item) => item.id === selectedId) || initiatives[0],
    [initiatives, selectedId],
  );

  const selectedIndex = useMemo(
    () => initiatives.findIndex((item) => item.id === selectedId),
    [initiatives, selectedId],
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

  // Filtrado de tabla
  const filteredInitiatives = useMemo(() => {
    return initiatives.filter((item) => {
      // Filtro de búsqueda
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Filtro de tab
      if (activeTableTab === "revision") {
        return item.status === "Nueva" || item.status === "En revisión" || item.status === "Con comentarios";
      }
      if (activeTableTab === "priorizacion") {
        return item.status === "En priorización" || item.status === "Lista";
      }
      if (activeTableTab === "comite") {
        return item.status === "Lista" && (item.score ?? 0) >= 80;
      }
      return true; // "todas"
    });
  }, [initiatives, activeTableTab, searchQuery]);

  // Cálculos de score en tiempo real en modal
  const liveScore = Math.round(
    (evalC1 * 0.3 + evalC2 * 0.25 + evalC3 * 0.15 + evalC4 * 0.15 + evalC5 * 0.15) * 10,
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

      {/* 1. ENCABEZADO DE VISTA (Imagen 5) */}
      <div className="prio-header">
        <div>
          <div className="prio-breadcrumb">
            <Link href="/" className="prio-breadcrumb__link">Portafolio</Link>
            <span className="prio-breadcrumb__sep">&gt;</span>
            <span className="prio-breadcrumb__current">Revisión y Priorización</span>
          </div>
          <h1 className="prio-header__title">Revisión y Priorización de Iniciativas</h1>
          <p className="prio-header__subtitle">
            Analiza, evalúa y define el orden de atención de las iniciativas del portafolio.
          </p>
        </div>

        <div className="prio-header__right">
          <div className="prio-header__date">Martes, 22 de Septiembre de 2026</div>
          <button
            type="button"
            className="prio-btn-export"
            onClick={() => showNotification("Exportando reporte consolidado de priorización (CSV/PDF)...")}
          >
            <Icon icon={Download} size={15} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* 2. KPIS SUPERIORES (Imagen 5) */}
      <div className="prio-kpi-grid">
        <div className="prio-kpi-card" onClick={() => setActiveTableTab("revision")}>
          <div className="prio-kpi-card__icon" style={{ background: "#fdf2f8", color: "#db2777" }}>
            <Icon icon={FileIcon} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">{countRevision}</div>
            <div className="prio-kpi-card__title">Pendientes de revisión</div>
            <div className="prio-kpi-card__sub">Nuevas propuestas</div>
          </div>
          <div className="prio-kpi-card__chevron">
            <Icon icon={NavigationChevronRight} size={16} />
          </div>
        </div>

        <div className="prio-kpi-card" onClick={() => setActiveTableTab("priorizacion")}>
          <div className="prio-kpi-card__icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <Icon icon={CheckList} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">{countPriorizacion}</div>
            <div className="prio-kpi-card__title">En priorización</div>
            <div className="prio-kpi-card__sub">Con evaluación completa</div>
          </div>
          <div className="prio-kpi-card__chevron">
            <Icon icon={NavigationChevronRight} size={16} />
          </div>
        </div>

        <div className="prio-kpi-card" onClick={() => setActiveTableTab("comite")}>
          <div className="prio-kpi-card__icon" style={{ background: "#f5eef5", color: "#833177" }}>
            <Icon icon={Person} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">{countComite}</div>
            <div className="prio-kpi-card__title">Listas para comité</div>
            <div className="prio-kpi-card__sub">Este mes</div>
          </div>
          <div className="prio-kpi-card__chevron">
            <Icon icon={NavigationChevronRight} size={16} />
          </div>
        </div>

        <div className="prio-kpi-card" onClick={() => setActiveTableTab("todas")}>
          <div className="prio-kpi-card__icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <Icon icon={Check} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">{countAprobadas}</div>
            <div className="prio-kpi-card__title">Aprobadas</div>
            <div className="prio-kpi-card__sub">Este año</div>
          </div>
          <div className="prio-kpi-card__chevron">
            <Icon icon={NavigationChevronRight} size={16} />
          </div>
        </div>
      </div>

      {/* 3. BANDEJA CENTRAL (Tabla izquierda + Detalle derecho) */}
      <div className="prio-main-split">
        {/* COLUMNA IZQUIERDA: TABLA Y PESTAÑAS */}
        <div className="prio-table-panel">
          {/* Pestañas y Buscador */}
          <div className="prio-table-toolbar">
            <div className="prio-tabs">
              <button
                type="button"
                className={`prio-tab ${activeTableTab === "revision" ? "prio-tab--active" : ""}`}
                onClick={() => setActiveTableTab("revision")}
              >
                Revisión ({countRevision})
              </button>
              <button
                type="button"
                className={`prio-tab ${activeTableTab === "priorizacion" ? "prio-tab--active" : ""}`}
                onClick={() => setActiveTableTab("priorizacion")}
              >
                Priorización ({countPriorizacion})
              </button>
              <button
                type="button"
                className={`prio-tab ${activeTableTab === "comite" ? "prio-tab--active" : ""}`}
                onClick={() => setActiveTableTab("comite")}
              >
                Comité ({countComite})
              </button>
              <button
                type="button"
                className={`prio-tab ${activeTableTab === "todas" ? "prio-tab--active" : ""}`}
                onClick={() => setActiveTableTab("todas")}
              >
                Todas ({initiatives.length})
              </button>
            </div>

            <div className="prio-search-box">
              <Icon icon={Search} size={15} />
              <input
                type="text"
                placeholder="Buscar iniciativas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="prio-search-input"
              />
            </div>
          </div>

          {/* Tabla de iniciativas */}
          <div className="prio-table-wrapper">
            <table className="prio-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Iniciativa</th>
                  <th style={{ width: "19%" }}>Área</th>
                  <th style={{ width: "13%" }}>Estado</th>
                  <th style={{ width: "8%" }}>Score</th>
                  <th style={{ width: "9%" }}>Prioridad</th>
                  <th style={{ width: "10%" }}>Fecha creación ↕</th>
                  <th style={{ width: "11%", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredInitiatives.map((item) => {
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
                        <div className="prio-initiative-area">{item.area}</div>
                      </td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>{getScoreBadge(item.score)}</td>
                      <td>{getPriorityBadge(item.priority)}</td>
                      <td>
                        <div className="prio-initiative-date">{item.creationDate}</div>
                      </td>
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
                            href={`/priorizacion/evaluacion?id=${item.id}`}
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
                })}
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
                    href={`/priorizacion/evaluacion?id=${selectedInitiative.id}`}
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
                <div className="prio-section-label">Ficha del descubrimiento guiado</div>
                <div className="prio-discovery-card">
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Unidad de Negocio:</span>
                    <span className="prio-discovery-val">{selectedInitiative.area}</span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Alineación estratégica:</span>
                    <span className="prio-discovery-val">Eficiencia operativa y omnicanalidad</span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Sistemas involucrados:</span>
                    <span className="prio-discovery-val">SAP Central, BigQuery, Portal Web</span>
                  </div>
                  <div className="prio-discovery-row">
                    <span className="prio-discovery-key">Asistente IA utilizado:</span>
                    <span className="prio-discovery-val">DataSwat Copilot (Fase 1 completada)</span>
                  </div>
                </div>
                <Link
                  href="/discovery"
                  className="prio-btn-link"
                  style={{ marginTop: 12, display: "inline-flex" }}
                >
                  <span>Ver flujo de descubrimiento completo →</span>
                </Link>
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
                      href={`/priorizacion/evaluacion?id=${selectedInitiative.id}`}
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
                // Eje X: esfuerzo (0..100) -> left: 10% .. 90%
                // Eje Y: impacto (0..100) -> bottom: 10% .. 90%
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
            <div className="prio-bottom-card__title" style={{ marginBottom: 14 }}>
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

export default function PriorizacionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Cargando priorización...</div>}>
      <PriorizacionContent />
    </Suspense>
  );
}
