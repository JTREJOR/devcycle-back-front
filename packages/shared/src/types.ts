export type ProjectStatus =
  | "Finalizado"
  | "En proceso"
  | "Atrasado"
  | "Por iniciar"
  | "No aplica";

export type Priority = "Alta" | "Media" | "Baja";

export type SubStepType = "task" | "decision" | "approval";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "date"
  | "select"
  | "multiselect"
  | "toggle"
  | "table"
  | "file";

export interface FieldOption {
  value: string;
  label: string;
  /** Index signature so this shape is directly usable as a Vibe Dropdown option item. */
  [key: string]: unknown;
}

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  options?: FieldOption[];
  /** For "table" fields: column definitions rendered as a simple editable grid. */
  columns?: { id: string; label: string; type: FieldType }[];
}

export interface SubStepBranch {
  label: "SI" | "NO";
  text: string;
  /** Substep this branch jumps to. Omitted when the branch terminates/archives the flow. */
  targetSubStepId?: string;
}

export interface SubStep {
  id: string;
  order: number;
  title: string;
  description: string;
  responsibleLane: string;
  type: SubStepType;
  /** Only present when type === 'approval': the role that must approve/reject this step. */
  approverRoleId?: string;
  branches?: SubStepBranch[];
  formFields?: FieldDef[];
}

export interface Stage {
  id: string;
  order: number;
  key: string;
  name: string;
  shortName: string;
  sourceFlow: string;
  description: string;
  lanes: string[];
  color: string;
  substeps: SubStep[];
}

export interface Role {
  id: string;
  name: string;
  area: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  area: string;
  avatarColor: string;
}

export interface Approval {
  id: string;
  projectId: string;
  stageId: string;
  subStepId: string;
  roleId: string;
  userId: string;
  decision: "aprobado" | "rechazado";
  comment?: string;
  ts: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  aiInsight: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: string;
  context?: {
    stageId?: string;
    subStepId?: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  area: string;
  owner: string;
  priority: Priority;
  status: ProjectStatus;
  currentStageId: string;
  currentSubStepId: string;
  budgetEstimate: number;
  pepNumber?: string;
  startDate: string;
  targetDate: string;
  documents: ProjectDocument[];
  approvals: Approval[];
  /** Dummy values captured per-stage form, keyed by stageId then fieldId. */
  stageData: Record<string, Record<string, unknown>>;
}
