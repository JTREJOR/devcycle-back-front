import type { ComponentProps } from "react";
import { Label } from "@vibe/core";
import type { ProjectStatus } from "@devcycle/shared";

type LabelColor = ComponentProps<typeof Label>["color"];

const STATUS_COLOR: Record<ProjectStatus, LabelColor> = {
  Finalizado: "done-green",
  "En proceso": "working_orange",
  Atrasado: "stuck-red",
  "Por iniciar": "dark-blue",
  "No aplica": "american_gray",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  return <Label text={status} color={STATUS_COLOR[status]} kind="fill" size="small" />;
}
