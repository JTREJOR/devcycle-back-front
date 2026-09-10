"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, Loader } from "@vibe/core";
import {
  Bolt,
  Send,
  Upload,
  Check,
  NavigationChevronLeft,
  NavigationChevronRight,
  Timeline,
  Security,
  File as FileIcon,
  Update,
} from "@vibe/icons";
import { useUiStore } from "@/store/uiStore";

// Unidades de negocio típicas
const BUSINESS_UNITS = [
  "Omnicanalidad y Tiendas",
  "Banca Digital y Servicios Financieros",
  "Crédito y Cobranza",
  "Logística y Cadena de Suministro",
  "Finanzas y Contabilidad",
  "Mercadotecnia y Lealtad",
  "Recursos Humanos",
  "Operaciones TI",
];

// Catálogo de sistemas corporativos
const SYSTEMS_CATALOG = [
  { id: "sap", name: "SAP / ERP Central" },
  { id: "crm", name: "CRM Salesforce" },
  { id: "core", name: "Core Transaccional" },
  { id: "mobile", name: "App Móvil Clientes" },
  { id: "portal", name: "Portal Web eCommerce" },
  { id: "dwh", name: "BigQuery / Data Warehouse" },
  { id: "payments", name: "Pasarela de Pagos" },
  { id: "apis", name: "API Gateway / Microservicios" },
  { id: "pos", name: "Punto de Venta (POS Tienda)" },
];

const BENEFIT_TYPES = [
  "Ahorro directo de costos",
  "Nuevos ingresos de negocio",
  "Eficiencia en Horas / Hombre",
  "Reducción de tiempos de ciclo",
  "Mitigación de riesgos y compliance",
];

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  actionPayload?: Partial<DiscoveryState>;
  actionLabel?: string;
  timestamp: string;
}

interface DiscoveryState {
  title: string;
  businessUnit: string;
  requester: string;
  needDescription: string;
  hasItImpact: "si" | "no" | "evaluacion";
  selectedSystems: string[];
  architectureReference: string;
  benefitType: string;
  estimatedSavingsMxn: string;
  savedHoursPerMonth: string;
  successKpi: string;
}

const INITIAL_STATE: DiscoveryState = {
  title: "Automatización de Conciliación y Liquidación Omnicanal",
  businessUnit: "Finanzas y Contabilidad",
  requester: "Argos Eyra Martinez Zeferino",
  needDescription:
    "El proceso actual de conciliación entre las ventas en tienda física, portal web y pasarelas de pago se realiza mediante hojas de cálculo manuales, lo que causa demoras de hasta 48 horas en el cierre contable y discrepancias financieras.",
  hasItImpact: "si",
  selectedSystems: ["sap", "payments", "core", "apis"],
  architectureReference: "Integración vía Webhooks hacia SAP Finance con base de datos intermedia en BigQuery.",
  benefitType: "Eficiencia en Horas / Hombre",
  estimatedSavingsMxn: "3500000",
  savedHoursPerMonth: "140",
  successKpi: "Reducción del tiempo de conciliación de 48h a 15 minutos en tiempo real",
};

export default function DiscoveryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<DiscoveryState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Estado del chat inteligente DataSwat AI
  const [chatDraft, setChatDraft] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "¡Hola! Soy tu asistente DataSwat AI. Te guiaré paso a paso en el descubrimiento y refinamiento de tu iniciativa para estructurar el caso de negocio y asegurar que llegue perfectamente perfilada al Backlog de la PMO.",
      timestamp: "Hace un momento",
    },
    {
      id: "msg-2",
      sender: "bot",
      text: "Para comenzar, puedes escribir una breve idea de lo que necesitas resolver, o hacer clic en 'Adjuntar documento' para que extraiga automáticamente objetivos, sistemas y beneficios monetizados.",
      timestamp: "Hace un momento",
    },
  ]);

  // Manejo de chips de sistemas
  const toggleSystem = (systemId: string) => {
    setForm((prev) => {
      const exists = prev.selectedSystems.includes(systemId);
      return {
        ...prev,
        selectedSystems: exists
          ? prev.selectedSystems.filter((s) => s !== systemId)
          : [...prev.selectedSystems, systemId],
      };
    });
  };

  // Cálculo del score de refinamiento (Blueprint Readiness)
  const calculateReadinessScore = () => {
    let score = 20;
    if (form.title.trim().length > 8) score += 20;
    if (form.needDescription.trim().length > 30) score += 20;
    if (form.selectedSystems.length > 0) score += 20;
    if (Number(form.estimatedSavingsMxn) > 0 || Number(form.savedHoursPerMonth) > 0) score += 20;
    return score;
  };

  // Envío de mensaje en el chat DataSwat
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? chatDraft).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatDraft("");
    setIsAiTyping(true);

    // Respuesta inteligente simulada según contexto
    setTimeout(() => {
      let botReply = "";
      let payload: Partial<DiscoveryState> | undefined;

      const lower = text.toLowerCase();
      if (lower.includes("beneficio") || lower.includes("monetiz") || lower.includes("ahorro")) {
        botReply =
          "He proyectado un modelo de monetización para este tipo de iniciativas: calculo un ahorro anual estimado de $4,200,000 MXN derivado de la reducción de 160 hrs/mes de trabajo manual y prevención de multas operativas. ¿Deseas aplicar estos valores a tu iniciativa?";
        payload = {
          benefitType: "Ahorro directo de costos",
          estimatedSavingsMxn: "4200000",
          savedHoursPerMonth: "160",
          successKpi: "99.8% de conciliaciones automáticas sin intervención manual",
        };
      } else if (lower.includes("sistema") || lower.includes("ti") || lower.includes("arquitectura")) {
        botReply =
          "Analizando la necesidad, confirmo que SI tiene impacto de TI. Identifico que intervienen: SAP ERP para la contabilidad, Pasarela de Pagos para la captura de transacciones y Core Transaccional para saldos.";
        payload = {
          hasItImpact: "si",
          selectedSystems: ["sap", "payments", "core", "apis"],
          architectureReference: "Microservicio orquestador con colas de mensajería hacia SAP.",
        };
      } else if (lower.includes("archivo") || lower.includes("subir") || lower.includes("pdf") || lower.includes("doc")) {
        botReply =
          "Simulando análisis del archivo adjunto 'Requerimiento-Liquidacion-2026.pdf'. Extraje:\n• Iniciativa de alto impacto para Finanzas.\n• Ahorro estimado: $3.8M MXN anuales.\n• Sistemas impactados: SAP y Pasarela de Pagos.\nPuedes aplicarlo directamente con un clic.";
        payload = {
          title: "Liquidación y Conciliación Multicanal Automatizada",
          businessUnit: "Finanzas y Contabilidad",
          needDescription:
            "Automatizar la conciliación de flujos de pago omnicanal integrando tiendas y e-commerce hacia SAP en tiempo real.",
          hasItImpact: "si",
          selectedSystems: ["sap", "payments", "apis"],
          estimatedSavingsMxn: "3800000",
          savedHoursPerMonth: "150",
        };
      } else {
        botReply = `Entendido. He analizado tu consulta sobre "${text}". He estructurado la justificación para presentarla ante la PMO con un enfoque cuantificado y claro.`;
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botReply,
        actionPayload: payload,
        actionLabel: payload ? "✨ Aplicar sugerencias al formulario" : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
      setIsAiTyping(false);
    }, 900);
  };

  // Simulación de carga de archivo
  const handleAttachMockFile = () => {
    const fileMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: "📎 He subido el documento: 'Caso_De_Negocio_Iniciativa_2026.pdf' (1.4 MB)",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, fileMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "✅ Documento procesado exitosamente por DataSwat AI. He extraído el problema de negocio, los sistemas TI involucrados y la monetización proyectada.",
        actionPayload: {
          title: "Plataforma Inteligente de Conciliación Omnicanal",
          businessUnit: "Omnicanalidad y Tiendas",
          needDescription:
            "Reemplazar los procesos manuales por una arquitectura orientada a eventos para procesar 1.2M de transacciones mensuales sin fricción.",
          hasItImpact: "si",
          selectedSystems: ["sap", "payments", "core", "pos", "apis"],
          benefitType: "Nuevos ingresos de negocio",
          estimatedSavingsMxn: "5200000",
          savedHoursPerMonth: "200",
          successKpi: "Conciliación en menos de 5 segundos tras completada la compra",
        },
        actionLabel: "✨ Aplicar datos extraídos del PDF",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
      setIsAiTyping(false);
    }, 1100);
  };

  // Aplicar sugerencias de la IA al formulario
  const applyPayloadToForm = (payload?: Partial<DiscoveryState>) => {
    if (!payload) return;
    setForm((prev) => ({ ...prev, ...payload }));
  };

  // Finalizar y enviar a "2. Visualizar backlog por cartera de negocio"
  const handleSubmitToBacklog = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 1000);
  };

  const readinessScore = calculateReadinessScore();

  return (
    <div>
      {/* Barra de navegación superior estilo Imagen 2 */}
      <div style={{ marginBottom: 14 }}>
        <Link
          href="/"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--brand-primary)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon icon={NavigationChevronLeft} size={16} />
          <span>Inicio / Portafolio</span>
        </Link>
      </div>

      {/* Encabezado Principal estilo Imagen Adjunta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#1e2022" }}>
              DevCycle Discovery
            </h1>
            <span className="badge-dataswat">DATASWAT MVP</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
            Etapa 0: Priorización · <strong>Paso 1: Solicitud de requerimiento y Descubrimiento Asistido</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
            Madurez de la iniciativa:
          </span>
          <span
            className="tag-pill tag-pill--green"
            style={{ fontWeight: 700, fontSize: 12 }}
          >
            {readinessScore}% Refinada
          </span>
        </div>
      </div>

      {/* Stepper Horizontal Guiado (Pega Blueprint Style) */}
      <nav className="blueprint-stepper" aria-label="Pasos de descubrimiento">
        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}
          onClick={() => setCurrentStep(1)}
        >
          <span className="blueprint-step-num">
            {currentStep > 1 ? <Icon icon={Check} size={13} /> : "1"}
          </span>
          <div>
            <div>Necesidad y Negocio</div>
            <div style={{ fontSize: 10.5, opacity: 0.7 }}>Problem Statement</div>
          </div>
        </button>

        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}
          onClick={() => setCurrentStep(2)}
        >
          <span className="blueprint-step-num">
            {currentStep > 2 ? <Icon icon={Check} size={13} /> : "2"}
          </span>
          <div>
            <div>Impacto TI y Sistemas</div>
            <div style={{ fontSize: 10.5, opacity: 0.7 }}>Sistemas y Dependencias</div>
          </div>
        </button>

        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}
          onClick={() => setCurrentStep(3)}
        >
          <span className="blueprint-step-num">
            {currentStep > 3 ? <Icon icon={Check} size={13} /> : "3"}
          </span>
          <div>
            <div>Beneficios y ROI</div>
            <div style={{ fontSize: 10.5, opacity: 0.7 }}>Cuantificación monetaria</div>
          </div>
        </button>

        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 4 ? "active" : ""}`}
          onClick={() => setCurrentStep(4)}
        >
          <span className="blueprint-step-num">4</span>
          <div>
            <div>Ficha de proyecto</div>
            <div style={{ fontSize: 10.5, opacity: 0.7 }}>Envío al Backlog</div>
          </div>
        </button>
      </nav>

      {/* Layout Split: Formulario Guiado (Izquierda) + Discovery Inteligente (Derecha) */}
      <div className="discovery-layout">
        {/* COLUMNA IZQUIERDA: CANVAS DEL PASO ACTUAL */}
        <div className="board-card" style={{ padding: 24 }}>
          {/* PASO 1: NECESIDAD Y NEGOCIO */}
          {currentStep === 1 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e2022" }}>
                    1. Identificación y Necesidad de Negocio
                  </h2>
                  <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
                    Describe qué dolor operativo o comercial experimenta el área solicitante.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-ai-assist"
                  onClick={() => handleSendMessage("Ayúdame a redactar el dolor de negocio con mayor claridad para la PMO")}
                >
                  <Icon icon={Bolt} size={14} />
                  <span>Refinar con IA</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                    Título de la Iniciativa
                  </label>
                  <input
                    type="text"
                    className="config-card__input"
                    value={form.title}
                    placeholder="Ej. Automatización de Conciliación Bancaria..."
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                      Unidad de Negocio / Cartera
                    </label>
                    <select
                      className="config-card__input"
                      value={form.businessUnit}
                      onChange={(e) => setForm({ ...form, businessUnit: e.target.value })}
                    >
                      {BUSINESS_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                      Solicitante (Sponsor)
                    </label>
                    <input
                      type="text"
                      className="config-card__input"
                      value={form.requester}
                      onChange={(e) => setForm({ ...form, requester: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase" }}>
                      Descripción de la Necesidad (Problem Statement)
                    </label>
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
                      ¿Qué pasa hoy si no se hace este cambio?
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    className="config-card__input"
                    style={{ resize: "vertical" }}
                    value={form.needDescription}
                    placeholder="Describe los dolores actuales, cuellos de botella y pérdidas..."
                    onChange={(e) => setForm({ ...form, needDescription: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-purple-solid"
                  onClick={() => setCurrentStep(2)}
                >
                  <span>Continuar a Impacto TI</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: IMPACTO TI Y SISTEMAS */}
          {currentStep === 2 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e2022" }}>
                    2. Impacto Tecnológico y Sistemas
                  </h2>
                  <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
                    Determina si la iniciativa requiere desarrollo de TI e identifica sistemas involucrados.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-ai-assist"
                  onClick={() => handleSendMessage("¿Qué sistemas y dependencias técnicas sugiere la arquitectura para esta iniciativa?")}
                >
                  <Icon icon={Bolt} size={14} />
                  <span>Sugerir Sistemas con IA</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                    ¿Tiene Impacto de TI? (Decisión de Flujo)
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      className={`chip-select ${form.hasItImpact === "si" ? "active" : ""}`}
                      onClick={() => setForm({ ...form, hasItImpact: "si" })}
                    >
                      ✓ Sí, requiere software / TI
                    </button>
                    <button
                      type="button"
                      className={`chip-select ${form.hasItImpact === "no" ? "active" : ""}`}
                      onClick={() => setForm({ ...form, hasItImpact: "no" })}
                    >
                      ✕ No, es puramente organizativo
                    </button>
                    <button
                      type="button"
                      className={`chip-select ${form.hasItImpact === "evaluacion" ? "active" : ""}`}
                      onClick={() => setForm({ ...form, hasItImpact: "evaluacion" })}
                    >
                      ? Por determinar con Arquitectura
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                    Sistemas y Plataformas Afectadas (Haz clic para seleccionar)
                  </label>
                  <div className="chip-group">
                    {SYSTEMS_CATALOG.map((sys) => {
                      const selected = form.selectedSystems.includes(sys.id);
                      return (
                        <button
                          key={sys.id}
                          type="button"
                          className={`chip-select ${selected ? "active" : ""}`}
                          onClick={() => toggleSystem(sys.id)}
                        >
                          {selected ? "✓ " : "+ "}
                          {sys.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                    Referencia de Arquitectura o Dependencias Previas
                  </label>
                  <input
                    type="text"
                    className="config-card__input"
                    value={form.architectureReference}
                    placeholder="Ej. Integración mediante APIs REST y eventos en GCP..."
                    onChange={(e) => setForm({ ...form, architectureReference: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  className="btn-purple-solid"
                  onClick={() => setCurrentStep(3)}
                >
                  <span>Continuar a Beneficios</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: BENEFICIOS Y ROI */}
          {currentStep === 3 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e2022" }}>
                    3. Definir Beneficios Cuantificados o Monetizados
                  </h2>
                  <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
                    Justificación económica y métricas de éxito esperadas para priorización de la PMO.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-ai-assist"
                  onClick={() => handleSendMessage("Ayúdame a cuantificar y monetizar los beneficios de esta iniciativa")}
                >
                  <Icon icon={Bolt} size={14} />
                  <span>Calcular ROI con IA</span>
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Tipo de Beneficio Principal
                  </label>
                  <div className="chip-group">
                    {BENEFIT_TYPES.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`chip-select ${form.benefitType === b ? "active" : ""}`}
                        onClick={() => setForm({ ...form, benefitType: b })}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                      Beneficio Monetizado Estimado Anual ($ MXN)
                    </label>
                    <input
                      type="number"
                      className="config-card__input"
                      value={form.estimatedSavingsMxn}
                      placeholder="Ej. 3500000"
                      onChange={(e) => setForm({ ...form, estimatedSavingsMxn: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                      Horas / Hombre Ahorradas al Mes
                    </label>
                    <input
                      type="number"
                      className="config-card__input"
                      value={form.savedHoursPerMonth}
                      placeholder="Ej. 140"
                      onChange={(e) => setForm({ ...form, savedHoursPerMonth: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#1e2022", textTransform: "uppercase", display: "block", marginBottom: 5 }}>
                    Métrica de Éxito o KPI Clave
                  </label>
                  <input
                    type="text"
                    className="config-card__input"
                    value={form.successKpi}
                    placeholder="Ej. Reducir en 60% el tiempo de respuesta a clientes..."
                    onChange={(e) => setForm({ ...form, successKpi: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  className="btn-purple-solid"
                  onClick={() => setCurrentStep(4)}
                >
                  <span>Ver Ficha de proyecto</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: FICHA DE PROYECTO Y ENVÍO A BACKLOG */}
          {currentStep === 4 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "#1e2022" }}>
                    4. Ficha de Proyecto (Resumen Ejecutivo)
                  </h2>
                  <p style={{ fontSize: 12.5, color: "var(--color-text-secondary)", margin: "4px 0 0 0" }}>
                    Revisión consolidada lista para avanzar al <strong>Paso 2: Visualizar backlog por cartera de negocio</strong>.
                  </p>
                </div>
                <span className="tag-pill tag-pill--green">
                  ✓ Refinamiento Completo
                </span>
              </div>

              {/* Ficha Resumen Consolidada */}
              <div
                style={{
                  background: "#fbfbfd",
                  borderRadius: 10,
                  border: "1px solid var(--color-border)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--brand-primary)", textTransform: "uppercase" }}>
                    Iniciativa
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#1e2022", marginTop: 2 }}>
                    {form.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                    {form.businessUnit} · Solicitado por: {form.requester}
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                    Dolor de Negocio (Problem Statement)
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--color-text-main)", marginTop: 3, lineHeight: 1.4 }}>
                    {form.needDescription}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                      Impacto de TI
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2022", marginTop: 2 }}>
                      {form.hasItImpact === "si" ? "Sí (Proyecto Tecnológico)" : "No Tecnológico"}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                      {form.selectedSystems.map((s) => (
                        <span key={s} className="tag-pill tag-pill--purple" style={{ fontSize: 10.5 }}>
                          {SYSTEMS_CATALOG.find((sys) => sys.id === s)?.name.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                      Beneficio Proyectado
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--status-green-text)", marginTop: 2 }}>
                      ${Number(form.estimatedSavingsMxn).toLocaleString()} MXN / año
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--color-text-secondary)" }}>
                      {form.savedHoursPerMonth} hrs/mes ahorradas
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>
                    Siguiente Paso en el Flujo
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--brand-primary)", fontWeight: 600, marginTop: 2 }}>
                    ➔ 2. Visualizar backlog por cartera de negocio (Revisión de PMO)
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => setCurrentStep(3)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Modificar Datos</span>
                </button>

                <button
                  type="button"
                  className="btn-purple-solid"
                  style={{ background: "var(--brand-accent)", borderColor: "var(--brand-accent)" }}
                  onClick={handleSubmitToBacklog}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader size={16} />
                  ) : (
                    <>
                      <span>Registrar Inicialmente y Enviar a Backlog</span>
                      <Icon icon={Check} size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: DISCOVERY INTELIGENTE (DATASWAT AI) */}
        <aside className="dataswat-card">
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
                  Discovery Inteligente
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                  DataSwat Copilot · Refinamiento activo
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-purple-outline"
              style={{ padding: "4px 8px", fontSize: 11 }}
              onClick={handleAttachMockFile}
              title="Simular subir documento"
            >
              <Icon icon={Upload} size={13} />
              <span>Subir archivo</span>
            </button>
          </div>

          {/* Lista de mensajes */}
          <div className="dataswat-messages">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={msg.sender === "bot" ? "dataswat-bubble-bot" : "dataswat-bubble-user"}
              >
                {msg.sender === "bot" && (
                  <div className="dataswat-bubble-bot__header">
                    <Icon icon={Bolt} size={13} />
                    <span>DataSwat AI</span>
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
                      onClick={() => applyPayloadToForm(msg.actionPayload)}
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
                    textAlign: msg.sender === "user" ? "right" : "left",
                    color: msg.sender === "user" ? "rgba(255,255,255,0.7)" : "var(--color-text-muted)",
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="dataswat-bubble-bot" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Loader size={14} />
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  DataSwat AI está analizando tu iniciativa…
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
              onClick={() => handleSendMessage("¿Cómo cuantifico los beneficios monetizados?")}
            >
              💡 Cuantificar ROI
            </button>
            <button
              type="button"
              className="tag-pill tag-pill--purple"
              style={{ cursor: "pointer", fontSize: 11 }}
              onClick={() => handleSendMessage("¿Qué sistemas de TI se ven afectados?")}
            >
              💻 Sistemas TI
            </button>
            <button
              type="button"
              className="tag-pill tag-pill--purple"
              style={{ cursor: "pointer", fontSize: 11 }}
              onClick={handleAttachMockFile}
            >
              📄 Analizar PDF de caso
            </button>
          </div>

          {/* Input inferior con botón de adjuntar y enviar */}
          <div className="dataswat-footer">
            <div className="dataswat-input-box">
              <button
                type="button"
                className="dataswat-btn-attach"
                onClick={handleAttachMockFile}
                title="Adjuntar documento de descubrimiento"
              >
                <Icon icon={Upload} size={16} />
              </button>
              <input
                type="text"
                className="dataswat-input-box__text"
                placeholder="Describe tu idea o haz preguntas..."
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                type="button"
                className="dataswat-btn-send"
                onClick={() => handleSendMessage()}
                title="Enviar"
              >
                <Icon icon={Send} size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal / Diálogo de éxito al registrar y avanzar al Backlog */}
      {isSuccessModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
        >
          <div
            className="board-card"
            style={{
              maxWidth: 500,
              width: "100%",
              padding: 28,
              textAlign: "center",
              boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "var(--status-green-bg)",
                color: "var(--status-green-text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Icon icon={Check} size={28} />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px 0", color: "#1e2022" }}>
              ¡Iniciativa Registrada con Éxito!
            </h3>

            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 20px 0" }}>
              La iniciativa <strong>&quot;{form.title}&quot;</strong> ha completado el paso 1 de Solicitud de Requerimiento y se ha transferido exitosamente a la cartera de <strong>{form.businessUnit}</strong>.
            </p>

            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: 12,
                fontSize: 12.5,
                color: "#166534",
                marginBottom: 24,
                textAlign: "left",
              }}
            >
              <strong>Siguiente paso en el flujo:</strong>
              <br />
              ➔ <strong>2. Visualizar backlog por cartera de negocio</strong> (Asignado al rol de PMO para priorización).
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                className="btn-purple-solid"
                onClick={() => router.push("/")}
              >
                Ir al Backlog del Portafolio
              </button>
              <button
                type="button"
                className="btn-purple-outline"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Permanecer en la Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
