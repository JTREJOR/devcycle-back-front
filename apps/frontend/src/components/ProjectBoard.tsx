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
                  style={{
                    color: "var(--brand-primary)",
                    fontWeight: 600,
                    fontSize: 13.5,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.name}
                </Link>
                <span style={{ fontSize: 11.5, color: "var(--color-text-secondary)" }}>
                  {project.area}
                </span>
              </TableCell>
              <TableCell>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 12,
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: "#ffffff",
                    background: stage?.color ?? "#676879",
                  }}
                >
                  {stage?.shortName ?? "—"}
                </span>
              </TableCell>
              <TableCell>
                <StatusPill status={project.status} />
              </TableCell>
              <TableCell>
                <span className="tag-pill tag-pill--gray">
                  {project.priority}
                </span>
              </TableCell>
              <TableCell>
                <span style={{ fontSize: 13, color: "var(--color-text-main)" }}>
                  {project.owner}
                </span>
              </TableCell>
              <TableCell>
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {formatCurrency(project.budgetEstimate)}
                </span>
              </TableCell>
              <TableCell>
                <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>
                  {formatDate(project.targetDate)}
                </span>
              </TableCell>
              <TableCell>
                <Link
                  href={`/project/${project.id}`}
                  aria-label={`Ver detalle de ${project.name}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    color: "var(--brand-primary)",
                    background: "var(--brand-primary-light)",
                    transition: "background 0.15s ease",
                  }}
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
