"use client";

import Link from "next/link";
import { EmptyState, Icon, Loader, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@vibe/core";
import { Show } from "@vibe/icons";
import { useFlows, useProjects } from "@/lib/queries";
import { StatusPill } from "./StatusPill";
import { formatCurrency, formatDate } from "@/lib/format";

const COLUMNS = [
  { id: "name", title: "Iniciativa / Proyecto", width: { min: 220, max: "3fr" as const } },
  { id: "stage", title: "Etapa actual", width: 140 },
  { id: "status", title: "Estado", width: 120 },
  { id: "priority", title: "Prioridad", width: 95 },
  { id: "owner", title: "Responsable", width: 150 },
  { id: "budget", title: "Presupuesto", width: 130 },
  { id: "targetDate", title: "Fecha objetivo", width: 130 },
  { id: "actions", title: "Acciones", width: 80 },
];

export function ProjectBoard() {
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: stages, isLoading: loadingStages } = useFlows();

  if (loadingProjects || loadingStages) {
    return <Loader size={48} />;
  }

  return (
    <Table
      columns={COLUMNS}
      emptyState={<EmptyState description="Todavía no hay iniciativas en el portafolio." />}
      errorState={<EmptyState description="No se pudieron cargar las iniciativas." />}
    >
      <TableHeader>
        {COLUMNS.map((col) => (
          <TableHeaderCell key={col.id} title={col.title} />
        ))}
      </TableHeader>
      <TableBody>
        {projects?.map((project) => {
          const stage = stages?.find((s) => s.id === project.currentStageId);
          return (
            <TableRow key={project.id}>
              <TableCell>
                <Link
                  href={`/project/${project.id}`}
                  title={project.name}
                  className="block truncate text-[13.5px] font-semibold text-brand-primary"
                >
                  {project.name}
                </Link>
                <span className="text-[11.5px] text-text-secondary">
                  {project.area}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-block rounded-xl bg-brand-primary px-2.5 py-[3px] text-[11.5px] font-semibold text-white">
                  {stage?.shortName ?? "—"}
                </span>
              </TableCell>
              <TableCell>
                <StatusPill status={project.status} />
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-xl border border-status-gray-border bg-status-gray-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-gray-text">
                  {project.priority}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[13px] text-text-main">
                  {project.owner}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[13px] font-medium text-text-main">
                  {formatCurrency(project.budgetEstimate)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[12.5px] text-text-secondary">
                  {formatDate(project.targetDate)}
                </span>
              </TableCell>
              <TableCell>
                <Link
                  href={`/project/${project.id}`}
                  aria-label={`Ver detalle de ${project.name}`}
                  className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md bg-brand-primary-light text-brand-primary transition-colors duration-150 hover:bg-brand-primary hover:text-white"
                >
                  <Icon icon={Show} size={16} />
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
