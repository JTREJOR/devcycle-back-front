import type { ProjectStatus } from "@devcycle/shared";

const STATUS_CLASSES: Record<ProjectStatus, string> = {
  Finalizado: "tag-pill tag-pill--green",
  "En proceso": "tag-pill tag-pill--orange",
  Atrasado: "tag-pill tag-pill--red",
  "Por iniciar": "tag-pill tag-pill--blue",
  "No aplica": "tag-pill tag-pill--gray",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  const className = STATUS_CLASSES[status] ?? "tag-pill tag-pill--gray";
  return <span className={className}>{status}</span>;
}
