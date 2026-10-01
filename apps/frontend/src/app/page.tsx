"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@vibe/core";
import {
  Sun,
  Calendar,
  Check,
  CheckList,
  Bolt,
  Alert,
  Time,
  NavigationChevronRight,
  File as FileIcon,
  Timeline,
  Show,
  Settings,
  Play,
  Info,
} from "@vibe/icons";
import { usePriorizacionStore, getMacroStage } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";

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
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);

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

  // Conteo de iniciativas en las 4 etapas macro acordadas
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
  const pctEje = Math.round((countStage3_Ejecucion / totalInitiatives) * 100);
  const pctCie = Math.round((countStage4_Cierre / totalInitiatives) * 100);

  // Lista prioritaria filtrada por etapa y cartera
  const displayedInitiatives = useMemo(() => {
    if (selectedStageFilter) {
      return initiativesInCartera.filter((i) => getMacroStage(i.etapaCiclo) === selectedStageFilter);
    }
    return initiativesInCartera.slice(0, 6);
  }, [initiativesInCartera, selectedStageFilter]);

  const getEtapaPill = (etapa?: string) => {
    const macro = getMacroStage(etapa);
    switch (macro) {
      case "Definición":
        return <span className="prio-stage-pill prio-stage-pill--prio">1. Definición</span>;
      case "Estimación":
        return <span className="prio-stage-pill prio-stage-pill--est">2. Estimación</span>;
      case "Ejecución":
        return <span className="prio-stage-pill prio-stage-pill--eje">3. Ejecución</span>;
      case "Cierre":
        return <span className="prio-stage-pill prio-stage-pill--cie">4. Cierre</span>;
    }
  };

  const getEstadoPill = (estado?: string, statusFallback?: string) => {
    const st = estado || statusFallback || "Por iniciar";
    if (st === "Nueva" || st === "Por revisar" || st === "Por iniciar") {
      return <span className="prio-estado-pill prio-estado-pill--purple">Por iniciar</span>;
    }
    if (st === "En priorización" || st === "En revisión" || st === "En ejecución" || st === "En proceso" || st === "En curso") {
      return <span className="prio-estado-pill prio-estado-pill--blue">En curso</span>;
    }
    if (st === "Lista" || st === "Aprobada" || st === "Finalizado" || st === "Cerrada") {
      return <span className="prio-estado-pill prio-estado-pill--green">Finalizado</span>;
    }
    if (st === "Con comentarios" || st === "Atrasado" || st === "Ajustes solicitados") {
      return <span className="prio-estado-pill prio-estado-pill--red">Atrasado</span>;
    }
    return <span className="prio-estado-pill prio-estado-pill--gray">{st}</span>;
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <span style={{ color: "#9ca3af" }}>-</span>;
    if (score >= 80) return <span className="inbox-score-badge inbox-score-badge--green">{score}</span>;
    if (score >= 70) return <span className="inbox-score-badge inbox-score-badge--amber">{score}</span>;
    return <span className="inbox-score-badge inbox-score-badge--orange">{score}</span>;
  };

  return (
    <div>
      {/* 1. SECCIÓN HERO (Bienvenida ejecutiva) */}
      <section className="hero-card">
        <div>
          <div className="hero-card__tag">BIENVENIDA</div>
          <h1 className="hero-card__greeting" style={{ fontSize: 26, fontWeight: 800 }}>
            Home • Portafolio
          </h1>
          <p className="hero-card__sub">
            Consulta el estado de tus iniciativas, aprobaciones y solicitudes del portafolio.
          </p>
        </div>

        <div className="hero-card__time-box">
          <div style={{ color: "#f59e0b", display: "flex", alignItems: "center" }}>
            <Icon icon={Sun} size={32} />
          </div>
          <div>
            <div className="hero-card__time">{currentTimeStr || "9:24 a.m."}</div>
            <div className="hero-card__date" style={{ textTransform: "capitalize" }}>
              {currentDateStr || "Jueves, 24 de Septiembre de 2026"}
            </div>
            <div className="hero-card__slogan-box">
              <span className="hero-card__slogan-bar" />
              <span className="hero-card__slogan">Grandes ideas, mayores resultados.</span>
            </div>
          </div>
        </div>
      </section>

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
          margin: "16px 0",
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
          Portafolio activo: <strong>{initiativesInCartera.length}</strong> iniciativas en {selectedCartera}
        </div>
      </div>

      {/* 2. ETAPAS DEL PORTAFOLIO (4 ETAPAS HOMOLOGADAS DEL CICLO DE VIDA) */}
      <section className="home-lifecycle-card">
        <div className="home-lifecycle-header">
          <div className="home-lifecycle-header-icon">
            <Icon icon={FileIcon} size={18} />
          </div>
          <div>
            <h2 className="home-lifecycle-header-title">Etapas del portafolio</h2>
            <p className="home-lifecycle-header-sub">Ciclo completo de vida de las iniciativas (4 etapas macro).</p>
          </div>
        </div>

        <div className="home-lifecycle-ribbon">
          {/* Etapa 1: Definición */}
          <div
            className={`home-lifecycle-item ${selectedStageFilter === "Definición" ? "home-lifecycle-item--active" : ""}`}
            onClick={() => setSelectedStageFilter(selectedStageFilter === "Definición" ? null : "Definición")}
          >
            <div className="home-stage-icon-box" style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
              <Icon icon={CheckList} size={16} />
            </div>
            <div className="home-stage-num-badge" style={{ background: "#2563eb" }}>1</div>
            <div>
              <div className="home-stage-title">Definición</div>
              <div className="home-stage-count">{countStage1_Definicion} iniciativas</div>
            </div>
          </div>

          <div className="home-lifecycle-chevron">&gt;</div>

          {/* Etapa 2: Estimación */}
          <div
            className={`home-lifecycle-item ${selectedStageFilter === "Estimación" ? "home-lifecycle-item--active" : ""}`}
            onClick={() => setSelectedStageFilter(selectedStageFilter === "Estimación" ? null : "Estimación")}
          >
            <div className="home-stage-icon-box" style={{ background: "#f5f3ff", color: "#8b5cf6", border: "1px solid #ddd6fe" }}>
              <Icon icon={Timeline} size={16} />
            </div>
            <div className="home-stage-num-badge" style={{ background: "#8b5cf6" }}>2</div>
            <div>
              <div className="home-stage-title">Estimación</div>
              <div className="home-stage-count">{countStage2_Estimacion} iniciativas</div>
            </div>
          </div>

          <div className="home-lifecycle-chevron">&gt;</div>

          {/* Etapa 3: Ejecución */}
          <div
            className={`home-lifecycle-item ${selectedStageFilter === "Ejecución" ? "home-lifecycle-item--active" : ""}`}
            onClick={() => setSelectedStageFilter(selectedStageFilter === "Ejecución" ? null : "Ejecución")}
          >
            <div className="home-stage-icon-box" style={{ background: "#ecfdf5", color: "#10b981", border: "1px solid #a7f3d0" }}>
              <Icon icon={Play} size={16} />
            </div>
            <div className="home-stage-num-badge" style={{ background: "#10b981" }}>3</div>
            <div>
              <div className="home-stage-title">Ejecución</div>
              <div className="home-stage-count">{countStage3_Ejecucion} iniciativas</div>
            </div>
          </div>

          <div className="home-lifecycle-chevron">&gt;</div>

          {/* Etapa 4: Cierre */}
          <div
            className={`home-lifecycle-item ${selectedStageFilter === "Cierre" ? "home-lifecycle-item--active" : ""}`}
            onClick={() => setSelectedStageFilter(selectedStageFilter === "Cierre" ? null : "Cierre")}
          >
            <div className="home-stage-icon-box" style={{ background: "#f1f5f9", color: "#1e293b", border: "1px solid #cbd5e1" }}>
              <Icon icon={Check} size={16} />
            </div>
            <div className="home-stage-num-badge" style={{ background: "#1e293b" }}>4</div>
            <div>
              <div className="home-stage-title">Cierre</div>
              <div className="home-stage-count">{countStage4_Cierre} iniciativas</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BARRA DE ACCIONES CLAVE */}
      <section className="home-actions-bar">
        <div className="home-actions-bar__info">
          <div className="home-actions-bar__icon">
            <Icon icon={Bolt} size={20} />
          </div>
          <div>
            <div className="home-actions-bar__title">Acciones clave</div>
            <div className="home-actions-bar__sub">
              Accede a los módulos clave del ciclo automatizado de iniciativas.
            </div>
          </div>
        </div>

        <div className="home-actions-bar__buttons">
          <Link
            href="/backlog"
            className="btn-purple-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Icon icon={CheckList} size={15} />
            <span>Cartera de Pendientes (TI)</span>
          </Link>

          <Link
            href="/priorizacion"
            className="btn-purple-solid"
            style={{ background: "#833177", borderColor: "#833177" }}
          >
            <span>→ Ir a priorización</span>
          </Link>

          <Link
            href="/estimacion"
            className="btn-purple-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Icon icon={Timeline} size={15} />
            <span>Estimación y VoBo</span>
          </Link>
        </div>
      </section>

      {/* 4. LAYOUT A DOS COLUMNAS */}
      <div className="home-content-layout">
        {/* COLUMNA IZQUIERDA: BANDEJA PRIORITARIA */}
        <section className="inbox-table-card" id="priorizacion">
          <div className="inbox-table-header">
            <div className="inbox-table-title-box">
              <div className="inbox-table-icon">
                <Icon icon={CheckList} size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: "#1e2022" }}>
                  Bandeja prioritaria
                </h2>
                <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {selectedStageFilter
                    ? `Iniciativas en etapa ${selectedStageFilter} (${displayedInitiatives.length})`
                    : "Iniciativas que requieren tu atención"}
                </div>
              </div>
            </div>

            <Link
              href="/priorizacion"
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--brand-primary)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span>Ver todas</span>
              <span>→</span>
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="inbox-table">
              <thead>
                <tr>
                  <th style={{ width: "27%" }}>Iniciativa</th>
                  <th style={{ width: "20%" }}>Área</th>
                  <th style={{ width: "16%" }}>Etapa actual</th>
                  <th style={{ width: "9%" }}>Score</th>
                  <th style={{ width: "16%" }}>Estado</th>
                  <th style={{ width: "12%", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {displayedInitiatives.map((item) => (
                  <tr
                    key={item.id}
                    className="inbox-row-accent"
                    style={{ "--row-accent": item.color || "#833177" } as React.CSSProperties}
                  >
                    <td>
                      <Link
                        href={`/priorizacion?id=${item.id}`}
                        onClick={() => setSelectedInitiativeId(item.id)}
                        style={{
                          fontWeight: 700,
                          color: "#1e2022",
                          fontSize: 13.5,
                          paddingLeft: 8,
                          display: "inline-block",
                        }}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td>
                      <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>
                        {item.area}
                      </span>
                    </td>
                    <td>
                      {getEtapaPill(item.etapaCiclo)}
                    </td>
                    <td>
                      {getScoreBadge(item.score)}
                    </td>
                    <td>
                      {getEstadoPill(item.estadoOperativo, item.status)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Link
                        href={`/priorizacion?id=${item.id}`}
                        onClick={() => setSelectedInitiativeId(item.id)}
                        className="home-btn-action-ver"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Banner Informativo explicativo de 4 etapas y 4 estados */}
          <div className="home-table-info-banner">
            <span style={{ color: "#0284c7", display: "flex", alignItems: "center", flexShrink: 0 }}>
              <Icon icon={Info} size={16} />
            </span>
            <span>
              La <strong>etapa</strong> indica el progreso macro (1. Definición → 2. Estimación → 3. Ejecución → 4. Cierre), mientras que el <strong>estado</strong> refleja la condición operativa estándar (Por iniciar, En curso, Finalizado, Atrasado).
            </span>
          </div>
        </section>

        {/* COLUMNA DERECHA: 3 WIDGETS (Imagen 2) */}
        <div className="widget-stack">
          {/* Widget 1: Vista por etapa (Donut con 6 etapas) */}
          <section className="widget-card">
            <div className="widget-card__header">
              <div className="widget-card__icon" style={{ background: "#f5edf5", color: "#833177" }}>
                <Icon icon={Timeline} size={18} />
              </div>
              <div>
                <h3 className="widget-card__title">Vista por etapa</h3>
                <div className="widget-card__subtitle">Distribución de iniciativas en el portafolio.</div>
              </div>
            </div>

            <div className="donut-widget-body">
              {/* Gráfica de dona SVG con 4 segmentos proporcionales homologados */}
              <div className="donut-chart-container">
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
                <div className="donut-center-text">
                  <span className="donut-center-num">{initiativesInCartera.length}</span>
                  <span className="donut-center-label">iniciativas</span>
                </div>
              </div>

              {/* Leyenda con las 4 etapas macro, conteos y porcentajes exactos */}
              <div className="donut-legend">
                <div className="donut-legend-item">
                  <div className="donut-legend-left">
                    <span className="donut-legend-dot" style={{ background: "#2563eb" }} />
                    <span>Definición</span>
                  </div>
                  <div className="donut-legend-counts">
                    <span>{countStage1_Definicion}</span>
                    <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{pctDef}%</span>
                  </div>
                </div>

                <div className="donut-legend-item">
                  <div className="donut-legend-left">
                    <span className="donut-legend-dot" style={{ background: "#8b5cf6" }} />
                    <span>Estimación</span>
                  </div>
                  <div className="donut-legend-counts">
                    <span>{countStage2_Estimacion}</span>
                    <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{pctEst}%</span>
                  </div>
                </div>

                <div className="donut-legend-item">
                  <div className="donut-legend-left">
                    <span className="donut-legend-dot" style={{ background: "#10b981" }} />
                    <span>Ejecución</span>
                  </div>
                  <div className="donut-legend-counts">
                    <span>{countStage3_Ejecucion}</span>
                    <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{pctEje}%</span>
                  </div>
                </div>

                <div className="donut-legend-item">
                  <div className="donut-legend-left">
                    <span className="donut-legend-dot" style={{ background: "#1e293b" }} />
                    <span>Cierre</span>
                  </div>
                  <div className="donut-legend-counts">
                    <span>{countStage4_Cierre}</span>
                    <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>{pctCie}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Widget 2: Pendientes clave (Imagen 2) */}
          <section className="widget-card" id="aprobaciones">
            <div className="widget-card__header">
              <div className="widget-card__icon" style={{ background: "#fdf2f8", color: "#db2777" }}>
                <Icon icon={Alert} size={18} />
              </div>
              <div>
                <h3 className="widget-card__title">Pendientes clave</h3>
                <div className="widget-card__subtitle">Temas que requieren tu atención</div>
              </div>
              <Link href="/priorizacion" style={{ fontSize: 12, color: "#833177", fontWeight: 600, marginLeft: "auto", textDecoration: "none" }}>
                Ver todas →
              </Link>
            </div>

            <div className="pending-list">
              <Link href="/priorizacion?tab=revision" className="pending-item">
                <div className="pending-item__left">
                  <div className="pending-item__icon" style={{ background: "#fef2f2", color: "#ef4444" }}>
                    <Icon icon={Alert} size={14} />
                  </div>
                  <span>3 iniciativas por revisar</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>

              <Link href="/priorizacion?tab=comite" className="pending-item">
                <div className="pending-item__left">
                  <div className="pending-item__icon" style={{ background: "#fffbeb", color: "#d97706" }}>
                    <Icon icon={Time} size={14} />
                  </div>
                  <span>5 en espera de comité</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>

              <Link href="/project/proj-01" className="pending-item">
                <div className="pending-item__left">
                  <div className="pending-item__icon" style={{ background: "#f5edf5", color: "#833177" }}>
                    <Icon icon={FileIcon} size={14} />
                  </div>
                  <span>3 con documentos pendientes</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </Link>
            </div>
          </section>

          {/* Widget 3: Próximos hitos (Imagen 2) */}
          <section className="widget-card" id="hitos">
            <div className="widget-card__header">
              <div className="widget-card__icon" style={{ background: "#fdf2f8", color: "#db2777" }}>
                <Icon icon={Calendar} size={18} />
              </div>
              <div>
                <h3 className="widget-card__title">Próximos hitos</h3>
                <div className="widget-card__subtitle">Fechas importantes del portafolio</div>
              </div>
              <Link href="/priorizacion" style={{ fontSize: 12, color: "#833177", fontWeight: 600, marginLeft: "auto", textDecoration: "none" }}>
                Ver calendario →
              </Link>
            </div>

            <div className="pending-list">
              <div className="home-milestone-item">
                <div className="home-milestone-date">29 Sep 2026</div>
                <div className="home-milestone-body">
                  <span className="home-milestone-dot" style={{ background: "#8b5cf6" }} />
                  <span>Comité de portafolio</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </div>

              <div className="home-milestone-item">
                <div className="home-milestone-date">15 Oct 2026</div>
                <div className="home-milestone-body">
                  <span className="home-milestone-dot" style={{ background: "#64748b" }} />
                  <span>Cierre de estimaciones Q4</span>
                </div>
                <Icon icon={NavigationChevronRight} size={14} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

