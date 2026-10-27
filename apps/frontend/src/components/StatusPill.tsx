import type { ProjectStatus } from "@devcycle/shared";

const BASE_PILL_CLASSES =
  "inline-flex items-center rounded-xl border px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap";

const STATUS_CLASSES: Record<ProjectStatus, string> = {
  Finalizado: `${BASE_PILL_CLASSES} bg-status-green-bg text-status-green-text border-status-green-border`,
  "En proceso": `${BASE_PILL_CLASSES} bg-status-orange-bg text-status-orange-text border-status-orange-border`,
  Atrasado: `${BASE_PILL_CLASSES} bg-status-red-bg text-status-red-text border-status-red-border`,
  "Por iniciar": `${BASE_PILL_CLASSES} bg-status-blue-bg text-status-blue-text border-status-blue-border`,
  "No aplica": `${BASE_PILL_CLASSES} bg-status-gray-bg text-status-gray-text border-status-gray-border`,
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  const className =
    STATUS_CLASSES[status] ??
    `${BASE_PILL_CLASSES} bg-status-gray-bg text-status-gray-text border-status-gray-border`;
  return <span className={className}>{status}</span>;
}
