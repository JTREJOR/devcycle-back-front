import { Priority, ProjectStatus } from "@devcycle/shared";

export interface PatchProjectDto {
  status?: ProjectStatus;
  priority?: Priority;
  currentStageId?: string;
  currentSubStepId?: string;
  stageData?: Record<string, Record<string, unknown>>;
}

export interface AddApprovalDto {
  subStepId: string;
  roleId: string;
  userId: string;
  decision: "aprobado" | "rechazado";
  comment?: string;
}

export interface AddFileDto {
  name: string;
  size: number;
  type: string;
}
