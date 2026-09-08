import { Injectable } from "@nestjs/common";
import { stageById } from "@devcycle/shared";

export interface ChatRequest {
  message: string;
  context?: { stageId?: string; subStepId?: string };
}

export interface ChatResponse {
  id: string;
  text: string;
  ts: string;
  suggestions?: string[];
}

const KEYWORD_RESPONSES: { keywords: string[]; text: string }[] = [
  {
    keywords: ["canvas", "idea"],
    text: "Para el Canvas de idea te recomiendo ser específico en 'Objetivo' y 'Problema a resolver': una frase que explique el beneficio de negocio y el dolor actual del usuario. ¿Quieres que te proponga un borrador con la información que ya tienes cargada?",
  },
  {
    keywords: ["estimacion", "estimación", "horas", "costo"],
    text: "Para la estimación preliminar, separa las horas por disciplina (Infraestructura, Desarrollo, UX, QA) y documenta al menos una alternativa. Así el Líder de Arquitectura y los Líderes Técnicos podrán dar su Vo.Bo. más rápido.",
  },
  {
    keywords: ["charter", "pep", "presupuesto"],
    text: "El Charter necesita folio y fecha de formalización antes de mandarlo a firma. El PEP se solicita después de que el Charter esté firmado; asegúrate de tener el monto presupuestado a la mano.",
  },
  {
    keywords: ["aprobar", "aprobación", "vobo", "vo.bo"],
    text: "Recuerda que cada paso de aprobación solo puede ejecutarlo el rol responsable (lo puedes ver en el badge del paso). Usa el selector 'Actuar como' en el encabezado para simular esa aprobación en este mockup.",
  },
  {
    keywords: ["archivo", "documento", "subir", "cargar"],
    text: "Puedes arrastrar tus documentos de descubrimiento a la zona de carga en la Etapa 0. En este mockup solo analizo el nombre del archivo para sugerirte en qué campo del Canvas te puede servir.",
  },
  {
    keywords: ["cierre", "pep", "capitalización"],
    text: "Antes de solicitar el cierre/baja del PEP, confirma que los pagos estén al 100% (lo valida un Líder Técnico). Si hay discrepancias, el flujo regresa automáticamente a 'Revisión y Gestión de Pagos'.",
  },
];

@Injectable()
export class AssistantService {
  reply(req: ChatRequest): ChatResponse {
    const lower = req.message.toLowerCase();
    const matched = KEYWORD_RESPONSES.find((entry) =>
      entry.keywords.some((k) => lower.includes(k)),
    );

    const stage = req.context?.stageId ? stageById(req.context.stageId) : undefined;

    let text = matched?.text;
    if (!text) {
      text = stage
        ? `Estás en la etapa "${stage.name}". Cuéntame qué campo o paso necesitas llenar y te doy una sugerencia; también puedo explicarte quién debe aprobar el siguiente paso.`
        : "Soy tu asistente de portafolio. Puedo ayudarte a llenar el Canvas, la estimación, el Charter/PEP o explicarte quién aprueba cada paso del flujo.";
    }

    return {
      id: `msg-${Date.now()}`,
      text,
      ts: new Date().toISOString(),
      suggestions: [
        "¿Quién debe aprobar este paso?",
        "Ayúdame a llenar este formulario",
        "¿Qué sigue después de este paso?",
      ],
    };
  }
}
