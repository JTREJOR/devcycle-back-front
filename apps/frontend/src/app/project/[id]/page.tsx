"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heading, Loader, Text } from "@vibe/core";
import { useFlows, useProject } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";
import { StatusPill } from "@/components/StatusPill";
import { StageTracker } from "@/components/StageTracker";
import { SubflowStepper } from "@/components/SubflowStepper";
import { FileDropzone } from "@/components/FileDropzone";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: project, isLoading: loadingProject } = useProject(params.id);
  const { data: stages, isLoading: loadingStages } = useFlows();
  const selectedStageId = useUiStore((s) => s.selectedStageId);
  const setSelectedStageId = useUiStore((s) => s.setSelectedStageId);

  useEffect(() => {
    if (project && !selectedStageId) {
      setSelectedStageId(project.currentStageId);
    }
  }, [project, selectedStageId, setSelectedStageId]);

  if (loadingProject || loadingStages) return <Loader size={48} />;
  if (!project || !stages) return <Text type="text1">Proyecto no encontrado.</Text>;

  const activeStageId = selectedStageId ?? project.currentStageId;
  const activeStage = stages.find((s) => s.id === activeStageId) ?? stages[0];

  return (
    <div>
      <Link href="/" style={{ fontSize: 13, color: "var(--brand-accent)" }}>
        ← Volver al portafolio
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
        <div>
          <Heading type="h1">{project.name}</Heading>
          <Text type="text2" color="secondary">
            {project.description}
          </Text>
        </div>
        <StatusPill status={project.status} />
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", margin: "16px 0", fontSize: 13 }}>
        <div>
          <Text type="text3" color="secondary">Responsable</Text>
          <Text type="text2">{project.owner}</Text>
        </div>
        <div>
          <Text type="text3" color="secondary">Área</Text>
          <Text type="text2">{project.area}</Text>
        </div>
        <div>
          <Text type="text3" color="secondary">Prioridad</Text>
          <Text type="text2">{project.priority}</Text>
        </div>
        <div>
          <Text type="text3" color="secondary">Presupuesto</Text>
          <Text type="text2">{formatCurrency(project.budgetEstimate)}</Text>
        </div>
        {project.pepNumber && (
          <div>
            <Text type="text3" color="secondary">PEP</Text>
            <Text type="text2">{project.pepNumber}</Text>
          </div>
        )}
        <div>
          <Text type="text3" color="secondary">Fecha objetivo</Text>
          <Text type="text2">{formatDate(project.targetDate)}</Text>
        </div>
      </div>

      <StageTracker
        stages={stages}
        currentStageId={project.currentStageId}
        selectedStageId={activeStageId}
        onSelect={setSelectedStageId}
      />

      <div style={{ marginTop: 20 }}>
        <Heading type="h3">{activeStage.name}</Heading>
        <Text type="text3" color="secondary">
          {activeStage.sourceFlow}
        </Text>
        <Text type="text2" color="secondary" align="start">
          {activeStage.description}
        </Text>
      </div>

      {activeStage.id === "priorizacion" && (
        <div style={{ marginTop: 16 }}>
          <Heading type="h3">Documentos de descubrimiento</Heading>
          <FileDropzone project={project} />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <SubflowStepper project={project} stage={activeStage} />
      </div>
    </div>
  );
}
