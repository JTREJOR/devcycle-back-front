import { create } from "zustand";

export interface EvaluacionData {
  impactoNegocio: number; // 1..5
  alineacionEstrategica: number; // 1..5
  urgencia: number; // 1..5
  complejidad: number; // 1..5
  esfuerzoEstimado?: number; // compatibilidad
  riesgos: number; // 1..5
  justificaciones?: {
    impactoNegocio?: string;
    alineacionEstrategica?: string;
    urgencia?: string;
    complejidad?: string;
    riesgos?: string;
  };
  confianza?: "Alta" | "Media" | "Baja";
  feedback?: string;
}

export interface InitiativeItem {
  id: string;
  name: string;
  area: string;
  status: "Nueva" | "En revisión" | "Lista" | "Con comentarios" | "En priorización" | "Descartada";
  etapaCiclo?: "Priorización" | "Estimación" | "Autorización" | "Formalización" | "Ejecución" | "Cierre";
  estadoOperativo?: string;
  score: number | null;
  priority: "Alta" | "Media-Alta" | "Media" | "Baja" | null;
  creationDate: string;
  description: string;
  solicitante: string;
  sponsor?: string;
  sponsorRole?: string;
  impactoTI: string;
  impactoTISub?: string;
  sistemasInvolucrados?: string[];
  beneficioEstimado: string;
  beneficioDetalle?: string;
  kpiEsperado?: string;
  kpiDetalle?: string;
  madurez: number;
  madurezTag?: string;
  esfuerzo: number; // 0..100
  impacto: number;  // 0..100
  color: string;
  projectId?: string;
  evaluacion?: EvaluacionData;
  decision?: "priorizar" | "observacion" | "ajustes" | "descartar";
  prioridadFinal?: "Alta" | "Media" | "Baja";
  justificacionDecision?: string;
  destinoDecision?: string;
}

export const DEFAULT_INITIATIVES: InitiativeItem[] = [
  // ==========================================
  // 1. INICIATIVAS PRINCIPALES DEL HOME (Imagen 2)
  // ==========================================
  {
    id: "prio-exp-01",
    name: "Expansión Marketplace",
    area: "E-commerce",
    status: "En priorización",
    etapaCiclo: "Priorización",
    estadoOperativo: "En priorización",
    score: 85,
    priority: "Alta",
    creationDate: "20 sep 2026",
    description: "Ampliación de vendedores externos y catálogo extendido con logística integrada en fulfillment center.",
    solicitante: "Roberto Garza",
    sponsor: "Mariana Solís",
    sponsorRole: "Directora Digital",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Mirakl Marketplace", "SAP", "eCommerce Portal"],
    beneficioEstimado: "$9.5M MXN / año",
    kpiEsperado: "+40% en GMV de terceros",
    madurez: 85,
    madurezTag: "En priorización",
    esfuerzo: 60,
    impacto: 88,
    color: "#e6007e",
    projectId: "proj-01",
  },
  {
    id: "prio-inv-02",
    name: "Optimización de Inventarios",
    area: "Cadena de Suministro",
    status: "En revisión",
    etapaCiclo: "Estimación",
    estadoOperativo: "Por revisar",
    score: 72,
    priority: "Media",
    creationDate: "18 sep 2026",
    description: "Modelos predictivos para cálculo dinámico de punto de reorden y balanceo de stock entre almacenes.",
    solicitante: "Fernando Morales",
    sponsor: "Raúl Sánchez",
    sponsorRole: "Director de Operaciones",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["BlueYonder WMS", "SAP ERP", "BigQuery"],
    beneficioEstimado: "$6.8M MXN / año",
    kpiEsperado: "-22% en quiebres de inventario",
    madurez: 65,
    madurezTag: "En estimación",
    esfuerzo: 55,
    impacto: 72,
    color: "#8b5cf6",
    projectId: "proj-02",
  },
  {
    id: "prio-lea-03",
    name: "Nueva App de Lealtad",
    area: "Marketing",
    status: "Lista",
    etapaCiclo: "Autorización",
    estadoOperativo: "Lista para comité",
    score: 68,
    priority: "Media",
    creationDate: "15 sep 2026",
    description: "App móvil nativa con wallet de recompensas, gamificación por visitas y promociones personalizadas.",
    solicitante: "Valeria Ríos",
    sponsor: "Fernanda Treviño",
    sponsorRole: "VP Comercial",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Loyalty Engine", "App Móvil", "CRM"],
    beneficioEstimado: "$4.8M MXN / año",
    kpiEsperado: "+25% en frecuencia de compra",
    madurez: 80,
    madurezTag: "Lista para comité",
    esfuerzo: 45,
    impacto: 68,
    color: "#f59e0b",
    projectId: "proj-03",
  },
  {
    id: "prio-erp-04",
    name: "Modernización ERP",
    area: "Tecnología",
    status: "Lista",
    etapaCiclo: "Formalización",
    estadoOperativo: "Aprobada",
    score: 90,
    priority: "Alta",
    creationDate: "12 sep 2026",
    description: "Migración a S/4HANA Cloud para consolidación contable en tiempo real y cierre financiero ágil.",
    solicitante: "Carlos Méndez",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["SAP S/4HANA", "Cloud Platform"],
    beneficioEstimado: "$18.0M MXN / año",
    kpiEsperado: "Cierre contable en 2 días",
    madurez: 95,
    madurezTag: "Aprobada",
    esfuerzo: 85,
    impacto: 92,
    color: "#ec4899",
    projectId: "proj-04",
  },
  {
    id: "prio-ced-05",
    name: "Automatización de Centros de Distribución",
    area: "Operaciones",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 78,
    priority: "Media",
    creationDate: "10 sep 2026",
    description: "Implementación de bandas clasificadoras robotizadas y visión artificial en sorting de pedidos.",
    solicitante: "Diego Ramos",
    sponsor: "Raúl Sánchez",
    sponsorRole: "Director de Operaciones",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["PLC Robotics", "WCS", "SAP"],
    beneficioEstimado: "$14.2M MXN / año",
    kpiEsperado: "+50% capacidad de despacho",
    madurez: 85,
    madurezTag: "En ejecución",
    esfuerzo: 75,
    impacto: 78,
    color: "#10b981",
    projectId: "proj-05",
  },
  {
    id: "prio-cld-06",
    name: "Migración a Nube Corporativa",
    area: "Tecnología",
    status: "Lista",
    etapaCiclo: "Cierre",
    estadoOperativo: "Cerrada",
    score: 88,
    priority: "Alta",
    creationDate: "05 sep 2026",
    description: "Migración de los últimos 45 servidores físicos hacia Google Cloud Platform con arquitectura multi-zona.",
    solicitante: "Iván Cordero",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["GCP Compute", "Cloud SQL", "Terraform"],
    beneficioEstimado: "$8.4M MXN / año",
    kpiEsperado: "99.98% uptime garantizado",
    madurez: 100,
    madurezTag: "Cerrada",
    esfuerzo: 70,
    impacto: 88,
    color: "#3b82f6",
    projectId: "proj-06",
  },

  // ==========================================
  // 2. ETAPA 1: PRIORIZACIÓN (6 iniciativas en total)
  // ==========================================
  {
    id: "prio-01",
    name: "Automatización de Conciliación y Liquidación Omnicanal",
    area: "Finanzas y Contabilidad",
    status: "Nueva",
    etapaCiclo: "Priorización",
    estadoOperativo: "Nueva",
    score: null,
    priority: null,
    creationDate: "22 sep 2026",
    description:
      "El proceso de conciliación y liquidación entre canales se realiza de forma manual, generando retrasos, incidencias y falta de trazabilidad en la información.",
    solicitante: "Argos Eyra Martínez Zeferino",
    sponsor: "Carlos Méndez",
    sponsorRole: "CFO",
    impactoTI: "Sí, proyecto tecnológico",
    impactoTISub: "Involucra desarrollo e integración de sistemas.",
    sistemasInvolucrados: ["SAP", "Pasarela", "Core", "API"],
    beneficioEstimado: "$3.5M MXN / año",
    beneficioDetalle: "Ahorro en costos operativos y reducción de incidencias.",
    kpiEsperado: "Reducción de 70% en tiempo de conciliación",
    kpiDetalle: "De 5 días a 1.5 días en promedio.",
    madurez: 25,
    madurezTag: "Madurez inicial",
    esfuerzo: 70,
    impacto: 85,
    color: "#e6007e",
    projectId: "proj-01",
    evaluacion: {
      impactoNegocio: 4,
      alineacionEstrategica: 5,
      urgencia: 4,
      complejidad: 3,
      riesgos: 3,
      justificaciones: {
        impactoNegocio: "Alta reducción de costos operativos y mejora en la experiencia del cliente.",
        alineacionEstrategica: "Está alineada con la estrategia de omnicanalidad y eficiencia operativa.",
        urgencia: "Existen dolores actuales y una ventana de oportunidad en el corto plazo.",
        complejidad: "Requiere integraciones con sistemas críticos, pero es viable con el equipo actual.",
        riesgos: "Depende de proveedores externos, pero con bajo riesgo de ejecución.",
      },
      confianza: "Media",
      feedback: "La iniciativa muestra alto impacto y buena alineación, pero aún tiene incertidumbre técnica.",
    },
  },
  {
    id: "prio-02",
    name: "App Móvil de Autoservicio",
    area: "Banca Digital",
    status: "En revisión",
    etapaCiclo: "Priorización",
    estadoOperativo: "Por revisar",
    score: 72,
    priority: "Media",
    creationDate: "18 sep 2026",
    description:
      "Autoatención para clientes con transacciones frecuentes, consultas de saldo, estados de cuenta y aclaraciones rápidas desde dispositivos móviles sin necesidad de acudir a sucursal.",
    solicitante: "Mariana Solís",
    sponsor: "Mariana Solís",
    sponsorRole: "Directora Digital",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Mobile SDK", "APIs Core", "Auth JWT"],
    beneficioEstimado: "$4.2M MXN / año",
    kpiEsperado: "Adopción móvil de 45% en 6 meses",
    madurez: 60,
    madurezTag: "En validación",
    esfuerzo: 45,
    impacto: 72,
    color: "#833177",
    projectId: "proj-01",
  },
  {
    id: "prio-04",
    name: "Rediseño Portal de Clientes",
    area: "Banca Digital",
    status: "Con comentarios",
    etapaCiclo: "Priorización",
    estadoOperativo: "Con comentarios",
    score: 68,
    priority: "Media",
    creationDate: "14 sep 2026",
    description: "Modernización de la interfaz web responsiva orientada a autoservicio B2C y optimización de conversión de compras y pagos.",
    solicitante: "Lucía Fernández",
    sponsor: "Ernesto Ruiz",
    sponsorRole: "Director Canales",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Next.js", "Design System Vibe", "CMS"],
    beneficioEstimado: "$2.1M MXN / año",
    kpiEsperado: "+22% en retención de usuarios recurrentes",
    madurez: 70,
    madurezTag: "Requiere ajustes",
    esfuerzo: 60,
    impacto: 65,
    color: "#d97706",
    projectId: "proj-03",
  },
  {
    id: "prio-05",
    name: "Integración de Pagos con Wallets",
    area: "Medios de Pago",
    status: "Nueva",
    etapaCiclo: "Priorización",
    estadoOperativo: "Nueva",
    score: null,
    priority: null,
    creationDate: "12 sep 2026",
    description: "Habilitación de Apple Pay y Google Wallet en terminales físicas de tienda y eCommerce para cobro sin contacto y mejora de tiempo en caja.",
    solicitante: "Roberto Garza",
    sponsor: "Santiago Lozano",
    sponsorRole: "Director Pagos",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["POS Terminal", "Mastercard/Visa Gateway", "Tokenizador"],
    beneficioEstimado: "$3.0M MXN / año",
    kpiEsperado: "Adopción de contactless > 30% en ventas",
    madurez: 30,
    madurezTag: "Madurez inicial",
    esfuerzo: 25,
    impacto: 78,
    color: "#0284c7",
    projectId: "proj-04",
  },
  {
    id: "prio-14",
    name: "Plataforma de Lealtad y Recompensas Omnicanal",
    area: "Mercadotecnia y Clientes",
    status: "Nueva",
    etapaCiclo: "Priorización",
    estadoOperativo: "Nueva",
    score: null,
    priority: null,
    creationDate: "24 ago 2026",
    description: "Programa unificado de puntos y beneficios canjeables tanto en tiendas físicas como en app móvil y tienda online.",
    solicitante: "Valeria Ríos",
    sponsor: "Mariana Solís",
    sponsorRole: "Directora Digital",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Loyalty Engine", "POS", "App Móvil"],
    beneficioEstimado: "$6.2M MXN / año",
    kpiEsperado: "+28% retención de clientes frecuentes",
    madurez: 30,
    madurezTag: "Madurez inicial",
    esfuerzo: 55,
    impacto: 84,
    color: "#e6007e",
  },

  // ==========================================
  // 3. ETAPA 2: ESTIMACIÓN (4 iniciativas en total)
  // ==========================================
  {
    id: "prio-06",
    name: "Chatbot de Soporte Interno",
    area: "Servicios Compartidos",
    status: "En revisión",
    etapaCiclo: "Estimación",
    estadoOperativo: "Por revisar",
    score: 76,
    priority: "Media",
    creationDate: "12 sep 2026",
    description: "Asistente conversacional con IA para resolución de tickets frecuentes de TI, RH y nóminas de colaboradores en tiendas y centros de distribución.",
    solicitante: "Patricia Domínguez",
    sponsor: "Raúl Sánchez",
    sponsorRole: "Director de Operaciones",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["OpenAI LLM", "ServiceNow", "SAP SuccessFactors"],
    beneficioEstimado: "$1.4M MXN / año",
    kpiEsperado: "Resolución automática de primer contacto > 60%",
    madurez: 65,
    madurezTag: "En validación",
    esfuerzo: 30,
    impacto: 60,
    color: "#7c3aed",
    projectId: "proj-06",
  },
  {
    id: "prio-11",
    name: "Dashboard Financiero Ejecutivo",
    area: "Finanzas Corporativas",
    status: "En revisión",
    etapaCiclo: "Estimación",
    estadoOperativo: "Por revisar",
    score: 74,
    priority: "Media",
    creationDate: "02 sep 2026",
    description: "Tablero unificado de liquidez, presupuestos por unidad de negocio y proyecciones de margen en tiempo real.",
    solicitante: "Gabriela Treviño",
    sponsor: "Carlos Méndez",
    sponsorRole: "CFO",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["PowerBI", "SAP ERP", "Data Lake"],
    beneficioEstimado: "$2.3M MXN / año",
    kpiEsperado: "Cierres contables en 2 días hábiles",
    madurez: 75,
    madurezTag: "En estimación",
    esfuerzo: 40,
    impacto: 74,
    color: "#833177",
    projectId: "proj-11",
  },
  {
    id: "prio-12",
    name: "Portal Autoservicio de Proveedores",
    area: "Cadena de Suministro",
    status: "En revisión",
    etapaCiclo: "Estimación",
    estadoOperativo: "Por revisar",
    score: 70,
    priority: "Media",
    creationDate: "28 ago 2026",
    description: "Plataforma web para carga de facturas XML, validación automática ante SAT y consulta de estatus de pago sin intervención humana.",
    solicitante: "Sofía Elizondo",
    sponsor: "Ernesto Ruiz",
    sponsorRole: "Director Compras",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["SAT CFDI API", "Portal Web", "SAP FI"],
    beneficioEstimado: "$1.8M MXN / año",
    kpiEsperado: "95% facturas validadas en menos de 1 hora",
    madurez: 65,
    madurezTag: "En validación",
    esfuerzo: 40,
    impacto: 68,
    color: "#0284c7",
    projectId: "proj-12",
  },

  // ==========================================
  // 4. ETAPA 3: AUTORIZACIÓN (5 iniciativas en total)
  // ==========================================
  {
    id: "prio-03",
    name: "Plataforma de Onboarding Digital",
    area: "Experiencia de Cliente",
    status: "Lista",
    etapaCiclo: "Autorización",
    estadoOperativo: "Lista para comité",
    score: 85,
    priority: "Alta",
    creationDate: "15 sep 2026",
    description: "Digitalización 100% remota del proceso de alta y contratación con validación biométrica ante INE y buró de crédito en menos de 5 minutos.",
    solicitante: "Carlos Mendoza",
    sponsor: "Fernanda Treviño",
    sponsorRole: "VP Comercial",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["INE Biometría", "Buró", "Salesforce CRM"],
    beneficioEstimado: "$5.8M MXN / año",
    kpiEsperado: "Tiempo de onboarding menor a 4 minutos",
    madurez: 85,
    madurezTag: "Lista para comité",
    esfuerzo: 35,
    impacto: 88,
    color: "#059669",
    projectId: "proj-02",
  },
  {
    id: "prio-09",
    name: "Automatización de Cobranza Temprana",
    area: "Riesgos y Crédito",
    status: "Lista",
    etapaCiclo: "Autorización",
    estadoOperativo: "Lista para comité",
    score: 79,
    priority: "Media-Alta",
    creationDate: "06 sep 2026",
    description: "Motor inteligente de reglas para recordatorios predictivos y autogestión de pagos tempranos para mitigar cartera vencida.",
    solicitante: "Diego Ramos",
    sponsor: "Karla Nájera",
    sponsorRole: "Directora de Crédito",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Motor de Reglas", "SMS Gateway", "Core Crédito"],
    beneficioEstimado: "$5.4M MXN / año",
    kpiEsperado: "-18% en índice de morosidad temprana",
    madurez: 80,
    madurezTag: "Lista para comité",
    esfuerzo: 50,
    impacto: 78,
    color: "#ea580c",
    projectId: "proj-05",
  },
  {
    id: "prio-13",
    name: "Sistema de Detección de Fraude en Tiempo Real",
    area: "Seguridad y Cumplimiento",
    status: "Lista",
    etapaCiclo: "Autorización",
    estadoOperativo: "En espera de comité",
    score: 89,
    priority: "Alta",
    creationDate: "25 ago 2026",
    description: "Algoritmos de machine learning sobre transacciones en punto de venta y eCommerce para bloqueo preventivo de tarjetas clonadas.",
    solicitante: "Fernando Morales",
    sponsor: "Carlos Méndez",
    sponsorRole: "CFO",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Fraud Engine ML", "Core Transaccional", "Kafka"],
    beneficioEstimado: "$8.5M MXN / año",
    kpiEsperado: "Falsos positivos < 0.2%",
    madurez: 85,
    madurezTag: "En espera de comité",
    esfuerzo: 60,
    impacto: 92,
    color: "#db2777",
  },
  {
    id: "prio-aut-05",
    name: "Autenticación Biométrica en Cajas",
    area: "Operaciones en Tienda",
    status: "Lista",
    etapaCiclo: "Autorización",
    estadoOperativo: "En espera de comité",
    score: 81,
    priority: "Alta",
    creationDate: "20 ago 2026",
    description: "Validación dactilar y facial para autorización de transacciones mayores a $15,000 MXN en sucursal.",
    solicitante: "Raúl Sánchez",
    sponsor: "Ernesto Ruiz",
    sponsorRole: "Director Canales",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Biometric SDK", "POS", "Core"],
    beneficioEstimado: "$3.2M MXN / año",
    kpiEsperado: "-60% en suplantación de identidad",
    madurez: 80,
    madurezTag: "En espera de comité",
    esfuerzo: 40,
    impacto: 81,
    color: "#f59e0b",
  },

  // ==========================================
  // 5. ETAPA 4: FORMALIZACIÓN (3 iniciativas en total)
  // ==========================================
  {
    id: "prio-07",
    name: "Optimización de Data Warehouse",
    area: "Datos y Analítica",
    status: "Lista",
    etapaCiclo: "Formalización",
    estadoOperativo: "Aprobada",
    score: 82,
    priority: "Alta",
    creationDate: "10 sep 2026",
    description: "Migración de pipelines analíticos a BigQuery y centralización de modelos de datos para reporting ejecutivo y analítica comercial en tiempo real.",
    solicitante: "Esteban Ruiz",
    sponsor: "Diana Morales",
    sponsorRole: "Chief Data Officer",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Google BigQuery", "dbt", "Looker", "Kafka"],
    beneficioEstimado: "$4.5M MXN / año",
    kpiEsperado: "Disponibilidad de datos en < 15 minutos",
    madurez: 90,
    madurezTag: "Aprobada",
    esfuerzo: 75,
    impacto: 82,
    color: "#2563eb",
    projectId: "proj-09",
  },
  {
    id: "prio-for-03",
    name: "Contratación de Enlaces de Red Redundante",
    area: "Infraestructura",
    status: "Lista",
    etapaCiclo: "Formalización",
    estadoOperativo: "Documentación pendiente",
    score: 84,
    priority: "Alta",
    creationDate: "02 sep 2026",
    description: "Formalización contractual de líneas de fibra óptica simétrica para centros de datos y almacenes logísticos.",
    solicitante: "Iván Cordero",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Telco Contracts", "Cisco Routers"],
    beneficioEstimado: "$2.9M MXN / año",
    kpiEsperado: "Cero caídas de enlace en temporada alta",
    madurez: 90,
    madurezTag: "Documentación pendiente",
    esfuerzo: 35,
    impacto: 84,
    color: "#ec4899",
  },

  // ==========================================
  // 6. ETAPA 5: EJECUCIÓN (8 iniciativas en total)
  // ==========================================
  {
    id: "prio-08",
    name: "Migración Core Bancario",
    area: "Tecnología Core",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 91,
    priority: "Alta",
    creationDate: "08 sep 2026",
    description: "Reemplazo de arquitectura legacy monolítica por microservicios desacoplados de alta disponibilidad, escalabilidad elástica y resiliencia.",
    solicitante: "Javier Trejo",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Kubernetes GCP", "PostgreSQL", "Kafka", "Core Bancario"],
    beneficioEstimado: "$12.0M MXN / año",
    kpiEsperado: "99.99% de disponibilidad continua",
    madurez: 95,
    madurezTag: "En ejecución",
    esfuerzo: 85,
    impacto: 95,
    color: "#e11d48",
    projectId: "proj-08",
  },
  {
    id: "prio-10",
    name: "Renovación de Infraestructura Cloud",
    area: "Infraestructura TI",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 88,
    priority: "Alta",
    creationDate: "04 sep 2026",
    description: "Migración integral de servidores on-premise a Google Cloud Platform y optimización de arquitectura FinOps.",
    solicitante: "Iván Cordero",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["GCP Compute", "Cloud SQL", "Terraform"],
    beneficioEstimado: "$15.6M MXN / año",
    kpiEsperado: "99.95% SLA y -25% costo de cómputo",
    madurez: 90,
    madurezTag: "En ejecución",
    esfuerzo: 70,
    impacto: 90,
    color: "#059669",
    projectId: "proj-10",
  },
  {
    id: "prio-eje-04",
    name: "Terminales Punto de Venta Android",
    area: "Medios de Pago",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 77,
    priority: "Media",
    creationDate: "01 sep 2026",
    description: "Despliegue de 1,200 terminales SmartPOS con pantalla táctil e integración directa a facturación CFDI.",
    solicitante: "Santiago Lozano",
    sponsor: "Carlos Méndez",
    sponsorRole: "CFO",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["SmartPOS", "SAT API"],
    beneficioEstimado: "$4.1M MXN / año",
    kpiEsperado: "Tiempo de cobro menor a 20 segundos",
    madurez: 85,
    madurezTag: "En ejecución",
    esfuerzo: 50,
    impacto: 77,
    color: "#10b981",
  },
  {
    id: "prio-eje-05",
    name: "Modelo Predictivo de Surtido en Tienda",
    area: "Logística",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 83,
    priority: "Alta",
    creationDate: "28 ago 2026",
    description: "Inteligencia artificial para cálculo de demanda local por tienda considerando temporalidad y clima.",
    solicitante: "Esteban Ruiz",
    sponsor: "Diana Morales",
    sponsorRole: "CDO",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["TensorFlow", "BigQuery"],
    beneficioEstimado: "$7.2M MXN / año",
    kpiEsperado: "Reducción de sobre-inventario de 15%",
    madurez: 80,
    madurezTag: "En ejecución",
    esfuerzo: 65,
    impacto: 83,
    color: "#10b981",
  },
  {
    id: "prio-eje-06",
    name: "App Móvil de Colaboradores Tienda",
    area: "Recursos Humanos",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 75,
    priority: "Media",
    creationDate: "25 ago 2026",
    description: "Consulta de turnos, recibos de nómina y solicitudes de vacaciones en tiempo real para 18,000 colaboradores.",
    solicitante: "Patricia Domínguez",
    sponsor: "Raúl Sánchez",
    sponsorRole: "Director de Operaciones",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["SuccessFactors", "React Native"],
    beneficioEstimado: "$1.9M MXN / año",
    kpiEsperado: "Adopción de 85% de la plantilla",
    madurez: 80,
    madurezTag: "En ejecución",
    esfuerzo: 40,
    impacto: 75,
    color: "#10b981",
  },
  {
    id: "prio-eje-07",
    name: "Rediseño Logística de Última Milla",
    area: "Cadena de Suministro",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 80,
    priority: "Alta",
    creationDate: "20 ago 2026",
    description: "Ruteador dinámico para optimización de entregas el mismo día en las principales áreas metropolitanas.",
    solicitante: "Fernando Morales",
    sponsor: "Raúl Sánchez",
    sponsorRole: "Director de Operaciones",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Route Optimizer", "Driver App"],
    beneficioEstimado: "$6.4M MXN / año",
    kpiEsperado: "Entrega same-day en 92% de pedidos",
    madurez: 85,
    madurezTag: "En ejecución",
    esfuerzo: 60,
    impacto: 80,
    color: "#10b981",
  },
  {
    id: "prio-eje-08",
    name: "Infraestructura SD-WAN en Sucursales",
    area: "Redes y Telecom",
    status: "En priorización",
    etapaCiclo: "Ejecución",
    estadoOperativo: "En ejecución",
    score: 86,
    priority: "Alta",
    creationDate: "15 ago 2026",
    description: "Actualización a enlaces híbridos inteligentes con conmutación en menos de 100ms para terminales de venta.",
    solicitante: "Iván Cordero",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Fortinet SD-WAN", "Zscaler"],
    beneficioEstimado: "$3.8M MXN / año",
    kpiEsperado: "Disponibilidad de red en sucursales 99.9%",
    madurez: 85,
    madurezTag: "En ejecución",
    esfuerzo: 55,
    impacto: 86,
    color: "#10b981",
  },

  // ==========================================
  // 7. ETAPA 6: CIERRE (4 iniciativas en total)
  // ==========================================
  {
    id: "prio-cie-02",
    name: "Portal de Facturación Electrónica 4.0",
    area: "Finanzas",
    status: "Lista",
    etapaCiclo: "Cierre",
    estadoOperativo: "Cerrada",
    score: 92,
    priority: "Alta",
    creationDate: "10 ago 2026",
    description: "Homologación con el anexo 20 del SAT y emisión instantánea de CFDI para tickets de mostrador.",
    solicitante: "Carlos Mendoza",
    sponsor: "Carlos Méndez",
    sponsorRole: "CFO",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["SAT CFDI", "SAP FI"],
    beneficioEstimado: "$4.0M MXN / año",
    kpiEsperado: "100% cumplimiento normativo SAT",
    madurez: 100,
    madurezTag: "Cerrada",
    esfuerzo: 45,
    impacto: 92,
    color: "#3b82f6",
  },
  {
    id: "prio-cie-03",
    name: "Consolidación de Servidores Legacy",
    area: "Infraestructura",
    status: "Lista",
    etapaCiclo: "Cierre",
    estadoOperativo: "Cerrada",
    score: 85,
    priority: "Alta",
    creationDate: "05 ago 2026",
    description: "Desmantelamiento de racks físicos en data center secundario con ahorro directo en arrendamiento y energía.",
    solicitante: "Iván Cordero",
    sponsor: "Javier Trejo",
    sponsorRole: "VP Tecnología",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Data Center Facility"],
    beneficioEstimado: "$5.1M MXN / año",
    kpiEsperado: "-35% consumo eléctrico de data center",
    madurez: 100,
    madurezTag: "Cerrada",
    esfuerzo: 50,
    impacto: 85,
    color: "#3b82f6",
  },
  {
    id: "prio-cie-04",
    name: "Actualización de WiFi para Clientes en Tienda",
    area: "Experiencia de Cliente",
    status: "Lista",
    etapaCiclo: "Cierre",
    estadoOperativo: "Cerrada",
    score: 80,
    priority: "Alta",
    creationDate: "01 ago 2026",
    description: "Despliegue de red WiFi 6 de alta densidad para clientes en 65 tiendas principales del país.",
    solicitante: "Lucía Fernández",
    sponsor: "Ernesto Ruiz",
    sponsorRole: "Director Canales",
    impactoTI: "Sí, proyecto tecnológico",
    sistemasInvolucrados: ["Aruba Networks", "Captive Portal"],
    beneficioEstimado: "$2.0M MXN / año",
    kpiEsperado: "+30% sesiones de app móvil en tienda física",
    madurez: 100,
    madurezTag: "Cerrada",
    esfuerzo: 40,
    impacto: 80,
    color: "#3b82f6",
  },
];

interface PriorizacionStore {
  initiatives: InitiativeItem[];
  selectedInitiativeId: string;
  setSelectedInitiativeId: (id: string) => void;
  saveEvaluation: (
    id: string,
    evalData: EvaluacionData,
    score: number,
    priority: "Alta" | "Media-Alta" | "Media" | "Baja",
    newStatus?: InitiativeItem["status"]
  ) => void;
  requestAdjustments: (id: string) => void;
  discardInitiative: (id: string) => void;
  sendToCommittee: (id: string) => void;
  confirmDecision: (
    id: string,
    decision: "priorizar" | "observacion" | "ajustes" | "descartar",
    prioridadFinal: "Alta" | "Media" | "Baja",
    justificacion: string,
    destino: string
  ) => void;
  addInitiative: (newItem: Partial<InitiativeItem> & { name: string; area: string }) => string;
}

export const usePriorizacionStore = create<PriorizacionStore>((set) => ({
  initiatives: DEFAULT_INITIATIVES,
  selectedInitiativeId: "prio-01",
  setSelectedInitiativeId: (id) => set({ selectedInitiativeId: id }),

  saveEvaluation: (id, evalData, score, priority, newStatus = "Lista") =>
    set((state) => ({
      initiatives: state.initiatives.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            score,
            priority,
            status: newStatus,
            madurez: Math.max(item.madurez, 80),
            madurezTag: "Evaluación completada",
            impacto: Math.min(100, Math.max(20, evalData.impactoNegocio * 20)),
            esfuerzo: Math.min(100, Math.max(20, evalData.complejidad * 20)),
            evaluacion: evalData,
          };
        }
        return item;
      }),
    })),

  requestAdjustments: (id) =>
    set((state) => ({
      initiatives: state.initiatives.map((item) =>
        item.id === id ? { ...item, status: "Con comentarios", madurezTag: "Ajustes solicitados" } : item
      ),
    })),

  discardInitiative: (id) =>
    set((state) => ({
      initiatives: state.initiatives.map((item) =>
        item.id === id ? { ...item, status: "Descartada", madurezTag: "Descartada" } : item
      ),
    })),

  sendToCommittee: (id) =>
    set((state) => ({
      initiatives: state.initiatives.map((item) =>
        item.id === id ? { ...item, status: "Lista", madurezTag: "Lista para comité", madurez: Math.max(item.madurez, 85) } : item
      ),
    })),

  confirmDecision: (id, decision, prioridadFinal, justificacion, destino) =>
    set((state) => ({
      initiatives: state.initiatives.map((item) => {
        if (item.id === id) {
          let newStatus: InitiativeItem["status"] = "En priorización";
          let newMadurezTag = "En priorización";
          let newMadurez = Math.max(item.madurez, 85);

          if (decision === "priorizar") {
            newStatus = "En priorización";
            newMadurezTag = "Priorizada";
            newMadurez = Math.max(item.madurez, 90);
          } else if (decision === "observacion") {
            newStatus = "En revisión";
            newMadurezTag = "En observación";
          } else if (decision === "ajustes") {
            newStatus = "Con comentarios";
            newMadurezTag = "Ajustes solicitados";
          } else if (decision === "descartar") {
            newStatus = "Descartada";
            newMadurezTag = "Descartada";
          }

          return {
            ...item,
            status: newStatus,
            priority: decision === "priorizar" ? prioridadFinal : item.priority,
            madurez: newMadurez,
            madurezTag: newMadurezTag,
            decision,
            prioridadFinal,
            justificacionDecision: justificacion,
            destinoDecision: destino,
          };
        }
        return item;
      }),
    })),

  addInitiative: (newItem) => {
    const id = newItem.id || `prio-${Date.now().toString(36)}`;
    const initiative: InitiativeItem = {
      id,
      name: newItem.name,
      area: newItem.area,
      status: newItem.status || "Nueva",
      score: newItem.score ?? null,
      priority: newItem.priority ?? null,
      creationDate: newItem.creationDate || "Hoy",
      description: newItem.description || "",
      solicitante: newItem.solicitante || "Argos Eyra Martínez Zeferino",
      sponsor: newItem.sponsor || "Carlos Méndez",
      sponsorRole: newItem.sponsorRole || "Sponsor Ejecutivo",
      impactoTI: newItem.impactoTI || "Sí, proyecto tecnológico",
      sistemasInvolucrados: newItem.sistemasInvolucrados || ["SAP", "API Core"],
      beneficioEstimado: newItem.beneficioEstimado || "$2.5M MXN / año",
      kpiEsperado: newItem.kpiEsperado || "Reducción de costos",
      madurez: newItem.madurez ?? 35,
      madurezTag: newItem.madurezTag || "Madurez inicial",
      esfuerzo: newItem.esfuerzo ?? 50,
      impacto: newItem.impacto ?? 70,
      color: newItem.color || "#e6007e",
    };
    set((state) => ({
      initiatives: [initiative, ...state.initiatives],
      selectedInitiativeId: id,
    }));
    return id;
  },
}));
