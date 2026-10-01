"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@vibe/core";
import {
  Check,
  Close,
  Search,
  Filter,
  Bolt,
  Info,
  NavigationChevronRight,
  NavigationChevronLeft,
  File as FileIcon,
  Timeline,
  Person,
  CheckList,
  Security,
  Settings,
} from "@vibe/icons";
import { usePriorizacionStore, InitiativeItem } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";

// Catálogo completo de sistemas tecnológicos Liverpool
const SISTEMAS_DISPONIBLES = [
  "SAP ERP / Finance",
  "Pasarela de Pagos (Omnicanal)",
  "Core Transaccional",
  "Salesforce CRM",
  "BigQuery / Data Lake",
  "App Móvil Clientes (iOS / Android)",
  "Portal Web eCommerce",
  "API Gateway / Microservicios",
  "Punto de Venta (POS Tienda)",
  "WMS / BlueYonder Logística",
  "Mirakl Marketplace",
];

const CARTERAS = [
  "Todas",
  "Digital",
  "Negocios Financieros",
  "EPL / Logística",
  "Operaciones TI",
  "Comercial / Tiendas",
];

export default function BacklogTiPage() {
  const router = useRouter();
  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const confirmTIImpactStore = usePriorizacionStore((s) => s.confirmTIImpact);
  const selectedCarteraGlobal = usePriorizacionStore((s) => s.selectedCartera);
  const setSelectedCarteraGlobal = usePriorizacionStore((s) => s.setSelectedCartera);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Cartera de Pendientes");
  }, [setActiveMenuTitle]);

  const [selectedFilterCartera, setSelectedFilterCartera] = useState(
    selectedCarteraGlobal || "Todas"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Iniciativas que están en la etapa de Cartera de Pendientes o son Nuevas
  const pendingInitiatives = useMemo(() => {
    return initiatives.filter((i) => {
      const isPending = i.enCarteraPendientes || !i.impactoTIConfirmado || i.status === "Nueva";
      const matchesCartera =
        selectedFilterCartera === "Todas" || i.cartera === selectedFilterCartera;
      const matchesSearch =
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.solicitante.toLowerCase().includes(searchQuery.toLowerCase());
      return isPending && matchesCartera && matchesSearch;
    });
  }, [initiatives, selectedFilterCartera, searchQuery]);

  // Iniciativa seleccionada actualmente para revisión
  const [selectedId, setSelectedId] = useState<string>(
    pendingInitiatives[0]?.id || "prio-01"
  );

  useEffect(() => {
    if (pendingInitiatives.length > 0 && !pendingInitiatives.some((i) => i.id === selectedId)) {
      setSelectedId(pendingInitiatives[0].id);
    }
  }, [pendingInitiatives, selectedId]);

  const activeInitiative = useMemo(() => {
    return (
      initiatives.find((i) => i.id === selectedId) ||
      pendingInitiatives[0] ||
      initiatives[0]
    );
  }, [initiatives, selectedId, pendingInitiatives]);

  // Formulario de validación local
  const [requiereTI, setRequiereTI] = useState<boolean>(true);
  const [sistemasSeleccionados, setSistemasSeleccionados] = useState<string[]>(
    activeInitiative?.sistemasConfirmados ||
      activeInitiative?.sistemasInvolucrados || ["SAP ERP / Finance", "API Gateway / Microservicios"]
  );
  const [complejidadSugerida, setComplejidadSugerida] = useState<"Baja" | "Media" | "Alta">("Media");
  const [notasValidacion, setNotasValidacion] = useState("");

  // Sincronizar formulario al cambiar iniciativa
  useEffect(() => {
    if (activeInitiative) {
      setRequiereTI(activeInitiative.requiereTI ?? true);
      setSistemasSeleccionados(
        activeInitiative.sistemasConfirmados?.length
          ? activeInitiative.sistemasConfirmados
          : activeInitiative.sistemasInvolucrados?.length
          ? activeInitiative.sistemasInvolucrados
          : ["SAP ERP / Finance", "API Gateway / Microservicios"]
      );
    }
  }, [activeInitiative]);

  const toggleSistema = (sistema: string) => {
    setSistemasSeleccionados((prev) =>
      prev.includes(sistema) ? prev.filter((s) => s !== sistema) : [...prev, sistema]
    );
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Confirmar impacto TI y pasar a priorización
  const handleConfirmTI = () => {
    if (!activeInitiative) return;
    confirmTIImpactStore(activeInitiative.id, requiereTI, sistemasSeleccionados);

    if (requiereTI) {
      showNotification(
        `✓ Impacto en TI confirmado para "${activeInitiative.name}". Se transfirió al backlog activo de Priorización.`
      );
    } else {
      showNotification(
        `✕ La iniciativa "${activeInitiative.name}" fue descartada de la cartera tecnológica por no requerir TI.`
      );
    }
  };

  return (
    <div className="prio-page-container">
      {/* Toast Notification */}
      {notification && (
        <div className="prio-toast">
          <Icon icon={Check} size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. ENCABEZADO */}
      <div className="prio-header">
        <div>
          <div className="prio-breadcrumb">
            <Link href="/" className="prio-breadcrumb__link">
              Portafolio
            </Link>
            <span className="prio-breadcrumb__sep">&gt;</span>
            <span className="prio-breadcrumb__current">Cartera de Pendientes (Backlog TI)</span>
          </div>
          <h1 className="prio-header__title">Cartera de Pendientes — Validación de Impacto Tecnológico</h1>
          <p className="prio-header__subtitle">
            Filtro mandatorio previo a la priorización: el Portfolio Manager y Arquitectura validan el impacto en TI y sistemas afectados.
          </p>
        </div>

        <div className="prio-header__right">
          <Link href="/priorizacion" className="btn-purple-outline" style={{ fontSize: 12.5 }}>
            <Icon icon={Timeline} size={15} />
            <span>Ver Matriz de Priorización</span>
          </Link>
        </div>
      </div>

      {/* 2. TARJETAS DE MÉTRICAS */}
      <div className="prio-kpi-grid">
        <div className="prio-kpi-card">
          <div className="prio-kpi-card__icon" style={{ background: "#fdf2f8", color: "#db2777" }}>
            <Icon icon={CheckList} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">{pendingInitiatives.length}</div>
            <div className="prio-kpi-card__title">Pendientes de Validación</div>
            <div className="prio-kpi-card__sub">En cartera de pendientes</div>
          </div>
        </div>

        <div className="prio-kpi-card">
          <div className="prio-kpi-card__icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <Icon icon={Check} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">
              {initiatives.filter((i) => i.impactoTIConfirmado && i.requiereTI).length}
            </div>
            <div className="prio-kpi-card__title">Impacto TI Confirmado</div>
            <div className="prio-kpi-card__sub">Listas para priorizar</div>
          </div>
        </div>

        <div className="prio-kpi-card">
          <div className="prio-kpi-card__icon" style={{ background: "#fef3c7", color: "#d97706" }}>
            <Icon icon={Security} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">100%</div>
            <div className="prio-kpi-card__title">Cobertura de Arquitectura</div>
            <div className="prio-kpi-card__sub">Sistemas identificados</div>
          </div>
        </div>

        <div className="prio-kpi-card">
          <div className="prio-kpi-card__icon" style={{ background: "#ecfdf5", color: "#059669" }}>
            <Icon icon={Bolt} size={22} />
          </div>
          <div className="prio-kpi-card__info">
            <div className="prio-kpi-card__value">&lt; 24h</div>
            <div className="prio-kpi-card__title">Tiempo de Respuesta PMO</div>
            <div className="prio-kpi-card__sub">SLA de validación</div>
          </div>
        </div>
      </div>

      {/* 3. FILTROS POR CARTERA DE NEGOCIO Y BUSCADOR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
          background: "#ffffff",
          padding: "10px 16px",
          borderRadius: 8,
          border: "1px solid var(--color-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
            Cartera de Negocio:
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {CARTERAS.map((c) => (
              <button
                key={c}
                type="button"
                className={`tag-pill ${selectedFilterCartera === c ? "tag-pill--purple" : "tag-pill--gray"}`}
                style={{ cursor: "pointer", fontWeight: selectedFilterCartera === c ? 700 : 500 }}
                onClick={() => {
                  setSelectedFilterCartera(c);
                  setSelectedCarteraGlobal(c);
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="prio-search-box" style={{ maxWidth: 280 }}>
          <Icon icon={Search} size={15} />
          <input
            type="text"
            placeholder="Buscar por nombre o solicitante..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="prio-search-input"
          />
        </div>
      </div>

      {/* 4. LAYOUT PRINCIPAL SPLIT: LISTA IZQUIERDA + PANEL DE VALIDACIÓN DERECHO */}
      <div className="prio-main-split">
        {/* COLUMNA IZQUIERDA: LISTA DE INICIATIVAS PENDIENTES */}
        <div className="prio-table-panel" style={{ flex: 1 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-border)", background: "#f8fafc" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
              Iniciativas en Espera de Validación ({pendingInitiatives.length})
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>
              Selecciona una iniciativa para confirmar o descartar su impacto de TI.
            </div>
          </div>

          <div style={{ maxHeight: "calc(100vh - 380px)", overflowY: "auto" }}>
            {pendingInitiatives.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                <Icon icon={Check} size={32} />
                <p style={{ marginTop: 8, fontWeight: 600 }}>No hay iniciativas pendientes en esta cartera.</p>
                <p style={{ fontSize: 12 }}>Todas las iniciativas han sido evaluadas o validadas por TI.</p>
              </div>
            ) : (
              pendingInitiatives.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--color-border-subtle)",
                      cursor: "pointer",
                      background: isSelected ? "#f5f3ff" : "#ffffff",
                      borderLeft: isSelected ? "4px solid var(--brand-primary)" : "4px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: isSelected ? "var(--brand-primary)" : "#1e293b" }}>
                        {item.name}
                      </div>
                      <span className="tag-pill tag-pill--amber" style={{ fontSize: 10 }}>
                        Pendiente TI
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 6, fontSize: 11, color: "#64748b" }}>
                      <span><strong>Cartera:</strong> {item.cartera || item.area}</span>
                      <span>•</span>
                      <span><strong>Solicitante:</strong> {item.solicitante}</span>
                    </div>

                    <div style={{ fontSize: 11.5, color: "#475569", marginTop: 6, lineHeight: 1.35 }}>
                      {item.description.slice(0, 110)}...
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE CONFIRMACIÓN OBLIGATORIA */}
        <div className="prio-detail-panel" style={{ flex: 1.3, background: "#ffffff", padding: 24 }}>
          {activeInitiative ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--color-border)", paddingBottom: 16 }}>
                <div>
                  <span className="tag-pill tag-pill--purple" style={{ fontSize: 11, marginBottom: 6, display: "inline-block" }}>
                    {activeInitiative.cartera || activeInitiative.area}
                  </span>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    {activeInitiative.name}
                  </h2>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    Registrado por: <strong>{activeInitiative.solicitante}</strong> ({activeInitiative.solicitanteEmail || "email@liverpool.com.mx"})
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Fecha de Solicitud</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{activeInitiative.creationDate}</div>
                </div>
              </div>

              {/* Dolor de Negocio y Beneficio */}
              <div style={{ margin: "16px 0", background: "#f8fafc", padding: 14, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                  Necesidad de Negocio Planteada
                </div>
                <div style={{ fontSize: 12.5, color: "#1e293b", marginTop: 4, lineHeight: 1.45 }}>
                  {activeInitiative.description}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#334155" }}>
                  <span><strong>Beneficio Proyectado:</strong> {activeInitiative.beneficioEstimado}</span>
                  <span><strong>Meta KPI:</strong> {activeInitiative.kpiEsperado}</span>
                </div>
              </div>

              {/* SECCIÓN DE VALIDACIÓN MANDATORIA DE TI */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 18 }}>
                {/* 1. Confirmación de Requiere TI */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                    1. ¿Requiere intervención del equipo de Tecnologías de Información (TI)?
                  </label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="button"
                      className={`chip-select ${requiereTI ? "active" : ""}`}
                      style={{ padding: "8px 16px", fontSize: 12.5 }}
                      onClick={() => setRequiereTI(true)}
                    >
                      ✓ Sí, requiere desarrollo de software / infraestructura
                    </button>
                    <button
                      type="button"
                      className={`chip-select ${!requiereTI ? "active" : ""}`}
                      style={{ padding: "8px 16px", fontSize: 12.5 }}
                      onClick={() => setRequiereTI(false)}
                    >
                      ✕ No, es iniciativa operativa (Descartar de TI)
                    </button>
                  </div>
                </div>

                {/* 2. Sistemas y Plataformas Afectadas */}
                {requiereTI && (
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      2. Sistemas y Plataformas Afectadas (Validación de Arquitectura)
                    </label>
                    <p style={{ fontSize: 11.5, color: "#64748b", margin: "0 0 10px 0" }}>
                      Selecciona o confirma los sistemas corporativos que serán impactados por esta iniciativa:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {SISTEMAS_DISPONIBLES.map((sys) => {
                        const isSelected = sistemasSeleccionados.includes(sys);
                        return (
                          <button
                            key={sys}
                            type="button"
                            className={`chip-select ${isSelected ? "active" : ""}`}
                            style={{ fontSize: 11.5 }}
                            onClick={() => toggleSistema(sys)}
                          >
                            {isSelected ? "✓ " : "+ "}
                            {sys}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Clasificación de Complejidad */}
                {requiereTI && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        3. Complejidad TI
                      </label>
                      <select
                        className="config-card__input"
                        value={complejidadSugerida}
                        onChange={(e) => setComplejidadSugerida(e.target.value as "Baja" | "Media" | "Alta")}
                      >
                        <option value="Baja">Baja (Configuración / Integración simple)</option>
                        <option value="Media">Media (Nuevos microservicios / APIs)</option>
                        <option value="Alta">Alta (Core / SAP / Múltiples dominios)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Notas de Validación para la PMO
                      </label>
                      <input
                        type="text"
                        className="config-card__input"
                        placeholder="Ej. Validado con Arquitectura de Dominio Digital..."
                        value={notasValidacion}
                        onChange={(e) => setNotasValidacion(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* BOTONES DE CONFIRMACIÓN */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 28,
                  paddingTop: 18,
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: 11.5, color: "#64748b" }}>
                  Al confirmar, la iniciativa pasará formalmente a la <strong>Matriz de Priorización</strong>.
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="btn-purple-solid"
                    style={{
                      background: requiereTI ? "var(--brand-primary)" : "#dc2626",
                      borderColor: requiereTI ? "var(--brand-primary)" : "#dc2626",
                    }}
                    onClick={handleConfirmTI}
                  >
                    <Icon icon={Check} size={15} />
                    <span>
                      {requiereTI ? "Confirmar y Pasar a Priorización" : "Descartar Iniciativa de TI"}
                    </span>
                  </button>

                  <Link
                    href={`/priorizacion?id=${activeInitiative.id}`}
                    className="btn-purple-outline"
                    style={{ fontSize: 12 }}
                  >
                    <span>Ir a Priorizar</span>
                    <Icon icon={NavigationChevronRight} size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
              Selecciona una iniciativa de la lista para validarla.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
