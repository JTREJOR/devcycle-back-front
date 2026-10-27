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
import { BackButton } from "@/components/BackButton";

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
    <div className="px-1 pb-10">
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-[calc(var(--app-header-height)+16px)] right-6 z-100 flex items-center gap-2.5 rounded-lg bg-text-heading px-4.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-opacity duration-150">
          <Icon icon={Check} size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. ENCABEZADO */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs">
            <Link href="/" className="font-semibold text-brand-primary no-underline hover:underline">
              Portafolio
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="font-bold text-brand-primary">Estimación y Validación Técnica</span>
          </div>
          <h1 className="m-0 mb-1.5 text-2xl font-extrabold tracking-[-0.3px] text-text-heading">
            Estimación Técnica y Aprobación de Arquitectura
          </h1>
          <p className="m-0 text-[13.5px] text-text-secondary">
            Dimensionamiento guiado por IA (Gemini), desglose de Hoja de Costos y VoBo dual de Arquitectura y Desarrollo.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2.5">
            <Link
              href="/iniciativas"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[12.5px] font-semibold text-brand-primary no-underline transition-all duration-150 hover:bg-brand-primary-light"
            >
              <Icon icon={CheckList} size={15} />
              <span>Volver a Iniciativas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SELECTOR DE INICIATIVA ACTUAL */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border-default bg-bg-card px-4.5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">
            Iniciativa en Revisión:
          </span>
          <select
            className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] font-bold text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 sm:w-[380px]"
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

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-slate-500">Etapa:</span>
          <span className="inline-flex items-center rounded-xl border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[11.5px] font-semibold whitespace-nowrap text-violet-600">
            2. Estimación
          </span>
          <span className="text-xs text-slate-500">Solicitante:</span>
          <strong className="text-xs text-text-heading">{activeInitiative.solicitante}</strong>
        </div>
      </div>

      {/* 2. PESTAÑAS DE TRABAJO */}
      <div className="mb-4 flex flex-wrap gap-2 border-b border-border-default pb-2">
        <button
          type="button"
          className={`cursor-pointer rounded-lg border px-4 py-2 text-[13px] transition-all duration-150 ${
            activeTab === "sizing"
              ? "border-brand-primary bg-brand-primary-light font-bold text-brand-primary"
              : "border-transparent bg-bg-card font-medium text-text-secondary hover:bg-slate-50 hover:text-brand-primary"
          }`}
          onClick={() => setActiveTab("sizing")}
        >
          1. Sizing Asistido con IA (Gemini)
        </button>
        <button
          type="button"
          className={`cursor-pointer rounded-lg border px-4 py-2 text-[13px] transition-all duration-150 ${
            activeTab === "hojaCostos"
              ? "border-brand-primary bg-brand-primary-light font-bold text-brand-primary"
              : "border-transparent bg-bg-card font-medium text-text-secondary hover:bg-slate-50 hover:text-brand-primary"
          }`}
          onClick={() => setActiveTab("hojaCostos")}
        >
          2. Canvas y Hoja de Costos
        </button>
        <button
          type="button"
          className={`cursor-pointer rounded-lg border px-4 py-2 text-[13px] transition-all duration-150 ${
            activeTab === "vobo"
              ? "border-brand-primary bg-brand-primary-light font-bold text-brand-primary"
              : "border-transparent bg-bg-card font-medium text-text-secondary hover:bg-slate-50 hover:text-brand-primary"
          }`}
          onClick={() => setActiveTab("vobo")}
        >
          3. Doble Aprobación (VoBo Técnico y Arquitectura) {isFullyApproved && "✓"}
        </button>
      </div>

      {/* 3. CONTENIDO DE LAS PESTAÑAS */}

      {/* PESTAÑA 1: SIZING CON IA */}
      {activeTab === "sizing" && (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="overflow-hidden rounded-[14px] border border-border-default bg-bg-card shadow-2xs">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-primary-light text-brand-primary">
                    <Icon icon={Bolt} size={16} />
                  </div>
                  <div>
                    <div className="text-[13.5px] font-bold text-text-heading">
                      Agente de Sizing Técnico (Gemini AI)
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      Cálculo predictivo de infraestructura GCP y esfuerzo de desarrollo
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensajes del chat */}
              <div className="flex max-h-[460px] min-h-[380px] flex-1 flex-col gap-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.sender === "gemini"
                        ? "max-w-[90%] self-start rounded-xl rounded-tl-[2px] border border-border-subtle bg-slate-50 px-3.5 py-2.5 text-text-main"
                        : "max-w-[90%] self-end rounded-xl rounded-tr-[2px] bg-brand-primary px-3.5 py-2.5 text-white"
                    }
                  >
                    {msg.sender === "gemini" && (
                      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-brand-primary">
                        <Icon icon={Bolt} size={13} />
                        <span>Gemini Sizing Engine</span>
                      </div>
                    )}
                    <div className="text-[12.5px] leading-[1.45] whitespace-pre-line">
                      {msg.text}
                    </div>

                    {msg.actionLabel && msg.actionPayload && (
                      <div className="mt-2.5">
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[20px] border border-[#f2d8ec] bg-brand-primary-soft px-3 py-[5px] text-xs font-semibold text-brand-primary transition-all duration-150 hover:-translate-y-[1px] hover:border-brand-primary hover:bg-[#f5e1f0]"
                          onClick={() => handleApplySizing(msg.actionPayload)}
                        >
                          <Icon icon={Check} size={12} />
                          <span>{msg.actionLabel}</span>
                        </button>
                      </div>
                    )}

                    <div
                      className={`mt-1 text-[10px] ${
                        msg.sender === "bp"
                          ? "text-right text-white/70"
                          : "text-left text-text-muted"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex max-w-[90%] items-center gap-2 self-start rounded-xl rounded-tl-[2px] border border-border-subtle bg-slate-50 px-3.5 py-2.5">
                    <Loader size={14} />
                    <span className="text-xs text-text-secondary">
                      Gemini está calculando la estimación y costos de nube...
                    </span>
                  </div>
                )}
              </div>

              {/* Sugerencias Rápidas */}
              <div className="flex gap-1.5 overflow-x-auto border-t border-border-subtle bg-[#fafbfc] px-4 py-2">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
                  onClick={() => handleSendMessage("Estimamos 450 TPS pico y 3.2M de usuarios al mes.")}
                >
                  ⚡ Cargar métricas de tráfico esperadas
                </button>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
                  onClick={() => handleSendMessage("Requerimos disponibilidad del 99.95% con réplica multi-región.")}
                >
                  🛡️ Alta Resiliencia 99.95%
                </button>
              </div>

              {/* Input */}
              <div className="border-t border-border-default p-3.5">
                <div className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-card px-3 py-1.5 focus-within:border-brand-primary">
                  <input
                    type="text"
                    className="flex-1 border-none bg-transparent text-[13px] text-text-main outline-none"
                    placeholder="Escribe detalles de tráfico, transacciones o componentes..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    type="button"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-brand-primary text-white transition-colors hover:bg-brand-primary-hover"
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
          <div className="rounded-[14px] border border-border-default bg-bg-card p-5 shadow-2xs">
            <h3 className="m-0 mb-3 text-base font-bold text-slate-900">
              Dimensionamiento Actual de la Iniciativa
            </h3>

            <div className="flex flex-col gap-3.5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  Tráfico y Concurrencia
                </div>
                <div className="mt-0.5 text-base font-extrabold text-brand-primary">
                  {estData.tps} TPS pico · {estData.usuariosMensuales} usuarios/mes
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  Arquitectura Propuesta
                </div>
                <div className="mt-0.5 text-[13px] font-bold text-slate-800">
                  {estData.tipoArquitectura}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-[5px]">
                  {estData.serviciosNube?.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center rounded-xl border border-status-blue-border bg-status-blue-bg px-2.5 py-[3px] text-[10.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-blue-text"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="text-[11px] font-bold text-blue-800 uppercase">
                    Horas de Desarrollo
                  </div>
                  <div className="mt-0.5 text-xl font-extrabold text-blue-800">
                    {estData.horasDesarrolloEstimadas} hrs
                  </div>
                  <div className="text-[11px] text-blue-400">~3 Sprints de equipo</div>
                </div>

                <div className="rounded-lg border border-status-green-border bg-emerald-50 p-3">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">
                    Costo Cloud Estimado
                  </div>
                  <div className="mt-0.5 text-xl font-extrabold text-emerald-800">
                    {estData.costoNubeMensualEstimado}
                  </div>
                  <div className="text-[11px] text-emerald-400">Building API GCP</div>
                </div>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
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
        <div className="rounded-lg border border-border-default bg-bg-card p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="mb-1.5 inline-flex items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text">
                Charter de Iniciativa · Hoja de Costos
              </span>
              <h2 className="m-0 text-xl font-extrabold text-slate-900">
                {activeInitiative.name}
              </h2>
              <p className="mt-1 mb-0 text-[12.5px] text-slate-500">
                Desglose financiero e inversión de esfuerzo calculada por la herramienta asistida.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
              onClick={() => setActiveTab("vobo")}
            >
              <span>Avanzar a Doble VoBo</span>
              <Icon icon={NavigationChevronRight} size={15} />
            </button>
          </div>

          {/* Tabla Desglose de Horas Hombre */}
          <div className="mb-6 overflow-x-auto">
            <h4 className="mb-2.5 text-sm font-bold text-slate-800">
              1. Desglose de Horas Hombre por Perfil Técnico
            </h4>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border-default bg-[#fafbfc] text-left text-xs font-semibold text-text-secondary">
                  <th className="px-3 py-2.5">Rol / Perfil</th>
                  <th className="px-3 py-2.5">Actividades Principales</th>
                  <th className="px-3 py-2.5 text-center">Sprints</th>
                  <th className="px-3 py-2.5 text-center">Horas</th>
                  <th className="px-3 py-2.5 text-right">Costo Estimado MXN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f7]">
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Líder Técnico / Arquitectura</strong></td>
                  <td className="px-3 py-3">Diseño de microservicios, seguridad, configuración de GCP y contratos de API</td>
                  <td className="px-3 py-3 text-center">3</td>
                  <td className="px-3 py-3 text-center">80 hrs</td>
                  <td className="px-3 py-3 text-right">$96,000</td>
                </tr>
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Desarrolladores Frontend (NextJS/React)</strong></td>
                  <td className="px-3 py-3">Vistas interactivas, integración de Vibe UI y flujos de usuario</td>
                  <td className="px-3 py-3 text-center">3</td>
                  <td className="px-3 py-3 text-center">160 hrs</td>
                  <td className="px-3 py-3 text-right">$160,000</td>
                </tr>
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Desarrolladores Backend (Node/NestJS)</strong></td>
                  <td className="px-3 py-3">Microservicios transaccionales, orquestación y conectores SAP</td>
                  <td className="px-3 py-3 text-center">3</td>
                  <td className="px-3 py-3 text-center">160 hrs</td>
                  <td className="px-3 py-3 text-right">$160,000</td>
                </tr>
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Ingeniería QA & Automatización</strong></td>
                  <td className="px-3 py-3">Pruebas unitarias, de integración, carga y regresión automatizada</td>
                  <td className="px-3 py-3 text-center">3</td>
                  <td className="px-3 py-3 text-center">80 hrs</td>
                  <td className="px-3 py-3 text-right">$72,000</td>
                </tr>
                <tr className="bg-slate-50 font-extrabold">
                  <td colSpan={3} className="px-3 py-3">TOTAL DE ESFUERZO DE DESARROLLO</td>
                  <td className="px-3 py-3 text-center text-brand-primary">{estData.horasDesarrolloEstimadas} hrs</td>
                  <td className="px-3 py-3 text-right text-brand-primary">$488,000 MXN</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabla de Infraestructura Cloud */}
          <div className="overflow-x-auto">
            <h4 className="mb-2.5 text-sm font-bold text-slate-800">
              2. Infraestructura y Servicios de Nube (Google Cloud Platform)
            </h4>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border-default bg-[#fafbfc] text-left text-xs font-semibold text-text-secondary">
                  <th className="px-3 py-2.5">Servicio GCP</th>
                  <th className="px-3 py-2.5">Especificación / Dimensionamiento</th>
                  <th className="px-3 py-2.5 text-center">Concurrencia</th>
                  <th className="px-3 py-2.5 text-right">Costo Mensual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f7]">
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Cloud Run (Serverless Cómputo)</strong></td>
                  <td className="px-3 py-3">Auto-escalable de 2 a 25 instancias, 2 vCPU, 4GB RAM</td>
                  <td className="px-3 py-3 text-center">{estData.tps} TPS</td>
                  <td className="px-3 py-3 text-right">$1,200 USD/mes</td>
                </tr>
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Cloud SQL PostgreSQL HA</strong></td>
                  <td className="px-3 py-3">Instancia db-custom-4-16384 con réplica standby síncrona</td>
                  <td className="px-3 py-3 text-center">Alta Disponibilidad</td>
                  <td className="px-3 py-3 text-right">$950 USD/mes</td>
                </tr>
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>Pub/Sub & Cloud Storage</strong></td>
                  <td className="px-3 py-3">Colas de mensajería asíncronas y almacenamiento de archivos</td>
                  <td className="px-3 py-3 text-center">10M eventos/mes</td>
                  <td className="px-3 py-3 text-right">$450 USD/mes</td>
                </tr>
                <tr className="hover:bg-[#fafbfe]">
                  <td className="px-3 py-3"><strong>BigQuery & Cloud Monitoring</strong></td>
                  <td className="px-3 py-3">Almacén de datos analítico y telemetría de observabilidad</td>
                  <td className="px-3 py-3 text-center">2.4M queries/mes</td>
                  <td className="px-3 py-3 text-right">$600 USD/mes</td>
                </tr>
                <tr className="bg-slate-50 font-extrabold">
                  <td colSpan={3} className="px-3 py-3">TOTAL INFRAESTRUCTURA CLOUD (MENSUAL)</td>
                  <td className="px-3 py-3 text-right text-success-500">{estData.costoNubeMensualEstimado}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: DOBLE APROBACIÓN (VOBO DUAL) */}
      {activeTab === "vobo" && (
        <div className="flex flex-col gap-5">
          <div
            className={`flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 ${
              isFullyApproved
                ? "border-status-green-border bg-emerald-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div>
              <div
                className={`text-[13px] font-bold ${
                  isFullyApproved ? "text-emerald-800" : "text-slate-800"
                }`}
              >
                {isFullyApproved
                  ? "✓ Estimación Aprobada por Ambos Líderes (Lista para Ejecución)"
                  : "Pendiente de Visto Bueno Dual (Arquitectura y Desarrollo)"}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                Se requiere la validación simultánea antes de transferir a Jira y Monday para asignación de sprints.
              </div>
            </div>

            {isFullyApproved && (
              <span className="inline-flex items-center rounded-xl border border-status-green-border bg-status-green-bg px-3 py-1 text-xs font-semibold tracking-[0.2px] whitespace-nowrap text-status-green-text">
                ✓ VoBo Completo
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Tarjeta 1: Líder Técnico (Desarrollo) */}
            <div className="rounded-xl border border-border-default bg-bg-card p-6 shadow-2xs">
              <div className="mb-3.5 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-800">
                    <Icon icon={Person} size={20} />
                  </div>
                  <div>
                    <h3 className="m-0 text-base font-bold text-slate-900">
                      Líder Técnico (Desarrollo)
                    </h3>
                    <div className="text-[11.5px] text-slate-500">
                      Validación de horas, perfiles y sprints
                    </div>
                  </div>
                </div>

                {estData.voboLiderTecnico === "aprobado" ? (
                  <span className="inline-flex items-center rounded-xl border border-status-green-border bg-status-green-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-green-text">
                    ✓ Aprobado
                  </span>
                ) : estData.voboLiderTecnico === "refinamiento" ? (
                  <span className="inline-flex items-center rounded-xl border border-status-orange-border bg-status-orange-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-orange-text">
                    ✎ Refinamiento
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-xl border border-status-gray-border bg-status-gray-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-gray-text">
                    Pendiente
                  </span>
                )}
              </div>

              <div className="mb-4.5 rounded-lg bg-slate-50 p-3 text-xs leading-[1.45] text-slate-600">
                • <strong>Horas propuestas:</strong> {estData.horasDesarrolloEstimadas} hrs.<br />
                • <strong>Equipo estimado:</strong> 1 TL, 2 Front, 2 Back, 1 QA.<br />
                • <strong>Factibilidad técnica:</strong> Viable con el stack corporativo NextJS / NestJS.
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-[1.5px] px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 ${
                    estData.voboLiderTecnico === "aprobado"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-brand-primary bg-brand-primary hover:border-brand-primary-hover hover:bg-brand-primary-hover"
                  }`}
                  onClick={() => handleApproveVoBo("tecnico")}
                >
                  <Icon icon={Check} size={15} />
                  <span>{estData.voboLiderTecnico === "aprobado" ? "Aprobado ✓" : "Dar VoBo Técnico"}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                  onClick={() => handleOpenRefineModal("tecnico")}
                >
                  <Icon icon={Edit} size={14} />
                  <span>Refinar</span>
                </button>
              </div>
            </div>

            {/* Tarjeta 2: Líder de Arquitectura (Nube & Datos) */}
            <div className="rounded-xl border border-border-default bg-bg-card p-6 shadow-2xs">
              <div className="mb-3.5 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-purple-800">
                    <Icon icon={Security} size={20} />
                  </div>
                  <div>
                    <h3 className="m-0 text-base font-bold text-slate-900">
                      Líder de Arquitectura
                    </h3>
                    <div className="text-[11.5px] text-slate-500">
                      Validación de componentes, nube y seguridad
                    </div>
                  </div>
                </div>

                {estData.voboLiderArquitectura === "aprobado" ? (
                  <span className="inline-flex items-center rounded-xl border border-status-green-border bg-status-green-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-green-text">
                    ✓ Aprobado
                  </span>
                ) : estData.voboLiderArquitectura === "refinamiento" ? (
                  <span className="inline-flex items-center rounded-xl border border-status-orange-border bg-status-orange-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-orange-text">
                    ✎ Refinamiento
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-xl border border-status-gray-border bg-status-gray-bg px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-gray-text">
                    Pendiente
                  </span>
                )}
              </div>

              <div className="mb-4.5 rounded-lg bg-slate-50 p-3 text-xs leading-[1.45] text-slate-600">
                • <strong>Infraestructura:</strong> Google Cloud Platform ({estData.costoNubeMensualEstimado}).<br />
                • <strong>Servicios:</strong> {estData.serviciosNube?.join(", ") || "Cloud Run, Cloud SQL"}.<br />
                • <strong>Patrón:</strong> Desacoplado con APIs y mensajería Pub/Sub.
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  className={`inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-[1.5px] px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 ${
                    estData.voboLiderArquitectura === "aprobado"
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-violet-500 bg-violet-500 hover:border-violet-600 hover:bg-violet-600"
                  }`}
                  onClick={() => handleApproveVoBo("arquitectura")}
                >
                  <Icon icon={Check} size={15} />
                  <span>{estData.voboLiderArquitectura === "aprobado" ? "Aprobado ✓" : "Dar VoBo Arquitectura"}</span>
                </button>

                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
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
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5">
              <div className="flex items-center gap-2 text-[12.5px] font-bold text-amber-800">
                <Icon icon={Alert} size={16} />
                <span>Observaciones para Refinamiento de Estimación:</span>
              </div>
              <p className="mt-1.5 mb-0 text-[12.5px] text-amber-900">
                {estData.observacionesRefinamiento}
              </p>
            </div>
          )}

          {/* Botón de Formalización Final */}
          <div className="mt-2.5 flex justify-end">
            <Link
              href="/iniciativas"
              className={`inline-flex items-center gap-1.5 rounded-lg border-[1.5px] px-4 py-[7px] text-[13px] font-semibold text-white no-underline transition-all duration-150 ${
                isFullyApproved
                  ? "cursor-pointer border-emerald-500 bg-emerald-500 hover:border-emerald-600 hover:bg-emerald-600"
                  : "cursor-not-allowed border-slate-400 bg-slate-400"
              }`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-[500px] rounded-2xl border border-border-default bg-bg-card p-6 shadow-xl"
            role="dialog"
          >
            <div className="mb-3.5 flex items-start justify-between">
              <div>
                <h3 className="m-0 text-[17px] font-bold text-slate-900">
                  Solicitar Refinamiento de Estimación
                </h3>
                <div className="text-xs text-slate-500">
                  Rol solicitante: Líder {refineRole === "tecnico" ? "Técnico" : "de Arquitectura"}
                </div>
              </div>
              <button
                type="button"
                className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-text-secondary transition-all duration-150 hover:border-[#f2d8ec] hover:bg-brand-primary-light hover:text-brand-primary"
                onClick={() => setIsRefineModalOpen(false)}
              >
                <Icon icon={Close} size={18} />
              </button>
            </div>

            <p className="m-0 mb-3.5 text-[12.5px] text-slate-600">
              Indica qué variables deben ajustarse (p. ej. reducir alcance en horas de frontend, optimizar cómputo de nube o replantear el conector con SAP):
            </p>

            <textarea
              rows={4}
              className="mb-4.5 w-full resize-y rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
              placeholder="Ej. Reducir instancias standby en GCP a 1 región para Fase 1..."
              value={refineFeedback}
              onChange={(e) => setRefineFeedback(e.target.value)}
            />

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                onClick={() => setIsRefineModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-warning-500 bg-warning-500 px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90"
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
    <Suspense
      fallback={
        <div className="p-10 text-center text-sm text-text-secondary">
          Cargando módulo de estimación...
        </div>
      }
    >
      <EstimacionContent />
    </Suspense>
  );
}
