"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon, Loader } from "@vibe/core";
import {
  Bolt,
  Send,
  Check,
  Close,
  Timeline,
  Security,
  Person,
  CheckList,
  Edit,
  NavigationChevronLeft,
  NavigationChevronRight,
  File as FileIcon,
  Alert,
} from "@vibe/icons";
import { usePriorizacionStore, InitiativeItem } from "@/store/priorizacionStore";
import { useUiStore } from "@/store/uiStore";

interface SizingMessage {
  id: string;
  sender: "gemini" | "bp";
  text: string;
  actionPayload?: {
    tps?: number;
    usuariosMensuales?: string;
    tipoArquitectura?: string;
    serviciosNube?: string[];
    horasDesarrolloEstimadas?: number;
    costoNubeMensualEstimado?: string;
  };
  actionLabel?: string;
  timestamp: string;
}

function EstimacionContent() {
  const searchParams = useSearchParams();
  const initiatives = usePriorizacionStore((s) => s.initiatives);
  const selectedId = usePriorizacionStore((s) => s.selectedInitiativeId);
  const setSelectedId = usePriorizacionStore((s) => s.setSelectedInitiativeId);
  const updateEstimacionTecnicaStore = usePriorizacionStore((s) => s.updateEstimacionTecnica);
  const setVoboLiderStore = usePriorizacionStore((s) => s.setVoboLider);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    setActiveMenuTitle("Estimación y VoBo");
  }, [setActiveMenuTitle]);

  // Si viene con query param ?id=..., sincronizar selección
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && initiatives.some((i) => i.id === idFromUrl)) {
      setSelectedId(idFromUrl);
    }
  }, [searchParams, initiatives, setSelectedId]);

  const activeInitiative = useMemo(() => {
    return initiatives.find((i) => i.id === selectedId) || initiatives[0];
  }, [initiatives, selectedId]);

  const [activeTab, setActiveTab] = useState<"sizing" | "hojaCostos" | "vobo">("sizing");
  const [notification, setNotification] = useState<string | null>(null);

  // Modal para solicitar refinamiento
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [refineRole, setRefineRole] = useState<"tecnico" | "arquitectura">("tecnico");
  const [refineFeedback, setRefineFeedback] = useState("");

  // Estado del chat interactivo de sizing
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<SizingMessage[]>([
    {
      id: "m-1",
      sender: "gemini",
      text: `Hola. Soy el Asistente Técnico Gemini de DevCycle. Analizando la iniciativa "${activeInitiative?.name}", necesito levantar algunas variables de dimensionamiento para calcular la infraestructura de Google Cloud y las horas de desarrollo.\n\n¿Cuál es el volumen estimado de transacciones por segundo (TPS) en horas pico y la concurrencia mensual?`,
      timestamp: "Hace un momento",
    },
  ]);

  // Sincronizar mensajes cuando cambia la iniciativa
  useEffect(() => {
    if (activeInitiative) {
      setMessages([
        {
          id: `m-init-${activeInitiative.id}`,
          sender: "gemini",
          text: `Hola. Soy el Asistente Técnico Gemini de DevCycle. Analizando la iniciativa "${activeInitiative.name}" (${activeInitiative.cartera || activeInitiative.area}), he cargado el dolor de negocio y sistemas afectados: ${activeInitiative.sistemasInvolucrados?.join(", ") || "SAP ERP"}.\n\n¿Cuál es el volumen estimado de transacciones por segundo (TPS) en horas pico y los usuarios mensuales proyectados?`,
          timestamp: "Hace un momento",
        },
      ]);
    }
  }, [activeInitiative]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSendMessage = (customText?: string) => {
    const text = (customText || chatInput).trim();
    if (!text) return;

    const userMsg: SizingMessage = {
      id: `u-${Date.now()}`,
      sender: "bp",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botText = "";
      let payload: SizingMessage["actionPayload"] | undefined;

      const lower = text.toLowerCase();
      if (lower.includes("tps") || lower.includes("transaccion") || lower.includes("usuarios") || lower.includes("trafico")) {
        botText =
          "Excelente. Con base en un promedio de 450 TPS pico y 3.2M de usuarios mensuales, el modelo recomienda:\n• Google Cloud Run (contenedores auto-escalables 5 a 30 instancias)\n• Cloud SQL PostgreSQL High Availability con réplica de lectura\n• Pub/Sub para colas de eventos hacia SAP\n• BigQuery para auditoría y reportería.\n\nHe calculado 520 horas de desarrollo (Front, Back y QA) y un costo estimado de infraestructura de $3,800 USD/mes. ¿Deseas aplicar estos valores a la Hoja de Costos?";
        payload = {
          tps: 450,
          usuariosMensuales: "3.2M",
          tipoArquitectura: "Microservicios Serverless en Google Cloud",
          serviciosNube: ["Cloud Run", "Cloud SQL HA", "Pub/Sub", "BigQuery"],
          horasDesarrolloEstimadas: 520,
          costoNubeMensualEstimado: "$3,800 USD/mes",
        };
      } else if (lower.includes("resiliencia") || lower.includes("alta disponibilidad") || lower.includes("sla")) {
        botText =
          "Entendido. Para cumplir un SLA del 99.95%, se provisionará despliegue multi-zona en us-central1 y failover automático a us-east4. Esto suma 60 horas de configuración FinOps y Terraform.";
        payload = {
          horasDesarrolloEstimadas: 580,
          costoNubeMensualEstimado: "$4,200 USD/mes",
        };
      } else {
        botText = `He tomado nota de "${text}". Los requerimientos han sido integrados a la matriz de dimensionamiento técnico para evaluación del Líder Técnico y Arquitectura.`;
        payload = {
          horasDesarrolloEstimadas: 480,
          costoNubeMensualEstimado: "$3,200 USD/mes",
        };
      }

      const botMsg: SizingMessage = {
        id: `b-${Date.now()}`,
        sender: "gemini",
        text: botText,
        actionPayload: payload,
        actionLabel: payload ? "✨ Aplicar dimensionamiento a Hoja de Costos" : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleApplySizing = (payload?: SizingMessage["actionPayload"]) => {
    if (!payload || !activeInitiative) return;
    updateEstimacionTecnicaStore(activeInitiative.id, {
      ...payload,
      chatSizingCompletado: true,
    });
    showNotification("✓ Variables de dimensionamiento aplicadas a la Hoja de Costos.");
    setActiveTab("hojaCostos");
  };

  const handleApproveVoBo = (rol: "tecnico" | "arquitectura") => {
    if (!activeInitiative) return;
    setVoboLiderStore(activeInitiative.id, rol, "aprobado");
    showNotification(`✓ VoBo de Líder ${rol === "tecnico" ? "Técnico" : "de Arquitectura"} otorgado exitosamente.`);
  };

  const handleOpenRefineModal = (rol: "tecnico" | "arquitectura") => {
    setRefineRole(rol);
    setRefineFeedback("");
    setIsRefineModalOpen(true);
  };

  const handleSubmitRefine = () => {
    if (!activeInitiative) return;
    setVoboLiderStore(activeInitiative.id, refineRole, "refinamiento", refineFeedback);
    setIsRefineModalOpen(false);
    showNotification(
      `✎ Se solicitó refinamiento de estimación (${refineRole === "tecnico" ? "Técnico" : "Arquitectura"}). Notificación enviada al Business Partner.`
    );
  };

  const estData = activeInitiative?.estimacionTecnica || {
    tps: 350,
    usuariosMensuales: "2.4M",
    tipoArquitectura: "Microservicios Serverless en Google Cloud",
    serviciosNube: ["Cloud Run", "Cloud SQL", "Pub/Sub", "BigQuery"],
    horasDesarrolloEstimadas: 480,
    costoNubeMensualEstimado: "$3,200 USD/mes",
    voboLiderTecnico: "pendiente",
    voboLiderArquitectura: "pendiente",
  };

  const isFullyApproved =
    estData.voboLiderTecnico === "aprobado" && estData.voboLiderArquitectura === "aprobado";

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
            <span className="prio-breadcrumb__current">Estimación y Validación Técnica</span>
          </div>
          <h1 className="prio-header__title">Estimación Técnica y Aprobación de Arquitectura</h1>
          <p className="prio-header__subtitle">
            Dimensionamiento guiado por IA (Gemini), desglose de Hoja de Costos y VoBo dual de Arquitectura y Desarrollo.
          </p>
        </div>

        <div className="prio-header__right">
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/priorizacion" className="btn-purple-outline" style={{ fontSize: 12.5 }}>
              <Icon icon={CheckList} size={15} />
              <span>Volver a Priorización</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SELECTOR DE INICIATIVA ACTUAL */}
      <div
        style={{
          background: "#ffffff",
          padding: "12px 18px",
          borderRadius: 8,
          border: "1px solid var(--color-border)",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Iniciativa en Revisión:
          </span>
          <select
            className="config-card__input"
            style={{ width: 380, fontWeight: 700 }}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {initiatives.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.cartera || i.area})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Etapa:</span>
          <span className="prio-stage-pill prio-stage-pill--est">2. Estimación</span>
          <span style={{ fontSize: 12, color: "#64748b" }}>Solicitante:</span>
          <strong>{activeInitiative.solicitante}</strong>
        </div>
      </div>

      {/* 2. PESTAÑAS DE TRABAJO */}
      <div className="prio-tabs" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`prio-tab ${activeTab === "sizing" ? "prio-tab--active" : ""}`}
          onClick={() => setActiveTab("sizing")}
        >
          1. Sizing Asistido con IA (Gemini)
        </button>
        <button
          type="button"
          className={`prio-tab ${activeTab === "hojaCostos" ? "prio-tab--active" : ""}`}
          onClick={() => setActiveTab("hojaCostos")}
        >
          2. Canvas y Hoja de Costos
        </button>
        <button
          type="button"
          className={`prio-tab ${activeTab === "vobo" ? "prio-tab--active" : ""}`}
          onClick={() => setActiveTab("vobo")}
        >
          3. Doble Aprobación (VoBo Técnico y Arquitectura) {isFullyApproved && "✓"}
        </button>
      </div>

      {/* 3. CONTENIDO DE LAS PESTAÑAS */}

      {/* PESTAÑA 1: SIZING CON IA */}
      {activeTab === "sizing" && (
        <div className="prio-main-split">
          <div className="prio-table-panel" style={{ flex: 1.2 }}>
            <div className="dataswat-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div className="dataswat-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: "var(--brand-primary-light)",
                      color: "var(--brand-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon icon={Bolt} size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2022" }}>
                      Agente de Sizing Técnico (Gemini AI)
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      Cálculo predictivo de infraestructura GCP y esfuerzo de desarrollo
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensajes del chat */}
              <div className="dataswat-messages" style={{ flex: 1, minHeight: 380, maxHeight: 460 }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={msg.sender === "gemini" ? "dataswat-bubble-bot" : "dataswat-bubble-user"}
                  >
                    {msg.sender === "gemini" && (
                      <div className="dataswat-bubble-bot__header">
                        <Icon icon={Bolt} size={13} />
                        <span>Gemini Sizing Engine</span>
                      </div>
                    )}
                    <div style={{ whiteSpace: "pre-line", fontSize: 12.5, lineHeight: 1.45 }}>
                      {msg.text}
                    </div>

                    {msg.actionLabel && msg.actionPayload && (
                      <div style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          className="btn-ai-assist"
                          onClick={() => handleApplySizing(msg.actionPayload)}
                        >
                          <Icon icon={Check} size={12} />
                          <span>{msg.actionLabel}</span>
                        </button>
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: 10,
                        marginTop: 4,
                        textAlign: msg.sender === "bp" ? "right" : "left",
                        color: msg.sender === "bp" ? "rgba(255,255,255,0.7)" : "var(--color-text-muted)",
                      }}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="dataswat-bubble-bot" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Loader size={14} />
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                      Gemini está calculando la estimación y costos de nube...
                    </span>
                  </div>
                )}
              </div>

              {/* Sugerencias Rápidas */}
              <div
                style={{
                  padding: "8px 16px",
                  borderTop: "1px solid var(--color-border-subtle)",
                  display: "flex",
                  gap: 6,
                  overflowX: "auto",
                  background: "#fafbfc",
                }}
              >
                <button
                  type="button"
                  className="tag-pill tag-pill--purple"
                  style={{ cursor: "pointer", fontSize: 11 }}
                  onClick={() => handleSendMessage("Estimamos 450 TPS pico y 3.2M de usuarios al mes.")}
                >
                  ⚡ Cargar métricas de tráfico esperadas
                </button>
                <button
                  type="button"
                  className="tag-pill tag-pill--purple"
                  style={{ cursor: "pointer", fontSize: 11 }}
                  onClick={() => handleSendMessage("Requerimos disponibilidad del 99.95% con réplica multi-región.")}
                >
                  🛡️ Alta Resiliencia 99.95%
                </button>
              </div>

              {/* Input */}
              <div className="dataswat-footer">
                <div className="dataswat-input-box">
                  <input
                    type="text"
                    className="dataswat-input-box__text"
                    placeholder="Escribe detalles de tráfico, transacciones o componentes..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    type="button"
                    className="dataswat-btn-send"
                    onClick={() => handleSendMessage()}
                    title="Enviar al agente"
                  >
                    <Icon icon={Send} size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Lateral: Parámetros Extraídos */}
          <div className="prio-detail-panel" style={{ flex: 1, background: "#ffffff", padding: 20 }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
              Dimensionamiento Actual de la Iniciativa
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Tráfico y Concurrencia
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--brand-primary)", marginTop: 2 }}>
                  {estData.tps} TPS pico · {estData.usuariosMensuales} usuarios/mes
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                  Arquitectura Propuesta
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginTop: 2 }}>
                  {estData.tipoArquitectura}
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
                  {estData.serviciosNube?.map((s) => (
                    <span key={s} className="tag-pill tag-pill--blue" style={{ fontSize: 10.5 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#eff6ff", padding: 12, borderRadius: 8, border: "1px solid #bfdbfe" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>
                    Horas de Desarrollo
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#1e40af", marginTop: 2 }}>
                    {estData.horasDesarrolloEstimadas} hrs
                  </div>
                  <div style={{ fontSize: 11, color: "#60a5fa" }}>~3 Sprints de equipo</div>
                </div>

                <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 8, border: "1px solid #a7f3d0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>
                    Costo Cloud Estimado
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#065f46", marginTop: 2 }}>
                    {estData.costoNubeMensualEstimado}
                  </div>
                  <div style={{ fontSize: 11, color: "#34d399" }}>Building API GCP</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn-purple-solid"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setActiveTab("hojaCostos")}
                >
                  <span>Ver Desglose en Hoja de Costos</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: HOJA DE COSTOS Y CANVAS */}
      {activeTab === "hojaCostos" && (
        <div style={{ background: "#ffffff", padding: 24, borderRadius: 8, border: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <span className="tag-pill tag-pill--purple" style={{ marginBottom: 6, display: "inline-block" }}>
                Charter de Iniciativa · Hoja de Costos
              </span>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                {activeInitiative.name}
              </h2>
              <p style={{ margin: "4px 0 0 0", fontSize: 12.5, color: "#64748b" }}>
                Desglose financiero e inversión de esfuerzo calculada por la herramienta asistida.
              </p>
            </div>

            <button
              type="button"
              className="btn-purple-solid"
              onClick={() => setActiveTab("vobo")}
            >
              <span>Avanzar a Doble VoBo</span>
              <Icon icon={NavigationChevronRight} size={15} />
            </button>
          </div>

          {/* Tabla Desglose de Horas Hombre */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
              1. Desglose de Horas Hombre por Perfil Técnico
            </h4>
            <table className="prio-table">
              <thead>
                <tr>
                  <th>Rol / Perfil</th>
                  <th>Actividades Principales</th>
                  <th style={{ textAlign: "center" }}>Sprints</th>
                  <th style={{ textAlign: "center" }}>Horas</th>
                  <th style={{ textAlign: "right" }}>Costo Estimado MXN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Líder Técnico / Arquitectura</strong></td>
                  <td>Diseño de microservicios, seguridad, configuración de GCP y contratos de API</td>
                  <td style={{ textAlign: "center" }}>3</td>
                  <td style={{ textAlign: "center" }}>80 hrs</td>
                  <td style={{ textAlign: "right" }}>$96,000</td>
                </tr>
                <tr>
                  <td><strong>Desarrolladores Frontend (NextJS/React)</strong></td>
                  <td>Vistas interactivas, integración de Vibe UI y flujos de usuario</td>
                  <td style={{ textAlign: "center" }}>3</td>
                  <td style={{ textAlign: "center" }}>160 hrs</td>
                  <td style={{ textAlign: "right" }}>$160,000</td>
                </tr>
                <tr>
                  <td><strong>Desarrolladores Backend (Node/NestJS)</strong></td>
                  <td>Microservicios transaccionales, orquestación y conectores SAP</td>
                  <td style={{ textAlign: "center" }}>3</td>
                  <td style={{ textAlign: "center" }}>160 hrs</td>
                  <td style={{ textAlign: "right" }}>$160,000</td>
                </tr>
                <tr>
                  <td><strong>Ingeniería QA & Automatización</strong></td>
                  <td>Pruebas unitarias, de integración, carga y regresión automatizada</td>
                  <td style={{ textAlign: "center" }}>3</td>
                  <td style={{ textAlign: "center" }}>80 hrs</td>
                  <td style={{ textAlign: "right" }}>$72,000</td>
                </tr>
                <tr style={{ background: "#f8fafc", fontWeight: 800 }}>
                  <td colSpan={3}>TOTAL DE ESFUERZO DE DESARROLLO</td>
                  <td style={{ textAlign: "center", color: "var(--brand-primary)" }}>{estData.horasDesarrolloEstimadas} hrs</td>
                  <td style={{ textAlign: "right", color: "var(--brand-primary)" }}>$488,000 MXN</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabla de Infraestructura Cloud */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>
              2. Infraestructura y Servicios de Nube (Google Cloud Platform)
            </h4>
            <table className="prio-table">
              <thead>
                <tr>
                  <th>Servicio GCP</th>
                  <th>Especificación / Dimensionamiento</th>
                  <th style={{ textAlign: "center" }}>Concurrencia</th>
                  <th style={{ textAlign: "right" }}>Costo Mensual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cloud Run (Serverless Cómputo)</strong></td>
                  <td>Auto-escalable de 2 a 25 instancias, 2 vCPU, 4GB RAM</td>
                  <td style={{ textAlign: "center" }}>{estData.tps} TPS</td>
                  <td style={{ textAlign: "right" }}>$1,200 USD/mes</td>
                </tr>
                <tr>
                  <td><strong>Cloud SQL PostgreSQL HA</strong></td>
                  <td>Instancia db-custom-4-16384 con réplica standby síncrona</td>
                  <td style={{ textAlign: "center" }}>Alta Disponibilidad</td>
                  <td style={{ textAlign: "right" }}>$950 USD/mes</td>
                </tr>
                <tr>
                  <td><strong>Pub/Sub & Cloud Storage</strong></td>
                  <td>Colas de mensajería asíncronas y almacenamiento de archivos</td>
                  <td style={{ textAlign: "center" }}>10M eventos/mes</td>
                  <td style={{ textAlign: "right" }}>$450 USD/mes</td>
                </tr>
                <tr>
                  <td><strong>BigQuery & Cloud Monitoring</strong></td>
                  <td>Almacén de datos analítico y telemetría de observabilidad</td>
                  <td style={{ textAlign: "center" }}>2.4M queries/mes</td>
                  <td style={{ textAlign: "right" }}>$600 USD/mes</td>
                </tr>
                <tr style={{ background: "#f8fafc", fontWeight: 800 }}>
                  <td colSpan={3}>TOTAL INFRAESTRUCTURA CLOUD (MENSUAL)</td>
                  <td style={{ textAlign: "right", color: "#059669" }}>{estData.costoNubeMensualEstimado}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: DOBLE APROBACIÓN (VOBO DUAL) */}
      {activeTab === "vobo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              background: isFullyApproved ? "#ecfdf5" : "#f8fafc",
              border: isFullyApproved ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
              padding: 16,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isFullyApproved ? "#065f46" : "#1e293b" }}>
                {isFullyApproved
                  ? "✓ Estimación Aprobada por Ambos Líderes (Lista para Ejecución)"
                  : "Pendiente de Visto Bueno Dual (Arquitectura y Desarrollo)"}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                Se requiere la validación simultánea antes de transferir a Jira y Monday para asignación de sprints.
              </div>
            </div>

            {isFullyApproved && (
              <span className="tag-pill tag-pill--green" style={{ fontSize: 12, padding: "4px 12px" }}>
                ✓ VoBo Completo
              </span>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Tarjeta 1: Líder Técnico (Desarrollo) */}
            <div className="board-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "#eff6ff",
                      color: "#1e40af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon icon={Person} size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                      Líder Técnico (Desarrollo)
                    </h3>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Validación de horas, perfiles y sprints
                    </div>
                  </div>
                </div>

                {estData.voboLiderTecnico === "aprobado" ? (
                  <span className="tag-pill tag-pill--green">✓ Aprobado</span>
                ) : estData.voboLiderTecnico === "refinamiento" ? (
                  <span className="tag-pill tag-pill--amber">✎ Refinamiento</span>
                ) : (
                  <span className="tag-pill tag-pill--gray">Pendiente</span>
                )}
              </div>

              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, fontSize: 12, color: "#475569", marginBottom: 18, lineHeight: 1.45 }}>
                • <strong>Horas propuestas:</strong> {estData.horasDesarrolloEstimadas} hrs.<br />
                • <strong>Equipo estimado:</strong> 1 TL, 2 Front, 2 Back, 1 QA.<br />
                • <strong>Factibilidad técnica:</strong> Viable con el stack corporativo NextJS / NestJS.
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="btn-purple-solid"
                  style={{
                    background: estData.voboLiderTecnico === "aprobado" ? "#10b981" : "var(--brand-primary)",
                    borderColor: estData.voboLiderTecnico === "aprobado" ? "#10b981" : "var(--brand-primary)",
                    flex: 1,
                    justifyContent: "center",
                  }}
                  onClick={() => handleApproveVoBo("tecnico")}
                >
                  <Icon icon={Check} size={15} />
                  <span>{estData.voboLiderTecnico === "aprobado" ? "Aprobado ✓" : "Dar VoBo Técnico"}</span>
                </button>

                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => handleOpenRefineModal("tecnico")}
                >
                  <Icon icon={Edit} size={14} />
                  <span>Refinar</span>
                </button>
              </div>
            </div>

            {/* Tarjeta 2: Líder de Arquitectura (Nube & Datos) */}
            <div className="board-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "#f5f3ff",
                      color: "#6b21a8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon icon={Security} size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                      Líder de Arquitectura
                    </h3>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>
                      Validación de componentes, nube y seguridad
                    </div>
                  </div>
                </div>

                {estData.voboLiderArquitectura === "aprobado" ? (
                  <span className="tag-pill tag-pill--green">✓ Aprobado</span>
                ) : estData.voboLiderArquitectura === "refinamiento" ? (
                  <span className="tag-pill tag-pill--amber">✎ Refinamiento</span>
                ) : (
                  <span className="tag-pill tag-pill--gray">Pendiente</span>
                )}
              </div>

              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, fontSize: 12, color: "#475569", marginBottom: 18, lineHeight: 1.45 }}>
                • <strong>Infraestructura:</strong> Google Cloud Platform ({estData.costoNubeMensualEstimado}).<br />
                • <strong>Servicios:</strong> {estData.serviciosNube?.join(", ") || "Cloud Run, Cloud SQL"}.<br />
                • <strong>Patrón:</strong> Desacoplado con APIs y mensajería Pub/Sub.
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="btn-purple-solid"
                  style={{
                    background: estData.voboLiderArquitectura === "aprobado" ? "#10b981" : "#8b5cf6",
                    borderColor: estData.voboLiderArquitectura === "aprobado" ? "#10b981" : "#8b5cf6",
                    flex: 1,
                    justifyContent: "center",
                  }}
                  onClick={() => handleApproveVoBo("arquitectura")}
                >
                  <Icon icon={Check} size={15} />
                  <span>{estData.voboLiderArquitectura === "aprobado" ? "Aprobado ✓" : "Dar VoBo Arquitectura"}</span>
                </button>

                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => handleOpenRefineModal("arquitectura")}
                >
                  <Icon icon={Edit} size={14} />
                  <span>Refinar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Observaciones de Refinamiento si existen */}
          {estData.observacionesRefinamiento && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: 14, borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#92400e", fontWeight: 700, fontSize: 12.5 }}>
                <Icon icon={Alert} size={16} />
                <span>Observaciones para Refinamiento de Estimación:</span>
              </div>
              <p style={{ margin: "6px 0 0 0", fontSize: 12.5, color: "#78350f" }}>
                {estData.observacionesRefinamiento}
              </p>
            </div>
          )}

          {/* Botón de Formalización Final */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <Link
              href="/priorizacion"
              className="btn-purple-solid"
              style={{
                background: isFullyApproved ? "#10b981" : "#94a3b8",
                borderColor: isFullyApproved ? "#10b981" : "#94a3b8",
                cursor: isFullyApproved ? "pointer" : "not-allowed",
              }}
              onClick={(e) => {
                if (!isFullyApproved) {
                  e.preventDefault();
                  showNotification("Se requiere el VoBo de ambos líderes (Técnico y Arquitectura) para continuar.");
                } else {
                  showNotification("Iniciativa autorizada y lista para transferencia a ejecución.");
                }
              }}
            >
              <Icon icon={Check} size={16} />
              <span>Generar Charter y Pasar a Ejecución</span>
            </Link>
          </div>
        </div>
      )}

      {/* MODAL DE SOLICITUD DE REFINAMIENTO DE ESTIMACIÓN */}
      {isRefineModalOpen && (
        <div className="prio-modal-overlay">
          <div className="prio-modal-card" style={{ maxWidth: 500, padding: 24 }} role="dialog">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>
                  Solicitar Refinamiento de Estimación
                </h3>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  Rol solicitante: Líder {refineRole === "tecnico" ? "Técnico" : "de Arquitectura"}
                </div>
              </div>
              <button
                type="button"
                className="main-menu-panel__close-btn"
                onClick={() => setIsRefineModalOpen(false)}
              >
                <Icon icon={Close} size={18} />
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: "#475569", margin: "0 0 14px 0" }}>
              Indica qué variables deben ajustarse (p. ej. reducir alcance en horas de frontend, optimizar cómputo de nube o replantear el conector con SAP):
            </p>

            <textarea
              rows={4}
              className="config-card__input"
              style={{ resize: "vertical", width: "100%", marginBottom: 18 }}
              placeholder="Ej. Reducir instancias standby en GCP a 1 región para Fase 1..."
              value={refineFeedback}
              onChange={(e) => setRefineFeedback(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                className="btn-purple-outline"
                onClick={() => setIsRefineModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-purple-solid"
                style={{ background: "#d97706", borderColor: "#d97706" }}
                onClick={handleSubmitRefine}
              >
                <span>Enviar Refinamiento</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EstimacionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Cargando módulo de estimación...</div>}>
      <EstimacionContent />
    </Suspense>
  );
}
