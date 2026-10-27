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
import { BackButton } from "@/components/BackButton";

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
      <div className="rounded-xl border border-border-default bg-bg-card p-10 text-center shadow-2xs">
        <h3 className="text-lg font-bold text-text-heading">Iniciativa no encontrada</h3>
        <Link
          href="/"
          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary no-underline transition-all duration-150 hover:bg-brand-primary-light"
        >
          ← Volver al portafolio
        </Link>
      </div>
    );
  }

  const activeStageId = selectedStageId ?? project.currentStageId;
  const activeStage = stages.find((s) => s.id === activeStageId) ?? stages[0];

  return (
    <div>
      {/* Navegación Atrás */}
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Header de la Iniciativa */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="m-0 text-2xl font-bold text-text-heading">
              {project.name}
            </h1>
            <span className="inline-flex items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text">
              {project.id.toUpperCase()}
            </span>
            <StatusPill status={project.status} />
          </div>
          <p className="mt-1.5 mb-0 text-[13.5px] text-text-secondary">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <Icon icon={Update} size={15} />
            <span>{isRefetching ? "Actualizando…" : "Actualizar"}</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Metadatos estilo Imagen 4 */}
      <div className="mb-5 grid grid-cols-1 gap-4 rounded-xl border border-border-default bg-bg-card px-5 py-4 shadow-2xs sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <div>
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase">
            Responsable
          </div>
          <div className="mt-[3px] text-[13.5px] font-semibold text-text-main">{project.owner}</div>
        </div>
        <div>
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase">
            Área Solicitante
          </div>
          <div className="mt-[3px] text-[13.5px] font-semibold text-text-main">{project.area}</div>
        </div>
        <div>
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase">
            Prioridad
          </div>
          <div className="mt-[3px]">
            <span className="inline-flex items-center rounded-xl border border-status-gray-border bg-status-gray-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-gray-text">
              {project.priority}
            </span>
          </div>
        </div>
        <div>
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase">
            Presupuesto Estimado
          </div>
          <div className="mt-[3px] text-[13.5px] font-semibold text-text-main">
            {formatCurrency(project.budgetEstimate)}
          </div>
        </div>
        {project.pepNumber && (
          <div>
            <div className="text-[11.5px] font-semibold text-text-secondary uppercase">
              Número PEP
            </div>
            <div className="mt-[3px] text-[13.5px] font-semibold text-text-main">{project.pepNumber}</div>
          </div>
        )}
        <div>
          <div className="text-[11.5px] font-semibold text-text-secondary uppercase">
            Fecha Objetivo
          </div>
          <div className="mt-[3px] text-[13.5px] font-semibold text-text-main">
            {formatDate(project.targetDate)}
          </div>
        </div>
      </div>

      {/* Stage Tracker / Flujo de Etapas */}
      <div className="mb-5">
        <StageTracker
          stages={stages}
          currentStageId={project.currentStageId}
          selectedStageId={activeStageId}
          onSelect={setSelectedStageId}
        />
      </div>

      {/* Segmented Control / Tabs estilo Imagen 4 */}
      <div className="mb-4">
        <div className="inline-flex flex-wrap gap-1 rounded-[10px] bg-status-gray-bg p-1">
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-none px-4 py-1.5 text-[13px] transition-all duration-150 ${
              activeTab === "flow"
                ? "bg-brand-primary-light font-bold text-brand-primary shadow-2xs"
                : "bg-transparent font-medium text-text-secondary hover:text-brand-primary"
            }`}
            onClick={() => setActiveTab("flow")}
          >
            <Icon icon={Timeline} size={15} />
            <span>Paso a paso de la etapa ({activeStage.shortName})</span>
          </button>
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-none px-4 py-1.5 text-[13px] transition-all duration-150 ${
              activeTab === "docs"
                ? "bg-brand-primary-light font-bold text-brand-primary shadow-2xs"
                : "bg-transparent font-medium text-text-secondary hover:text-brand-primary"
            }`}
            onClick={() => setActiveTab("docs")}
          >
            <Icon icon={FileIcon} size={15} />
            <span>Documentos de descubrimiento ({project.documents.length})</span>
          </button>
        </div>
      </div>

      {/* Contenido según pestaña */}
      {activeTab === "flow" ? (
        <div className="rounded-xl border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
          <div className="mb-4 border-b border-border-default pb-3.5">
            <div className="flex items-center gap-2">
              <h2 className="m-0 text-lg font-bold text-text-heading">
                {activeStage.name}
              </h2>
              <span className="inline-flex items-center rounded-xl border border-status-blue-border bg-status-blue-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-blue-text">
                {activeStage.sourceFlow}
              </span>
            </div>
            <p className="mt-1.5 mb-0 text-[13px] text-text-secondary">
              {activeStage.description}
            </p>
          </div>

          {activeStage.id === "priorizacion" && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#f2d8ec] bg-brand-primary-soft px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Icon icon={Bolt} size={16} />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-brand-primary">
                    Paso 1: Descubrimiento Inteligente con DataSwat AI
                  </div>
                  <div className="text-[11.5px] text-text-secondary">
                    Define beneficios cuantificados, impacto TI y problemática con asistencia guiada tipo Pega Blueprint.
                  </div>
                </div>
              </div>
              <Link
                href="/discovery"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-3.5 py-1.5 text-xs font-semibold text-white no-underline transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
              >
                Abrir Discovery Asistido →
              </Link>
            </div>
          )}

          <SubflowStepper project={project} stage={activeStage} />
        </div>
      ) : (
        <div className="rounded-xl border border-border-default bg-bg-card px-6 py-5 shadow-2xs">
          <div className="mb-4">
            <h2 className="m-0 text-lg font-bold text-text-heading">
              Documentos de descubrimiento y soporte
            </h2>
            <p className="mt-1 mb-0 text-[13px] text-text-secondary">
              Archivos adjuntos analizados automáticamente por el asistente de portafolio.
            </p>
          </div>
          <FileDropzone project={project} />
        </div>
      )}
    </div>
  );
}
