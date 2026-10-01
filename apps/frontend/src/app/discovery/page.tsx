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
  Settings,
  Person,
  Info,
  Delete,
  Add,
  File as FileIcon,
} from "@vibe/icons";
import { usePriorizacionStore, OKRItem, DependenciaItem } from "@/store/priorizacionStore";

// ==========================================
// CATÁLOGOS CORPORATIVOS LIVERPOOL / DEVCYCLE
// ==========================================
const DIRECCIONES_NEGOCIO = [
  "Capital Humano",
  "Finanzas y Contabilidad",
  "Omnicanalidad y Tiendas",
  "Banca Digital y Servicios Financieros",
  "Crédito y Cobranza",
  "Logística y Cadena de Suministro",
  "Mercadotecnia y Lealtad",
  "Operaciones TI",
];

const PMO_CATALOG = [
  "EPL",
  "PMO Digital",
  "PMO Comercial",
  "PMO Logística & Cadena",
  "PMO Financiera",
];

const CLASIFICACIONES_KPI = [
  "Calidad o Eficiencia",
  "Crecimiento de Ventas",
  "Experiencia de Cliente",
  "Cumplimiento y Riesgo",
];

const CONCEPTOS_KPI = [
  "Servicio",
  "Ventas",
  "Costo",
  "Operación",
  "Riesgo",
];

const SYSTEMS_CATALOG = [
  { id: "sap", name: "SAP / ERP Central" },
  { id: "payments", name: "Pasarela de Pagos" },
  { id: "core", name: "Core Transaccional" },
  { id: "mobile", name: "App Móvil Clientes" },
  { id: "pos", name: "Punto de Venta (POS Tienda)" },
  { id: "dwh", name: "BigQuery / Data Warehouse" },
  { id: "apis", name: "API Gateway / Microservicios" },
  { id: "crm", name: "CRM Salesforce" },
];

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  actionPayload?: Partial<ExtendedDiscoveryForm>;
  actionLabel?: string;
  timestamp: string;
}

interface ExtendedDiscoveryForm {
  // 1.1 Identificación y Gobierno
  title: string;
  businessUnit: string;
  pmoResponsable: string;
  oficinaArea: string;
  portafolioManager: string;
  dominioMatriz: string;

  // 1.2 Alcance Iniciativa
  needDescription: string;
  whyNow: string;
  evidence: string;
  capacidades: string[];

  // 1.3 Beneficios Cualitativos
  beneficioCliente: string;
  beneficioNegocio: string;

  // 1.4 Alineación Estratégica
  strategicAlignment: "(N0) Ninguna" | "(N1) Prioritarios" | "(N2) Habilitadores/Regulatorios" | "(N3) Mejora continua";

  // 2.1 Capacidades y KPIs (OKRs)
  okrs: OKRItem[];

  // 2.2 ROI
  ingresoIncremental: string;
  ahorroCostos: string;
  inversionEstimada: string;
  horizonte: string;

  // 3.1 Dimensiones de Impacto
  dimensionesImpacto: string[]; // "Estructura" | "Procesos" | "Tecnología" | "Gente"

  // 3.2 Sistemas y Plataformas
  requiereTecnologia: "Sí" | "No" | "Aún no sé";
  sistemasAfectados: string;
  selectedSystems: string[];

  // 3.3 Dependencias en Cascada
  existeDependencia: "Sí" | "No";
  dependencias: DependenciaItem[];
}

const INITIAL_FORM: ExtendedDiscoveryForm = {
  // 1.1
  title: "Automatización de Conciliación y Liquidación Omnicanal",
  businessUnit: "Capital Humano",
  pmoResponsable: "EPL",
  oficinaArea: "TI Arquitectura & Datos",
  portafolioManager: "AL UBAMARI MALINALLI MORENO MERAZ",
  dominioMatriz: "Dominio Backoffice",

  // 1.2
  needDescription:
    "El proceso actual de conciliación entre las ventas en tienda física, portal web y pasarelas de pago se realiza mediante hojas de cálculo manuales, lo que causa demoras de hasta 48 horas en el cierre contable y discrepancias financieras.",
  whyNow:
    "El crecimiento de transacciones omnicanal en un 35% saturará los cierres mensuales de fin de año, provocando riesgos de auditoría y multas fiscales ante el SAT.",
  evidence:
    "En el último trimestre se registraron 140 horas extras por analista contable y una tasa de reproceso del 4.2% en partidas bancarias no identificadas.",
  capacidades: [
    "Conciliación en tiempo real de transacciones bancarias, pasarelas y ventas POS",
    "Generación automática de pólizas contables homologadas hacia SAP",
    "Tablero analítico con detección temprana de discrepancias monetarias",
  ],

  // 1.3
  beneficioCliente:
    "Acreditación inmediata de reembolsos y devoluciones en menos de 24 horas, eliminando quejas por cargos duplicados.",
  beneficioNegocio:
    "Cierre contable diario en menos de 15 minutos con ahorro directo estimado de $3.5M MXN anuales y eliminación del 95% de errores manuales.",

  // 1.4
  strategicAlignment: "(N2) Habilitadores/Regulatorios",

  // 2.1
  okrs: [
    {
      id: "okr-1",
      objetivo: "Reducir a cero las discrepancias en el cierre contable omnicanal",
      resultadoClave: "Conciliar el 99.5% de las transacciones diarias sin intervención humana",
      kpi: "Porcentaje de conciliación automática en tiempo real",
      clasificacion: "Calidad o Eficiencia",
      concepto: "Servicio",
    },
  ],

  // 2.2
  ingresoIncremental: "1500000",
  ahorroCostos: "3500000",
  inversionEstimada: "1800000",
  horizonte: "3 años",

  // 3.1
  dimensionesImpacto: ["Tecnología", "Procesos"],

  // 3.2
  requiereTecnologia: "Sí",
  sistemasAfectados: "SAP / ERP Central\nPasarela de Pagos\nCore Transaccional\nBigQuery / Data Warehouse\nAPI Gateway / Microservicios",
  selectedSystems: ["sap", "payments", "core", "dwh", "apis"],

  // 3.3
  existeDependencia: "Sí",
  dependencias: [
    {
      id: "dep-1",
      origen: "Portafolio Omnicanal - Ingesta de Pagos",
      destino: "Iniciativa Conciliación Omnicanal",
    },
  ],
};

export default function DiscoveryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<ExtendedDiscoveryForm>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Catálogo dinámico de sistemas y campo para nuevo sistema
  const [availableSystems, setAvailableSystems] = useState(SYSTEMS_CATALOG);
  const [newSystemInput, setNewSystemInput] = useState("");

  // Estado del chat inteligente DataSwat AI
  const [chatDraft, setChatDraft] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "¡Hola! Soy tu asistente DataSwat AI. Te guiaré paso a paso en el levantamiento y refinamiento de tu iniciativa para estructurar el caso de negocio y asegurar que llegue perfectamente perfilada al Backlog de la PMO.",
      timestamp: "Hace un momento",
    },
    {
      id: "msg-2",
      sender: "bot",
      text: "Para comenzar, puedes escribir una breve idea de lo que necesitas resolver, o hacer clic en 'Subir archivo' para que extraiga automáticamente objetivos, sistemas y beneficios monetizados.",
      timestamp: "Hace un momento",
    },
  ]);

  // Obtener nombres de los sistemas seleccionados
  const getSelectedSystemNames = () => {
    return form.selectedSystems.map((id) => {
      const found = availableSystems.find((s) => s.id === id);
      return found ? found.name : id;
    });
  };

  // Añadir un nuevo sistema personalizado al catálogo y seleccionarlo
  const handleAddCustomSystem = () => {
    const trimmed = newSystemInput.trim();
    if (!trimmed) return;

    const existing = availableSystems.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (existing) {
      if (!form.selectedSystems.includes(existing.id)) {
        setForm((prev) => ({
          ...prev,
          selectedSystems: [...prev.selectedSystems, existing.id],
        }));
      }
    } else {
      const newSys = { id: `sys-${Date.now()}`, name: trimmed };
      setAvailableSystems((prev) => [...prev, newSys]);
      setForm((prev) => ({
        ...prev,
        selectedSystems: [...prev.selectedSystems, newSys.id],
      }));
    }
    setNewSystemInput("");
  };

  // Manejo de chips de sistemas
  const toggleSystemChip = (sysId: string) => {
    setForm((prev) => {
      const exists = prev.selectedSystems.includes(sysId);
      const newSelected = exists
        ? prev.selectedSystems.filter((s) => s !== sysId)
        : [...prev.selectedSystems, sysId];

      return {
        ...prev,
        selectedSystems: newSelected,
      };
    });
  };

  // Toggle de dimensiones de impacto (3.1)
  const toggleDimension = (dim: string) => {
    setForm((prev) => {
      const exists = prev.dimensionesImpacto.includes(dim);
      return {
        ...prev,
        dimensionesImpacto: exists
          ? prev.dimensionesImpacto.filter((d) => d !== dim)
          : [...prev.dimensionesImpacto, dim],
      };
    });
  };

  // Capacidades dinámicas (1.2)
  const handleAddCapacidad = () => {
    setForm((prev) => ({
      ...prev,
      capacidades: [...prev.capacidades, ""],
    }));
  };

  const handleUpdateCapacidad = (index: number, val: string) => {
    setForm((prev) => {
      const updated = [...prev.capacidades];
      updated[index] = val;
      return { ...prev, capacidades: updated };
    });
  };

  const handleRemoveCapacidad = (index: number) => {
    setForm((prev) => ({
      ...prev,
      capacidades: prev.capacidades.filter((_, i) => i !== index),
    }));
  };

  // OKRs dinámicos (2.1)
  const handleAddOkr = () => {
    const newOkr: OKRItem = {
      id: `okr-${Date.now()}`,
      objetivo: "",
      resultadoClave: "",
      kpi: "",
      clasificacion: "Calidad o Eficiencia",
      concepto: "Servicio",
    };
    setForm((prev) => ({
      ...prev,
      okrs: [...prev.okrs, newOkr],
    }));
  };

  const handleUpdateOkr = (index: number, field: keyof OKRItem, val: string) => {
    setForm((prev) => {
      const updated = [...prev.okrs];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, okrs: updated };
    });
  };

  const handleRemoveOkr = (index: number) => {
    setForm((prev) => ({
      ...prev,
      okrs: prev.okrs.filter((_, i) => i !== index),
    }));
  };

  // Dependencias dinámicas (3.3)
  const handleAddDependencia = () => {
    const newDep: DependenciaItem = {
      id: `dep-${Date.now()}`,
      origen: "",
      destino: "",
    };
    setForm((prev) => ({
      ...prev,
      dependencias: [...prev.dependencias, newDep],
    }));
  };

  const handleUpdateDependencia = (index: number, field: "origen" | "destino", val: string) => {
    setForm((prev) => {
      const updated = [...prev.dependencias];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, dependencias: updated };
    });
  };

  const handleRemoveDependencia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      dependencias: prev.dependencias.filter((_, i) => i !== index),
    }));
  };

  // Cálculo automático de ROI (2.2)
  const numIngreso = Number(form.ingresoIncremental) || 0;
  const numAhorro = Number(form.ahorroCostos) || 0;
  const numInversion = Number(form.inversionEstimada) || 0;
  const retornoTotalAnual = numIngreso + numAhorro;
  const hasRoiData = numInversion > 0 && retornoTotalAnual > 0;
  const roiCalculado = hasRoiData ? Math.round(((retornoTotalAnual - numInversion) / numInversion) * 100) : 0;
  const paybackMeses = hasRoiData && retornoTotalAnual > 0 ? Number(((numInversion / retornoTotalAnual) * 12).toFixed(1)) : 0;

  // Cálculo del score de refinamiento (Madurez)
  const calculateReadinessScore = () => {
    let score = 25;
    if (form.title.trim().length > 6) score += 15;
    if (form.needDescription.trim().length > 20) score += 15;
    if (form.okrs.length > 0 && form.okrs[0].objetivo.trim().length > 5) score += 15;
    if (form.dimensionesImpacto.length > 0) score += 15;
    if (numInversion > 0 || numAhorro > 0) score += 15;
    return Math.min(100, score);
  };

  // Chat DataSwat AI
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

    setTimeout(() => {
      let botReply = "";
      let payload: Partial<ExtendedDiscoveryForm> | undefined;

      const lower = text.toLowerCase();
      if (lower.includes("roi") || lower.includes("beneficio") || lower.includes("ahorro") || lower.includes("inversi")) {
        botReply =
          "He proyectado el caso financiero con base en proyectos similares de Liverpool:\n• Ahorro en costos operativos: $4,200,000 MXN/año\n• Ingreso incremental estimado: $1,800,000 MXN/año\n• Inversión estimada en desarrollo e integración: $1,900,000 MXN\n• ROI estimado: 216% con recuperación de la inversión en ~3.8 meses.";
        payload = {
          ahorroCostos: "4200000",
          ingresoIncremental: "1800000",
          inversionEstimada: "1900000",
          horizonte: "3 años",
          beneficioNegocio:
            "Ahorro directo de $4.2M MXN anuales al eliminar reprocesos contables y conciliación 100% automatizada.",
        };
      } else if (lower.includes("okr") || lower.includes("kpi") || lower.includes("métrica")) {
        botReply =
          "Te sugiero estructurar los OKRs de éxito de la siguiente manera:\n• Objetivo: Eliminar demoras en el cierre de ventas y dispersión de pagos.\n• Resultado Clave: 99.8% de operaciones conciliadas en < 5 minutos.\n• KPI: Tiempo medio de liquidación por lote.\n• Clasificación: Calidad o Eficiencia (Concepto: Servicio).";
        payload = {
          okrs: [
            {
              id: `okr-${Date.now()}`,
              objetivo: "Eliminar demoras en el cierre de ventas y dispersión de pagos",
              resultadoClave: "99.8% de operaciones conciliadas en < 5 minutos",
              kpi: "Tiempo medio de liquidación por lote",
              clasificacion: "Calidad o Eficiencia",
              concepto: "Servicio",
            },
          ],
        };
      } else if (lower.includes("sistema") || lower.includes("ti") || lower.includes("tecnolog")) {
        botReply =
          "Analizando la arquitectura omnicanal, confirmo impacto en Tecnología y Procesos. Sistemas sugeridos:\n• SAP / ERP Central\n• Pasarela de Pagos\n• Core Transaccional\n• BigQuery / Data Warehouse\n• API Gateway / Microservicios";
        payload = {
          requiereTecnologia: "Sí",
          dimensionesImpacto: ["Tecnología", "Procesos"],
          selectedSystems: ["sap", "payments", "core", "dwh", "apis"],
          sistemasAfectados: "SAP / ERP Central\nPasarela de Pagos\nCore Transaccional\nBigQuery / Data Warehouse\nAPI Gateway / Microservicios",
        };
      } else if (lower.includes("alineaci") || lower.includes("estratég")) {
        botReply =
          "Esta iniciativa corresponde al nivel '(N2) Habilitadores/Regulatorios' ya que moderniza la infraestructura financiera y garantiza cumplimiento contable con auditorías del SAT.";
        payload = {
          strategicAlignment: "(N2) Habilitadores/Regulatorios",
        };
      } else {
        botReply = `Entendido. He analizado "${text}". Estructuré el dolor de negocio y las capacidades para presentarlas ante la PMO con un enfoque de alto impacto y trazabilidad institucional.`;
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
    }, 850);
  };

  // Simulación de carga de archivo PDF
  const handleAttachMockFile = () => {
    const fileMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: "📎 He subido el documento: 'Caso_Negocio_Conciliacion_Liverpool_2026.pdf' (1.8 MB)",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, fileMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "✅ Documento procesado exitosamente por DataSwat AI. He extraído el caso completo:\n• Título y Gobierno: Finanzas / PMO EPL\n• Alcance y Sustento: Conciliación omnicanal automatizada\n• OKRs y ROI: Ahorro de $3.8M MXN anuales con ROI 210%\n• Sistemas: SAP, Pasarela de Pagos, BigQuery y APIs\nPuedes aplicar todos los datos a la ficha con un solo clic.",
        actionPayload: {
          title: "Plataforma Inteligente de Conciliación y Liquidación Omnicanal",
          businessUnit: "Finanzas y Contabilidad",
          pmoResponsable: "EPL",
          oficinaArea: "TI Arquitectura & Finanzas",
          portafolioManager: "AL UBAMARI MALINALLI MORENO MERAZ",
          needDescription:
            "Reemplazar los procesos manuales por una arquitectura orientada a eventos para procesar 1.4M de transacciones mensuales sin fricción.",
          whyNow:
            "El volumen de transacciones de temporada alta excede la capacidad humana y requiere automatización para cumplir con las normativas contables.",
          evidence:
            "48 horas de retraso promedio en cierres contables y un 3.8% de transacciones pendientes de validación.",
          capacidades: [
            "Conciliación en tiempo real de transacciones bancarias, pasarelas y ventas POS",
            "Generación automática de pólizas contables homologadas hacia SAP",
            "Tablero analítico con detección temprana de discrepancias monetarias",
          ],
          beneficioCliente:
            "Reembolsos y aclaraciones reflejados en tiempo récord sin retrasos administrativos.",
          beneficioNegocio:
            "Ahorro de $3.8M MXN anuales y reducción del 90% en tiempos de auditoría financiera.",
          strategicAlignment: "(N2) Habilitadores/Regulatorios",
          ahorroCostos: "3800000",
          ingresoIncremental: "1600000",
          inversionEstimada: "1800000",
          horizonte: "3 años",
          dimensionesImpacto: ["Tecnología", "Procesos"],
          requiereTecnologia: "Sí",
          selectedSystems: ["sap", "payments", "core", "dwh", "apis"],
          sistemasAfectados: "SAP / ERP Central\nPasarela de Pagos\nCore Transaccional\nBigQuery / Data Warehouse\nAPI Gateway / Microservicios",
          existeDependencia: "Sí",
          dependencias: [
            {
              id: "dep-mock-1",
              origen: "Portafolio Omnicanal - Ingesta de Pagos",
              destino: "Iniciativa Conciliación Omnicanal",
            },
          ],
        },
        actionLabel: "✨ Aplicar datos extraídos del PDF a la ficha",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
      setIsAiTyping(false);
    }, 1100);
  };

  const applyPayloadToForm = (payload?: Partial<ExtendedDiscoveryForm>) => {
    if (!payload) return;
    setForm((prev) => ({ ...prev, ...payload }));
  };

  // Guardar en el store de priorización y avanzar
  const addInitiativeStore = usePriorizacionStore((s) => s.addInitiative);

  const handleSubmitToBacklog = () => {
    setIsSubmitting(true);
    const savingsNum = Number(form.ahorroCostos) || 3500000;
    const savingsStr = `$${(savingsNum / 1000000).toFixed(1)}M MXN / año`;

    addInitiativeStore({
      name: form.title || "Automatización de Conciliación y Liquidación Omnicanal",
      area: form.businessUnit || "Capital Humano",
      status: "Nueva",
      etapaCiclo: "Priorización",
      estadoOperativo: "Por revisar",
      description: form.needDescription || "Iniciativa formulada con asistencia de IA en Discovery.",
      solicitante: "Argos Eyra Martínez Zeferino",
      sponsor: form.portafolioManager || "AL UBAMARI MALINALLI MORENO MERAZ",
      sponsorRole: "Portfolio Manager",
      impactoTI: form.requiereTecnologia === "Sí" ? "Sí, proyecto tecnológico" : form.requiereTecnologia === "No" ? "No tecnológico" : "Por determinar",
      sistemasInvolucrados: getSelectedSystemNames().length ? getSelectedSystemNames() : ["SAP", "API Gateway"],
      beneficioEstimado: savingsStr,
      beneficioDetalle: form.beneficioNegocio || "Ahorro operativo y reducción de tiempos",
      kpiEsperado: form.okrs[0]?.kpi || "Reducción de tiempos operativos",
      madurez: calculateReadinessScore(),
      madurezTag: "100% Refinada",
      esfuerzo: 55,
      impacto: 80,
      color: "#e6007e",
      // Campos Discovery extendidos
      direccionNegocio: form.businessUnit,
      pmoResponsable: form.pmoResponsable,
      oficinaArea: form.oficinaArea,
      portafolioManager: form.portafolioManager,
      dominioMatriz: form.dominioMatriz,
      alcanceQue: form.needDescription,
      alcancePorQue: form.whyNow,
      evidenciaSustento: form.evidence,
      capacidades: form.capacidades,
      beneficioCliente: form.beneficioCliente,
      beneficioNegocio: form.beneficioNegocio,
      alineacionEstrategicaNivel: form.strategicAlignment,
      okrs: form.okrs,
      roiData: {
        ingresoIncrementalAnual: form.ingresoIncremental,
        ahorroCostosAnual: form.ahorroCostos,
        inversionEstimada: form.inversionEstimada,
        horizonte: form.horizonte,
        roiPorcentaje: roiCalculado,
        paybackMeses,
      },
      dimensionesImpacto: form.dimensionesImpacto,
      intervencionTecnologia: form.requiereTecnologia,
      sistemasDetalle: getSelectedSystemNames().join(", "),
      dependenciasCascada: form.dependencias,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 600);
  };

  const readinessScore = calculateReadinessScore();

  return (
    <div>
      {/* 1. NAVEGACIÓN SUPERIOR */}
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

      {/* 2. ENCABEZADO PRINCIPAL DE DISCOVERY */}
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

      {/* 3. STEPPER HORIZONTAL GUIADO (PEGA BLUE PRINT - IMÁGENES 2, 3, 4, 5) */}
      <nav className="blueprint-stepper" aria-label="Pasos de descubrimiento">
        {/* Paso 1 */}
        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}
          onClick={() => setCurrentStep(1)}
        >
          <span className="blueprint-step-num">
            {currentStep > 1 ? <Icon icon={Check} size={13} /> : "1"}
          </span>
          <div>
            <div style={{ fontWeight: 700 }}>Necesidad - Negocio</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Descripción de Alcance</div>
          </div>
        </button>

        {/* Paso 2 */}
        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}
          onClick={() => setCurrentStep(2)}
        >
          <span className="blueprint-step-num">
            {currentStep > 2 ? <Icon icon={Check} size={13} /> : "2"}
          </span>
          <div>
            <div style={{ fontWeight: 700 }}>KPIs de Éxito</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Capacidades, KPIs y ROI</div>
          </div>
        </button>

        {/* Paso 3 */}
        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}
          onClick={() => setCurrentStep(3)}
        >
          <span className="blueprint-step-num">
            {currentStep > 3 ? <Icon icon={Check} size={13} /> : "3"}
          </span>
          <div>
            <div style={{ fontWeight: 700 }}>Impacto TI y Sistemas</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Sistemas y Dependencias</div>
          </div>
        </button>

        {/* Paso 4 */}
        <button
          type="button"
          className={`blueprint-step-btn ${currentStep === 4 ? "active" : ""}`}
          onClick={() => setCurrentStep(4)}
        >
          <span className="blueprint-step-num">4</span>
          <div>
            <div style={{ fontWeight: 700 }}>Ficha Canvas</div>
            <div style={{ fontSize: 10.5, opacity: 0.75 }}>Envío al Backlog</div>
          </div>
        </button>
      </nav>

      {/* 4. LAYOUT A DOS COLUMNAS: FORMULARIO GUIADO (IZQUIERDA) + DATASWAT AI (DERECHA) */}
      <div className="discovery-layout">
        {/* COLUMNA IZQUIERDA: CONTENIDO DEL PASO ACTIVO */}
        <div style={{ minWidth: 0 }}>
          {/* ========================================================
              PASO 1: NECESIDAD - NEGOCIO (IMAGEN 2)
              ======================================================== */}
          {currentStep === 1 && (
            <div>
              {/* 1.1 IDENTIFICACIÓN DE LA INICIATIVA */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">1.1</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={FileIcon} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Identificación de la iniciativa</h3>
                      <p className="disc-block-sub">Quién solicita y bajo qué gobierno se registra.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  {/* Nombre de la iniciativa */}
                  <div>
                    <label className="disc-field-label">
                      <span>Nombre de la iniciativa</span>
                      <span className="disc-required-star">*</span>
                      <span className="disc-tooltip-icon" title="Nombre descriptivo de la iniciativa">?</span>
                      <span className="disc-check-ok">✓</span>
                    </label>
                    <input
                      type="text"
                      className="config-card__input"
                      value={form.title}
                      placeholder="Ej. Automatización de Conciliación y Liquidación Omnicanal"
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  {/* Subsección Gobierno */}
                  <div>
                    <div className="disc-subhead-label">GOBIERNO</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label className="disc-field-label">
                          <span>Dirección de negocio</span>
                          <span className="disc-required-star">*</span>
                          <span className="disc-check-ok">✓</span>
                        </label>
                        <select
                          className="config-card__input"
                          value={form.businessUnit}
                          onChange={(e) => setForm({ ...form, businessUnit: e.target.value })}
                        >
                          {DIRECCIONES_NEGOCIO.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="disc-field-label">
                          <span>PMO responsable</span>
                          <span className="disc-required-star">*</span>
                          <span className="disc-tooltip-icon" title="Oficina de gestión asignada">?</span>
                          <span className="disc-check-ok">✓</span>
                        </label>
                        <select
                          className="config-card__input"
                          value={form.pmoResponsable}
                          onChange={(e) => setForm({ ...form, pmoResponsable: e.target.value })}
                        >
                          {PMO_CATALOG.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Oficina / Área */}
                  <div>
                    <label className="disc-field-label">
                      <span>Oficina / Área</span>
                      <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                      <span className="disc-check-ok">✓</span>
                    </label>
                    <input
                      type="text"
                      className="config-card__input"
                      value={form.oficinaArea}
                      placeholder="Ej. TI Arquitectura & Datos"
                      onChange={(e) => setForm({ ...form, oficinaArea: e.target.value })}
                    />
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>
                      Tomada del directorio. Si no es correcta, puedes cambiarla.
                    </div>
                  </div>

                  {/* Asignación según matriz */}
                  <div className="disc-matrix-card">
                    <div className="disc-matrix-header">
                      <div className="disc-matrix-title">
                        <Icon icon={Person} size={15} />
                        <span>Asignación según matriz</span>
                      </div>
                      <span className="disc-matrix-badge">{form.dominioMatriz}</span>
                    </div>

                    <div className="disc-matrix-grid">
                      <div>
                        <div className="disc-matrix-k">PMO</div>
                        <div className="disc-matrix-v">{form.pmoResponsable}</div>
                      </div>
                      <div>
                        <div className="disc-matrix-k">PORTAFOLIO MANAGER</div>
                        <div className="disc-matrix-v">{form.portafolioManager}</div>
                      </div>
                    </div>

                    <div className="disc-matrix-note">
                      Se guarda automáticamente al enviar la ficha. Gerente BP, Arquitecto de Dominio y Coordinador TI SE se asignan cuando el Portafolio Manager confirme que tiene impacto de Tecnología.
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.2 ALCANCE INICIATIVA */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">1.2</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Info} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Alcance Iniciativa</h3>
                      <p className="disc-block-sub">Describe la necesidad con evidencia, no la solución técnica.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="disc-field-label">
                        <span>¿Qué necesitamos resolver?</span>
                        <span className="disc-required-star">*</span>
                        <span className="disc-tooltip-icon" title="Problema de fondo o dolor operativo">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <textarea
                        rows={4}
                        className="config-card__input"
                        style={{ resize: "vertical" }}
                        value={form.needDescription}
                        placeholder="Describe el problema que se busca solucionar..."
                        onChange={(e) => setForm({ ...form, needDescription: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="disc-field-label">
                        <span>¿Por qué ahora?</span>
                        <span className="disc-required-star">*</span>
                        <span className="disc-tooltip-icon" title="Urgencia y contexto temporal">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <textarea
                        rows={4}
                        className="config-card__input"
                        style={{ resize: "vertical" }}
                        value={form.whyNow}
                        placeholder="Describe la urgencia y el impacto de postergar..."
                        onChange={(e) => setForm({ ...form, whyNow: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Sustento */}
                  <div>
                    <div className="disc-subhead-label">SUSTENTO</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <label className="disc-field-label">
                          <span>Evidencia y estadísticas</span>
                          <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                          <span className="disc-tooltip-icon" title="Datos numéricos o métricas de dolor">?</span>
                          <span className="disc-check-ok">✓</span>
                        </label>
                        <textarea
                          rows={4}
                          className="config-card__input"
                          style={{ resize: "vertical" }}
                          value={form.evidence}
                          placeholder="Datos duros que respalden la necesidad..."
                          onChange={(e) => setForm({ ...form, evidence: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="disc-field-label">
                          <span>¿Qué seremos capaces de hacer al concluir?</span>
                          <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                          <span className="disc-tooltip-icon" title="Capacidades nuevas adquiridas">?</span>
                          <span className="disc-check-ok">✓</span>
                        </label>

                        {form.capacidades.map((cap, idx) => (
                          <div key={idx} className="disc-dynamic-row">
                            <span className="disc-row-num">{idx + 1}</span>
                            <input
                              type="text"
                              className="config-card__input"
                              style={{ flex: 1 }}
                              value={cap}
                              placeholder="Describe la capacidad alcanzada..."
                              onChange={(e) => handleUpdateCapacidad(idx, e.target.value)}
                            />
                            {form.capacidades.length > 1 && (
                              <button
                                type="button"
                                className="disc-icon-btn-danger"
                                onClick={() => handleRemoveCapacidad(idx)}
                                title="Eliminar capacidad"
                              >
                                <Icon icon={Delete} size={16} />
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          className="disc-btn-add"
                          style={{ marginTop: 6 }}
                          onClick={handleAddCapacidad}
                        >
                          <Icon icon={Add} size={14} />
                          <span>Añadir capacidad</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.3 BENEFICIOS CUALITATIVOS */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">1.3</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Bolt} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Beneficios cualitativos</h3>
                      <p className="disc-block-sub">Qué gana el cliente y qué gana el negocio.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="disc-field-label">
                        <span>Beneficio al cliente</span>
                        <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                        <span className="disc-tooltip-icon" title="Impacto directo en la experiencia del cliente">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <textarea
                        rows={3}
                        className="config-card__input"
                        style={{ resize: "vertical" }}
                        value={form.beneficioCliente}
                        placeholder="Impacto directo en el cliente final o colaborador..."
                        onChange={(e) => setForm({ ...form, beneficioCliente: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="disc-field-label">
                        <span>Beneficio al negocio</span>
                        <span className="disc-required-star">*</span>
                        <span className="disc-tooltip-icon" title="Valor estratégico para la empresa">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <textarea
                        rows={3}
                        className="config-card__input"
                        style={{ resize: "vertical" }}
                        value={form.beneficioNegocio}
                        placeholder="Ahorros operativos, cumplimiento, incremento en ventas..."
                        onChange={(e) => setForm({ ...form, beneficioNegocio: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.4 ALINEACIÓN ESTRATÉGICA */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">1.4</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Timeline} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Alineación estratégica</h3>
                      <p className="disc-block-sub">Nivel de prioridad dentro del portafolio institucional.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  <div>
                    <label className="disc-field-label">
                      <span>Nivel de alineación</span>
                      <span className="disc-required-star">*</span>
                      <span className="disc-check-ok">✓</span>
                    </label>

                    <div className="disc-align-grid">
                      {/* N0 */}
                      <div
                        className={`disc-align-card ${form.strategicAlignment === "(N0) Ninguna" ? "disc-align-card--active" : ""}`}
                        onClick={() => setForm({ ...form, strategicAlignment: "(N0) Ninguna" })}
                      >
                        <div className="disc-align-card__title">
                          <span>(N0) Ninguna</span>
                          {form.strategicAlignment === "(N0) Ninguna" && <span style={{ color: "#db2777" }}>✓</span>}
                        </div>
                        <div className="disc-align-card__desc">
                          Sin vínculo directo con la estrategia vigente.
                        </div>
                      </div>

                      {/* N1 */}
                      <div
                        className={`disc-align-card ${form.strategicAlignment === "(N1) Prioritarios" ? "disc-align-card--active" : ""}`}
                        onClick={() => setForm({ ...form, strategicAlignment: "(N1) Prioritarios" })}
                      >
                        <div className="disc-align-card__title">
                          <span>(N1) Prioritarios</span>
                          {form.strategicAlignment === "(N1) Prioritarios" && <span style={{ color: "#db2777" }}>✓</span>}
                        </div>
                        <div className="disc-align-card__desc">
                          Apalanca una prioridad explícita del plan.
                        </div>
                      </div>

                      {/* N2 */}
                      <div
                        className={`disc-align-card ${form.strategicAlignment === "(N2) Habilitadores/Regulatorios" ? "disc-align-card--active" : ""}`}
                        onClick={() => setForm({ ...form, strategicAlignment: "(N2) Habilitadores/Regulatorios" })}
                      >
                        <div className="disc-align-card__title">
                          <span>(N2) Habilitadores/Regulatorios</span>
                          {form.strategicAlignment === "(N2) Habilitadores/Regulatorios" && <span style={{ color: "#db2777" }}>✓</span>}
                        </div>
                        <div className="disc-align-card__desc">
                          Habilita capacidades o cumple una norma.
                        </div>
                      </div>

                      {/* N3 */}
                      <div
                        className={`disc-align-card ${form.strategicAlignment === "(N3) Mejora continua" ? "disc-align-card--active" : ""}`}
                        onClick={() => setForm({ ...form, strategicAlignment: "(N3) Mejora continua" })}
                      >
                        <div className="disc-align-card__title">
                          <span>(N3) Mejora continua</span>
                          {form.strategicAlignment === "(N3) Mejora continua" && <span style={{ color: "#db2777" }}>✓</span>}
                        </div>
                        <div className="disc-align-card__desc">
                          Optimización incremental de la operación.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de avance al Paso 2 */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-purple-solid"
                  onClick={() => setCurrentStep(2)}
                >
                  <span>Continuar a KPIs de Éxito</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              PASO 2: KPIS DE ÉXITO Y ROI (IMAGEN 3)
              ======================================================== */}
          {currentStep === 2 && (
            <div>
              {/* 2.1 CAPACIDADES Y KPIS (OKRS) */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">2.1</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Timeline} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Capacidades y KPIs (OKRs)</h3>
                      <p className="disc-block-sub">Cómo mediremos que la iniciativa cumplió su promesa.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  {form.okrs.map((okr, idx) => (
                    <div key={okr.id} className="disc-okr-card">
                      <div className="disc-okr-header">
                        <span className="disc-okr-badge">OKR {idx + 1}</span>
                        {form.okrs.length > 1 && (
                          <button
                            type="button"
                            className="disc-icon-btn-danger"
                            onClick={() => handleRemoveOkr(idx)}
                            title="Eliminar OKR"
                          >
                            <Icon icon={Delete} size={16} />
                          </button>
                        )}
                      </div>

                      {/* Objetivo */}
                      <div>
                        <label className="disc-field-label">
                          <span>Objetivo</span>
                          <span className="disc-tooltip-icon" title="Meta cualitativa que se desea lograr">?</span>
                          <span className="disc-check-ok">✓</span>
                        </label>
                        <input
                          type="text"
                          className="config-card__input"
                          value={okr.objetivo}
                          placeholder="Ej. Automatizar la conciliación de flujos de pago..."
                          onChange={(e) => handleUpdateOkr(idx, "objetivo", e.target.value)}
                        />
                      </div>

                      {/* Resultado Clave y KPI */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label className="disc-field-label">
                            <span>Resultado clave</span>
                            <span className="disc-tooltip-icon" title="Cómo se medirá el avance concreto">?</span>
                            <span className="disc-check-ok">✓</span>
                          </label>
                          <input
                            type="text"
                            className="config-card__input"
                            value={okr.resultadoClave}
                            placeholder="Ej. Conciliar el 99.5% de transacciones..."
                            onChange={(e) => handleUpdateOkr(idx, "resultadoClave", e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="disc-field-label">
                            <span>KPI</span>
                            <span className="disc-tooltip-icon" title="Métrica de medición periódica">?</span>
                            <span className="disc-check-ok">✓</span>
                          </label>
                          <input
                            type="text"
                            className="config-card__input"
                            value={okr.kpi}
                            placeholder="Ej. % conciliación automática"
                            onChange={(e) => handleUpdateOkr(idx, "kpi", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Clasificación y Concepto */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div>
                          <label className="disc-field-label">
                            <span>Clasificación del KPI</span>
                            <span className="disc-tooltip-icon" title="Dimensión de impacto del KPI">?</span>
                            <span className="disc-check-ok">✓</span>
                          </label>
                          <select
                            className="config-card__input"
                            value={okr.clasificacion}
                            onChange={(e) => handleUpdateOkr(idx, "clasificacion", e.target.value)}
                          >
                            {CLASIFICACIONES_KPI.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="disc-field-label">
                            <span>Concepto</span>
                            <span className="disc-tooltip-icon" title="Área de impacto contable/operativo">?</span>
                            <span className="disc-check-ok">✓</span>
                          </label>
                          <select
                            className="config-card__input"
                            value={okr.concepto}
                            onChange={(e) => handleUpdateOkr(idx, "concepto", e.target.value)}
                          >
                            {CONCEPTOS_KPI.map((cp) => (
                              <option key={cp} value={cp}>
                                {cp}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="disc-btn-add"
                    onClick={handleAddOkr}
                  >
                    <Icon icon={Add} size={14} />
                    <span>Añadir OKR</span>
                  </button>
                </div>
              </div>

              {/* 2.2 ROI */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">2.2</span>
                    <span className="disc-block-icon-wrap">
                      <span style={{ fontWeight: 800, fontSize: 13 }}>$</span>
                    </span>
                    <div>
                      <h3 className="disc-block-title">ROI</h3>
                      <p className="disc-block-sub">Cifras anuales estimadas en pesos. El ROI se calcula solo.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {/* Ingreso incremental */}
                    <div>
                      <label className="disc-field-label">
                        <span>Ingreso incremental anual</span>
                        <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                        <span className="disc-tooltip-icon" title="Nuevas ventas generadas anualmente">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: 9, color: "#6b7280", fontWeight: 600 }}>$</span>
                        <input
                          type="number"
                          className="config-card__input"
                          style={{ paddingLeft: 26 }}
                          value={form.ingresoIncremental}
                          placeholder="0"
                          onChange={(e) => setForm({ ...form, ingresoIncremental: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Ahorro en costos anual */}
                    <div>
                      <label className="disc-field-label">
                        <span>Ahorro en costos anual</span>
                        <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                        <span className="disc-tooltip-icon" title="Reducción de costos o tiempos anuales">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: 9, color: "#6b7280", fontWeight: 600 }}>$</span>
                        <input
                          type="number"
                          className="config-card__input"
                          style={{ paddingLeft: 26 }}
                          value={form.ahorroCostos}
                          placeholder="0"
                          onChange={(e) => setForm({ ...form, ahorroCostos: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {/* Inversión estimada */}
                    <div>
                      <label className="disc-field-label">
                        <span>Inversión estimada</span>
                        <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                        <span className="disc-tooltip-icon" title="Costo inicial estimado del proyecto">?</span>
                        <span className="disc-check-ok">✓</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: 9, color: "#6b7280", fontWeight: 600 }}>$</span>
                        <input
                          type="number"
                          className="config-card__input"
                          style={{ paddingLeft: 26 }}
                          value={form.inversionEstimada}
                          placeholder="0"
                          onChange={(e) => setForm({ ...form, inversionEstimada: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Horizonte de evaluación */}
                    <div>
                      <label className="disc-field-label">
                        <span>Horizonte de evaluación</span>
                        <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                        <span className="disc-tooltip-icon" title="Plazo proyectado del caso">?</span>
                      </label>
                      <input
                        type="text"
                        className="config-card__input"
                        value={form.horizonte}
                        placeholder="Ej. 3 años"
                        onChange={(e) => setForm({ ...form, horizonte: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* RESULTADO (Caja punteada estilo Imagen 3) */}
                  <div>
                    <div className="disc-subhead-label">RESULTADO</div>
                    {hasRoiData ? (
                      <div className="disc-roi-result-box disc-roi-result-box--filled">
                        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
                          <div>
                            <div style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>RETORNO ANUAL ESTIMADO</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#15803d" }}>
                              ${retornoTotalAnual.toLocaleString()} MXN
                            </div>
                          </div>
                          <div style={{ width: 1, height: 32, background: "#86efac" }} />
                          <div>
                            <div style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>ROI ESTIMADO</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "#15803d" }}>
                              +{roiCalculado}%
                            </div>
                          </div>
                          <div style={{ width: 1, height: 32, background: "#86efac" }} />
                          <div>
                            <div style={{ fontSize: 11, color: "#166534", fontWeight: 600 }}>PUNTO DE RECUPERACIÓN</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#15803d" }}>
                              ~{paybackMeses} meses
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="disc-roi-result-box">
                        <span style={{ fontSize: 12.5, color: "#64748b" }}>
                          Captura inversión y retorno para ver el ROI y el punto de recuperación.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de navegación */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Volver a Necesidad</span>
                </button>
                <button
                  type="button"
                  className="btn-purple-solid"
                  onClick={() => setCurrentStep(3)}
                >
                  <span>Continuar a Impacto TI</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              PASO 3: IMPACTO TI Y SISTEMAS (IMAGEN 4)
              ======================================================== */}
          {currentStep === 3 && (
            <div>
              {/* 3.1 DIMENSIONES DE IMPACTO */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">3.1</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Settings} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Dimensiones de impacto</h3>
                      <p className="disc-block-sub">Selecciona todo lo que el cambio va a mover.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--progress">
                    {form.dimensionesImpacto.length} de 4
                  </span>
                </div>

                <div className="disc-block-body">
                  <div>
                    <label className="disc-field-label">
                      <span>Análisis de impacto</span>
                      <span className="disc-required-star">*</span>
                      <span className="disc-tooltip-icon" title="Áreas institucionales impactadas">?</span>
                      <span className="disc-check-ok">✓</span>
                    </label>

                    <div className="disc-impact-grid">
                      {/* Estructura */}
                      <div
                        className={`disc-impact-card ${form.dimensionesImpacto.includes("Estructura") ? "disc-impact-card--active" : ""}`}
                        onClick={() => toggleDimension("Estructura")}
                      >
                        <div className="disc-impact-card__icon">
                          <Icon icon={Settings} size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="disc-impact-card__title">
                            <span>Estructura</span>
                            {form.dimensionesImpacto.includes("Estructura") && <span style={{ color: "#db2777" }}>✓</span>}
                          </div>
                          <div className="disc-impact-card__desc">
                            Cambian áreas, roles o plantilla.
                          </div>
                        </div>
                      </div>

                      {/* Procesos */}
                      <div
                        className={`disc-impact-card ${form.dimensionesImpacto.includes("Procesos") ? "disc-impact-card--active" : ""}`}
                        onClick={() => toggleDimension("Procesos")}
                      >
                        <div className="disc-impact-card__icon">
                          <Icon icon={Timeline} size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="disc-impact-card__title">
                            <span>Procesos</span>
                            {form.dimensionesImpacto.includes("Procesos") && <span style={{ color: "#db2777" }}>✓</span>}
                          </div>
                          <div className="disc-impact-card__desc">
                            Se rediseña la forma de operar.
                          </div>
                        </div>
                      </div>

                      {/* Tecnología */}
                      <div
                        className={`disc-impact-card ${form.dimensionesImpacto.includes("Tecnología") ? "disc-impact-card--active" : ""}`}
                        onClick={() => toggleDimension("Tecnología")}
                      >
                        <div className="disc-impact-card__icon">
                          <Icon icon={Bolt} size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="disc-impact-card__title">
                            <span>Tecnología</span>
                            {form.dimensionesImpacto.includes("Tecnología") && <span style={{ color: "#db2777" }}>✓</span>}
                          </div>
                          <div className="disc-impact-card__desc">
                            Requiere sistemas, datos o integraciones.
                          </div>
                        </div>
                      </div>

                      {/* Gente */}
                      <div
                        className={`disc-impact-card ${form.dimensionesImpacto.includes("Gente") ? "disc-impact-card--active" : ""}`}
                        onClick={() => toggleDimension("Gente")}
                      >
                        <div className="disc-impact-card__icon">
                          <Icon icon={Person} size={16} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="disc-impact-card__title">
                            <span>Gente</span>
                            {form.dimensionesImpacto.includes("Gente") && <span style={{ color: "#db2777" }}>✓</span>}
                          </div>
                          <div className="disc-impact-card__desc">
                            Implica capacitación o gestión del cambio.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.2 SISTEMAS Y PLATAFORMAS */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">3.2</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Settings} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Sistemas y plataformas</h3>
                      <p className="disc-block-sub">Define si TI participa y qué se ve involucrado.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--progress">
                    {form.requiereTecnologia === "Sí" ? "1 de 2" : "✓ Completo"}
                  </span>
                </div>

                <div className="disc-block-body">
                  {/* Selector Sí / No / Aún no sé */}
                  <div>
                    <label className="disc-field-label">
                      <span>¿Requiere intervención de Tecnología?</span>
                      <span className="disc-required-star">*</span>
                      <span className="disc-tooltip-icon" title="Indica si habrá desarrollo de software o infraestructura">?</span>
                      <span className="disc-check-ok">✓</span>
                    </label>

                    <div className="disc-segment-group">
                      <button
                        type="button"
                        className={`disc-segment-btn ${form.requiereTecnologia === "Sí" ? "disc-segment-btn--active" : ""}`}
                        onClick={() => setForm({ ...form, requiereTecnologia: "Sí" })}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        className={`disc-segment-btn ${form.requiereTecnologia === "No" ? "disc-segment-btn--active" : ""}`}
                        onClick={() => setForm({ ...form, requiereTecnologia: "No" })}
                      >
                        No
                      </button>
                      <button
                        type="button"
                        className={`disc-segment-btn ${form.requiereTecnologia === "Aún no sé" ? "disc-segment-btn--active" : ""}`}
                        onClick={() => setForm({ ...form, requiereTecnologia: "Aún no sé" })}
                      >
                        Aún no sé
                      </button>
                    </div>
                  </div>

                  {/* Detalle Técnico */}
                  {form.requiereTecnologia !== "No" && (
                    <div>
                      <div className="disc-subhead-label">DETALLE TÉCNICO</div>
                      <div>
                        <label className="disc-field-label">
                          <span>Sistemas y plataformas afectadas</span>
                          <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                          <span className="disc-tooltip-icon" title="Selecciona o añade los sistemas involucrados">?</span>
                        </label>

                        {/* Cuadro de texto para agregar nuevo sistema con botón ADD */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 12, maxWidth: 520 }}>
                          <input
                            type="text"
                            className="config-card__input"
                            placeholder="Escribe el nombre de otro sistema o plataforma..."
                            value={newSystemInput}
                            onChange={(e) => setNewSystemInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomSystem();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn-purple-solid"
                            style={{ padding: "0 18px", height: 38, fontSize: 12, fontWeight: 700, flexShrink: 0 }}
                            onClick={handleAddCustomSystem}
                          >
                            <Icon icon={Add} size={14} />
                            <span>ADD</span>
                          </button>
                        </div>

                        {/* Chips seleccionables de sistemas */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {availableSystems.map((sys) => {
                            const isSelected = form.selectedSystems.includes(sys.id);
                            return (
                              <button
                                key={sys.id}
                                type="button"
                                className={`tag-pill ${isSelected ? "tag-pill--purple" : ""}`}
                                style={{
                                  cursor: "pointer",
                                  fontSize: 12,
                                  padding: "6px 14px",
                                  borderRadius: 20,
                                  background: isSelected ? "var(--brand-primary)" : "#f1f3f5",
                                  color: isSelected ? "#ffffff" : "#4b5563",
                                  border: isSelected ? "1px solid var(--brand-primary)" : "1px solid #d0d4e4",
                                  fontWeight: isSelected ? 700 : 500,
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  transition: "all 0.15s ease",
                                }}
                                onClick={() => toggleSystemChip(sys.id)}
                              >
                                <span>{isSelected ? "✓" : "+"}</span>
                                <span>{sys.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3.3 DEPENDENCIAS EN CASCADA */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">3.3</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Timeline} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Dependencias en cascada</h3>
                      <p className="disc-block-sub">Proyectos que deben existir antes o avanzar en paralelo.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  <div>
                    <label className="disc-field-label">
                      <span>Portafolio y proyecto del que depende</span>
                      <span style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500 }}>(opcional)</span>
                      <span className="disc-tooltip-icon" title="Dependencias cruzadas entre iniciativas">?</span>
                    </label>

                    {form.dependencias.map((dep, idx) => (
                      <div key={dep.id} className="disc-dynamic-row">
                        <input
                          type="text"
                          className="config-card__input"
                          style={{ flex: 1 }}
                          value={dep.origen}
                          placeholder="Portafolio / Proyecto origen..."
                          onChange={(e) => handleUpdateDependencia(idx, "origen", e.target.value)}
                        />
                        <span style={{ color: "#9ca3af", fontWeight: 700 }}>→</span>
                        <input
                          type="text"
                          className="config-card__input"
                          style={{ flex: 1 }}
                          value={dep.destino}
                          placeholder="Iniciativa / Dependencia destino..."
                          onChange={(e) => handleUpdateDependencia(idx, "destino", e.target.value)}
                        />
                        {form.dependencias.length > 1 && (
                          <button
                            type="button"
                            className="disc-icon-btn-danger"
                            onClick={() => handleRemoveDependencia(idx)}
                            title="Eliminar dependencia"
                          >
                            <Icon icon={Delete} size={16} />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="disc-btn-add"
                      style={{ marginTop: 6 }}
                      onClick={handleAddDependencia}
                    >
                      <Icon icon={Add} size={14} />
                      <span>Añadir dependencia</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de navegación */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-purple-outline"
                  onClick={() => setCurrentStep(2)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Volver a KPIs</span>
                </button>
                <button
                  type="button"
                  className="btn-purple-solid"
                  onClick={() => setCurrentStep(4)}
                >
                  <span>Continuar a Ficha Canvas</span>
                  <Icon icon={NavigationChevronRight} size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              PASO 4: FICHA CANVAS DE INICIATIVA (IMAGEN 5)
              ======================================================== */}
          {currentStep === 4 && (
            <div>
              {/* LA GRAN FICHA CANVAS INSTITUCIONAL DE LIVERPOOL */}
              <div className="disc-canvas-card">
                {/* Banner superior */}
                <div className="disc-canvas-banner">
                  <div className="disc-canvas-banner__title">
                    FICHA CANVAS DE INICIATIVA
                  </div>
                  <div className="disc-canvas-banner__sub">
                    Una división de: El Puerto de Liverpool
                  </div>
                </div>

                <div className="disc-canvas-body">
                  {/* Nombre del proyecto */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <Icon icon={FileIcon} size={13} />
                      <span>Nombre del proyecto</span>
                    </div>
                    <div className="disc-canvas-box__val" style={{ fontWeight: 700, fontSize: 14 }}>
                      {form.title}
                    </div>
                  </div>

                  {/* A qué alineación estratégica pertenece */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <Icon icon={Timeline} size={13} />
                      <span>A qué alineación estratégica pertenece (Pirámide)</span>
                    </div>
                    <div className="disc-canvas-chk-row">
                      {["(N0) Ninguna", "(N1) Prioritarios", "(N2) Habilitadores/Regulatorios", "(N3) Mejora continua"].map((opt) => {
                        const isMatch = form.strategicAlignment === opt;
                        return (
                          <div
                            key={opt}
                            className={`disc-canvas-chk-item ${isMatch ? "disc-canvas-chk-item--selected" : ""}`}
                          >
                            <span>{isMatch ? "☑" : "☐"}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2 Columnas: Descripción del alcance vs Beneficios */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {/* Columna Izquierda: Alcance */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div className="disc-canvas-box">
                        <div className="disc-canvas-box__label">
                          <Icon icon={Info} size={13} />
                          <span>Descripción del alcance</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", marginBottom: 2 }}>
                          ¿Qué?
                        </div>
                        <div className="disc-canvas-box__val" style={{ marginBottom: 8 }}>
                          {form.needDescription}
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", marginBottom: 2 }}>
                          ¿Por qué?
                        </div>
                        <div className="disc-canvas-box__val" style={{ marginBottom: 8 }}>
                          {form.whyNow}
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", marginBottom: 2 }}>
                          Estadísticas / justificación
                        </div>
                        <div className="disc-canvas-box__val">
                          {form.evidence || "Sin estadísticas adicionales."}
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: Beneficios */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div className="disc-canvas-box">
                        <div className="disc-canvas-box__label">
                          <Icon icon={Bolt} size={13} />
                          <span>Beneficios</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", marginBottom: 2 }}>
                          Beneficios al cliente
                        </div>
                        <div className="disc-canvas-box__val" style={{ marginBottom: 8 }}>
                          {form.beneficioCliente || "Sin beneficio directo especificado."}
                        </div>

                        <div style={{ fontSize: 11, fontWeight: 700, color: "#db2777", marginBottom: 2 }}>
                          Beneficios al negocio
                        </div>
                        <div className="disc-canvas-box__val">
                          {form.beneficioNegocio}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impacto en Tecnología */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <Icon icon={Settings} size={13} />
                      <span>Es un proyecto con impacto en Tecnología</span>
                    </div>
                    <div className="disc-canvas-chk-row">
                      {["Sí", "No", "Aún no sé"].map((opt) => {
                        const isMatch = form.requiereTecnologia === opt;
                        return (
                          <div
                            key={opt}
                            className={`disc-canvas-chk-item ${isMatch ? "disc-canvas-chk-item--selected" : ""}`}
                          >
                            <span>{isMatch ? "☑" : "☐"}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dimensiones de impacto */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <Icon icon={Settings} size={13} />
                      <span>Dimensiones de impacto</span>
                    </div>
                    <div className="disc-canvas-chk-row">
                      {["Estructura", "Procesos", "Tecnología", "Gente"].map((opt) => {
                        const isMatch = form.dimensionesImpacto.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`disc-canvas-chk-item ${isMatch ? "disc-canvas-chk-item--selected" : ""}`}
                          >
                            <span>{isMatch ? "☑" : "☐"}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dependencias */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <Icon icon={Timeline} size={13} />
                      <span>Existe dependencia con algún otro proyecto</span>
                    </div>
                    <div className="disc-canvas-chk-row" style={{ marginBottom: 6 }}>
                      <div className={`disc-canvas-chk-item ${form.dependencias.length > 0 ? "disc-canvas-chk-item--selected" : ""}`}>
                        <span>{form.dependencias.length > 0 ? "☑" : "☐"}</span>
                        <span>Sí</span>
                      </div>
                      <div className={`disc-canvas-chk-item ${form.dependencias.length === 0 ? "disc-canvas-chk-item--selected" : ""}`}>
                        <span>{form.dependencias.length === 0 ? "☑" : "☐"}</span>
                        <span>No</span>
                      </div>
                    </div>
                    {form.dependencias.length > 0 && (
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
                        {form.dependencias.map((d, i) => (
                          <div key={i} style={{ fontSize: 12, color: "#334155" }}>
                            • <strong>{d.origen || "Portafolio origen"}</strong> → {d.destino || "Iniciativa destino"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sistemas afectados */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <Icon icon={Settings} size={13} />
                      <span>Sistemas afectados</span>
                    </div>
                    <div className="disc-canvas-box__val">
                      {form.sistemasAfectados || "Sin sistemas declarados."}
                    </div>
                  </div>

                  {/* Grid 2 Columnas: Capacidades vs KPIs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="disc-canvas-box">
                      <div className="disc-canvas-box__label">
                        <Icon icon={Bolt} size={13} />
                        <span>Capacidades específicas del proyecto</span>
                      </div>
                      {form.capacidades.map((cap, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#334155", marginBottom: 3 }}>
                          • {cap}
                        </div>
                      ))}
                    </div>

                    <div className="disc-canvas-box">
                      <div className="disc-canvas-box__label">
                        <Icon icon={Timeline} size={13} />
                        <span>KPIs de éxito del proyecto</span>
                      </div>
                      {form.okrs.map((okr, i) => (
                        <div key={i} style={{ fontSize: 12, color: "#334155", marginBottom: 3 }}>
                          • <strong>{okr.objetivo}</strong> → {okr.resultadoClave} ({okr.kpi})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caso monetario */}
                  <div className="disc-canvas-box">
                    <div className="disc-canvas-box__label">
                      <span style={{ fontWeight: 800 }}>$</span>
                      <span>Caso monetario</span>
                    </div>
                    {hasRoiData ? (
                      <div style={{ fontSize: 12.5, color: "#15803d", fontWeight: 600 }}>
                        Inversión: ${numInversion.toLocaleString()} MXN | Ahorro anual: ${numAhorro.toLocaleString()} MXN | Ingreso anual: ${numIngreso.toLocaleString()} MXN | ROI: +{roiCalculado}% | Horizonte: {form.horizonte}
                      </div>
                    ) : (
                      <div className="disc-canvas-box__val">
                        Sin cuantificación monetaria
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer de Metadatos de la Ficha */}
                <div className="disc-canvas-meta-bar">
                  <div className="disc-canvas-meta-item">
                    <Icon icon={Person} size={15} />
                    <div>
                      <div className="disc-canvas-meta-k">LÍDER</div>
                      <div className="disc-canvas-meta-v">ARGOS EYRA MARTINEZ ZEFERINO</div>
                    </div>
                  </div>

                  <div className="disc-canvas-meta-item">
                    <Icon icon={Settings} size={15} />
                    <div>
                      <div className="disc-canvas-meta-k">DIRECCIÓN / OFICINA</div>
                      <div className="disc-canvas-meta-v">{form.businessUnit} · {form.oficinaArea}</div>
                    </div>
                  </div>

                  <div className="disc-canvas-meta-item">
                    <Icon icon={FileIcon} size={15} />
                    <div>
                      <div className="disc-canvas-meta-k">PMO</div>
                      <div className="disc-canvas-meta-v">{form.pmoResponsable}</div>
                    </div>
                  </div>

                  <div className="disc-canvas-meta-item">
                    <Icon icon={Timeline} size={15} />
                    <div>
                      <div className="disc-canvas-meta-k">FECHA DE REGISTRO</div>
                      <div className="disc-canvas-meta-v">{new Date().toLocaleDateString("es-MX")}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.2 VERIFICACIÓN PREVIA */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">4.2</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Check} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Verificación previa</h3>
                      <p className="disc-block-sub">Todo lo obligatorio debe estar completo para enviar al backlog.</p>
                    </div>
                  </div>
                  <span className="disc-status-pill disc-status-pill--complete">
                    ✓ Completo
                  </span>
                </div>

                <div className="disc-block-body">
                  <div className="disc-verify-box">
                    <Icon icon={Check} size={18} />
                    <span>La ficha está completa. Puedes enviarla al backlog de iniciativas.</span>
                  </div>
                </div>
              </div>

              {/* 4.3 ENVÍO AL BACKLOG */}
              <div className="disc-block-card">
                <div className="disc-block-header">
                  <div className="disc-block-header__left">
                    <span className="disc-block-badge">4.3</span>
                    <span className="disc-block-icon-wrap">
                      <Icon icon={Send} size={15} />
                    </span>
                    <div>
                      <h3 className="disc-block-title">Envío al backlog</h3>
                      <p className="disc-block-sub">La iniciativa se registra con estado &quot;Registrada&quot; y la fecha de hoy.</p>
                    </div>
                  </div>
                </div>

                <div className="disc-block-body">
                  <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 16px 0", lineHeight: 1.45 }}>
                    Al enviar, la ficha queda disponible para el comité de priorización. Podrás seguir su avance desde el tablero de iniciativas; los cambios posteriores se gestionan ahí.
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                          <span>Enviar al Backlog de Iniciativas</span>
                          <Icon icon={Check} size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: ASISTENTE INTELIGENTE DATASWAT AI */}
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
              onClick={() => handleSendMessage("¿Cómo cuantifico el ROI y ahorro anual?")}
            >
              💡 Cuantificar ROI
            </button>
            <button
              type="button"
              className="tag-pill tag-pill--purple"
              style={{ cursor: "pointer", fontSize: 11 }}
              onClick={() => handleSendMessage("¿Qué sistemas TI y dependencias arquitectónicas sugieres?")}
            >
              💻 Sistemas TI
            </button>
            <button
              type="button"
              className="tag-pill tag-pill--purple"
              style={{ cursor: "pointer", fontSize: 11 }}
              onClick={() => handleSendMessage("¿Qué OKRs y KPIs de éxito recomiendas?")}
            >
              🎯 Sugerir OKRs
            </button>
            <button
              type="button"
              className="tag-pill tag-pill--purple"
              style={{ cursor: "pointer", fontSize: 11 }}
              onClick={() => handleSendMessage("¿A qué nivel de alineación estratégica corresponde?")}
            >
              🧭 Alineación
            </button>
            <button
              type="button"
              className="tag-pill tag-pill--purple"
              style={{ cursor: "pointer", fontSize: 11 }}
              onClick={handleAttachMockFile}
            >
              📄 Analizar PDF
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

      {/* 5. MODAL DE ÉXITO AL REGISTRAR Y ENVIAR AL BACKLOG */}
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
              La iniciativa <strong>&quot;{form.title}&quot;</strong> ha completado la Ficha Canvas de Discovery y se ha transferido exitosamente a la cartera de <strong>{form.businessUnit}</strong>.
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
              ➔ <strong>2. Visualizar backlog por cartera de negocio</strong> (Asignado al rol de Portfolio Manager para revisión y priorización).
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                type="button"
                className="btn-purple-solid"
                onClick={() => router.push("/priorizacion")}
              >
                Ir a Priorización del Portafolio
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
