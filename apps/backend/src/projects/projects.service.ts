import { Injectable, NotFoundException } from "@nestjs/common";
import { projects as seedProjects, stages, stageById, roleById, Project, Approval } from "@devcycle/shared";
import { AddApprovalDto, AddFileDto, CreateProjectDto, PatchProjectDto } from "./dto";

function generateAiInsight(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes("business") || lower.includes("caso")) {
    return "Parece un Business Case. Sugerencia: usa sus cifras para completar 'Objetivo' y 'Beneficios esperados' del Canvas.";
  }
  if (lower.includes("charter")) {
    return "Detecté un documento tipo Charter. Puedo prellenar el folio y la fecha de formalización si lo confirmas.";
  }
  if (lower.includes("cost") || lower.includes("costo") || lower.includes("presupuesto")) {
    return "El archivo parece contener información de costos. Considera usarlo para la 'Hoja de costo' de la estimación.";
  }
  if (lower.includes("ux") || lower.includes("diagnostico")) {
    return "Documento de diagnóstico/UX detectado. Puede ayudarte a justificar el 'Alcance' y los 'Riesgos iniciales'.";
  }
  return "Documento recibido. Lo agregué a la iniciativa; cuéntame en el chat si quieres que te ayude a extraer datos para el Canvas.";
}

@Injectable()
export class ProjectsService {
  // Copia mutable en memoria, se reinicia al reiniciar el servidor.
  private projects: Project[] = JSON.parse(JSON.stringify(seedProjects));

  findAll(): Project[] {
    return this.projects;
  }

  create(dto: CreateProjectDto): Project {
    const now = new Date();
    const defaultTargetDate = new Date(now);
    defaultTargetDate.setMonth(defaultTargetDate.getMonth() + 6);

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: dto.name,
      description: dto.description ?? "",
      area: dto.area,
      owner: dto.owner ?? "Por asignar",
      priority: dto.priority ?? "Media",
      status: "Por iniciar",
      currentStageId: "priorizacion",
      currentSubStepId: "p-11",
      budgetEstimate: dto.budgetEstimate ?? 0,
      startDate: now.toISOString().slice(0, 10),
      targetDate: dto.targetDate ?? defaultTargetDate.toISOString().slice(0, 10),
      documents: [],
      approvals: [],
      stageData: dto.stageData ?? {},
    };

    this.projects.unshift(newProject);
    return newProject;
  }

  findOne(id: string): Project {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Proyecto '${id}' no encontrado`);
    }
    return project;
  }

  patch(id: string, dto: PatchProjectDto): Project {
    const project = this.findOne(id);
    if (dto.status) project.status = dto.status;
    if (dto.priority) project.priority = dto.priority;
    if (dto.currentStageId) project.currentStageId = dto.currentStageId;
    if (dto.currentSubStepId) project.currentSubStepId = dto.currentSubStepId;
    if (dto.stageData) {
      for (const [stageId, values] of Object.entries(dto.stageData)) {
        project.stageData[stageId] = { ...(project.stageData[stageId] ?? {}), ...values };
      }
    }
    return project;
  }

  addFile(id: string, dto: AddFileDto): Project {
    const project = this.findOne(id);
    project.documents.push({
      id: `doc-${Date.now()}`,
      name: dto.name,
      size: dto.size,
      type: dto.type,
      uploadedAt: new Date().toISOString(),
      aiInsight: generateAiInsight(dto.name),
    });
    return project;
  }

  addApproval(id: string, dto: AddApprovalDto): Project {
    const project = this.findOne(id);
    const stage = stageById(project.currentStageId);
    if (!stage) {
      throw new NotFoundException(`Etapa '${project.currentStageId}' no encontrada`);
    }
    const subStep = stage.substeps.find((s) => s.id === dto.subStepId);
    if (!subStep) {
      throw new NotFoundException(`Paso '${dto.subStepId}' no encontrado en la etapa '${stage.id}'`);
    }
    if (!roleById(dto.roleId)) {
      throw new NotFoundException(`Rol '${dto.roleId}' no encontrado`);
    }

    const approval: Approval = {
      id: `appr-${Date.now()}`,
      projectId: project.id,
      stageId: stage.id,
      subStepId: subStep.id,
      roleId: dto.roleId,
      userId: dto.userId,
      decision: dto.decision,
      comment: dto.comment,
      ts: new Date().toISOString(),
    };
    project.approvals.push(approval);

    this.advance(project, stage.id, subStep.id, dto.decision);
    return project;
  }

  /** Avanza (o regresa) el proyecto dentro del subflujo según la rama de la decisión tomada. */
  private advance(project: Project, stageId: string, subStepId: string, decision: "aprobado" | "rechazado") {
    const stage = stageById(stageId);
    if (!stage) return;
    const subStep = stage.substeps.find((s) => s.id === subStepId);
    if (!subStep) return;

    const branchLabel = decision === "aprobado" ? "SI" : "NO";
    const branch = subStep.branches?.find((b) => b.label === branchLabel);

    if (branch) {
      if (branch.targetSubStepId) {
        project.currentStageId = stageId;
        project.currentSubStepId = branch.targetSubStepId;
      }
      // Si la rama no tiene target, el flujo termina/archiva aquí: no se mueve el puntero.
      return;
    }

    if (decision === "rechazado") {
      // Sin rama explícita de rechazo: el proyecto se queda en el mismo paso.
      return;
    }

    // Aprobación simple sin ramas: avanza al siguiente substep en orden, o a la siguiente etapa.
    const ordered = [...stage.substeps].sort((a, b) => a.order - b.order);
    const currentIndex = ordered.findIndex((s) => s.id === subStepId);
    const next = ordered[currentIndex + 1];
    if (next) {
      project.currentSubStepId = next.id;
      return;
    }

    const nextStage = stages.find((s) => s.order === stage.order + 1);
    if (nextStage) {
      const firstSubStep = [...nextStage.substeps].sort((a, b) => a.order - b.order)[0];
      project.currentStageId = nextStage.id;
      project.currentSubStepId = firstSubStep.id;
    } else {
      project.status = "Finalizado";
    }
  }
}
