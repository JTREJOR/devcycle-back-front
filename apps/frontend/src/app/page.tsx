"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@vibe/core";
import { Sun, Security, Calendar, Switch, Update, Bolt } from "@vibe/icons";
import { useProjects, useUsers } from "@/lib/queries";
import { useUiStore } from "@/store/uiStore";
import { ProjectBoard } from "@/components/ProjectBoard";
import { formatDate } from "@/lib/format";

export default function PortfolioPage() {
  const { data: projects = [], refetch, isRefetching } = useProjects();
  const { data: users = [] } = useUsers();
  const activeUserId = useUiStore((s) => s.activeUserId);

  const activeUser = users.find((u) => u.id === activeUserId);
  const userName = activeUser ? activeUser.name : "Argos Eyra Martinez Zeferino";

  // Fecha y hora formateada (estilo Imagen 1)
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateStr(
        now.toLocaleDateString("es-MX", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
      setCurrentTimeStr(
        now.toLocaleTimeString("es-MX", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const metrics = useMemo(() => {
    const active = projects.filter((p) => p.status === "En proceso").length;
    const sorted = [...projects].sort((a, b) => (a.targetDate > b.targetDate ? 1 : -1));
    const nextDelivery = sorted[0];

    return {
      activeCount: active || projects.length,
      nextDate: nextDelivery ? formatDate(nextDelivery.targetDate) : "15 feb 2027",
      nextProjectName: nextDelivery ? nextDelivery.name : "App Móvil de Autoservicio",
    };
  }, [projects]);

  return (
    <div>
      {/* Hero Card inspirado en la Imagen 1 */}
      <section className="hero-card">
        <div>
          <h1 className="hero-card__greeting">¡Buenos días, {userName}!</h1>
          <p className="hero-card__sub">
            Consulta el estado de tus iniciativas, aprobaciones y solicitudes del portafolio.
          </p>
        </div>
        <div className="hero-card__time-box">
          <div style={{ color: "#f59e0b", display: "flex", alignItems: "center" }}>
            <Icon icon={Sun} size={30} />
          </div>
          <div>
            <div className="hero-card__time">{currentTimeStr || "4:34 p.m."}</div>
            <div className="hero-card__date" style={{ textTransform: "capitalize" }}>
              {currentDateStr || "Jueves, 10 de septiembre de 2026"}
            </div>
          </div>
        </div>
      </section>

      {/* Resumen de iniciativas / métricas inspirado en Imagen 1 y 2 */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px 0", color: "#1e2022" }}>
          Resumen de iniciativas
        </h2>
        <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", margin: 0 }}>
          Consulta rápidamente el estado de avance y solicitudes activas.
        </p>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-card__icon-wrap">
            <Icon icon={Security} size={22} />
          </div>
          <div className="metric-card__body">
            <div className="metric-card__label">Iniciativas en curso</div>
            <div className="metric-card__value">{metrics.activeCount} activas</div>
            <div className="metric-card__desc">
              {projects.length} iniciativas totales registradas en portafolio
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card__icon-wrap">
            <Icon icon={Calendar} size={22} />
          </div>
          <div className="metric-card__body">
            <div className="metric-card__label">Próxima entrega / Hito</div>
            <div className="metric-card__value">{metrics.nextDate}</div>
            <div className="metric-card__desc">{metrics.nextProjectName}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card__icon-wrap">
            <Icon icon={Switch} size={22} />
          </div>
          <div className="metric-card__body">
            <div className="metric-card__label">Aprobaciones y roles</div>
            <div className="metric-card__value">1 pendiente</div>
            <div className="metric-card__desc">
              Validación requerida para fase de Arquitectura
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Principal inspirada en Imagen 1 y 2 */}
      <section className="board-card">
        <div className="board-card__header">
          <div>
            <h3 className="board-card__title">Iniciativas del Portafolio</h3>
            <p className="board-card__subtitle">
              Flujo homologado end-to-end embebido para Monday.com
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Link
              href="/discovery"
              className="btn-purple-solid"
              style={{ background: "var(--brand-accent)", borderColor: "var(--brand-accent)" }}
            >
              <Icon icon={Bolt} size={15} />
              <span>Nueva Iniciativa con Discovery IA</span>
            </Link>
            <button
              type="button"
              className="btn-purple-outline"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <Icon icon={Update} size={15} />
              <span>{isRefetching ? "Actualizando…" : "Actualizar"}</span>
            </button>
          </div>
        </div>

        <ProjectBoard />
      </section>
    </div>
  );
}
