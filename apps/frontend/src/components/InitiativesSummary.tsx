"use client";

import { Calendar, Security, Switch } from "@vibe/icons";
import { useProjects } from "@/lib/queries";

export function InitiativesSummary() {
  const { data: projects, isLoading } = useProjects();
  const activeProjects = projects?.filter((project) => project.status === "En proceso").length;

  return (
    <section className="initiatives-summary">
      <div className="section-heading">
        <h2>Resumen de iniciativas</h2>
        <p>Consulta rápidamente el estado de avance y solicitudes activas.</p>
      </div>
      <div className="initiatives-summary__grid">
        <article className="portfolio-card summary-card">
          <div className="summary-card__icon" aria-hidden>
            <Security size={20} />
          </div>
          <div>
            <div className="summary-card__label">Iniciativas en curso</div>
            <div className="summary-card__value">
              {isLoading ? "—" : `${activeProjects ?? 0} activas`}
            </div>
            <div className="summary-card__detail">
              {isLoading
                ? "Consultando iniciativas registradas"
                : `${projects?.length ?? 0} iniciativas totales registradas en portafolio`}
            </div>
          </div>
        </article>

        <article className="portfolio-card summary-card">
          <div className="summary-card__icon" aria-hidden>
            <Calendar size={20} />
          </div>
          <div>
            <div className="summary-card__label">Próxima entrega / Hito</div>
            <div className="summary-card__value">29 jun 2026</div>
            <div className="summary-card__detail">Portal de Proveedores</div>
          </div>
        </article>

        <article className="portfolio-card summary-card">
          <div className="summary-card__icon" aria-hidden>
            <Switch size={20} />
          </div>
          <div>
            <div className="summary-card__label">Aprobaciones y roles</div>
            <div className="summary-card__value">1 pendiente</div>
            <div className="summary-card__detail">
              Validación requerida para fase de Arquitectura
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
