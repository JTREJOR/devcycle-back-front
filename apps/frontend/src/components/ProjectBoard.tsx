"use client";

import Link from "next/link";
import { EmptyState, Loader, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@vibe/core";
import { useFlows, useProjects } from "@/lib/queries";
import { StatusPill } from "./StatusPill";
import { formatCurrency, formatDate } from "@/lib/format";

const COLUMNS = [
  { id: "name", title: "Proyecto", width: { min: 200, max: "3fr" as const } },
  { id: "stage", title: "Etapa actual", width: 150 },
  { id: "status", title: "Status", width: 120 },
  { id: "priority", title: "Prioridad", width: 90 },
  { id: "owner", title: "Responsable", width: 150 },
  { id: "budget", title: "Presupuesto", width: 130 },
  { id: "targetDate", title: "Fecha objetivo", width: 130 },
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
      emptyState={<EmptyState description="Todavía no hay proyectos en el portafolio." />}
      errorState={<EmptyState description="No se pudieron cargar los proyectos." />}
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
                    color: "var(--brand-accent)",
                    fontWeight: 600,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    background: stage?.color ?? "#676879",
                  }}
                >
                  {stage?.shortName ?? "—"}
                </span>
              </TableCell>
              <TableCell>
                <StatusPill status={project.status} />
              </TableCell>
              <TableCell>{project.priority}</TableCell>
              <TableCell>{project.owner}</TableCell>
              <TableCell>{formatCurrency(project.budgetEstimate)}</TableCell>
              <TableCell>{formatDate(project.targetDate)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
