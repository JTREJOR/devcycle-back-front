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
import { BackButton } from "@/components/BackButton";

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
  requester?: string;
  solicitanteEmail?: string;
  sponsor?: string;
  sponsorEmail?: string;
  interesadosEmails?: string[];
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
  benefitType?: string;
  estimatedSavingsMxn?: string;
  savedHoursPerMonth?: string;
  successKpi?: string;

  // 3.3 Dependencias en Cascada
  existeDependencia: "Sí" | "No";
  dependencias: DependenciaItem[];
}

const INITIAL_FORM: ExtendedDiscoveryForm = {
  // 1.1
  title: "Automatización de Conciliación y Liquidación Omnicanal",
  businessUnit: "Capital Humano",
  requester: "Argos Eyra Martínez Zeferino",
  solicitanteEmail: "aemartinezz@liverpool.com.mx",
  sponsor: "Carlos Méndez (CFO)",
  sponsorEmail: "cmendez@liverpool.com.mx",
  interesadosEmails: ["pm_cartera@liverpool.com.mx", "brm_lider@liverpool.com.mx"],
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

  // Beneficios complementarios
  benefitType: "Eficiencia en Horas / Hombre",
  estimatedSavingsMxn: "3500000",
  savedHoursPerMonth: "140",
  successKpi: "Reducción del tiempo de conciliación de 48h a 15 minutos en tiempo real",
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

  const [newEmailInput, setNewEmailInput] = useState("");

  const handleAddStakeholderEmail = () => {
    const email = newEmailInput.trim().toLowerCase();
    if (email && email.includes("@") && !form.interesadosEmails?.includes(email)) {
      setForm((prev) => ({
        ...prev,
        interesadosEmails: [...(prev.interesadosEmails || []), email],
      }));
      setNewEmailInput("");
    }
  };

  const handleRemoveStakeholderEmail = (emailToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      interesadosEmails: prev.interesadosEmails?.filter((e) => e !== emailToRemove) || [],
    }));
  };

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
      solicitante: form.requester || "Argos Eyra Martínez Zeferino",
      solicitanteEmail: form.solicitanteEmail || "aemartinezz@liverpool.com.mx",
      sponsor: form.sponsor || form.portafolioManager || "AL UBAMARI MALINALLI MORENO MERAZ",
      sponsorEmail: form.sponsorEmail || "sponsor@liverpool.com.mx",
      sponsorRole: form.portafolioManager ? "Portfolio Manager" : "CFO",
      interesadosEmails: form.interesadosEmails || ["pm_cartera@liverpool.com.mx", "brm_lider@liverpool.com.mx"],
      impactoTI: form.requiereTecnologia === "Sí" ? "Sí, proyecto tecnológico" : form.requiereTecnologia === "No" ? "No tecnológico" : "Por determinar",
      requiereTI: form.requiereTecnologia === "Sí",
      enCarteraPendientes: true,
      impactoTIConfirmado: false,
      sistemasInvolucrados: getSelectedSystemNames().length ? getSelectedSystemNames() : ["SAP", "API Gateway"],
      beneficioEstimado: savingsStr,
      beneficioDetalle: form.beneficioNegocio || `Ahorro estimado y ${form.savedHoursPerMonth || "140"} hrs/mes optimizadas`,
      kpiEsperado: form.okrs[0]?.kpi || form.successKpi || "Reducción de tiempos operativos",
      madurez: calculateReadinessScore(),
      madurezTag: "Pendiente validación TI",
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
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* 2. ENCABEZADO PRINCIPAL DE DISCOVERY */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="m-0 text-2xl font-extrabold text-text-heading">
              DevCycle Discovery
            </h1>
            <span className="inline-flex items-center rounded-[20px] bg-brand-accent px-2.5 py-[3px] text-[11px] font-extrabold tracking-[0.5px] text-white">
              DATASWAT MVP
            </span>
          </div>
          <p className="mt-1 mb-0 text-[13px] text-text-secondary">
            Etapa 0: Priorización · <strong>Paso 1: Solicitud de requerimiento y Descubrimiento Asistido</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary">
            Madurez de la iniciativa:
          </span>
          <span className="inline-flex items-center rounded-xl border border-status-green-border bg-status-green-bg px-2.5 py-[3px] text-xs font-bold tracking-[0.2px] whitespace-nowrap text-status-green-text">
            {readinessScore}% Refinada
          </span>
        </div>
      </div>

      {/* 3. STEPPER HORIZONTAL GUIADO (PEGA BLUE PRINT - IMÁGENES 2, 3, 4, 5) */}
      <nav
        className="mb-5 flex gap-2 overflow-x-auto rounded-xl border border-border-default bg-bg-card p-1.5"
        aria-label="Pasos de descubrimiento"
      >
        {/* Paso 1 */}
        <button
          type="button"
          className={`flex min-w-[150px] flex-1 cursor-pointer items-center gap-2.5 rounded-[9px] border-none px-3.5 py-2.5 text-left text-[12.5px] font-semibold transition-all duration-150 ${
            currentStep === 1
              ? "bg-brand-primary-light text-brand-primary shadow-2xs"
              : "bg-transparent text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary"
          }`}
          onClick={() => setCurrentStep(1)}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold ${
              currentStep === 1
                ? "bg-brand-primary text-white"
                : currentStep > 1
                  ? "bg-[#00c875] text-white"
                  : "bg-status-gray-bg text-text-secondary"
            }`}
          >
            {currentStep > 1 ? <Icon icon={Check} size={13} /> : "1"}
          </span>
          <div>
            <div className="font-bold">Necesidad - Negocio</div>
            <div className="text-[10.5px] opacity-75">Descripción de Alcance</div>
          </div>
        </button>

        {/* Paso 2 */}
        <button
          type="button"
          className={`flex min-w-[150px] flex-1 cursor-pointer items-center gap-2.5 rounded-[9px] border-none px-3.5 py-2.5 text-left text-[12.5px] font-semibold transition-all duration-150 ${
            currentStep === 2
              ? "bg-brand-primary-light text-brand-primary shadow-2xs"
              : "bg-transparent text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary"
          }`}
          onClick={() => setCurrentStep(2)}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold ${
              currentStep === 2
                ? "bg-brand-primary text-white"
                : currentStep > 2
                  ? "bg-[#00c875] text-white"
                  : "bg-status-gray-bg text-text-secondary"
            }`}
          >
            {currentStep > 2 ? <Icon icon={Check} size={13} /> : "2"}
          </span>
          <div>
            <div className="font-bold">KPIs de Éxito</div>
            <div className="text-[10.5px] opacity-75">Capacidades, KPIs y ROI</div>
          </div>
        </button>

        {/* Paso 3 */}
        <button
          type="button"
          className={`flex min-w-[150px] flex-1 cursor-pointer items-center gap-2.5 rounded-[9px] border-none px-3.5 py-2.5 text-left text-[12.5px] font-semibold transition-all duration-150 ${
            currentStep === 3
              ? "bg-brand-primary-light text-brand-primary shadow-2xs"
              : "bg-transparent text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary"
          }`}
          onClick={() => setCurrentStep(3)}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold ${
              currentStep === 3
                ? "bg-brand-primary text-white"
                : currentStep > 3
                  ? "bg-[#00c875] text-white"
                  : "bg-status-gray-bg text-text-secondary"
            }`}
          >
            {currentStep > 3 ? <Icon icon={Check} size={13} /> : "3"}
          </span>
          <div>
            <div className="font-bold">Impacto TI y Sistemas</div>
            <div className="text-[10.5px] opacity-75">Sistemas y Dependencias</div>
          </div>
        </button>

        {/* Paso 4 */}
        <button
          type="button"
          className={`flex min-w-[150px] flex-1 cursor-pointer items-center gap-2.5 rounded-[9px] border-none px-3.5 py-2.5 text-left text-[12.5px] font-semibold transition-all duration-150 ${
            currentStep === 4
              ? "bg-brand-primary-light text-brand-primary shadow-2xs"
              : "bg-transparent text-text-secondary hover:bg-brand-primary-light hover:text-brand-primary"
          }`}
          onClick={() => setCurrentStep(4)}
        >
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-bold ${
              currentStep === 4
                ? "bg-brand-primary text-white"
                : "bg-status-gray-bg text-text-secondary"
            }`}
          >
            4
          </span>
          <div>
            <div className="font-bold">Ficha Canvas</div>
            <div className="text-[10.5px] opacity-75">Envío al Backlog</div>
          </div>
        </button>
      </nav>

      {/* 4. LAYOUT A DOS COLUMNAS: FORMULARIO GUIADO (IZQUIERDA) + DATASWAT AI (DERECHA) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)]">
        {/* COLUMNA IZQUIERDA: CONTENIDO DEL PASO ACTIVO */}
        <div className="min-w-0">
          {/* ========================================================
              PASO 1: NECESIDAD - NEGOCIO (IMAGEN 2)
              ======================================================== */}
          {currentStep === 1 && (
            <div>
              {/* 1.1 IDENTIFICACIÓN DE LA INICIATIVA */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      1.1
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={FileIcon} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Identificación de la iniciativa
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Quién solicita y bajo qué gobierno se registra.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  {/* Nombre de la iniciativa */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                      <span>Nombre de la iniciativa</span>
                      <span className="font-extrabold text-brand-accent">*</span>
                      <span
                        className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                        title="Nombre descriptivo de la iniciativa"
                      >
                        ?
                      </span>
                      <span className="text-xs font-extrabold text-green-600">✓</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                      value={form.title}
                      placeholder="Ej. Automatización de Conciliación y Liquidación Omnicanal"
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  {/* Subsección Contacto Corporativo */}
                  <div>
                    <div className="mt-2.5 mb-1.5 text-[10.5px] font-extrabold tracking-[0.6px] text-gray-500 uppercase">
                      SOLICITANTES Y CONTACTO CORPORATIVO
                    </div>
                    <div className="mb-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>Nombre del Solicitante</span>
                          <span className="font-extrabold text-brand-accent">*</span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={form.requester}
                          placeholder="Ej. Argos Eyra Martínez Zeferino"
                          onChange={(e) => setForm({ ...form, requester: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>Correo Solicitante (@liverpool.com.mx)</span>
                          <span className="font-extrabold text-brand-accent">*</span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>
                        <input
                          type="email"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={form.solicitanteEmail}
                          placeholder="solicitante@liverpool.com.mx"
                          onChange={(e) => setForm({ ...form, solicitanteEmail: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Correo Sponsor Ejecutivo (@liverpool.com.mx)</span>
                        <span className="font-extrabold text-brand-accent">*</span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        value={form.sponsorEmail}
                        placeholder="sponsor@liverpool.com.mx"
                        onChange={(e) => setForm({ ...form, sponsorEmail: e.target.value })}
                      />
                    </div>

                    {/* Notificaciones a Interesados Adicionales */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <label className="mb-1.5 block text-[11.5px] font-bold text-slate-700 uppercase">
                        Notificaciones Automáticas a Interesados (BRM, PMO, Operaciones)
                      </label>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {form.interesadosEmails?.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1.5 rounded-[14px] border border-blue-200 bg-blue-50 px-2 py-[3px] text-[11.5px] text-blue-800"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveStakeholderEmail(email)}
                              className="cursor-pointer border-none bg-transparent p-0 leading-none font-bold text-blue-300 hover:text-blue-600"
                              title="Eliminar"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-2 text-xs text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          placeholder="agregar_interesado@liverpool.com.mx"
                          value={newEmailInput}
                          onChange={(e) => setNewEmailInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddStakeholderEmail();
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3 py-1 text-xs font-semibold whitespace-nowrap text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                          onClick={handleAddStakeholderEmail}
                        >
                          + Agregar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subsección Gobierno */}
                  <div>
                    <div className="mt-2.5 mb-1.5 text-[10.5px] font-extrabold tracking-[0.6px] text-gray-500 uppercase">
                      GOBIERNO
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>Dirección de negocio</span>
                          <span className="font-extrabold text-brand-accent">*</span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>
                        <select
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
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
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>PMO responsable</span>
                          <span className="font-extrabold text-brand-accent">*</span>
                          <span
                            className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                            title="Oficina de gestión asignada"
                          >
                            ?
                          </span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>
                        <select
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
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
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                      <span>Oficina / Área</span>
                      <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                      <span className="text-xs font-extrabold text-green-600">✓</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                      value={form.oficinaArea}
                      placeholder="Ej. TI Arquitectura & Datos"
                      onChange={(e) => setForm({ ...form, oficinaArea: e.target.value })}
                    />
                    <div className="mt-1 text-[11px] text-text-secondary">
                      Tomada del directorio. Si no es correcta, puedes cambiarla.
                    </div>
                  </div>

                  {/* Asignación según matriz */}
                  <div className="flex flex-col gap-2.5 rounded-[10px] border border-[#f8d7eb] bg-[#fdf5fa] px-4.5 py-3.5">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-brand-primary">
                        <Icon icon={Person} size={15} />
                        <span>Asignación según matriz</span>
                      </div>
                      <span className="rounded-[10px] border border-status-purple-border bg-bg-card px-2 py-0.5 text-[10.5px] font-semibold text-gray-500">
                        {form.dominioMatriz}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-[11.5px] sm:grid-cols-[140px_1fr]">
                      <div>
                        <div className="text-[10.5px] font-semibold text-gray-500 uppercase">
                          PMO
                        </div>
                        <div className="font-bold text-text-heading">{form.pmoResponsable}</div>
                      </div>
                      <div>
                        <div className="text-[10.5px] font-semibold text-gray-500 uppercase">
                          PORTAFOLIO MANAGER
                        </div>
                        <div className="font-bold text-text-heading">{form.portafolioManager}</div>
                      </div>
                    </div>

                    <div className="border-t border-[#f5e1f0] pt-2 text-[11px] leading-[1.4] text-gray-500">
                      Se guarda automáticamente al enviar la ficha. Gerente BP, Arquitecto de Dominio y Coordinador TI SE se asignan cuando el Portafolio Manager confirme que tiene impacto de Tecnología.
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.2 ALCANCE INICIATIVA */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      1.2
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Info} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Alcance Iniciativa
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Describe la necesidad con evidencia, no la solución técnica.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>¿Qué necesitamos resolver?</span>
                        <span className="font-extrabold text-brand-accent">*</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Problema de fondo o dolor operativo"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <textarea
                        rows={4}
                        className="w-full resize-y rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        value={form.needDescription}
                        placeholder="Describe el problema que se busca solucionar..."
                        onChange={(e) => setForm({ ...form, needDescription: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>¿Por qué ahora?</span>
                        <span className="font-extrabold text-brand-accent">*</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Urgencia y contexto temporal"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <textarea
                        rows={4}
                        className="w-full resize-y rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        value={form.whyNow}
                        placeholder="Describe la urgencia y el impacto de postergar..."
                        onChange={(e) => setForm({ ...form, whyNow: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Sustento */}
                  <div>
                    <div className="mt-2.5 mb-1.5 text-[10.5px] font-extrabold tracking-[0.6px] text-gray-500 uppercase">
                      SUSTENTO
                    </div>
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>Evidencia y estadísticas</span>
                          <span className="text-[10.5px] font-medium text-gray-500">
                            (opcional)
                          </span>
                          <span
                            className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                            title="Datos numéricos o métricas de dolor"
                          >
                            ?
                          </span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>
                        <textarea
                          rows={4}
                          className="w-full resize-y rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={form.evidence}
                          placeholder="Datos duros que respalden la necesidad..."
                          onChange={(e) => setForm({ ...form, evidence: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>¿Qué seremos capaces de hacer al concluir?</span>
                          <span className="text-[10.5px] font-medium text-gray-500">
                            (opcional)
                          </span>
                          <span
                            className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                            title="Capacidades nuevas adquiridas"
                          >
                            ?
                          </span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>

                        {form.capacidades.map((cap, idx) => (
                          <div key={idx} className="mb-2 flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-50 text-[11px] font-bold text-pink-600">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              className="w-full flex-1 rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                              value={cap}
                              placeholder="Describe la capacidad alcanzada..."
                              onChange={(e) => handleUpdateCapacidad(idx, e.target.value)}
                            />
                            {form.capacidades.length > 1 && (
                              <button
                                type="button"
                                className="cursor-pointer rounded-sm border-none bg-transparent p-1 text-gray-400 transition-all duration-150 hover:bg-red-100 hover:text-red-500"
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
                          className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 self-start rounded-md border border-[#d0d4e4] bg-bg-card px-3.5 py-[7px] text-xs font-semibold text-gray-700 transition-all duration-150 hover:border-pink-600 hover:bg-pink-50 hover:text-pink-600"
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
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      1.3
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Bolt} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Beneficios cualitativos
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Qué gana el cliente y qué gana el negocio.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Beneficio al cliente</span>
                        <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Impacto directo en la experiencia del cliente"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full resize-y rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        value={form.beneficioCliente}
                        placeholder="Impacto directo en el cliente final o colaborador..."
                        onChange={(e) => setForm({ ...form, beneficioCliente: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Beneficio al negocio</span>
                        <span className="font-extrabold text-brand-accent">*</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Valor estratégico para la empresa"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full resize-y rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        value={form.beneficioNegocio}
                        placeholder="Ahorros operativos, cumplimiento, incremento en ventas..."
                        onChange={(e) => setForm({ ...form, beneficioNegocio: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.4 ALINEACIÓN ESTRATÉGICA */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      1.4
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Timeline} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Alineación estratégica
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Nivel de prioridad dentro del portafolio institucional.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                      <span>Nivel de alineación</span>
                      <span className="font-extrabold text-brand-accent">*</span>
                      <span className="text-xs font-extrabold text-green-600">✓</span>
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* N0 */}
                      <div
                        className={`relative cursor-pointer rounded-lg border px-3.5 py-3 text-left transition-all duration-150 ${
                          form.strategicAlignment === "(N0) Ninguna"
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() => setForm({ ...form, strategicAlignment: "(N0) Ninguna" })}
                      >
                        <div
                          className={`mb-0.5 flex items-center justify-between text-[12.5px] font-bold ${
                            form.strategicAlignment === "(N0) Ninguna"
                              ? "text-pink-600"
                              : "text-text-heading"
                          }`}
                        >
                          <span>(N0) Ninguna</span>
                          {form.strategicAlignment === "(N0) Ninguna" && (
                            <span className="text-pink-600">✓</span>
                          )}
                        </div>
                        <div className="text-[11px] leading-[1.35] text-text-secondary">
                          Sin vínculo directo con la estrategia vigente.
                        </div>
                      </div>

                      {/* N1 */}
                      <div
                        className={`relative cursor-pointer rounded-lg border px-3.5 py-3 text-left transition-all duration-150 ${
                          form.strategicAlignment === "(N1) Prioritarios"
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() => setForm({ ...form, strategicAlignment: "(N1) Prioritarios" })}
                      >
                        <div
                          className={`mb-0.5 flex items-center justify-between text-[12.5px] font-bold ${
                            form.strategicAlignment === "(N1) Prioritarios"
                              ? "text-pink-600"
                              : "text-text-heading"
                          }`}
                        >
                          <span>(N1) Prioritarios</span>
                          {form.strategicAlignment === "(N1) Prioritarios" && (
                            <span className="text-pink-600">✓</span>
                          )}
                        </div>
                        <div className="text-[11px] leading-[1.35] text-text-secondary">
                          Apalanca una prioridad explícita del plan.
                        </div>
                      </div>

                      {/* N2 */}
                      <div
                        className={`relative cursor-pointer rounded-lg border px-3.5 py-3 text-left transition-all duration-150 ${
                          form.strategicAlignment === "(N2) Habilitadores/Regulatorios"
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() =>
                          setForm({ ...form, strategicAlignment: "(N2) Habilitadores/Regulatorios" })
                        }
                      >
                        <div
                          className={`mb-0.5 flex items-center justify-between text-[12.5px] font-bold ${
                            form.strategicAlignment === "(N2) Habilitadores/Regulatorios"
                              ? "text-pink-600"
                              : "text-text-heading"
                          }`}
                        >
                          <span>(N2) Habilitadores/Regulatorios</span>
                          {form.strategicAlignment === "(N2) Habilitadores/Regulatorios" && (
                            <span className="text-pink-600">✓</span>
                          )}
                        </div>
                        <div className="text-[11px] leading-[1.35] text-text-secondary">
                          Habilita capacidades o cumple una norma.
                        </div>
                      </div>

                      {/* N3 */}
                      <div
                        className={`relative cursor-pointer rounded-lg border px-3.5 py-3 text-left transition-all duration-150 ${
                          form.strategicAlignment === "(N3) Mejora continua"
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() =>
                          setForm({ ...form, strategicAlignment: "(N3) Mejora continua" })
                        }
                      >
                        <div
                          className={`mb-0.5 flex items-center justify-between text-[12.5px] font-bold ${
                            form.strategicAlignment === "(N3) Mejora continua"
                              ? "text-pink-600"
                              : "text-text-heading"
                          }`}
                        >
                          <span>(N3) Mejora continua</span>
                          {form.strategicAlignment === "(N3) Mejora continua" && (
                            <span className="text-pink-600">✓</span>
                          )}
                        </div>
                        <div className="text-[11px] leading-[1.35] text-text-secondary">
                          Optimización incremental de la operación.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de avance al Paso 2 */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
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
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      2.1
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Timeline} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Capacidades y KPIs (OKRs)
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Cómo mediremos que la iniciativa cumplió su promesa.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  {form.okrs.map((okr, idx) => (
                    <div
                      key={okr.id}
                      className="mb-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-surface-soft p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-sm border border-pink-200 bg-pink-50 px-2 py-0.5 text-[10.5px] font-bold text-pink-600">
                          OKR {idx + 1}
                        </span>
                        {form.okrs.length > 1 && (
                          <button
                            type="button"
                            className="cursor-pointer rounded-sm border-none bg-transparent p-1 text-gray-400 transition-all duration-150 hover:bg-red-100 hover:text-red-500"
                            onClick={() => handleRemoveOkr(idx)}
                            title="Eliminar OKR"
                          >
                            <Icon icon={Delete} size={16} />
                          </button>
                        )}
                      </div>

                      {/* Objetivo */}
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>Objetivo</span>
                          <span
                            className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                            title="Meta cualitativa que se desea lograr"
                          >
                            ?
                          </span>
                          <span className="text-xs font-extrabold text-green-600">✓</span>
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={okr.objetivo}
                          placeholder="Ej. Automatizar la conciliación de flujos de pago..."
                          onChange={(e) => handleUpdateOkr(idx, "objetivo", e.target.value)}
                        />
                      </div>

                      {/* Resultado Clave y KPI */}
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                            <span>Resultado clave</span>
                            <span
                              className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                              title="Cómo se medirá el avance concreto"
                            >
                              ?
                            </span>
                            <span className="text-xs font-extrabold text-green-600">✓</span>
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                            value={okr.resultadoClave}
                            placeholder="Ej. Conciliar el 99.5% de transacciones..."
                            onChange={(e) => handleUpdateOkr(idx, "resultadoClave", e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                            <span>KPI</span>
                            <span
                              className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                              title="Métrica de medición periódica"
                            >
                              ?
                            </span>
                            <span className="text-xs font-extrabold text-green-600">✓</span>
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                            value={okr.kpi}
                            placeholder="Ej. % conciliación automática"
                            onChange={(e) => handleUpdateOkr(idx, "kpi", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Clasificación y Concepto */}
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                            <span>Clasificación del KPI</span>
                            <span
                              className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                              title="Dimensión de impacto del KPI"
                            >
                              ?
                            </span>
                            <span className="text-xs font-extrabold text-green-600">✓</span>
                          </label>
                          <select
                            className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
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
                          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                            <span>Concepto</span>
                            <span
                              className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                              title="Área de impacto contable/operativo"
                            >
                              ?
                            </span>
                            <span className="text-xs font-extrabold text-green-600">✓</span>
                          </label>
                          <select
                            className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
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
                    className="inline-flex cursor-pointer items-center gap-1.5 self-start rounded-md border border-[#d0d4e4] bg-bg-card px-3.5 py-[7px] text-xs font-semibold text-gray-700 transition-all duration-150 hover:border-pink-600 hover:bg-pink-50 hover:text-pink-600"
                    onClick={handleAddOkr}
                  >
                    <Icon icon={Add} size={14} />
                    <span>Añadir OKR</span>
                  </button>
                </div>
              </div>

              {/* 2.2 ROI */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      2.2
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <span className="text-[13px] font-extrabold">$</span>
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">ROI</h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Cifras anuales estimadas en pesos. El ROI se calcula solo.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {/* Ingreso incremental */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Ingreso incremental anual</span>
                        <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Nuevas ventas generadas anualmente"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <div className="relative">
                        <span className="absolute top-[9px] left-3 font-semibold text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card py-[9px] pr-3 pl-[26px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={form.ingresoIncremental}
                          placeholder="0"
                          onChange={(e) => setForm({ ...form, ingresoIncremental: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Ahorro en costos anual */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Ahorro en costos anual</span>
                        <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Reducción de costos o tiempos anuales"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <div className="relative">
                        <span className="absolute top-[9px] left-3 font-semibold text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card py-[9px] pr-3 pl-[26px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={form.ahorroCostos}
                          placeholder="0"
                          onChange={(e) => setForm({ ...form, ahorroCostos: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {/* Inversión estimada */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Inversión estimada</span>
                        <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Costo inicial estimado del proyecto"
                        >
                          ?
                        </span>
                        <span className="text-xs font-extrabold text-green-600">✓</span>
                      </label>
                      <div className="relative">
                        <span className="absolute top-[9px] left-3 font-semibold text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card py-[9px] pr-3 pl-[26px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={form.inversionEstimada}
                          placeholder="0"
                          onChange={(e) => setForm({ ...form, inversionEstimada: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Horizonte de evaluación */}
                    <div>
                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                        <span>Horizonte de evaluación</span>
                        <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                        <span
                          className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                          title="Plazo proyectado del caso"
                        >
                          ?
                        </span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                        value={form.horizonte}
                        placeholder="Ej. 3 años"
                        onChange={(e) => setForm({ ...form, horizonte: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* RESULTADO (Caja punteada estilo Imagen 3) */}
                  <div>
                    <div className="mt-2.5 mb-1.5 text-[10.5px] font-extrabold tracking-[0.6px] text-gray-500 uppercase">
                      RESULTADO
                    </div>
                    {hasRoiData ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-green-300 bg-green-50 px-5 py-4.5 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-4.5">
                          <div>
                            <div className="text-[11px] font-semibold text-green-800">
                              RETORNO ANUAL ESTIMADO
                            </div>
                            <div className="text-xl font-extrabold text-green-700">
                              ${retornoTotalAnual.toLocaleString()} MXN
                            </div>
                          </div>
                          <div className="h-8 w-px bg-green-300" />
                          <div>
                            <div className="text-[11px] font-semibold text-green-800">
                              ROI ESTIMADO
                            </div>
                            <div className="text-xl font-extrabold text-green-700">
                              +{roiCalculado}%
                            </div>
                          </div>
                          <div className="h-8 w-px bg-green-300" />
                          <div>
                            <div className="text-[11px] font-semibold text-green-800">
                              PUNTO DE RECUPERACIÓN
                            </div>
                            <div className="text-lg font-extrabold text-green-700">
                              ~{paybackMeses} meses
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-slate-300 bg-bg-card px-5 py-4.5 text-center">
                        <span className="text-[12.5px] text-slate-500">
                          Captura inversión y retorno para ver el ROI y el punto de recuperación.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                  onClick={() => setCurrentStep(1)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Volver a Necesidad</span>
                </button>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
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
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      3.1
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Settings} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Dimensiones de impacto
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Selecciona todo lo que el cambio va a mover.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-blue-600">
                    {form.dimensionesImpacto.length} de 4
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                      <span>Análisis de impacto</span>
                      <span className="font-extrabold text-brand-accent">*</span>
                      <span
                        className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                        title="Áreas institucionales impactadas"
                      >
                        ?
                      </span>
                      <span className="text-xs font-extrabold text-green-600">✓</span>
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {/* Estructura */}
                      <div
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-150 ${
                          form.dimensionesImpacto.includes("Estructura")
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() => toggleDimension("Estructura")}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            form.dimensionesImpacto.includes("Estructura")
                              ? "bg-pink-100 text-pink-600"
                              : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Icon icon={Settings} size={16} />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`flex items-center justify-between text-[13px] font-bold ${
                              form.dimensionesImpacto.includes("Estructura")
                                ? "text-pink-600"
                                : "text-text-heading"
                            }`}
                          >
                            <span>Estructura</span>
                            {form.dimensionesImpacto.includes("Estructura") && (
                              <span className="text-pink-600">✓</span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11.5px] leading-[1.35] text-text-secondary">
                            Cambian áreas, roles o plantilla.
                          </div>
                        </div>
                      </div>

                      {/* Procesos */}
                      <div
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-150 ${
                          form.dimensionesImpacto.includes("Procesos")
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() => toggleDimension("Procesos")}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            form.dimensionesImpacto.includes("Procesos")
                              ? "bg-pink-100 text-pink-600"
                              : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Icon icon={Timeline} size={16} />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`flex items-center justify-between text-[13px] font-bold ${
                              form.dimensionesImpacto.includes("Procesos")
                                ? "text-pink-600"
                                : "text-text-heading"
                            }`}
                          >
                            <span>Procesos</span>
                            {form.dimensionesImpacto.includes("Procesos") && (
                              <span className="text-pink-600">✓</span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11.5px] leading-[1.35] text-text-secondary">
                            Se rediseña la forma de operar.
                          </div>
                        </div>
                      </div>

                      {/* Tecnología */}
                      <div
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-150 ${
                          form.dimensionesImpacto.includes("Tecnología")
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() => toggleDimension("Tecnología")}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            form.dimensionesImpacto.includes("Tecnología")
                              ? "bg-pink-100 text-pink-600"
                              : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Icon icon={Bolt} size={16} />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`flex items-center justify-between text-[13px] font-bold ${
                              form.dimensionesImpacto.includes("Tecnología")
                                ? "text-pink-600"
                                : "text-text-heading"
                            }`}
                          >
                            <span>Tecnología</span>
                            {form.dimensionesImpacto.includes("Tecnología") && (
                              <span className="text-pink-600">✓</span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11.5px] leading-[1.35] text-text-secondary">
                            Requiere sistemas, datos o integraciones.
                          </div>
                        </div>
                      </div>

                      {/* Gente */}
                      <div
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-150 ${
                          form.dimensionesImpacto.includes("Gente")
                            ? "border-pink-600 bg-pink-50 ring-1 ring-pink-600"
                            : "border-gray-200 bg-bg-card hover:border-pink-400 hover:bg-pink-50"
                        }`}
                        onClick={() => toggleDimension("Gente")}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            form.dimensionesImpacto.includes("Gente")
                              ? "bg-pink-100 text-pink-600"
                              : "bg-slate-50 text-slate-500"
                          }`}
                        >
                          <Icon icon={Person} size={16} />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`flex items-center justify-between text-[13px] font-bold ${
                              form.dimensionesImpacto.includes("Gente")
                                ? "text-pink-600"
                                : "text-text-heading"
                            }`}
                          >
                            <span>Gente</span>
                            {form.dimensionesImpacto.includes("Gente") && (
                              <span className="text-pink-600">✓</span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[11.5px] leading-[1.35] text-text-secondary">
                            Implica capacitación o gestión del cambio.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.2 SISTEMAS Y PLATAFORMAS */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      3.2
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Settings} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Sistemas y plataformas
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Define si TI participa y qué se ve involucrado.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-blue-600">
                    {form.requiereTecnologia === "Sí" ? "1 de 2" : "✓ Completo"}
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  {/* Selector Sí / No / Aún no sé */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                      <span>¿Requiere intervención de Tecnología?</span>
                      <span className="font-extrabold text-brand-accent">*</span>
                      <span
                        className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                        title="Indica si habrá desarrollo de software o infraestructura"
                      >
                        ?
                      </span>
                      <span className="text-xs font-extrabold text-green-600">✓</span>
                    </label>

                    <div className="flex gap-2">
                      {(["Sí", "No", "Aún no sé"] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={`cursor-pointer rounded-md border px-4.5 py-2 text-[12.5px] transition-all duration-150 ${
                            form.requiereTecnologia === opt
                              ? "border-pink-600 bg-pink-600 font-bold text-white"
                              : "border-[#d0d4e4] bg-bg-card font-semibold text-gray-600 hover:border-pink-400 hover:bg-pink-50"
                          }`}
                          onClick={() => setForm({ ...form, requiereTecnologia: opt })}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detalle Técnico */}
                  {form.requiereTecnologia !== "No" && (
                    <div>
                      <div className="mt-2.5 mb-1.5 text-[10.5px] font-extrabold tracking-[0.6px] text-gray-500 uppercase">
                        DETALLE TÉCNICO
                      </div>
                      <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                          <span>Sistemas y plataformas afectadas</span>
                          <span className="text-[10.5px] font-medium text-gray-500">
                            (opcional)
                          </span>
                          <span
                            className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                            title="Selecciona o añade los sistemas involucrados"
                          >
                            ?
                          </span>
                        </label>

                        {/* Cuadro de texto para agregar nuevo sistema con botón ADD */}
                        <div className="mb-3 flex max-w-[520px] gap-2">
                          <input
                            type="text"
                            className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
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
                            className="inline-flex h-[38px] shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4.5 text-xs font-bold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
                            onClick={handleAddCustomSystem}
                          >
                            <Icon icon={Add} size={14} />
                            <span>ADD</span>
                          </button>
                        </div>

                        {/* Chips seleccionables de sistemas */}
                        <div className="flex flex-wrap gap-2">
                          {availableSystems.map((sys) => {
                            const isSelected = form.selectedSystems.includes(sys.id);
                            return (
                              <button
                                key={sys.id}
                                type="button"
                                className={`inline-flex cursor-pointer items-center gap-[5px] rounded-[20px] border px-3.5 py-1.5 text-xs transition-all duration-150 ${
                                  isSelected
                                    ? "border-brand-primary bg-brand-primary font-bold text-white"
                                    : "border-[#d0d4e4] bg-status-gray-bg font-medium text-gray-600 hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary"
                                }`}
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
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      3.3
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Timeline} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Dependencias en cascada
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Proyectos que deben existir antes o avanzar en paralelo.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-text-heading">
                      <span>Portafolio y proyecto del que depende</span>
                      <span className="text-[10.5px] font-medium text-gray-500">(opcional)</span>
                      <span
                        className="inline-flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full bg-status-gray-bg text-[10px] font-bold text-gray-500"
                        title="Dependencias cruzadas entre iniciativas"
                      >
                        ?
                      </span>
                    </label>

                    {form.dependencias.map((dep, idx) => (
                      <div key={dep.id} className="mb-2 flex items-center gap-2">
                        <input
                          type="text"
                          className="w-full flex-1 rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={dep.origen}
                          placeholder="Portafolio / Proyecto origen..."
                          onChange={(e) => handleUpdateDependencia(idx, "origen", e.target.value)}
                        />
                        <span className="font-bold text-gray-400">→</span>
                        <input
                          type="text"
                          className="w-full flex-1 rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                          value={dep.destino}
                          placeholder="Iniciativa / Dependencia destino..."
                          onChange={(e) => handleUpdateDependencia(idx, "destino", e.target.value)}
                        />
                        {form.dependencias.length > 1 && (
                          <button
                            type="button"
                            className="cursor-pointer rounded-sm border-none bg-transparent p-1 text-gray-400 transition-all duration-150 hover:bg-red-100 hover:text-red-500"
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
                      className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 self-start rounded-md border border-[#d0d4e4] bg-bg-card px-3.5 py-[7px] text-xs font-semibold text-gray-700 transition-all duration-150 hover:border-pink-600 hover:bg-pink-50 hover:text-pink-600"
                      onClick={handleAddDependencia}
                    >
                      <Icon icon={Add} size={14} />
                      <span>Añadir dependencia</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                  onClick={() => setCurrentStep(2)}
                >
                  <Icon icon={NavigationChevronLeft} size={15} />
                  <span>Volver a KPIs</span>
                </button>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
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
              <div className="mb-6 overflow-hidden rounded-xl border border-[#d0d4e4] bg-bg-card shadow-md">
                {/* Banner superior */}
                <div className="flex items-center justify-between gap-4 bg-linear-to-r from-[#b01777] to-pink-600 px-5.5 py-3.5 text-white">
                  <div className="m-0 text-[13.5px] font-extrabold tracking-[0.8px] uppercase">
                    FICHA CANVAS DE INICIATIVA
                  </div>
                  <div className="text-[11.5px] font-medium opacity-90">
                    Una división de: El Puerto de Liverpool
                  </div>
                </div>

                <div className="flex flex-col gap-4.5 bg-bg-card p-5.5">
                  {/* Nombre del proyecto */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Icon icon={FileIcon} size={13} />
                      <span>Nombre del proyecto</span>
                    </div>
                    <div className="text-sm leading-[1.45] font-bold text-text-heading">
                      {form.title}
                    </div>
                  </div>

                  {/* A qué alineación estratégica pertenece */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Icon icon={Timeline} size={13} />
                      <span>A qué alineación estratégica pertenece (Pirámide)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["(N0) Ninguna", "(N1) Prioritarios", "(N2) Habilitadores/Regulatorios", "(N3) Mejora continua"].map((opt) => {
                        const isMatch = form.strategicAlignment === opt;
                        return (
                          <div
                            key={opt}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] ${
                              isMatch
                                ? "border-pink-600 bg-pink-50 font-bold text-pink-600"
                                : "border-slate-200 bg-bg-card text-slate-600"
                            }`}
                          >
                            <span>{isMatch ? "☑" : "☐"}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2 Columnas: Descripción del alcance vs Beneficios */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {/* Columna Izquierda: Alcance */}
                    <div className="flex flex-col gap-2.5">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                          <Icon icon={Info} size={13} />
                          <span>Descripción del alcance</span>
                        </div>
                        <div className="mb-0.5 text-[11px] font-bold text-pink-600">¿Qué?</div>
                        <div className="mb-2 text-[12.5px] leading-[1.45] text-text-heading">
                          {form.needDescription}
                        </div>

                        <div className="mb-0.5 text-[11px] font-bold text-pink-600">¿Por qué?</div>
                        <div className="mb-2 text-[12.5px] leading-[1.45] text-text-heading">
                          {form.whyNow}
                        </div>

                        <div className="mb-0.5 text-[11px] font-bold text-pink-600">
                          Estadísticas / justificación
                        </div>
                        <div className="text-[12.5px] leading-[1.45] text-text-heading">
                          {form.evidence || "Sin estadísticas adicionales."}
                        </div>
                      </div>
                    </div>

                    {/* Columna Derecha: Beneficios */}
                    <div className="flex flex-col gap-2.5">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                          <Icon icon={Bolt} size={13} />
                          <span>Beneficios</span>
                        </div>
                        <div className="mb-0.5 text-[11px] font-bold text-pink-600">
                          Beneficios al cliente
                        </div>
                        <div className="mb-2 text-[12.5px] leading-[1.45] text-text-heading">
                          {form.beneficioCliente || "Sin beneficio directo especificado."}
                        </div>

                        <div className="mb-0.5 text-[11px] font-bold text-pink-600">
                          Beneficios al negocio
                        </div>
                        <div className="text-[12.5px] leading-[1.45] text-text-heading">
                          {form.beneficioNegocio}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impacto en Tecnología */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Icon icon={Settings} size={13} />
                      <span>Es un proyecto con impacto en Tecnología</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Sí", "No", "Aún no sé"].map((opt) => {
                        const isMatch = form.requiereTecnologia === opt;
                        return (
                          <div
                            key={opt}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] ${
                              isMatch
                                ? "border-pink-600 bg-pink-50 font-bold text-pink-600"
                                : "border-slate-200 bg-bg-card text-slate-600"
                            }`}
                          >
                            <span>{isMatch ? "☑" : "☐"}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dimensiones de impacto */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Icon icon={Settings} size={13} />
                      <span>Dimensiones de impacto</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Estructura", "Procesos", "Tecnología", "Gente"].map((opt) => {
                        const isMatch = form.dimensionesImpacto.includes(opt);
                        return (
                          <div
                            key={opt}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] ${
                              isMatch
                                ? "border-pink-600 bg-pink-50 font-bold text-pink-600"
                                : "border-slate-200 bg-bg-card text-slate-600"
                            }`}
                          >
                            <span>{isMatch ? "☑" : "☐"}</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dependencias */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Icon icon={Timeline} size={13} />
                      <span>Existe dependencia con algún otro proyecto</span>
                    </div>
                    <div className="mb-1.5 flex flex-wrap gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] ${
                          form.dependencias.length > 0
                            ? "border-pink-600 bg-pink-50 font-bold text-pink-600"
                            : "border-slate-200 bg-bg-card text-slate-600"
                        }`}
                      >
                        <span>{form.dependencias.length > 0 ? "☑" : "☐"}</span>
                        <span>Sí</span>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] ${
                          form.dependencias.length === 0
                            ? "border-pink-600 bg-pink-50 font-bold text-pink-600"
                            : "border-slate-200 bg-bg-card text-slate-600"
                        }`}
                      >
                        <span>{form.dependencias.length === 0 ? "☑" : "☐"}</span>
                        <span>No</span>
                      </div>
                    </div>
                    {form.dependencias.length > 0 && (
                      <div className="mt-1.5 flex flex-col gap-[3px]">
                        {form.dependencias.map((d, i) => (
                          <div key={i} className="text-xs text-slate-700">
                            • <strong>{d.origen || "Portafolio origen"}</strong> → {d.destino || "Iniciativa destino"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sistemas afectados */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <Icon icon={Settings} size={13} />
                      <span>Sistemas afectados</span>
                    </div>
                    <div className="text-[12.5px] leading-[1.45] text-text-heading">
                      {form.sistemasAfectados || "Sin sistemas declarados."}
                    </div>
                  </div>

                  {/* Grid 2 Columnas: Capacidades vs KPIs */}
                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                        <Icon icon={Bolt} size={13} />
                        <span>Capacidades específicas del proyecto</span>
                      </div>
                      {form.capacidades.map((cap, i) => (
                        <div key={i} className="mb-[3px] text-xs text-slate-700">
                          • {cap}
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                        <Icon icon={Timeline} size={13} />
                        <span>KPIs de éxito del proyecto</span>
                      </div>
                      {form.okrs.map((okr, i) => (
                        <div key={i} className="mb-[3px] text-xs text-slate-700">
                          • <strong>{okr.objetivo}</strong> → {okr.resultadoClave} ({okr.kpi})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Caso monetario */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                      <span className="font-extrabold">$</span>
                      <span>Caso monetario</span>
                    </div>
                    {hasRoiData ? (
                      <div className="text-[12.5px] font-semibold text-green-700">
                        Inversión: ${numInversion.toLocaleString()} MXN | Ahorro anual: ${numAhorro.toLocaleString()} MXN | Ingreso anual: ${numIngreso.toLocaleString()} MXN | ROI: +{roiCalculado}% | Horizonte: {form.horizonte}
                      </div>
                    ) : (
                      <div className="text-[12.5px] leading-[1.45] text-text-heading">
                        Sin cuantificación monetaria
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer de Metadatos de la Ficha */}
                <div className="grid grid-cols-1 gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-start gap-2">
                    <Icon icon={Person} size={15} />
                    <div>
                      <div className="text-[9.5px] font-extrabold tracking-[0.5px] text-slate-500 uppercase">
                        LÍDER
                      </div>
                      <div className="mt-[1px] text-[11.5px] font-bold text-text-heading">
                        ARGOS EYRA MARTINEZ ZEFERINO
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon icon={Settings} size={15} />
                    <div>
                      <div className="text-[9.5px] font-extrabold tracking-[0.5px] text-slate-500 uppercase">
                        DIRECCIÓN / OFICINA
                      </div>
                      <div className="mt-[1px] text-[11.5px] font-bold text-text-heading">
                        {form.businessUnit} · {form.oficinaArea}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon icon={FileIcon} size={15} />
                    <div>
                      <div className="text-[9.5px] font-extrabold tracking-[0.5px] text-slate-500 uppercase">
                        PMO
                      </div>
                      <div className="mt-[1px] text-[11.5px] font-bold text-text-heading">
                        {form.pmoResponsable}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Icon icon={Timeline} size={15} />
                    <div>
                      <div className="text-[9.5px] font-extrabold tracking-[0.5px] text-slate-500 uppercase">
                        FECHA DE REGISTRO
                      </div>
                      <div className="mt-[1px] text-[11.5px] font-bold text-text-heading">
                        {new Date().toLocaleDateString("es-MX")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.2 VERIFICACIÓN PREVIA */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      4.2
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Check} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Verificación previa
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        Todo lo obligatorio debe estar completo para enviar al backlog.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-[5px] rounded-xl border border-green-200 bg-emerald-50 px-2.5 py-[3px] text-[11.5px] font-semibold text-green-700">
                    ✓ Completo
                  </span>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <div className="flex items-center gap-3 rounded-lg border border-status-green-border bg-emerald-50 px-4.5 py-3.5 text-[12.5px] font-semibold text-green-700">
                    <Icon icon={Check} size={18} />
                    <span>La ficha está completa. Puedes enviarla al backlog de iniciativas.</span>
                  </div>
                </div>
              </div>

              {/* 4.3 ENVÍO AL BACKLOG */}
              <div className="mb-5 overflow-hidden rounded-xl border border-border-default bg-bg-card shadow-2xs transition-shadow duration-150 hover:shadow-xs">
                <div className="flex items-center justify-between gap-3 border-b border-pink-100 bg-[#fdf2f7] px-4.5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-pink-600 px-1.5 text-xs font-extrabold text-white">
                      4.3
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-bg-card text-pink-600">
                      <Icon icon={Send} size={15} />
                    </span>
                    <div>
                      <h3 className="m-0 text-[14.5px] font-bold text-text-heading">
                        Envío al backlog
                      </h3>
                      <p className="mt-0.5 mb-0 text-[11.5px] text-text-secondary">
                        La iniciativa se registra con estado &quot;Registrada&quot; y la fecha de hoy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4.5 px-5.5 py-5">
                  <p className="m-0 mb-4 text-[13px] leading-[1.45] text-text-secondary">
                    Al enviar, la ficha queda disponible para el comité de priorización. Podrás seguir su avance desde el tablero de iniciativas; los cambios posteriores se gestionan ahí.
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                      onClick={() => setCurrentStep(3)}
                    >
                      <Icon icon={NavigationChevronLeft} size={15} />
                      <span>Modificar Datos</span>
                    </button>

                    <button
                      type="button"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-accent bg-brand-accent px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-accent-dark hover:bg-brand-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
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
        <aside className="sticky top-4 flex h-[640px] max-h-[calc(100vh-180px)] flex-col rounded-[14px] border border-border-default bg-bg-card shadow-xs">
          <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-primary-light text-brand-primary">
                <Icon icon={Bolt} size={16} />
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-text-heading">
                  Discovery Inteligente
                </div>
                <div className="text-[11px] text-text-secondary">
                  DataSwat Copilot · Refinamiento activo
                </div>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-2 py-1 text-[11px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
              onClick={handleAttachMockFile}
              title="Simular subir documento"
            >
              <Icon icon={Upload} size={13} />
              <span>Subir archivo</span>
            </button>
          </div>

          {/* Lista de mensajes */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.sender === "bot"
                    ? "max-w-[90%] rounded-xl border border-border-default bg-surface-soft px-4 py-3.5"
                    : "max-w-[85%] self-end rounded-xl rounded-br-[2px] bg-brand-primary px-4 py-2.5 text-[13px] leading-[1.4] text-white"
                }
              >
                {msg.sender === "bot" && (
                  <div className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-primary">
                    <Icon icon={Bolt} size={13} />
                    <span>DataSwat AI</span>
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
                      onClick={() => applyPayloadToForm(msg.actionPayload)}
                    >
                      <Icon icon={Check} size={12} />
                      <span>{msg.actionLabel}</span>
                    </button>
                  </div>
                )}

                <div
                  className={`mt-1 text-[10px] ${
                    msg.sender === "user"
                      ? "text-right text-white/70"
                      : "text-left text-text-muted"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex max-w-[90%] items-center gap-2 rounded-xl border border-border-default bg-surface-soft px-4 py-3.5">
                <Loader size={14} />
                <span className="text-xs text-text-secondary">
                  DataSwat AI está analizando tu iniciativa…
                </span>
              </div>
            )}
          </div>

          {/* Sugerencias Rápidas */}
          <div className="flex gap-1.5 overflow-x-auto border-t border-border-subtle bg-[#fafbfc] px-4 py-2">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
              onClick={() => handleSendMessage("¿Cómo cuantifico el ROI y ahorro anual?")}
            >
              💡 Cuantificar ROI
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
              onClick={() => handleSendMessage("¿Qué sistemas TI y dependencias arquitectónicas sugieres?")}
            >
              💻 Sistemas TI
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
              onClick={() => handleSendMessage("¿Qué OKRs y KPIs de éxito recomiendas?")}
            >
              🎯 Sugerir OKRs
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
              onClick={() => handleSendMessage("¿A qué nivel de alineación estratégica corresponde?")}
            >
              🧭 Alineación
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center rounded-xl border border-status-purple-border bg-status-purple-bg px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-purple-text transition-colors hover:bg-brand-primary-light"
              onClick={handleAttachMockFile}
            >
              📄 Analizar PDF
            </button>
          </div>

          {/* Input inferior con botón de adjuntar y enviar */}
          <div className="rounded-b-[14px] border-t border-border-default bg-bg-card px-4.5 py-3.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[#dcdfe4] bg-slate-50 text-text-secondary transition-all duration-150 hover:border-brand-primary hover:bg-brand-primary-light hover:text-brand-primary"
                onClick={handleAttachMockFile}
                title="Adjuntar documento de descubrimiento"
              >
                <Icon icon={Upload} size={16} />
              </button>
              <input
                type="text"
                className="flex-1 rounded-lg border border-[#dcdfe4] px-3.5 py-2.5 text-[13px] text-text-main outline-none focus:border-brand-primary"
                placeholder="Describe tu idea o haz preguntas..."
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                type="button"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-none bg-brand-accent text-white transition-all duration-150 hover:bg-brand-accent-dark"
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
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-[500px] rounded-xl border border-border-default bg-bg-card p-7 text-center shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            <div className="mx-auto mb-4 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-status-green-bg text-status-green-text">
              <Icon icon={Check} size={28} />
            </div>

            <h3 className="m-0 mb-2 text-xl font-bold text-text-heading">
              ¡Iniciativa Registrada con Éxito!
            </h3>

            <p className="m-0 mb-5 text-[13px] leading-[1.5] text-text-secondary">
              La iniciativa <strong>&quot;{form.title}&quot;</strong> ha completado la Ficha Canvas de Discovery y se ha transferido exitosamente a la cartera de <strong>{form.businessUnit}</strong>.
            </p>

            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 text-left text-[12.5px] text-green-800">
              <strong>Siguiente paso en el flujo:</strong>
              <br />
              ➔ <strong>Revisión y Priorización de Iniciativas</strong>: el Portfolio Manager revisará y evaluará tu solicitud dentro del portafolio.
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-brand-primary px-4 py-[7px] text-[13px] font-semibold text-white transition-all duration-150 hover:border-brand-primary-hover hover:bg-brand-primary-hover"
                onClick={() => router.push("/iniciativas")}
              >
                Ir a Iniciativas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
