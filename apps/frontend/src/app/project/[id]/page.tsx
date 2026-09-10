"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Icon, Loader } from "@vibe/core";
import { Update, NavigationChevronLeft, File as FileIcon, Timeline, Bolt } from "@vibe/icons";
import { useFlows, useProject } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";
import { StatusPill } from "@/components/StatusPill";
import { StageTracker } from "@/components/StageTracker";
import { SubflowStepper } from "@/components/SubflowStepper";
import { FileDropzone } from "@/components/FileDropzone";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: project, isLoading: loadingProject, refetch, isRefetching } = useProject(params.id);
  const { data: stages, isLoading: loadingStages } = useFlows();
  const selectedStageId = useUiStore((s) => s.selectedStageId);
  const setSelectedStageId = useUiStore((s) => s.setSelectedStageId);
  const [activeTab, setActiveTab] = useState<"flow" | "docs">("flow");

  useEffect(() => {
    if (project && !selectedStageId) {
      setSelectedStageId(project.currentStageId);
    }
  }, [project, selectedStageId, setSelectedStageId]);

  if (loadingProject || loadingStages) return <Loader size={48} />;
  if (!project || !stages) {
    return (
      <div className="board-card" style={{ textAlign: "center", padding: 40 }}>
        <h3>Iniciativa no encontrada</h3>
        <Link href="/" className="btn-purple-outline" style={{ marginTop: 12 }}>
          ← Volver al portafolio
        </Link>
      </div>
    );
  }

  const activeStageId = selectedStageId ?? project.currentStageId;
  const activeStage = stages.find((s) => s.id === activeStageId) ?? stages[0];

  return (
    <div>
      {/* Breadcrumb estilo Imagen 2 */}
      <div style={{ marginBottom: 12 }}>
        <Link
          href="/"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--brand-primary)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon icon={NavigationChevronLeft} size={16} />
          <span>Inicio / Portafolio</span>
        </Link>
      </div>

      {/* Header de la Iniciativa */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#1e2022" }}>
              {project.name}
            </h1>
            <span className="tag-pill tag-pill--purple">
              {project.id.toUpperCase()}
            </span>
            <StatusPill status={project.status} />
          </div>
          <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", margin: "6px 0 0 0" }}>
            {project.description}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            className="btn-purple-outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <Icon icon={Update} size={15} />
            <span>{isRefetching ? "Actualizando…" : "Actualizar"}</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Metadatos estilo Imagen 4 */}
      <div
        className="board-card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 20,
          padding: "16px 20px",
        }}
      >
        <div>
          <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
            Responsable
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{project.owner}</div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
            Área Solicitante
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{project.area}</div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
            Prioridad
          </div>
          <div style={{ marginTop: 3 }}>
            <span className="tag-pill tag-pill--gray">{project.priority}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
            Presupuesto Estimado
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>
            {formatCurrency(project.budgetEstimate)}
          </div>
        </div>
        {project.pepNumber && (
          <div>
            <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
              Número PEP
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>{project.pepNumber}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)", fontWeight: 600, textTransform: "uppercase" }}>
            Fecha Objetivo
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 3 }}>
            {formatDate(project.targetDate)}
          </div>
        </div>
      </div>

      {/* Stage Tracker / Flujo de Etapas */}
      <div style={{ marginBottom: 20 }}>
        <StageTracker
          stages={stages}
          currentStageId={project.currentStageId}
          selectedStageId={activeStageId}
          onSelect={setSelectedStageId}
        />
      </div>

      {/* Segmented Control / Tabs estilo Imagen 4 */}
      <div style={{ marginBottom: 16 }}>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${activeTab === "flow" ? "active" : ""}`}
            onClick={() => setActiveTab("flow")}
          >
            <Icon icon={Timeline} size={15} />
            <span>Paso a paso de la etapa ({activeStage.shortName})</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeTab === "docs" ? "active" : ""}`}
            onClick={() => setActiveTab("docs")}
          >
            <Icon icon={FileIcon} size={15} />
            <span>Documentos de descubrimiento ({project.documents.length})</span>
          </button>
        </div>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === "flow" ? (
        <div className="board-card">
          <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e2022" }}>
                {activeStage.name}
              </h2>
              <span className="tag-pill tag-pill--blue">
                {activeStage.sourceFlow}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "6px 0 0 0" }}>
              {activeStage.description}
            </p>
          </div>

          {activeStage.id === "priorizacion" && (
            <div
              style={{
                background: "#fbf2f7",
                border: "1px solid #f2d8ec",
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "var(--brand-primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon icon={Bolt} size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--brand-primary)" }}>
                    Paso 1: Descubrimiento Inteligente con DataSwat AI
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)" }}>
                    Define beneficios cuantificados, impacto TI y problemática con asistencia guiada tipo Pega Blueprint.
                  </div>
                </div>
              </div>
              <Link
                href="/discovery"
                className="btn-purple-solid"
                style={{ fontSize: 12, padding: "6px 14px" }}
              >
                Abrir Discovery Asistido →
              </Link>
            </div>
          )}

          <SubflowStepper project={project} stage={activeStage} />
        </div>
      ) : (
        <div className="board-card">
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e2022" }}>
              Documentos de descubrimiento y soporte
            </h2>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
              Archivos adjuntos analizados automáticamente por el asistente de portafolio.
            </p>
          </div>
          <FileDropzone project={project} />
        </div>
      )}
    </div>
  );
}
