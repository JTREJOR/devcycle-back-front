"use client";

import Link from "next/link";
import { EmptyState, Loader } from "@vibe/core";
import { Bolt, Show } from "@vibe/icons";
import type { ProjectStatus } from "@devcycle/shared";
import { useFlows, useProjects } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_CLASS: Record<ProjectStatus, string> = {
  "En proceso": "status-badge--in-progress",
  "Por iniciar": "status-badge--not-started",
  Atrasado: "status-badge--delayed",
  Finalizado: "status-badge--finished",
  "No aplica": "status-badge--not-applicable",
};

export function ProjectBoard() {
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: projectsError,
  } = useProjects();
  const {
    data: stages,
    isLoading: loadingStages,
    isError: stagesError,
  } = useFlows();
  const isLoading = loadingProjects || loadingStages;
  const isError = projectsError || stagesError;

  return (
    <section className="portfolio-card project-board">
      <div className="project-board__header">
        <div className="section-heading">
          <h2>Iniciativas del Portafolio</h2>
          <p>Flujo homologado end-to-end embebido para Monday.com</p>
        </div>
        <button className="project-board__create-button" type="button">
          <Bolt size={16} aria-hidden />
          Crear nueva iniciativa
        </button>
      </div>

      {isLoading ? (
        <div className="project-board__state">
          <Loader size={48} />
        </div>
      ) : isError ? (
        <div className="project-board__state">
          <EmptyState description="No se pudieron cargar las iniciativas." />
        </div>
      ) : !projects?.length ? (
        <div className="project-board__state">
          <EmptyState description="Todavía no hay iniciativas en el portafolio." />
        </div>
      ) : (
        <div className="project-board__table-scroll">
          <table className="initiatives-table">
            <thead>
              <tr>
                <th>Iniciativa / Proyecto</th>
                <th>Etapa actual</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Responsable</th>
                <th>Presupuesto</th>
                <th>Fecha objetivo</th>
                <th className="initiatives-table__actions-heading">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const stage = stages?.find((item) => item.id === project.currentStageId);
                return (
                  <tr key={project.id}>
                    <td>
                      <Link className="project-name-link" href={`/project/${project.id}`}>
                        {project.name}
                      </Link>
                      <div className="project-area">{project.area}</div>
                    </td>
                    <td>
                      <span
                        className="stage-badge"
                        style={{ backgroundColor: stage?.color ?? "#676879" }}
                      >
                        {stage?.shortName ?? "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{project.priority}</td>
                    <td>{project.owner}</td>
                    <td>{formatCurrency(project.budgetEstimate)}</td>
                    <td>{formatDate(project.targetDate)}</td>
                    <td className="initiatives-table__actions">
                      <Link
                        className="project-action-link"
                        href={`/project/${project.id}`}
                        aria-label={`Ver ${project.name}`}
                        title={`Ver ${project.name}`}
                      >
                        <Show size={16} aria-hidden />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
